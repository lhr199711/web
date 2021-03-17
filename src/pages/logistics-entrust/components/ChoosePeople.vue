<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>选择收发货人通知人信息</h3>
            <div class="sender-info">
                <h6>发货人信息</h6>
                <Form
                    :model="senderFormItem"
                    :rules="senderRuleValidate"
                    label-position="top"
                    ref="senderFormItemData"
                    label-colon
                >
                    <Row :gutter="20">
                        <Col span="10">
                            <FormItem label="发货人名称" prop="attenName">
                                <Select v-model="senderFormItem.attenName" clearable @on-change="chooseName(1)">
                                    <Option v-for="(item, index) in sender" :key="index" :value="item.attenName">
                                        {{ item.attenName }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="2">
                            <span class="add" @click="addPeople(1)">+</span>
                        </Col>
                        <Col span="12">
                            <FormItem label="联系电话" prop="attenTel">
                               <Input v-model="senderFormItem.attenTel" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="12">
                            <FormItem label="代码" prop="code">
                                <Input v-model="senderFormItem.code" disabled></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="地址" prop="attenAddr">
                               <Input v-model="senderFormItem.attenAddr" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="12">
                            <FormItem label="传真" prop="attenFax">
                                <Input v-model="senderFormItem.attenFax" disabled></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="邮箱" prop="attenEmail">
                               <Input v-model="senderFormItem.attenEmail" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="taker-info">
                <h6>收货人信息</h6>
                <Form
                    :model="takerFormItem"
                    :rules="takerRuleValidate"
                    label-position="top"
                    ref="takerFormItemData"
                    label-colon
                >
                    <Row :gutter="20">
                        <Col span="10">
                            <FormItem label="收货人名称" prop="attenName">
                                <Select v-model="takerFormItem.attenName" clearable @on-change="chooseName(2)">
                                    <Option v-for="(item, index) in taker" :key="index" :value="item.attenName">
                                        {{ item.attenName }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="2">
                            <span class="add" @click="addPeople(2)">+</span>
                        </Col>
                        <Col span="12">
                            <FormItem label="联系电话" prop="attenTel">
                               <Input v-model="takerFormItem.attenTel" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="12">
                            <FormItem label="代码" prop="code">
                                <Input v-model="takerFormItem.code" disabled></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="地址" prop="attenAddr">
                               <Input v-model="takerFormItem.attenAddr" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="12">
                            <FormItem label="传真" prop="attenFax">
                                <Input v-model="takerFormItem.attenFax" disabled></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="邮箱" prop="attenEmail">
                               <Input v-model="takerFormItem.attenEmail" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="notifier-info">
                <h6>通知人信息</h6>
                <Form
                    :model="notifierFormItem"
                    :rules="notifierRuleValidate"
                    label-position="top"
                    ref="notifierFormItemData"
                    label-colon
                >
                    <Row :gutter="20">
                        <Col span="10">
                            <FormItem label="通知人名称" prop="attenName">
                                <Select v-model="notifierFormItem.attenName" clearable @on-change="chooseName(3)">
                                    <Option v-for="(item, index) in notifier" :key="index" :value="item.attenName">
                                        {{ item.attenName }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="2">
                            <span class="add" @click="addPeople(3)">+</span>
                        </Col>
                        <Col span="12">
                            <FormItem label="联系电话" prop="attenTel">
                               <Input v-model="notifierFormItem.attenTel" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="12">
                            <FormItem label="代码" prop="code">
                                <Input v-model="notifierFormItem.code" disabled></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="地址" prop="attenAddr">
                               <Input v-model="notifierFormItem.attenAddr" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="12">
                            <FormItem label="传真" prop="attenFax">
                                <Input v-model="notifierFormItem.attenFax" disabled></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="邮箱" prop="attenEmail">
                               <Input v-model="notifierFormItem.attenEmail" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="submitForm">确定</Button>
                <Button shape="circle" size="large" @click="cancel">取消</Button>
            </div>
        </Drawer>
        <Drawer
            v-model="isShowAddDrawer"
            width="660"
        >
            <h6>录入{{ addType === 1 ? '发货人' : (addType === 2 ? '收货人' : '通知人') }}信息</h6>
            <Form
                :model="addFormItem"
                :rules="addRuleValidate"
                label-position="top"
                ref="addFormItemData"
                label-colon
            >
                <Row>
                    <Col span="24">
                        <FormItem :label="`${addType === 1 ? '发货人' : (addType === 2 ? '收货人' : '通知人')}名称`" prop="attenName">
                            <Input v-model="addFormItem.attenName"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="联系电话" prop="attenTel">
                           <Input v-model="addFormItem.attenTel"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="代码" prop="code">
                            <Input v-model="addFormItem.code"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="地址" prop="attenAddr">
                           <Input v-model="addFormItem.attenAddr"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="传真" prop="attenFax">
                            <Input v-model="addFormItem.attenFax"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="邮箱" prop="attenEmail">
                           <Input v-model="addFormItem.attenEmail"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="submitAddForm">确定</Button>
                <Button shape="circle" size="large" @click="isShowAddDrawer = false">取消</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import addPeople from '@/mixins/addPeople'
    export default {
        mixins: [addPeople],
        props: {
            showDrawer: {
                type: Boolean,
                default: false
            },
            userList: {
                type: Array,
                default: ()=>[
                    [{attenName: '王一', attenTel: '13594512569', code: '123', attenAddr: '重庆', attenFax: '26737123', attenEmail:'2673712354@qq.com'}],
                    [{attenName: '王二', attenTel: '13594512561', code: '234', attenAddr: '重庆', attenFax: '26737123', attenEmail:'2673712354@qq.com'}],
                    [{attenName: '王三', attenTel: '13594512562', code: '345', attenAddr: '重庆', attenFax: '26737123', attenEmail:'2673712354@qq.com'}]
                ]
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
                }, //发货人
                takerFormItem: {
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '2'
                }, //收货人
                notifierFormItem: {
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '3'
                }, //通知人
                senderRuleValidate: {
                    attenName: [
                        validateRules.select('发货人名称')[0]
                    ]
                },
                takerRuleValidate: {
                    attenName: [
                        validateRules.select('收货人名称')[0]
                    ]
                },
                notifierRuleValidate: {
                    attenName: [
                        validateRules.select('通知人名称')[0]
                    ]
                },
                addRuleValidate: {
                    attenName: [
                        validateRules.required('名称')[0]
                    ],
                    attenTel: [
                        validateRules.required('联系电话')[0],
                        validateRules.phone()[0],
                    ],
                    attenAddr: [
                        validateRules.required('地址')[0]
                    ],
                    attenEmail: [
                        validateRules.email()[0]
                    ]
                }
            }
        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                    // console.log(to);
                    if (to) {
                        this.sender = this.userList[0]
                        this.taker = this.userList[1]
                        this.notifier = this.userList[2]
                    }
                },
                immediate: true
            }
        },
        methods: {
            submitForm () {
                let allValid = true
                this.$refs.senderFormItemData.validate((valid) => {
                    if (!valid) {
                        allValid = false
                    }
                })
                this.$refs.takerFormItemData.validate((valid) => {
                    if (!valid) {
                        allValid = false
                    }
                })
                this.$refs.notifierFormItemData.validate((valid) => {
                    if (!valid) {
                        allValid = false
                    }
                })
                if (allValid) {
                    // 处理数据
                    let data = [this.senderFormItem, this.takerFormItem, this.notifierFormItem]
                    this.$emit('on-ok', data)
                    this.isShowDrawer = false
                }
            },
            cancel () {
                this.$emit('on-cancel')
                this.isShowDrawer = false
            },
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            },
            chooseName (type) {
                if (type === 1) {
                    this.senderFormItem = { ...this.sender[this.getIndex(this.sender, this.senderFormItem.attenName, 'attenName')] }
                }
                if (type === 2) {
                    this.takerFormItem = { ...this.taker[this.getIndex(this.taker, this.takerFormItem.attenName, 'attenName')] }
                }
                if (type === 3) {
                    this.notifierFormItem = { ...this.notifier[this.getIndex(this.notifier, this.notifierFormItem.attenName, 'attenName')] }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    h6 {
        margin-bottom: 30px;
        font-size: 16px;
    }
    .add {
        display: block;
        font-size: 30px;
        font-weight: bold;
        margin-top: 22px;
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        border-radius: 100%;
        box-shadow: 0px 3px 7px 0px rgba(35, 36, 44, 0.15);
    }
</style>
