<template>
    <div class="base-info">
        <div class="box">
            <div class="public-head">
                <h6>基本信息</h6>
                <svg class="iconfont" aria-hidden="true">
                    <use xlink:href="#icon-andaotongV3ICON_piliangxiangqing" />
                </svg>
                <div class="tip">
                    我们会根据您输入的启运地、中转地、目的地内容，通过“生成路线”按钮生成您需要的物流路线！
                </div>
            </div>
            <div class="info-container">
                <div class="items">
                    <div class="item">
                        <div class="name">
                            <div class="tag">*</div>
                            <span>启运地:</span>
                        </div>
                        <div class="content">
                            <adt-city-selector :defaultData="startDefault" @on-change="handelDirStart" />
                            <Select v-model="transitModal.custStartPlace" filterable clearable @on-change="onPlaceChange">
                                <Option v-for="item in custStartPlace" :value="item.value+'-'+item.label" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Button type="primary" size="small" @click="okPlace">确定</Button>
                            <div v-show="startHintShow" class="hint">请输入启运地</div>
                            <div class="selected-value">
                                <span v-for="(value, index) in startPlace" :key="index">{{ value }}<Icon type="ios-close-circle" @click="delPlaceDeparture(index)" /></span>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="name">
                            <div class="tag">*</div>
                            <span>目的地:</span>
                        </div>
                        <div class="content">
                            <adt-city-selector :defaultData="endDefault" @on-change="handelDirEnd" />
                                <Select v-model="transitModal.custEndPlace" filterable clearable @on-change="onEndPlaceChange">
                                    <Option v-for="item in custEndPlace" :value="item.value+'-'+item.label" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <Button type="primary" size="small" @click="okEndPlace">确定</Button>
                                <div class="hint" v-show="endHintShow">请输入目的地</div>
                                <div class="selected-value">
                                    <span v-for="(value, index) in endPlace" :key="index">{{ value }}<Icon type="ios-close-circle" @click="delCustEndPlace(index)" /></span>
                                </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="name">
                            <span>中转地:</span>
                        </div>
                        <div class="content">
                            <adt-city-selector :defaultData="ctransitDefault" @on-change="handelDirTrsspmPort" />
                            <Select v-model="transitModal.custTransitPlace" filterable clearable @on-change="onSiteChange">
                                <Option v-for="item in custTransitPlace" :value="item.value+'-'+item.label" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Button type="primary" size="small" @click="okCustTransitPlace">确定</Button>
                            <div class="selected-value">
                                <span v-for="(value, index) in ctransitPlace" :key="index">{{ value }}<Icon type="ios-close-circle" @click="delTransit(index)" /></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="generate-route-btn">
                    <Button @click="createPathClick()">生成路线</Button>
                </div>
            </div>
        </div>
        <adt-reconfirm-modal
            :showModal="isPlaceDepartureModal"
            :message="placeDepartureText"
            :cancelShow="false"
            @on-ok="isPlaceDepartureModal = false"
            @on-visible-change="visiblePlaceDeparture"
        />
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import freightRequestEntry from '@/mixins/freightRequestEntry'
    import { apiGenerateRoute } from '@/api/freightRequirement'
    export default {
        mixins: [freightRequestEntry],
        props: {
            defaultData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                // 基本信息的数据（复用笑笑以前做的页面）
                isPlaceDepartureModal: false,
                custStartPlace: [],
                custEndPlace: [],
                custTransitPlace: [],
                ctransitPlace: [],
                startPlace: [],
                endPlace: [],
                placeDepartureText: '',
                isStartPlaceModalShow: false,
                // 目的地目的地超过三个，继续添加
                addEndPlaceChange: false,
                isEndPlaceModalShow: false,
                // 是否是客户
                isClient: false,
                // 点击生成路线的路线值
                // 选择的路线展示在页面
                selectPathData: [],
                freightReqCode: '',
                freightReqStatus: '',
                sendShow: false,
                simpleEntryValue: {},
                startPlaceCode: [],
                endPlaceCode: [],
                ctransitPlaceCode: [],
                // 启运地提示
                startHintShow: false,
                // 目的地提示
                endHintShow: false,
                startDefault: '',
                ctransitDefault: '',
                endDefault: ''
            }
        },
        watch: {
            defaultData (newVal) {
                this.startPlaceCode = newVal.startPlaceCode,
                this.endPlaceCode = newVal.endPlaceCode,
                this.ctransitPlaceCode = newVal.ctransitPlaceCode
                this.startPlace = newVal.startPlaceTranslate,
                this.endPlace = newVal.endPlaceTranslate,
                this.ctransitPlace = newVal.ctransitPlaceTranslate
            }
        },
        methods: {
            // 生成路线
            createPathClick () {
                if (this.startPlaceCode.length === 0) {
                    this.startHintShow = true
                    return
                }
                if (this.endPlaceCode.length === 0) {
                    this.endHintShow = true
                    return
                }
                const requestData = {
                    startPlace: this.startPlaceCode,
                    endPlace: this.endPlaceCode,
                    ctransitPlace: this.ctransitPlaceCode
                }
                apiGenerateRoute({ data: requestData }).then(({ data }) => {
                    this.$emit('generate-route', data, requestData)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .base-info {
        padding: 20px;
        background-color: #fff;
        .box {
            padding: 20px 30px 30px 30px;
            background-color: #f9f9f9;
            .info-container {
                background-color: #fff;
                display: flex;
                align-items: center;
                .items {
                    width: calc(100% - 200px);
                    border-top: 1px solid $border-color;
                    border-right: 1px solid $border-color;
                    .item {
                        display: flex;
                        height: 36px;
                        border-bottom: 1px solid $border-color;
                        border-left: 1px solid $border-color;
                        .name {
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            width: 120px;
                            height: 100%;
                            padding-right: 12px;
                            text-align: right;
                            background-color: #f9f9f9;
                            border-right: 1px solid $border-color;
                            .tag {
                                font-size: 14px;
                                font-family: SimSun;
                                color: #ff001b;
                            }
                        }
                        .content {
                            display: flex;
                            align-items: center;
                            height: 100%;
                            width: calc(100% - 120px);
                            display: flex;
                            /deep/ .ivu-select, /deep/ .ivu-cascader {
                                width: 120px;
                                margin-left: 12px;
                            }
                            button {
                                margin: 0 12px;
                            }
                            .hint {
                                color: $error-color;
                            }
                            .selected-value {
                                @extend %scrollbar-x;
                                max-width: 60%;
                                overflow-x: auto;
                                display: flex;
                                align-items: center;
                                span {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    flex-shrink: 0;
                                    height: 24px;
                                    padding: 0 8px;
                                    font-size: 12px;
                                    background-color: #f5f5f5;
                                    border-radius: 4px;
                                    i {
                                        margin-left: 20px;
                                        font-size: 16px;
                                        color: #dcdcdc;
                                        &:hover {
                                            color: $light-color;
                                        }
                                    }
                                    & + span {
                                        margin-left: 12px;
                                    }
                                }
                            }
                        }
                    }
                }
                .generate-route-btn {
                    display: flex;
                    justify-content: center;
                    width: 200px;
                }
            }
        }
        /deep/ .ivu-btn-primary {
            min-width: auto;
        }
    }
</style>
