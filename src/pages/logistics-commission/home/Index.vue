<template>
    <div class="dashboard">
        <div class="top-box">
            <user-info />
            <div class="todu-box">
                <div class="dai-ban">
                    <div
                        class="item-box"
                        v-for="(item, index) in pendingList"
                        :key="index"
                        @click="handelRoute(item)"
                    >
                        <div class="tit">{{ item.titName }}</div>
                        <div class="add">
                            今日待处理
                            <span>+{{ item.addNum }}</span>
                        </div>
                        <div class="num">{{ item.num }}</div>
                    </div>
                </div>
                <div class="dang-qiang">
                    <div class="wei-tuo">
                        <div class="text-box">
                            当前委托总量
                            <span
                                >{{
                                    momentd_Y_M_m(
                                        ExecutoryObj.currentStartTime
                                    )
                                }}-{{
                                    momentd_Y_M_m(ExecutoryObj.currentEndTime)
                                }}</span
                            >
                        </div>
                        <div class="bar-box">
                            <div class="num">
                                {{ ExecutoryObj.currentEntrustExecutoryNum }}
                            </div>
                            <div class="bar">
                                <Progress
                                    :percent="cptpercent"
                                    hide-info
                                    :stroke-width="5"
                                />
                            </div>
                            <div class="shuo-ming">
                                <div class="complete">
                                    已完成委托：{{
                                        ExecutoryObj.currentPerformance
                                    }}
                                </div>
                                <div class="go">
                                    进行中委托：{{
                                        ExecutoryObj.currentUnderway
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="Vertical-line"
                        style="width: 1px; height: 104px; background: #e5e5e5"
                    ></div>
                    <div class="wu-liu">
                        <div class="text-box">
                            {{ planCountObj.titName }}
                            <span
                                >{{
                                    momentd_Y_M_m(
                                        planCountObj.currentStartTime
                                    )
                                }}-{{
                                    momentd_Y_M_m(planCountObj.currentEndTime)
                                }}</span
                            >
                        </div>
                        <div class="num">
                            {{
                                planCountObj.currentSchemeNum ||
                                planCountObj.currentFreightNum
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-box">
            <div class="my-info">
                <div class="tit">
                    <div class="unread">未读</div>
                    <div class="read">已读</div>
                </div>
                <div class="list">
                    <div class="list-item" v-for="(item, index) in MessageList">
                        <div class="text" @click="editMes(item)">
                            <span
                                :title="item.messageContent"
                                @click="item.messageStatus = '已读'"
                            >
                                <i
                                    :class="[
                                        item.messageStatus === '已读'
                                            ? 'yi_du'
                                            : 'wei_du',
                                    ]"
                                ></i>
                                {{ item.messageContent }}
                            </span>
                        </div>
                        <div class="time">
                            {{ moment_xie_m(item.createTime) }}
                        </div>
                    </div>
                </div>
                <div v-show="seeMoreShow" class="btn" @click="seeMore">
                    <Icon type="ios-arrow-dropright" />
                    <span>查看更多</span>
                </div>
            </div>
            <div class="eachr-box">
                <dischart v-if="isRoles_m(['DIS'])"></dischart>
                <entchart v-if="isRoles_m(['ENT', 'SALE'])"></entchart>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import VCharts from 'v-charts'
Vue.use(VCharts)
import {
    apiCurrentEntrustExecutoryNum,
    apiFreightIndex,
    apiEntrustIndex,
    apiPlanIndex,
    apiPlanOrderIndex,
    apiSchemeIndex,
    apiCurrentMessageList,
    apiCurrentSchemeNum,
    apiCurrentFreightNum,
    apiGetUpdateCurrentMessageStatus
} from '@/api/logisticsCommission'
import utilMixin from '../mixins/utilMixin'
import authMixin from '../../../mixins/authMixin'
import dischart from './dischart/Index'
import entchart from './entchart/Index'
import userInfo from './user/Index'
export default {
    name: "dashboard",
    mixins: [utilMixin, authMixin],
    components: {
        dischart,
        entchart,
        userInfo
    },
    data () {
        return {
            //查看更多按钮
            seeMoreShow: true,
            // 待处理集合
            pendingList: [],
            // 消息集合
            MessageList: [],
            // 当前物流通道总量 或 当前货运要求总量
            planCountObj: {},
            // 当前委托总量
            ExecutoryObj: {},
        };
    },
    computed: {
        // 进度条的值
        cptpercent () {
            let num = null
            num = (this.ExecutoryObj.currentPerformance / this.ExecutoryObj.currentEntrustExecutoryNum) * 100
            return num
        }
    },
    created () {
        this.getPendingList()
        this.getMessage()
    },
    mounted () {
    },
    methods: {
        // 改变信息已读
        editMes (item) {
            apiGetUpdateCurrentMessageStatus({messageCode:item.messageCode}).then(({ data }) => {
            })
        },
        // 查看更多
        seeMore () {
            this.seeMoreShow = false
            this.getMessage()
        },
        // 处理名字
        _processName (api) {
            let obj = {}
            //调度
            if (this.isRoles_m(['DIS'])) {
                switch (api) {
                    case 'huo_yun':
                        obj.titName = '待处理货运要求'
                        obj.url = '/freight-request/dispatch-list/1'
                        break;
                    case 'wu_liu':
                        obj.titName = '待处理物流委托'
                        obj.url = '/logisstics-commission/one-logistics/1'
                        break;
                    case 'ding_dan':
                        obj.titName = '待处理订单'
                        obj.url = '/logisstics-commission/one-logistics/1'
                        break;
                    case 'fang_an':
                        obj.titName = '待处理方案'
                        obj.url = '/freight-request/dispatch-list/1'
                        break;
                    default:
                        obj.titName = '没有传入名字'
                }
            }
            // 销售
            if (this.isRoles_m(['SALE'])) {
                switch (api) {
                    case 'huo_yun':
                        obj.titName = '待处理货运要求'
                        obj.url = '/freight-request/sale-list/1'
                        break;
                    case 'wu_liu':
                        obj.titName = '待接收委托'
                        obj.url = '/logisstics-commission/one-logistics/1'
                        break;
                    case 'ji_hua':
                        obj.titName = '待确认计划'
                        obj.url = '/logisstics-commission/one-logistics/1'
                        break;
                    default:
                        obj.titName = '没有传入名字'
                }
            }
            // 客户
            if (this.isRoles_m(['ENT'])) {
                switch (api) {
                    case 'huo_yun':
                        obj.titName = '待处理货运要求'
                        obj.url = '/freight-request/list-client/1'
                        break;
                    case 'wu_liu':
                        obj.titName = '待接收委托'
                        obj.url = '/logisstics-commission/one-logistics/1'
                        break;
                    case 'ji_hua':
                        obj.titName = '待确认计划'
                        obj.url = '/logisstics-commission/one-logistics/1'
                        break;
                    default:
                        obj.titName = '没有传入名字'
                }
            }
            return obj
        },
        // 获取待处理
        async getPendingList () {
            let list = []
            let p1 = await new Promise((resole, reject) => {
                apiFreightIndex().then(({ data }) => {
                    list.push({
                        ...data,
                        ...this._processName('huo_yun'),
                        addNum: data.todayFreightResultNum,
                        num: data.freightResultCount,
                    })
                    resole()
                })
            })
            let p2 = await new Promise((resole, reject) => {
                apiEntrustIndex().then(({ data }) => {
                    list.push({
                        ...data,
                        ...this._processName('wu_liu'),
                        addNum: data.todayEntrustResultNum,
                        num: data.entrustResultCount,
                    })
                    resole()
                })
            })
            //调度
            if (this.isRoles_m(['DIS'])) {
                let p3 = await new Promise((resole, reject) => {
                    apiPlanOrderIndex().then(({ data }) => {
                        list.push({
                            ...data,
                            ...this._processName('ding_dan'),
                            addNum: data.todayEntrustResultNum,
                            num: data.entrustResultCount,
                        })
                        resole()
                    })
                })
                let p4 = await new Promise((resole, reject) => {
                    apiSchemeIndex().then(({ data }) => {
                        list.push({
                            ...data,
                            ...this._processName('fang_an'),
                            addNum: data.todayEntrustResultNum,
                            num: data.entrustResultCount,
                        })
                        resole()
                    })
                })
                apiCurrentSchemeNum().then(({ data }) => {
                    this.planCountObj = {
                        ...data,
                        titName: "当前物流通道总量",
                    }
                })
            }
            // 客户 销售
            if (this.isRoles_m(['ENT', 'SALE'])) {
                let p5 = await new Promise((resole, reject) => {
                    apiPlanIndex().then(({ data }) => {
                        list.push({
                            ...data,
                            ...this._processName('ji_hua'),
                            addNum: data.todayEntrustResultNum,
                            num: data.entrustResultCount,
                        })
                        resole()
                    })
                })
                apiCurrentFreightNum().then(({ data }) => {
                    this.planCountObj = {
                        ...data,
                        titName: "当前货运要求总量",
                    }
                })
            }
            apiCurrentEntrustExecutoryNum().then(({ data }) => {
                this.ExecutoryObj = {
                    ...data,
                    titName: "当前委托总量",
                }
            })
            this.pendingList = list
        },
        getMessage () {
            // 消息
            apiCurrentMessageList().then(({ data }) => {
                if (this.seeMoreShow) {
                    this.MessageList = data.slice(0, 7)
                    return
                }
                this.MessageList = data
            })
        },
        // 路径跳转
        handelRoute (item) {
            let query = {}
            if (item.stepId) {
                query.stepId = JSON.stringify(item.stepId)
            }
            this.$router.push({
                path: item.url,
                query: {
                    jzName: 'Home',
                    freightReqStatus: item.freightReqStatus,
                    entrustExecutoryStatus: item.entrustExecutoryStatus,
                    ...query
                },
            })
        }
    }
};
</script>

<style scoped lang="scss">
/deep/ .ivu-progress-success .ivu-progress-bg{
    background-color: $light-color;
}
.dashboard {
    position: relative;
    top: -16px;
    .top-box {
        display: flex;
        margin-bottom: 10px;
    }
    .todu-box {
        flex: 1;
        .dai-ban {
            width: 100%;
            height: 220px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            padding: 0 0 0 120px;
            background: url('../../../assets/images/my-agent.png') no-repeat;
            @include shadow;
            .item-box {
                width: 120px;
                margin-right: 140px;
                cursor: pointer;
                .tit {
                    line-height: 16px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #343434;
                    margin-bottom: 10px;
                }
                .add {
                    font-size: 14px;
                    line-height: 14px;
                    font-weight: 400;
                    color: #9a9a9a;
                    margin-bottom: 20px;
                    span {
                        color: $light-color;
                    }
                }
                .num {
                    line-height: 50px;
                    font-size: 50px;
                    font-weight: 400;
                    color: #343434;
                }
            }
        }
        .dang-qiang {
            width: 100%;
            height: 140px;
            @include shadow;
            padding: 20px 66px;
            display: flex;
            .wei-tuo {
                display: flex;
                padding: 0 190px 0 0;
                .text-box {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: bold;
                    color: #343434;
                    line-height: 16px;
                    padding-right: 60px;
                    span {
                        display: block;
                        font-size: 14px;
                        font-weight: 400;
                        color: #666666;
                        line-height: 28px;
                    }
                }
                .bar-box {
                    width: 410px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    .num {
                        font-size: 36px;
                        font-weight: 400;
                        color: #343434;
                        line-height: 36px;
                    }
                    .bar {
                    }
                    .shuo-ming {
                        display: flex;
                        justify-content: space-between;
                        font-size: 16px;
                        color: #343434;
                        line-height: 16px;
                    }
                }
            }
            .wu-liu {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                .text-box {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: bold;
                    color: #343434;
                    line-height: 16px;
                    padding-right: 30px;
                    span {
                        display: block;
                        font-size: 14px;
                        font-weight: 400;
                        color: #666666;
                        line-height: 28px;
                    }
                }
                .num {
                    font-size: 36px;
                    font-weight: 400;
                    color: #343434;
                    line-height: 36px;
                }
            }
        }
    }
    .bottom-box {
        display: flex;
        .my-info {
            position: relative;
            width: 500px;
            height: 591px;
            margin-right: 10px;
            padding: 20px 40px;
            background: url('../../../assets/images/my-info.png') no-repeat;
            @include shadow;
            .btn {
                font-size: 14px;
                color: #343434;
                line-height: 28px;
                text-align: center;
                cursor: pointer;
                position: absolute;
                bottom: 10px;
                left: 194px;
                i {
                    font-size: 20px;
                }
                span {
                    padding-left: 10px;
                    vertical-align: baseline;
                }
            }
            .unread,
            .read {
                position: relative;
                &::before {
                    content: ' ';
                    position: absolute;
                    left: -10px;
                    top: 9px;
                    width: 4px;
                    height: 4px;
                    background-color: $error-color;
                    border-radius: 2px;
                }
            }
            .wei_du {
                position: absolute;
                left: 0px;
                top: 9px;
                width: 4px;
                height: 4px;
                background-color: $error-color;
                border-radius: 2px;
            }
            .yi_du {
                position: absolute;
                left: 0px;
                top: 9px;
                width: 4px;
                height: 4px;
                background-color: $light-color;
                border-radius: 2px;
            }
            .read {
                &::before {
                    background-color: $light-color;
                }
            }
            .tit {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 40px;
                font-size: 14px;
                .unread {
                    padding: 0 30px 0 0;
                }
            }
            .list {
                height: 500px;
                overflow-y: auto;
                @extend %scrollbar;
                .list-item {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #e5e5e5;
                    font-size: 14px;
                    font-weight: 400;
                    color: #343434;
                    line-height: 22px;
                    margin-bottom: 29px;
                    padding-bottom: 10px;
                    .text {
                        position: relative;
                        cursor: pointer;
                        span {
                            padding-left: 10px;
                            width: 223px;
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .time {
                        padding-right: 10px;
                    }
                }
            }
        }
        .eachr-box {
            flex: 1;
            height: 591px;
        }
    }
}
</style>
