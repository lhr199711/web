<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>查看收发货人通知人信息</h3>
            <div class="sender-info">
                <h6>发货人信息</h6>
                <Form
                    :model="senderFormItem"
                    ref="senderFormItemData"
                    label-colon
                >
                    <Row :gutter="20">
                        <Col span="8">
                            <FormItem label="发货人名称" prop="attenName">
                                {{ senderFormItem.attenName }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="联系电话" prop="attenTel">
                               {{ senderFormItem.attenTel }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="代码" prop="code">
                               {{ senderFormItem.code }}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="8">
                            <FormItem label="地址" prop="attenAddr">
                               {{ senderFormItem.attenAddr }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="传真" prop="attenFax">
                               {{ senderFormItem.attenFax }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="邮箱" prop="attenEmail">
                               {{ senderFormItem.attenEmail }}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="taker-info">
                <h6>收货人信息</h6>
                <Form
                    :model="takerFormItem"
                    ref="takerFormItemData"
                    label-colon
                >
                    <Row :gutter="20">
                        <Col span="8">
                            <FormItem label="发货人名称" prop="attenName">
                                {{ takerFormItem.attenName }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="联系电话" prop="attenTel">
                               {{ takerFormItem.attenTel }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="代码" prop="code">
                               {{ takerFormItem.code }}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="8">
                            <FormItem label="地址" prop="attenAddr">
                               {{ takerFormItem.attenAddr }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="传真" prop="attenFax">
                               {{ takerFormItem.attenFax }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="邮箱" prop="attenEmail">
                               {{ takerFormItem.attenEmail }}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="notifier-info">
                <h6>通知人信息</h6>
                <Form
                    :model="notifierFormItem"
                    ref="notifierFormItemData"
                    label-colon
                >
                    <Row :gutter="20">
                        <Col span="8">
                            <FormItem label="发货人名称" prop="attenName">
                                {{ notifierFormItem.attenName }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="联系电话" prop="attenTel">
                               {{ notifierFormItem.attenTel }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="代码" prop="code">
                               {{ notifierFormItem.code }}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="8">
                            <FormItem label="地址" prop="attenAddr">
                               {{ notifierFormItem.attenAddr }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="地址" prop="attenFax">
                               {{ notifierFormItem.attenFax }}
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="地址" prop="attenEmail">
                               {{ notifierFormItem.attenEmail }}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Drawer>
    </div>
</template>

<script>
    export default {
        props: {
            showDrawer: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                isShowDrawer: false,
                senderFormItem: {
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '1'
                },
                takerFormItem: {
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '2'
                },
                notifierFormItem: {
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '3'
                }
            }
        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                },
                immediate: true
            }
        },
        methods: {
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            }
        }
    }
</script>

<style lang="scss" scoped>
    h6 {
        margin-bottom: 30px;
        font-size: 16px;
    }
</style>
