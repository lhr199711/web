<template>
    <div>
        <adt-logistics-route :logisticsRouteList="routes" @clickPath="clickPath">
            <template slot="prompt">
                <div class="box-info">
                    <span>根据货运要求匹配的物流方案必须要进入详情确认方案后才能推荐给销售</span>
                </div>
            </template>
        </adt-logistics-route>
        <div class="btns-paginator">
            <div style="font-size: 16px;">推荐物流方案列表</div>
            <adt-paginator
                class="pagination"
                :currentPage="~~page"
                :total="~~total"
                size="3"
            />
        </div>
        <div class="public-list one-column">
            <div v-for="(entrust, index) in listData" :key="index" class="public-component-card">
                <adt-list-item
                    :logistics="entrust"
                >
                    <template slot="tab-title">
                        <Row style="float: left; width: 95%; padding-bottom: 10px;">
                            <Col span="4">物流方案编号：{{ entrust.logisticsPlanCode }}</Col>
                        </Row>
                    </template>
                    <template slot="tab-operat">
                        <Poptip class="card-icon" placement="right-start" trigger="hover">
                            <span>详情</span>
                            <Icon type="md-arrow-dropdown" />
                            <div class="card-poptip-font" slot="content">
                                <!-- <div @click="detail(entrust)">详情</div>
                                <div @click="edit(entrust)">编辑</div>
                                <div @click="cancel(entrust)">取消委托</div>
                                <div @click="send(entrust)">发送</div>
                                <div @click="remove(entrust)" class="failure">删除</div> -->
                            </div>
                        </Poptip>
                    </template>
                    <template slot="tab-content">
                        <!-- 运输产品 -->
                        <div class="tab-content">
                            <line-info :routeResList="entrust.routeResList">
                            </line-info>
                            <div class="tab-box">
                                <div class="tab-box-log">
                                    <svg class="iconfont way" aria-hidden="true">
                                        <use xlink:href="#icon-shenqing" />
                                    </svg>
                                    <span class="tab-box-font">{{ entrust.price }}/{{ entrust.priceUnit }}</span>
                                </div>
                                <div class="tab-box-log">
                                    <svg class="iconfont way" aria-hidden="true">
                                        <use xlink:href="#icon-shenqing" />
                                    </svg>
                                    <span class="tab-box-font">{{ entrust.time }}/{{ entrust.timeUnit }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </adt-list-item>
            </div>
        </div>
        <div class="public-btns-group" v-if="isBtnShow">
            <Button type="primary" shape="circle" size="large" @click="agree">同意</Button>
            <Button shape="circle" size="large" @click="refuse">拒绝</Button>
        </div>
    </div>    
</template>

<script>
    import paginator from '@/mixins/paginator'
    import AdtLogisticsRoute from '@/components/adt-logistics-route/Index'
    import AdtListItem from '@/components/adt-list-item/Index'
    import LineInfo from '@/pages/logistics-plan/components/LineInfo'
    export default {
        components: {
            AdtLogisticsRoute,
            AdtListItem,
            LineInfo
        },
        mixins: [paginator],
        data() {
            return {
                routes: [
                    {
                        matchScheme: 0,
                        roadList: [
                            {
                                departurePort: '重庆',
                                destinationPort: '成都'
                            },
                            {
                                departurePort: '成都',
                                destinationPort: '上海'
                            }

                        ]
                    },
                    {
                        matchScheme: 1,
                        roadList: [
                            {
                                departurePort: '重庆',
                                destinationPort: '成都'
                            },
                            {
                                departurePort: '成都',
                                destinationPort: '上海'
                            }

                        ]
                    },
                    {
                        matchScheme: 1,
                        roadList: [
                            {
                                departurePort: '重庆',
                                destinationPort: '成都'
                            },
                            {
                                departurePort: '成都',
                                destinationPort: '上海'
                            }

                        ]
                    }
                ],
                listData: [{
                    logisticsPlanCode: 12223,
                    price: 600,
                    priceUnit: '箱',
                    time: 100,
                    timeUnit: '小时',
                    routeResList: [
                        {
                            departurePortTranslate: '重庆',
                            destinationPortTranslate: '香港',
                            trspMode: 'WATERWAY'
                        },
                        {
                            departurePortTranslate: '香港',
                            destinationPortTranslate: '纽约',
                            trspMode: 'WATERWAY'
                        },
                        {
                            departurePortTranslate: '重庆',
                            destinationPortTranslate: '香港',
                            trspMode: 'WATERWAY'
                        },
                        {
                            departurePortTranslate: '香港',
                            destinationPortTranslate: '纽约',
                            trspMode: 'WATERWAY'
                        }
                    ]
                }, {}], // 查询出的内容
                // 同意拒绝按钮
                isBtnShow: true
            }
        },
        methods: {
            // 路线切换
            clickPath (val) {
                this.getData(val)
            },
            dataInit () {
                this.getData()
                // this.processData()
            },
            getData () {},
            // 同意
            agree () {
                agreeApi().then(res => {
                    this.isBtnShow = true
                    // 可以发起物流委托
                })
            },
            // 拒绝
            refuse () {
                refuse().then(res => {
                    this.isBtnShow = true
                    // 只能查看详情
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .box-info {
        height: 32px;
        background-color: #F9F9F9;
        border-radius: 2px;
        span {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #0FB0B8;
            line-height: 32px;
            margin-left: 40px;
        }
    }
    .public-list {
        margin: 0;
    }
    .tab-content {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        margin: 0 10px;
        .tab-box {
            display: flex;
            .tab-box-log {
                background-color: #F1F2F5;
                padding: 10px;
                margin-left: 20px;
            }
            .tab-box-font {
                margin-left: 5px;
            }
        }
    }
</style>