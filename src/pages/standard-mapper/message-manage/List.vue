<template>
    <div>
        <adt-search-folder
        :searchRouter="{ query: search }"
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
                            :class="{ 'click-status': search.templateStatus === status.dictionaryKey }"
                            @click="chooseUseStatus(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                </div>
            </template>
            <template slot="always-show">
                <Col span="6" class="form-item">
                    <span>消息编号:</span>
                    <Input v-model="search.messageCode" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span>消息名称:</span>
                    <Input v-model="search.messageName" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span>业务环节:</span>
                    <Select v-model="search.businessType" clearable>
                        <Option v-for="item in businessTypeData" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </Col>
            </template>
        </adt-search-folder>
        <!-- 新增按钮 -->
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="add()">
                    新增消息
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
            </AdtButton>
            <adt-paginator :currentPage="~~page" :total="~~total"/>
        </div>
        <!-- 表格 -->
        <div class="public-table-data">
            <Table
                :columns="tableColumns"
                :data="tableData"
                stripe
                @on-selection-change="selectionChange"
            >
                <!-- 审核状态 -->
                <template #examineStatus="{ row }">
                    <span :class="{ 'success': row.examineStatus === 'pass', 'error': row.examineStatus === 'fail' }">
                        {{ row.examineStatusTranslate }}
                    </span>
                </template>
                <!-- 启用状态 -->
                <template #templateStatus="{ row }">
                    <span :class="{ 'success': row.templateStatus === 'enable', 'error': row.templateStatus === 'disable' }">
                        {{ row.templateStatusTranslate }}
                    </span>
                </template>
                <template #action="{ row }">
                    <span
                        v-if="(!row.templateStatus || row.templateStatus === 'disable') && row.examineStatus !== 'wait'"
                        class="icon-action icon-action-word"
                        title="启用"
                        @click="startUsing(row)"
                    >启</span>
                    <span
                        v-if="(row.templateStatus && row.templateStatus === 'enable') && row.examineStatus !== 'wait'"
                        class="icon-action icon-action-word"
                        title="停用"
                        @click="stopUsing(row)"
                    >停</span>
                    <span title="审核">
                        <!-- 如果是管理员并且审核状态为待审核的展示审核按钮 -->
                        <svg
                            v-if="isManager && row.examineStatus === 'wait'"
                            class="icon-action iconfont"
                            aria-hidden="true"
                            @click="examine(row)"
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
                    <span v-if="isManager && row.templateStatus !== 'enable'" title="删除">
                        <svg class="icon-action iconfont" aria-hidden="true" @click="remove(row)">
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
        <!-- 新增弹框 -->
        <AdtMyModal
            :title="'创建消息'"
            :showModal="isModalShow"
            okText="保存"
            cancelText="取消"
            width="650"
            @on-visible-change="addvisibleChange"
            @on-ok="saveAdd()"
            @on-cancel="cancelAdd()"
        >
            <div>
                <Form
                    ref="addFormRef"
                    class="fromItem"
                    label-colon
                    :model="addFormItem"
                    :rules="addFormRule"
                    :label-width="100"
                >
                    <Row>
                        <Col span="12">
                            <FormItem label="消息名称" prop="messageName">
                                <Input class="fromItem-content" v-model="addFormItem.messageName" maxlength="10" />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="业务环节" prop="businessType">
                                <Select v-model="addFormItem.businessType" clearable>
                                    <Option v-for="item in businessTypeData" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                        {{ item.dictionaryValue }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="消息内容" prop="messageContent">
                        <Input type="textarea" v-model="addFormItem.messageContent" maxlength="500" />
                    </FormItem>
                    <FormItem label="备注信息">
                        <Input type="textarea" v-model="addFormItem.remark" maxlength="500" />
                    </FormItem>
                </Form>
            </div>
        </AdtMyModal>
        <!-- 编辑弹框 -->
        <AdtMyModal
            :title="'编辑消息'"
            :showModal="isEditModalShow"
            okText="保存"
            cancelText="取消"
            width="650"
            @on-visible-change="editvisibleChange"
            @on-ok="saveEdit()"
            @on-cancel="cancelEdit()"
        >
            <div>
                <Form
                    ref="editFormRef"
                    class="fromItem"
                    label-colon
                    :model="editFormItem"
                    :rules="editFormRule"
                    :label-width="100"
                >
                    <div class="edit-field">
                        <span class="name" style="width: 100px;">消息编号：</span>{{ messageEditCode }}
                    </div>
                    <Row>
                        <Col span="12">
                            <FormItem label="消息名称" prop="messageName">
                                <Input class="fromItem-content" v-model="editFormItem.messageName" maxlength="10" />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="业务环节" prop="businessType">
                                <Select v-model="editFormItem.businessType" clearable>
                                    <Option v-for="item in businessTypeData" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                        {{ item.dictionaryValue }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="消息内容" prop="messageContent">
                        <Input type="textarea" v-model="editFormItem.messageContent" maxlength="500" />
                    </FormItem>
                    <FormItem label="备注信息">
                        <Input type="textarea" v-model="editFormItem.remark" maxlength="500" />
                    </FormItem>
                </Form>
            </div>
        </AdtMyModal>
        <!-- 消息审核 -->
        <adt-my-modal
            :title="examineModalTitle"
            :showModal="isAuditShow"
            @on-visible-change="auditvisibleChange"
            @on-ok="saveAudit()"
            width="600">
            <RadioGroup v-model="agree" style="margin-bottom: 20px;">
                <Radio label="1">同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
                <Radio label="0" style="margin-left: 30px;">不同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
            </RadioGroup>
            <div v-show="agree === '0'">
                <div class="reason-name" style="margin-bottom: 6px;">填写驳回原因:</div>
                <Input type="textarea" v-model.trim="reason" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
        <!-- 编辑提示弹框 -->
        <adt-reconfirm-modal
            :showModal="editModalShow"
            :message="editMsg"
            @on-visible-change="visibleChangeEdit"
            @on-ok="editModalClick()"
        />
        <!-- 删除modal -->
        <adt-my-modal
            :showModal="isActionDel"
            title="系统提示"
            @on-visible-change="visibleChange"
            @on-ok="confirmDel()"
        >
            <div>
                <div style="margin-bottom: 6px;">填写删除原因:</div>
                <Input v-model.trim="delInfo.reason" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
    import {
        apiAddMessage,
        apiQueryList,
        apiQueryInfo,
        apiUpdate,
        apiEnable,
        apiDisable,
        apiExamine,
        apiDelData
    } from '@/api/standard-mapper/messageManage'
    import { tableColumns } from './data'
    import validateRules from '@/libs/validateRules'
    import standardMapperList from '@/mixins/standardMapperList'
    import { dateToString, toTimestamp } from '@/libs/utils'
    export default {
        mixins: [standardMapperList],
        props: {
            examineStatus: '',
            templateStatus: '',
            businessType: '',
            messageCode: '',
            messageName: ''
        },
        data() {
            return {
                // 审核状态
                dictionaryApprovalStatus: this.$getDictionary('AUDIT_STATUS') || [],
                // 启用状态
                dictionaryEnabledStatus: this.$getDictionary('ENABLE_STATUS') || [],
                // 业务环节
                businessTypeData: this.$getDictionary('BUSINESS_STEP') || [],
                search: {
                    businessType: this.businessType || '',
                    messageCode: this.messageCode || '',
                    messageName: this.messageName || '',
                    examineStatus: this.examineStatus || '',
                    templateStatus: this.templateStatus || ''
                },
                messageEditCode: '',
                addFormItem: {},
                editFormItem: {},
                addFormRule: {
                    messageName: [validateRules.required('消息名称')[0]],
                    businessType: [validateRules.select('业务环节')[0]],
                    messageContent: [validateRules.required('消息内容')[0]]
                },
                editFormRule: {
                    messageName: [validateRules.required('消息名称')[0]],
                    businessType: [validateRules.select('业务环节')[0]],
                    messageContent: [validateRules.required('消息内容')[0]]
                },
                // 区分是新增还是编辑
                distinguish: 0,
                // 添加弹框的显示
                isModalShow: false,
                // 编辑弹框
                isEditModalShow: false,
                // 编辑提示
                editModalShow: false,
                // 编辑提示的文字
                editMsg: '',
                tableColumns,
                tableData: [],
                isAuditShow: false,
                examineModalTitle: '启用审核',
                stopData: {}
            }
        },
        methods: {
            // 点击启用状态，因为字段不一样，不能用公共方法
            chooseUseStatus (id) {
                if (this.search.templateStatus === id) {
                    this.search.templateStatus = ''
                } else {
                    this.search.templateStatus = id
                }
            },
            // 确认删除
            confirmDel () {
                let data = []
                data.push(this.delInfo)
                apiDelData({ data }).then(res => {
                    this.$Message.info(res.message)
                    // 隐藏模态框
                    this.isActionDel = false
                    // 重新获取列表数据
                    this.getData()
                })
            },
            // 初始化数据
            getData () {
                const data = {
                    page: this.page,
                    size: 15,
                    ...this.search
                }
                apiQueryList( {data} ).then(res => {
                    this.tableData = res.data.content || []
                    this.total = res.data.totalElements
                    this.tableData.forEach(element => {
                        element.createDatetime = dateToString(element.createDatetime)
                        element.examineDatetime = dateToString(element.examineDatetime)
                    })
                })
            },
            // 新增保存
            saveAdd () {
                console.log(this.addFormItem)
                this.$refs.addFormRef.validate((valid) => {
                    if (valid) {
                        let data = this.addFormItem
                        apiAddMessage({data}).then(res => {
                            this.$Message.info(res.message)
                            this.$refs.addFormRef.resetFields()
                            this.addFormItem = {}
                            this.isModalShow = false
                            this.getData()
                        })
                    }
                })
            },
            // 编辑保存
            saveEdit () {
                this.$refs.editFormRef.validate((valid) => {
                    if (valid) {
                        let data = this.editFormItem
                        apiUpdate({data}).then(res => {
                            this.$Message.info(res.message)
                            this.isEditModalShow = false
                            this.getData()
                        })
                    }
                })
            },
            // 新增取消
            cancelAdd () {
                // 重置
                this.addFormItem = {}
                this.trspModeData = []
                if (this.$refs.addFormRef !== undefined) {
                    this.$refs.addFormRef.resetFields()
                }
            },
            // 编辑取消
            cancelEdit () {
                if (this.$refs.editFormRef !== undefined) {
                    this.$refs.editFormRef.resetFields()
                }
            },
            // 编辑
            edit (row) {
                // 如果当前是启用状态，弹出弹框提示
                if (row.templateStatus === 'enable') {
                    this.editModalShow = true
                    this.editMsg = `请停用${row.messageName}消息再进行编辑`
                    this.stopData.templateStatus = row.templateStatus
                    this.stopData.messageCode = row.messageCode
                    this.stopData.examineStatus = row.examineStatus
                } else {
                    this.isEditModalShow = true
                    let data = {
                        'messageCode': row.messageCode
                    }
                    apiQueryInfo( data ).then(res => {
                        this.editFormItem = res.data
                        this.messageEditCode = res.data.messageCode
                    })
                }
            },
            // 启用
            startUsing (dataSource) {
                const data = this.handleRequestData(dataSource)
                // 批量操作，没有选择场所
                if (!data.length) return
                apiEnable({ data }).then(res => {
                    this.$Message.info(res.message)
                    this.getData()
                })
            },
            // 停用
            stopUsing (dataSource) {
                const data = this.handleRequestData(dataSource)
                // 批量操作，没有选择场所
                if (!data.length) return
                apiDisable({ data }).then(res => {
                    this.$Message.info(res.message)
                    this.getData()
                })
            },
            // 将数据处理ajax请求需要的入参数据
            handleRequestData (data) {
                const requestData = []
                // 单个启用，停用
                if (data) {
                    requestData.push(handle(data))
                    return requestData
                } else {
                    // 批量启用、停用
                    if (!this.selectionList.length) {
                        this.$Message.warning('请先选择场所')
                    } else {
                        for (const list of this.selectionList) {
                            requestData.push(handle(list))
                        }
                    }
                    return requestData
                }
                // 取到所需要的数据
                function handle (obj) {
                    const { examineStatus, messageCode , templateStatus } = obj
                    return {
                        'sttnCode': messageCode,
                        'useStatus': templateStatus,
                        examineStatus
                    }
                }
            },
            // 审核
            examine (row) {
                this.reason = ''
                // 根据状态判断是启用审核
                if (!row.templateStatus || row.templateStatus === 'disable') {
                    this.examineType = 1
                    this.examineModalTitle = '启用审核'
                } else {
                    this.examineType = 0
                    this.examineModalTitle = '停用审核'
                }
                this.examineInfo.examineStatus = row.examineStatus
                this.examineInfo.disagreeReason = ''
                this.examineInfo.opinion = ''
                this.examineInfo.sttnCode = row.messageCode
                this.examineInfo.useStatus = row.templateStatus
                this.isAuditShow = true
            },
            // 审核确定
            saveAudit () {
                const data = { ...this.examineInfo}
                // 启用
                if (this.examineType === 1) {
                    // 同意
                    if (this.agree === '1') {
                        data.opinion = 'AO'
                        apiExamine({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isAuditShow = false
                            this.getData()
                        })
                    } else {
                        if (!this.reason) {
                            this.$Message.warning('请填写输入驳回原因！')
                            return
                        }
                        data.opinion = 'DO'
                        data.disagreeReason = this.reason
                        // 不同意
                        apiExamine({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isAuditShow = false
                            this.getData()
                        })
                    }
                } else {
                    // 停用审核
                    // 同意
                    if (this.agree === '1') {
                        data.opinion = 'AC'
                        apiExamine({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isAuditShow = false
                            this.getData()
                        })
                    } else {
                        if (!this.reason) {
                            this.$Message.warning('请填写输入驳回原因！')
                            return
                        }
                        data.opinion = 'DC'
                        data.disagreeReason = this.reason
                        // 不同意
                        apiExamine({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isAuditShow = false
                            this.getData()
                        })
                    }
                }
            },
            // 查看详情
            detail (row) {
                const data = row.messageCode
                this.$router.push({path: '/standard-mapper/message-manage/detail', query: {messageCode: data}})
            },
            // 删除
            remove (row) {
                this.isActionDel = true
                this.delInfo.code = row.messageCode
                this.delInfo.reason = ''
                this.delInfo.useStatus = row.templateStatus
            },
            // 编辑提示点击确定
            editModalClick () {
                // 停用
                this.stopUsing(this.stopData)
                this.editModalShow = false
            },
            // 审核的弹框状态
            auditvisibleChange (changeStatus) {
                this.isAuditShow = changeStatus
            },
            // 新增的弹框状态
            addvisibleChange (changeStatus) {
                this.isModalShow = changeStatus
            },
            // 编辑的弹框状态
            editvisibleChange (changeStatus) {
                this.isEditModalShow = changeStatus
            },
            // 编辑提示的二次确定弹框状态
            visibleChangeEdit (changeStatus) {
                this.editModalShow = changeStatus
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .ivu-form-item-error-tip {
        font-size: 12px;
    }
    .ivu-divider {
        margin-top: 0;
        background: #c8c8c8;
    }
    /deep/ .ivu-form-item-content {
        position: relative;
        line-height: 1.5;
        small{
            position: absolute;
            left: -80px;
            top: 28%;
            color: red;
            font-size: 14px;
        }
    }
</style>
