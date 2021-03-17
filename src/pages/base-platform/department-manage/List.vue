<template>
    <div>
        <Button class="add-btn" @click="append()">新增一级部门</Button>
        <div class="entire">
            <card class="left-box">
                <Tree
                    :data="treeData"
                    :render="menuRender"
                    @on-select-change="chickTree"
                >
                </Tree>
            </card>
            <div class="separate" />
            <card class="right-box">
                <div>
                    <span>关联角色</span>
                    <Button class="btns-paginator" @click="addSole()">
                        添加
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                        </svg>
                    </Button>
                    <div class="right-table">
                        <Table :columns="tableRoleColumns" :data="tableRoleData" stripe>
                            <template slot-scope="{ row, index }" slot="operating">
                                <Button class="table-btn" @click="dismissSole(row, index)">解除关联</Button>
                            </template>
                        </Table>
                    </div>
                </div>
                <Divider />
                <div>
                    <span>关联用户</span>
                    <div class="btns-paginator">
                        <Button @click="addUser()">
                            添加
                            <svg class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                            </svg>
                        </Button>
                        <adt-paginator class="pagination" :currentPage="~~page" :total="~~total" :size="5" style="width: 70%" />
                    </div>
                    <div class="right-table">
                        <Table :columns="tableUserColumns" :data="tableUserData" stripe>
                            <template slot-scope="{ row, index }" slot="operating">
                                <Button class="table-btn" @click="dismissUser(row, index)">解除关联</Button>
                            </template>
                        </Table>
                    </div>
                </div>
            </card>
        </div>
        <!-- 新增下级 -->
        <adt-my-modal
            :title="isTitle"
            width="500"
            :showModal="showItemModal"
            @on-visible-change="visibleChange"
            @on-ok="addOk()"
            @on-cancel="cancel()"
        >
            <Form
                ref="formValidate"
                :model="itemData"
                :rules="ruleValidate"
                :label-width="80"
            >
                <FormItem label="部门名称" prop="organName">
                    <Input v-model="itemData.organName" />
                </FormItem>
                <FormItem label="状态" prop="organStatus">
                    <Select v-model="itemData.organStatus">
                        <Option value="enable">启用</Option>
                        <Option value="disable">禁用</Option>
                    </Select>
                </FormItem>
                <FormItem label="描述" prop="organDescribe">
                    <Input type="textarea" v-model="itemData.organDescribe" />
                </FormItem>
            </Form>
        </adt-my-modal>
        <!-- 配置角色 -->
        <adt-my-modal
            title="配置角色"
            width="500"
            :showModal="showModalRole"
            @on-visible-change="visibleChangeRole"
            @on-ok="saveRole()"
        >
            <Form
                ref="formValidateRole"
                :model="itemDataRole"
                :label-width="80"
                inline
            >
                <FormItem label="角色名称">
                    <Input v-model="itemDataRole.roleName" />
                </FormItem>
                <Button shape="circle" @click="searchRole" style="margin-left: 20px;">
                    查询
                    <Icon type="ios-search" />
                </Button>
            </Form>
            <Table
                :columns="addTableRoleColumns"
                :data="addTableRoleData"
                max-height="300"
                stripe
                @on-selection-change="checkRoleData"
            >
                <!-- <template slot-scope="{ row, index }" slot="roleTypeSolt">
                    <Select v-model="itemDataRole.roleType">
                        <Option
                            v-for="(selectData, id) in dictionaryRoleType"
                            :key="id"
                            :value="selectData.dictionaryKey"
                        >
                            {{ selectData.dictionaryValue }}
                        </Option>
                    </Select>
                </template> -->
            </Table>
        </adt-my-modal>
        <!-- 配置用户 -->
        <adt-my-modal
            title="配置用户"
            width="800"
            :showModal="showModalUser"
            @on-visible-change="visibleChangeUser"
            @on-ok="saveUser"
        >
            <Form
                ref="formValidateUser"
                :model="itemDataUser"
                :label-width="80"
                inline
            >
                <FormItem label="用户名称">
                    <Input v-model="itemDataUser.accountName" />
                </FormItem>
                <FormItem label="手机号码">
                    <Input v-model="itemDataUser.phoneNumber" />
                </FormItem>
                <Button shape="circle" @click="searchUser" style="margin-left: 20px;">
                    查询
                    <Icon type="ios-search" />
                </Button>
            </Form>
            <Table
                :columns="addTableUserColumns"
                :data="addTableUserData"
                max-height="300"
                stripe
                @on-selection-change="checkUserData"
            >
                <template slot-scope="{ row, index }" slot="UserTypeSolt">
                </template>
            </Table>
        </adt-my-modal>
    </div>
</template>

<script>
    import {
        tableRoleColumns,
        tableUserColumns,
        addTableRoleColumns,
        addTableUserColumns
        } from './data'
    import paginator from '@/mixins/paginator'
    import validateRules from '@/libs/validateRules'
    import {
        apiGetOrganTreeData,
        apiAddOrg,
        apiEdit,
        apiStatusOrg,
        apiDeleteOrg,
        apiGetOrganRoleData,
        apiGetOrganUserData,
        apiGetOrganNoRoleData,
        apiGetOrganNoUserData,
        apiSaveOrganRole,
        apiSaveOrganUserData,
        apiDeleteOrganRole,
        apiDeleteOrganAccount
    } from '@/api/base-platform/departmentManage'
    export default {
        mixins: [paginator],
        data() {
            return {
                // 是否是编辑
                isTitle: '新增下级',
                // 编辑的数据
                editData: {},
                // 获取角色类型字典
                dictionaryRoleType: this.$getDictionary('ROLE_TYPE'),
                // 添加下级弹窗
                showItemModal: false,
                itemData: {
                    organName: '',
                    organStatus: '',
                    organDescribe: ''
                },
                ruleValidate: {
                    organName: [
                        validateRules.required('部门名称')[0]
                    ],
                    organStatus: [
                        validateRules.select('状态')[0]
                    ]
                },
                // 配置角色弹窗
                showModalRole: false,
                itemDataRole: {},
                // 配置用户弹窗
                showModalUser: false,
                itemDataUser: {},
                // 角色列表
                tableRoleColumns,
                tableRoleData: [],
                // 配置角色列表
                addTableRoleColumns,
                addTableRoleData: [],
                // 用户列表
                tableUserColumns,
                tableUserData: [],
                // 配置用户列表
                addTableUserColumns,
                addTableUserData: [],
                // 勾选角色集合
                checkRoleList: [],
                // 勾选用户集合
                checkUserList: [],
                // 新增机构的父id
                addOrganPid: '',
                // 添加用户/角色的父id
                organizationId: '',
                organId: '',
                treeData:  [
                    // {
                    //     title: 'parent 1',
                    //     status: true,
                    //     expand: true,
                    //     children: [
                    //         {
                    //             title: 'child 1-1',
                    //             organStatus: 'enable',
                    //             createTime: '2020年12月',
                    //             expand: true,
                    //             children: [
                    //                 {
                    //                     title: 'leaf 1-1-1',
                    //                     status: false,
                    //                     expand: true
                    //                 },
                    //                 {
                    //                     title: 'leaf 1-1-2',
                    //                     expand: true
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             title: 'child 1-2',
                    //             expand: true,
                    //             children: [
                    //                 {
                    //                     title: 'leaf 1-2-1',
                    //                     expand: true
                    //                 },
                    //                 {
                    //                     title: 'leaf 1-2-1',
                    //                     expand: true
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // }
                ],
            }
        },
        methods: {
            // 绑定添加下级模态框
            visibleChange (data) {
                this.showItemModal = data
            },
            // 绑定添加角色模态框
            visibleChangeRole (data) {
                this.showModalRole = data
            },
            // 绑定添加用户模态框
            visibleChangeUser (data) {
                this.showModalUser = data
            },
            menuRender (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%',
                        // backgroundColor: '#FFF5E5'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-person-outline',
                            },
                            style: {
                                // marginRight: '8px',
                                margin: '10px'
                            }
                        }),
                        h('span', data.organName),
                        h('span', {
                            style: {
                                margin: '0 10px',
                                color: data.organStatus === 'enable' ? '#02ADB5' : 'red'
                            }
                        }, data.organStatus === 'enable' ? '已启用' : '已禁用' ),
                        // h('span', {
                        //     style: {
                        //         margin: '0 10px'
                        //     }
                        // },
                        // `(创建时间${data.createTime})`)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px',
                            padding: '5px',
                        }
                    }, [
                        h('span', {
                            style: {
                                padding: '3px 10px',
                                margin: '0 10px',
                                fontSize: '12px',
                                borderRadius: '15px',
                                border: '1px solid #999',
                                color: '#999'
                            },
                            on: {
                                click: () => { this.append(data) }
                            }
                        }, '添加下级'),
                        h('span', {
                            style: {
                                padding: '3px 25px',
                                margin: '0 10px',
                                fontSize: '12px',
                                borderRadius: '15px',
                                border: '1px solid #999',
                                color: '#999'
                            },
                            on: {
                                click: () => { this.edit(data) }
                            }
                        }, '修改'),
                        h('span', {
                            style: {
                                display: data.status === false ? 'none' : 'inline',
                                padding: '3px 25px',
                                margin: '0 10px',
                                fontSize: '12px',
                                borderRadius: '15px',
                                border: '1px solid #999',
                                color: '#999'
                            },
                            on: {
                                click: () => { this.remove(data) }
                            }
                        },'删除'),
                        h('span', {
                            style: {
                                padding: '3px 25px',
                                margin: '0 10px',
                                fontSize: '12px',
                                borderRadius: '15px',
                                border: data.organStatus === 'enable' ? '1px solid #999' : '1px solid #02ADB5',
                                color: data.organStatus === 'enable' ? '#999' : '#02ADB5'
                            },
                            on: {
                                click: () => { this.operate(data) }
                            }
                        }, data.organStatus === 'enable' ? '禁用' : '启用'),
                    ])
                ])
            },
            dataInit () {
                this.getTreeData()
                // this.getRoleData()
                this.organId = JSON.parse(window.sessionStorage.getItem('organId'))
                if (this.organId) {
                    this.getUserData(this.organId)
                }
            },
            // 获取部门树状数据
            getTreeData () {
                apiGetOrganTreeData().then(res => {
                    this.treeData = res.data
                })
            },
            // 添加下级
            append (val) {
                this.isTitle = '新增下级'
                this.showItemModal = true
                if (val) {
                    this.addOrganPid =  val.organId
                } else {
                    this.addOrganPid = 0
                }
            },
            // 修改
            edit (val) {
                this.showItemModal = true
                this.isTitle = '编辑下级'
                this.editData = val
                this.itemData.organName = val.organName
                this.itemData.organStatus = val.organStatus
                this.itemData.organDescribe = val.organDescribe
            },
            // 添加下级保存
            addOk () {
                // console.log(this.isTitle)
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        if(this.isTitle === '新增下级') {
                            const data = {
                                organPid: this.addOrganPid,
                                organName: this.itemData.organName,
                                organStatus: this.itemData.organStatus,
                                organDescribe: this.itemData.organDescribe
                            }
                            apiAddOrg({data}).then(res => {
                                this.resetData()
                            })
                        } else {
                            const data = {
                                organId: this.editData.organId,
                                organPid: this.editData.organPid,
                                version: this.editData.version,
                                organName: this.itemData.organName,
                                organStatus: this.itemData.organStatus,
                                organDescribe: this.itemData.organDescribe
                            }
                            apiEdit({data}).then(res => {
                                this.resetData()
                            })
                        }
                    }
                })
            },
            resetData () {
                // 置空编辑数据
                this.editData = {}
                this.showItemModal = false
                // 重置新增模态框
                this.$refs.formValidate.resetFields()
                // 操作完成之后更新机构树
                this.getTreeData()
            },
            // 取消弹窗
            cancel () {
                this.resetData()
            },
            // 启用/禁用
            operate (val) {
                let status = ''
                if (val.organStatus == 'disable') {
                    status = 'enable'
                }
                if (val.organStatus == 'enable') {
                    status = 'disable'
                }
                const data = {
                    organId: val.organId,
                    version: val.version,
                    organStatus: status
                }
                apiStatusOrg({ data }).then(res => {
                    this.$Message.success("状态更改成功")
                    // 刷新树
                    this.getTreeData()
                })
            },
            // 删除树
            remove (val) {
                const data = val.organId
                apiDeleteOrg({ data }).then(res => {
                    this.$Message.error("删除成功")
                    // 刷新树
                    this.getTreeData()
                })
            },
            // 点击树
            chickTree (val) {
                if (val.length) {
                    this.organizationId = val[0].organId
                    let data = {
                        organId: this.organizationId
                    }
                    // 将组织id存在本地
                    window.sessionStorage.setItem('organId', JSON.stringify(this.organizationId))
                    this.getRoleData(this.organizationId)
                    this.getNoRoleData(data)
                    this.getUserData(this.organizationId)
                    this.getNoUserData(data)
                }
            },
            // 添加角色
            addSole () {
                this.showModalRole = true
            },
            // 获取关联角色列表
            getRoleData (val) {
                apiGetOrganRoleData({val}).then(res => {
                    this.tableRoleData = res.data
                })
            },
            // 添加未关联角色查询
            searchRole () {
                let data = {
                    organId: this.organizationId,
                    roleName: this.itemDataRole.roleName
                }
                this.getNoRoleData(data)
            },
            // 获取未关联角色列表
            getNoRoleData (val) {
                apiGetOrganNoRoleData({ data: val }).then(res => {
                    this.addTableRoleData = res.data
                })
            },
            // 添加角色保存
            saveRole () {
                const data = {
                    organId: this.organizationId,
                    roleIds: this.checkRoleList
                }
                apiSaveOrganRole({data}).then(res => {
                    this.showModalRole = false
                    // 操作完成后刷新列表
                    this.getRoleData(this.organizationId)
                    // 重置新增模态框
                    this.$refs.formValidateRole.resetFields()
                    this.$Message.success("保存成功")
                })
            },
            // 角色解除关联
            dismissSole (row) {
                // console.log(row)
                const data = {
                    organId: this.organizationId,
                    roleId: row.roleId
                }
                apiDeleteOrganRole({ data }).then(res => {
                    this.$Message.success("解除成功")
                    // 操作完成后刷新列表
                    this.getRoleData(this.organizationId)
                })
            },
            // 添加用户
            addUser () {
                this.showModalUser = true
            },
            // 获取关联用户列表
            getUserData (val) {
                const data = {
                    size: 5,
                    page: this.page,
                    organId: val
                }
                apiGetOrganUserData({data}).then(res => {
                    this.tableUserData = res.data.content
                    this.total = res.data.totalElements
                })
            },
            // 添加用户查询
            searchUser () {
                let data = {
                    organId: this.organizationId,
                    accountName: this.itemDataUser.accountName,
                    phoneNumber: this.itemDataUser.phoneNumber
                }
                this.getNoUserData(data)
            },
            // 获取未关联用户列表
            getNoUserData (val) {
                apiGetOrganNoUserData({ data: val }).then(res => {
                    this.addTableUserData = res.data
                })
            },
            // 添加用户保存
            saveUser () {
                const data = {
                    organId: this.organizationId,
                    accountList: this.checkUserList
                }
                apiSaveOrganUserData({data}).then(res => {
                    this.showModalUser = false
                    // 操作完成后刷新列表
                    this.getUserData(this.organizationId)
                    // 重置新增模态框
                    this.$refs.formValidateUser.resetFields()
                    this.$Message.success("保存成功")
                })
            },
            // 勾选角色
            checkRoleData (val) {
                this.checkRoleList = []
                if(val.length) {
                    val.forEach(item => {
                        this.checkRoleList.push(item.roleId)
                    })
                }
            },
            // 勾选用户
            checkUserData (val) {
                this.checkUserList = []
                if(val.length) {
                    val.forEach(item => {
                        this.checkUserList.push({
                            accountId: item.accountId,
                            accountType: item.accountType
                        })
                    })
                }
            },
            // 用户解除关联
            dismissUser (row) {
                // console.log(row)
                const data = {
                    organId: this.organizationId,
                    accountId: row.accountId
                }
                apiDeleteOrganAccount({ data }).then(res => {
                    this.$Message.success("解除成功")
                    // 操作完成后刷新列表
                    this.getUserData(this.organizationId)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .ivu-tree-title {
        width: 100%;
    }
    .add-btn {
        margin: 10px 0 10px 0;
    }
    .entire {
        display: flex;
        width: 100%;
        .left-box {
            width: 49.5%;
        }
        .separate {
            width: 1%;
        }
        .right-box {
            width: 49.5%;
            .right-table {
                box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
                /deep/ .ivu-btn {
                    height: auto;
                }
                .table-btn {
                    color: #02ADB5;
                    border-radius: 15px;
                    border: 1px solid #02ADB5;
                }
            }
        }
    }
</style>
