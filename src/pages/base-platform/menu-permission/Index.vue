<template>
    <div class="menu-permission">
        <Button style="margin-bottom: 20px" @click="fuadd"
            >新增一级菜单
            <svg class="iconfont" aria-hidden="true">
                <use xlink:href="#icon-andaotongV3ICON_tianjia"></use></svg
        ></Button>
        <Tree :data="treeData" :render="renderContent"> </Tree>
        <adt-my-modal
            :showModal="modalOption.isShowModal"
            :title="modalOption.modalTitle"
            :width="modalOption.width"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk"
        >
            <Form
                ref="menuFormName"
                :model="menuForm"
                :rules="menuFormruleValidate"
                :label-width="100"
            >
                <Row>
                    <Col span="12">
                        <FormItem label="菜单编码：" prop="menuCode">
                            <Input
                                v-model="menuForm.menuCode"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="菜单名称：" prop="menuName">
                            <Input
                                v-model="menuForm.menuName"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="菜单状态：" prop="menuStatus">
                            <Select v-model="menuForm.menuStatus">
                                <Option value="enable">可用</Option>
                                <Option value="disable">不可用</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="路由：" prop="menuRoute">
                            <Input
                                v-model="menuForm.menuRoute"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="排序值：" prop="sortPrice">
                            <Input
                                v-model="menuForm.sortPrice"
                                type="number"
                                class="number"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <div>
                    <div class="icon-title">选择图标</div>
                    <div class="icon-container">
                        <div
                            :class="[
                                'icon',
                                { active: menuForm.iconCode === icon },
                            ]"
                            v-for="(icon, index) of iconGather"
                            :key="index"
                            @click="chooseIcon(icon)"
                        >
                            <svg class="iconfont" aria-hidden="true">
                                <use :xlink:href="`#${icon}`"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </Form>
        </adt-my-modal>
        <!-- 新增功能 -->
        <adt-my-modal
            :showModal="modalFunOption.isShowModal"
            :title="modalFunOption.modalTitle"
            :width="modalFunOption.width"
            @on-visible-change="FunvisibleChange"
            @on-ok="FunhandleItemModalOk"
        >
            <Form
                ref="funFormName"
                :model="menuForm"
                :rules="menuFormruleValidate"
                :label-width="100"
            >
                <Row>
                    <Col span="12">
                        <FormItem label="功能编码：" prop="menuCode">
                            <Input
                                v-model="menuForm.menuCode"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="请求链接：" prop="menuRoute">
                            <Input
                                v-model="menuForm.menuRoute"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="状态：" prop="menuStatus">
                            <Select v-model="menuForm.menuStatus">
                                <Option value="enable">可用</Option>
                                <Option value="disable">不可用</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="功能名称：" prop="menuName">
                            <Input
                                v-model="menuForm.menuName"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </adt-my-modal>
    </div>
</template>

<script>
    import {
        apiMenuAdd,
        apiMenuList,
        apiMenuEdit,
        apiMenuDelete,
    } from '@/api/logisticsCommission'
    export default {
        name: "",
        data () {
            return {
                treeData: [],
                buttonProps: {
                    type: 'default',
                    size: 'small',
                },
                modalOption: {
                    isShowModal: false,
                    width: "800px",
                    modalTitle: ''
                },
                modalFunOption: {
                    isShowModal: false,
                    width: "800px",
                    modalTitle: ''
                },
                menuForm: {},
                menuFormruleValidate: {},
                // 图标集合
                iconGather: [
                    'icondian', 'iconADTcaidanICON_fanganbianjiqi', 'iconADTcaidanICON_chanpinguanli', 'iconADTcaidanICON_fanganchaxun', 'iconADTcaidanICON_chanpinzhongxin', 'iconADTcaidanICON_caidanguanli', 'iconADTcaidanICON_chanpinbianjiqi', 'iconADTcaidanICON_fuwuqudongqi', 'iconADTcaidanICON_gerenzhongxin',
                    'iconADTcaidanICON_wuliufanganguanli', 'iconADTcaidanICON_kehufankuizhongxin', 'iconADTcaidanICON_dingdanzhongxin', 'iconADTcaidanICON_huoyunyaoqiuguanli', 'iconADTcaidanICON_fanganshoucangjia', 'iconADTcaidanICON_shouye', 'iconADTcaidanICON_shijianchakanqi', 'iconADTcaidanICON_kehuguanli',
                    'iconADTcaidanICON_wuliuquanchengjihua', 'iconADTcaidanICON_gongyingshangguanli', 'iconADTcaidanICON_gangweijiaoseguanli', 'iconADTcaidanICON_xiaoxiguanli', 'iconADTcaidanICON_yingyongkongzhitai', 'iconADTcaidanICON_yonghuguanli', 'iconADTcaidanICON_mobanguanli', 'iconADTcaidanICON_xuqiubianjiqi',
                    'iconADTcaidanICON_zhangdanguanli', 'iconADTcaidanICON_xietongxiezuochakan', 'iconADTcaidanICON_wuliuweituoguanli', 'iconADTcaidanICON_wuliuwenjianjia', 'iconADTcaidanICON_zhihangkanban', 'iconADTcaidanICON_zhihangchakanqi', 'iconADTcaidanICON_zidianguanli', 'iconADTcaidanICON_zuzhijigouguanli',
                    'iconADTcaidanICON_zuzhiquanxianguanli', 'iconADTcaidanICON_biaozhunyingsheqi'
                ],
                menuPid: '0',
                menuType: 1,
                isEdit: false
            };
        },
        watch: {
            // 'modalOption.isShowModal' (newValue, oldValue) {
            //     if(!oldValue && !this.isEdit){
            //         this.$refs.menuFormName.resetFields();
            //         this.$refs.funFormName.resetFields();
            //     }
            // },
            // 'modalFunOption.isShowModal' (newValue, oldValue) {
            //     if(!oldValue && !this.isEdit){
            //         this.$refs.menuFormName.resetFields();
            //         this.$refs.funFormName.resetFields();
            //     }
            // }
        },
        computed: {
            cptAppCode () {
                return this.$route.query.appCode
            },
        },
        created () {
            this.getData()
        },
        mounted () {

        },
        methods: {
            // 树递归
            _replaceTree (arr) {
                arr.forEach(item => {
                    // item.expand = true
                    if (item.children) {
                        this._replaceTree(item.children)
                    }
                })
                return arr
            },
            getData () {
                const data = {
                    appCode: this.cptAppCode
                }
                apiMenuList({ ...data }).then(res => {
                    if (res.code == 200) {
                        this.treeData = this._replaceTree(res.data)
                    }
                })
            },
            // 选择icon
            chooseIcon (icon) {
                this.$set(this.menuForm, 'iconCode', icon)
            },
            // 菜单弹框里面的取消按钮
            visibleChange (data) {
                this.modalOption.isShowModal = data
            },
            // 菜单弹框里面的确认按钮
            handleItemModalOk () {
                this.modalOption.isShowModal = false
                if (this.isEdit) {
                    this.addEditMenu(apiMenuEdit)
                    return
                }
                this.addEditMenu(apiMenuAdd)

            },
            // 功能弹框里面的取消按钮
            FunvisibleChange (data) {
                this.modalFunOption.isShowModal = data
            },
            // 功能弹框里面的确认按钮
            FunhandleItemModalOk () {
                this.modalFunOption.isShowModal = false
                if (this.isEdit) {
                    this.addEditMenu(apiMenuEdit)
                    return
                }
                this.addEditMenu(apiMenuAdd)
            },
            // 新增/修改
            addEditMenu (api) {
                const data = {
                    ...this.menuForm,
                    appCode: this.cptAppCode,
                    menuPid: this.menuPid,
                    menuType: this.menuType // 1 菜单 2功能
                }
                api({ data }).then(res => {
                    if (res.code == 200) {
                        this.$Message.success('操作成功')
                        // 重置
                        this.$refs.menuFormName.resetFields();
                        this.$refs.funFormName.resetFields();
                        this.getData()
                        this.isEdit = false
                    }
                }).catch(res => {
                    this.$refs.menuFormName.resetFields();
                    this.$refs.funFormName.resetFields();
                    this.getData()
                    this.isEdit = false
                })
            },
            renderContent (h, { root, node, data }) {
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
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                // icon: 'ios-add',
                            }),
                            style: {
                                width: '64px'
                            },
                            on: {
                                click: () => { this.MenuDelete(data) }
                            }
                        }, '删除')
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                // type: 'primary'
                            }),
                            style: {
                                width: '64px'
                            },
                            on: {
                                click: () => { this.edit(data) }
                            }
                        }, '修改')
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                type: 'primary'
                            }),
                            style: {
                                width: '120px'
                            },
                            on: {
                                click: () => { this.childrenAddMenu(data) }
                            }
                        }, '添加下级菜单')
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                // icon: 'ios-add',
                                type: 'primary'
                            }),
                            style: {
                                width: '120px'
                            },
                            on: {
                                click: () => { this.funAppend(data) }
                            }
                        }, '添加下级功能')
                    ]),
                ]);
            },
            // 修改
            edit (data) {
                this.isEdit = true
                if (data.menuType == 1) {
                    this.modalOption.isShowModal = true
                    this.modalOption.modalTitle = '修改菜单'
                    this.menuType = 1
                }
                if (data.menuType == 2) {
                    this.modalFunOption.isShowModal = true
                    this.modalFunOption.modalTitle = '修改功能'
                    this.menuType = 2
                }
                this.menuForm = data
                this.menuPid = data.menuPid
            },
            // 添加下级菜单
            childrenAddMenu (data) {
                this.modalOption.isShowModal = true
                this.modalOption.modalTitle = '新增下级菜单'
                this.menuPid = data.menuId
                this.menuType = 1
                this.menuForm = {}
            },
            // 新增下级功能
            funAppend (data) {
                this.modalFunOption.isShowModal = true
                this.modalFunOption.modalTitle = '新增下级功能'
                this.menuPid = data.menuId
                this.menuType = 2
                this.menuForm = {}
            },
            MenuDelete (data) {
                const obj = {
                    menuId: data.menuId
                }
                apiMenuDelete({ ...obj }).then(res => {
                    if (res.code == 200) {
                        this.$Message.success('删除成功')
                        this.getData()
                    }
                })
            },
            // 父级的新增
            fuadd () {
                this.modalOption.isShowModal = true
                this.modalOption.modalTitle = '新增一级菜单'
                // 重置
                this.menuPid = '0'
            },
        }
    };
</script>

<style scoped lang="scss">
    /deep/ .ivu-tree-title {
        width: 100%;
    }
    /deep/.number input::-webkit-outer-spin-button,
    /deep/.number input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    /deep/.number input[type='number'] {
        -moz-appearance: textfield;
    }
    .menu-permission {
        height: 100%;
        padding: 20px 10%;
        background-color: #fff;
    }
    .icon-title {
        padding: 20px 0 12px 0;
        border-top: 1px solid $border-color;
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
