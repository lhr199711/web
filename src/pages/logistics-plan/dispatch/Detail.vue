<template>
    <div>
        <!-- 方案基本信息 -->
        <div class="title">方案基本信息</div>
        <AdtSchemeInformationRoute type='isBig'>
            <!-- 方案基本信息 -->
            <template slot="price">
                <Row>
                    <Col span="5">
                        <span>参考价格:{{ listData.hghtPrice }}/{{ listData.offerCurrTranslate }}</span>
                    </Col>
                    <Col span="5">
                        <span>参考时长:{{ listData.hghtTmeff }}{{ listData.tmeffUnitTranslate }}</span>
                    </Col>
                    <Col span="4">
                        <span>结算固定汇率:{{ listData.exrt }}</span>
                    </Col>
                    <Col span="5">
                        <span>方案截至时间:{{ listData.endOfTime }}</span>
                    </Col>
                    <Col span="5">
                        <span>方案截止前提醒时间:{{ listData.remindTime }}天</span>
                    </Col>
                    <!-- <Col span="4">
                        <span>集装箱尺寸类型</span>
                    </Col>
                    <Col span="3">
                        <span>集装箱来源</span>
                    </Col> -->
                </Row>
            </template>
            <template slot="service">
                <Row>
                    <Col span="6" v-for="(service, id) in schemeProxyList" :key="id">
                        <span>代理服务</span>
                        <span class="agency-service">{{ service.sceneName }}</span>
                        <span class="agency-service">{{ service.fee}}{{ service.currTranslate }}</span>
                    </Col>
                </Row>
                <div style="margin: 20px 0; border:1px dashed #E5E5E5;"></div>
                <Row>
                    <div class="time-box">
                        <span>提醒时间设置：方案截止时间几天前开始提醒：{{}}天</span>
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
            <Collapse class="collapse" v-model="collapseValue" accordion>
                <Panel
                    v-for="( service, index ) in dataList[changeIndex - 1].routeList"
                    :key="index"
                    :name="(index + 1).toString()"
                    style="margin-bottom: 20px;"
                >
                    <div
                        class="collapse-head"
                        @click="clickRoute(service)"
                    >
                        <span>{{ service.departurePortTranslate }}</span>
                        <svg class="icon" aria-hidden="true">
                            <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                        </svg>
                        <span>{{ service.destinationPortTranslate }}</span>
                        <Button
                            v-show="changeIndex === 1"
                            class="collapse-btn"
                            @click="clickTimeLimit(service.workTimeList)"
                        >
                            作业时间范围
                        </Button>
                    </div>
                    <template slot="content">
                        <Row>
                            <!-- 选择服务商 -->
                            <Col span="8" class="service-provider">
                                <div class="service-provider-title">
                                    <span class="service-provider-merchant">选择服务商</span>
                                    <!-- <RadioGroup class="service-provider-group" v-model="customs">
                                        <Radio label="export">
                                            <span>出口报关</span>
                                        </Radio>
                                        <Radio label="import">
                                            <span>进口口报关</span>
                                        </Radio>
                                    </RadioGroup> -->
                                </div>
                                <div class="service-provider-company">
                                    <div
                                        v-for="(serviceProvider, id) in service.serviceProvider"
                                        :key="id"
                                        :class="{'service-select-click': num === id}"
                                        style="display: flex"
                                    >
                                        <p class="service-select company" @click="selectCompany(serviceProvider, id)">
                                            <span class="name">{{ serviceProvider.enterpriseName }}</span>
                                            <span class="price">基础价格: {{ serviceProvider.priceTotal }}{{ serviceProvider.currTranslate }}</span>
                                            <span class="time">时长: {{ serviceProvider.totalTime }}{{ serviceProvider.totalTimeUnitTranslate }}</span>
                                        </p>
                                        <div :class="{'triangle': num === id}"></div>
                                    </div>
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
                    taskCode: '1-1',
                    taskName: '场景1-基础任务1'
                }
            ],
            listData: {},
            dataList,
            // 产品集合
            serviceProviderData: {},
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
        // 获取数据
        getData () {
            this.dataList.map(item => {
                this.titleNames.push(item.title)
            })
        },
        // 点击服务下路线/场所
        clickRoute (val) {
            this.selectCompany(val.serviceProvider[0])
        },
        // 点击服务商
        selectCompany (val, index) {
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
    },
}
</script>

<style lang="scss" scoped>
    @import '../style.scss';
    .company {
        margin: 10px 0;
        padding: 0 10px;
        width: 100%;
        cursor: pointer;
    }
</style>
