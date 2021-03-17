<template>
    <div class="login">
        <div class="login-top">
            <div class="login-log">
                <img class="img-show" src="../../assets/images/login/log.png" alt="正在加载">
            </div>
            <div class="login-title">供应链管理系统</div>
        </div>
        <div class="login-under" v-if="!loginSuccess">
            <div class="content">
                <div class="content-left">
                    <div class="content-left-title" @click="accountSwitch(1)" :class="{'login-title-color': changeIndex == 1}">
                        <div class="content-left-mark" :class="{'content-left-mark-color': changeIndex == 1}"></div>
                        <svg class="iconfont content-left-icon" aria-hidden="true">
                            <use xlink:href="#icondengluzhuceqietu_zhanghudenglu1"></use>
                        </svg>
                        <span class="content-left-font">账号登录</span>
                    </div>
                    <div class="content-left-title" @click="accountSwitch(2)" :class="{'login-title-color': changeIndex == 2}">
                        <div class="content-left-mark" :class="{'content-left-mark-color': changeIndex == 2}"></div>
                        <svg class="iconfont content-left-icon" aria-hidden="true">
                            <use xlink:href="#icondengluzhuceqietu_shoujidenglu1"></use>
                        </svg>
                        <span class="content-left-font">手机登录</span>
                    </div>
                    <div class="content-left-title" @click="accountSwitch(3)" :class="{'login-title-color': changeIndex == 3}">
                        <div class="content-left-mark" :class="{'content-left-mark-color': changeIndex == 3}"></div>
                        <svg class="iconfont content-left-icon" aria-hidden="true">
                            <use xlink:href="#icondengluzhuceqietu_weixindenglu1"></use>
                        </svg>
                        <span class="content-left-font">微信登录</span>
                    </div>
                </div>
                <div class="content-img">
                    <img class="content-img-show" src="../../assets/images/login/log-img.png" alt="正在加载">
                </div>
                <div class="content-from" v-show="changeIndex == 1">
                    <div class="content-from-title">账户登录</div>
                    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                        <FormItem class="content-from-input" prop="accountName">
                            <Input type="text" v-model="formInline.accountName" placeholder="请输入账号">
                            </Input>
                        </FormItem>
                        <FormItem class="content-from-input" prop="loginPwd">
                            <Input type="password" v-model="formInline.loginPwd" placeholder="请输入密码">
                            </Input>
                        </FormItem>
                    </Form>
                    <Button class="content-from-btn" type="primary" @click="handleSubmit(1)">登录</Button>
                    <div class="content-from-font">
                        <span>忘记密码？</span>
                        <span class="clear-fix">去注册</span>
                    </div>
                </div>
                <div class="content-from" v-show="changeIndex == 2">
                    <div class="content-from-title">手机登录</div>
                    <Form ref="formItem" :model="formItem" :rules="ruleInline" inline>
                        <FormItem class="content-from-input" prop="phonenumber">
                            <phone-input :prefix="formItem.areaCode" width="236"
                            :suffix="formItem.phonenumber"
                            @prefixChange="formItem.areaCode = arguments[0]"
                            @suffixChange="formItem.phonenumber = arguments[0]" />
                        </FormItem>
                        <FormItem class="content-from-input" prop="code">
                            <Input type="text" class="content-from-input-input" v-model="formItem.code" placeholder="请输入验证码"></Input>
                            <Button type="primary" ghost class="content-from-input-btn"
                                @click="getCode" :disabled="disabled">
                                <span class="font-getcode">{{changeCode}}</span>
                            </Button>
                        </FormItem>
                    </Form>
                    <Button class="content-from-btn" type="primary" @click="handleSubmit(2)">登录</Button>
                    <div class="content-from-font">
                        <span>忘记密码？</span>
                        <span class="clear-fix">去注册</span>
                    </div>
                </div>
                <div class="content-from" v-show="changeIndex == 3">
                    <div class="content-from-title">手机登录</div>
                    <div></div>
                </div>
            </div>
        </div>
        <choose-role v-else :orgList="orgList"></choose-role>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import { apiAuthLogin, apiAccount } from '@/api/login'
    import { apiDictionaryQueryAll } from '@/api/dictionary'
    import { apiGetOrg } from '@/api/mock/mock'
    import ChooseRole from './ChooseRole'
    export default {
        components: {
            ChooseRole
        },
        props: ['redirect'],
        data () {
            return {
                formInline: {
                    accountName: '',
                    loginPwd: ''
                },
                ruleInline: {
                    accountName: [validateRules.required('账号')[0]],
                    loginPwd: [validateRules.required('密码')[0]]
                },
                formItem: {
                    phonenumber: '',
                    code: '',
                    areaCode: ''
                },
                changeIndex: '1',
                changeCode: '获取验证码',
                disabled: false,
                resend: 60,
                loginSuccess: false,
                orgList: []
            }
        },
        created () {
            apiDictionaryQueryAll().then(res => {
                if (res.data) {
                    // 将字典存到本地，方便后续获取
                    window.localStorage.setItem('dictionary', JSON.stringify(res.data))
                } else {
                    this.$Message.error({ content: '无法获取字典，请联系管理员' })
                }
            })
        },
        methods: {
            accountSwitch (index) {
                this.changeIndex = index
            },
            getCode () {
                this.codeCountdown()
            },
            codeCountdown() {
                //成功发送验证码倒计时
                let vm = this
                if (this.resend === 0) {
                    this.resend = 60
                } else {
                    vm.changeCode = '倒计时' + '(' + vm.resend + ')'
                    vm.disabled = true
                    function time() {
                        if (vm.resend > 0) {
                            vm.resend--
                            vm.changeCode = '倒计时' + '(' + vm.resend + ')'
                            vm.disabled = true
                        }
                        if (vm.resend === 0) {
                            vm.disabled = false
                            vm.changeCode = '获取验证码'
                        }
                    }
                    setInterval(function () {
                        time()
                    }, 1000)
                }
            },
            handleSubmit (index) {
                if (index == 1) {
                    const data = this.formInline
                    this.$refs["formInline"].validate((valid) => {
                        if (valid) {
                            apiAuthLogin({ data }).then(res => {
                                window.localStorage.setItem('accessToken', res.data)
                                // 获取机构角色信息
                                apiGetOrg().then(({ data }) => {
                                    this.loginSuccess = true
                                    this.orgList = data
                                })
                                // 获取菜单和当前账户信息
                                apiAccount().then(res => {
                                    if (res.code == 200) {
                                        const userData = {
                                            "accountEmail": res.data.accountEmail,
                                            "accountId": res.data.accountId,
                                            "accountName": res.data.accountName,
                                            "accountTel": res.data.accountTel,
                                            "appCode": res.data.appCode,
                                            "functions": res.data.functions,
                                            "organizationId": res.data.organizationId,
                                            "organizationName": res.data.organizationName,
                                            "roles": res.data.roles,
                                            "roleName": res.data.roleName
                                        }
                                        const menuList = res.data.menus
                                        window.localStorage.setItem('user', JSON.stringify(userData))
                                        window.localStorage.setItem('menu', JSON.stringify(menuList))
                                        // 清空页签
                                        // window.sessionStorage.removeItem('tabMenuArr')
                                        // 登录成功、获取用户、菜单信息成功之后跳转页面
                                        // this.$router.push({ path: this.redirect ? window.decodeURIComponent(this.redirect) : '/logisstics-commission/home' })
                                    } else {
                                        this.$router.push({ path: '/login' })
                                    }
                                })
                            })
                        }
                    })
                }
                if (index == 2) {
                    console.log('手机号登录')
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    // 手机登录样式修改
    /deep/.ivu-select-single .ivu-select-selection {
        height: 40px;
        .ivu-select-selected-value {
            line-height: 40px;
        }
    }
    .login {
        position: relative;
        height: 100%;
        .login-top {
            display: flex;
            height: 100px;
            padding: 30px 100px;
            background-color: white;
            .login-log {
                width: 180px;
            }
            .login-title {
                width: 200px;
                font-size:26px;
                margin-left: 25px;
                font-family:Microsoft YaHei;
                font-weight:400;
                color:rgba(51,51,51,1);
            }
        }
        .login-under {
            .content {
                width: 1100px;
                height: 400px;
                background-color: white;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, 50%);
                box-shadow:0px 0px 27px 0px rgba(0, 0, 0, 0.06);
                display: flex;
                .content-left {
                    width: 20%;
                    padding: 100px 0;
                    .content-left-title {
                        font-size: 14px;
                        height: 80px;
                        // height: 25%;
                        // padding: 24% 0;
                        display: flex;
                        cursor: pointer;
                        .content-left-mark {
                            width: 5px;
                            height: 30px;
                        }
                        .content-left-mark-color {
                            background-color: $light-color;
                        }
                        .content-left-icon {
                            margin-left: 70px;
                            margin-top: 5px;
                            font-size: 18px;
                        }
                        .content-left-font {
                            margin-left: 10px;
                            line-height: 30px;
                            font-size: 14px;
                        }
                    }
                    .login-title-color {
                        color: $light-color;
                    }
                }
                .content-img {
                    width: 30%;
                    .content-img-show {
                        width: 125%;
                        height: 116%;
                        margin-top: -29px;
                    }
                }
                .content-from {
                    width: 50%;
                    padding: 60px 100px 60px 150px;
                    .content-from-title {
                        font-size: 20px;
                        font-weight: bold;
                        color:rgba(51,51,51,1);
                        margin: 20px 0;
                    }
                    .content-from-input {
                        width: 100%;
                        // display: flex;
                        /deep/.ivu-input {
                            height: 40px;
                        }
                        .content-from-input-input {
                            width: 177px;
                        }
                        .content-from-input-btn {
                            height: 38px;
                            margin-left: 20px;
                        }
                    }
                    .content-from-btn {
                        width: 100%;
                        height: 40px;
                        font-size: 16px;
                    }
                    .content-from-font {
                        padding: 10px 0;
                        & :first-child {
                            color:rgba(153,153,153,1);
                        }
                        & :last-child {
                            float: right;
                            color: $light-color;
                            cursor: pointer;
                        }
                    }
                    // 微信登录
                    .content-from-wxtitle {
                        font-size: 20px;
                        font-weight: bold;
                        color:rgba(51,51,51,1);
                        margin: 20px 0;
                    }
                }
            }
        }
        .img-show {
            width: 100%;
            height: 100%;
        }
    }
</style>
