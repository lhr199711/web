<template>
    <div class="flod-box">
        <div class="btns">
            <slot name="btns-start"></slot>
            <slot name="btns-end"></slot>
        </div>
        <Row class="publc-bottom10" v-for="(item,index) in list" :key="index">
            <Col span="24">
                <div class="item-box">
                    <div class="header">
                        <span>00{{index + 1}}单次委托</span>
                        <div>
                            <span class="btn">
                                <span
                                    v-if="item.entrustExecutoryStatus=='WAIT'"
                                    @click="goodsOk(item,index)"
                                >货好确认</span>
                                <span v-if="item.planCode" @click="seePlan(item,index)">查看全程物流计划</span>
                                <span
                                    v-if="isRoles_m(['DIS'])"
                                    @click="addPlan(item,index)"
                                >生成全程物流计划</span>
                                <span v-if="!item.isContentShow" @click="onOpen(item,index)">展开</span>
                                <span v-if="item.isContentShow" @click="onClose(item,index)">收起</span>
                                <span style="cursor: text;">{{item.entrustExecutoryStatusTranslate}}</span>
                            </span>
                            <span class="icon">
                                <Icon v-if="item.isContentShow" type="ios-arrow-down" />
                                <Icon v-else type="ios-arrow-up" />
                            </span>
                        </div>
                    </div>
                    <!--这里的可以使用动画-->
                    <div class="main-box" v-show="item.isContentShow">
                        <!-- 桥套的子组件 -->
                        <cargo-info :arrChild="item"></cargo-info>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import CargoInfo from './CargoInfo5-1'
import { apiModifyEntrustStatus } from '@/api/logisticsCommission'
import { isENT, isSALE, isDIS } from '@/libs/roles'
import authMixin from '@/mixins/authMixin'
export default {
    mixins: [authMixin],
    components: {
        CargoInfo,
    },
    props: {
        arr: {
            type: Array,
            default: [],
        },
    },
    data () {
        return {
            list: [], // 得到的数据
        }
    },
    watch: {},
    computed: {
        cptList () {
            return this.arr
        },
    },
    created () {
        this.initList()
    },
    mounted () { },
    methods: {
        initList () {
            let arr = this.cptList.map((item) => {
                return {
                    ...item,
                    isContentShow: false,
                }
            })
            this.list = arr
        },
        //查看物流全程计划
        seePlan (item, index) {
            if (this.isRoles_m(['ENT'])) {
                // 客户
                this.$router.push({
                    path: '/logistics-whole-journey-plan/client-plan',
                    query: {
                        entrustCode: item.entrustCode,
                        entrustExecutoryStatus: item.entrustExecutoryStatus,
                        planCode: item.planCode,
                    },
                })
            }
            if (this.isRoles_m(['SALE'])) {
                // 销售
                this.$router.push({
                    path: '/logistics-whole-journey-plan/sale-plan-detail',
                    query: {
                        planCode: item.planCode,
                    },
                })
            }
            if (this.isRoles_m(['DIS'])) {
                // 调度
                this.$router.push({
                    path: '/logistics-whole-journey-plan/plan-detail',
                    query: {
                        planCode: item.planCode,
                    },
                })
            }
        },
        //生成物流全程计划
        addPlan (item, index) {
            this.$router.push({
                path: '/logistics-whole-journey-plan/generate',
                query: {
                    executoryEntrustCode: item.executoryEntrustCode,
                },
            })
        },
        //货好确认
        goodsOk (item, index) {
            // 已货好
            let data = {
                executoryEntrustCode: item.executoryEntrustCode, //子委托编号
                entrustExecutoryStatus: 'EXECUTE', //子委托状态 进行中
            }
            apiModifyEntrustStatus({
                data,
            }).then(({ data }) => {
                this.$Message.success('操作成功')
            })
        },
        onOpen (item, index) {
            //打开
            // let off = this.list.some(op => op.isContentShow == true)
            // if (off) {
            //     this.$Message.error('请先保存编辑项')
            //     return
            // }
            this.list[index].isContentShow = true
        },
        onClose (item, index) {
            // 收起
            this.list[index].isContentShow = false
        },
    },
}
</script>

<style lang="scss" scoped>
.flod-box {
    .btns {
        padding: 8px 0;
        /deep/.ivu-btn {
            margin-right: 12px;
        }
    }
    .item-box {
        width: 100%;
    }
    .header {
        width: 100%;
        height: 40px;
        padding: 0 20px;
        background: #fff6e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn > span {
            border: 1px solid #ccc;
            background: #fff;
            height: 27px;
            line-height: 27px;
            padding: 4px 8px;
            border-radius: 4px;
            margin: 0 10px;
            cursor: pointer;
        }
    }
    .main-box {
        width: 100%;
        padding: 5px;
        background: #f9f9f9;
    }
}
</style>