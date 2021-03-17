<template>
    <div>
        <adt-search-folder
            :searchRouter="{ query: search }"
            :isTitle="false"
        >
            <template slot="always-show">
                <Col span="6" class="form-item">
                    <span>合作伙伴名称:</span>
                    <Input v-model="search.partnerName" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="add()">
                    录入合作伙伴
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
        <Drawer
            v-model="isModalShow"
            width="1100"
        >
            <h3>{{ isAdd ? '录入合作伙伴信息' : '编辑合作伙伴信息' }}</h3>
            <Form
                :model="formItem"
                :rules="ruleInline"
                label-position="top"
                ref="formItemRef"
                label-colon
            >
                <Row>
                    <Col span="12">
                        <FormItem label="合作伙伴名称" prop="partnerName">
                            <Input v-model="formItem.partnerName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="联系电话" prop="partnerPhone">
                           <Input v-model="formItem.partnerPhone"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="代码" prop="partnerCode">
                            <Input v-model="formItem.partnerCode"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="地址" prop="partnerAddr">
                           <Input v-model="formItem.partnerAddr"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="传真" prop="partnerFax">
                            <Input v-model="formItem.partnerFax"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="邮箱" prop="partnerEmail">
                           <Input v-model="formItem.partnerEmail"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <!-- <Row>
                    <Button>上传授权书</Button>
                </Row> -->
            </Form>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="handleItemModalOk">确定</Button>
                <Button shape="circle" size="large" @click="cancel">取消</Button>
            </div>
        </Drawer>
        <div class="public-table-data">
            <Table
                :columns="tableColumns"
                :data="tableData"
                stripe
            >
                <template slot-scope="{ row, index }" slot="action">
                    <span title="编辑">
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
                    <!-- <span>
                        <Button
                            size="small"
                            shape="circle"
                            @click="viewAuthorization(row)"
                        >
                        查看授权书</Button
                        >
                    </span>
                    <span>
                        <Button
                            size="small"
                            shape="circle"
                            @click="addAuthorization(row)"
                            >
                        上传授权书</Button>
                    </span> -->
                </template>
            </Table>
        </div>
    </div>
</template>

<script>
    import paginator from '@/mixins/paginator'
    import validateRules from '@/libs/validateRules'
    import { tableColumns } from './data'
    import {
        apiAddPartner,
        apiDeletePartner,
        apiEditPartner,
        apiGetPartnerList,
        apiLook
    } from '@/api/user-center-manage/inforMaintenance'
import { formItem } from '../../standard-mapper/basics-task/data'
    export default {
        mixins: [paginator],
        props: {
            partnerName: ''
        },
        data () {
            return {
                // 新增编辑
                isAdd: true,
                // 新增弹窗
                isModalShow: false,
                // 新增编辑的form表单
                formItem: {
                    partnerName: '',
                    partnerPhone: '',
                    partnerCode: '',
                    partnerAddr: '',
                    partnerFax: '',
                    partnerEmail: ''
                },
                // 新增编辑的form表单校验
                ruleInline: {
                    partnerName: [validateRules.required('发货人名称')[0]],
                    partnerPhone: [validateRules.required('联系电话')[0], validateRules.phone('正确的电话号码')[0]],
                    partnerAddr: [validateRules.required('地址')[0]],
                },
                // 区分当前是否可以调用接口
                search: {
                    partnerName: this.partnerName,
                },
                // billsCode: '',
                // 单据
                tableColumns,
                tableData: []
            }
        },
        methods: {
            dataInit () {
                this.getData()
            },
            // 获取列表
            // 该方法在minx里面有定义
            getData () {
                const data = {
                    partnerName: this.search.partnerName,
                    page: this.page
                }
                apiGetPartnerList({ data: data }).then(res => {
                    this.tableData = res.data.content || []
                    this.total = res.data.totalElements
                })
            },
            // 查看授权书
            viewAuthorization (row) {
                const data = {
                    accountId: row.accountId,
                    version: row.version
                }
                apiLook({ data }).then((res) => {
                    if (res.partnerCode == 200) {
                        this.getData()
                        this.$Message.success('操作成功')
                        return
                    }
                    this.$Message.error(`${res.message}`)
                })
            },
            // 编辑
            edit (row) {
                this.isAdd = false
                this.isModalShow = true
                // 深拷贝是为了解决取消编辑时，重置from表单，该条表格数据也会被重置
                this.formItem = JSON.parse(JSON.stringify(row))
            },
            // 新增
            add () {
                this.isAdd = true
                this.isModalShow = true
            },
            // 弹框里面的确认按钮
            handleItemModalOk () {
                this.$refs.formItemRef.validate((valid) => {
                    if (valid) {
                        const data = { ...this.formItem }
                        console.log(data)
                        // 新增
                        if (this.isAdd) {
                            console.log(data)
                            apiAddPartner({ data }).then(res => {
                                this.successFn()
                            })
                        } else {
                            apiEditPartner({ data }).then(res => {
                                this.successFn()
                            })
                        }
                    }
                })
            },
            // 保存成功后的操作
            successFn () {
                // 关闭弹窗
                this.isModalShow = false
                // 刷新列表
                this.getData()
                this.$Message.success('操作成功')
                // 重置form表单
                this.$refs.formItemRef.resetFields()
            },
            // 新增取消
            cancel () {
                // 关闭弹窗
                this.isModalShow = false
                // 重置form表单
                this.$refs.formItemRef.resetFields()
                // 刷新列表——避免编辑取消后，表格数据被清空
                // this.getData()
            },
        },
    }
</script>

<style lang="scss" scoped>
    // /deep/.public-transit .select-transit {
    //     width: 100%;
    // }
    // .ivu-modal-content /deep/.modal-footer {
    //     margin-top: 20px;
    // }
</style>
