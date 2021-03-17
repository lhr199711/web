<template>
    <div class="treeMenu">
        <adt-my-modal
            :showModal="dialogOp.showItemModal"
            :title="dialogOp.itemTitle"
            width="750"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk"
        >
            <div class="ipt">
                <Tree ref="tree" :data="treeData" show-checkbox></Tree>
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
    import {
        apiRoleMenuTreeSelect,
        apiRoleSaveRoleMenu,
    } from '@/api/logisticsCommission'
    export default {
        name: "treeMenu",
        props: {

        },
        data () {
            return {
                dialogOp: {
                    showItemModal: false,
                    itemTitle: '配置菜单'
                },
                treeData: [],
                checkedKeys: [],
                roleId: ''
            };
        },
        created () {

        },
        mounted () {

        },
        methods: {
            // 弹框里面的取消按钮
            visibleChange (data) {
                this.dialogOp.showItemModal = data
                // this.treeData = []
            },
            // 弹框里面的确认按钮
            handleItemModalOk () {
                this.dialogOp.showItemModal = false
                const checkData = this.$refs.tree.getCheckedNodes().filter(item => item.id).map(item => item.id)
                const data = {
                    roleId: this.roleId,
                    menuIds: checkData
                }
                apiRoleSaveRoleMenu({ data }).then((res) => {
                    if (res.code == 200) {
                        this.$Message.success('操作成功')
                    }
                })

            },
            // 树递归
            _replaceTree (arr) {
                arr.forEach(item => {
                    item.title = item.label
                    item.expand = true
                    if (this.checkedKeys.indexOf(item.id) !== -1) {
                        item.checked = true
                    }
                    if (item.children) {
                        this._replaceTree(item.children)
                    }
                })
                return arr
            },
            // 打开弹框
            openDialog (roleId) {
                this.roleId = roleId
                this.dialogOp.showItemModal = true
                const data = {
                    roleId
                }
                apiRoleMenuTreeSelect({ ...data }).then((res) => {
                    if (res.code == 200) {
                        const { appMenu = [], checkedKeys = [] } = res.data
                        this.checkedKeys = checkedKeys
                        this.treeData = appMenu.map(item => {
                            return {
                                title: item.appName,
                                children: this._replaceTree(item.menuTree)
                            }
                        })
                    }
                })
            },
        }
    };
</script>

<style scoped lang="scss">
    /deep/ .ivu-tree > ul > li > label {
        display: none;
    }
    .ipt {
        width: 100%;
        height: 500px;
        @extend %scrollbar;
        overflow-y: auto;
    }
</style>
