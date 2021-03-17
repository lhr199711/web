<template>
    <div>
        <div class="btns-paginator">
            <AdtButton :allDelShow="false">
                <Button @click="add()">新增总公司
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                    </svg>
                </Button>
            </AdtButton>
        </div>
        <AdtMyModal :title="modelTitle" okText="保存" cancelText="取消" :showModal="isModalShow" @on-visible-change="addvisibleChange" @on-ok="save()" @on-cancel="cancel()">
            <Form :model="formItem" ref="formItemData" :rules="formItemRule" :label-width="100" label-colon>
                <FormItem label="公司名称" prop="organizationName">
                    <Input v-model="formItem.organizationName"></Input>
                </FormItem>
            </Form>
        </AdtMyModal>
        <div class="public-table-data">
            <Table :columns="tableColumns" :data="tableData" stripe>
                <!-- 操作 -->
                <template slot-scope="{ row, index }" slot="action">
                    <svg class="icon-action iconfont" aria-hidden="true" @click="edit(row)">
                        <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                    </svg>
                    <!-- <Icon class="icon-action" type="md-close" @click="remove(row)" /> -->
                </template>
            </Table>
        </div>
    </div>
</template>

<script>
import { apiGetOrganizationList, apiAddOrganization, apiModifyOrganization } from '@/api/organizationManage'
export default {
    data() {
        return {
            isModalShow: false,
            modelTitle: '',
            tableColumns: [
                {
                    title: '公司名称',
                    align: 'center',
                    key: 'organizationName'
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'createDatetime'
                },
                {
                    title: '操作',
                    align: 'center',
                    slot: 'action'
                }
            ],
            tableData: [],
            formItem: {},
            formItemRule: {
                organizationName: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ]
            },
            // 新增编辑区分  1为新增 2为编辑
            distinguish: 0,
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        addvisibleChange (changeStatus) {
            this.isModalShow = changeStatus
        },
        // dataInit () {
        //     this.getData()
        // },
        getData () {
            apiGetOrganizationList().then(res => {
                if (res.code == 200) {
                    this.tableData = res.data || []
                }
            })
        },
        add () {
            this.isModalShow = true
            this.distinguish = 1
            this.modelTitle = '新增总公司'
        },
        save () {
            if (this.distinguish == 1) {
                const data = {
                    organizationPid: 0,
                    organizationName: this.formItem.organizationName
                }
                this.$refs["formItemData"].validate((valid) => {
                    if (valid) {
                        apiAddOrganization({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                this.isModalShow = false
                                // 刷新列表
                                this.getData()
                            } else {
                                this.$Message.info("保存失败")
                            }
                        })
                    }
                })
            }
            if (this.distinguish == 2) {
                const data = {
                    organizationId: this.formItem.organizationId,
                    organizationName: this.formItem.organizationName
                }
                this.$refs["formItemData"].validate((valid) => {
                    if (valid) {
                        apiModifyOrganization({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                this.isModalShow = false
                                // 刷新列表
                                this.getData()
                            } else {
                                this.$Message.info("保存失败")
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
            this.isModalShow = true
            this.formItem = row
            this.distinguish = 2
            this.modelTitle = '编辑总公司'
        }
    },
}
</script>

<style lang="scss" scoped>
/deep/.ivu-form-item > .ivu-form-item-label{
    text-align: left;
}
.icon-action{
    margin: 0 10px;
}
</style>
