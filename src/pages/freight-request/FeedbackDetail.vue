<template>
    <div class="feedback-details">
        <div class="public-detail">
            <div v-if="pathData[0]" class="important-info">
                <Row>
                    <Col span="8">
                        <div class="name">货运要求编号：</div>
                        <div class="content">{{ pathData[0].freightReqCode }}</div>
                    </Col>
                    <Col span="8">
                        <div class="name">录入时间：</div>
                        <div class="content">{{ timestampFormat(pathData[0].createDatetime) }}</div>
                    </Col>
                    <Col class="button" span="8">
                        <div v-if="recommendationShow" class="btn" @click="recommendation">查看推荐方案</div>
                    </Col>
                </Row>
            </div>
        </div>
        <!-- 基本信息 -->
        <div v-if="pathData[0]" class="public-table-content">
            <div class="l-content">
                <div class="table-data">
                    <ul>
                        <p class="table-title">基本信息：</p>
                        <li>
                            <span class="table-key">启运地：</span>
                            <span class="table-val">
                                <p class="value" v-for="(item, key) of pathData[0].custStartPlaces.split(';')" :key="key">{{ item }}</p>
                            </span>
                        </li>
                        <li>
                            <span class="table-key">目的地：</span>
                            <span class="table-val">
                                <p class="value" v-for="(item, key) of pathData[0].custEndPlaces.split(';')" :key="key">{{ item }}</p>
                            </span>
                        </li>
                        <li>
                            <span class="table-key">中转地：</span>
                            <span class="table-val" v-if="pathData[0].custTransitPlaces !== null">
                                <p class="value" v-for="(item, key) of pathData[0].custTransitPlaces.split(';')" :key="key">{{ item }}</p>
                            </span>
                            <span class="table-val" v-else></span>
                        </li>
                        <li>
                            <span class="table-key">货物类型：</span>
                            <span class="table-val">
                                <p>{{ pathData[0].cargoType }}</p>
                            </span>
                        </li>
                        <li>
                            <span class="table-key">运输类型：</span>
                            <span class="table-val">
                                <p>{{ pathData[0].trspType }}</p>
                            </span>
                        </li>
                        <li>
                            <span class="table-key">物流类型：</span>
                            <span class="table-val">
                                <p>{{ pathData[0].logisticsType }}</p>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="path-info">
            <Row>
                <Col span="24">
                    <div class="name">货运路线：</div>
                    <ul class="path-list">
                         <li
                            v-for="(list, index) of pathData"
                            :key="index"
                            :class="{'path-click': pathNum == index}"
                            @click="pathClick(index, list)"
                        >
                            <span v-for="(item, key) of list.roadList" :key="key">
                                {{ item.departurePort }}
                                <i>-</i>
                                <template v-if="key === list.roadList.length-1">
                                <span class="path last-path">{{ item.destinationPort }}</span>
                            </template>
                            </span>
                        </li>
                    </ul>
                </Col>
            </Row>
        </div>
        <p class="info-title">录入信息</p>
        <div class="path-info-details">
            <div
                v-show="pathIndex === pathNum"
                v-for="(pathList, pathIndex) of pathData"
                :key="pathIndex"
                class="details-switchover"
            >
                <div class="title">
                    <adt-tab-btns
                        :height="40"
                        :width="200"
                        :isUnderline="isUnderline"
                        :titleNames="titleNames"
                        :btnIndex="changeIndex"
                        @handleBtn="handleBtn"
                    />
                </div>
                <!-- 路线参数模块 -->
                <div v-if="tabBarShow" class="route-param">
                    <p class="left-tit">
                        <span @click="leftTabClick(0)" :class="{'tab-click': tabNum == 0}">运输服务</span>
                        <span @click="leftTabClick(1)" :class="{'tab-click': tabNum == 1}">节点服务</span>
                    </p>
                    <!-- 运输服务模块 -->
                    <div v-if="transportServiceShow" class="route-param-content">
                        <ul>
                            <li
                                v-for="(list, index) of pathData[pathIndex].roadList"
                                :key="index"
                                :class="{'path-click': pathData[pathIndex].lineNum == index || (!pathData[pathIndex].lineNum && index === 0)}"
                                class="path"
                                @click="lineSectionsClick(index, pathIndex)"
                            >
                                <span>
                                    {{ list.departurePort }}
                                    <i>-</i>
                                    {{ list.destinationPort }}
                                </span>
                            </li>
                        </ul>
                        <Divider />
                        <div class="public-table-content">
                            <div class="l-content">
                                <!-- 运输服务 -->
                                <div
                                    v-show="pathList.lineNum == index || (!pathList.lineNum && index === 0)"
                                    v-for="(list, index) of pathList.roadList"
                                    :key="index"
                                    class="table-data"
                                >
                                    <ul>
                                        <p class="table-title">
                                            <span>服务参数：</span>
                                            <span class="look-btn" @click="lookAttachingTask(list, index)">查看附加任务</span>
                                        </p>
                                        <li>
                                            <span class="table-key">运输方式：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.trspMode }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">物流类型：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.logisticsType }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">运输类型：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.trspType }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">集装箱来源：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.contaSource }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">集装箱尺寸类型：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.contaSizeType }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">提箱类型：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.suitcaseType }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">集装箱数量：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.contaQty }}</p>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 节点服务模块 -->
                    <div v-else class="route-param-content">
                        <ul>
                            <li
                                v-for="(list, index) of pathList.nodeList"
                                :key="index"
                                :class="{'path-click': pathList.nodeNum == index || (!pathList.nodeNum && index === 0)}"
                                class="path one-path"
                                @click="nodeSectionsClick(index, pathIndex)"
                            >{{ list.nodePort }}</li>
                        </ul>
                        <Divider />
                        <div class="public-table-content">
                            <div class="l-content">
                                <div
                                    v-show="pathList.nodeNum == index || (!pathList.nodeNum && index === 0)"
                                    v-for="(list, index) of pathList.nodeList"
                                    :key="index"
                                    class="table-data"
                                >
                                    <ul>
                                        <p class="table-title">
                                            <span>基本信息：</span>
                                            <span class="look-btn" @click="lookAttachingTask(list, index)">查看附加任务</span>
                                        </p>
                                        <li>
                                            <span class="table-key">物流类型：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.logisticsType }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">运输类型：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.trspType }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">集装箱来源：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.contaSource }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">集装箱尺寸类型：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.contaSizeType }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">提箱类型：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.suitcaseType }}</p>
                                            </span>
                                        </li>
                                        <li>
                                            <span class="table-key">集装箱数量：</span>
                                            <span class="table-val">
                                                <p class="value">{{ list.serverParam.contaQty }}</p>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 运输要求模块 -->
                <div
                    v-else
                    v-show="index === pathNum"
                    v-for="(list, index) of pathData"
                    :key="index"
                    class="transport-requiry public-detail"
                >
                    <div class="normal-info-table two-cell">
                        <div class="table-box">
                            <div class="table">
                                <div class="cell">
                                    <div class="cell-name">主要运输方式：</div>
                                    <div class="cell-content">{{ list.mainTrspMode }}</div>
                                </div>
                                <div class="cell">
                                    <div class="cell-name">最低时长要求：</div>
                                    <div class="cell-content">{{ list.lowestTimeReq }}{{ list.timeUnit }}</div>
                                </div>
                                <div class="cell">
                                    <div class="cell-name">最高价格要求：</div>
                                    <div class="cell-content">{{ list.highestCostReq }}{{ list.currencyUnit }}</div>
                                </div>
                                <div class="cell">
                                    <div class="cell-name">货物适宜温度：</div>
                                    <div class="cell-content">{{ list.cargoSuitTemp }}{{ list.tempUnit }}</div>
                                </div>
                                <div class="cell">
                                    <div class="cell-name">报关地要求：</div>
                                    <div class="cell-content">{{ list.customsReq }}</div>
                                </div>
                                <div class="cell">
                                    <div class="cell-name">最迟起运时间：</div>
                                    <div class="cell-content">{{ timestampFormat(list.lastStartTime) }}</div>
                                </div>
                                <div class="cell">
                                    <div class="cell-name">最晚到达时间：</div>
                                    <div class="cell-content">{{ timestampFormat(list.lastArriveTime) }}</div>
                                </div>
                                <div class="cell">
                                    <div class="cell-name"></div>
                                    <div class="cell-content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="pathData[0]" class="remark">
                <span class="remark-tit">货运要求备注：</span>
                <span class="remark-val">
                    <span>{{ pathData[0].freightBrief }}</span>
                </span>
            </p>
        </div>
        <adt-my-modal
            :showModal="isModalShow"
            width="670px"
            title="查看附加任务"
            @on-ok="handleConfirm"
            @on-visible-change="visibleChange"
        >
            <div class="scene-box">
                <span
                    v-for="(item, key) of taskData"
                    :key="key"
                    :class="{'path-click': attachingTaskNum === key}"
                    class="scene"
                    @click="attachingTaskClick(key, item)"
                >{{ item.sceneName }}</span>
            </div>
            <ul class="attaching-task-tit">
                <p
                    v-show="attachingTaskNum === key"
                    v-for="(item, key) of taskData"
                    :key="key"
                    class="attaching-task-content"
                >
                    <span class="title">附加任务:</span>
                    <span class="task-list" v-for="(list, index) of item.reqTaskList" :key="index">{{ list.taskName }}</span>
                </p>
            </ul>
        </adt-my-modal>
    </div>
</template>

<script>
    import { timestampFormat } from '@/libs/utils'
    import { apiQueryDetailFreight } from '@/api/freight'
    export default {
        name: 'FeedbackDetail',
        props: {
            id: '',
            sign: ''
        },
        data() {
            return {
                // 附加任务
                taskData: [],
                isModalShow: false,
                btnIndex: 1,
                titleTabNames: ['客户录入信息', '销售编辑信息', '调度编辑信息'],
                isUnderline: true,
                changeIndex: 1,
                titleNames: ['路线参数', '运输要求'],
                // 货运路线
                pathNum: 0,
                // 左侧tab
                tabNum: 0,
                // 附加任务的场景
                attachingTaskNum: 0,
                tabBarShow: true,
                // 运输服务模块
                transportServiceShow: true,
                // 客户的反馈或者未反馈
                isClientFeedback: true,
                // 查看推荐方案按钮展示
                recommendationShow: false,
                pathData: [],
                status: ''
            }
        },
        mounted() {
            this.getData()
            // 如果是已反馈的就显示查看推荐方案按钮
            if (this.sign === 'show') {
                this.recommendationShow = true
            }
        },
        methods: {
            // 初始化数据
            getData() {
                const freightReqCode = this.id
                apiQueryDetailFreight({ freightReqCode }).then(res => {
                    this.pathData = res.data
                })
            },
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat (timeStamp)
            },
            // 模态框显示隐藏状态发生改变
            visibleChange (changeStatus) {
                this.isModalShow = changeStatus
            },
            // 点击附加任务的场景
            attachingTaskClick (key) {
                this.attachingTaskNum = key
            },
            // 点击货运路线
            pathClick (key, value){
                this.pathNum = key
            },
            // 点击下面的tab
            handleBtn (index, titleItem) {
                this.changeIndex = index + 1
                if (titleItem === '运输要求') {
                    this.tabBarShow = false
                } else {
                    this.tabBarShow = true
                }
            },
            // 点击下面的路段
            lineSectionsClick (index, pathIndex) {
                this.$set(this.pathData[pathIndex], 'lineNum', index)
            },
            // 点击下面的节点
            nodeSectionsClick (index, pathIndex) {
                this.$set(this.pathData[pathIndex], 'nodeNum', index)
            },
            // 点击左侧tab
            leftTabClick (key) {
                this.tabNum = key
                if(this.tabNum == 0) {
                    this.transportServiceShow = true
                } else {
                    this.transportServiceShow = false
                }
            },
            // 查看推荐方案
            recommendation () {
                window.localStorage.setItem('freightData', JSON.stringify(this.pathData))
                this.$router.push({
                    path: `/logistics-solutions/customer-service-plan/1`,
                    query: {
                        sign: 'viewRecommendations_detail'
                    }
                })
            },
            // 查看附加任务
            lookAttachingTask (list, index) {
                this.isModalShow = true
                // this.taskData = list.reqTaskList
                this.taskData = list.sceneTaskList
            },
            // 附加任务弹框确定
            handleConfirm () {
                this.isModalShow = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    .scene-box {
        overflow: auto;
        margin: 0 28px;
        white-space: nowrap;
        @extend %scrollbar-crosswise;
        .scene {
            display: inline-block;
            padding: 0px 30px;
            margin-left: 20px;
            background: #E5E5E5;
            border-radius: 4px;
            cursor: pointer;
            &:first-child {
                margin: 0;
            }
        }
    }
    .attaching-task-tit {
        margin-top: 10px;
        border-top: 1px dashed #c8c8c8;
    }
    .attaching-task-content {
        margin: 8px 30px;
        .ivu-checkbox-wrapper {
            width: 31%;
            text-align: center;
        }
    }
    .path-click {
        background-color:$info-prompt-color !important;
        border: 1px solid $light-color !important;
    }
    .attaching-task-content {
        margin: 8px 30px;
        .title {
            display: block;
            color: #333;
            margin-bottom: 14px;
        }
        ul {
            li {
                display: inline-block;
                width: 144px;
                text-align: center;
                cursor: pointer;
            }
        }
        .task-list{
            width: 25%;
            display: inline-block;
        }
    }
    .path-info {
        margin-bottom: 34px;
        padding-bottom: 0 !important;
        box-shadow:0px 2px 4px 0px rgba(51,51,51,0.1) !important;
        .name {
            vertical-align: super !important;
        }
        .path-list {
            width: 90% !important;
            padding-bottom: 20px;
        }
    }
    .remark {
        padding: 10px 20px;
        padding-bottom: 112px;
        padding-top: 0;
        background: #fff;
        .remark-tit {
            font-weight: bold;
            vertical-align: middle;
        }
        .remark-val {
            display: inline-block;
            width: 92%;
            min-height: 50px;
            background: #f9f9f9;
            vertical-align: middle;
            padding: 14px 30px;
            margin-top: 8px;
            margin-left: 6px;
            border: 1px solid #e5e5e5;
        }
    }
    .tab-click {
        color: $light-color;
        background-color: #F9F9F9 !important;
        border: 1px solid $light-color;
    }
    .info-title {
        color: #333;
        font-size: 16px;
        font-weight: bold;
        margin-left: 30px;
        margin-bottom: 10px;
    }
</style>
