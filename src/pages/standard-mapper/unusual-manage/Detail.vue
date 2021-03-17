<template>
    <div>
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="6">
                        <div class="name">异常名称：</div>
                        <div class="content">{{ unusualData.label }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">异常编号：</div>
                        <div class="content">{{ unusualData.name }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">审核状态：</div>
                        <div class="content">{{ unusualData.examineStatus }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">启用状态：</div>
                        <div class="content">{{ unusualData.useStatus }}</div>
                    </Col>
                </Row>
            </div>
            <div class="normal-info-table">
                <div class="table">
                    <div class="cell">
                        <div class="cell-name">适用场景：</div>
                        <div class="cell-content">{{ unusualData.maxLength }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建人：</div>
                        <div class="cell-content">{{ unusualData.itemType }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核人：</div>
                        <div class="cell-content">{{ unusualData.controlType }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">异常处理方式：</div>
                        <div class="cell-content">{{ unusualData.source }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建时间：</div>
                        <div class="cell-content">{{ unusualData.sourceValue }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核时间：</div>
                        <div class="cell-content">{{ unusualData.dataType }}</div>
                    </div>
                </div>
                <div class="compare-data">
                    <title>异常比对数据：</title>
                    <div class="data-container">
                        <div class="data">
                            <div class="data-item">
                                异常数据源：物流全程计划
                            </div>
                            <div class="data-item">
                                数据显示名称：XXXX数据1
                            </div>
                        </div>
                        <div class="condition">
                            <!-- 大于 -->
                            <svg v-if="1" class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_dayu" />
                            </svg>
                            <!-- 小于 -->
                            <svg v-if="0" class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_xiaoyu" />
                            </svg>
                            <!-- 大于等于 -->
                            <svg v-if="0" class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_dayudengyu" />
                            </svg>
                            <!-- 小于等于 -->
                            <svg v-if="0" class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_dayuxiaoyu" />
                            </svg>
                            <!-- 等于 -->
                            <svg v-if="0" class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_dengyu" />
                            </svg>
                            <!-- 不等于 -->
                            <svg v-if="0" class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_budengyu" />
                            </svg>
                        </div>
                        <div class="data">
                            <div class="data-item">
                                异常数据源：物流全程计划
                            </div>
                            <div class="data-item">
                                数据显示名称：XXXX数据1
                            </div>
                        </div>
                    </div>
                </div>
                <div class="contact-scene">
                    <div class="box">
                        <title>异常处理关联场景：</title>
                        <div class="scenes">
                           <div v-for="(item, index) in scenes" :key="index" class="scene">
                               {{ item }}
                           </div>
                        </div>
                    </div>
                    <Button type="primary" size="small" @click="showUnusualContent">异常通知内容</Button>
                </div>
                <div class="item">
                    <div class="item-name" style="font-size: 16px;">备注规则：</div>
                    <div class="item-content">{{ unusualData.note }}</div>
                </div>
            </div>
        </div>
        <!-- <div class="public-modify-record">
            <h3 class="table-title">修改记录</h3>
            <div class="collapse">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <Row>
                            <Col span="4">
                                时间：2020/06/16
                            </Col>
                            <Col span="6">
                                修改人：刘笑笑
                            </Col>
                            <Col span="14">修改内容</Col>
                        </Row>
                        <div slot="content">
                            <div class="content">
                                <ul class="record-list">
                                    <li>
                                        <div class="modify-name">修改数据类型：</div>
                                        <div class="before-content"><span class="icon">前</span>字符串</div>
                                        <div class="after-content"><span class="icon">后</span>字符串</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </div> -->
        <!-- 异常通知内容modal -->
        <adt-my-modal
            :showModal="isModalShow"
            :showBtn="false"
            title="异常通知内容"
            width="680"
            @on-visible-change="visibleChange"
            @on-ok="handleOk()"
            @on-cancel="handleCancel()"
        >
            <div class="unusual-content">
                <div class="scenes-container">
                    <title>异常处理关联场景：</title>
                    <div class="scenes">
                        <div
                            v-for="(item, index) in scenes"
                            :key="index"
                            :class="['scene', { active: activeIndex === index }]"
                            @click="chooseScene(index)"
                        >
                            {{ item }}
                        </div>
                    </div>
                </div>
                <div class="icon">
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_zhi" />
                    </svg>
                </div>
                <div class="content-container">
                    <title>通知内容：</title>
                    <div class="content">
                        {{ content }}
                    </div>
                </div>
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
    import { apiTemplateDataQueryDetail } from '@/api/standard-mapper/dataItemManage'
    import { timestampFormat } from '@/libs/utils'
    export default {
        name: 'item-details',
        props: {
            name: ''
        },
        data () {
            return {
                unusualData: {},
                scenes: ['场景1', '场景2', '场景2'],
                activeIndex: -1,
                content: '出入口异常    出入口异常    出入口异常 出入口异常    出入口异常    出入口异常 出入口异常    出入口',
                isModalShow: false
            }
        },
        created () {
            this.getData()
        },
        methods: {
            visibleChange (changeStatus) {
                this.isModalShow = changeStatus
            },
            showUnusualContent () {
                this.isModalShow = true
            },
            chooseScene (index) {
                this.activeIndex = index
                this.content = 'fsdfsd'
            },
            handleOk () {
                this.isModalShow = false
                this.activeIndex = -1
                this.content = ''
            },
            handleCancel () {
                this.isModalShow = false
                this.activeIndex = -1
                this.content = ''
            },
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp)
            },
            // 获取详情数据
            getData () {
                apiTemplateDataQueryDetail({ name: this.name }).then(({ data }) => {
                    this.unusualData = data
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    title {
        display: block;
        font-size: $font-size-large;
    }
    .compare-data {
        margin-top: 20px;
        padding: 20px 0;
        border-top: 2px dashed $border-color;
        border-bottom: 2px dashed $border-color;
        title {
            margin-bottom: 20px;
        }
        .data-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 40px;
            .data {
                display: flex;
                align-items: center;
                width: 42%;
                height: 100%;
                padding-left: 10px;
                background-color: $filling-color;
                .data-item {
                    margin-left: 30px;
                }
            }
            .condition {
                width: 16%;
                color: $border-color;
                text-align: center;
                .iconfont {
                    font-size: 40px;
                }
            }
        }
    }
    .contact-scene {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 15px 0;
        border-bottom: 2px dashed $border-color;
        .box {
            display: flex;
            align-items: center;
            .scenes {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin-left: 10px;
                .scene {
                    height: 24px;
                    line-height: 24px;
                    margin: 5px 0 5px 20px;
                    padding: 0 35px;
                    background-color: $filling-color;
                    border-radius: 4px;
                }
            }
        }
    }
    .unusual-content {
        display: flex;
        align-items: center;
        title {
            margin-bottom: 20px;
            font-size: $font-size-base;
        }
        .scenes {
            width: 210px;
            height: 180px;
            padding-top: 30px;
            overflow-y: auto;
            background-color: $filling-color;
            .scene {
                width: 100px;
                height: 24px;
                margin: 0 0 20px 55px;
                line-height: 24px;
                text-align: center;
                color: $conventional-font-color;
                background-color: $border-color;
                border: 1px solid $border-color;
                border-radius: 4px;
                cursor: pointer;
                &.active {
                    color: $main-font-color;
                    font-weight: bold;
                    border-color: $light-color;
                }
            }
        }
        .icon {
            width: 128px;
            margin-top: 20px;
            text-align: center;
            .iconfont {
                font-size: 40px;
                color: #ccc;
            }
        }
        .content {
            width: 310px;
            height: 180px;
            padding: 30px;
            overflow-y: auto;
            background-color: $filling-color;
        }
    }
</style>
