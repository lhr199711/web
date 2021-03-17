<template>
    <div class="basic-task">
        <adt-search-folder
            :searchRouter="{ query: { taskCode: search.taskCode, taskName: search.taskName, trspType: search.trspType, examineStatus: search.examineStatus, useStatus: search.useStatus } }"
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
                    <span>基础任务编号:</span>
                    <Input v-model="search.taskCode" clearable />
                </Col>
                <Col class="form-item" span="6">
                    <span>基础任务名称:</span>
                    <Input v-model="search.taskName" clearable />
                </Col>
                <Col class="form-item" span="6">
                    <span style="text-align: right; margin-right: 10px;">运输类型:</span>
                    <Select v-model="search.trspType" clearable>
                        <Option v-for="item in transportType" :key="item.dictionaryKey" :value="item.dictionaryKey">{{item.dictionaryValue}}</Option>
                    </Select>
                </Col>
            </template>
        </adt-search-folder>
        <div class="content">
            <div class="btns-paginator">
                <adt-button>
                    <Button @click="add()">
                        新增基础任务
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
                        {{  timestampFormat(row.createDatetime) }}
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
                                @click="examine(row, 'taskCode', 'version')"
                            >
                                <use xlink:href="#icon-andaotongV3ICON_shenhe" />
                            </svg>
                        </span>
                        <!-- <span v-if="row.useStatus !== 'enable'" title="编辑">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="edit(row)">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                            </svg>
                        </span> -->
                        <!-- 只有管理员才能删除 -->
                        <!-- <span v-if="isManager && row.useStatus !== 'enable'" title="删除">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="remove(row, 'taskCode')">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-shanchu" />
                            </svg>
                        </span> -->
                        <span title="详情">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="detail(row)">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-xiangqing" />
                            </svg>
                        </span>
                    </template>
                </Table>
            </div>
        </div>
        <!-- 新增基础任务modal -->
        <adt-my-modal
            okText="保存"
            width="70%"
            :title="modalTitle"
            :showModal="isModalShow"
            @on-visible-change="addVisibleChange"
            @on-ok="save()"
            @on-cancel="cancel()"
        >
            <Form
                class="two-column"
                ref="formItemData"
                :model="formItem"
                :rules="formItemRule"
                :label-width="120"
                inline
                label-colon
            >
                <div v-if="!isAdd" class="edit-field">
                    <span class="name">基础任务编号：</span>{{ editField }}
                </div>
                <FormItem label="基础任务名称" prop="taskName">
                    <Input v-model="formItem.taskName" maxlength="10" clearable />
                </FormItem>
                <FormItem label="物流类型" prop="logisticsType">
                    <Select v-model="formItem.logisticsType" clearable>
                        <Option v-for="item in logisticsType" :key="item.dictionaryKey" :value="item.dictionaryKey">{{item.dictionaryValue}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="运输类型" prop="trspType">
                    <Select v-model="formItem.trspType" clearable>
                        <Option v-for="item in transportType" :key="item.dictionaryKey" :value="item.dictionaryKey">{{item.dictionaryValue}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div class="line"></div>
            <div class="item-title">
                <span>选择数据项</span>
                <Button type="primary" @click="previewSort()">排序预览</Button>
            </div>
            <Table
                max-height="440"
                :columns="itemColumns"
                :data="itemTableData"
                stripe
                @on-selection-change="itemSelectionChange"
            >
                <template #sort="{ row, index }">
                    <div style="position: relative;">
                        <span class="required-tag">*</span>
                        <Input v-model.trim="row.sort" clearable @on-change="changeRowData(row, index, 'sort')" />
                    </div>
                </template>
                <!-- 关联数据项来自当前任务选中的数据项 -->
                <template #relationData="{ row, index }">
                    <Select v-model="row.relationData" clearable @on-change="changeRowData(row, index, 'relationData')">
                        <Option
                            v-for="item in selectedData"
                            :key="item.dataCode"
                            :value="item.dataCode"
                            :disabled="row.dataCode === item.dataCode ? true : false"
                        >
                        {{ item.dataName }}
                    </Option>
                    </Select>
                </template>
                <template #isMore="{ row, index }">
                    <Select v-model="row.isMore" @on-change="changeRowData(row, index, 'isMore')" clearable>
                        <Option v-for="item in yesOrNo" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </template>
                <template #isEdit="{ row, index }">
                    <Select v-model="row.isEdit" @on-change="changeRowData(row, index, 'isEdit')" clearable>
                        <Option v-for="item in yesOrNo" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </template>
                <template #isShow="{ row, index }">
                    <Select v-model="row.isShow" @on-change="changeRowData(row, index, 'isShow')" clearable>
                        <Option v-for="item in yesOrNo" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </template>
                <template #rules="{ row, index }">
                    <Select v-model="row.rules" @on-change="changeRowData(row, index, 'rules')" multiple clearable>
                        <Option v-for="item in verificationRule" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </template>
                <template #action="{ row, index }">
                    <Button size="small" type="primary" ghost @click="enterInfo(row, index)">录入提示信息</Button>
                </template>
            </Table>
        </adt-my-modal>
        <!-- 录入提示信息modal -->
        <adt-my-modal
            title="录入提示信息"
            :showModal="isEnterInfoModalShow"
            @on-visible-change="enterInfoVisibleChange"
            @on-ok="enterInfoSave()"
        >
            <div class="content" style="margin: 0 20px;">
                <div style="margin-bottom: 6px;">填写提示信息：</div>
                <Input v-model="prompt" type="textarea" placeholder="请输入内容" :autosize="{minRows: 6}" />
            </div>
        </adt-my-modal>
        <!-- 排序预览modal -->
        <adt-my-modal
            title="预览数据项排序"
            :showModal="isPreviewModalShow"
            :showCancelBtn="false"
            @on-visible-change="previewVisibleChange"
            @on-ok="previewSave()"
        >
            <Table :columns="previewColumns" :data="previewTableData" stripe />
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
            @on-ok="confirmDel()"
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
        apiBasicTaskQuery,
        apiBasicTaskAdd,
        apiBasicTaskEnable,
        apiBasicTaskDisable,
        apiBasicTaskEnableExamPass,
        apiBasicTaskEnableExamFail,
        apiBasicTaskDisableExamPass,
        apiBasicTaskDisableExamFail,
        apiQueryEnableData,
        apiDelBasicTask,
        apiUpdateBasicTask,
        apiBasicTaskQueryDetail
    } from '@/api/standard-mapper/basicTask'
    import validateRules from '@/libs/validateRules'
    import { isRepeat } from '@/libs/utils'
    import standardMapperList from '@/mixins/standardMapperList'
    import { formItem, basicTaskColumns as columns, itemColumns, previewColumns } from './data'
    export default {
        name: 'BasicTask',
        mixins: [standardMapperList],
        props: {
            taskCode: '',
            taskName: '',
            trspType: '',
            examineStatus: '',
            useStatus: ''
        },
        data () {
            return {
                // 运输类型
                transportType: this.$getDictionary('TRANSPORT_TYPE'),
                // 物流类型
                logisticsType: this.$getDictionary('LOGISTICS_TYPE'),
                // 校验规则
                verificationRule: this.$getDictionary('VERIFICATION_RULE'),
                // 是否
                yesOrNo: this.$getDictionary('Y_N'),

                // （批量）启用（申请）、（批量）停用（申请）api，作为参数传到mixin
                // 操作员启用申请、管理员启用
                apiEnable: apiBasicTaskEnable,
                // 操作员停用申请、管理员停用
                apiDisable: apiBasicTaskDisable,
                // 后端需要的启用、停用字段
                startAndStopData: ['taskCode', 'version', 'useStatus', 'examineStatus'],

                // 审核的api，作为参数传到mixin
                // 启用同意
                apiEnableExamPass: apiBasicTaskEnableExamPass,
                // 启用不同意
                apiEnableExamFail: apiBasicTaskEnableExamFail,
                // 停用同意
                apiDisableExamPass: apiBasicTaskDisableExamPass,
                // 停用不同意
                apiDisableExamFail: apiBasicTaskDisableExamFail,

                // 删除的api，作为参数传到mixin
                apiDel: apiDelBasicTask,

                // 传到mixin
                name: '基础任务',
                search: {
                    taskCode: this.taskCode,
                    taskName: this.taskName,
                    trspType: this.trspType,
                    examineStatus: this.examineStatus,
                    useStatus: this.useStatus
                },
                isEnterInfoModalShow: false,
                isPreviewModalShow: false,
                // 新增form信息
                formItem,
                formItemRule: {
                    taskName: [
                        validateRules.required('基础任务名称')[0]
                    ],
                    logisticsType: [
                        validateRules.select('物流类型')[0]
                    ],
                    trspType: [
                        validateRules.select('运输类型')[0]
                    ]
                },
                // 如果不写默认值，表单重置后，表单校验会出问题
                tableData: [],
                columns,
                // 数据项
                itemTableData: [],
                itemColumns,
                // 预览
                previewTableData: [],
                previewColumns,
                // modal数据项选中的值
                selectedData: [],
                // 录入提示信息row
                enterInfoRow: '',
                // 录入提示信息index
                enterInfoIndex: '',
                // 提示信息
                prompt: ''
            }
        },
        methods: {
            itemSelectionChange (selectedData) {
                this.selectedData = selectedData
            },
            enterInfoVisibleChange (changeStatus) {
                this.isEnterInfoModalShow = changeStatus
            },
            previewVisibleChange (changeStatus) {
                this.isPreviewModalShow = changeStatus
            },
            // 获取基础任务列表数据
            getData () {
                const data = {
                    page: this.page,
                    ...this.search
                }
                apiBasicTaskQuery({ data }).then(res => {
                    this.tableData = res.data.content || []
                    this.tableData.forEach(item => {
                        item.controlType === 'text'? item.controlType = '文本框': item.controlType = '下拉框'
                        item.dataType === 'string'? item.dataType = '字符串': item.dataType = '数字'
                    })
                    this.total = res.data.totalElements
                })
            },
            // 新增基础任务
            async add () {
                await this.getItemData()
                this.isAdd = true
                this.isModalShow = true
                this.modalTitle = '新增基础任务'
            },
            // 取消新增,重置数据
            cancel () {
                this.$refs.formItemData.resetFields()
                // 重置选中的数据项
                this.selectedData = []
            },
            // 修改基础任务
            async edit (row) {
                await this.getItemData()
                this.isAdd = false
                // 展示的字段
                this.editField = row.taskCode
                const params = { taskCode: row.taskCode }
                apiBasicTaskQueryDetail(params).then(({ data }) => {
                    // 返显选中的数据项
                    for (const index in this.itemTableData) {
                        for (const selectedItem of data.taskDatas) {
                            if (this.itemTableData[index].dataCode === selectedItem.dataCode) {
                                selectedItem._checked = true
                                this.$set(this.itemTableData, index, selectedItem)
                                break
                            }
                        }
                    }
                    this.selectedData = data.taskDatas
                    // 反显基础任务数据
                    this.formItem = data
                    this.isModalShow = true
                    this.modalTitle = '编辑基础任务'
                })
            },
            // 详情
            detail (row) {
                this.$router.push(`/standard-mapper/basics-task/detail/${row.taskCode}`)
            },
            // 获取数据项数据
            getItemData () {
                return new Promise(resolve => {
                    apiQueryEnableData().then(({ data }) => {
                        this.itemTableData = data
                        resolve()
                    })
                })
            },
            // 数据项发生改变
            changeRowData (row, index, key) {
                // 将改行改变后的数据更新到accountData，后续选中才有数据
                this.itemTableData[index] = row
                // 先选中，再选择帐户类型，需要手动改变选中的帐户的帐户类型
                for (const item of this.selectedData) {
                    if (item.dataCode === row.dataCode) {
                        // 排序值在后面的排序要用到，要转换成Number类型，不然字符串之间比较大小会出错
                        if (key === 'sort') {
                            // Number(row[key])可能会被转换成NaN
                            item[key] = Number(row[key])
                        } else {
                            item[key] = row[key]
                        }
                        break
                    }
                }
            },
            // 保存
            save () {
                const vm = this
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        if (!this.verifyItem()) return
                        const data = { ...this.formItem }
                        data.datas = this.selectedData
                        // 新增保存
                        if (this.isAdd) {
                            apiBasicTaskAdd({ data }).then(res => {
                                successCallback()
                            })
                        } else {
                            // 删除重复的数据项数据
                            delete data.taskDatas
                            data.taskCode = this.editField
                            // 编辑保存
                            apiUpdateBasicTask({ data }).then(res => {
                                successCallback()
                            })
                        }
                    }
                })
                function successCallback () {
                    vm.$Message.info("保存成功")
                    // 重置表单数据
                    vm.$refs.formItemData.resetFields()
                    // 重置选中的数据项
                    vm.selectedData = []
                    // 隐藏新增模态框
                    vm.isModalShow = false
                    // 刷新列表
                    vm.getData()
                }
            },
            enterInfo (row, index) {
                this.enterInfoRow = row
                this.enterInfoIndex = index
                this.prompt = row.message
                this.isEnterInfoModalShow = true
            },
            // 录入提示信息确定
            enterInfoSave () {
                this.$set(this.itemTableData[this.enterInfoIndex], 'message', this.prompt)
                // 先选中，再选择帐户类型，需要手动改变选中的帐户的帐户类型
                for (const item of this.selectedData) {
                    if (item.dataCode === this.enterInfoRow.dataCode) {
                        item.message = this.enterInfoRow.message
                        break
                    }
                }
                this.isEnterInfoModalShow = false
            },
            previewSave () {
                this.isPreviewModalShow = false
            },
            // 排序预览
            previewSort () {
                if (!this.verifyItem()) return
                this.previewTableData = this.selectedData
                this.isPreviewModalShow = true
            },
            // 新增任务保存、预览排序校验
            verifyItem () {
                // 至少选择一个数据项
                // 没有这个需求
                // if (!this.selectedData.length) {
                //     this.$Message.warning('请至少选择一个数据项！')
                //     return false
                // }
                const sort = []
                for (const item of this.selectedData) {
                    // 勾选的数据项的排序值必填
                    // 排序值可能会被转换成NaN
                    if (!item.sort && !Number.isNaN(item.sort)) {
                        this.$Message.warning('选中的数据项的排序值必填！')
                        return false
                    }
                    // 排序值只能是正整数
                    if (!/^\d+$/.test(item.sort)) {
                        this.$Message.warning('排序值只能是整数！')
                        return
                    }
                    // 勾选的数据项的关联数据项不是是它本身
                    if (item.dataCode === item.relationData) {
                        this.$Message.warning('选中的数据项的关联数据项不是是它本身！')
                        return false
                    }
                    sort.push(item.sort)
                }
                // 勾选的数据项的排序值不能重复
                if (isRepeat(sort)) {
                    this.$Message.warning('选中的数据项的排序值不能重复！')
                    return false
                }
                return true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .line {
        border-top: 1px dashed $border-color;
        margin-bottom: 20px;
    }
    .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
    }
    .required-tag {
        position: absolute;
        left: -10px;
        z-index: 10;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-family: SimSun;
        color: #ff001b;
    }
</style>
