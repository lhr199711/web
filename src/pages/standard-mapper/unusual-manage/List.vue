<template>
    <div class="data-source-manage">
        <adt-search-folder
            :searchRouter="{ query: { sourceCode: search.sourceCode, sourceName: search.sourceName, db: search.db, examineStatus: search.examineStatus, useStatus: search.useStatus } }"
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
                    <span>异常编号:</span>
                    <Input v-model="search.sourceCode" clearable />
                </Col>
                <Col class="form-item" span="6">
                    <span>异常名称:</span>
                    <Input v-model="search.sourceName" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="content">
            <div class="btns-paginator">
                <adt-button>
                    <Button @click="add()">
                        新增异常
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-andaotongV3ICON_tianjia" />
                        </svg>
                    </Button>
                    <Button @click="startUsing()">
                        {{ '批量启用' + (isManager ? '' : '申请') }}
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-shenqing" />
                        </svg>
                    </Button>
                    <Button @click="stopUsing()">
                        {{ '批量停用' + (isManager ? '' : '申请') }}
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-shenqing" />
                        </svg>
                    </Button>
                </adt-button>
                <adt-paginator :currentPage="~~page" :total="~~total" />
            </div>
            <div class="public-table-data">
                <Table
                    :columns="columns"
                    :data="tableData"
                    stripe
                    @on-selection-change="selectionChange"
                >
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
                        <span v-if="isManager && row.useStatus !== 'enable'" title="删除">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="remove(row, 'taskCode')">
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
        <!-- 新增异常modal -->
        <adt-my-modal
            okText="保存"
            width="1500"
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
                inline
                label-colon
            >
                    <FormItem label="异常名称" prop="sourceType" :label-width="82">
                        <Input v-model="formItem.sourceType" maxlength="10" clearable />
                    </FormItem>
                    <FormItem label="适用场景" prop="bm" :label-width="120">
                        <Select v-model="formItem.bm" clearable>
                            <Option v-for="item in itemType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                {{ item.dictionaryValue }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="异常处理方式" prop="xx" :label-width="150">
                        <Select v-model="formItem.xx" clearable>
                            <Option v-for="item in itemType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                {{ item.dictionaryValue }}
                            </Option>
                        </Select>
                    </FormItem>
                    <div class="compare-data">
                        <title>异常比对数据：</title>
                        <div class="data-container">
                            <div class="data">
                                <div class="data-item">
                                    <FormItem label="异常数据源" prop="dataSource" :label-width="105">
                                        <Select v-model="formItem.dataSource" clearable>
                                            <Option v-for="item in itemType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </div>
                                <div class="data-item">
                                    <FormItem label="数据显示名称" prop="displayName" :label-width="130">
                                        <Select v-model="formItem.displayName" clearable>
                                            <Option v-for="item in itemType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </div>
                            </div>
                            <div class="condition">
                                <FormItem label="异常比对条件" prop="condition" :label-width="120">
                                    <Select v-model="formItem.condition" clearable>
                                        <Option v-for="item in itemType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                            {{ item.dictionaryValue }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </div>
                            <div class="data">
                                <div class="data-item">
                                    <FormItem label="异常数据源" prop="dataSource" :label-width="105">
                                        <Select v-model="formItem.dataSource" clearable>
                                            <Option v-for="item in itemType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </div>
                                <div class="data-item">
                                    <FormItem label="数据显示名称" prop="displayName" :label-width="130">
                                        <Select v-model="formItem.displayName" clearable>
                                            <Option v-for="item in itemType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="contact-scene">
                        <title><span class="required-tag">*</span>异常处理关联场景：</title>
                        <div class="scenes">
                            <FormItem prop="chosenScenes">
                                <CheckboxGroup v-model="formItem.chosenScenes" class="checkobox-group">
                                    <div v-for="(item, index) in scenes" :key="index" class="checkbox-items">
                                        <Checkbox :label="item">{{ '' }}</Checkbox>
                                        <div class="scene-name" @click="handleClickScene(index)">{{ item }}</div>
                                    </div>
                                </CheckboxGroup>
                            </FormItem>
                        </div>
                    </div>
                    <div class="form-item notice-content">
                        <div class="name">通知内容:</div>
                        <Input v-model.trim="formItem.noticeContent" type="textarea" placeholder="请输入内容..." style="width: 100%;" />
                    </div>
            </Form>
            <div class="form-item">
                <div class="name">备注信息:</div>
                <Input v-model.trim="formItem.note" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
        <!-- 审核modal -->
        <adt-my-modal
            width="600"
            :title="examineModalTitle"
            :showModal="isExamineModalShow"
            @on-visible-change="examineVisibleChange"
            @on-ok="examineSave()"
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
        apiQueryUnusual,
        apiAddUnusual,
        apiEnableUnusual,
        apiDisableUnusual,
        apiEnableExamPassUnusual,
        apiEnableExamFailUnusual,
        apiDisableExamPassUnusual,
        apiDisableExamFailUnusual,
        apiDelUnusual
    } from '@/api/standard-mapper/unusualManage'
    import validateRules from '@/libs/validateRules'
    import { isRepeat } from '@/libs/utils'
    import standardMapperList from '@/mixins/standardMapperList'
    import { columns } from './data'
    export default {
        name: 'UnusualManage',
        mixins: [standardMapperList],
        props: {
            sourceCode: '',
            sourceName: '',
            examineStatus: '',
            useStatus: ''
        },
        data () {
            return {
                itemType: this.$getDictionary('ITEM_TYPE'),
                name: '异常',
                search: {
                    sourceCode: this.sourceCode,
                    sourceName: this.sourceName,
                    examineStatus: this.examineStatus,
                    useStatus: this.useStatus
                },
                tableData: [
                    {
                        sourceName: 'name'
                    }
                ],
                columns,
                // 新增form信息
                formItem: {
                    sourceType: '',
                    bm: '',
                    noticeContent: '',
                    note: '',
                    chosenScenes: []
                },
                formItemRule: {
                    sourceType: [
                        validateRules.required('异常名称')[0]
                    ],
                    bm: [
                        validateRules.select('适用场景')[0]
                    ],
                    xx: [
                        validateRules.select('异常处理方式')[0]
                    ],
                    dataSource: [
                        validateRules.select('异常数据源')[0]
                    ],
                    displayName: [
                        validateRules.select('数据显示名称')[0]
                    ],
                    condition: [
                        validateRules.select('异常比对条件')[0]
                    ],
                    chosenScenes: [
                        validateRules.minMultipleChoice('异常处理关联场景')[0]
                    ]
                },
                scenes: ['场景1', '场景2', '场景2', '场景2'],
                chosenScenes: []

            }
        },
        methods: {
            getData () {
                const data = {
                    page: this.page,
                    ...this.search
                }
                apiQueryUnusual({ data }).then(({ data }) => {
                    this.tableData = data.content || []
                    this.total = data.totalElements
                })
            },
            // 取消新增,重置数据
            cancel () {
                this.$refs.formItemData.resetFields()
                this.reset()
            },
            // 操作员启用申请、管理员启用
            // Unusual: 批量操作为undefined,单个操作为产品信息
            startUsing (Unusual) {
                const data = this.handleRequestData(Unusual)
                // 批量操作，没有选择异常
                if (!data.length) return
                apiEnableUnusual({ data }).then(res => {
                    this.$Message.info(res.message)
                    this.getData()
                })
            },
            // 操作员停用申请、管理员停用
            // Unusual: 批量操作为undefined,单个操作为产品信息
            stopUsing (Unusual) {
                const data = this.handleRequestData(Unusual)
                // 批量操作，没有选择异常
                if (!data.length) return
                apiDisableUnusual({ data }).then(res => {
                    this.$Message.info(res.message)
                    this.getData()
                })
            },
            // 修改异常
            edit (row) {
                this.isAdd = false
                const params = { name: row.name }
                getQueryUnusual(params).then(res => {
                    this.formItem = res.data
                    this.formItem.maxLength = this.formItem.maxLength.toString()
                    this.formItem.rules = res.data.rules || []
                    this.isModalShow = true
                    this.modalTitle = '编辑异常'
                })
            },
            // 详情
            detail (row) {
                this.$router.push(`/standard-mapper/unusual-manage/detail/${row.name}`)
            },
            confirmDel () {
                apiDelUnusual({ data: this.delInfo }).then(res => {
                    this.$Message.info(res.message)
                    // 隐藏模态框
                    this.isActionDel = false
                    // 重新获取列表数据
                    this.getData()
                })
            },
            // 保存异常
            save () {
                const vm = this
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        const data = { ...this.formItem }
                        data.datas = this.selectedData
                        // 新增保存
                        if (this.isAdd) {
                            apiAddUnusual({ data }).then(res => {
                                successCallback()
                            })
                        } else {
                            // 编辑保存
                            apiUpdateUnusual({ data }).then(res => {
                                successCallback()
                            })
                        }
                    }
                })
                function successCallback () {
                    vm.$Message.info("保存成功")
                    // 重置表单数据
                    vm.$refs.formItemData.resetFields()
                    // 重置
                    vm.reset()
                    // 隐藏新增模态框
                    vm.isModalShow = false
                    // 刷新列表
                    vm.getData()
                }
            },
            // 确认审核
            examineSave () {
                const data = { ...this.examineInfo }
                // 启用审核
                if (this.examineType === 1) {
                    // 同意
                    if (this.agree === '1') {
                        apiEnableExamPassUnusual({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isExamineModalShow = false
                            this.getData()
                        })
                    } else {
                        if (!this.reason) {
                            this.$Message.warning('请填写驳回原因！')
                            return
                        }
                        data.message = this.reason
                        // 不同意
                        apiEnableExamFailUnusual({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isExamineModalShow = false
                            this.getData()
                        })
                    }
                } else {
                    // 停用审核
                    // 同意
                    if (this.agree === '1') {
                        apiDisableExamPassUnusual({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isExamineModalShow = false
                            this.getData()
                        })
                    } else {
                        if (!this.reason) {
                            this.$Message.warning('请填写输入驳回原因！')
                            return
                        }
                        data.message = this.reason
                        // 不同意
                        apiDisableExamFailUnusual({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isExamineModalShow = false
                            this.getData()
                        })
                    }
                }
            },
            // 重置数据
            reset () {
            }
        }
    }
</script>

<style lang="scss" scoped>
    title {
        display: block;
    }
    /deep/ .ivu-form-item {
        margin-right: 0;
    }
    .ivu-modal .two-column {
        .ivu-input-wrapper, .ivu-select {
            width: 160px;
        }
    }
    .form-item {
        display: flex;
        margin-top: 20px;
        &.notice-content {
            padding-bottom: 20px;
            border-bottom: 1px solid $border-color;
        }
        .name {
            width: 75px;
            margin-top: 6px;
        }
    }
    .compare-data {
        padding: 20px 0 30px 0;
        border-top: 1px solid $border-color;
        border-bottom: 1px solid $border-color;
        title {
            margin-bottom: 20px;
        }
        .ivu-form-item {
            margin-bottom: 0;
        }
        .data-container {
            display: flex;
            .data {
                display: flex;
                align-items: center;
                height: 52px;
                padding-right: 10px;
                background-color: $filling-color;
            }
        }
        .condition {
            margin: 9px 30px 0 20px;
        }
    }
    .contact-scene {
        display: flex;
        padding-top: 20px;
        border-bottom: 2px dashed $border-color;
        title {
            position: relative;
            flex-shrink: 0;
            width: 140px;
        }
        .required-tag {
            line-height: 24px;
        }
        /deep/ .ivu-form-item-content {
            line-height: inherit;
        }
        .checkobox-group {
            display: flex;
            flex-wrap: wrap;
            .checkbox-items {
                display: flex;
                align-items: center;
                margin-right: 30px;
                .scene-name {
                    cursor: pointer;
                }
            }
        }
    }
</style>
