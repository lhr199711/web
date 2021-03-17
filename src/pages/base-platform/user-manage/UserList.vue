<template>
    <div>
        <adt-search-folder
            :searchRouter="{ query: search }"
            :isStatus="true"
            :isTitle="false"
        >
            <template slot="status">
                <div class="status">
                    <Col>
                        <div class="name">状态:</div>
                        <span
                            v-for="status in enableStatus"
                            :key="status.dictionaryKey"
                            :class="{
                                'click-status':
                                    search.accountStatus ===
                                    status.dictionaryKey,
                            }"
                            @click="enableStatusClick(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                </div>
            </template>
            <template slot="always-show">
                <Col span="6" class="form-item">
                    <span>账户名称:</span>
                    <Input v-model="search.accountName" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span>手机号码:</span>
                    <Input v-model="search.phoneNumber" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="add()">
                    新增账户
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                    </svg>
                </Button>
            </AdtButton>
            <adt-paginator
                class="pagination"
                :currentPage="~~page"
                :total="~~total"
            />
        </div>
        <AdtMyModal
            :title="modalTitle"
            :showModal="isModalShow"
            okText="保存"
            cancelText="取消"
            width="380"
            @on-visible-change="addVisibleChange"
            @on-ok="handleItemModalOk()"
            @on-cancel="cancel()"
        >
            <!-- 新增账户 -->
            <Form ref="formItem" :model="formItem" :rules="ruleInline">
                <FormItem
                    label="用户账号"
                    prop="accountName"
                    :label-width="120"
                >
                    <Input
                        :disabled="formItem.accountId ? true : false"
                        v-model="formItem.accountName"
                        style="width: 200px"
                    />
                </FormItem>
                <FormItem
                    label="用户昵称"
                    prop="accountNick"
                    :label-width="120"
                >
                    <Input
                        v-model="formItem.accountNick"
                        style="width: 200px"
                    />
                </FormItem>
                <FormItem
                    v-if="formItem.accountId ? false : true"
                    label="用户密码"
                    prop="loginPwd"
                    :label-width="120"
                >
                    <Input v-model="formItem.loginPwd" style="width: 200px" />
                </FormItem>
                <FormItem
                    label="国家电话区号"
                    prop="internationalPhonePrefix"
                    :label-width="120"
                >
                    <Select
                        v-model="formItem.internationalPhonePrefix"
                        style="width: 200px"
                    >
                        <Option
                            v-for="(selectData, index) in AreaCode"
                            :key="index"
                            :value="selectData.value"
                            >{{ selectData.label }}</Option
                        >
                    </Select>
                </FormItem>
                <FormItem
                    label="手机电话"
                    prop="phoneNumber"
                    :label-width="120"
                >
                    <Input
                        v-model="formItem.phoneNumber"
                        style="width: 200px"
                    />
                </FormItem>
                <FormItem label="微信号" prop="weChat" :label-width="120">
                    <Input v-model="formItem.weChat" style="width: 200px" />
                </FormItem>
                <FormItem
                    label="用户邮箱"
                    prop="accountEmail"
                    :label-width="120"
                >
                    <Input
                        v-model="formItem.accountEmail"
                        style="width: 200px"
                    />
                </FormItem>
                <FormItem label="状态" prop="accountStatus" :label-width="120">
                    <Select
                        v-model="formItem.accountStatus"
                        style="width: 200px"
                    >
                        <Option
                            v-for="(selectData, id) in formStatus"
                            :key="id"
                            :value="selectData.statusKey"
                            >{{ selectData.statusValue }}</Option
                        >
                    </Select>
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
                <template slot-scope="{ row, index }" slot="action">
                    <span v-show="row.accountStatus === 'disable'" title="编辑">
                        <svg
                            class="icon-action iconfont"
                            aria-hidden="true"
                            @click="edit(row)"
                        >
                            <use
                                xlink:href="#icon-andaotongV3ICON_caozuo-bianji"
                            />
                        </svg>
                    </span>
                    <span v-show="row.accountStatus === 'disable'" title="删除">
                        <svg
                            class="icon-action iconfont"
                            aria-hidden="true"
                            @click="remove(row)"
                        >
                            <use
                                xlink:href="#icon-andaotongV3ICON_caozuo-shanchu"
                            />
                        </svg>
                    </span>

                    <span
                        v-if="row.accountStatus === 'disable'"
                        class="icon-action icon-action-word"
                        title="启用"
                        @click="startUsing(row)"
                        >启</span
                    >
                    <span
                        v-if="row.accountStatus === 'enable'"
                        class="icon-action icon-action-word"
                        title="停用"
                        @click="stopUsing(row)"
                        >停</span
                    >
                    <span>
                        <Button
                            size="small"
                            shape="circle"
                            @click="menuHandel(row)"
                            >重置密码</Button
                        >
                    </span>
                </template>
            </Table>
        </div>
        <!-- 二次删除 -->
        <adt-reconfirm-modal
            :showModal="isreconfirm"
            @on-visible-change="deleteVisibleChange"
            @on-ok="deleteOk"
        />
    </div>
</template>

<script>
    import standardMapperList from '@/mixins/standardMapperList'
    import paginator from '@/mixins/paginator'
    import validateRules from '@/libs/validateRules'
    import { dateToString } from '@/libs/utils'
    import { tableColumns } from './data'
    import {
        apiAccountAdd,
        apiAccountEdit,
        apiAccountStatus,
        apiAccountList,
        apiAccountDelete,
        apiAccountResetPwd
    } from '@/api/base-platform/userManage'
    export default {
        mixins: [standardMapperList, paginator],
        props: {
            accountStatus: '',
            accountName: '',
            phoneNumber: ''
        },
        data () {
            return {
                AreaCode: [
                    {
                        label: '+86',
                        value: '+86'
                    },
                    {
                        label: '+65',
                        value: '+65'
                    },
                    {
                        label: '+73',
                        value: '+73'
                    },
                    {
                        label: '+74',
                        value: '+74'
                    },
                    {
                        label: '+78',
                        value: '+78'
                    },
                    {
                        label: '+79',
                        value: '+79'
                    },
                ],
                isreconfirm: false,
                // 用户类型
                userType: '',
                // 新增编辑弹框的名称
                modelTitle: '',
                // 新增编辑的form表单
                formItem: {
                },
                // 新增编辑的form表单校验
                ruleInline: {
                    // phoneNumber: [validateRules.required('手机号码')[0]],
                },
                // 数据项数据
                dataItem: [],
                // 区分当前是否可以调用接口
                search: {
                    accountStatus: this.accountStatus,
                    accountName: this.accountName,
                    phoneNumber: this.phoneNumber
                },
                // billsCode: '',
                // 单据
                tableColumns,
                tableData: [],
                name: '账户',
                // 勾选的数据项数据
                selectedItemData: [],
                // 删除的数据
                // deleteList: [],
                deleteData: {},
                formStatus: [
                    { statusKey: 'enable', statusValue: '可用' },
                    { statusKey: 'disable', statusValue: '禁用' }
                ],
            }
        },
        methods: {
            dataInit () {
                this.getData()
            },
            // 表格选框
            selectionChange () { },
            // 重置密码
            menuHandel (row) {
                const data = {
                    accountId: row.accountId,
                    version: row.version
                }
                apiAccountResetPwd({ data }).then((res) => {
                    if (res.code == 200) {
                        this.getData()
                        this.$Message.success('操作成功')
                        return
                    }
                    this.$Message.error(`${res.message}`)
                })
            },
            // 启用
            startUsing (row) {
                this._statusApp(row.accountId, 'enable', row.version)
            },
            // 禁用
            stopUsing (row) {
                this._statusApp(row.accountId, 'disable', row.version)
            },
            _statusApp (accountId, accountStatus, version) {
                const data = {
                    accountId,
                    accountStatus,
                    version
                }
                apiAccountStatus({ data }).then((res) => {
                    if (res.code == 200) {
                        this.getData()
                        this.$Message.success('操作成功')
                        return
                    }
                    this.$Message.error(`${res.message}`)
                })
            },
            // 编辑
            edit (row) {
                this.isModalShow = true
                this.modalTitle = '编辑用户'
                this.formItem = row
            },
            // 新增
            add () {
                this.formItem = {}
                this.isModalShow = true
                this.modalTitle = `新增${this.name}`
            },
            // 弹框里面的确认按钮
            handleItemModalOk () {
                this.isModalShow = false
                if (this.formItem.accountId) {
                    this._addEditApp(apiAccountEdit)
                    return
                }
                this._addEditApp(apiAccountAdd)
            },
            _addEditApp (api) {
                const data = {
                    ...this.formItem,
                }
                api({ data }).then((res) => {
                    if (res.code == 200) {
                        this.$refs.formItem.resetFields();
                        this.$Message.success('操作成功')
                        this.getData()
                        return
                    }
                })
                .catch(res => {
                    this.getData()
                })
            },
            // 删除
            remove (row) {
                this.row = row
                this.isreconfirm = true
            },
            _apiAppDelete () {
                const data = {
                    accountId: this.row.accountId
                }
                apiAccountDelete({ ...data }).then((res) => {
                    if (res.code == 200) {
                        this.getData()
                        this.$Message.success('删除成功')
                    }
                })
            },
            // 2删
            deleteVisibleChange (data) {
                this.isreconfirm = data
            },
            // 2 确认
            deleteOk () {
                this.isreconfirm = false
                this._apiAppDelete()

            },
            // 获取列表
            // 该方法在minx里面有定义
            getData () {
                const data = {
                    accountStatus: this.search.accountStatus, //"状态"
                    phoneNumber: this.search.phoneNumber,
                    accountName: this.search.accountName,
                    page: this.page,
                }
                apiAccountList({ data: data }).then(res => {
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
            // 新增取消
            cancel () {
            },
            enableStatusClick (id) {
                // 控制状态切换传值
                if (this.search.accountStatus === id) {
                    this.search.accountStatus = ''
                } else {
                    this.search.accountStatus = id
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
