<template>
    <div class="role">
        <ul class="titles">
            <li>公司组织结构</li>
            <li>岗位帐户</li>
        </ul>
        <div class="content">
            <div class="tree">
                <Tree
                    :data="treeData"
                    :render="positionRender"
                    @on-select-change="selectChange"
                    children-key="treeList"
                    >
                </Tree>
            </div>
            <div class="account" v-show="showRoleAccount">
                <Table stripe :columns="roleAccountColumns" :data="roleAccountData">
                    <!-- <template #accountType="{ row, index }">
                        <Select v-model="row.accountType" @on-change="chooseAccountType(row, index)">
                            <Option value="1">类型1</Option>
                            <Option value="2">类型2</Option>
                        </Select>
                    </template> -->
                    <template #phone="{ row }">
                        {{ `${row.internationalPhonePrefix} ${row.phoneNumber}` }}
                    </template>
                    <template #accountStatus="{ row }">
                        {{ row.accountStatus === 'enable' ? '可用' : '不可用' }}
                    </template>
                </Table>
            </div>
        </div>
        <!-- 删除二次确认modal -->
        <adt-reconfirm-modal
            :showModal="showDeleteModal"
            @on-visible-change="deleteVisibleChange"
            @on-ok="handleDeleteModalOk">
        </adt-reconfirm-modal>
        <!-- 新增、编辑岗位（帐户）modal -->
        <adt-my-modal
            :showModal="showItemModal"
            :title="itemTitle"
            width="80%"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk">
            <Form
                ref="formValidate"
                :model="itemData"
                :rules="ruleValidate"
                :label-colon="true"
                label-position="left"
                :label-width="120">
                <FormItem label="新增项" prop="type" v-if="showType">
                    <RadioGroup v-model="itemData.type" @on-change="changeItem">
                        <Radio label="1">
                            岗位
                        </Radio>
                        <Radio label="2" style="margin-left: 30px;">
                            帐户
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <div class="line"></div>
                <template v-if="itemData.type === '1' || !showType">
                    <FormItem label="岗位名称" prop="roleName">
                        <Input v-model="itemData.roleName" style="width: 190px;" />
                    </FormItem>
                    <FormItem label="岗位状态" prop="roleStatus">
                        <Select v-model="itemData.roleStatus" style="width: 190px;">
                            <Option value="enable">可用</Option>
                            <Option value="disable">不可用</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="岗位类型" prop="roleType">
                        <Select v-model="itemData.roleType" style="width: 190px;">
                            <Option v-for="item in roleType" :key="item.dictionaryKey" :value="item.dictionaryKey">{{item.dictionaryValue}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="岗位描述" prop="roleDescribe">
                        <Input type="textarea" v-model="itemData.roleDescribe" style="width: 50%;" />
                    </FormItem>
                </template>
                <template v-if="itemData.type === '2'">
                    <!-- <div class="search">
                        <Form
                            :label-colon="true"
                            label-position="left"
                            inline
                            :label-width="80">
                            <FormItem label="帐户名称">
                                <Input v-model="search.accountName" />
                            </FormItem>
                            <FormItem label="手机号码">
                                <Input v-model="search.phoneNumber" />
                            </FormItem>
                            <Button shape="circle" @click="searchAccount" style="margin-left: 30px;">{{$t('common.searchBtn')}}<Icon type="ios-search" /></Button>
                        </Form>
                    </div> -->
                    <Table stripe :columns="accountColumns" :data="accountData" @on-selection-change="selectAccount">
                        <template #accountType="{ row, index }">
                            <Select v-model="row.accountType" @on-change="chooseAccountType(row, index)">
                            <Option v-for="item in accountType" :key="item.dictionaryKey" :value="item.dictionaryKey">{{item.dictionaryValue}}</Option>
                        </Select>
                        </template>
                        <template #phone="{ row }">
                            {{ `${row.internationalPhonePrefix} ${row.phoneNumber}` }}
                        </template>
                        <template #accountStatus="{ row }">
                            {{ row.accountStatus === 'enable' ? '可用' : '不可用' }}
                        </template>
                    </Table>
                </template>
            </Form>
        </adt-my-modal>
        <!-- 配置岗位权限modal -->
        <adt-my-modal
            :showModal="showPermissionModal"
            :title="permissionTitle"
            @on-ok="handlePermissionModalOk"
            @on-visible-change="permissionVisibleChange">
            <ul class="position-info">
                <li>岗位名称：{{ positionInfo.name }}</li>
                <li>上级部门：{{ positionInfo.departmentName }}</li>
            </ul>
            <Tree
                :data="permissionData"
                :show-checkbox="true"
                :render="permissionRender"
                children-key="menuInfoList"
                ref="permissionTree"
                class="permission-tree"
                >
            </Tree>
        </adt-my-modal>
    </div>
</template>
<script>
    import {
        apiGetOrganizationList,
        apiGetRoleInfoTree,
        apiAddRoleInfo,
        apiModifyRoleInfo,
        apiDeleteRoleInfo,
        apiAddRoleAccount,
        apiAddRoleAndMenu,
        apiMenuInfoQueryByOrganizationId,
        apiAccountQueryRoleList,
        apiAccountQueryList
    } from '@/api/role'
    import validateRules from '@/libs/validateRules'
    export default {
        data () {
            return {
                accountType: this.$getDictionary('ACCOUNT_TYPE'),
                roleType: this.$getDictionary('ROLE_TYPE'),
                showCheckbox: false,
                itemTitle: '新增项',
                accountTitle: '选择帐户',
                permissionTitle: '配置岗位权限',
                showItemModal: false,
                showDeleteModal: false,
                showAccountModal: false,
                showPermissionModal: false,
                showType: true,
                showRoleAccount: false,
                search: {
                    accountName: '',
                    phoneNumber: ''
                },
                positionInfo: {
                    name: '',
                    departmentName: ''
                },
                accountData: [],
                roleAccountData: [],
                // 选中的row
                selectedData: [],
                parentData: '',
                editData: '',
                deleteData: {
                    root: '',
                    node: '',
                    data: ''
                },
                itemData: {
                    type: '',
                    roleName: '',
                    roleStatus: '',
                    roleType: '',
                    roleDescribe: ''
                },
                ruleValidate: {
                    type: [
                        validateRules.select('新增项')[0]
                    ],
                    roleName: [
                        validateRules.required('岗位名称')[0]
                    ],
                    roleStatus: [
                        validateRules.select('岗位状态')[0]
                    ],
                    roleType: [
                        validateRules.select('岗位类型')[0]
                    ],
                    roleDescribe: [
                        validateRules.required('岗位描述')[0]
                    ]
                },
                treeData: [],
                // 菜单权限tree数据
                permissionData: [],
                // 如果是公司，只能添加岗位
                isCompany: false
            }
        },
        created () {
            this.initData()
        },
        computed: {
            accountColumns () {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户帐号',
                        key: 'accountName',
                        align: 'center'
                    },
                    {
                        title: '手机号码',
                        slot: 'phone',
                        align: 'center'
                    },
                    {
                        title: '邮箱',
                        key: 'accountEmail',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'accountStatus',
                        align: 'center'
                    },
                    {
                        title: '帐户类型',
                        slot: 'accountType',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createDatetime',
                        align: 'center'
                    },
                    {
                        title: '创建人',
                        key: 'createBy',
                        align: 'center'
                    },
                ]
            },
            roleAccountColumns () {
                return [
                    {
                        title: '用户帐号',
                        key: 'accountName',
                        align: 'center'
                    },
                    {
                        title: '手机号码',
                        slot: 'phone',
                        align: 'center'
                    },
                    {
                        title: '邮箱',
                        key: 'accountEmail',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'accountStatus',
                        align: 'center'
                    },
                    {
                        title: '帐户类型',
                        key: 'accountType',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createDatetime',
                        align: 'center'
                    },
                    {
                        title: '创建人',
                        key: 'createBy',
                        align: 'center'
                    },
                ]
            }
        },
        methods: {
            initData () {
                // 查询岗位机构信息
                apiGetOrganizationList().then(({ data }) => {
                    this.treeData = []
                    // this.treeData = data
                    for (const app of data) {
                        app.render = this.companyRender
                        app.treeList = []
                        this.treeData.push(app)
                        // 查询岗位角色信息
                        apiGetRoleInfoTree({ path: app.organizationId }).then(({ data }) => {
                            app.treeList = data
                        })
                    }
                })
            },
            visibleChange (data) {
                this.showItemModal = data
            },
            deleteVisibleChange (data) {
                this.showDeleteModal = data
            },
            accountVisibleChange (data) {
                this.showAccountModal = data
            },
            permissionVisibleChange (data) {
                this.showPermissionModal = data
            },
            // 总公司（最外层）render
            companyRender (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('svg', {
                            attrs: {
                                'aria-hidden': true
                            },
                            style: {
                                width: '16px',
                                height: '16px',
                                marginRight: '8px',
                                position: 'relative',
                                top: '3px'
                            }
                        }, [
                            h('use', {
                                attrs: {
                                    'xlink:href': '#icon-andaotongV3ICON_gongsichaxun'
                                }
                            })
                        ]),
                        h('span', data.organizationName)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '20px'
                        }
                    }, [
                        h('Poptip', {
                            props: {
                                disabled: true,
                                trigger: 'hover',
                                placement: 'bottom',
                                content: '添加下级',
                            }
                        }, [
                            h('Icon', {
                                props: {
                                    type: 'ios-add'
                                },
                                style: {
                                    fontSize: '24px'
                                },
                                on: {
                                    click: () => { this.append(data, 'company') }
                                }
                            }),
                        ])
                    ])
                ]);
            },
            // 岗位render
            positionRender (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('svg', {
                            attrs: {
                                'aria-hidden': true
                            },
                            style: {
                                width: '16px',
                                height: '16px',
                                marginRight: '8px',
                                position: 'relative',
                                top: '3px'
                            }
                        }, [
                            h('use', {
                                attrs: {
                                    'xlink:href': '#icon-andaotongV3ICON_bumen'
                                }
                            })
                        ]),
                        h('span', data.roleName)
                        // h('span', {
                        //     props: {
                        //         type: 'text',
                        //         value: data.roleName
                        //     },
                        //     on: {
                        //         click: () => { this.getRoleAccount(data) }
                        //     }
                        // })
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '20px'
                        }
                    }, [
                        h('Poptip', {
                            props: {
                                disabled: true,
                                trigger: 'hover',
                                placement: 'bottom',
                                content: '分配权限'
                            }
                        }, [
                            h('Icon', {
                                props: {
                                    type: 'ios-options-outline'
                                },
                                style: {
                                    fontSize: '16px',
                                    position: 'relative',
                                    top: '-2px'
                                },
                                on: {
                                    click: () => { this.setPermission(root, node, data) }
                                }
                            }),
                        ]),
                        h('Poptip', {
                            props: {
                                disabled: true,
                                trigger: 'hover',
                                placement: 'bottom',
                                content: '选择帐户'
                            }
                        }, [
                            h('Icon', {
                                props: {
                                    type: 'ios-add'
                                },
                                style: {
                                    fontSize: '24px'
                                },
                                on: {
                                    click: () => { this.append(data) }
                                }
                            }),
                        ]),
                        h('Poptip', {
                            props: {
                                disabled: true,
                                trigger: 'hover',
                                placement: 'bottom',
                                content: '编辑功能'
                            }
                        }, [
                            h('Icon', {
                                props: {
                                    type: 'md-create'
                                },
                                style: {
                                    fontSize: '16px',
                                    position: 'relative',
                                    top: '-3px'
                                },
                                on: {
                                    click: () => { this.edit(data) }
                                }
                            }),
                        ]),
                        h('Poptip', {
                            props: {
                                disabled: true,
                                trigger: 'hover',
                                placement: 'bottom',
                                content: '删除功能'
                            }
                        }, [
                            h('Icon', {
                                props: {
                                    type: 'ios-close'
                                },
                                style: {
                                    fontSize: '24px'
                                },
                                on: {
                                    click: () => { this.remove(root, node, data) }
                                }
                            }),
                        ])
                    ])
                ]);
            },
            // 权限render
            permissionRender (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('span', data.appName || data.menuName)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '20px'
                        }
                    })
                ]);
            },
            // 新增岗位、帐户
            append (data, isCompany) {
                // 重置
                this.$refs.formValidate.fields.forEach(e => {
                    e.resetField()
                })
                this.itemTitle = '新增'
                this.showItemModal = true
                this.parentData = data
                this.itemData.type = ''
                this.showType = true
                // 总公司（最外层）只能添加岗位
                if (isCompany) {
                    this.showType = false
                    this.isCompany = true
                } else {
                    this.isCompany = false
                }
            },
            // 编辑当前岗位信息
            edit (data) {
                // 重置
                this.$refs.formValidate.fields.forEach(e => {
                    e.resetField()
                })
                this.itemTitle = '编辑'
                this.showItemModal = true
                this.editData = data
                this.showType = false
                this.itemData.type = ''
                this.itemData.roleName = data.roleName
                this.itemData.roleStatus = data.roleStatus
                this.itemData.roleType = data.roleType
                this.itemData.roleDescribe = data.roleDescribe
            },
            handleItemModalOk () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        // 添加岗位
                        let promise = new Promise(resolve => {

                            // 新增
                            if (this.showType || this.isCompany) {
                                // 新增岗位
                                if (this.itemData.type === '1' || this.isCompany) {
                                    const data = { ...this.itemData, ...{ organizationId: this.parentData.organizationId, rolePid: this.parentData.roleId || 0 } }
                                    delete data.type
                                    apiAddRoleInfo({ data }).then(({ data }) => {
                                        resolve()
                                    })
                                } else {
                                    // 选择帐户
                                    let [roleId, data] = [this.parentData.roleId, []]
                                    for (const item of this.selectedData) {
                                        if (!item.accountType) {
                                            this.$Message.warning('请给所有选中的帐户选择帐户类型')
                                            return
                                        }
                                        data.push({
                                            roleId,
                                            accountId: item.accountId,
                                            accountType: item.accountType
                                        })
                                    }
                                    // if (data.length) {
                                    //     apiAddRoleAccount({ data }).then(({ data }) => {
                                    //         resolve()
                                    //     })
                                    // } else {
                                    //     this.$Message.info('请先选择帐户')
                                    // }
                                    // 可以不选帐户
                                    if (!data.length) {
                                        data.push({
                                            roleId,
                                            accountId: null,
                                            accountType: null
                                        })
                                    }
                                    apiAddRoleAccount({ data }).then(({ data }) => {
                                        resolve()
                                    })
                                }
                            } else {
                                // 编辑
                                const data = { ...this.itemData, ...{ roleId: this.editData.roleId, version: this.editData.version, rolePid: this.editData.rolePid } }
                                delete data.type
                                apiModifyRoleInfo({ data }).then(({ data }) => {
                                    resolve()
                                })
                            }
                        })
                        promise.then(() => {
                            this.showItemModal = false
                            this.initData()
                            // const children = this.parentData.children || []
                            // children.push({
                            //     title,
                            //     render,
                            //     id,
                            //     isPosition,
                            // })
                            // this.$set(this.parentData, 'children', children)
                        })
                    }
                })
            },
            // 移除岗位、帐户
            remove (root, node, data) {
                this.showDeleteModal = true
                this.deleteData = { root, node, data }
            },
            handleDeleteModalOk () {
                let roleId = this.deleteData.data.roleId
                let promise = new Promise(resolve => {
                    apiDeleteRoleInfo({ data: roleId }).then(({ data }) => {
                        resolve()
                    })
                })
                promise.then(() => {
                    // this.initData()
                    this.showDeleteModal = false
                    const parentKey = this.deleteData.root.find(el => el === this.deleteData.node).parent
                    const parent = this.deleteData.root.find(el => el.nodeKey === parentKey).node
                    const index = parent.treeList.indexOf(this.deleteData.data)
                    parent.treeList.splice(index, 1)
                })
            },
            // 设置权限
            setPermission (root, node, data) {
                this.parentData = data
                const parentKey = root.find(el => el === node).parent
                const parent = root.find(el => el.nodeKey === parentKey).node
                this.positionInfo.departmentName = parent.roleName || parent.organizationName
                this.positionInfo.name = data.roleName
                apiMenuInfoQueryByOrganizationId({ data: { organizationId: data.organizationId, roleId: data.roleId } }).then(({ data }) => {
                    this.showPermissionModal = true
                    // 当处于半选状态时，后端返回的checked还是true，需要判断当前级的下级是否全部选中，如果有没选中的，将当前级的checked设为false
                    for (const menu of data[0].menuInfoList) {
                        if (menu.checked) {
                            recursion(menu)
                        }
                    }
                    // 递归
                    function recursion (menu) {
                        const menuInfoList = menu.menuInfoList || []
                        for (const subMenu of menuInfoList) {
                            if (!subMenu.checked) {
                                menu.checked = false
                            } else {
                                recursion(subMenu)
                            }
                        }
                    }
                    this.permissionData = data
                })
            },
            handlePermissionModalOk () {
                let data = []
                // getCheckedNodes获取所有选中的节点
                // const permission = this.$refs.permissionTree.getCheckedNodes()
                // getCheckedNodes获取所有选中和半选的节点
                const permission = this.$refs.permissionTree.getCheckedAndIndeterminateNodes()
                if (!permission.length) {
                    data.push({
                        roleId: this.parentData.roleId,
                        menuId: null
                    })
                    // this.showPermissionModal = false
                    // return
                } else {
                    for (let item of permission) {
                        if (item.menuId) {
                            data.push({
                                roleId: this.parentData.roleId,
                                menuId: item.menuId
                                // indeterminate: item.indeterminate ? 1 : 0
                            })
                        }
                    }
                }
                apiAddRoleAndMenu({ data }).then(res => {
                    this.showPermissionModal = false
                    this.$Message.success(res.message)
                })
            },
            // 搜索帐户
            searchAccount () {
                apiAccountQueryList({ data:  { ...this.search, organizationId: this.parentData.organizationId } }).then(({ data }) => {
                    this.accountData = data.content
                })
            },
            // 选择帐户
            selectAccount (selection) {
                this.selectedData = selection
            },
            // 选择帐户类型
            chooseAccountType (row, index) {
                // 将改行改变后的数据更新到accountData，后续选中才有数据
                this.accountData[index] = row
                // 先选中，再选择帐户类型，需要手动改变选中的帐户的帐户类型
                for (const item of this.selectedData) {
                    if (item.accountId === row.accountId) {
                        item.accountType = row.accountType
                        break
                    }
                }
            },
            // 岗位、帐户切换
            changeItem (type) {
                if (type === '2') {
                    // 获取岗位下的帐户
                    apiAccountQueryRoleList({ data: { organizationId: this.parentData.organizationId, roleId: this.parentData.roleId, size: '100', direction: 'desc' } }).then(({ data }) => {
                        this.selectedData = []
                        // 根据帐户类型有没有选择来判断是不是岗位下的帐户
                        const tempData = data.content.length > 0 ? data.content : []
                        for (const account of tempData) {
                            if (account.accountType) {
                                account._checked = true
                                this.selectedData.push({
                                    accountId: account.accountId,
                                    accountType: account.accountType
                                })
                            }
                        }
                        this.accountData = tempData
                        this.showAccountModal = true
                    })
                }
            },
            getRoleAccount (data) {
                console.log(data)
            },
            selectChange (data, curData) {
                // 点击总公司，不需要去获取帐户
                if (!curData.roleId) {
                    return
                }
                this.showRoleAccount = true
                apiAccountQueryRoleList({ data: { organizationId: curData.organizationId, roleId: curData.roleId, size: '100', direction: 'desc' } }).then(({ data }) => {
                        const accountArr = []
                        // 根据帐户类型有没有选择来判断是不是岗位下的帐户
                        const tempData = data.content.length > 0 ? data.content : []
                        for (const account of tempData) {
                            if (account.accountType) {
                                accountArr.push(account)
                            } else {
                                break
                            }
                        }
                        this.roleAccountData = accountArr
                    })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .role {
        min-height: 100%;
        .titles {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            li {
                width: 35%;
                margin-left: 30px;
                & + li {
                    width: 65%;
                }
            }
        }
        .content {
            display: flex;
            min-height: 100%;
            padding: 16px;
            background-color: #fff;
            .tree {
                width: 35%;
                padding-right: 15px;
            }
            .account {
                width: 65%;
                padding-left: 15px;
                margin-left: 15px;
                border-left: 1px solid $border-color;
            }
        }
    }
    /deep/ .ivu-tree-title {
        width: 100%;
    }
    div + .line {
        border-top: 1px solid $border-color;
        margin-bottom: 12px;
    }
    /deep/ .ivu-poptip {
        margin-left: 12px;
    }
    .position-info {
        display: flex;
        margin-bottom: 12px;
        li + li {
            margin-left: 40px;
        }
    }
    .permission-tree /deep/ .ivu-tree-title{
        width: 400px;
    }

    .role /deep/ .ivu-modal {
        max-height: 80%;
    }
 </style>
