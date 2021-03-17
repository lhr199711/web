<template>
    <div class="menu-permission">
        <Tree
            :data="treeData"
            :render="menuRender"
            children-key="menuInfoList"
            >
        </Tree>
        <!-- 删除二次确认modal -->
        <adt-reconfirm-modal
            :showModal="showDeleteModal"
            @on-visible-change="deleteVisibleChange"
            @on-ok="handleDeleteModalOk">
        </adt-reconfirm-modal>
        <!-- 新增、编辑菜单(功能)modal -->
        <adt-my-modal
            :showModal="showItemModal"
            :title="itemTitle"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk"
            width="650">
            <Form
                ref="formValidate"
                inline
                :model="itemData"
                :rules="ruleValidate"
                :label-colon="true"
                label-position="left"
                :label-width="100"
                class="two-column">
                <FormItem label="新增项" prop="menuType" v-if="showType">
                    <RadioGroup v-model="itemData.menuType" @on-change="handleChooseType">
                        <Radio label="1">
                            菜单项
                        </Radio>
                        <Radio label="2" style="margin-left: 30px;">
                            功能项
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <div class="line"></div>
                <!-- 菜单项 -->
                <FormItem label="名称" prop="menuName">
                    <Input v-model="itemData.menuName" />
                </FormItem>
                <FormItem label="编码code" prop="menuCode" style="margin-left: 55px;">
                    <Input v-model="itemData.menuCode" />
                </FormItem>
                <FormItem label="状态" prop="menuStatus">
                    <Select v-model="itemData.menuStatus">
                        <Option value="enable">可用</Option>
                        <Option value="disable">不可用</Option>
                    </Select>
                </FormItem>
                <FormItem label="页面路由URL" prop="menuRoute" style="margin-left: 55px;">
                    <Input v-model.trim="itemData.menuRoute" />
                </FormItem>
                <div v-show="itemData.menuType === '1'">
                    <div class="icon-title">选择图标</div>
                    <div class="icon-container">
                        <div :class="['icon', { active: itemData.iconCode === icon }]" v-for="(icon, index) of iconGather" :key="index" @click="chooseIcon(icon)">
                            <svg class="iconfont" aria-hidden="true">
                                <use :xlink:href="`#${icon}`"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </Form>
        </adt-my-modal>
    </div>
</template>
<script>
    import {
        apiAppInfoQueryList,
        apiMenuInfoQueryByAppCode,
        apiMenuInfoAdd,
        apiMenuInfoUpdate,
        apiMenuInfoQueryByMenuId,
        apiCargoPageHomeList
    } from '@/api/menuPermission'
    import validateRules from '@/libs/validateRules'
    export default {
        data () {
            return {
                itemTitle: '新增项',
                showItemModal: false,
                showDeleteModal: false,
                showType: true,
                parentData: '',
                editData: '',
                deleteData: {
                    root: '',
                    node: '',
                    data: ''
                },
                itemData: {
                    menuType: '',
                    menuName: '',
                    menuCode: '',
                    menuStatus: '',
                    menuRoute: '',
                    iconCode: ''
                },
                ruleValidate: {
                    menuType: [
                        validateRules.select('新增项')[0]
                    ],
                    menuName: [
                        validateRules.required('名称')[0]
                    ],
                    menuCode: [
                        validateRules.required('编码code')[0]
                    ],
                    menuStatus: [
                        validateRules.required('状态')[0]
                    ]
                    // menuRoute: [
                    //     {
                    //         required: true, message: '请输入页面路由URL'
                    //     }
                    // ]
                },
                treeData: [],
                // 图标集合
                iconGather: [
                    'icondian', 'iconADTcaidanICON_fanganbianjiqi', 'iconADTcaidanICON_chanpinguanli', 'iconADTcaidanICON_fanganchaxun', 'iconADTcaidanICON_chanpinzhongxin', 'iconADTcaidanICON_caidanguanli', 'iconADTcaidanICON_chanpinbianjiqi', 'iconADTcaidanICON_fuwuqudongqi', 'iconADTcaidanICON_gerenzhongxin',
                    'iconADTcaidanICON_wuliufanganguanli', 'iconADTcaidanICON_kehufankuizhongxin', 'iconADTcaidanICON_dingdanzhongxin', 'iconADTcaidanICON_huoyunyaoqiuguanli', 'iconADTcaidanICON_fanganshoucangjia', 'iconADTcaidanICON_shouye', 'iconADTcaidanICON_shijianchakanqi', 'iconADTcaidanICON_kehuguanli',
                    'iconADTcaidanICON_wuliuquanchengjihua', 'iconADTcaidanICON_gongyingshangguanli', 'iconADTcaidanICON_gangweijiaoseguanli', 'iconADTcaidanICON_xiaoxiguanli', 'iconADTcaidanICON_yingyongkongzhitai', 'iconADTcaidanICON_yonghuguanli', 'iconADTcaidanICON_mobanguanli', 'iconADTcaidanICON_xuqiubianjiqi',
                    'iconADTcaidanICON_zhangdanguanli', 'iconADTcaidanICON_xietongxiezuochakan', 'iconADTcaidanICON_wuliuweituoguanli', 'iconADTcaidanICON_wuliuwenjianjia', 'iconADTcaidanICON_zhihangkanban', 'iconADTcaidanICON_zhihangchakanqi', 'iconADTcaidanICON_zidianguanli', 'iconADTcaidanICON_zuzhijigouguanli',
                    'iconADTcaidanICON_zuzhiquanxianguanli', 'iconADTcaidanICON_biaozhunyingsheqi'
                ]
            }
        },
        created () {
            this.initData()
        },
        methods: {
            // 选择icon
            chooseIcon (icon) {
                this.itemData.iconCode = icon
            },
            initData () {
                // 获取应用
                apiAppInfoQueryList().then(({ data }) => {
                    this.treeData = []
                    for (const app of data) {
                        app.render = this.appRender
                        app.menuInfoList = []
                        this.treeData.push(app)
                        // 根据应用CODE查询菜单权限
                        apiMenuInfoQueryByAppCode({ path: app.appCode }).then(({ data }) => {
                            app.menuInfoList = data
                            this.recursion(app)
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
            // 递归，给每一层添加对应的render和icon（可能有）
            recursion (data) {
                // 是功能，不是菜单
                if (data.menuType === '2') {
                    data.render = this.functionRender
                }
                const menuInfoList = data.menuInfoList
                if (menuInfoList) {
                    for (const child of menuInfoList) {
                        this.recursion(child)
                    }
                }
            },
            // 应用（最外层）render
            appRender (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('span', data.appName)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
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
                                    click: () => { this.append(data) }
                                }
                            }),
                        ])
                    ])
                ]);
            },
            // 菜单render
            menuRender (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        /* // icon
                        h('svg', {
                            attrs: {
                                'aria-hidden': true
                            },
                            style: {
                                width: '16px',
                                height: '16px'
                            }
                        }, [
                            h('use', {
                                attrs: {
                                    'xlink:href': '#icon-andaotongcaidanICON_shouye'
                                }
                            })
                        ]
                        ), */
                        h('span', data.menuName)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('span', {
                            style: {
                                padding: '1px 2px',
                                fontSize: '12px',
                                borderRadius: '4px',
                                border: data.menuStatus === 'enable' ? '1px solid #02ADB5' : '1px solid #999',
                                color: data.menuStatus === 'enable' ? '#02ADB5' : '#999'
                            }
                        }, data.menuStatus === 'enable' ? '可用' : '不可用'),
                        h('Poptip', {
                            props: {
                                disabled: true,
                                trigger: 'hover',
                                placement: 'bottom',
                                content: '添加菜单项'
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
                                content: '编辑菜单项'
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
                                content: '删除菜单项'
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
            // 功能render
            functionRender (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('span', data.menuName)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
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
            // 新增菜单、功能
            append (data) {
                this.showItemModal = true
                this.parentData = data
                this.itemData.menuType = ''
                this.itemData.iconCode = ''
                this.showType = true
                this.itemTitle = '新增'
                // 重置
                this.$refs.formValidate.fields.forEach(e => {
                    e.resetField()
                })
            },
            // 编辑菜单、功能
            edit (data) {
                this.parentData = data
                this.showType = false
                this.itemTitle = '编辑'
                // apiMenuInfoQueryByMenuId({ data: data.menuId }).then(({ data }) => {
                this.editData = data
                this.itemData.menuType = data.menuType
                this.itemData.menuName = data.menuName
                this.itemData.menuCode = data.menuCode
                this.itemData.menuStatus = data.menuStatus
                this.itemData.menuRoute = data.menuRoute
                this.itemData.iconCode = data.iconCode
                this.showItemModal = true
                // })
            },
            handleItemModalOk () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        // 菜单项的icon必选
                        if (this.itemData.menuType === '1' && !this.itemData.iconCode) {
                            this.$Message.warning('请先选择图标！')
                            return
                        }
                        let promise = new Promise(resolve => {
                            // 新增
                            if (this.showType) {
                                const data = { ...this.itemData, ...{ appCode: this.parentData.appCode, menuPid: this.parentData.menuId || 0 } }
                                apiMenuInfoAdd({ data }).then(res => {
                                    // 操作成功
                                    if (res.data) {
                                        this.$Message.success(res.message)
                                        resolve()
                                    } else {
                                        this.$Message.warning(res.message)
                                    }
                                })
                            } else {
                                // 编辑
                                const data = { ...this.itemData, ...{ menuId: this.editData.menuId, menuPid: this.editData.menuPid, version: this.editData.version } }
                                apiMenuInfoUpdate({ data }).then(res => {
                                    // 操作成功
                                    if (res.data) {
                                        this.$Message.success(res.message)
                                        resolve()
                                    } else {
                                        this.$Message.warning(res.message)
                                    }
                                })
                            }
                        })
                        promise.then(() => {
                            this.showItemModal = false
                            this.initData()
                            // const menuInfoList = this.parentData.menuInfoList || []
                            // menuInfoList.push({
                            //     menuName,
                            //     render
                            // })
                            // this.$set(this.parentData, 'menuInfoList', menuInfoList)
                        })
                    }
                })
            },
            // 移除菜单、功能
            remove (root, node, data) {
                this.showDeleteModal = true
                this.deleteData = { root, node, data }
            },
            handleDeleteModalOk () {
                let menuId = this.deleteData.data.menuId
                let promise = new Promise(resolve => {
                    apiCargoPageHomeList({ data: menuId }).then(({ data }) => {
                        resolve()
                    })
                })
                promise.then(() => {
                    // this.initData()
                    this.showDeleteModal = false
                    const parentKey = this.deleteData.root.find(el => el === this.deleteData.node).parent
                    const parent = this.deleteData.root.find(el => el.nodeKey === parentKey).node
                    const index = parent.menuInfoList.indexOf(this.deleteData.data)
                    parent.menuInfoList.splice(index, 1)
                })
            },
            handleChooseType () {
                // 重置
                // this.$refs.formValidate.fields.forEach(e => {
                //     if (e.prop !== 'type') {
                //         e.resetField()
                //     }
                // })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .menu-permission {
        height: 100%;
        padding: 20px 10%;
        background-color: #fff;
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
    .icon-title {
        padding: 20px 0 12px 0;
        border-top:  1px solid $border-color;
        &:before {
            content: '*';
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 14px;
            color: #ff001b;
        }
    }
    .icon-container {
        display: flex;
        flex-wrap: wrap;
        max-height: 190px;
        margin-bottom: 30px;
        padding: 30px 0 0 10px;
        overflow-x: auto;
        background-color: $background-color;
        border-radius: 4px;
        // @extend %scrollbar-crosswise;
        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            margin: 0 0 30px 30px;
            cursor: pointer;
            &.active {
                color: $light-color;
                background-color: #fff;
                border-radius: 100%;
            }
        }
        .iconfont {
            font-size: 36px;
        }
    }
</style>
