<template>
    <div>
        <!-- 方案基本信息 -->
        <div class="program">
            <span class="title">方案基本信息</span>
            <Button class="program-confirm" type="primary" @click="confirmPlan">确认方案</Button>
        </div>
        <AdtSchemeInformationRoute :logistics="logistics">
            <template slot="price">
                <Row>
                    <Col span="6">
                        <span>价格区间：{{ listData.lwstPrice }}-{{ listData.hghtPrice }}{{ listData.offerCurrTranslate }}</span>
                    </Col>
                    <Col span="6">
                        <span>时长区间：{{ listData.lwstTmeff }}-{{ listData.hghtTmeff }}{{ listData.tmeffUnitTranslate }}</span>
                    </Col>
                    <!-- <Col span="6">
                        <span>集装箱尺寸类型：{{listData.lwstTmeff}}-{{listData.hghtTmeff}}{{listData.tmeffUnitTranslate}}</span>
                    </Col>
                    <Col span="6">
                        <span>集装箱来源：{{listData.lwstTmeff}}</span>
                    </Col> -->
                </Row>
            </template>
            <template slot="service">
                <!-- 选择代理服务 -->
                <div class="service">
                    <p>
                        <span class="title">选择代理服务:</span>
                        <span>（没有可选代理服务请<span class="contact-us" @click="contactUs">联系我们</span>）</span>
                        <span>单位（元）</span>
                    </p>
                    <Row>
                        <Col v-for="(agentList, id) in schemeProxyList" class="service-proxy" span="6" :key="id">
                            <Checkbox v-model="agentList.checked" :label="agentList.serverCode">
                                <span>{{ agentList.sceneName }}</span>
                                <span>
                                    费用：<Input v-model="agentList.fee" type="text" />
                                </span>
                                <span class="service-price">{{ agentList.currTranslate }}</span>
                            </Checkbox>
                        </Col>
                    </Row>
                </div>
                <!-- 汇率及方案 -->
                <Row class="program">
                    <Col span="10">
                        <span class="title">结算汇率:</span>
                        <RadioGroup v-model="listData.exrtMode" class="program-settlement" @on-change="singleChoice">
                            <Radio label="extrinsic">非固有汇率</Radio>
                            <Radio class="program-inherent" label="inherent">
                                <span>固有汇率</span>
                                <Input v-model="listData.exrt" type="text" />
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col span="6">
                        <span class="title">方案有效期：</span>
                        <DatePicker v-model="listData.endOfTime" type="date" style="width: 200px;" />
                    </Col>
                    <Col span="8">
                        <span class="title">方案截止前&nbsp;</span>
                        <Input v-model="listData.remindTime" style="width: 200px;" />
                        <span class="title">&nbsp;天提醒</span>
                    </Col>
                </Row>
            </template>
        </AdtSchemeInformationRoute>
        <!-- 产品服务信息 -->
        <!-- 语义化标签 -->
        <p class="title">产品服务信息</p>
        <Card>
            <adt-tab-btns
                :height="40"
                :width="200"
                :isUnderline="true"
                :titleNames="titleNames"
                :btnIndex="changeIndex"
                @handleBtn="handleBtn"
            >
                <Divider />
            </adt-tab-btns>
            <!-- 运输服务 -->
            <div class="collapse">
                <Collapse v-model="value" accordion @on-change="changeFont">
                    <Panel
                        v-for="( serverTransportList, index ) in programData[tabNames[changeIndex - 1]]"
                        :key="index"
                        :name=String(index)
                    >
                        <div v-show="changeIndex == 1" class="collapse-head">
                            <span>{{ serverTransportList.departurePortTranslate }}</span>
                            <svg class="icon" aria-hidden="true">
                                <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                            </svg>
                            <span>{{ serverTransportList.destinationPortTranslate }}</span>
                            <span>{{ changeText }}</span>
                        </div>
                        <div v-show="changeIndex == 2" class="collapse-head">
                            <span>{{ serverTransportList.sttnCodeTranslate }}</span>
                            <span>{{ changeText }}</span>
                        </div>
                        <div slot="content" v-show="serverTransportList.serverList">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col class="service-provider" span="8" >
                                    <div class="service-provider-title">
                                        <span class="service-provider-merchant">选择服务商</span>
                                    </div>
                                    <div class="service-provider-company">
                                        <div style="margin-bottom: 10px;">
                                            <Checkbox
                                                :indeterminate="serverTransportList.check.indeterminate"
                                                v-model="serverTransportList.check.checkAll"
                                                @on-change="handleCheckAll(serverTransportList)">全选</Checkbox>
                                        </div>
                                        <CheckboxGroup v-model="serverTransportList.check.checkAllGroup">
                                            <div
                                                v-for="(serviceProvider, id) in serverTransportList.serverList"
                                                :key="id"
                                                @click="selectCompany(id, serviceProvider)"
                                            >
                                                 <Checkbox :class="{'service-select-click': num == id}" :label="serviceProvider.serverCode">
                                                    <p class="service-select">
                                                        <span>{{ serviceProvider.enterpriseName }}</span>
                                                        <span class="price">基础价格: {{ serviceProvider.priceTotal }}{{serviceProvider.currTranslate}}</span>
                                                        <span class="time">时长: {{ serviceProvider.totalTime }}{{ serviceProvider.totalTimeUnit }}</span>
                                                        <div style="position: absolute;" :class="{'triangle': num == id}" />
                                                    </p>
                                                </Checkbox>
                                            </div>
                                        </CheckboxGroup>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product"  v-if="isShow">
                                    <div class="product-title">产品编号: {{serverCode}}</div>
                                    <adt-tab-btns 
                                        :isSmallBtn="true"
                                        :titleNames="titleNamesScenes"
                                        :btnIndex="changeIndexScenes"
                                        @handleBtn="handleBtnScenes"
                                    />
                                    <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                    <adt-tab-btns
                                        :isBaseBtn="true"
                                        :titleNames="titleNamesTask"
                                        :btnIndex="changeIndexTask"
                                        :width="200"
                                        :height="30"
                                        @handleBtn="handleBtnTask"
                                        style="justify-content: flex-start;"
                                    />
                                    <div v-show="changeIndexScenes - 1 == id" v-for="(scence, id) in scenesList" :key="id">
                                        <!-- 任务 -->
                                        <div v-if="changeIndexTask == 1">
                                            <AdtTaskContent
                                                class="spacing"
                                                :basicTask="basicTask"
                                                :additionalTasks="additionalTasks"
                                                :basicTaskData="basicTaskData"
                                            />
                                        </div>
                                        <!-- 监控设置 -->
                                        <div v-show="changeIndexTask == 2">
                                            <div class="spacing">监控:</div>
                                            <div class="monitor">
                                                <div class="monitor-abnormal">
                                                    <Row>
                                                        <Col span="4">异常1</Col>
                                                        <Col span="6">异常通知方式：{{}}</Col>
                                                        <Col span="14">异常通知内容：{{}}</Col>
                                                    </Row>
                                                </div>
                                                <div class="monitor-notice">
                                                    <span>异常通知企业：</span>
                                                </div>
                                            </div>
                                            <div class="monitor">
                                                <div class="monitor-abnormal">
                                                    <Row>
                                                        <Col span="4">异常1</Col>
                                                        <Col span="6">异常通知方式：{{}}</Col>
                                                        <Col span="14">异常通知内容：{{}}</Col>
                                                    </Row>
                                                </div>
                                                <div class="monitor-notice">
                                                    <span>异常通知企业：</span>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 协同协作设置 -->
                                        <div v-show="changeIndexTask == 3">
                                            <div>
                                                <p class="spacing">协同协作1:</p>
                                                <div class="cooperation">
                                                    <div class="cooperation-notice">
                                                        <span>协同协作方：</span>
                                                    </div>
                                                    <Row class="cooperation-description">
                                                        <Col span="8">协同协作方式：{{1122}}</Col>
                                                        <Col span="16">协同协作内容：{{3344}}</Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            <div>
                                                <p class="spacing">协同协作2:</p>
                                                <div class="cooperation">
                                                    <div class="cooperation-notice">
                                                        <span>协同协作方：</span>
                                                    </div>
                                                    <Row class="cooperation-description">
                                                        <Col span="8">协同协作方式：{{1122}}</Col>
                                                        <Col span="16">协同协作内容：{{3344}}</Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </Card>
    </div>
</template>

<script>
    import AdtTaskContent from '@/components/adt-task-content/Index'
    import AdtSchemeInformationRoute from '@/components/adt-scheme-information-route/Index'
    import { toTimestamp } from '@/libs/utils'
    import { apiGetSchemeDetails, apiGetSceneQueryList, apiRecommendModify } from '@/api/logistics'
    export default {
        components: {
            AdtTaskContent,
            AdtSchemeInformationRoute
        },
        data () {
            return {
                tabNames: ['serverTransportList', 'serverStationList', 'serverCustomsList', 'serverBondList'],
                isShow: false,
                listData: {
                    remindTime: '',
                    endOfTime: '',
                    exrtMode: ''
                },
                // 组合数据
                programData: {},
                schemeProxyListModel: [],
                // checkAllGroup: [],
                changeText: '展开',
                // 服务信息
                serviceInformation: {},
                // 基础任务信息
                // taskBaseList: [],
                // 附加任务信息
                // taskAffixList: [],
                // 协同协作信息
                synergisticList: [],
                // 勾选的代理服务及费用
                checkServicePrice: [],
                checkServicePriceData: [],
                // 汇率结算方式
                exrtMode: '',
                // 固有汇率
                inherent: '',
                // 详情数据
                getDetailsData: {},
                // 服务商信息
                showServiceProvider: [],  // 展示的服务商
                serviceProviderList: [],  // 展示的服务商
                selectServiceProvider: [],  // 选择的服务商
                num: '默认值',
                // 方案时间
                // remindTime: '',
                // endOfTime: '',
                value: '',
                serverAgentListModel: [],
                // 选择代理服务
                schemeProxyList: [],
                // 选择服务商
                schemeServer: [],
                schemeServerList: [],
                // 全选服务商
                schemeServerAll: [],
                schemeServerListAll: [],
                // exchangeRate: '',
                selectTime: '',
                changeIndex: 1,
                titleNames: ['运输服务', '场所服务'],
                // titleNames: ['运输服务', '场所服务', '关务服务', '综保区服务'],
                titleNamesScenes: ['场景1', '场景2', '场景3'],
                changeIndexScenes: 1,
                titleNamesTask: ['任务', '监控设置', '协同协作设置'],
                changeIndexTask: 1,
                indeterminate: false,
                checkAll: false,
                logistics: [],
                // 场景数据
                scenesList: [],
                // 基础任务信息
                basicTask: [],
                // 附加任务信息
                additionalTasks: [],
                transportValue: '',
                placeValue: '',
                customsValue: '',
                bondValue: '',
                // 确认时，选择服务商数据
                serverDataList: []
            }
        },
        mounted () {
            // 获取列表中存储在本地sessionStorage的数据
            this.listData = JSON.parse(window.sessionStorage.getItem('logisticsData')) || {}
            this.logistics = this.listData.routeLists || []
            // // 组合数据
            // this.combinedData()
            // 获取产品服务信息
            this.getData()
        },
        methods: {
            getData () {
                const data = {
                    freightReqCode: this.listData.freightReqCode,
                    logisticsSchemeCode: this.listData.logisticsSchemeCode,
                    routeCode: this.listData.routeCode,
                    stepId: this.listData.stepId
                }
                apiGetSchemeDetails({ data }).then( res => {
                    if (res.code == 200) {
                        this.getDetailsData = res.data
                        // 处理代理服务的数据
                        this.schemeProxyList = res.data.schemeProxyList || []
                        this.schemeProxyList.forEach(element => {
                            if (element.checked === 'true') {
                                element.checked = true
                            } else {
                                element.checked = false
                            }
                        })
                        // 组合数据
                        this.combinedData(this.getDetailsData)
                    }
                })
            },
            // 组合数据
            combinedData (data) {
                // 判断数据赋值时不能为null
                data.serverTransportList = data.serverTransportList || []
                data.serverStationList = data.serverStationList || []
                data.serverCustomsList = data.serverCustomsList || []
                data.serverBondList = data.serverBondList || []
                // 将运输服务路段/场所服务场景/关务服务区域/综保区提取出来
                const transportList = []
                const stationList = []
                const customsList = []
                const bondList = []
                data.serverTransportList.forEach(item => {
                    transportList.push({departurePortTranslate: item[0].departurePortTranslate, destinationPortTranslate: item[0].destinationPortTranslate})
                })
                data.serverStationList.forEach(item => {
                    stationList.push({sttnCodeTranslate: item[0].sttnCodeTranslate})
                })
                data.serverCustomsList.forEach(item => {
                    customsList.push({customsCode: item[0].customsCode})
                })
                data.serverBondList.forEach(item => {
                    bondList.push({seboCode: item[0].seboCode})
                })
                // 将服务数据加在listData里面 // 数据深拷贝
                this.listData.serverTransportList = JSON.parse(JSON.stringify(transportList))
                this.listData.serverStationList = JSON.parse(JSON.stringify(stationList))
                this.listData.serverCustomsList = JSON.parse(JSON.stringify(customsList))
                this.listData.serverBondList = JSON.parse(JSON.stringify(bondList))
                // 将供应商的数据加在服务里
                this.addCheck('serverTransportList', data)
                this.addCheck('serverStationList', data)
                this.addCheck('serverCustomsList', data)
                this.addCheck('serverBondList', data)
                this.listData.schemeProxyList = data.schemeProxyList
                this.programData = {...this.listData }
                // 将服务商状态为true的勾选上
                this.tickTwice('serverTransportList')
                this.tickTwice('serverStationList')
                this.tickTwice('serverCustomsList')
                this.tickTwice('serverBondList')
                console.log(this.programData)
            },
            // 数据处理 将供应商的数据加在服务里
            addCheck (val, data) {
                this.listData[val].forEach((item, index) => {
                    item.serverList = data[val][index]
                    item.check = {
                        checkAllGroup: [],
                        checkAll: false,
                        indeterminate: false
                    }
                })
            },
            // 二次进入页面服务商复选
            tickTwice (val) {
                this.programData[val].forEach(element => {
                    if (element.serverList) {
                        element.serverList.forEach(item => {
                            if (item.checked == 'true') {
                                element.check.checkAllGroup.push(item.serverCode)
                            }
                        })
                    }
                })
            },
            handleBtn (index) {
                this.changeIndex = index + 1
                this.value = []
                this.changeText = '展开'
            },
            handleBtnScenes (index) {
                this.changeIndexScenes = index + 1
                // 场景切换的时候重新从后台拿数据
                this.scenesDataHandle(this.scenesList)
            },
            handleBtnTask (index) {
                this.changeIndexTask = index + 1
            },
            // 联系我们
            contactUs () {
                // console.log(1231)
            },
            // 折叠面板展开/收起切换
            changeFont (index) {
                if (this.isShow == true) {
                    this.isShow = false
                }
                if (this.changeText == '展开') {
                    this.changeText = '收起'
                } else {
                    this.changeText = '展开'
                }
            },
            // 单选汇率结算
            singleChoice (val) {
                // 非固有
                if (val == 'extrinsic') {
                    this.listData.exrtMode = 'extrinsic'
                }
                // 固有
                if (val == 'inherent') {
                    this.listData.exrtMode = 'inherent'
                }
            },
            // 全选
            handleCheckAll (serverData) {
                const check = serverData.check
                const dataList = serverData.serverList
                if (check.checkAll) {
                    // 将返回的服务商的名字提出来
                    dataList.forEach(element => {
                        element.checked = true
                        this.selectServiceProvider.push(element.serverCode)
                    })
                    check.checkAllGroup = this.selectServiceProvider
                    this.schemeServerAll = serverData.serverList
                } else {
                    dataList.forEach(element => {
                        element.checked = false
                    })
                    check.checkAllGroup = []
                    this.selectServiceProvider = []
                    this.schemeServerAll = []
                }
            },
            checkChange (val) {
                // console.log(val)
            },
            // 选择服务商
            selectCompany (id, val) {
                if (event.target.nodeName !== 'INPUT') return
                this.num = id
                this.serverCode = val.serverCode
                const data = {
                    "serverCode": val.serverCode,
                    "serviceType": val.serviceType
                }
                if (val.checked == 'false') {
                    val.checked = 'true'
                } else {
                    val.checked = 'false'
                }
                apiGetSceneQueryList({ data: data }).then(res => {
                    if (res.code == 200) {
                        if (res.data.length) {
                            this.isShow = true
                            this.scenesList = res.data || []
                            // this.programData.scenesList = this.scenesList
                            // console.log(this.programData)
                            this.scenesDataHandle(this.scenesList)
                        } else {
                            this.isShow = false
                        }
                    } else {
                        this.isShow = false
                    }
                })
            },
            // 动态添加场景
            scenesDataHandle (data) {
                const arr = []
                const scenesTransition = data[Number(this.changeIndexScenes) - 1] || {}
                data.forEach((item,index) => {
                    arr.push(item.sceneName)
                });
                this.titleNamesScenes = arr
                this.basicTaskData = {
                    serverDuration: scenesTransition.serverDuration,
                    serverDurationUnitTranslate: scenesTransition.serverDurationUnitTranslate,
                    taskCost: scenesTransition.taskCost,
                    currTranslate: scenesTransition.currTranslate,
                }
                this.basicTask = scenesTransition.taskRes.taskBaseList || []
                this.additionalTasks = scenesTransition.taskRes.taskAffixList || []
            },
            // 确认服务方案
            confirmPlan () {
                // 确认服务商前先将数据置空
                this.serverDataList = []
                const assignmentData = JSON.parse(JSON.stringify(this.programData))
                const arr = []
                assignmentData.serverTransportList.forEach((element, index) => {
                    if (element.check.checkAllGroup.length !== 0) {
                        arr.push(1)
                    }
                })
                this.addService('serverTransportList')
                this.addService('serverStationList')
                this.addService('serverCustomsList')
                this.addService('serverBondList')
                // 将选中的数据筛选并添加 代理服务
                const agencyService = []
                const arrSchemeProxyList = JSON.parse(JSON.stringify(this.programData.schemeProxyList))
                arrSchemeProxyList.forEach(element => {
                    element.checked = String(element.checked)
                    element.freightReqCode = this.programData.freightReqCode
                    element.logisticsSchemeCode = this.programData.logisticsSchemeCode
                    element.fee = Number(element.fee)
                    element.curr = 'CNY'
                })
                const data = {
                    endOfTime: this.listData.endOfTime, // "方案截止日期"
                    exrt: this.listData.exrt, // "结算汇率",
                    exrtMode: this.listData.exrtMode, // "结算汇率方式",
                    freightReqCode: this.listData.freightReqCode,  //"货物需求编号",
                    logisticsSchemeCode: this.listData.logisticsSchemeCode, // "物流方案编号",
                    remindTime: this.listData.remindTime, // 方案截止前提醒时间,
                    schemeProxyList: arrSchemeProxyList, // 选择的代理服务
                    schemeServerList: this.schemeServerList,  // 选择的服务商
                    totalPrices: this.programData.totalPrices, //'总价'
                    schemeValidity: this.programData.schemeValidity, //总时长
                    schemeValidityUnit: this.programData.schemeValidityUnit // 总时长单位
                }
                if (arr.length == assignmentData.serverTransportList.length) {
                    apiRecommendModify({ data: data }).then(res => {
                        if (res.code == 200) {
                            this.$Message.info("确定成功")
                            // 确定成功跳转到物流方案列表
                            this.$router.push({path : '/logistics-solutions/customer-service-plan/1'})
                        }
                    })
                } else {
                    this.$Message.info("请选择运输服务")
                }
            },
            // 将选中的服务商添加到服务
            addService (val) {
                const assignmentData = JSON.parse(JSON.stringify(this.programData))
                assignmentData[val].forEach(element => {
                    if (element.serverList) {
                        element.serverList.forEach(item => {
                            item.logisticsSchemeCode = this.programData.logisticsSchemeCode
                            this.serverDataList.push(item)
                            // if (item.checked == true) {
                            //     item.logisticsSchemeCode = this.programData.logisticsSchemeCode
                            //     serverStationList.push(item)
                            // }
                        })
                    }
                })
                this.schemeServerList = [ ...this.serverDataList ]
            }
        },
    }
</script>

<style lang="scss" scoped>
    .ivu-checkbox-wrapper {
        display: block;
    }
    .ivu-divider-horizontal {
        margin: 10px 0;
    }
    .title {
        padding: 20px 0 10px 20px;
        width: 100%;
        font-size: $font-size-base;
        font-weight: bold;
    }
    .program {
        display: flex;
    }
    .contact-us {
        color: $light-color;
        cursor: pointer;
    }
    // 确认方案按钮
    .program-confirm {
        width: 128px;
        margin-top: 6px;
    }
    // 选择代理服务
    .service {
        padding-bottom: 20px;
        border-bottom: 1px dashed $border-color;
        .service-proxy {
            margin-top: 10px;
            padding-left: 10px;
            // 修改输入框的长度
            .ivu-input-wrapper {
                // width: 55%;
                width: 120px;
            }
        }
    }

    // 汇率及方案
    .program {
        // padding-top: 20px;
        .program-settlement {
            padding-left: 20px;
            font-size: $font-size-base;
            font-weight: bold;
            .program-inherent {
                display: inline-block;
                padding-left: 20px;
                // 修改输入框的长度
                .ivu-input-wrapper {
                    padding-left: 5px;
                    width: 75%;
                }
            }
        }
    }

    /* 修改展开记录公共样式 */
        .collapse {
            background: #fff;
            max-height: 500px;
            overflow-y: auto;
            .collapse-head {
                padding-top: 10px;
                span {
                    font-size:20px;
                    font-family:Microsoft YaHei;
                    font-weight:400;
                    &:last-child {
                        float: right;
                        margin-right: 30px;
                        font-size: 10px;
                    }
                }
                .icon {
                    width: 100px;
                    height: 17px;
                }
            }
            .ivu-collapse {
                border: none;
                background-color: #fff;
                .ivu-collapse-item {
                    background-color: #fff6e5;
                    border: none;
                    margin-bottom: 10px;
                    /deep/.ivu-collapse-header {
                        border: 0;
                        font-size: 14px;
                        height: 60px;
                        padding-left: 20px;
                        /deep/.ivu-icon-ios-arrow-forward {
                            position: absolute;
                            right: 0;
                            top: 38%;
                        }
                    }
                    /deep/.ivu-collapse-content {
                        background-color: $filling-color;
                    }
                }
            }
        }

    // 选择服务商
    .service-provider {
        padding: 4px 0;
        .service-provider-title {
            .service-provider-merchant  {
                font-size: $font-size-large;
                font-weight: bold;
                color: $main-font-color;
            }
            .service-provider-group {
                float: right;
                font-weight: bold;
                margin-right: 30px;
                margin-top: 3px;
                cursor: pointer;
            }
        }
        .service-provider-company {
            margin: 10px 30px 0 0;
            padding: 10px 0 10px 20px;
            background-color: white;
            .ivu-checkbox-group-item {
                width: 95%;
                position: relative;
                p {
                    padding: 5px 0 5px 10px;
                    cursor: pointer;
                    display: inline-block;
                }
                .service-select {
                    .price {
                        margin-left: 10px;
                    }
                    .time {
                        margin-left: 20px;
                    }
                }
                &:hover {
                    background-color: $filling-color;
                }
            }
            .service-select-click {
                background-color: $filling-color;
            }
            .triangle {
                position: absolute;
                right: -20px;
                top: 10px;
                width: 0; 
                height: 0;
                border-width: 5px;
                border-style: solid;
                border-color: $light-color transparent transparent transparent;
                transform: rotate(270deg)
            }
        }
    }
    // 产品详情
    .product {
        padding: 4px 0;
        .product-title {
            padding-bottom: 10px;
            margin-bottom: 10px;
            font-size: $font-size-large;
            font-weight: bold;
            color: $main-font-color;
            border-bottom: 1px solid $border-color;
        }
        /deep/.tabTitle {
            justify-content: flex-start;
        }
    }
    // 监控
    .monitor {
        background-color: white;
        .monitor-abnormal {
            padding: 10px 0;
            margin: 0 20px;
            border-bottom: 1px dashed  $border-color;
        }
        .monitor-notice {
            padding: 10px 20px;
            border-bottom: 1px solid $light-color;
            .monitor-notice-people{
                border: 1px solid $placeholder-font-color;
                border-radius: 5px;
                padding: 3px;
                color: $main-font-color;
            }
            .monitor-company {
                padding: 10px 50px;
            }
        }
        &:last-child {
            .monitor-notice {
                border-bottom: none;
            }
        }
    }
    // 通用间距顶部和底部10px
    .spacing {
        margin: 10px 0;
    }
    // 协同协作
    .cooperation {
        padding: 0 20px;
        background-color: white;
        .cooperation-notice {
            padding: 10px 0;
            border-bottom: 1px dashed  $border-color;
            .cooperation-notice-people{
                border: 1px solid $placeholder-font-color;
                border-radius: 5px;
                padding: 3px;
                color: $main-font-color;
            }
            .cooperation-company {
                padding: 10px 50px;
            }
        }
        .cooperation-description {
            padding: 10px 0;
        }
    }
</style>