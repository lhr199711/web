<template>
    <div class="item-manage">
        <adt-search-folder
            :searchRouter="{ query: { label: search.label, examineStatus: search.examineStatus, useStatus: search.useStatus } }"
            :isStatus="true"
        >
            <template slot="status">
                <div class="status">
                    <Col span="10">
                        <div class="name">审核状态:</div>
                        <span
                            v-for="status in auditStatus"
                            :key="status.dictionaryKey"
                            :class="{ 'click-status': search.examineStatus === status.dictionaryKey }"
                            @click="chooseExamineStatus(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                    <Col span="14">
                        <div class="name">启用状态:</div>
                        <span
                            v-for="status in enableStatus"
                            :key="status.dictionaryKey"
                            :class="{ 'click-status': search.useStatus === status.dictionaryKey }"
                            @click="chooseUseStatus(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                </div>
            </template>
            <template slot="always-show">
                <Col class="form-item" span="6">
                    <span>数据项名称:</span>
                    <Input v-model="search.label" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="content">
            <div class="btns-paginator">
                <adt-button>
                    <Button @click="add()">
                        新增数据项
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-andaotongV3ICON_tianjia" />
                        </svg>
                    </Button>
                    <Button @click="startUsing(apiEnable, '', ...startAndStopData)">
                        {{ '批量启用' + (isManager ? '' : '申请') }}
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-shenqing" />
                        </svg>
                    </Button>
                    <Button @click="stopUsing(apiDisable, '', ...startAndStopData)">
                        {{ '批量停用' + (isManager ? '' : '申请') }}
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-shenqing" />
                        </svg>
                    </Button>
                </adt-button>
                <adt-paginator :currentPage="~~page" :total="~~total" />
            </div>
            <div class="public-table-data">
                <Table :columns="columns" :data="tableData" stripe @on-selection-change="selectionChange">
                    <template #createDatetime="{ row }">
                        {{ timestampFormat(row.createDatetime) }}
                    </template>
                    <!-- 审核状态 -->
                    <template #examineStatus="{ row }">
                        <span :class="{ 'success': row.examineStatus === 'pass', 'error': row.examineStatus === 'fail' }">
                            {{ row.examineStatusTranslate }}
                        </span>
                    </template>
                    <!-- 启用状态 -->
                    <template #useStatus="{ row }">
                        <span :class="{ 'success': row.useStatus === 'enable', 'error': row.useStatus === 'disable' }">
                            {{ row.useStatusTranslate }}
                        </span>
                    </template>
                    <template #action="{ row }">
                        <!-- 审核状态为待审核（wait），不显示启用停用按钮 -->
                        <span
                            v-if="(!row.useStatus || row.useStatus === 'disable') && row.examineStatus !== 'wait'"
                            class="icon-action icon-action-word"
                            title="启用"
                            @click="startUsing(apiEnable, row, ...startAndStopData)"
                        >启</span>
                        <span
                            v-if="(row.useStatus && row.useStatus === 'enable') && row.examineStatus !== 'wait'"
                            class="icon-action icon-action-word"
                            title="停用"
                            @click="stopUsing(apiDisable, row, ...startAndStopData)"
                        >停</span>
                        <span title="审核">
                            <svg
                                v-if="isManager && row.examineStatus === 'wait'"
                                class="icon-action iconfont"
                                aria-hidden="true"
                                @click="examine(row, 'name', 'version')"
                            >
                                <use xlink:href="#icon-andaotongV3ICON_shenhe" />
                            </svg>
                        </span>
                        <span v-if="row.useStatus !== 'enable'" title="编辑">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="edit(row)">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                            </svg>
                        </span>
                         <!-- 只有管理员才能删除 -->
                        <span v-if="isManager && row.useStatus !== 'enable'" title="删除">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="remove(row, 'name')">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-shanchu" />
                            </svg>
                        </span>
                        <span title="详情">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="detail(row)">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-xiangqing" />
                            </svg>
                        </span>
                    </template>
                </Table>
            </div>
        </div>
        <!-- 新增数据项modal -->
        <adt-my-modal
            okText="保存"
            width="650"
            :title="modalTitle"
            :showModal="isModalShow"
            @on-visible-change="addVisibleChange"
            @on-ok="save()"
            @on-cancel="cancel()"
        >
            <Form
                class="two-column"
                ref="formItemData"
                label-position="left"
                :model="formItem"
                :rules="formItemRule"
                :label-width="120"
                inline
                label-colon
            >
                <div v-if="!isAdd" class="edit-field">
                    <span class="name">数据项编号：</span>{{ editField }}
                </div>
                <FormItem v-else label="数据项编号" prop="name">
                    <Input v-model="formItem.name" clearable />
                </FormItem>
                <FormItem label="数据项名称" prop="label">
                    <Input v-model="formItem.label" clearable />
                </FormItem>
                <FormItem label="数据项分类" prop="itemType">
                    <Select v-model="formItem.itemType" clearable>
                        <Option v-for="item in itemType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="控件类型" prop="controlType">
                    <Select v-model="formItem.controlType" clearable>
                        <Option v-for="item in controlType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" prop="dataType">
                    <Select v-model="formItem.dataType" clearable>
                        <Option v-for="item in dataType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="数据最大长度" prop="maxLength">
                    <Input v-model="formItem.maxLength" clearable />
                </FormItem>
                <FormItem
                    :class="formItem.dataType === 'string' || !formItem.dataType ? '' : 'ivu-form-item-required'"
                    label="数据精度"
                    prop="accuracy"
                    :show-message="formItem.dataType === 'string' || !formItem.dataType ? false : true"
                >
                    <Input v-model="formItem.accuracy" clearable />
                </FormItem>
                <FormItem
                    :class="formItem.controlType === 'I' || !formItem.controlType ? '' : 'ivu-form-item-required'"
                    label="数据来源"
                    prop="source"
                    :show-message="formItem.controlType === 'I' || !formItem.controlType ? false : true"
                >
                    <Select v-model="formItem.source" clearable>
                        <Option v-for="item in dataSource" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem
                    :class="formItem.controlType === 'I' || !formItem.controlType ? '' : 'ivu-form-item-required'"
                    label="数据来源值"
                    prop="sourceValue"
                    :show-message="formItem.controlType === 'I' || !formItem.controlType ? false : true"
                >
                    <Input v-model="formItem.sourceValue" clearable />
                </FormItem>
                <FormItem label="备注规则" prop="note">
                    <Input v-model="formItem.note" type="textarea" style="width: 470px;" />
                </FormItem>
            </Form>
        </adt-my-modal>
        <!-- 审核modal -->
        <adt-my-modal
            width="600"
            :title="examineModalTitle"
            :showModal="isExamineModalShow"
            @on-visible-change="examineVisibleChange"
            @on-ok="examineSave(apiEnableExamPass, apiEnableExamFail, apiDisableExamPass, apiDisableExamFail)"
        >
            <RadioGroup v-model="agree" style="margin-bottom: 20px;">
                <Radio label="1">同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
                <Radio label="0" style="margin-left: 30px;">不同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
            </RadioGroup>
            <div v-show="agree === '0'">
                <div class="reason-name" style="margin-bottom: 6px;">填写驳回原因:</div>
                <Input v-model.trim="reason" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
        <!-- 删除modal -->
        <adt-my-modal
            :showModal="isActionDel"
            title="系统提示"
            @on-visible-change="visibleChange"
            @on-ok="confirmDel(apiDel)"
        >
            <div>
                <div style="margin-bottom: 6px;">填写删除原因:</div>
                <Input v-model.trim="delInfo.removeRsn" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
    import {
        apiTemplateDataQuery,
        apiTemplateDataAdd,
        apiTemplateDataEnable,
        apiTemplateDataDisable,
        apiTemplateDataEnableExamPass,
        apiTemplateDataEnableExamFail,
        apiTemplateDataDisableExamPass,
        apiTemplateDataDisableExamFail,
        apiDelTemplateData,
        apiUpdateTemplateData,
        apiTemplateDataQueryDetail
    } from '@/api/standard-mapper/dataItemManage'
    import validateRules from '@/libs/validateRules'
    import standardMapperList from '@/mixins/standardMapperList'
    import { columns, formItem } from './data'
    export default {
        name: 'ItemManage',
        mixins: [standardMapperList],
        props: {
            label: '',
            examineStatus: '',
            useStatus: ''
        },
        data () {
            return {
                itemType: this.$getDictionary('ITEM_TYPE'),
                controlType: this.$getDictionary('CONTROL_TYPE'),
                dataType: this.$getDictionary('DATA_TYPE'),
                dataSource: this.$getDictionary('DATA_SOURCE'),

                // （批量）启用（申请）、（批量）停用（申请）api，作为参数传到mixin
                // 操作员启用申请、管理员启用
                apiEnable: apiTemplateDataEnable,
                // 操作员停用申请、管理员停用
                apiDisable: apiTemplateDataDisable,
                // 后端需要的启用、停用字段
                startAndStopData: ['name', 'version', 'useStatus', 'examineStatus'],

                // 审核的api，作为参数传到mixin
                // 启用同意
                apiEnableExamPass: apiTemplateDataEnableExamPass,
                // 启用不同意
                apiEnableExamFail: apiTemplateDataEnableExamFail,
                // 停用同意
                apiDisableExamPass: apiTemplateDataDisableExamPass,
                // 停用不同意
                apiDisableExamFail: apiTemplateDataDisableExamFail,

                // 删除的api，作为参数传到mixin
                apiDel: apiDelTemplateData,

                // 传到mixin
                name: '数据项',
                search: {
                    label: this.label,
                    examineStatus: this.examineStatus,
                    useStatus: this.useStatus
                },
                // 新增form信息
                tableData: [],
                columns,
                formItem,
                formItemRule: {
                    name: [
                        validateRules.required('数据项编号')[0],
                        { pattern: /^[a-z_]*$/, message: '只能输入小写字母和_' }
                    ],
                    label: [
                        validateRules.required('数据项名称')[0]
                        // { pattern: /^[\u4E00-\u9FA5]+$/, message: '只能输入中文' }
                    ],
                    itemType: [
                        validateRules.select('数据项分类')[0]
                    ],
                    controlType: [
                        validateRules.select('控件类型')[0]
                    ],
                    dataType: [
                        validateRules.select('数据类型')[0]
                    ],
                    maxLength: [
                        validateRules.required('数据最大长度')[0],
                        {pattern: /^[0-9]*$/, message: '只能输入数字'}
                    ]
                }
            }
        },
        methods: {
            // 获取列表数据
            getData () {
                const data = {
                    page: this.page,
                    ...this.search
                }
                apiTemplateDataQuery({ data }).then(({ data }) => {
                    this.tableData = data.content || []
                    this.total = data.totalElements
                })
            },
            // 修改数据项
            edit (row) {
                this.isAdd = false
                // 展示的字段
                this.editField = row.name
                const params = { name: row.name }
                apiTemplateDataQueryDetail(params).then(({ data }) => {
                    this.formItem = data
                    // 将Number类型转换成String类型，代码校验只能校验String类型
                    this.formItem.maxLength = this.formItem.maxLength + ''
                    this.isModalShow = true
                    this.modalTitle = '编辑数据项'
                })
            },
            // 详情
            detail (row) {
                this.$router.push(`/standard-mapper/item-manage/detail/${row.name}`)
            },
            // 保存数据项
            save () {
                const vm = this
                // 控件类型不为输入框，数据来源吧和数据来源值是必填的
                if (this.formItem.controlType !== 'I') {
                    this.formItemRule.source = validateRules.select('数据来源')
                    this.formItemRule.sourceValue = validateRules.select('数据来源值')
                } else {
                    this.formItemRule.source = []
                    this.formItemRule.sourceValue = []
                }
                // 数据类型为字符串，数据精度非必填项
                if (this.formItem.dataType !== 'string') {
                    this.formItemRule.accuracy = validateRules.required('数据精度')
                } else {
                    this.formItemRule.accuracy = []
                }
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        const data = { ...this.formItem }
                        // 新增保存
                        if (this.isAdd) {
                            apiTemplateDataAdd({ data }).then(res => {
                                successCallback()
                                this.getData()
                            })
                        } else {
                            data.name = this.editField
                            // 编辑保存
                            apiUpdateTemplateData({ data }).then(res => {
                                successCallback()
                            })
                        }
                    }
                })
                function successCallback () {
                    vm.$Message.info("保存成功")
                    // 重置表单数据
                    vm.$refs.formItemData.resetFields()
                    // 隐藏新增模态框
                    vm.isModalShow = false
                    // 刷新列表
                    vm.getData()
                }
            }
        }
    }
</script>
