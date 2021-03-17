<template>
    <div class="orderDetail">
        <header-btn :title="`订单编号:${detailData.orderCode}`">
            <div slot="btn">
                <Button
                    v-if="
                        detailData.orderStatus == 'WAIT' ||
                        detailData.orderStatusTranslate == '待接单'
                    "
                    @click="openDialog"
                    >拒绝订单</Button
                >
                <Button
                    v-if="detailData.orderStatus !== 'REJECT'"
                    @click="openReceiptDialog"
                    >查看执行单据</Button
                >
                <Button
                    v-if="
                        detailData.orderStatus == 'WAIT' ||
                        detailData.orderStatusTranslate == '待接单'
                    "
                    type="primary"
                    @click="accept"
                    >接受订单</Button
                >
            </div>
        </header-btn>
        <div class="main-box">
            <!-- 路线 -->
            <div class="route-box">
                <cart-route :routeData="detailData" />
            </div>
            <!-- 时间 -->
            <div class="time">
                <span>{{ detailData.createEtpsName }}</span>
                <span>
                    计划时间：{{ moment_time_m(detailData.planStartTime) }} --
                    {{ moment_time_m(detailData.planEndTime) }}
                </span>
            </div>
            <div class="public-line1jz" style="background: #999" />
            <!-- 场景 -->
            <div class="chang-jing">
                <scene-map
                    :List="sceneMapResKList"
                    @auditStatus="handelValue"
                />
            </div>
            <Divider
                :dashed="true"
                style="border-color: #999; margin: 0; margintop: 10px"
            />
            <!-- 基础任务 -->
            <div class="list-item" v-if="BasicTaskList.length">
                <div class="tit">
                    基础任务内容：
                    <span>
                        (服务总价: ￥
                        <span>
                            {{ BasicTaskList[0].taskCost }} /
                            {{ BasicTaskList[0].goosUnit }}
                        </span>
                        <span>
                            总时长：{{ BasicTaskList[0].serverDuration
                            }}{{ BasicTaskList[0].serverDurationUnit }} </span
                        >)
                    </span>
                </div>
                <div class="main">
                    <task-list
                        :list="BasicTaskList"
                        @handelTask="getFeedbackBasicTask"
                    />
                </div>
            </div>
            <!-- 基础任务下执行反馈数据项表单 -->
            <div
                class="Feedback-form-box"
                v-if="detailData.orderStatus !== 'REJECT'"
            >
                <feedbackForm
                    ref="feedbackFormId"
                    :list="basislist"
                    :dataObj="basisObj"
                />
            </div>
            <!-- 附加任务 -->
            <div class="list-item" v-if="AdditionalTaskList.length">
                <div class="tit">附加任务内容：</div>
                <div class="main">
                    <task-list
                        :list="AdditionalTaskList"
                        @handelTask="getFeedbackAdditionalTask"
                    />
                </div>
            </div>
            <!-- 附加任务下执行反馈数据项表单 -->
            <div
                class="Feedback-form-box"
                v-if="detailData.orderStatus !== 'REJECT'"
            >
                <feedbackForm
                    ref="feedbackFormId2"
                    :list="appendlist"
                    :dataObj="appendObj"
                />
            </div>
            <!-- 拒绝的弹框交互 -->
            <order-status ref="orderStatusId" :detailData="detailData" />
            <!-- 执行单据的弹框 -->
            <receipt-dialog
                ref="receiptDialogId"
                :ATlist="sceneMapResKList"
                :detailData="detailData"
            />
        </div>
    </div>
</template>

<script>
    import cartRoute from './cart-route/index'
    import headerBtn from './header-btn/index'
    import {
        apiGetOrderDetails,
        apiModifyOrderStatus,
        apiGetExecuteFeedback
    } from '@/api/logisticsCommission'
    import dictionaryList from '@/mixins/dictionaryList'
    import sceneMap from './scene-map/index'
    import orderStatus from './order-status'
    import taskList from './task-list'
    import feedbackForm from './feedback-form'
    import receiptDialog from './receipt-dialog'
    export default {
        name: '',
        mixins: [dictionaryList],
        components: {
            cartRoute,
            headerBtn,
            sceneMap,
            orderStatus,
            taskList,
            feedbackForm,
            receiptDialog
        },
        data () {
            return {
                detailData: {},
                // 场所名
                sceneMapResKList: [],
                // 基础任务集合
                BasicTaskList: [],
                // 附加任务集合
                AdditionalTaskList: [],
                // 任务下的数据项的集合
                StructureList: [],
                //基础任务反馈数据项
                basislist: [],
                basisObj: {},
                //附加任务反馈数据项
                appendlist: [],
                appendObj: {},
                // 场景编号
                appendSceneCode: ''
            }
        },
        computed: {
            cptOrderCode () {
                return this.$route.query.orderCode
            }
        },
        async created () {
            await this.getDetail()
        },
        mounted () { },
        methods: {
            //打开单据弹框
            openReceiptDialog () {
                this.$refs.receiptDialogId.openDialog()
            },
            //拒绝
            openDialog () {
                this.$refs.orderStatusId.openDialog()
            },
            // 接受
            accept () {
                this.$refs.orderStatusId.accept(this.detailData)
            },
            // 点击场景的事件
            handelValue (key) {
                /* 后端不规范，前端泪两行 这里的key值，居然是中文 */
                this.appendSceneCode = key.value
                this.BasicTaskList = this.detailData.sceneMapRes[key.oldKey].filter(
                    (item) => item.taskType == 'B'
                )
                this.AdditionalTaskList = this.detailData.sceneMapRes[key.oldKey].filter(
                    (item) => item.taskType == 'A'
                )
            },
            // 查询详情
            getDetail () {
                apiGetOrderDetails({
                    orderCode: this.cptOrderCode
                }).then(({ data }) => {
                    this.detailData = data
                    // let regex1 = /\((.+?)\)/g;   // () 小括号
                    let oldList = Object.keys(data.sceneMapRes)
                    let list = Object.keys(data.sceneMapRes).map(item => item.substring(item.indexOf("(") + 1, item.indexOf(")")).split(","))
                    this.sceneMapResKList = list.map((item, index) => {
                        return {
                            value: item[0].split("=").pop(),
                            label: item[1].split("=").pop(),
                            oldKey: oldList[index]
                        }
                    })
                })
            },
            // 反馈请求封装
            _Feedback (val) {
                return new Promise((reslove, reject) => {
                    let data = {
                        taskCode: val.taskCode,
                        orderCode: val.orderCode,
                        sceneCode: this.appendSceneCode
                    }
                    apiGetExecuteFeedback({
                        data
                    }).then(({ data }) => {
                        let { dataStructure = [] } = data
                        let arr = dataStructure.sort((a, b) => a.sort - b.sort).map(item => {
                            if (item.sourceValue) {
                                return {
                                    ...item,
                                    opList: this.$getDictionary(item.sourceValue),
                                }
                            } else {
                                return {
                                    ...item,
                                }
                            }

                        })
                        reslove(arr)
                    })
                })

            },
            //拿到基础任务的数据项
            async getFeedbackBasicTask (val) {
                this.basisObj = {
                    orderCode: this.detailData.orderCode,
                    taskCode: val.taskCode
                }
                this.basislist = await this._Feedback(this.basisObj)
            },
            //拿到反馈的数据项
            async getFeedbackAdditionalTask (val) {
                this.appendObj = {
                    orderCode: this.detailData.orderCode,
                    taskCode: val.taskCode
                }
                this.appendlist = await this._Feedback(this.appendObj)
            },
        }
    }
</script>

<style scoped lang="scss">
    .orderDetail {
        .route-box {
            margin-bottom: 20px;
        }
        .main-box {
            padding: 20px;
            background: #fff;
            box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
            min-height: 80vh;
        }
        .list-item {
            margin-bottom: 10px;
            .tit {
                font-size: 14px;
                font-weight: bold;
                line-height: 28px;
                span {
                    font-size: 12px;
                    font-weight: 400;
                    margin-right: 20px;
                }
            }
        }
        .chang-jing {
            margin-bottom: 10px;
        }
        .Feedback-form-box {
            margin-bottom: 10px;
        }
        .time {
            span {
                &:nth-child(1) {
                    font-size: 16px;
                    font-weight: bold;
                    color: rgba(51, 51, 51, 1);
                    line-height: 28px;
                    padding-right: 65px;
                }
            }
        }
    }
</style>
