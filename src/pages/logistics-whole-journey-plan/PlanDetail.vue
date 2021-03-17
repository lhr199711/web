<template>
    <div class="whole-plan-generate">
        <p class="topbar-title">路线信息</p>
        <div class="topbar">
            <div class="path-info">
                <ul>
                    <li v-for="(item,key) of data.routeList" :key="key">
                        <span class="path">{{ item.departurePortTranslate }}</span>
                        <svg v-if="item.trspMode != '3'" class="icon icon-train" aria-hidden="true">
                            <use v-if="item.trspMode === '4'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_huoche" />
                            <use v-if="item.trspMode === '1'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_lunchuan" />
                            <use v-if="item.trspMode === '2'" fill="#FFBB32" xlink:href="#icon-feiji800" />
                        </svg>
                         <svg v-if="item.trspMode === '3'" class="icon icon-train icon-car" aria-hidden="true">
                             <use fill="#FFBB32" xlink:href="#icon-huoche" />
                         </svg>
                        <small>{{ item.logisticsTypeTranslate }}</small>
                        <svg class="iconfont icon-arrows" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_jiantou" />
                        </svg>
                        <template v-if="key === data.routeList.length - 1">
                            <span class="path last-path">{{ item.destinationPortTranslate }}</span>
                        </template>
                    </li>
                </ul>
                <p class="desc">
                    <span>物流委托编号：{{ data.executoryEntrustCode }}</span>
                    <span>物流计划时间：{{ timestampFormat(data.predctStartTime) }}  --  {{ timestampFormat(data.predctEndTime) }}</span>
                    <span>时长：{{ data.schemeValidity }}{{ data.schemeValidityUnitTranslate }}</span>
                    <span>费用：{{ data.totalPrices }}{{ data.currTranslate }}</span>
                </p>
            </div>
        </div>
        <div class="content">
            <div class="top-title">
                <p class="tit">物流全程计划编号：{{ data.planCode }}</p>
                <p v-if="data.routeList" class="btn">
                    <Button
                        v-if="(data.routeList[0].orderStatus != 'FINISH') && (data.planStatus == 'UNGSREDY')"
                        class="left"
                        :disabled="issuePlanBtnShow"
                        @click="issuePlan"
                    >下发计划</Button>
                </p>
                <p v-if="btnShow" class="btn">
                    <Button class="left" @click="reportClick">上报客户/销售</Button>
                </p>
            </div>
            <div class="box">
                <div class="plan">
                    <ul>
                        <li v-for="(item, key) of nodeList" :key="key">
                            <p class="line-city-box">
                                <span class="radio" :class="{'radio-finish': item.orderStatus == 'FINISH'}"></span>
                                <span class="line-shu" :class="{'line-shu-finish': item.orderStatus == 'FINISH'}">
                                    <svg :class="{'iconfont-finish': item.orderStatus == 'FINISH'}" class="iconfont" aria-hidden="true">
                                        <use xlink:href="#icon-andaotongcaidanICON_xiaojiantou" />
                                    </svg>
                                </span>
                                <span class="port">{{ item.port }}</span>
                                <span class="line-class">
                                    <span class="line-top">---</span>
                                    <span class="line">----------</span>
                                    <span class="line2">---</span>
                                    <span class="line3"></span>
                                </span>
                                <svg class="iconfont iconfont-jiantou" aria-hidden="true" :class="{'iconfont-jiantou-finish': item.orderStatus == 'FINISH'}">
                                    <use xlink:href="#icon-andaotongcaidanICON_xiaojiantou" />
                                </svg>
                            </p>
                            <div class="btn-box">
                                <p class="btn">
                                    <span v-if="!item.roadList" class="button no-click">节点服务</span>
                                    <span
                                        v-else
                                        class="button"
                                        :class="{'button-click': clickBtnNum == key}"
                                        @click="nodeServeClick(key, item)"
                                    >节点服务</span>
                                    <span
                                        v-if="item.orderStatus === 'FINISH' && item.roadList"
                                        class="button button-gray"
                                        :class="{'button-click': clickBtnNum == key}"
                                        @click="nodeServeClick(key, item)"
                                    >节点服务</span>
                                    <svg
                                        v-if="item.roadList"
                                        v-show="clickBtnNum == key"
                                        class="iconfont"
                                        aria-hidden="true"
                                    >
                                        <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_xiaojiantou" />
                                    </svg>
                                </p>
                                <p class="btn btn-two">
                                    <span
                                        v-if="item.orderStatus === 'FINISH'"
                                        class="button button-gray"
                                        :class="{'button-click': clickBtnTwoNum == key}"
                                        @click="transportServeClick(key, item)"
                                    >运输服务</span>
                                    <span
                                        v-else
                                        class="button"
                                        :class="{'button-click': clickBtnTwoNum == key}"
                                        @click="transportServeClick(key, item)"
                                    >运输服务</span>
                                    <svg v-show="clickBtnTwoNum == key" class="iconfont" aria-hidden="true">
                                        <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_xiaojiantou" />
                                    </svg>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 产品 -->
                <div class="plan-box">
                    <!-- 节点 -->
                    <div v-if="nodeServeShow" class="plan-content">
                        <adt-tab-btns
                            :height="40"
                            :width="150"
                            :isUnderline="isUnderline"
                            :titleNames="titleNames"
                            :btnIndex="changeIndex"
                            @handleBtn="handleBtn"
                        />
                        <div class="guanwu">
                            <p class="title">{{ transportServer.serverName }}（服务时长{{ transportServer.totalTime }}小时）</p>
                            <div class="time">
                                <p class="name">{{ transportServer.etpsNameTranslate }}</p>
                                <div class="time-input">
                                    <span>计划时间：{{ timestampFormat(transportServer.planStartTime) }} -- {{ timestampFormat(transportServer.planEndTime) }}</span>
                                    <span v-show="transportServer.predctStartTime" style="marginTop: 10px;">实际时间：{{ timestampFormat(transportServer.predctStartTime) }} -- {{timestampFormat(transportServer.predctEndTime)}}</span>
                                </div>
                            </div>
                            <!-- 场景 -->
                            <div class="scene">
                                <p class="scene-box">
                                    <span
                                        v-for="(item, key) of transportServer.sceneList"
                                        :key="key"
                                        :class="{'scene-click': key == sceneNum}"
                                        class="scene-name"
                                        @click="sceneClick(key)"
                                    >{{ item.sceneName }}</span>
                                </p>
                                <div v-show="sceneNum == key" v-for="(item, key) of transportServer.sceneList" :key="key">
                                    <p class="task">
                                        <span class="task-name">基础任务内容：<small>（服务总价：{{ item.curr }}{{ item.taskCost }}/箱 总时长：{{ item.serverDuration }}{{ item.serverDurationUnitTranslate }}）</small></span>
                                        <span class="task-content">
                                            <span v-for="(list, index) of item.taskBasesList" :key="index">{{ list.taskName }}</span>
                                        </span>
                                    </p>
                                    <p class="task additional">
                                        <span class="task-name">附加任务内容：</span>
                                        <span class="task-content">
                                            <span v-for="(list, index) of item.taskAffixesList" :key="index">{{ list.taskName }}<small>（价格：{{ list.taskCost }}{{ list.currTranslate || list.curr }} 时长：{{ list.serverDuration }}{{ list.serverDurationUnitTranslate || list.serverDurationUnit }}）</small></span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 运输 -->
                    <div v-else class="plan-content">
                        <div class="guanwu">
                            <p class="title">{{ transportServer.serverName }}（服务时长{{ transportServer.totalTime }}小时）</p>
                            <div class="time">
                                <p class="name">{{ transportServer.etpsNameTranslate }}</p>
                                <div class="time-input">
                                    <span>计划时间：{{ timestampFormat(transportServer.planStartTime) }} -- {{ timestampFormat(transportServer.planEndTime) }}</span>
                                    <span v-show="transportServer.predctStartTime" style="marginTop: 10px;">实际时间：{{ timestampFormat(transportServer.predctStartTime) }} -- {{ timestampFormat(transportServer.predctEndTime) }}</span>
                                </div>
                            </div>
                            <!-- 场景 -->
                            <div class="scene">
                                <p class="scene-box">
                                    <span
                                        v-for="(item, key) of transportServer.sceneList"
                                        :key="key"
                                        :class="{'scene-click': key == sceneNum}" @click="sceneClick(key)"
                                        class="scene-name"
                                    >{{ item.sceneName }}</span>
                                </p>
                                <div v-show="sceneNum == key" v-for="(item, key) of transportServer.sceneList" :key="key">
                                    <p class="task">
                                        <span class="task-name">基础任务内容：<small>（服务总价：{{ item.curr }}{{ item.taskCost }}/箱 总时长：{{ item.serverDuration }}{{ item.serverDurationUnitTranslate }}）</small></span >
                                        <span class="task-content">
                                            <span v-for="(list, index) of item.taskBasesList" :key="index">{{ list.taskName }}</span>
                                        </span>
                                    </p>
                                    <p class="task additional">
                                        <span class="task-name">附加任务内容：</span>
                                        <span class="task-content">
                                            <span v-for="(list, index) of item.taskAffixesList" :key="index">{{ list.taskName }}<small>（价格：{{ list.taskCost }}{{ list.currTranslate || list.curr }} 时长：{{ list.serverDuration }}{{ list.serverDurationUnitTranslate || list.serverDurationUnit }}）</small></span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { toTimestamp } from '@/libs/utils'
    import { apiRouteDetail,
        apiSceneDetail,
        apiIssuedPlan,
        apiReportPlan
    } from '@/api/logisticsWholeJourneyPlan'
    import { timestampFormat } from '@/libs/utils'
    export default {
        props: {
            planCode: ''
        },
        data () {
            return {
                data: {},
                nodeList: [],
                clickBtnNum: 0,
                planShow: false,
                sceneData: [],
                clickBtnTwoNum: -1,
                titleNames: ['场所服务'],
                changeIndex: 1,
                isUnderline: true,
                // 节点能否点击
                nodeClickShow: true,
                // 场景的索引
                sceneNum: 0,
                // 节点上面的
                nodeServeShow: true,
                // 服务商拒绝的提示
                warnShow: false,
                isShowModal: false,
                msgText: '',
                // 运输服务的值
                transportServer: {},
                // 判断节点是否点击保存
                saveIs: [],
                // 判断运输是否点击保存
                transportSaveIs: [],
                // 最大的数据
                saveData: {},
                // 下发的按钮
                issuePlanBtnShow: false,
                // 上报
                btnShow: false
            }
        },
        mounted () {
            this.getData()
        },
        methods: {
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp)
            },
            // 初始化数据
            getData () {
                apiRouteDetail({ planCode: this.planCode }).then(res => {
                    this.data = res.data
                    // 还没上报的要显示上报按钮
                    if (this.data.planStatus === 'CREATE') {
                        this.btnShow = true
                    }
                    let portVal = []
                    for (let index = 0; index < this.data.routeList.length; index++) {
                        const item = this.data.routeList[index]
                        let affix = {}
                        this.$set(affix, 'departurePort', item.departurePortTranslate)
                        this.$set(affix, 'destinationPort', item.destinationPortTranslate)
                        this.$set(affix, 'port', item.departurePortTranslate)
                        this.$set(affix, 'logisticsSchemeCode', item.logisticsSchemeCode)
                        this.$set(affix, 'orderStatus', item.orderStatus)
                        this.$set(affix, 'routeList', [])
                        for (const list of item.routeList) {
                            let routeListVal = {}
                            this.$set(routeListVal, 'serverCode',list.serverCode)
                            this.$set(routeListVal, 'serverType',list.serverType)
                            this.$set(routeListVal, 'serverName',list.serverName)
                            affix.routeList.push(routeListVal)
                        }
                        portVal.push(affix)
                        if (index == this.data.routeList.length - 1) {
                            affix = {}
                            this.$set(affix, 'departurePort', item.departurePortTranslate)
                            this.$set(affix, 'destinationPort', item.destinationPortTranslate)
                            this.$set(affix, 'port', item.destinationPortTranslate)
                            this.$set(affix, 'logisticsSchemeCode', item.logisticsSchemeCode)
                            this.$set(affix, 'orderStatus', item.orderStatus)
                            this.$set(affix, 'routeList', [])
                            portVal.push(affix)
                        }
                    }
                    portVal.forEach(element => {
                        this.data.roadList.forEach(road => {
                            if (element.port === road.nodeCodeTranslate) {
                                this.$set(element, 'roadList', road.roadList)
                            }
                        })
                    })
                    this.nodeList = portVal
                    this.$set(this.saveData, 'curr', this.data.curr)
                    this.$set(this.saveData, 'schemeValidity', this.data.schemeValidity)
                    this.$set(this.saveData, 'schemeValidityUnit', this.data.schemeValidityUnit)
                    this.$set(this.saveData, 'logisticsSchemeCode', this.data.logisticsSchemeCode)
                    this.$set(this.saveData, 'executoryEntrustCode', this.data.executoryEntrustCode)
                    this.$set(this.saveData, 'serverList', [])
                    // 如果一进入页面判断有没有节点，没节点，就让clickBtnTwoNum = 0
                    if (!this.nodeList[0].roadList) {
                        this.clickBtnTwoNum = 0
                        this.clickBtnNum = -1
                    }
                })
            },
            // 点击节点上的tab
            handleBtn (index, titleItem) {
                this.changeIndex = index + 1
            },
            // 点击场景
            sceneClick (index) {
                this.sceneNum = index
            },
            // 点击节点
            nodeServeClick (key, item) {
                this.planShow = true
                let data = {
                    logisticsSchemeCode: this.data.logisticsSchemeCode,
                    serverCode: item.roadList[0].serverCode,
                    serverType: item.roadList[0].serverType,
                    planCode: this.data.planCode
                }
                apiSceneDetail({ data }).then(res => {
                    this.$set(res.data[0], 'serverType', item.roadList[0].serverType)
                    this.transportServer = res.data[0]
                    this.$set(item.roadList[0], 'serveList', this.transportServer)
                    // 推入保存的数据结构中
                    this.saveData.serverList.push(res.data[0])
                })
                this.clickBtnNum = key
                this.clickBtnTwoNum = -1
                // 如果里面不存在节点服务，就置灰节点
                if (!item.roadList) {
                    this.nodeClickShow = false
                }
                this.nodeServeShow = true
            },
            // 点击运输
            transportServeClick (key, item) {
                console.log(item)
                this.planShow = true
                let data = {
                    logisticsSchemeCode: this.data.logisticsSchemeCode,
                    serverCode: item.routeList[0].serverCode,
                    serverType: item.routeList[0].serverType,
                    planCode: this.data.planCode
                }
                apiSceneDetail({ data }).then(res => {
                    this.$set(res.data, 'serverType', item.routeList[0].serverType)
                    this.transportServer = res.data
                    this.$set(item.routeList[0], 'serveList', this.transportServer)
                    this.saveData.serverList.push(res.data)
                    this.transportSaveIs.push(key)
                })
                this.clickBtnTwoNum = key
                this.clickBtnNum = -1
                this.nodeServeShow = false
            },
            // 下发计划
            issuePlan () {
                apiIssuedPlan({ planCode: this.data.planCode }).then(res => {
                    this.$Message.info(res.message)
                    if (res.code === '200') {
                        this.issuePlanBtnShow = true
                    }
                })
            },
            // 上报
            reportClick () {
                let data = {
                    executoryEntrustCode: this.data.executoryEntrustCode,
                    logisticsSchemeCode: this.data.logisticsSchemeCode,
                    planCode: this.data.planCode
                }
                apiReportPlan({ data }).then(res => {
                    if (res.code == '200') {
                        this.$Message.success('上报成功')
                        this.btnShow = false
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .radio-finish {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 15px;
        background: #FCC163!important;
        border-radius: 50%;
    }
    .line-shu-finish {
        position: absolute;
        top: 36px;
        left: 4px;
        width: 1px;
        height: 66px;
        background: #FCC163!important;
        .iconfont-finish {
            position: absolute;
            transform: rotate(90deg);
            bottom: -16px;
            left: -5px;
            color: #FCC163!important;
        }
    }
    .iconfont-jiantou-finish {
        color: #c8c8c8 !important;
    }
    .whole-plan-generate {
        .topbar-title {
            color: #333;
            font-size: 16px;
            margin: 10px 50px;
        }
        .topbar {
            box-shadow:0px 2px 4px 0px rgba(51,51,51,0.1);
            .path-info {
                padding: 20px;
                padding-bottom: 0;
                line-height: 4;
                background: #ffffff;
                ul {
                    overflow-x: auto;
                    white-space: nowrap;
                    background: #f9f9f9;
                    padding: 0 42px;
                    li {
                        display: inline-block;
                        vertical-align: middle;
                        .path {
                            margin: 0 30px;
                            vertical-align: middle;
                        }
                        .icon-train {
                            width: 22px;
                            height: 20px;
                            color: $warning-color;
                            margin: 0 4px;
                            vertical-align: middle;
                        }
                        .icon-car {
                            transform: rotateY(180deg);
                        }
                        small {
                            color: $light-color;
                        }
                        .icon-arrows {
                            width: 76px;
                            color: $light-color;
                        }
                        &:first-child {
                            .path {
                                font-size: 20px;
                                font-weight: bold;
                                margin-left: 0;
                            }
                        }
                        &:last-child {
                            .last-path {
                                font-size: 20px;
                                font-weight: bold;
                            }
                        }
                    }
                }
                .desc {
                    padding: 0 40px;
                    span {
                        display: inline-block;
                        margin-right: 100px;
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
        .content {
            .top-title {
                margin-top: 10px;
                padding: 10px 42px;
                padding-bottom: 0;
                line-height: 2;
                .tit {
                    display: inline-block;
                    color: #333;
                    font-size: 16px;
                }
                .btn {
                    display: inline-block;
                    position: absolute;
                    right: 20px;
                    .left {
                        margin-right: 20px;
                    }
                }
            }
            .box {
                margin-top: 10px;
                .plan {
                    display: inline-block;
                    width: 42%;
                    min-height: 600px;
                    background: #fff;
                    padding: 20px 32px;
                    padding-right: 10px;
                    ul {
                        overflow: visible;
                    }
                    li {
                        position: relative;
                        overflow: visible;
                        margin-top: 16px;
                        &:first-child {
                            margin-top: 0;
                            .line-top {
                                display: none;
                            }
                            .line-city-box {
                                .radio {
                                    background: #FCC163;
                                }
                            }
                        }
                        &:last-child {
                            .line-shu {
                                display: none;
                            }
                            .line2 {
                                display: none;
                            }
                            .line3  {
                                display: none;
                            }
                            .btn-two {
                                display: none;
                            }
                        }
                        .line-city-box {
                            display: inline-block;
                            width: 72%;
                        }
                        .btn-box {
                            display: inline-block;
                            position: relative;
                            width: 28%;
                            line-height: 3;
                            vertical-align: top;
                            .btn-two {
                                background: #fff;
                                margin-top: 20px;
                            }
                            .btn {
                                .button-gray {
                                    background:rgba(249,249,249,1);
                                    color: #999;
                                    border: 0;
                                    border-radius:4px;
                                }
                            }
                        }
                        .radio {
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            background: #E5E5E5;
                            margin-right: 15px;
                            border-radius: 50%;
                        }
                        .line-shu {
                            position: absolute;
                            top: 36px;
                            left: 4px;
                            width: 1px;
                            height: 66px;
                            background: #E5E5E5;
                            .iconfont {
                                position: absolute;
                                bottom: -16px;
                                left: -5px;
                                color: #E5E5E5;
                                transform: rotate(90deg);
                            }
                        }
                        .port {
                            display: inline-block;
                            width: 62%;
                            font-size: 20px;
                            background: #FFF6E5;
                            padding: 4px 10px;
                        }
                        .iconfont {
                            font-size: 10px;
                            vertical-align: middle;
                        }
                        .line-class {
                            display: inline-block;
                            position: relative;
                            .line-top {
                                position: absolute;
                                left: 0;
                                top: -10px;
                                color: #999;
                            }
                            .line {
                                color: #999;
                            }
                            .line2 {
                                position: absolute;
                                left: 0;
                                bottom: -10px;
                                color: #999;
                            }
                            .line3 {
                                position: absolute;
                                top: 23px;
                                left: 18px;
                                height: 96px;
                                color: #999;
                                writing-mode: tb-rl;
                                border-left: 1px dashed #999;
                            }
                        }
                        .iconfont-jiantou {
                            color: $light-color;
                        }
                        .btn {
                            display: inline-block;
                            .button {
                                display: inline-block;
                                position: relative;
                                color: #515a6e;
                                font-size: 12px;
                                width: 112px;
                                height: 32px;
                                padding: 10px 18px;
                                margin-right: 4px;
                                text-align: center;
                                line-height: 1;
                                border: 1px solid rgba(153,153,153,1);
                                border-radius: 4px;
                                cursor: pointer;
                            }
                            .button-click {
                                background: $light-color !important;
                                color: #fff !important;
                                border: 1px solid $light-color !important;
                            }
                            .no-click {
                                background: #e5e5e5;
                                border: none;
                                cursor: not-allowed;
                            }
                            .ok-icon {
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                font-size: 22px;
                            }
                        }
                    }
                }
                .plan-box {
                    display: inline-block;
                    width: 56%;
                    background: #fff;
                    margin-left: 20px;
                    vertical-align: top;
                }
                .plan-content {
                    display: inline-block;
                    width: 100%;
                    min-height: 600px;
                    background: #fff;
                    padding: 20px;
                    .guanwu {
                        margin-top: 10px;
                        .title {
                            color: #333;
                            background: #FFF6E5;
                            padding: 12px;
                        }
                        .time {
                            padding: 20px 0;
                            border-bottom: 1px solid #999;
                            line-height: initial;
                            .name {
                                display: inline-block;
                                font-size: 16px;
                                color: #333;
                                font-weight: bold;
                            }
                            .time-input {
                                display: inline-block;
                                margin-left: 60px;
                                vertical-align: top;
                                span {
                                    display: block;
                                }
                                /deep/ .ivu-form {
                                    display: inline-block;
                                }
                                /deep/ .ivu-form-item-content {
                                    margin-left: 0 !important;
                                }
                            }
                            .warn {
                                color: red;
                                background: #FEE9E8;
                                font-size: 12px;
                                padding: 4px 30px;
                                margin-top: 10px;
                                .ivu-icon-md-close {
                                    float: right;
                                    line-height: 1.5;
                                }
                            }
                        }
                        .scene {
                            margin-top: 20px;
                            .scene-box {
                                overflow: auto;
                                white-space: nowrap;
                                @extend %scrollbar-crosswise;
                            }
                            .scene-name {
                                display: inline-block;
                                color: #666;
                                background: #e5e5e5;
                                padding: 2px 30px;
                                margin-left: 20px;
                                border-radius: 4px;
                                cursor: pointer;
                                &:first-child {
                                    margin: 0;
                                }
                            }
                            .scene-click {
                                background: #E8EFF5;
                                border: 1px solid $light-color;
                            }
                            .task {
                                margin-top: 10px;
                                padding-top: 8px;
                                border-top: 1px dashed #c8c8c8;
                                .task-name {
                                    display: block;
                                    color: #666;
                                    font-weight: bold;
                                    small {
                                        color: #999;
                                    }
                                }
                                .task-content {
                                    display: inline-block;
                                    width: 100%;
                                    color: #666;
                                    background: #F9F9F9;
                                    padding: 20px;
                                    margin-top: 10px;
                                    span {
                                        width: 20%;
                                        display: inline-block;
                                    }
                                }
                            }
                            .additional {
                                border: none;
                                .task-content {
                                    span {
                                        width: 50%;
                                        line-height: 2;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .line-city-box-ing {
        .radio {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #FCC163 !important;
            margin-right: 15px;
            border-radius: 50%;
        }
        .line-shu {
            position: absolute;
            width: 1px;
            height: 66px;
            top: 36px;
            left: 4px;
            background: #FCC163!important;
            .iconfont {
                position: absolute;
                transform: rotate(90deg);
                bottom: -16px;
                left: -5px;
                color: #FCC163!important;
            }
        }
    }
</style>
