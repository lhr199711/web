<template>
    <div>
        <adt-search-folder
            :searchRouter="{query: {accountName: search.accountName, organizationId: search.organizationId, phoneNumber: search.phoneNumber}}"
            @on-triggerFolder="searchChange">
            <template slot="always-show">
                <Col span="6" class="form-item">
                    <span> 账户名称：</span>
                    <Input v-model="search.accountName" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span> 部门ID：</span>
                    <Input v-model="search.organizationId" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span> 手机号码：</span>
                    <Input v-model="search.phoneNumber" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <AdtButton class="btn-operating" :allDelShow="true" :delUrl="delUrl" :selectList="selectList">
                <Button @click="add()">新增账户
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                    </svg>
                </Button>
            </AdtButton>
            <AdtMyModal :title="modelTitle" okText="保存" cancelText="取消" :showModal="isModalShow" @on-visible-change="addvisibleChange" @on-ok="save()" @on-cancel="cancel()">
                <Form :model="formItem" ref="formItemData" :rules="formItemRule" :label-width="100" label-colon>
                    <FormItem label="邮箱" prop="accountEmail">
                        <Input v-model="formItem.accountEmail"></Input>
                    </FormItem>
                    <FormItem label="账户名" prop="accountName">
                        <Input v-model="formItem.accountName"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="loginPwd">
                        <Input v-model="formItem.loginPwd"></Input>
                    </FormItem>
                    <FormItem label="手机号码" prop="phoneNumber">
                        <phone-input :prefix="formItem.internationalPhonePrefix" :suffix="formItem.phoneNumber" @prefixChange="formItem.internationalPhonePrefix = arguments[0]" @suffixChange="formItem.phoneNumber = arguments[0]" width="323" />
                    </FormItem>
                    <FormItem label="部门ID" prop="organizationId">
                        <Select v-model="formItem.organizationId">
                            <Option v-for="(selectData, id) in departmentId" :key="id" :value="selectData.statusValue">{{selectData.statusValue}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="账户状态" prop="accountStatus">
                        <Select v-model="formItem.accountStatus">
                            <Option v-for="(selectData, id) in formStatus" :key="id" :value="selectData.statusKey">{{selectData.statusValue}}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </AdtMyModal>
            <adt-paginator @getPages="getPages" class="pagination" :currentPage="~~page" :total="~~total" path="/authority-manage/user-manage" />
        </div>
        <div class="public-table-data">
            <Table :columns="tableColumns" :data="tableData" @on-selection-change="check" stripe>
                <!-- 操作 -->
                <template slot-scope="{ row, index }" slot="action">
                    <svg class="icon-action iconfont" aria-hidden="true" @click="edit(row)">
                        <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                    </svg>
                    <svg class="icon-action iconfont" aria-hidden="true" @click="remove(row)">
                        <use xlink:href="#icon-andaotongV3ICON_caozuo-shanchu" />
                    </svg>
                </template>
            </Table>
        </div>
        <adt-reconfirm-modal :showModal="isActionDel" @on-visible-change="visibleChange" @on-ok="allDelClick()" />
    </div>
</template>

<script>
import paginator from '@/mixins/paginator'
import { apiAccountQueryList, apiAccountAdd, apiAccountUpdate, apiAccountDeleteById, apiAccountDeletes } from '@/api/userManage'
import { apiGetOrganizationList } from '@/api/organizationManage'
import validateRules from '@/libs/validateRules'
export default {
    mixins: [paginator],
    data() {
        return {
            modelTitle: '',
            search: {},
            isActionDel: false,
            isModalShow: false,
            formItem: {
                accountEmail: '',
                accountName: '',
                loginPwd: '',
                phoneNumber: '',
                organizationId: '',
                accountStatus: ''
            },
            formStatus: [
                { statusKey: 'enable', statusValue: '可用'},
                { statusKey: 'disable', statusValue: '禁用'}
            ],
            formItemRule: {
                accountEmail: [
                    validateRules.required('邮箱')[0],
                    validateRules.email()[0],
                ],
                accountName: [
                    validateRules.required('账户名')[0],
                ],
                loginPwd: [
                    validateRules.required('密码')[0],
                ],
                phoneNumber:[
                    validateRules.required('手机号')[0],
                    validateRules.phone()[0]
                ],
                organizationId: [
                    validateRules.select('部门ID')[0]
                ],
                accountStatus: [
                    validateRules.select('账户状态')[0]
                ]
            },
            tableColumns: [
                {
                    title: '选择',
                    align: 'center',
                    type: 'selection'
                },
                {
                    title: '账户名',
                    align: 'center',
                    key: 'accountName'
                },
                {
                    title: '部门ID',
                    align: 'center',
                    key: 'organizationId'
                },
                {
                    title: '手机号码',
                    align: 'center',
                    key: 'phoneNumber'
                },
                {
                    title: '邮箱',
                    align: 'center',
                    key: 'accountEmail'
                },
                {
                    title: '账户状态',
                    align: 'center',
                    key: 'accountStatus'
                },
                {
                    title: '账户类型',
                    align: 'center',
                    key: 'accountType'
                },
                {
                    title: '创建人',
                    align: 'center',
                    key: 'createBy'
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'createDatetime'
                },
                // {
                //     title: '描述',
                //     align: 'center',
                //     key: 'description'
                // },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operating',
                    slot: 'action'
                }
            ],
            tableData: [],
            departmentId: [],
            internationalPhonePrefix: '',
            phoneNumber: '',
            // 新增编辑区分  1为新增 2为编辑
            distinguish: 0,
            delUrl: apiAccountDeletes,
            selectList: {},
            passData: {}
        }
    },
    mounted () {
        this.getOrganizationListData()
    },
    methods: {
        addvisibleChange (changeStatus) {
            this.isModalShow = changeStatus
        },
        visibleChange (changeStatus) {
            this.isActionDel = changeStatus
        },
        getPages (page) {
            this.page = page
        },
        dataInit () {
            this.getData()
        },
        getData () {
            const data = {
                size: 15,
                page: this.page,
                accountName: this.search.accountName,
                organizationId: this.search.organizationId,
                phoneNumber: this.search.phoneNumber
            }
            apiAccountQueryList({ data: data }).then(res => {
                if (res.code == 200) {
                    this.tableData = res.data.content || []
                    this.total = res.data.totalElements
                }
            })
        },
        searchChange () {},
        add () {
            this.isModalShow = true
            this.distinguish = 1
            this.modelTitle = '新增账户'
        },
        // 获取组织机构id(部门ID)
        getOrganizationListData () {
            apiGetOrganizationList().then(res => {
                if (res.code == 200) {
                    res.data.forEach(element => {
                        this.departmentId.push({statusValue: element.organizationId})
                    })
                }
            })
        },
        save () {
            // 新增保存
            if (this.distinguish == 1) {
                const data = {
                    accountEmail: this.formItem.accountEmail,
                    accountName: this.formItem.accountName,
                    accountStatus: this.formItem.accountStatus,
                    internationalPhonePrefix: this.formItem.internationalPhonePrefix,
                    loginPwd: this.formItem.loginPwd,
                    organizationId: this.formItem.organizationId,
                    phoneNumber: this.formItem.phoneNumber
                }
                this.$refs['formItemData'].validate((valid) => {
                    if (valid) {
                        apiAccountAdd({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                // 隐藏新增模态框
                                this.isModalShow = false
                                // 重置form表单
                                this.$refs.formItemData.resetFields()
                                // 刷新表格
                                this.getData()
                            }
                        })
                    }
                })
            }
            if (this.distinguish == 2) {
                const data = {
                    accountId: this.accountId,
                    accountEmail: this.formItem.accountEmail,
                    accountName: this.formItem.accountName,
                    accountStatus: this.formItem.accountStatus,
                    internationalPhonePrefix: this.formItem.internationalPhonePrefix,
                    loginPwd: this.formItem.loginPwd,
                    organizationId: this.formItem.organizationId,
                    phoneNumber: this.formItem.phoneNumber
                }
                this.$refs['formItemData'].validate((valid) => {
                    if (valid) {
                        apiAccountUpdate({ data: data }).then(res => {
                            if (res.code == 200) {
                                if (res.code == 200) {
                                    this.$Message.info("保存成功")
                                    // 隐藏新增模态框
                                    this.isModalShow = false
                                }
                            }
                        })
                    }
                })
            }
        },
        cancel () {
            this.isModalShow = false
            // 重置form表单
            this.$refs.formItemData.resetFields()
            // 刷新表格
            this.getData()
        },
        edit (row) {
            this.accountId = row.accountId
            this.isModalShow = true
            this.formItem = row
            this.distinguish = 2
            this.modelTitle = '编辑账户'
        },
        remove (row) {
            this.isActionDel = true
            this.passData = {
                accountId: [row.accountId]
            }
        },
        allDelClick () {
            apiAccountDeleteById(this.passData).then(res => {
                if (res.code == 200) {
                    this.isActionDel = false
                    this.$Message.info("删除成功")
                    // 刷新列表
                    this.getData()
                }
            })
        },
        check (row) {
            let arr = []
            row.forEach(element => {
                arr.push(element.accountId)
            })
            this.dictionarySeclect = arr
            this.selectList = {
                accountIds: this.dictionarySeclect
            }
        }
    },
}
</script>

<style lang="scss" scoped>
/deep/.ivu-form-item > .ivu-form-item-label{
    text-align: left;
}
span{
    width: 120px;
    line-height: 30px;
}
.search-condition{
    display: flex;
}
.line-margin {
    margin-left: 30px;
}
.icon-action{
    margin: 0 10px;
}
</style>
