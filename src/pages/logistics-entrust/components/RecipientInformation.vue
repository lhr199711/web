<template>
    <div>
        <div id="RecipientInformation" class="public-form-card">
            <div class="sender-info">
                <Form
                    :model="senderFormItem"
                    :rules="senderRuleValidate"
                    :label-width="120" 
                    ref="senderFormItemData"
                    label-colon
                >
                    <Row >
                        <Col span="16">
                            <FormItem label="发货人名称" prop="attenName">
                                <Select v-model="senderFormItemindex" @on-clear="onclear(1)" clearable @on-change="chooseName(1)">
                                    <Option v-for="(item, index) in sender" :key="index" :value="index">
                                        {{ item.attenName }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <!-- <span class="add" @click="addPeople(1)">+</span> -->
                            <Button @click="addPeople(1)">添加发货人</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="联系电话" prop="attenTel">
                                <Input v-model="senderFormItem.attenTel" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span="24">
                            <FormItem label="代码" prop="code">
                                <Input v-model="senderFormItem.code" disabled></Input>
                            </FormItem>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="地址" prop="attenAddr">
                                <Input v-model="senderFormItem.attenAddr" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="传真" prop="attenFax">
                                <Input v-model="senderFormItem.attenFax" disabled></Input>
                            </FormItem>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="邮箱" prop="attenEmail">
                                <Input v-model="senderFormItem.attenEmail" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="taker-info">
                <Form
                    :model="takerFormItem"
                    :rules="takerRuleValidate"
                    ref="takerFormItemData"
                    label-colon
                    :label-width="120" 
                >
                    <Row >
                        <Col span="16">
                            <FormItem label="收货人名称" prop="attenName">
                                <Select v-model="takerFormItemindex" @on-clear="onclear(2)" clearable @on-change="chooseName(2)">
                                    <Option v-for="(item, index) in taker" :key="item.code" :value="index">
                                        {{ item.attenName }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <Button @click="addPeople(2)">添加发货人</Button>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="联系电话" prop="attenTel">
                                <Input v-model="takerFormItem.attenTel" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span="24">
                            <FormItem label="代码" prop="code">
                                <Input v-model="takerFormItem.code" disabled></Input>
                            </FormItem>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="地址" prop="attenAddr">
                                <Input v-model="takerFormItem.attenAddr" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row >
                        <Col span="24">
                            <FormItem label="传真" prop="attenFax">
                                <Input v-model="takerFormItem.attenFax" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="邮箱" prop="attenEmail">
                                <Input v-model="takerFormItem.attenEmail" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="notifier-info">
                <Form
                    :model="notifierFormItem"
                    :rules="notifierRuleValidate"
                    :label-width="120" 
                    ref="notifierFormItemData"
                    label-colon
                >
                    <Row  >
                        <Col span="16">
                            <FormItem label="通知人名称" prop="attenName">
                                <Select v-model="notifierFormItemindex" @on-clear="onclear(3)" clearable @on-change="chooseName(3)">
                                    <Option v-for="(item, index) in notifier" :key="item.code" :value="index">
                                        {{ item.attenName }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <!-- <span class="add" @click="addPeople(3)">+</span> -->
                            <Button @click="addPeople(3)">添加发货人</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span=" 24">
                            <FormItem label="联系电话" prop="attenTel">
                                <Input v-model="notifierFormItem.attenTel" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row  >
                        <Col span=" 24">
                            <FormItem label="代码" prop="code">
                                <Input v-model="notifierFormItem.code" disabled></Input>
                            </FormItem>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span=" 24">
                            <FormItem label="地址" prop="attenAddr">
                                <Input v-model="notifierFormItem.attenAddr" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row  >
                        <Col span=" 24">
                            <FormItem label="传真" prop="attenFax">
                                <Input v-model="notifierFormItem.attenFax" disabled></Input>
                            </FormItem>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span=" 24">
                            <FormItem label="邮箱" prop="attenEmail">
                                <Input v-model="notifierFormItem.attenEmail" disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Drawer
                v-model="isShowDrawer"
                width="1100"
            >
                <h3>录入{{ addType === 1 ? '发货人' : (addType === 2 ? '收货人' : '通知人') }}信息</h3>
                <Form
                    :model="popFormItem"
                    :rules="popRuleValidate"
                    label-position="top"
                    ref="popFormItemData"
                    label-colon
                >
                    <Row  >
                        <Col span="12">
                            <!-- <FormItem label="发货人名称" prop="attenName">
                                <Input v-model="popFormItem.attenName" type="text"/>
                            </FormItem> -->
                            <FormItem :label="`${addType === 1 ? '发货人' : (addType === 2 ? '收货人' : '通知人')}名称`" prop="attenName">
                                <Input v-model="popFormItem.attenName"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="联系电话" prop="attenTel">
                                <Input v-model="popFormItem.attenTel"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row  >
                        <Col span="12">
                            <FormItem label="代码" prop="code">
                                <Input v-model="popFormItem.code" />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="地址" prop="attenAddr">
                                <Input v-model="popFormItem.attenAddr" type="text"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row  >
                        <Col span="12">
                            <FormItem label="传真" prop="attenFax">
                                <Input v-model="popFormItem.attenFax" type="text"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="邮箱" prop="attenEmail">
                                <Input v-model="popFormItem.attenEmail" type="text"/>
                            </FormItem>
                        </Col>
                    </Row>
                    
                </Form>
                <div class="drawer-btns">
                    <Button type="primary" shape="circle" size="large" @click="submitPopForm">确定</Button>
                    <Button shape="circle" size="large" @click="cancel">取消</Button>
                </div>
            </Drawer>
        </div>
        <div v-if="!isDetail" class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
        </div>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    export default {
        props: {
            defaultData: {
                type: Array,
                default: () => []
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                isShowDrawer: false,
                addType: 1,  // 1: 添加发货人， 2: 添加收货人， 3： 添加通知人
                sender: [
                        {
                        attenName: '发货人1',
                        attenTel: '13452531574',
                        code: '111',
                        attenAddr: '地址',
                        attenFax: '传真',
                        attenEmail: '351869634@qq.com'
                    }
                ], //发货人列表
                taker: [
                        {
                        attenName: '收货人1',
                        attenTel: '13452531572',
                        code: '222',
                        attenAddr: '地址',
                        attenFax: '传真',
                        attenEmail: '351869634@qq.com'
                    }
                ], //收货人列表
                notifier: [
                        {
                        attenName: '通知人1',
                        attenTel: '13452531571',
                        code: '333',
                        attenAddr: '地址',
                        attenFax: '传真',
                        attenEmail: '351869634@qq.com'
                    }
                ], //通知人列表
                senderFormItemindex: -1, //发送人选中 index
                takerFormItemindex: -1, //收货人选中 index
                notifierFormItemindex: -1, //通知人选中 index
                senderFormItem: {
                    // index: -1, //默认选中项为 空
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '1'
                },
                takerFormItem: {
                    // index: -1, //默认选中项为 空
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '2'
                },
                notifierFormItem: {
                    // index: -1, //默认选中项为 空
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '3'
                },
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
                popFormItem: {
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: '1'
                },
                popRuleValidate: {
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
        created() {
            // 需要的接口 获取1 2 3类型的所有人员列表 3个
            // 需要的接口 新增1 2 3类型的人员列表 3个
            if (this.defaultData.length>1) { //保存前 回显可更改
                let tel1 = this.defaultData[0].attenTel
                let tel2 = this.defaultData[1].attenTel
                let tel3 = this.defaultData[2].attenTel
                this.senderFormItemindex = this.sender.findIndex(({attenTel})=>{return attenTel==tel1}) //发送人选中 index
                this.takerFormItemindex = this.taker.findIndex(({attenTel})=>{return attenTel==tel2}) //收货人选中 index
                this.notifierFormItemindex = this.notifier.findIndex(({attenTel})=>{return attenTel==tel3}) //通知人选中 index
                this.senderFormItem = this.defaultData[0] //发送人选中 index
                this.takerFormItem = this.defaultData[1] //收货人选中 index
                this.notifierFormItem = this.defaultData[2] //通知人选中 index
            }
        },
        methods:{
            // 下一步操作 传参
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
                    // 获取数据并传递参数 0 1 2 发送人 收货人 通知人
                    // linkType
                    this.senderFormItem.linkType = '1'
                    this.takerFormItem.linkType = '2'
                    this.notifierFormItem.linkType = '3'
                    let data = [this.senderFormItem, this.takerFormItem, this.notifierFormItem]
                    this.$emit("submit-form",data);
                }
            },
            addPeople(type) {
              this.addType = type
              this.isShowDrawer = !this.isShowDrawer;
            },
            cancel () {
                this.isShowDrawer = false
                this.$refs.popFormItemData.resetFields() //重置验证
            },
            // 新增 发货 收货 通知人
            submitPopForm () {
                this.$refs.popFormItemData.validate((valid) => {
                    if (valid) {
                        console.log(this.addType,this.popFormItem);
                        let addObj = JSON.parse(JSON.stringify(this.popFormItem));
                        // 要发送请求保存信息,后端判断是否重复
                        // 如果不重复
                        if (this.addType === 1) {
                            this.popFormItem.linkType = 1 // 现在是随便写的，还没定
                            this.sender.push(addObj)
                        }
                        if (this.addType === 2) {
                            this.popFormItem.linkType = 2 // 现在是随便写的，还没定
                            this.taker.push(addObj)
                        }
                        if (this.addType === 3) {
                            this.popFormItem.linkType = 3 // 现在是随便写的，还没定
                            this.notifier.push(addObj)
                        }
                        this.isShowDrawer = false
                        this.$refs.popFormItemData.resetFields() //重置验证
                    }
                })
            },
            chooseName(type) {
                // 过滤 触发方式(清空也会触发)
                if (type === 1&&(this.senderFormItemindex==true||this.senderFormItemindex==0)) {
                    this.senderFormItem = this.sender[this.senderFormItemindex]
                }
                // 过滤 触发方式(清空也会触发)
                if (type === 2&&(this.takerFormItemindex==true||this.takerFormItemindex==0)) {
                    this.takerFormItem = this.taker[this.takerFormItemindex]
                }
                // 过滤 触发方式(清空也会触发)
                if (type === 3&&(this.notifierFormItemindex==true||this.notifierFormItemindex==0)) {
                    this.notifierFormItem = this.notifier[this.notifierFormItemindex]
                }
            },
            // 清空 1/2/3 类型的数据
            onclear(type) {
                let emptyObj = {
                    attenName: '',
                    attenTel: '',
                    code: '',
                    attenAddr: '',
                    attenFax: '',
                    attenEmail: '',
                    linkType: type
                }
                if (type === 1) {
                    this.senderFormItem = emptyObj
                }
                if (type === 2) {
                    this.takerFormItem = emptyObj
                }
                if (type === 3) {
                    this.notifierFormItem = emptyObj
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
#RecipientInformation{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: #ffffff;
    .sender-info{
        flex: 1;
        width: 33%;
        /deep/ .ivu-form-item-label{
            height: 35px;
            font-size: 14px;
            color:#666666;
            background: #f5f6f8;
            border: 1px solid #e6e6e6;
            border-bottom: none;
            vertical-align: middle;
        }
    }
    .taker-info{
        flex: 1;
        width: 33%;
        /deep/ .ivu-form-item-label{
            height: 35px;
            font-size: 14px;
            color:#666666;
            background: #f5f6f8;
            border: 1px solid #e6e6e6;
            border-bottom: none;
            vertical-align: middle;
        }
    }
    .notifier-info{
        flex: 1;
        width: 33%;
        /deep/ .ivu-form-item-label{
            height: 35px;
            font-size: 14px;
            color:#666666;
            background: #f5f6f8;
            border: 1px solid #e6e6e6;
            border-bottom: none;
            vertical-align: middle;
        }
    }
}
</style>
