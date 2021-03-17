<template>
    <div>
        <!-- 方案基本信息 -->
        <p class="title">方案基本信息</p>
        <AdtSchemeInformationRoute :logistics="logistics">
            <template slot="price">
                <!-- <span>参考价格:￥{{}}/{{}}</span>
                <span>参考时长:￥{{}}/{{}}</span> -->
                <span>结算固定汇率:{{}}</span>
            </template>
            <template slot="service">
                <Row>
                    <Col span="2">代理服务:</Col>
                    <Col span="4">代理服务: {{}}</Col>
                    <Col span="4">代理服务: {{}}</Col>
                    <Col span="4">代理服务: {{}}</Col>
                </Row>
            </template>
        </AdtSchemeInformationRoute>
        <!-- 产品服务信息 -->
        <p class="title">产品服务信息</p>
        <Card>
            <adt-tab-btns :height="40" :width="200" :isUnderline="true" :titleNames="titleNames" :btnIndex="changeIndex" @handleBtn="handleBtn">
                <Divider />
            </adt-tab-btns>
            <!-- 运输服务 -->
            <div class="collapse" v-if="changeIndex == 1">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <div class="collapse-head">
                            <span>重庆</span>
                            <svg class="icon" aria-hidden="true">
                                <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                            </svg>
                            <span>成都</span>
                            <span>展开</span>
                        </div>
                        <div slot="content">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col span="8" class="service-provider">
                                    <div class="service-provider-title">
                                        <span>选择服务商</span>
                                        <span class="clear-fix">查看全部></span>
                                    </div>
                                    <div class="service-provider-company">
                                        <p @click="selectCompany">
                                            <span>川普公司</span>
                                            <span class="price">基础价格: {{}}</span>
                                            <span class="time">时长: {{}}</span>
                                        </p>
                                        <p>
                                            <span>川普公司</span>
                                            <span>基础价格: {{}}</span>
                                            <span>时长: {{}}</span>
                                        </p>
                                        <p>
                                            <span>川普公司</span>
                                            <span>基础价格: {{}}</span>
                                            <span>时长: {{}}</span>
                                        </p>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}}</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                        <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                        <AdtTaskContent :basicTask="basicTask" :additionalTasks="additionalTasks" />
                                    </adt-tab-btns>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <!-- 场所服务 -->
            <div class="collapse" v-if="changeIndex == 2">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <div class="collapse-head">
                            <span>重庆</span>
                            <span>展开</span>
                        </div>
                        <div slot="content">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col span="8" class="service-provider">
                                    <div class="service-provider-title">
                                        <span>选择服务商</span>
                                        <span class="clear-fix">查看全部></span>
                                    </div>
                                    <div class="service-provider-company">
                                        <p @click="selectCompany">
                                            <span>川普公司</span>
                                            <span class="price">基础价格: {{}}</span>
                                            <span class="time">时长: {{}}</span>
                                        </p>
                                        <p>
                                            <span>川普公司</span>
                                            <span>基础价格: {{}}</span>
                                            <span>时长: {{}}</span>
                                        </p>
                                        <p>
                                            <span>川普公司</span>
                                            <span>基础价格: {{}}</span>
                                            <span>时长: {{}}</span>
                                        </p>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}}</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                        <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                        <AdtTaskContent :basicTask="basicTask" :additionalTasks="additionalTasks" />
                                    </adt-tab-btns>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <!-- 关务服务 -->
            <div class="collapse" v-if="changeIndex == 3">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <div class="collapse-head">
                            <span>重庆</span>
                            <span>展开</span>
                        </div>
                        <div slot="content">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col span="8" class="service-provider">
                                    <div class="service-provider-title">
                                        <span>选择服务商</span>
                                        <span class="clear-fix">查看全部></span>
                                    </div>
                                    <div class="service-provider-company">
                                        <p @click="selectCompany">
                                            <span>川普公司</span>
                                            <span class="price">基础价格: {{}}</span>
                                            <span class="time">时长: {{}}</span>
                                        </p>
                                        <p>
                                            <span>川普公司</span>
                                            <span>基础价格: {{}}</span>
                                            <span>时长: {{}}</span>
                                        </p>
                                        <p>
                                            <span>川普公司</span>
                                            <span>基础价格: {{}}</span>
                                            <span>时长: {{}}</span>
                                        </p>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}} 出口报关 进口报关</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                        <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                        <AdtTaskContent :basicTask="basicTask" :additionalTasks="additionalTasks" />
                                    </adt-tab-btns>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <!-- 综保区服务 -->
            <div class="collapse" v-if="changeIndex == 4">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <div class="collapse-head">
                            <span>重庆</span>
                            <span>展开</span>
                        </div>
                        <div slot="content">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col span="8" class="service-provider">
                                    <div class="service-provider-title">
                                        <span>选择服务商</span>
                                        <span class="clear-fix">查看全部></span>
                                    </div>
                                    <div class="service-provider-company">
                                        <p @click="selectCompany">
                                            <span>川普公司</span>
                                            <span class="price">基础价格: {{}}</span>
                                            <span class="time">时长: {{}}</span>
                                        </p>
                                        <p>
                                            <span>川普公司</span>
                                            <span>基础价格: {{}}</span>
                                            <span>时长: {{}}</span>
                                        </p>
                                        <p>
                                            <span>川普公司</span>
                                            <span>基础价格: {{}}</span>
                                            <span>时长: {{}}</span>
                                        </p>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}}</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                        <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                        <AdtTaskContent :basicTask="basicTask" :additionalTasks="additionalTasks" />
                                    </adt-tab-btns>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </Card>
    </div>
</template>

<script>
import AdtTaskContent from '@/components/adt-task-content/Index'
import AdtSchemeInformationRoute from '@/components/adt-scheme-information-route/Index'
export default {
    components: {
        AdtTaskContent,
        AdtSchemeInformationRoute
    },
    data() {
        return {
            value: '',
            changeIndex: 1,
            titleNames: ['运输服务', '场所服务', '关务服务', '综保区服务'],
            titleNamesScenes: ['场景1', '场景2', '场景3'],
            changeIndexScenes: 1,
            logistics: [
                {
                    city: '重庆1',
                    transport: '海运',
                    type: '国内集装箱'
                },
                {
                    city: '香港',
                    transport: '空运',
                    type: '国内集装箱'
                },
                {
                    city: '纽约',
                    transport: '空运',
                    type: '国内集装箱'
                },
                {
                    city: '纽约',
                    transport: '空运',
                    type: '国内集装箱'
                }
            ],
            basicTask: [
                '基础任务1',
                '基础任务2',
                '基础任务3',
                '基础任务4',
                '基础任务5',
                '基础任务6',
                '基础任务7',
                '基础任务8',
                '基础任务9',
                '基础任务10'
            ],
            additionalTasks: [
                '附加任务1',
                '附加任务2',
                '附加任务3',
                '附加任务4',
                '附加任务5',
                '附加任务6',
                '附加任务7',
                '附加任务8',
                '附加任务9',
                '附加任务10'
            ]
        }
    },
    methods: {
        handleBtn (index) {
            this.changeIndex = index + 1
        },
        handleBtnScenes (index) {
            this.changeIndexScenes = index + 1
        },
        selectCompany () {
            console.log(123)
        }
    },
}
</script>

<style lang="scss" scoped>
.ivu-divider-horizontal{
    margin: 10px 0;
}
.title {
    font-size: $font-size-base;
    font-weight: bold;
    padding: 20px 0 10px 0;
}
/* 修改展开记录公共样式 */
    .collapse {
        background: #fff;
        max-height: 500px;
        overflow-y: auto;
        .collapse-head {
            padding-top: 10px;
            span {
                font-size:20px;
                font-family:Microsoft YaHei;
                font-weight:400;
                &:last-child{
                    float: right;
                    margin-right: 30px;
                    font-size: 10px;
                }
            }
            .icon {
                width: 100px;
                height: 17px;
            }
        }
        .ivu-collapse {
            border: none;
            background-color: #fff;
            .ivu-collapse-item {
                background-color: #fff6e5;
                border: none;
                margin-bottom: 10px;
                /deep/.ivu-collapse-header {
                    border: 0;
                    font-size: 14px;
                    height: 60px;
                    /deep/.ivu-icon-ios-arrow-forward {
                        position: absolute;
                        right: 0;
                        top: 38%;
                    }
                }
                /deep/.ivu-collapse-content {
                    background-color: $filling-color;
                }
            }
        }
    }

// 选择服务商
.service-provider {
    padding: 4px 0;
    .service-provider-title {
        & :first-child{
            font-size: $font-size-large;
            font-weight: bold;
            color: $main-font-color;
        }
        & :last-child{
            float: right;
            margin-right: 30px;
            cursor: pointer;
        }
    }
    .service-provider-company{
        margin: 10px 30px 0 0;
        padding: 10px 0 10px 20px;
        background-color: white;
        p {
            padding: 10px 0;
            cursor: pointer;
        }
        .price {
            margin-left: 10px;
        }
        .time {
            margin-left: 20px;
        }
    }
}
// 产品详情
.product {
    padding: 4px 0;
    .product-title {
        font-size: $font-size-large;
        font-weight: bold;
        color: $main-font-color;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid $border-color;
    }
}
</style>