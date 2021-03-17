<template>
    <div>
        <adt-search-folder
            :searchRouter="{ query: search }" :isStatus="true">
            <template slot="status">
                <div class="status">
                    <Col span="10">
                        <div class="name">审核状态:</div>
                        <span
                            v-for="status in auditStatus"
                            :key="status.dictionaryKey"
                            :class="{'click-status': search.examineStatus === status.dictionaryKey}"
                            @click="auditStatusClick(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                    <Col span="14">
                        <div class="name">启用状态:</div>
                        <span
                            v-for="status in enableStatus"
                            :key="status.dictionaryKey"
                            :class="{'click-status': search.useStatus === status.dictionaryKey}"
                            @click="enableStatusClick(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                </div>
            </template>
            <template slot="always-show">
                <Col span="6" class="form-item">
                    <span>单据编号:</span>
                    <Input v-model="search.billsCode" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span>单据名称:</span>
                    <Input v-model="search.billsName" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="add()">
                        新增单据
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
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
            <adt-paginator class="pagination" :currentPage="~~page" :total="~~total" />
        </div>
        <AdtMyModal
            :title="modalTitle"
            :showModal="isModalShow"
            okText="保存"
            cancelText="取消"
            width="600"
            @on-visible-change="addVisibleChange"
            @on-ok="save()"
            @on-cancel="cancel()"
        >
            <!-- 新增单据 -->
            <Form ref="formItem" :model="formItem" :rules="ruleInline">
                <FormItem label="单据名称" prop="billsName" :label-width="80">
                    <Input v-model="formItem.billsName" style="width: 160px" />
                </FormItem>
                <Divider />
                <div class="font-title">选择数据项</div>
                <Table
                    :columns="dataItemColumns"
                    :data="dataItem"
                    max-height="300"
                    stripe
                    style="margin-bottom: 20px;"
                    @on-selection-change="checkDataItem"
                />
                <FormItem label="备注信息" prop="remark" :label-width="70">
                    <Input type="textarea" v-model="formItem.remark" />
                </FormItem>
            </Form>
        </AdtMyModal>
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
                        @click="startUsing(row)"
                    >启</span>
                    <span
                        v-if="(row.useStatus && row.useStatus === 'enable') && row.examineStatus !== 'wait'"
                        class="icon-action icon-action-word"
                        title="停用"
                        @click="stopUsing(row)"
                    >停</span>
                    <span title="审核">
                        <svg
                            v-if="isManager && row.examineStatus === 'wait'"
                            class="icon-action iconfont"
                            aria-hidden="true"
                            @click="examine(row, 'billsCode', 'useStatus', 'version')"
                        >
                            <use xlink:href="#icon-andaotongV3ICON_shenhe" />
                        </svg>
                    </span>
                    <!-- <span v-if="row.useStatus !== 'enable'" title="编辑">
                        <svg v-if="row.useStatus === 'disable'" class="icon-action iconfont" aria-hidden="true" @click="edit(row)">
                            <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                        </svg>
                    </span> -->
                    <span title="删除">
                        <svg
                            v-if="isManager && row.useStatus !== 'enable'"
                            class="icon-action iconfont"
                            aria-hidden="true"
                            @click="remove(row)"
                        >
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
        <!-- 场景审核 -->
        <adt-my-modal
            :title="examineModalTitle"
            :showModal="isExamineModalShow"
            @on-visible-change="examineVisibleChange"
            @on-ok="saveAudit()"
            width="600">
            <RadioGroup v-model="agree" style="margin-bottom: 20px;">
                <Radio label="1">同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
                <Radio label="0" style="margin-left: 30px;">
                    不同意{{ examineType === 1 ? '启用' : '停用' }}
                </Radio>
            </RadioGroup>
            <div v-show="agree === '0'">
                <div class="reason-name" style="margin-bottom: 6px;">填写驳回原因:</div>
                <Input type="textarea" v-model.trim="reason" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
        <adt-reconfirm-modal :showModal="isActionDel" @on-visible-change="visibleChange" @on-ok="allDelClick()" />
    </div>
</template>

<script>
import standardMapperList from '@/mixins/standardMapperList'
import validateRules from '@/libs/validateRules'
import { dateToString } from '@/libs/utils'
import { tableColumns, dataItemColumns } from './data'
import{
    apiQueryPage,
    apiEnable,
    apiDisable,
    apiExamEnablePass,
    apiExamEnableFail,
    apiExamDisablePass,
    apiExamDisableFail,
    apiInitSceneAdd,
    apiQueryTaskBase,
    apiQueryTaskAffix,
    apiAdd,
    apiGetTemplateList,
    apiDel
} from '@/api/standard-mapper/documentManage'
export default {
    mixins: [standardMapperList],
    props: {
        examineStatus: '',
        useStatus: '',
        billsCode: '',
        billsName: ''
    },
    data() {
        return {
            // 用户类型
            userType: '',
            // 新增编辑弹框的名称
            modelTitle: '',
            // 新增编辑的form表单
            formItem: {
                billsName: '',
                remark: ''
            },
            // 新增编辑的form表单校验
            ruleInline: {
                billsName: [validateRules.required('单据名称')[0]],
            },
            // 数据项数据
            dataItem: [],
            // 数据项表头
            dataItemColumns,
            // 区分当前是否可以调用接口
            search: {
                examineStatus: this.examineStatus,
                useStatus: this.useStatus,
                billsCode: this.billsCode,
                billsName: this.billsName
            },
            // billsCode: '',
            // 单据
            tableColumns,
            tableData: [],
            list: [],
            name: '单据',
            // 勾选的数据项数据
            selectedItemData: [],
            // 删除的数据
            deleteList: [],
            deleteData: {},
        }
    },
    methods: {
        // 获取列表
        // 该方法在minx里面有定义
        getData () {
            const data = {
                examineStatus:  this.search.examineStatus,// "审核状态",
                useStatus: this.search.useStatus, //"启用状态"
                billsCode: this.search.billsCode,
                billsName: this.search.billsName,
                page: this.page,
            }
            apiQueryPage({ data: data }).then(res => {
                if (res.code == 200) {
                    this.tableData = res.data.content || []
                    this.total = res.data.totalElements
                    this.tableData.forEach(element => {
                        element.createDatetime = dateToString(element.createDatetime)
                        element.examineDatetime = dateToString(element.examineDatetime)
                    })
                }
            })
        },
        // 启用
        startUsing (dataSource) {
            const data = this.handleRequestData(dataSource, 'billsCode', 'examineStatus', 'useStatus', 'version')
            // 批量操作，没有选择场景
            if (!data.length) return
            apiEnable({ data }).then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 禁用
        stopUsing (dataSource) {
            const data = this.handleRequestData(dataSource, 'billsCode', 'examineStatus', 'useStatus', 'version')
            // 批量操作，没有选择场景
            if (!data.length) return
            apiDisable({ data }).then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 审核
        audit (row) {
            this.isExamineModalShow = true
        },
        // 编辑
        edit (row) {
            this.isModalShow = true
            this.modelTitle = '编辑单据'
            this.billsCode = row.billsCode
            const data = {
                serverType: row.serverType,
                trspType: row.trspType,
                logisticsType: row.logisticsType
            }
            this.getTypeData(data)
        },
        // 删除
        remove (row) {
            this.isActionDel = true
            this.deleteData = {
                billsCode: row.billsCode,
                version: row.version
            }
        },
        // 确定删除
        allDelClick () {
            apiDel({ data: this.deleteData }).then(res => {
                this.$Message.info("删除成功")
                this.isActionDel = false
                this.getData()
            })
        },
        // 勾选数据项
        checkDataItem (row) {
            this.selectedItemData = row
        },
        // 新增
        add () {
            this.isModalShow = true
            this.modalTitle = `新增${this.name}`
            this.isAdd = true
            this.getListData()
        },
        // 获取新增/编辑页面的数据项列表
        getListData () {
            apiGetTemplateList().then(res => {
                this.dataItem = res.data
            })
        },
        // 新增单据保存
        save () {
            const vm = this
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        const data = { ...this.formItem }
                        data.dataExams = this.selectedItemData
                        console.log(data)
                        // 新增保存
                        if (this.isAdd) {
                            apiAdd({ data }).then(res => {
                                successCallback()
                            })
                        } else {
                            // 编辑保存
                            apiUpdate({ data }).then(res => {
                                successCallback()
                            })
                        }
                    }
                })
                function successCallback () {
                    vm.$Message.info("保存成功")
                    // 重置表单数据
                    vm.$refs.formItem.resetFields()
                    // 重置选中的数据项
                    vm.selectedItemData = []
                    // 隐藏新增模态框
                    vm.isModalShow = false
                    // 刷新列表
                    vm.getData()
                }
        },
        // 同意审核
        saveAudit () {
            const data = { ...this.examineInfo}
            if (this.examineType === 1) {
                // 同意
                if (this.agree === '1') {
                    apiExamEnablePass({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isExamineModalShow = false
                        this.getData()
                    })
                } else {
                    if (!this.reason) {
                        this.$Message.warning('请填写输入驳回原因！')
                        return
                    }
                    data.examineRsn = this.reason
                    // 不同意
                    apiExamEnableFail({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isExamineModalShow = false
                        this.getData()
                    })
                }
            } else {
                // 停用审核
                // 同意
                if (this.agree === '1') {
                    apiExamDisablePass({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isExamineModalShow = false
                        this.getData()
                    })
                } else {
                    if (!this.reason) {
                        this.$Message.warning('请填写输入驳回原因！')
                        return
                    }
                    data.examineRsn = this.reason
                    // 不同意
                    apiExamDisableFail({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isExamineModalShow = false
                        this.reason = ''
                        this.getData()
                    })
                }
            }
        },
        // 新增取消
        cancel () {
        },
        detail (row) {
            const data = row.billsCode
            this.$router.push({path: '/standard-mapper/document-manage/detail', query: {billsCode: data}})
        },
        auditStatusClick (id) {
            if (this.search.examineStatus === id) {
                this.search.examineStatus = ''
            } else {
                this.search.examineStatus = id
            }
        },
        enableStatusClick (id) {
            // 控制状态切换传值
            if (this.search.useStatus === id) {
                this.search.useStatus = ''
            } else {
                this.search.useStatus = id
            }
        }
    },
}
</script>

<style lang="scss" scoped>
/deep/.public-transit .select-transit {
    width: 100%;
}
.ivu-modal-content /deep/.modal-footer {
    margin-top: 20px;
}
// 审核的modal的title样式
.modal-title {
    .ivu-row {
        font-size: 14px;
    }
    .line {
        margin: 20px 30px;
    }
}
// 表格标题
.font-title {
    font-size: 14px;
    margin-bottom: 10px;
}
</style>
