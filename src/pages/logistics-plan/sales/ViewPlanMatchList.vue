<template>
    <div>
        <adt-logistics-route :logisticsRouteList="routes" @clickPath="clickPath">
            <template slot="prompt" />
        </adt-logistics-route>
        <div class="btns-paginator">
            <AdtButton class="btn">
                <Button @click="addPlan()">添加方案进推荐列表
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-xiangbao"></use>
                    </svg>
                </Button>
                <Button @click="viewList()">查看推荐列表
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-xiangbao"></use>
                    </svg>
                </Button>
                <Button @click="notApplicable()">方案不适用
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-xiangbao"></use>
                    </svg>
                </Button>
                <Button @click="hide()">方案隐藏
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-xiangbao"></use>
                    </svg>
                </Button>
                <Button @click="unhide()">取消方案隐藏
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-xiangbao"></use>
                    </svg>
                </Button>
            </AdtButton>
            <adt-paginator
                class="pagination"
                :currentPage="~~page"
                :total="~~total"
                :size="3"
            />
        </div>
        <div class="public-list one-column">
            <div v-for="(entrust, index) in listData" :key="index" class="public-component-card">
                <adt-list-item
                    :logistics="entrust"
                    :showCheckbox="true"
                    @checkData="checkTabData"
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
        <ViewRecommendations :showDrawer="isShowDrawer" :routeList="routes" @on-visible-change="onChangeStatus" />
        <adt-my-modal
            :showModal="isShowModal"
            @on-visible-change="onChangeModal"
            @on-ok="save()"
            @on-cancel="cancel()"
        >
            <Form :model="formItemData" ref="formItem" :rules="formItemRule" label-position="top">
                <FormItem label="方案不适用原因:" prop="reson">
                    <Input type="textarea" v-model="formItemData.reson"></Input>
                </FormItem>
            </Form>
        </adt-my-modal>
    </div>    
</template>

<script>
    import paginator from '@/mixins/paginator'
    import AdtLogisticsRoute from '@/components/adt-logistics-route/Index'
    import AdtListItem from '@/components/adt-list-item/Index'
    import LineInfo from '@/pages/logistics-plan/components/LineInfo'
    import ViewRecommendations from '@/pages/logistics-plan/components/ViewRecommendations'
    export default {
        components: {
            AdtLogisticsRoute,
            AdtListItem,
            LineInfo,
            ViewRecommendations
        },
        mixins: [paginator],
        data() {
            return {
                // 推荐方案列表弹窗
                isShowDrawer: false,
                // 方案不适用弹窗
                isShowModal: false,
                formItemData: {},
                formItemRule: {},
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
                // 勾选的数据
                selectListData: []
            }
        },
        methods: {
            // 推荐方案列表弹窗
            onChangeStatus (val) {
                this.isShowDrawer = val
            },
            // 方案不适用弹窗
            onChangeModal (val) {
                this.isShowModal = val
            },
            // 路线切换
            clickPath (val) {
                this.getData(val)
            },
            dataInit () {
                this.getData()
                // this.processData()
            },
            getData () {},
            // 勾选表格数据
            checkTabData (data, status) {
                // console.log(data, status)
                // 勾选数据去重
                if (status) {
                    this.selectListData.push(data)
                } else {
                    for(let index in this.selectListData) {
                        if (this.selectListData[index].logisticsPlanCode === data.logisticsPlanCode) {
                            this.selectListData.splice(index, 1)
                        }
                    }
                }
                console.log(this.selectListData)
            },
            // 添加方案进推荐列表
            addPlan () {
                this.isShowDrawer = true
            },
            // 查看推荐列表
            viewList () {},
            // 方案不适用
            notApplicable () {
                this.isShowModal = true
            },
            // 方案不适用保存
            save () {},
            // 取消方案不适用
            cancel () {},
            // 方案隐藏
            hide () {},
            // 取消方案隐藏
            unhide () {},
        },
    }
</script>

<style lang="scss" scoped>
    .btn {
        display: flex;
        margin-left: -30px;
    }
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