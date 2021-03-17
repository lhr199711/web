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
                    <span v-show="planTime">物流计划时间：{{ timestampFormat(predctStartTime) }}  --  {{ timestampFormat(predctEndTime) }}</span>
                    <span>时长：{{ data.schemeValidity }}{{ data.schemeValidityUnit }}</span>
                    <span>费用：{{ data.totalPrices }}{{ data.curr }}</span>
                </p>
            </div>
        </div>
        <div class="content">
            <div class="top-title">
                <p class="tit">物流全程计划</p>
                <p v-if="btnShow" class="btn">
                    <Button class="left" :disabled="reportBtnDisable" @click="reportClick">上报客户/销售</Button>
                    <Button type="primary" :disabled="saveBtnDisable" @click="save">保存计划</Button>
                </p>
            </div>
            <div class="box">
                <div class="plan">
                    <ul>
                        <li v-for="(item, key) of nodeList" :key="key">
                            <p class="line-city-box">
                                <span class="radio"></span>
                                <span class="line-shu">
                                    <svg class="iconfont" aria-hidden="true">
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
                                <svg class="iconfont" aria-hidden="true">
                                    <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_xiaojiantou" />
                                </svg>
                            </p>
                            <div class="btn-box">
                                <p class="btn">
                                    <span v-if="!item.roadList" class="button no-click">节点服务设置</span>
                                    <span
                                        v-else
                                        class="button"
                                        :class="{'button-click': clickBtnNum == key}"
                                        @click="nodeServeClick(key, item)"
                                    >节点服务设置
                                        <svg v-show="showorunshow[key] && showorunshow[key].node?showorunshow[key].node: false" class="ok-icon iconfont" aria-hidden="true">
                                            <use fill="#02ADB5" xlink:href="#icon-youxiajiaogouxuan" />
                                        </svg>
                                    </span>
                                    <svg v-if="item.roadList" v-show="clickBtnNum == key" class="iconfont" aria-hidden="true">
                                        <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_xiaojiantou" />
                                    </svg>
                                </p>
                                <p class="btn btn-two">
                                    <span class="button" :class="{'button-click': clickBtnTwoNum == key}" @click="transportServeClick(key, item)">运输服务设置
                                        <svg v-show="showorunshow[key] && showorunshow[key].tran?showorunshow[key].tran: false" class="ok-icon iconfont" aria-hidden="true">
                                            <use fill="#02ADB5" xlink:href="#icon-youxiajiaogouxuan" />
                                        </svg>
                                    </span>
                                    <svg v-show="clickBtnTwoNum == key" class="iconfont" aria-hidden="true">
                                        <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_xiaojiantou" />
                                    </svg>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 产品 -->
                <!-- 节点 -->
                <div class="plan-box">
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
                                    <span>计划时间：</span>
                                    <Form label-position="left" :label-width="100">
                                        <FormItem label="">
                                            <!-- 时间的字段 -->
                                            <DatePicker
                                                v-model="transportServer.predctStartTime"
                                                :options="options3"
                                                :clearable="false"
                                                type="datetime"
                                                format="yyyy-MM-dd HH:mm"
                                                @on-ok="timeStartOk(transportServer)"
                                                @on-open-change="changeIsStartShow"
                                                style="width: 160px"
                                            />--
                                            <DatePicker
                                                v-model="transportServer.predctEndTime"
                                                :options="options3"
                                                :clearable="false"
                                                type="datetime"
                                                format="yyyy-MM-dd HH:mm"
                                                @on-ok="timeOk(transportServer)"
                                                @on-open-change="changeIsShow"
                                                style="width: 160px"
                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                                <p v-show="warnShow" class="warn">
                                    <span><Icon type="ios-close-circle" /> 该服务商已经拒绝了订单，请立即更换该服务商！</span>
                                    <Icon type="md-close" />
                                </p>
                            </div>
                            <!-- 场景 -->
                            <div class="scene">
                                <p class="scene-box">
                                    <span
                                        v-for="(item, key) of transportServer.sceneList"
                                        :key="key"
                                        class="scene-name"
                                        :class="{'scene-click': key == sceneNum}"
                                        @click="sceneClick(key)"
                                    >{{ item.sceneName }}</span>
                                </p>
                                <div v-show="sceneNum == key" v-for="(item, key) of transportServer.sceneList" :key="key">
                                    <p class="task">
                                        <span class="task-name">基础任务内容：<small>（服务总价：{{ item.curr }}{{ item.taskCost }}/箱 总时长：{{ item.serverDuration }}{{ item.serverDurationUnit }}）</small></span>
                                        <span class="task-content">
                                            <span v-for="(list, index) of item.taskBasesList" :key="index">{{ list.taskName }}</span>
                                        </span>
                                    </p>
                                    <p class="task additional">
                                        <span class="task-name">附加任务内容：</span>
                                        <span class="task-content">
                                            <span v-for="(list, index) of item.taskAffixesList" :key="index">{{ list.taskName }}<small>（价格：{{ item.curr }}{{ list.taskCost }} 时长：{{ list.serverDuration }}{{ list.serverDurationUnit }}）</small></span>
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
                                    <span>计划时间：</span>
                                    <Form label-position="left" :label-width="100">
                                        <FormItem label="">
                                            <!-- 没时间的字段 -->
                                            <DatePicker
                                                v-model="transportServer.predctStartTime"
                                                :options="options3"
                                                :clearable="false"
                                                type="datetime"
                                                format="yyyy-MM-dd HH:mm"
                                                style="width: 160px"
                                                @on-ok="timeStartOk(transportServer)"
                                                @on-open-change="changeIsStartShow"
                                            />--
                                            <DatePicker
                                                v-model="transportServer.predctEndTime"
                                                :options="options3"
                                                :clearable="false"
                                                type="datetime"
                                                format="yyyy-MM-dd HH:mm"
                                                style="width: 160px"
                                                @on-ok="timeOk(transportServer)"
                                                @on-open-change="changeIsShow"
                                            />
                                        </FormItem>
                                    </Form>
                                </div>
                                <p v-show="warnShow" class="warn">
                                    <span><Icon type="ios-close-circle" /> 该服务商已经拒绝了订单，请立即更换该服务商！</span>
                                    <Icon type="md-close" />
                                </p>
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
                                        <span class="task-name">基础任务内容：<small>（服务总价：{{ item.curr }}{{ item.taskCost }}/箱 总时长：{{ item.serverDuration }}{{ item.serverDurationUnit }}）</small></span>
                                        <span class="task-content">
                                            <span v-for="(list, index) of item.taskBasesList" :key="index">{{ list.taskName }}</span>
                                        </span>
                                    </p>
                                    <p class="task additional">
                                        <span class="task-name">附加任务内容：</span>
                                        <span class="task-content">
                                            <span v-for="(list, index) of item.taskAffixesList" :key="index">{{ list.taskName }}<small>（价格：{{ list.curr }}{{ list.taskCost }}  时长：{{ list.serverDuration }}{{ list.serverDurationUnit }}）</small></span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <adt-reconfirm-modal
            :showModal="isShowModal"
            :cancelShow="false"
            :message="msgText"
            @on-ok="handleConfirm"
            @on-visible-change="visibleChange"
        />
    </div>
</template>
<script>
    import { toTimestamp } from '@/libs/utils'
    import { apiQueryScene,
        apiRouteInfo,
        apiGenerate,
        apiReportPlan
    } from '@/api/logisticsWholeJourneyPlan'
    import { timestampFormat } from '@/libs/utils'
    export default {
        // 我要计划编号
        props: {
            executoryEntrustCode: '',
            entrustCode: ''
        },
        data () {
            return {
                options3: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000
                    }
                },
                planTime: false,
                showorunshow:[],
                planShow: false,
                data:{},
                sceneData: [],
                clickBtnNum: 0,
                clickBtnTwoNum: -1,
                titleNames: ['场所服务'],
                changeIndex: 1,
                isUnderline: true,
                nodeList: [],
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
                // 上报的按钮禁点
                reportBtnDisable: true,
                clickIndex: 0,
                text: '',
                predctStartTime: null,
                predctEndTime: null,
                planCodeData: '',
                btnShow: true,
                saveBtnDisable: false
            }
        },
        mounted () {
            this.msgText = `<Icon type="md-alert" />您设置的时间已不符合此产品服务的时长！`
            this.getData()
        },
        methods: {
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp)
            },
            // 初始化数据
            getData () {
                apiRouteInfo({executoryEntrustCode: this.executoryEntrustCode}).then(res => {
                    this.data = res.data
                    // 把结构处理成平行结构
                    let portVal = []
                    for (let index = 0; index < this.data.routeList.length; index++) {
                        const item = this.data.routeList[index]
                        let affix = {}
                        this.$set(affix, 'departurePort', item.departurePortTranslate)
                        this.$set(affix, 'destinationPort', item.destinationPortTranslate)
                        this.$set(affix, 'port', item.departurePortTranslate)
                        this.$set(affix, 'logisticsSchemeCode', item.logisticsSchemeCode)
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
                            this.$set(affix, 'routeList', [])
                            portVal.push(affix)
                        }
                    }
                    portVal.forEach(element => {
                        this.$set(element, 'executoryEntrustCode', this.data.executoryEntrustCode)
                        this.data.roadList.forEach(road => {
                            if (element.port === road.nodeCodeTranslate){
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
                    this.$set(this.saveData, 'trspMode', this.data.trspMode)
                    this.$set(this.saveData, 'cargoType', this.data.cargoType)
                    this.$set(this.saveData, 'serverList', [])
                    for (let index = 0; index < this.nodeList.length; index++) {
                        let showornot = {}
                        if (this.nodeList.roadList) {
                            this.$set(showornot, 'node', false)
                        }
                        if (this.nodeList.length > index + 1) {
                            this.$set(showornot, 'tran', false)
                        }
                        this.showorunshow[index] = showornot
                    }
                    // 如果一进入页面判断有没有节点，没节点，就让运输的高亮clickBtnTwoNum = 0
                    if (!this.nodeList[0].roadList) {
                        this.clickBtnTwoNum = 0
                        this.clickBtnNum = -1
                    }
                })
            },
            // end时间弹框隐藏后触发
            changeIsShow (val) {
                if (!val) {
                    if (!(this.transportServer.predctEndTime - this.transportServer.predctStartTime >= this.transportServer.totalTime * 60 * 60 * 1000)) {
                        this.isShowModal = true
                        this.transportServer.predctEndTime = null
                        this.transportServer.predctStartTime = null
                    }
                    if (this.transportServer.predctEndTime && this.transportServer.predctStartTime) {
                        if(this.text === 'node'){
                            this.$set(this.showorunshow[this.clickIndex - 1], 'node', true)
                        }
                        if(this.text === 'tran'){
                            this.$set(this.showorunshow[this.clickIndex - 1], 'tran', true)
                        }
                    } else {
                        if(this.text === 'node'){
                            this.$set(this.showorunshow[this.clickIndex - 1], 'node', false)
                        }
                        if(this.text === 'tran'){
                            this.$set(this.showorunshow[this.clickIndex - 1], 'tran', false)
                        }
                    }
                }
            },
            // end时间点击确定后
            timeOk (data) {
                // 结束时间-开始时间>=时长,不成立则弹出弹框
                if (!(data.predctEndTime - data.predctStartTime >= data.totalTime * 60 * 60 * 1000)) {
                    this.isShowModal = true
                    data.predctEndTime = null
                    data.predctStartTime = null
                }
                if (data.predctEndTime && data.predctStartTime) {
                    if(this.text === 'node'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'node', true)
                    }
                    if(this.text === 'tran'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'tran', true)
                    }
                } else {
                    if(this.text === 'node'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'node', false)
                    }
                    if(this.text === 'tran'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'tran', false)
                    }
                }
            },
            // start时间点击确定后
            timeStartOk (data) {
                if (data.predctEndTime === '' || data.predctEndTime === null) return
                if (!(data.predctEndTime - data.predctStartTime >= data.totalTime * 60 * 60 * 1000)) {
                    this.isShowModal = true
                    data.predctEndTime = null
                    data.predctStartTime = null
                }
                if (data.predctEndTime && data.predctStartTime) {
                    if(this.text === 'node'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'node', true)
                    }
                    if(this.text === 'tran'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'tran', true)
                    }
                } else {
                    if(this.text === 'node'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'node', false)
                    }
                    if(this.text === 'tran'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'tran', false)
                    }
                }
            },
            // start时间弹框隐藏后触发
            changeIsStartShow (val){
                if (this.transportServer.predctEndTime  == '' || this.transportServer.predctEndTime  == null) return
                if (!val) {
                    if (!(this.transportServer.predctEndTime - this.transportServer.predctStartTime >= this.transportServer.totalTime * 60 * 60 * 1000)) {
                        this.isShowModal = true
                        this.transportServer.predctEndTime = null
                        this.transportServer.predctStartTime = null
                    }
                }
                if (this.transportServer.predctEndTime && this.transportServer.predctStartTime) {
                    if(this.text === 'node'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'node', true)
                    }
                    if(this.text === 'tran'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'tran', true)
                    }
                } else {
                    if(this.text === 'node'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'node', false)
                    }
                    if(this.text === 'tran'){
                        this.$set(this.showorunshow[this.clickIndex - 1], 'tran', false)
                    }
                }
            },
            // 点击节点
            nodeServeClick (key, item) {
                this.text = 'node'
                if (this.saveIs.indexOf(key) == -1) {
                    let data = {
                        logisticsSchemeCode: item.logisticsSchemeCode,
                        serverCode: item.roadList[0].serverCode,
                        serverType: item.roadList[0].serverType,
                        executoryEntrustCode: item.executoryEntrustCode
                    }
                    apiQueryScene({ data }).then(res => {
                        this.$set(res.data[0], 'serverType', item.roadList[0].serverType)
                        this.transportServer = res.data[0]
                        this.$set(item.roadList[0], 'serveList', this.transportServer)
                        // 推入保存的数据结构中
                        this.saveData.serverList.push(res.data[0])
                        this.saveIs.push(key)
                    })
                } else {
                    this.transportServer =  item.roadList[0].serveList
                }
                this.clickBtnNum = key
                this.clickBtnTwoNum = -1
                // 如果里面不存在节点服务，就置灰节点
                if (!item.roadList) {
                    this.nodeClickShow = false
                }
                this.nodeServeShow = true
                this.clickIndex = key + 1
            },
            // 点击运输
            transportServeClick (key, item) {
                this.text = 'tran'
                if (this.transportSaveIs.indexOf(key) === -1) {
                    if (item.routeList.length > 0) {
                        let data = {
                            logisticsSchemeCode: item.logisticsSchemeCode,
                            serverCode: item.routeList[0].serverCode,
                            serverType: item.routeList[0].serverType,
                            executoryEntrustCode: item.executoryEntrustCode
                        }
                        apiQueryScene({ data }).then(res => {
                            this.$set(res.data, 'serverType', item.routeList[0].serverType)
                            this.transportServer = res.data
                            this.$set(item.routeList[0], 'serveList', this.transportServer)
                            this.saveData.serverList.push(res.data)
                            this.transportSaveIs.push(key)
                        })
                    }
                } else {
                    this.transportServer = item.routeList[0].serveList
                }
                this.clickBtnTwoNum = key
                this.clickBtnNum = -1
                this.nodeServeShow = false
                this.clickIndex = key + 1
            },
            // 点击场景切换
            sceneClick (index) {
                this.sceneNum = index
            },
            // 点击tab切换
            handleBtn (index, titleItem) {
                this.changeIndex = index + 1
            },
            // 模态框显示隐藏状态发生改变
            visibleChange (changeStatus) {
                this.isShowModal = changeStatus
            },
            // 弹框点击确定
            handleConfirm () {
                this.isShowModal = false
            },
            // 保存
            save () {
                for (const item of this.showorunshow) {
                    if((undefined!=item.tran && !item.tran) || (undefined!=item.tran && !item.tran)){
                        this.$Message.info('请输入计划时间')
                        return false
                    }
                }
                let list = {}
                list = JSON.parse(JSON.stringify(this.saveData))
                let time = []
                for (const item of list.serverList) {
                    item.predctEndTime = toTimestamp(item.predctEndTime)
                    item.predctStartTime = toTimestamp(item.predctStartTime)
                    this.$delete(item, 'contaSource')
                    this.$delete(item, 'contaType')
                    this.$delete(item, 'cargoType')
                    this.$delete(item, 'contaSizeType')
                    this.$delete(item, 'pckType')
                    this.$delete(item, 'veDimension')
                    this.$delete(item, 'useStatus')
                    this.$delete(item, 'logisticsSchemeCode')
                    this.$delete(item, 'prefDiscount')
                    this.$delete(item, 'prefPrice')
                    this.$delete(item, 'publishPriceType')
                    this.$delete(item, 'remindFrequency')
                    this.$delete(item, 'remindTimeUnit')
                    this.$delete(item, 'serverEndDate')
                    this.$delete(item, 'serverRemindDuration')
                    this.$delete(item, 'serverStatus')
                    this.$delete(item, 'sttnCode')
                    this.$delete(item, 'use_status')
                    this.$delete(item, 'planEndTime')
                    this.$delete(item, 'veType')
                    this.$delete(item, 'planStartTime')
                    this.$set(item, 'planCode', this.data.planCode)
                    this.$set(item, 'executoryEntrustCode', this.data.executoryEntrustCode)
                    if (!item.predctStartTime) {
                        this.$Message.info('请输入计划开始时间！')
                        return
                    }
                    if (!item.predctEndTime) {
                        this.$Message.info('请输入计划截止时间！')
                        return
                    }
                    time.push(item.predctEndTime, item.predctStartTime )
                }
                this.planTime = true
                let a = time.sort(function(a, b) {
                    return a-b
                })
                this.predctStartTime = a[0]
                this.predctEndTime = a[time.length - 1]
                this.$set(list, 'predctStartTime', this.predctStartTime)
                this.$set(list, 'predctEndTime', this.predctEndTime)
                let data = list
                apiGenerate({ data }).then(res => {
                    if (res.code === '200') {
                        this.reportBtnDisable = false
                        this.saveBtnDisable = true
                        this.$Message.success('保存成功')
                        this.planCodeData = res.data.planCode
                    }
                })
            },
            // 上报
            reportClick () {
                let data = {
                    executoryEntrustCode: this.data.executoryEntrustCode,
                    logisticsSchemeCode: this.data.logisticsSchemeCode,
                    planCode: this.planCodeData
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
    .whole-plan-generate {
        .topbar-title {
            color: #333;
            font-size: 16px;
            margin: 10px 50px;
        }
        .topbar {
            box-shadow:0px 2px 4px 0px rgba(51,51,51,0.1);
            .path-info {
                background: #ffffff;
                padding: 20px;
                padding-bottom: 0;
                line-height: 4;
                ul {
                    overflow-x: auto;
                    white-space: nowrap;
                    background: #f9f9f9;
                    padding: 0 42px;
                    li {
                        display: inline-block;
                        vertical-align: middle;
                        .path {
                            vertical-align: middle;
                            margin: 0 30px;
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
                            .line3 {
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
                                margin-top: 20px;
                                background: #fff;
                            }
                        }
                        .radio {
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            margin-right: 15px;
                            background: $border-color;
                            border-radius: 50%;
                        }
                        .line-shu {
                            position: absolute;
                            top: 36px;
                            left: 4px;
                            width: 1px;
                            height: 66px;
                            background: $border-color;
                            .iconfont {
                                position: absolute;
                                bottom: -16px;
                                left: -4px;
                                color: $border-color;
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
                                color: $secondary-font-color;
                            }
                            .line {
                                color: $secondary-font-color;
                            }
                            .line2 {
                                position: absolute;
                                left: 0;
                                bottom: -10px;
                                color: $secondary-font-color;
                            }
                            .line3 {
                                position: absolute;
                                top: 23px;
                                left: 18px;
                                height: 96px;
                                color: $secondary-font-color;
                                writing-mode: tb-rl;
                                border-left: 1px dashed $secondary-font-color;
                            }
                        }
                        .btn {
                            display: inline-block;
                            .button {
                                position: relative;
                                display: inline-block;
                                height: 32px;
                                font-size: 12px;
                                color: #515a6e;
                                line-height: 1;
                                padding: 10px 18px;
                                margin-right: 4px;
                                border: 1px solid rgba(153,153,153,1);
                                border-radius: 4px;
                                cursor: pointer;
                            }
                            .button-click {
                                background: $light-color;
                                color: #fff;
                                border: 1px solid $light-color;
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
                            .name {
                                display: inline-block;
                                font-size: 16px;
                                color: #333;
                                font-weight: bold;
                            }
                            .time-input {
                                display: inline-block;
                                margin-left: 60px;
                                /deep/ .ivu-form {
                                    display: inline-block;
                                }
                                /deep/ .ivu-form-item-content {
                                    margin-left: 0 !important;
                                }
                            }
                            .warn {
                                color: red;
                                font-size: 12px;
                                background: #FEE9E8;
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
                                border: 1px solid $light-color;
                                background: #E8EFF5;
                            }
                            .task {
                                margin-top: 10px;
                                padding-top: 8px;
                                border-top: 1px dashed $placeholder-font-color;
                                .task-name {
                                    display: block;
                                    color: $conventional-font-color;
                                    font-weight: bold;
                                    small {
                                        color: $secondary-font-color;
                                    }
                                }
                                .task-content {
                                    display: inline-block;
                                    width: 100%;
                                    color: $conventional-font-color;
                                    background: $background-color;
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
</style>
