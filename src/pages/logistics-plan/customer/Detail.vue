<template>
    <div>
        <!-- <DatePicker v-model="dataValue" format="yyyy年MM月dd日" type="date" placeholder="Select date" style="width: 200px"></DatePicker> -->
        <!-- 方案基本信息 -->
        <div class="title">方案基本信息</div>
        <AdtSchemeInformationRoute :logistics="logistics" type='isBig'>
            <!-- 客户看到的方案基本信息 -->
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
            <!-- <template slot="service">
                <Row>
                    <Col v-for="(scheme, id) in schemeProxyList" :key="id" span="6">
                        <span>{{ scheme.sceneName }}</span>
                        <span>费用：</span>
                        <span>{{ scheme.fee }}</span>
                        <span>{{ scheme.currTranslate }}</span>
                    </Col>
                </Row>
            </template> -->
            <template slot="service">
                <Row>
                    <Col span="6" v-for="(service, id) in schemeProxyList" :key="id">
                        <span>代理服务</span>
                        <span class="agency-service">{{ service.sceneName }}</span>
                        <span class="agency-service">{{ service.fee}}{{ service.currTranslate }}</span>
                    </Col>
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
                        @click="clickRoute(service)"
                    >
                        <span>{{ service.departurePortTranslate }}</span>
                        <svg class="icon" aria-hidden="true">
                            <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                        </svg>
                        <span>{{ service.destinationPortTranslate }}</span>
                        <!-- <span>{{ changeText }}</span> -->
                    </div>
                    <template slot="content">
                        <div :class="['scene-btns', { spread: isSceneSpread }]">
                            <!-- 场景切换 -->
                            <adt-tab-btns
                                class="scene-tab"
                                :titleNames="titleNamesScenes"
                                :isSmallBtn="true"
                                :btnIndex="changeIndexScenes"
                                @handleBtn="handleBtnScenes"
                            />
                            <div class="right-item">
                                <div class="show-all-scene" @click="isSceneSpread = !isSceneSpread">
                                    {{`${!isSceneSpread ? '展开' : '收起'}所有 >`}}
                                </div>
                            </div>
                        </div>
                        <!-- 任务切换 -->
                        <adt-tab-btns
                            class="scene-tab bask-tab"
                            :titleNames="titleNamesTask"
                            :isBaseBtn="true"
                            :height="30"
                            :btnIndex="changeIndexTask"
                            @handleBtn="handleBtnTask"
                        />
                        <!-- 任务 -->
                        <div v-show="changeIndexTask === 1">
                            <AdtTaskContent
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
                    </template>
                </Panel>
            </Collapse>
        </Card>
    </div>
</template>

<script>
import addProductContent from '@/mixins/addProductContent'
import AdtSchemeInformationRoute from '@/components/adt-scheme-information-route/Index'
import AdtTaskContent from '@/components/adt-task-content/Index'
import Monitor from '../components/Monitor'
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
        Monitor
    },
    props: {
        logisticsData: {}
    },
    data() {
        return {
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
            titleNamesTask: ['任务', '监控'],
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
        }
    },
    mounted() {
        // console.log(this.dataList)
        this.getData()
    },
    methods: {
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
        // 获取数据
        getData () {
            // 创建一个和服务对应的场景集合
            // this.titleNamesScenes.length = this.dataList.length
            // 将创建的场景集合每一项undefined转为[]
            // this.titleNamesScenes.fill([])
            this.dataList.map(item => {
                this.titleNames.push(item.title)
                // item.routeList.map((element, id) => {
                //     element.secenList.map(itemData => {
                //         this.titleNamesScenes[index][id].push(itemData.sceneName)
                //     })
                // })
            })
        },
        // 服务类型下的场所
        changeFont () {},
        // 点击服务下路线/场所
        clickRoute (val) {
            console.log(val)
            // 在赋值前先置空场景，避免多次点击造成数据叠加
            this.titleNamesScenes = []
            this.taskList = []
            // 在赋值前先将场景切换的序号初始化，避免多次点击造成taskList找不到数据
            this.changeIndexScenes = 1
            val.secenList.map(item => {
                this.titleNamesScenes.push(item.sceneName)
                // 提取基础任务/附加任务
                this.taskList.push(item.taskBasesList)
            })
            console.log(this.taskList)
            // 提取基础任务/附加任务
            // val.secenList.map((item, index) => {
            //     item.taskBasesList.map((element, id) => {
            //         // element
            //         this.taskList.push(element.taskBasesList)
            //     })
            // })
            // this.basicTaskClient
        }
    },
}
</script>

<style lang="scss" scoped>
    @import '../style.scss';
</style>
