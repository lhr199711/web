<template>
    <div class="ae-form">
        <div class="public-form-content">
            <Row :gutter="20">
                <Col span="24">
                    <div class="public-line"></div>
                    <div class="scroll-box">
                        <cargo-info @cargoInfoItem="cargoInfoItem_m"></cargo-info>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import {
    apiAddPeriodEntrustExecutory,
    apiGetEntrustCargo
} from '@/api/logisticsCommission'
import validateRules from '@/libs/validateRules'
import moment from 'moment'
import CargoInfo from './CargoInfo2'
import formCargoInfo from '@/mixins/formCargoInfo'
import { mapGetters } from 'vuex'
export default {
    name: 'ae-form',
    mixins: [formCargoInfo],
    components: {
        CargoInfo
    },
    data () {
        return {
            // 表单
            formModel: {},
            // 货物名称
            itemName: [],
            formItemRule: {
                'transportationAskReq.trspType': [
                    validateRules.required('运输类型')[0]
                ]
            }
        }
    },
    computed: {
        ...mapGetters('logisticsCommission', ['noBack'])
    },
    created () { },
    methods: {
        saveForm () {
            this._add()
        },
        _process_itemArr (arr) {
            if (arr instanceof Array && arr.length == 0) {
                this.$Message.warning('请保存后再提交')
                return
            }
            let list = arr.map(item => {
                // 货物信息
                return {
                    cargoName: item.cargoName, //货物名称
                    cargoVol: +item.cargoVol || 0, //货物体积
                    cargoQty: +item.cargoQty || 0, // 货物数量 数字
                    grossWeight: +item.grossWeight || 0, //毛重
                    weightUnit: 'kg', //重量单位
                    hsCode: item.hsCode, //HS编码
                    markNo: item.markNo, //唛头
                    netWeight: +item.netWeight || 0, //净重 数字
                    vodUnit: 'm³', //体积单位
                    suitcaseQty: +item.suitcaseQty || 0, // 箱量
                    cargoCode: item.cargoCode,// 货物id
                    entrustPackagingReqList: [
                        // 包装信息
                        {
                            grossWeight: +item.grossWeight0 || 0, //包装毛重 数字
                            netWeight: +item.netWeight0 || 0, //包装净重 数字
                            packPcode: '0', //包装上级编码 0/1
                            packQty: +item.packQty0 || 0, //包装件数 数字
                            packType: item.packType0, //包装类型
                            packVol: +item.packVol0 || 0 //包装体积
                        },
                        {
                            grossWeight: +item.grossWeight1 || 0, //包装毛重 数字
                            netWeight: +item.netWeight1 || 0, //包装净重 数字
                            packPcode: '1', //包装上级编码 0/1
                            packQty: +item.packQty1 || 0, //包装件数 数字
                            packType: item.packType1, //包装类型
                            packVol: +item.packVol1 || 0 //包装体积
                        }
                    ]
                }
            })
            return list
        },
        _add () {
            // jiekou
            // 处理时间
            if (this.CargoInfoList.some(item => item.isContentShow == true)) {
                this.$Message.success('请保存后再提交!')
                return
            }
            let list = this.CargoInfoList.map(item => {
                // 货物信息
                return {
                    startDatetime: moment(item.startDatetime).valueOf(), //开始时间
                    entrustExcetoryType: 1, //0：周期子委托规则 1：其他子委托
                    entrustCargoReq: this._process_itemArr(item.itemArr) // 货物信息
                }
            })
            let data = {
                entrustCode: this.noBack.entrustCode, //委托编号
                entrustExcetoryIOnceReqList: list // 子委托信息集合 非规律的有多个
            }
            apiAddPeriodEntrustExecutory({ data }).then(({ data }) => {
                this.$router.push('/logisstics-commission/one-logistics/1')
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.ae-form {
    .public-form-content {
        background: rgba(249, 249, 249, 1);
        padding: 0 20px 20px 20px;
        /deep/.ivu-row {
            margin-bottom: 16px;
        }
        .item-form-title {
            height: 35px;
            font-size: 16px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            line-height: 35px;
        }
        .ivu-form-item {
            margin-bottom: 0;
            /deep/.ivu-form-item-label {
                background: #f5f6f8;
                border: 1px solid #e6e6e6;
                border-bottom: none;
                vertical-align: middle;
            }
            /deep/.ivu-form-item-content {
                padding-left: 4px;
                padding-right: 4px;
                border: 1px solid #e6e6e6;
                border-bottom: none;
                border-left: none;
                background: #fff;
                vertical-align: middle;
            }
            /deep/.ivu-select,
            /deep/.ivu-input {
                width: 146px;
                background: rgba(249, 249, 249, 1);
                border-radius: 4px;
                .ivu-select-selection {
                    background: rgba(249, 249, 249, 1);
                }
            }
            /deep/.ivu-input-group {
                width: 60%;
            }
            /deep/.ivu-form-item-error-tip {
                top: 6px;
                left: 152px;
            }
            // 给最后一行添加
            &:last-child {
                /deep/.ivu-form-item-label {
                    border-bottom: 1px solid #e6e6e6;
                }
                /deep/.ivu-form-item-content {
                    border-bottom: 1px solid #e6e6e6;
                }
            }
        }
        // 额外加的包裹层
        .jz-meaningless {
            /deep/.ivu-form-item-label {
                color: #f5f6f8 !important;
            }
        }
        .jz-input-group {
            /deep/.ivu-form-item-error-tip {
                left: 225px !important;
            }
        }
    }
}
</style>