<template>
    <div>
        <!-- 方案基本信息 -->
        <div class="program">
            <p class="title">方案基本信息</p>
            <Button class="program-confirm" type="primary" @click="confirmPlan">确认方案</Button>
        </div>
        <AdtSchemeInformationRoute :logistics="logistics">
            <template slot="price">
                <Row>
                    <Col span="12">价格区间：{{}}</Col>
                    <Col span="12">时长区间：{{}}</Col>
                </Row>
            </template>
            <template slot="service">
                <!-- 选择代理服务 -->
                <div class="service">
                    <p>
                        <span class="title">选择代理服务:</span>
                        <span>（没有可选代理服务请联系我们）</span>
                    </p>
                    <Row>
                        <CheckboxGroup v-model="agencyService">
                            <Col span="8" class="service-proxy">
                                <Checkbox label="代理服务1">
                                    <span>代理服务</span>
                                    <span>
                                        费用：<Input type="text" />
                                    </span>
                                    <span class="service-price">元</span>
                                </Checkbox>
                            </Col>
                            <Col span="8" class="service-proxy">
                                <Checkbox label="代理服务2">
                                    <span>代理服务</span>
                                    <span>
                                        费用：<Input type="text" />
                                    </span>
                                    <span>元</span>
                                </Checkbox>
                            </Col>
                            <Col span="8" class="service-proxy">
                                <Checkbox label="代理服务3">
                                    <span>代理服务</span>
                                    <span>
                                        费用：<Input type="text" />
                                    </span>
                                    <span>元</span>
                                </Checkbox>
                            </Col>
                        </CheckboxGroup>
                    </Row>
                </div>
                <!-- 汇率及方案 -->
                <Row class="program">
                    <Col span="16">
                        <span class="title">结算汇率:</span>
                        <RadioGroup class="program-settlement" v-model="exchangeRate">
                            <!-- <Row>
                                <Col span="8"> -->
                                    <Radio label="金斑蝶">非固有汇率</Radio>
                                <!-- </Col>
                                <Col span="16"> -->
                                    <Radio class="program-inherent" label="爪哇犀牛">
                                        <span>固有汇率</span>
                                        <Input type="text" />
                                    </Radio>
                                <!-- </Col>
                            </Row> -->
                        </RadioGroup>
                    </Col>
                    <Col span="8">
                        <span class="title">方案截止前几天提醒：</span>
                        <Select v-model="selectTime" style="width:185px">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
            </template>
        </AdtSchemeInformationRoute>
        <!-- 产品服务信息 -->
        <p class="title">产品服务信息</p>
        <Card>
            <adt-tab-btns :height="40" :width="200" :isUnderline="true" :titleNames="titleNames" :btnIndex="changeIndex" @handleBtn="handleBtn">
                <Divider />
            </adt-tab-btns>
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
                                        <div style="margin-bottom: 10px;">
                                            <Checkbox
                                                :indeterminate="indeterminate"
                                                :value="checkAll"
                                                @click.prevent.native="handleCheckAll">全选</Checkbox>
                                        </div>
                                        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                            <Checkbox :class="{'service-select-click': num == id}" :label="serviceProvider.name" v-for="(serviceProvider, id) in showServiceProvider" :key="id">
                                                <p class="service-select" @click="selectCompany(id)">
                                                    <span>{{serviceProvider.name}}</span>
                                                    <span class="price">基础价格: {{serviceProvider.price}}</span>
                                                    <span class="time">时长: {{serviceProvider.time}}</span>
                                                    <div style="position: absolute;" :class="{'triangle': num == id}"></div>
                                                </p>
                                            </Checkbox>
                                        </CheckboxGroup>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}}</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                    </adt-tab-btns>
                                    <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                    <!-- 基础任务 -->
                                    <AdtTaskContent :basicTask="basicTask" :additionalTasks="additionalTasks" />
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
            showServiceProvider: [
                {name:'安道1', price: '200', time: '20'},
                {name:'安道2', price: '200', time: '20'},
                {name:'安道3', price: '200', time: '20'},
                {name:'安道4', price: '200', time: '20'},
                {name:'安道5', price: '200', time: '20'}
            ],  // 展示的服务商
            selectServiceProvider: [],  // 选择的服务商
            num: '默认值',
            value: '',
            agencyService: [],
            exchangeRate: '',
            selectTime: '',
            changeIndex: 1,
            checkAllGroup: [],
            titleNames: ['运输服务', '场所服务', '关务服务', '综保区服务'],
            titleNamesScenes: ['场景1', '场景2', '场景3'],
            changeIndexScenes: 1,
            indeterminate: false,
            checkAll: false,
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
            cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
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
        // 全选
        handleCheckAll () {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                // 将返回的服务商的名字提出来
                this.showServiceProvider.forEach(element => {
                    this.selectServiceProvider.push(element.name)
                })
                this.checkAllGroup = this.selectServiceProvider;
            } else {
                this.checkAllGroup = [];
            }
        },
        checkAllGroupChange (data) {
            if (data.length === this.showServiceProvider.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        selectCompany (id) {
            this.num = id
            console.log(123)
        },
        // 确认服务方案
        confirmPlan () {
            console.log('确认')
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
    width: 100%;
}
.program {
    display: flex;
}
// 确认方案按钮
.program-confirm {
    width: 128px;
    margin-top: 6px;
}
// 选择代理服务
.service {
    padding-bottom: 20px;
    border-bottom: 1px dashed $border-color;
    .service-proxy {
        margin-top: 10px;
        padding-left: 10px;
        // 修改输入框的长度
        .ivu-input-wrapper {
            width: 55%;
        }
    }
}

// 汇率及方案
.program {
    padding-top: 20px;
    .program-settlement {
        padding-left: 20px;
        font-size: $font-size-base;
        font-weight: bold;
        .program-inherent {
            display: inline-block;
            padding-left: 20px;
            // 修改输入框的长度
            .ivu-input-wrapper {
                padding-left: 5px;
                width: 75%;
            }
        }
    }
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
            margin-top: 3px;
            cursor: pointer;
        }
    }
    .service-provider-company{
        margin: 10px 30px 0 0;
        padding: 10px 0 10px 20px;
        background-color: white;
        .ivu-checkbox-group-item {
            width: 95%;
            position: relative;
            p {
                padding: 5px 0 5px 10px;
                cursor: pointer;
                display: inline-block;
            }
            .service-select {
                .price {
                    margin-left: 10px;
                }
                .time {
                    margin-left: 20px;
                }
            }
            &:hover {
                background-color: $filling-color;
            }
        }
        .service-select-click {
            background-color: $filling-color;
        }
        .triangle {
            position: absolute;
            right: -20px;
            top: 10px;
            width: 0; 
            height: 0;
            border-width: 5px;
            border-style: solid;
            border-color: $light-color transparent transparent transparent;
            transform: rotate(270deg)
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