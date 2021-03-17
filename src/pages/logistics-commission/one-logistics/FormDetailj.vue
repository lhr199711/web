<template>
    <div class="FormDetailj">
        <div class="public-form-box">
            <div class="public-form-content">
                <Row :gutter="20" class="publc-bottom20">
                    <Col span="18">
                        <Col span="8">
                            <p class="item-form-title">发货人信息</p>
                            <div class="table-boxjz">
                                <div class="table-rowjz">
                                    <div>发货人名称：</div>
                                    <div>{{formModel.FattenName}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>代码：</div>
                                    <div>{{formModel.Fcode}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>地址：</div>
                                    <div>{{formModel.FattenAddr}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>电话：</div>
                                    <div>{{formModel.FattenTel}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>传真：</div>
                                    <div>{{formModel.FattenFax}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>邮箱：</div>
                                    <div>{{formModel.FattenEmail}}</div>
                                </div>
                            </div>
                        </Col>
                        <Col span="8">
                            <p class="item-form-title">收货人信息</p>
                            <div class="table-boxjz">
                                <div class="table-rowjz">
                                    <div>收货人名称：</div>
                                    <div>{{formModel.SattenName}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>代码：</div>
                                    <div>{{formModel.Scode}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>地址：</div>
                                    <div>{{formModel.SattenAddr}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>电话：</div>
                                    <div>{{formModel.SattenTel}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>传真：</div>
                                    <div>{{formModel.SattenFax}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>邮箱：</div>
                                    <div>{{formModel.SattenEmail}}</div>
                                </div>
                            </div>
                        </Col>
                        <Col span="8">
                            <p class="item-form-title">通知人信息</p>
                            <div class="table-boxjz">
                                <div class="table-rowjz">
                                    <div>通知人名称：</div>
                                    <div>{{formModel.TattenName}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>代码：</div>
                                    <div>{{formModel.Tcode}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>地址：</div>
                                    <div>{{formModel.TattenAddr}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>电话：</div>
                                    <div>{{formModel.TattenTel}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>传真：</div>
                                    <div>{{formModel.TattenFax}}</div>
                                </div>
                                <div class="table-rowjz">
                                    <div>邮箱：</div>
                                    <div>{{formModel.TattenEmail}}</div>
                                </div>
                            </div>
                        </Col>
                    </Col>
                    <Col span="6">
                        <p class="item-form-title">服务参数</p>
                        <div class="table-boxjz">
                            <div class="table-rowjz">
                                <div>运输类型：</div>
                                <div>{{formModel.trspTypeTranslate}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>集装箱尺寸：</div>
                                <div>{{formModel.contaSizeTranslate}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>集装箱来源：</div>
                                <div>{{formModel.containerSourceTranslate}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>货物总量：</div>
                                <div>{{formModel.cargoTotal}}kg</div>
                            </div>
                            <div class="table-rowjz">
                                <div>合同委托有效期：</div>
                                <div>{{moment_time_m(formModel.startPeriod)}}--{{moment_time_m(formModel.untilPeriod)}}</div>
                            </div>
                            <div v-if="isGuilv" class="table-rowjz">
                                <div>委托周期：</div>
                                <div>{{formModel.entrustPeriod}}天</div>
                            </div>
                            <div
                                v-if="!isGuilv"
                                class="table-rowjz"
                                v-for="(item,index) in 1"
                                :key="index"
                            >
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="18">
                        <p class="item-form-title">货物信息</p>
                        <div class="public-line"></div>
                        <div class="scroll-box">
                            <cargo-info v-if="timeShow" :arr="entrustCargoRes">
                                <template slot="btns-end">
                                    <span>货物类型：</span>
                                    <span>{{formModel.cargoTypeTranslate}}</span>
                                </template>
                            </cargo-info>
                        </div>
                    </Col>
                    <Col span="6">
                        <p class="item-form-title">运输要求</p>
                        <div class="table-boxjz">
                            <div class="table-rowjz">
                                <div>主要运输方式：</div>
                                <div>{{formModel.trspModeTranslate}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>物流类型：</div>
                                <div>{{formModel.logisticsTypeTranslate}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>提箱类型：</div>
                                <div>{{formModel.suitcaseTypeTranslate}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>集装箱数量：</div>
                                <div>{{formModel.suitcaseQty}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>货物适宜温度：</div>
                                <div>{{formModel.setTemperatureAt}}°C</div>
                            </div>
                            <div class="table-rowjz">
                                <div>出口报关地：</div>
                                <div>{{formModel.exPortTranslate}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>进口报关地：</div>
                                <div>{{formModel.imPortTranslate}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>最迟启运时间：</div>
                                <div>{{formModel.lastStartTime}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>最低时长要求：</div>
                                <div>{{formModel.lowestTimeReq}}天</div>
                            </div>
                            <div class="table-rowjz">
                                <div>最高费用要求：</div>
                                <div>{{formModel.highestCostReq}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>预计货好时间：</div>
                                <div>{{formModel.cargoReadyTime}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>最晚到达时间：</div>
                                <div>{{formModel.lastArriveTime}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>合同编号：</div>
                                <div>{{formModel.contractCode}}</div>
                            </div>
                            <div class="table-rowjz">
                                <div>备注：</div>
                                <div>{{formModel.remark}}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
import { apiGetPeriodEntrustBasicDetails } from '@/api/logisticsCommission'
import moment from 'moment'
import formCargoInfo from '@/mixins/formCargoInfo'
import dictionaryList from '@/mixins/dictionaryList'
import CargoInfo from './CargoInfo4'
export default {
    name: 'FormDetailj',
    mixins: [formCargoInfo, dictionaryList],
    components: {
        CargoInfo,
    },
    data () {
        return {
            // 数据等待
            timeShow: false,
            // 表单
            formModel: {},
            entrustCargoRes: [],
            isGuilv: true,
        }
    },
    computed: {
        cptId () {
            let str = this.$route.query.entrustCode
            return str
        },
    },
    created () {
        this.getDetail()
    },
    methods: {
        save (name) {
            //我是接受委托
            alert('功能开发中')
        },
        // 暂时放在这儿
        replaceNull (obj) {
            for (let key in obj) {
                switch (Object.prototype.toString.call(obj[key]).slice(8, -1)) {
                    case 'Object':
                        replaceNull(obj[key])
                        break
                    case 'Array':
                        for (let i = 0; i < obj[key].length; i++) {
                            replaceNull(obj[key][i])
                        }
                        break
                    default:
                        if (obj[key] === null || obj[key] == 'null')
                            obj[key] = undefined
                }
            }
        },
        getDetail () {
            // 查询详情
            apiGetPeriodEntrustBasicDetails({
                entrustCode: this.cptId,
            }).then(({ data }) => {
                let {
                    transportationAskRes,
                    entrustAttenResList,
                    entrustCargoRes,
                } = data
                let f = entrustAttenResList.find(
                    (item) => item.linkType == '发货人'
                )
                let newf = {}
                for (let key in f) {
                    newf[`F${key}`] = f[key]
                }
                let s = entrustAttenResList.find(
                    (item) => item.linkType == '收货人'
                )
                let news = {}
                for (let key in s) {
                    news[`S${key}`] = s[key]
                }
                let t = entrustAttenResList.find(
                    (item) => item.linkType == '通知人'
                )
                let newt = {}
                for (let key in t) {
                    news[`T${key}`] = t[key]
                }
                let obj = {
                    ...newf,
                    ...news,
                    ...newt,
                    ...transportationAskRes,
                    cargoTypeTranslate: entrustCargoRes[0].cargoTypeTranslate,
                }
                this.formModel = {
                    ...obj,
                    lastStartTime:
                        obj.lastStartTime &&
                        moment(obj.lastStartTime).format('YYYY-MM-DD'),
                    cargoReadyTime:
                        obj.cargoReadyTime &&
                        moment(obj.cargoReadyTime).format('YYYY-MM-DD'),
                    lastArriveTime:
                        obj.lastArriveTime &&
                        moment(obj.lastArriveTime).format('YYYY-MM-DD'),
                }
                this.entrustCargoRes = entrustCargoRes
                this.timeShow = true
                this.$emit('handelLaw', data.entrustType)
                if (data.entrustType == '周期性规律委托') {
                    this.isGuilv = true
                } else {
                    this.isGuilv = false
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.FormDetailj {
    .scroll-box {
        height: 470px;
        overflow-y: auto;
    }
    .public-form-box {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
        padding: 0px;
        .public-form-content {
            background: #fff;
            .item-form-title {
                height: 35px;
                font-size: 16px;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                line-height: 35px;
            }
            .table-boxjz {
                box-sizing: border-box;
                border: 1px solid #e6e6e6;
                .table-rowjz {
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    border-bottom: 1px solid #e6e6e6;
                    div {
                        font-size: 14px;
                        height: 100%;
                        font-weight: bold;
                        color: rgba(102, 102, 102, 1);

                        &:first-child {
                            width: 120px;
                            text-align: right;
                            background: #f5f6f8;
                            border-right: 1px solid #e6e6e6;
                        }
                        &:last-child {
                            flex: 1;
                            background: #fff;
                            padding-left: 8px;
                        }
                    }
                }
            }
        }
    }
}
</style>