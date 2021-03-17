<template>
    <div class="client-plan">
        <div class="topbar">
            <span class="title">物流全程计划</span>
            <span class="code">物流委托编号：{{ data.executoryEntrustCode }}</span>
            <p v-if="showBtn" class="button">
                <Button class="" @click="disagreeClick">不同意计划</Button>
                <Button type="primary" @click="agreeClick">同意计划</Button>
            </p>
            <!-- 路线展示 -->
            <div class="path-info">
                <ul class="path-data">
                    <li v-for="(item,key) of data.routeList" :key="key">
                        <span class="path">{{ item.departurePortTranslate }}</span>
                        <svg v-if="item.trspMode != '3'" class="icon icon-train" aria-hidden="true">
                            <use v-if="item.trspMode === '4'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_huoche" />
                            <use v-if="item.trspMode === '1'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_lunchuan" />
                            <use v-if="item.trspMode === '2'" fill="#FFBB32" xlink:href="#icon-feiji800" />
                        </svg>
                         <svg v-if="item.trspMode === '3'" class="icon icon-train icon-car" aria-hidden="true">
                             <use fill="#FFBB32" xlink:href="#icon-huoche" />
                         </svg>
                        <small>{{ item.logisticsTypeTranslate }}</small>
                        <svg class="iconfont icon-arrows" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_jiantou" />
                        </svg>
                        <template v-if="key === data.routeList.length - 1">
                            <span class="path last-path">{{ item.destinationPortTranslate }}</span>
                        </template>
                    </li>
                </ul>
                <ul class="time-data">
                    <p class="plan-title">计划时间：</p>
                    <li v-for="(item,key) of data.routeList" :key="key">
                        <span v-if="key == 0"><small>始</small>{{ timestampFormat(item.routeList[0].predctStartTime) }}</span>
                        <span v-if="key != 0"><small>起</small>{{ timestampFormat(item.routeList[0].predctStartTime) }}</span>
                        <span v-if="key != 0"><small>离</small>{{ timestampFormat(item.routeList[0].predctEndTime) }}</span>
                        <template v-if="key === data.routeList.length - 1">
                            <span><small>终</small>{{ timestampFormat(item.routeList[0].predctEndTime) }}</span>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
        <adt-my-modal
            width="575px"
            :title="title"
            :showModal="showModal"
            @on-visible-change="visibleChange"
            @on-ok="handleConfirm"
            @on-cancel="handleCancel"
        >
            <p class="slot-content" style="margin: 0 60px">
                <span style="color: #666">填写驳回原因</span>
                <Input v-model="dismissReason" type="textarea" maxlength="500" :autosize="{minRows: 3,maxRows: 3}" />
            </p>
        </adt-my-modal>
    </div>
</template>
<script>
import { timestampFormat } from '@/libs/utils'
import { apiConfirmPlan, apiRouteDetail } from '@/api/logisticsWholeJourneyPlan'
export default {
    props: {
        entrustCode: '',
        entrustExecutoryStatus: '',
        planCode: ''
    },
    data () {
        return {
            title: '不同意计划原因备注',
            showModal: false,
            data: {},
            dismissReason: '',
            showBtn: true
        }
    },
    mounted () {
        this.getData()
        // 如果是未确认的话显示同意和不同意按钮
        if (this.entrustExecutoryStatus === 'UNCONFIRM') {
            this.showBtn = true
        } else {
            this.showBtn = false
        }
    },
    methods: {
        // 初始化数据
        getData () {
            apiRouteDetail({ code: this.planCode }).then(res => {
                this.data = res.data
            })
        },
        // 格式化时间
        timestampFormat (timeStamp) {
            return timestampFormat (timeStamp)
        },
        // 模态框显示隐藏状态发生改变
        visibleChange (changeStatus) {
            this.isShowModal = changeStatus
        },
        // 点击不同意按钮
        disagreeClick () {
            this.showModal = true
        },
        // 点击同意
        agreeClick () {
            let data = {
                disagreeReason: '',
                executoryEntrustCode: this.data.executoryEntrustCode,
                logisticsSchemeCode: this.data.logisticsSchemeCode,
                planCode: this.data.planCode,
                planConfirm: 'Y'
            }
            apiConfirmPlan({ data }).then(res => {
                if (res.code === '200') {
                    this.$Message.success(res.message)
                    this.showBtn = false
                }
            })
        },
        // 不同意计划备注
        handleConfirm () {
            let data = {
                disagreeReason: this.dismissReason,
                executoryEntrustCode: this.data.executoryEntrustCode,
                logisticsSchemeCode: this.data.logisticsSchemeCode,
                planCode: this.data.planCode,
                planConfirm: 'N'
            }
            apiConfirmPlan({ data }).then(res => {
                if (res.code === '200') {
                    this.$Message.success(res.message)
                    this.showModal = false
                    this.showBtn = false
                }
            })
        },
        // 不同意弹框取消
        handleCancel () {
            this.showModal = false
            this.dismissReason = ''
        }
    }
}
</script>

<style lang="scss" scoped>
    .time-data {
        overflow-x: auto;
        white-space: nowrap;
        @extend %scrollbar-crosswise;
        .plan-title {
            display: inline-block;
            color: #333;
            font-weight: bold;
            line-height: 1.6;
            vertical-align: top;
        }
        li {
            position: relative;
            display: inline-block;
            width: 240px;
            line-height: 1.5;
            vertical-align: top;
            span {
                display: block;
                small {
                    margin-right: 2px;
                    padding: 0 2px;
                    border: 1px solid #999;
                    border-radius: 50%;
                }
            }
            &:last-child {
                width: 350px;
                span:last-child {
                    position: relative;
                    left: 200px;
                    top: -20px;
                    vertical-align: top;
                }
            }
        }
    }
    .client-plan {
        .topbar {
            color: #333;
            line-height: 3;
            .title {
                display: inline-block;
                font-size: 16px;
                margin-left: 50px;
                line-height: 3.5;
            }
            .code {
                font-size: 16px;
            }
            .code {
                margin-left: 60px;
            }
        }
        .button {
            float: right;
            margin-right: 60px;
            .ivu-btn-default {
                margin-right: 20px;
            }
        }
        .path-info {
            background: #ffffff;
            padding: 20px;
            padding-bottom: 0;
            .path-data {
                margin-bottom: 12px;
                padding: 0 70px;
                overflow-x: auto;
                background: #f9f9f9;
                white-space: nowrap;
                @extend %scrollbar-crosswise;
                li {
                    display: inline-block;
                    vertical-align: middle;
                    .path {
                        display: inline-block;
                        // width: 120px;
                        margin: 0 10px;
                        text-align: center;
                        vertical-align: middle;
                    }
                    .icon-train {
                        width: 22px;
                        height: 20px;
                        color: $warning-color;
                        margin: 0 4px;
                        vertical-align: middle;
                    }
                    .icon-car {
                        transform: rotateY(180deg);
                    }
                    small {
                        color: $light-color;
                    }
                    .icon-arrows {
                        width: 76px;
                        color: $light-color;
                    }
                    &:first-child {
                        .path {
                            font-size: 20px;
                            font-weight: bold;
                            text-align: left;
                        }
                    }
                    &:last-child {
                        .last-path{
                            font-size: 20px;
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
</style>
