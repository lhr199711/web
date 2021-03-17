<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>{{ title }}</h3>
            <div class="sender-info">
                <div v-if="scheduleList[1]">
                    <Collapse class="collapse" v-model="collapseValue" accordion>
                        <Panel
                            v-for="( listData, index ) in scheduleList"
                            :key="index"
                            :name="(index + 1).toString()"
                            style="margin-bottom: 20px;"
                        >
                            <div class="title">序号：{{ listData.scheduleCode }}</div>
                            <template slot="content">
                                <div>
                                    <div class="subtitle">
                                        <div class="subtitle-font">服务时间轴</div>
                                        <div class="subtitle-line"></div>
                                    </div>
                                    <Row>
                                        <Col class="collapse-font" span="6">停靠时间：{{ listData.stopTheTime }}</Col>
                                        <Col class="collapse-font" span="6">接货时间：{{ listData.pickGoodsTime }}</Col>
                                        <Col class="collapse-font" span="6">驶离时间：{{ listData.departureDatetime }}</Col>
                                        <Col class="collapse-font" span="6">运抵时间：{{ listData.shipDatetime }}</Col>
                                    </Row>
                                    <Divider />
                                    <Row>
                                        <Col class="collapse-font" span="6">运输工具名称：{{ listData.trspToolName }}</Col>
                                        <Col class="collapse-font" span="6">航次：{{ listData.meansNum }}</Col>
                                        <Col class="collapse-font" span="6">运输时效：{{ listData.transportTime }}</Col>
                                    </Row>
                                </div>
                                <div>
                                    <div class="subtitle">
                                        <div class="subtitle-font">截止时间</div>
                                        <div class="subtitle-line"></div>
                                    </div>
                                    <Row>
                                        <Col class="collapse-font" span="6">截关时间：离港前{{ listData.letDeclareDatetime }}天</Col>
                                        <Col class="collapse-font" span="6">截港时间：离港前{{ listData.letApproachDatetime }}天</Col>
                                        <Col class="collapse-font" span="6">截单时间：离港前{{ listData.letBillDatetime }}天</Col>
                                        <Col class="collapse-font" span="6">截VGM时间：离港前{{ listData.letPassDatetime }}天</Col>
                                    </Row>
                                </div>
                            </template>
                        </Panel>
                    </Collapse>
                </div>
                <div v-if="timeList[1]">
                    <div class="time-tabs">
                        <div class="subtitle">
                            <div class="subtitle-font">作业时间范围</div>
                            <div class="subtitle-line"></div>
                        </div>
                        <adt-tab-btns
                            class="tab-work"
                            :isSmallBtn="true"
                            :titleNames="titleNames"
                            :btnIndex="changeIndex"
                            :width='80'
                            @handleBtn="handleBtn"
                        />
                        <hr size=1 style="border-style:dashed; margin: 20px 0; color: #E5E5E5">
                        <div v-for="(time, id) in timeList" :key="id">
                            <span v-show="changeIndex === id + 1">
                                {{ time.workShift }} - {{ time.workOff }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script>
    export default {
        name: 'DrawerModel',
        props: {
            showDrawer: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '标题'
            },
            scheduleList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            workTimeList: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                isShowDrawer: false,
                // 折叠面板默认展开序号
                collapseValue: '0',
                // 时间tab切换
                titleNames: [],
                changeIndex: 1,
                timeList: []
            }
        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                },
                immediate: true
            },
            workTimeList (newData) {
                this.timeList = newData
                this.handleData()
            }
        },
        methods: {
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            },
            // 点击tab切换
            handleBtn (index) {
                this.changeIndex = index + 1
            },
            // 处理时间数据
            handleData () {
                if (this.timeList.length > 0) {
                    this.titleNames = []
                    this.timeList.map(item => {
                        this.titleNames.push(item.cycle)
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .collapse {
        background: #fff;
        max-height: 500px;
        border: 1px solid white;
        overflow-y: auto;
        overflow-x: hidden;
        /deep/ .ivu-collapse-header {
            height: 40px;
            padding-left: 0;
            background-color: #FFF6E5;
            border-bottom: 1px solid white;
            /deep/ i {
                float: right;
                line-height: 45px;
            }
        }
        .title {
            margin-left: 10px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #333333;
        }
        .subtitle {
            display: flex;
            margin: 30px 0;
            .subtitle-font {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #303548;
            }
            .subtitle-line {
                height: 1px;
                background: #D7D8DF;
                width: 90%;
                margin-top: 12px;
            }
        }
        .collapse-font {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #303548;
        }
    }
    .time-tabs {
        .subtitle {
            display: flex;
            margin: 25px 0;
            .subtitle-font {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #303548;
            }
            .subtitle-line {
                height: 1px;
                background: #D7D8DF;
                width: 88%;
                margin-top: 12px;
            }
        }
    }
</style>