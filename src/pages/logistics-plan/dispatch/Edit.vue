<template>
    <div>
        <div class="box-top">
            <!-- 方案基本信息 -->
            <div class="box-title">方案基本信息</div>
            <Button class="program-confirm" type="primary" @click="confirmPlan">确认方案</Button>
        </div>
        <AdtSchemeInformationRoute type='isBig'>
            <!-- 方案基本信息 -->
            <template slot="price">
                <Row>
                    <Col span="6">
                        <span>价格区间：{{ basicInformation.lwstPrice }}-{{ basicInformation.hghtPrice }}{{ basicInformation.offerCurrTranslate }}</span>
                    </Col>
                    <Col span="6">
                        <span>时长区间：{{ basicInformation.lwstTmeff }}-{{ basicInformation.hghtTmeff }}{{ basicInformation.tmeffUnitTranslate }}</span>
                    </Col>
                    <!-- <Col span="6">
                        <span>集装箱尺寸类型：{{basicInformation.lwstTmeff}}-{{basicInformation.hghtTmeff}}{{basicInformation.tmeffUnitTranslate}}</span>
                    </Col>
                    <Col span="6">
                        <span>集装箱来源：{{basicInformation.lwstTmeff}}</span>
                    </Col> -->
                </Row>
            </template>
            <template slot="service">
                <!-- 选择代理服务 -->
                <div class="service">
                    <!-- <p>
                        <span class="title">选择代理服务:</span>
                        <span>（没有可选代理服务请<span class="contact-us" @click="contactUs">联系我们</span>）</span>
                        <span>单位（元）</span>
                    </p> -->
                    <Row>
                        <Col span="2" style="line-height: 30px;">代理服务</Col>
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
                        <span>结算汇率:</span>
                        <RadioGroup v-model="basicInformation.exrtMode" class="program-settlement">
                            <Radio label="extrinsic">非固有汇率</Radio>
                            <Radio class="program-inherent" label="inherent">
                                <span>固有汇率</span>
                                <Input v-model="basicInformation.exrt" type="text" />
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col span="6">
                        <span class="title">方案有效期：</span>
                        <DatePicker v-model="basicInformation.endOfTime" type="date" style="width: 200px;" />
                    </Col>
                </Row>
                <div style="margin: 20px 0; border:1px dashed #E5E5E5;"></div>
                <Row>
                    <div class="time-box">
                        <span>提醒时间设置：方案截止时间几天前开始提醒：</span>
                        <Input v-model="basicInformation.reminderTime" class="time-input" />
                        <span>天</span>
                    </div>
                </Row>
            </template>
        </AdtSchemeInformationRoute>
        <!-- 产品服务信息 -->
        <p class="title">产品服务信息</p>
        <Card>
            <adt-tab-btns
                :height="40"
                :width="200"
                :isUnderline="true"
                :titleNames="titleNames"
                :btnIndex="changeIndex"
                @handleBtn="handleBtn"
            />
            <Divider />
            <Collapse class="collapse" v-model="collapseValue" accordion @on-change="changeFont">
                <Panel
                    v-for="( service, index ) in dataList[changeIndex - 1].routeList"
                    :key="index"
                    :name="(index + 1).toString()"
                    style="margin-bottom: 20px;"
                >
                    <div
                        class="collapse-head"
                        @click="clickRoute(index, service)"
                    >
                        <span>{{ service.departurePortTranslate }}</span>
                        <svg class="icon" aria-hidden="true">
                            <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                        </svg>
                        <span>{{ service.destinationPortTranslate }}</span>
                        <Button v-show="changeIndex === 1" class="collapse-btn"  @click="clickTimeLimit(service.workTimeList)">作业时间范围</Button>
                    </div>
                    <template slot="content">
                        <Row>
                            <!-- 选择服务商 -->
                            <Col span="8" class="service-provider">
                                <div class="service-provider-title">
                                    <span class="service-provider-merchant">选择服务商</span>
                                </div>
                                <div class="service-provider-company">
                                   <div style="margin-bottom: 10px;">
                                        <!-- <Checkbox
                                            :indeterminate="indeterminate"
                                            :value="checkAll"
                                            @click.prevent.native="handleCheckAll(service)"
                                        >全选</Checkbox> -->
                                    </div>
                                    <!-- {{service.checkAllGroup}} -->
                                    <CheckboxGroup v-model="service.checkAllGroup">
                                        <div
                                            v-for="(serviceProvider, id) in service.serviceProvider"
                                            :key="id"
                                            @click="selectCompany(serviceProvider, id)"
                                            :class="{'test': num === id}"
                                        >
                                            <Checkbox :label="serviceProvider.serverCode + ''">
                                                <p class="service-select company">
                                                    <span>{{ serviceProvider.enterpriseName }}</span>
                                                    <span class="price">基础价格: {{ serviceProvider.priceTotal }}{{serviceProvider.currTranslate}}</span>
                                                    <span class="time">时长: {{ serviceProvider.totalTime }}{{ serviceProvider.totalTimeUnit }}</span>
                                                </p>
                                                <div :class="{'triangle-test': num === id}"></div>
                                            </Checkbox>
                                        </div>
                                    </CheckboxGroup>
                                </div>
                            </Col>
                            <!-- 产品编号 -->
                            <Col span="16" class="product">
                                <div class="product-top">
                                    <span class="product-title">产品编号: {{ serviceProviderData.serverCode }}</span>
                                    <Button v-show="changeIndex !== 1" @click="clcikSchedule(serviceProviderData.scheduleList)">班期</Button>
                                    <!-- <Button>作业时间范围</Button> -->
                                </div>
                                <!-- 场景切换 -->
                                <adt-tab-btns 
                                    :isSmallBtn="true"
                                    :titleNames="titleNamesScenes"
                                    :btnIndex="changeIndexScenes"
                                    @handleBtn="handleBtnScenes"
                                />
                                <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                <!-- 任务切换 -->
                                <adt-tab-btns
                                    :isBaseBtn="true"
                                    :titleNames="titleNamesTask"
                                    :btnIndex="changeIndexTask"
                                    :width="200"
                                    :height="30"
                                    @handleBtn="handleBtnTask"
                                    style="justify-content: flex-start;"
                                />
                                <!-- 任务 -->
                                <div v-show="changeIndexTask === 1">
                                    <AdtTaskContent
                                        class="spacing"
                                        :basicTask="taskList[changeIndexScenes - 1].basicTask"
                                        :isShow="false"
                                        :spanNumAdditionalTasks="4"
                                        :additionalTasks="taskList[changeIndexScenes - 1].taskAffixesList"
                                    />
                                </div>
                                <!-- 监控 -->
                                <div v-show="changeIndexTask === 2">
                                    <Monitor />
                                </div>
                                <!-- 协同写作 -->
                                <div v-show="changeIndexTask === 3">
                                    <Collaboration />
                                </div>
                            </Col>
                        </Row>
                    </template>
                </Panel>
            </Collapse>
        </Card>
        <!-- 班期 -->
        <DrawerModel :showDrawer="isShowScheduleDrawer" :scheduleList="scheduleList" title="班期" @on-visible-change="onChangeSchedule" />
        <!-- 作业时间范围 -->
        <DrawerModel :showDrawer="isShowTimeDrawer" :workTimeList="workTimeList" title="作业时间范围" @on-visible-change="onChangeTime" />
    </div>
</template>

<script>
import addProductContent from '@/mixins/addProductContent'
import AdtSchemeInformationRoute from '@/components/adt-scheme-information-route/Index'
import AdtTaskContent from '@/components/adt-task-content/Index'
import Monitor from '../components/Monitor'
import Collaboration from '../components/Collaboration'
import DrawerModel from '../components/DrawerModel'
import { dataList } from './mock'
import {
    apiGetSchemeDetails,
    apiGetSceneQueryList,
    apiGetSceneCstm
} from '@/api/logistics'
export default {
    mixins: [addProductContent],
    components: {
        AdtTaskContent,
        AdtSchemeInformationRoute,
        Monitor,
        Collaboration,
        DrawerModel
    },
    props: {
        logisticsData: {}
    },
    data() {
        return {
            // 基础信息
            basicInformation: {},
            // 班期弹窗
            isShowScheduleDrawer: false,
            // 班期集合
            scheduleList: [],
            // 作业时间范围弹窗
            isShowTimeDrawer: false,
            // 作业时间集合
            workTimeList: [],
            // 折叠面板默认展开序号
            collapseValue: '0',
            logistics: [],
            // 服务切换
            titleNames: [],
            changeIndex: 1,
            // 场景切换
            titleNamesScenes: [],
            changeIndexScenes: 1,
            // 任务切换
            titleNamesTask: ['任务', '监控', '协同协作'],
            changeIndexTask: 1,
            taskList: [
                {
                    basicTask: [],
                    taskAffixesList: []
                }
            ],
            // 基础任务
            basicTaskClient: [],
            // 附加任务
            additionalTasksClient: [],
            // 代理服务
            schemeProxyList: [
                {
                    checked: true,
                    taskCode: '12',
                    taskName: '代理服务1',
                    fee: 20,
                    currTranslate: '元'
                },
                {
                    checked: false,
                    taskCode: '12',
                    taskName: '代理服务2',
                    fee: 30,
                    currTranslate: '元'
                },
                {
                    checked: true,
                    taskCode: '12',
                    taskName: '代理服务3',
                    fee: 50,
                    currTranslate: '元'
                }
            ],
            // 服务商选择
            indeterminate: false,
            checkAll: false,
            dataList,
            // 路线/场所下的产品
            productList: [],
            // 产品集合
            serviceProviderData: {},
            serverCode: '',
            num: '默认值',
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        // 班期弹窗状态绑定
        onChangeSchedule (val) {
            this.isShowScheduleDrawer = val
        },
        // 作业时间范围弹窗状态绑定
        onChangeTime (val) {
            this.isShowTimeDrawer = val
        },
        // 服务切换
        handleBtn (index) {
            this.changeIndex = index + 1
            this.collapseValue = '0'
        },
        // 场景切换
        handleBtnScenes (index) {
            this.changeIndexScenes = index + 1
        },
        // 任务切换
        handleBtnTask (index) {
            this.changeIndexTask = index + 1
        },
        // 联系我们
        // contactUs () {},
        // 获取数据
        getData () {
            this.dataList.map(item => {
                // 获取服务tabs切换数据
                this.titleNames.push(item.title)
                // 选择产品复选框反显
                item.routeList.map(element => {
                    element.checkAllGroup = []
                    element.serviceProvider.map(itemData => {
                        if (itemData.checked === true) {
                            element.checkAllGroup.push(itemData.serverCode)
                        }
                    })
                })
            })
            // console.log(this.dataList)
        },
        // 服务类型下的场所
        changeFont () {},
        // 服务商全选
        handleCheckAll (val) {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                let arr = []
                console.log(val)
                // 将路段/场所下的产品编号全部提取
                val.serviceProvider.map(item => {
                    arr.push(item.serverCode)
                })
                val.checkAllGroup = arr
            } else {
                val.checkAllGroup = [];
            }
        },
        // 点击服务下路线/场所
        clickRoute (index, val) {
            this.selectCompany(val.serviceProvider[0])
            // 获取该路线/场所下的产品——勾选数据处理需要
            this.productList = val.serviceProvider
        },
        // 勾选服务商
        selectCompany (val, index) {
            // 如果是点击路线调用该方法不执行后面的判断
            if (index !== undefined) {
                // 解决点击事件触发两次
                if (event.target.nodeName !== 'INPUT') return
                // 勾选数据的处理
                this.checkedData(val, index)
            }
            this.num = index || 0
            this.serviceProviderData = val
            // 在赋值前先置空场景，避免多次点击造成数据叠加
            this.titleNamesScenes = []
            this.taskList = []
            // 在赋值前先将场景切换的序号初始化，避免多次点击造成taskList找不到数据
            this.changeIndexScenes = 1
            this.serviceProviderData.secenList.map(item => {
                this.titleNamesScenes.push(item.sceneName)
                // 提取基础任务/附加任务
                this.taskList.push(item.taskBasesList)
            })
        },
        // 勾选数据的处理——为了控制全选框的各种勾选样式
        checkedData (val, index) {
            if (val.checked === true) {
                val.checked = false
            } else {
                val.checked = true
            }
            let num = 0
            this.productList.map(item => {
                if (item.checked) {
                    num = num +1
                }
            })
            if (this.productList.length === num) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (num > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        // 选择作业时间范围
        clickTimeLimit (val) {
            this.isShowTimeDrawer = true
            this.workTimeList = val
        },
        // 选择班期
        clcikSchedule (val) {
            this.isShowScheduleDrawer = true
            this.scheduleList = val
        },
        // 确认方案
        confirmPlan () {
            // console.log(this.dataList)
            // 筛选处理勾选了的代理服务
            let schemeProxy = []
            this.schemeProxyList.map(item => {
                if(item.checked === true) {
                    schemeProxy.push(item)
                }
            })
            // 筛选处理勾选了的产品
            let schemeServerList = []
            this.dataList.map(item => {
                item.routeList.map(element => {
                    element.serviceProvider.map(itemData => {
                        if (itemData.checked === true) {
                            schemeServerList.push(itemData)
                        }
                    })
                })
            })
            const data ={
                ...this.basicInformation,
                schemeProxyList: schemeProxy,
                schemeServerList: schemeServerList
            }
            console.log(data)
        },
        filterData () {}
    },
}
</script>

<style lang="scss" scoped>
    @import '../style.scss';
    .company {
        width: 100%;
        cursor: pointer;
    }
    .test {
        display: flex;
        background-color:#F5F5F5;
        width: 95%;
    }
    .triangle-test {
        position: absolute;
        right: -35px;
        margin-top: -18px;
        border-width: 5px;
        border-style: solid;
        border-color: $light-color transparent transparent transparent;
        transform: rotate(270deg)
    }
</style>
