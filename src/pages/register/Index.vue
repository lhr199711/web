<template>
    <div class="reg-wraper">
        <Row class="header" type="flex" align="middle">
            <img src="@/assets/images/login/log.png">
            <h4>{{toTitle}}</h4>
        </Row>
        <!-- 中间进度图片板块 -->
        <Row class="reg-content">
            <Col class="show-step">
                    <div>
                        <svg class="iconfont icon-train">
                            <use xlink:href="#icondengluzhuceqietu_tianxieyewuxinxi1"></use>
                        </svg>
                        <p :class="[nowStep ===1 ? 'active' : '']">创建账户</p>
                    </div>
                    <svg :class="['iconfont','icon-train',nowStep>1 ? 'active' : '']" aria-hidden="true">
                        <use xlink:href="#icondengluzhuceqietu_buzhouhui1"></use>
                    </svg>
                    <div>
                        <svg  class="iconfont icon-train">
                            <use xlink:href="#icondengluzhuceqietu_tianxieyewuxinxi1"></use>
                        </svg>
                        <p  :class="[nowStep ===2 ? 'active' : '']">填写企业信息</p>
                    </div>
                    <svg :class="['iconfont','icon-train',nowStep>2 ? 'active' : '']" aria-hidden="true">
                        <use xlink:href="#icondengluzhuceqietu_buzhouhui1"></use>
                    </svg>
                    <div>
                        <svg class="iconfont icon-train">
                            <use xlink:href="#icondengluzhuceqietu_tianxieyewuxinxi1"></use>
                        </svg>
                        <p  :class="[nowStep ===3 ? 'active' : '']">填写业务信息</p>
                    </div>
                    <svg :class="['iconfont','icon-train',nowStep>3 ? 'active' : '']" aria-hidden="true">
                        <use xlink:href="#icondengluzhuceqietu_buzhouhui1"></use>
                    </svg>
                    <div>
                        <svg  class="iconfont icon-train">
                            <use xlink:href="#icondengluzhuceqietu_tianxieyewuxinxi1"></use>
                        </svg>
                        <p :class="[nowStep ===4 ? 'active' : '']">注册完成</p>
                    </div>
            </Col>
        </Row>
        <!-- step1的Form -->
        <Row class="stepForm" type="flex" justify="center" v-if="nowStep===1">
            <Form
                ref="step1Form" 
                :model="formAllInfo.account" 
                label-position="left"  
                :label-width="110"
                :rules="rules"
            >
                <FormItem label="管理员账户名" prop="username">
                    <Input style="width:365px;" v-model="formAllInfo.account.username" placeholder="请输入管理员账户名"></Input>
                </FormItem>
                <FormItem label="管理员密码" prop="password">
                    <Input 
                        type="password" 
                        password style="width:365px;" 
                        v-model="formAllInfo.account.password" 
                        placeholder="请输入管理员密码"
                    >
                    </Input>
                </FormItem>
            </Form>
            <Row class="sure-btn" type="flex" justify="center">
                <div @click="verifyForm('step1Form')">下一步</div>
            </Row>
        </Row>
        <!-- step2的Form -->
        <Row class="stepForm" type="flex" justify="center" v-if="nowStep===2">
            <Form
                ref="step2Form" 
                :model="formAllInfo.enterpriseInformation" 
                label-position="left"  
                :label-width="200"
                :rules="rules"
            >
                <FormItem label="企业名称" prop="companyName">
                    <Input style="width:365px;" v-model="formAllInfo.enterpriseInformation.companyName" placeholder="请输入企业名称"></Input>
                </FormItem>
                <FormItem label="企业注册国" prop="enterpriseCountry">
                    <Select style="width:365px;" v-model="formAllInfo.enterpriseInformation.enterpriseCountry" placeholder="请选择企业注册国">
                        <Option v-for="(item,index) in countryCode" :value="item.dictionaryKey" :key="index">{{item.dictionaryValue}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="企业唯一ID" prop="companyState">
                    <Input style="width:365px;" v-model="formAllInfo.enterpriseInformation.companyState" placeholder="请输入企业唯一ID"></Input>
                </FormItem>
                <FormItem label="联系人" prop="customsName">
                    <Input style="width:365px;" v-model="formAllInfo.enterpriseInformation.customsName" placeholder="请输入联系人姓名"></Input>
                </FormItem>
                <Row type="flex" style="position:relative;">
                    <FormItem label="联系电话" prop="prevContactPhone" style="position:absolute;z-index:2;">
                        <Select v-model="formAllInfo.enterpriseInformation.prevContactPhone" style="width: 80px">
                            <Option value="+86">+86</Option>
                            <Option value="+88">+88</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="transform:translateX(84px);" prop="customsTel">
                        <Input style="width:280px;" v-model="formAllInfo.enterpriseInformation.customsTel"></Input>
                    </FormItem>
                </Row>
                <FormItem label="证件类型" prop="certType">
                    <Select style="width:365px;" v-model="formAllInfo.enterpriseInformation.certType" placeholder="请选择证件类型">
                        <Option value="身份证">身份证</Option>
                        <Option value="户口本">户口本</Option>
                    </Select>
                </FormItem>
                <FormItem label="证件号码" prop="certCode">
                    <Input style="width:365px;" v-model="formAllInfo.enterpriseInformation.certCode" placeholder="请输入证件号码"></Input>
                </FormItem>
                <Radio style="transform: translateX(130px);" v-model="formAllInfo.enterpriseInformation.agree">同意<span class="active">xxxxx协议</span></Radio>
            </Form>
            <Row class="sure-btn" type="flex" justify="center">
                <div @click="verifyForm('step2Form')">下一步</div>
            </Row>
        </Row>
        <!-- step3 -->
        <Row v-if="nowStep===3">
            <Row type="flex" justify="center" class="step3Radio">
                <RadioGroup v-model="formAllInfo.businessInfo.identity">
                    <Radio label="服务商">
                        <span>我是服务商</span>
                    </Radio>
                    <Radio label="货主">
                        <span>我是货主</span>
                    </Radio>
                </RadioGroup>
            </Row>
            <Row class="sure-btn" type="flex" justify="center">
                <div @click="showUploadModal = true">上传资质</div>
            </Row>
        </Row>
        <!-- step4 -->
        <Row v-if="nowStep===4">
            <Row type="flex" justify="center" style="padding:80px 0 0;">
                <img src="@/assets/images/registerEnd.png" alt="">
            </Row>
            <p style="text-align:center;color:#999999;">您上传的业务资质已提交审核，审核结果请登录到<span class="active">个人中心</span>查看!</p>
            <Row class="sure-btn" type="flex" justify="center">
                <div>去首页看看</div>
            </Row>
        </Row>
        <button @click='clickfn'>toStep3</button>
        <button @click='clickfn1'>showInfo</button>
        <!-- 上传图片弹窗 -->
        <Drawer
            title="上传资质"
            v-model="showUploadModal"
            width="1284"
            :mask-closable="false"
            class="drawer"
        >
            <Row style="margin-bottom:20px;">
                <CheckboxGroup v-model="formAllInfo.businessInfo.border" class="checkTitle">
                    <Checkbox label="短驳运输" border></Checkbox>
                    <Checkbox label="公路运输" border></Checkbox>
                    <Checkbox label="水路运输" border></Checkbox>
                    <Checkbox label="铁路运输" border></Checkbox>
                    <Checkbox label="航空运输" border></Checkbox>
                </CheckboxGroup>
            </Row>
            <Row style="padding:30px 0;border-top:1px solid #D7D8DF;">
                <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    multiple
                    type="drag"
                    action="//jsonplaceholder.typicode.com/posts/"
                    style="display: inline-block;width:146px;"
                >
                    <div style="width: 146px;height:100px;line-height: 100px;">
                        <Icon type="ios-cloud-upload" size="20"></Icon>
                    </div>
                </Upload>
                <template v-if="formAllInfo.businessInfo.uploadList.length">
                    <div class="upload-list" v-for="(item,index) in formAllInfo.businessInfo.uploadList" :key="index">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                </template>    
                <div>
                    <button @click="clearNowUploadList('upload')">清空</button>
                </div>
            </Row>
            <div class="sumbitBtn" style="cursor: pointer;" @click="sumbitBtn">提交审核</div>
        </Drawer>
    </div>
</template>

<script>
import validateRules from '@/libs/validateRules'
export default {
    data() {
        return {
            countryCode: this.$getDictionary('COUNTRY_CODE'),
            showUploadModal: false,
            nowStep: 1,
            formAllInfo: {
                account: {
                    username: '',
                    password: ''
                },
                enterpriseInformation: {
                    companyName: '',//企业名称
                    enterpriseCountry: '',//企业注册国
                    companyState: '',//企业唯一id
                    customsName: '',//联系人
                    customsTel: '',//联系电话
                    prevContactPhone: '',//联系电话前缀
                    certType: '',//证件类型
                    certCode: '',//证件号码
                    agree: false //是否同意
                },
                businessInfo: {
                    identity : '货主',
                    uploadList: [],
                    border: []
                }
            },
            rules: {
                username: [
                    validateRules.required('用户名')[0],
                    validateRules.maxNum('用户名',50)[0]
                ],
                password: [
                    validateRules.required('密码')[0],
                    validateRules.maxNum('密码',20)[0]
                ],
                companyName: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' },
                    validateRules.maxNum('企业名称',50)[0]
                ],
                companyState: [
                    validateRules.required('企业唯一ID')[0],
                    validateRules.maxNum('企业唯一ID',18)[0]
                ],
                customsName: [
                    validateRules.required('联系人姓名')[0],
                    validateRules.maxNum('联系人姓名',50)[0]
                ],
                certCode: [
                    validateRules.required('证件号码')[0]
                ],
                enterpriseCountry: [
                    validateRules.select('企业注册国')[0]
                ],
                certType: [
                    validateRules.select('证件类型')[0]
                ],
                customsTel: [
                    { required: true, message: '请输入电话号码', trigger: 'change' },
                    validateRules.phone('正确的电话号码')[0]
                ],
                prevContactPhone: [
                    validateRules.select('电话前缀')[0]
                ]
            },
        }
    },
    mounted () {
        this.formAllInfo.businessInfo.uploadList = this.$refs.upload.fileList;
    },
    methods: {
        clickfn1() {
            console.log(this.formAllInfo.businessInfo);
        },
        clickfn() {
            this.nowStep = 3
        },
        verifyForm(name) {
            if(this.nowStep === 2) {
                if(!this.formAllInfo.enterpriseInformation.agree){
                    this.$Message.error('请阅读协议并勾选')
                    return;
                }
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.nowStep++
                } else {
                    this.$Message.error('请按照规则填写信息')
                }
            })
        },
        handleSuccess (res, file) {
            file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        handleFormatError () {
            console.log('上传的图片格式错误');
        },
        handleMaxSize () {
            console.log('上传的图片过大');
        },
        clearNowUploadList (name,index) {
            this.$refs[name].clearFiles()
            this.formAllInfo.businessInfo.uploadList = []
        },
        sumbitBtn () {
        }
    },
    computed: {
        toTitle() {
            switch(this.nowStep) {
                case 1:
                    return '创建账户'
                    break;
                case 2:
                    return '填写企业信息'
                    break;
                case 3:
                    return '填写业务信息'
                    break;
                case 4:
                    return '注册完成'
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './style.scss';
</style>