<template>
    <div class="add-product">
        <Row>
            <Col span="12">
                <div class="choose-type">
                    产品编号：{{ productData.serverCode }}
                </div>
            </Col>
            <!-- <Col span="12" style="text-align: right;">
                <Button @click="edit()">编辑</Button>
            </Col> -->
        </Row>
        <div class="white-bg">
            <!-- 运输详情 -->
            <div v-if="type === 'transport'" class="add-site add-site-detail">
                <Row class="display-line" style="margin-top: 0;">
                    <Col span="3">
                        <div class="name">路段展示:</div>
                    </Col>
                    <Col span="21" class="line">
                        {{ productData.departurePortTranslate && productData.departurePortTranslate.split(';').join('') }}
                        <svg class="iconfont arrow" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_jiantou" />
                        </svg>
                        {{ productData.destinationPortTranslate && productData.destinationPortTranslate.split(';').join('') }}
                    </Col>
                </Row>
                <Row class="parameter">
                    <Col span="3">
                        <div class="name">参数:</div>
                    </Col>
                    <Col span="21">
                        <Row>
                            <Col span="5">
                                运输方式：{{ productData.trspModeTranslate }}
                            </Col>
                            <Col span="5">
                                运输类型：{{ productData.trspTypeTranslate }}
                            </Col>
                            <Col span="5">
                                物流类型：{{ productData.logisticsTypeTranslate }}
                            </Col>
                            <Col span="5">
                                集装箱来源：{{ productData.contaSourceTranslate }}
                            </Col>
                            <Col span="5" style="margin-top: 16px;">
                                货物类型：{{ productData.cargoTypeTranslate }}
                            </Col>
                            <Col span="5" style="margin-top: 16px;">
                                集装箱尺寸类型：{{ productData.contaSizeTypeTranslate }}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <!-- 场所详情 -->
            <div v-if="type === 'site'" class="add-site add-site-detail">
                <Row>
                    <Col span="3">
                        <div class="name">场所：</div>
                    </Col>
                    <Col span="5">
                        国家城市：{{ productData.sttnCodeTranslate && productData.sttnCodeTranslate.split(';').slice(0, productData.sttnCodeTranslate.split(';').length - 1).join('') }}
                    </Col>
                    <Col span="5">
                        场所名称：{{ productData.sttnCodeTranslate && productData.sttnCodeTranslate.split(';').pop() }}
                    </Col>
                </Row>
                <Row class="parameter">
                    <Col span="3">
                        <div class="name">参数:</div>
                    </Col>
                    <Col span="5">
                        运输类型：{{ productData.trspTypeTranslate }}
                    </Col>
                    <Col span="5">
                        物流类型：{{ productData.logisticsTypeTranslate }}
                    </Col>
                </Row>
            </div>
            <!-- 关务详情 -->
            <div v-if="type === 'customs'" class="add-site add-site-detail">
                <Row>
                    <Col span="4">
                        报关类型：进口报关
                    </Col>
                    <Col span="4">
                        国家地区：中国
                    </Col>
                    <Col span="4">
                        城市：重庆
                    </Col>
                </Row>
                <div v-show="gqShow" class="gq gq-detail">
                    <span v-for="(item, index) in 20" :key="index">item</span>
                </div>
            </div>
            <!-- 综保区详情 -->
            <div v-if="type === 'cpa'" class="add-site add-site-detail">
                <Row>
                    <Col span="4">
                        国家地区：中国
                    </Col>
                    <Col span="10">
                        综保区名称：重庆两江综保区
                    </Col>
                </Row>
            </div>
        </div>
        <div class="func-btns">
            <Button @click="viewWaitTime">查看等待时长</Button>
            <Button v-if="$route.query.type==='transport'" @click="viewSchedule">查看班期</Button>
        </div>
        <div :class="['white-bg', 'middle-white-bg', { 'transport-white-bg': type === 'transport', 'site-white-bg': type === 'site' }]">
            <div class="product-list">
                <div class="product-content only-one" v-if="productData">
                    <div :class="['scene-btns', { spread: isSceneSpread }]">
                        <adt-tab-btns
                            class="scene-tab"
                            :titleNames="sceneTitleNames"
                            :isSmallBtn="true"
                            :btnIndex="sceneTabIndex"
                            @handleBtn="handleSceneBtn"
                        />
                        <div class="show-all-scene" @click="isSceneSpread = !isSceneSpread">
                            {{ `${!isSceneSpread ? '展开' : '收起'}所有 >` }}
                        </div>
                    </div>
                    <adt-tab-btns
                        class="task-tab"
                        :titleNames="titleNames"
                        :isUnderline="true"
                        :btnIndex="tabIndex"
                        :width="250"
                        :height="40"
                        @handleBtn="handleBtn"
                    />
                    <div class="scene-wait-time">等待时长：{{productData.sceneQueryRes[sceneTabIndex - 1].baseTaskQueryRes[0].waitTime}} {{productData.sceneQueryRes[sceneTabIndex - 1].baseTaskQueryRes[0].waitTimeUnit === 'H' ? '小时' : '天'}}</div>
                    <div v-show="isBasicTask" class="basic-item">
                        <Row class="item-container">
                            <Col class="item" span="10">
                                基础服务总费用：{{ productData.sceneQueryRes[sceneTabIndex - 1].baseTaskQueryRes[0].taskCost }}{{ productData.sceneQueryRes[sceneTabIndex - 1].baseTaskQueryRes[0].currTranslate }}/{{ productData.sceneQueryRes[sceneTabIndex - 1].baseTaskQueryRes[0].standarUnit }}
                            </Col>
                            <Col class="item" span="14">
                                基础服务总时长：{{ productData.sceneQueryRes[sceneTabIndex - 1].baseTaskQueryRes[0].serverDuration }} {{ productData.sceneQueryRes[sceneTabIndex - 1].baseTaskQueryRes[0].serverDurationUnitTranslate }}
                            </Col>
                        </Row>
                        <adt-task-content
                            :basicTask="productData.sceneQueryRes[sceneTabIndex - 1].baseTaskQueryRes"
                            :isAdditionalTasks="false"
                            :showPriceAndTime="false"
                        />
                    </div>
                    <div v-show="!isBasicTask" class="additional-item">
                        <h6>附加任务内容:</h6>
                        <div class="task-container task-container-detail">
                            <!-- 详情可以一行放2个 -->
                            <div v-for="(additionalTask, key) in productData.sceneQueryRes[sceneTabIndex - 1].affixTaskQueryRes" :key="key" class="task-item">
                                <div class="task-name">{{ additionalTask.taskName }}</div>
                                <div class="cost">
                                    费用：{{ additionalTask.taskCost }}{{ additionalTask.currTranslate }}/{{ (productData.trspType === 'C' || productData.trspType === '集装箱')  ? 'TEU' : 'KG' }}
                                </div>
                                <div class="time">
                                    时长：{{ additionalTask.serverDuration }}{{ additionalTask.serverDurationUnitTranslate }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="public-component-line thin-line"></div>
                    <Row class="set-dead-line">
                        <Col span="10">
                            产品起止日期：
                            {{ timestampFormat(productData.serverStartTime) }}
                            --
                            {{ timestampFormat(productData.serverEndTime) }}
                        </Col>
                        <Col span="14">
                            产品报价截止时间前
                            <span style="display: inline-block; margin: 0 16px;">
                                {{ productData.serverRemindDuration }}
                            </span>
                            天开始提醒
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        <!-- 查看班期弹窗 -->
        <Drawer
            :mask-closable="true"
            v-model="showScheduleModal"
            width="1100"
            :closable="true"
            class="schedule-modal"
        >
            <h3>查看班期</h3>
            <Collapse v-if="productData.serverSchedules && productData.serverSchedules.length" v-model="setScheduleIndex">
                <Panel v-for="(item,index) in productData.serverSchedules" :key="index" :name="index+''">
                    序号：{{item.scheduleCode}}
                    <div class="schedule-modal-item" slot="content">
                        <div class="item-title">
                            <h4>服务周期时间</h4>
                            <div>
                                <span>停靠时间：{{item.stopTheTime | secToDate}}</span>
                                <span>接货时间：{{item.pickGoodsTime | secToDate}}</span>
                                <span>驶离时间：{{item.departureDatetime | secToDate}}</span>
                                <span>运抵时间：{{item.shipDatetime | secToDate}}</span>
                            </div>
                            <div>
                                <span>运输工具号：{{item.trspToolName}}</span>
                                <span>航次：{{item.meansNum}}</span>
                                <span>运输时效：{{item.transportTime}}{{item.transportTimeUnit==='H' ? '小时' : '天'}}</span>
                            </div>
                        </div>
                        <div class="item-title">
                            <h4>截止时间</h4>
                            <div>
                                <span>截关时间：离港前{{item.letDeclareDatetime}}{{item.letDeclareDatetimeUnit==='H' ? '小时' : '天'}}</span>
                                <span>截港时间：离港前{{item.letApproachDatetime}}{{item.letApproachDatetimeUnit==='H' ? '小时' : '天'}}</span>
                                <span>截单时间：离港前{{item.letBillDatetime}}{{item.letBillDatetimeUnit==='H' ? '小时' : '天'}}</span>
                                <span>截VGM时间：离港前{{item.letPassDatetime}}{{item.letPassDatetimeUnit==='H' ? '小时' : '天'}}</span>
                            </div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </Drawer>
        <!-- 查看等待时长弹窗 -->
        <adt-my-modal
            :showModal="showItemModal"
            title="系统提示"
            width="430px"
            @on-visible-change="waitModalChange"
            @on-ok="showItemModal = false"
        >
            <div>
                等待时长: {{productData.waitTime}} {{productData.waitTimeUnit === 'H' ? '小时' : '天'}}
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
    import AdtTaskContent from '@/components/adt-task-content/Index'
    import { apiTransportQueryDetail, apiStationQueryDetail } from '@/api/productEditor' // eslint-disable-line
    import { timestampFormat, dateToString } from '@/libs/utils'
    export default {
        components: {
            AdtTaskContent
        },
        props: ['type', 'serverCode'],
        data () {
            return {
                isModalShow: false,
                isSceneModalShow: false,
                sceneTabIndex: 1,
                tabIndex: 1,
                sceneTitleNames: [],
                titleNames: ['基础任务费用时长', '附加任务费用时长'],
                gqShow: true,
                isBasicTask: true,
                // 展开所有场景
                isSceneSpread: false,
                productData: '',
                showScheduleModal: false,
                setScheduleIndex: '-1',
                showItemModal: false
            }
        },
        created () {
            this.getData()
        },
        methods: {
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp, true)
            },
            getData () {
                if (this.type === 'transport') {}
                switch (this.type) {
                    case 'transport':
                        apiTransportQueryDetail({ serverCode: this.serverCode }).then(({ data }) => {
                            this.productData = data
                            for (const scene of this.productData.sceneQueryRes) {
                                this.sceneTitleNames.push(scene.sceneName)
                            }
                        })
                        break
                    case 'site':
                        apiStationQueryDetail({ serverCode: this.serverCode }).then(({ data }) => {
                            this.productData = data
                            for (const scene of this.productData.sceneQueryRes) {
                                this.sceneTitleNames.push(scene.sceneName)
                            }
                        })
                }
            },
            handleSceneBtn (index) {
                this.sceneTabIndex = index + 1
            },
            handleBtn (index) {
                this.tabIndex = index + 1
                // 基础任务
                if (index === 0) {
                    this.isBasicTask = true
                } else {
                    // 附加任务
                    this.isBasicTask = false
                }
            },
            edit () {
                this.$router.push(`/product-editor/edit-product?type=${this.type}`)
            },
            //查看班期
            viewSchedule () {
                this.showScheduleModal = true
            },
            viewWaitTime () { //查看等待时长
                this.showItemModal = true
            },
            waitModalChange (val) {
                this.showItemModal = val
            }
        },
        filters: {
            secToDate: function(value) {
                return dateToString(value);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './style.scss';
    .add-product {
        .func-btns {
            display: flex;
            justify-content: flex-end;
            margin: 12px 0 0;
            >button {
                margin: 0 10px 0 0;
            }
        }
        .scene-wait-time {
            line-height: 50px;
            height: 50px;
            border-bottom: 1px dotted #C8C8C8;
        }
    }
    .schedule-modal {
        /deep/ .ivu-drawer-close {
            top: 40px;
            right: 70px;
        }
        .schedule-modal-item {
            padding-top:48px;
            >.item-title:nth-last-child(1) {
                height: 60px;
            }
        }
        /deep/ .ivu-collapse {
            background-color: #fff;
        }
        /deep/ .ivu-collapse-item {
            border: none;
            margin: 30px 0 0;
        }
        /deep/ .ivu-collapse {
            border: none;
            .ivu-collapse-header {
                background-color: #FFF6E5;
                border: none;
                .ivu-icon {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                }
            }
            .ivu-collapse-content {
                padding: 0;
                .ivu-collapse-content-box {
                    padding: 0;
                }
            }
        }
        .item-title {
            position: relative;
            >h4 {
                position: absolute;
                top: -10px;
                left: 0;
                background: #fff;
            }
            >div {
                border-top:1px solid #D7D8DF;     
                color: #303548;
                line-height: 90px;
                >span {
                    display: inline-block;
                    width: 25%;
                }
            }
        }
    }
</style>
