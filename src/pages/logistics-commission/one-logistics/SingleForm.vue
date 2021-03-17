<template>
    <div class="ae-form">
        <div class="public-form-box">
            <div class="public-form-content">
                <Form
                    ref="formValidate"
                    label-position="right"
                    :label-width="152"
                    :rules="formItemRule"
                    :model="formModel"
                >
                    <Row :gutter="20">
                        <Col span="18">
                            <Col span="8">
                                <p class="item-form-title">发货人信息</p>
                                <FormItem label="发货人名称：" prop="FattenName">
                                    <Input v-model="formModel.FattenName"></Input>
                                </FormItem>
                                <FormItem label="代码：">
                                    <Input v-model="formModel.Fcode"></Input>
                                </FormItem>
                                <FormItem label="地址：" prop="FattenAddr">
                                    <Input v-model="formModel.FattenAddr"></Input>
                                </FormItem>
                                <FormItem label="电话：" prop="FattenTel">
                                    <Input v-model="formModel.FattenTel"></Input>
                                </FormItem>
                                <FormItem label="传真：">
                                    <Input v-model="formModel.FattenFax"></Input>
                                </FormItem>
                                <FormItem label="邮箱：">
                                    <Input v-model="formModel.FattenEmail"></Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <p class="item-form-title">收货人信息</p>
                                <FormItem label="收货人名称：" prop="SattenName">
                                    <Input v-model="formModel.SattenName"></Input>
                                </FormItem>
                                <FormItem label="代码：">
                                    <Input v-model="formModel.Scode"></Input>
                                </FormItem>
                                <FormItem label="地址：" prop="SattenAddr">
                                    <Input v-model="formModel.SattenAddr"></Input>
                                </FormItem>
                                <FormItem label="电话：" prop="SattenTel">
                                    <Input v-model="formModel.SattenTel"></Input>
                                </FormItem>
                                <FormItem label="传真：">
                                    <Input v-model="formModel.SattenFax"></Input>
                                </FormItem>
                                <FormItem label="邮箱：">
                                    <Input v-model="formModel.SattenEmail"></Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <p class="item-form-title">通知人信息</p>
                                <FormItem label="通知人名称：" prop="TattenName">
                                    <Input v-model="formModel.TattenName"></Input>
                                </FormItem>
                                <FormItem label="代码：">
                                    <Input v-model="formModel.Tcode"></Input>
                                </FormItem>
                                <FormItem label="地址：" prop="TattenAddr">
                                    <Input v-model="formModel.TattenAddr"></Input>
                                </FormItem>
                                <FormItem label="电话：" prop="TattenTel">
                                    <Input v-model="formModel.TattenTel"></Input>
                                </FormItem>
                                <FormItem label="传真：">
                                    <Input v-model="formModel.TattenFax"></Input>
                                </FormItem>
                                <FormItem label="邮箱：" prop="TattenEmail">
                                    <Input v-model="formModel.TattenEmail"></Input>
                                </FormItem>
                            </Col>
                        </Col>
                        <Col span="6">
                            <p class="item-form-title">服务参数</p>
                            <FormItem label="运输类型：" prop="trspType">
                                <!-- <Input v-model="planForm.trspType"></Input> -->
                                <Select v-model="planForm.trspType" clearable>
                                    <Option
                                        v-for="(item, index) in trspTypeList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                                <!-- <span>{{planForm.trspType}}</span> -->
                            </FormItem>
                            <FormItem label="集装箱尺寸类型：">
                                <!-- <Input v-model="planForm.contaSize"></Input> -->
                                <Select v-model="planForm.contaSize" clearable>
                                    <Option
                                        v-for="(item, index) in contaSizeList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                                <!-- <span>{{planForm.contaSize}}</span> -->
                            </FormItem>
                            <FormItem label="集装箱来源：">
                                <!-- <Input v-model="planForm.containerSource"></Input> -->
                                <Select v-model="planForm.containerSource" clearable>
                                    <Option
                                        v-for="(item, index) in containerSourceList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                                <!-- <span>{{planForm.containerSource}}</span> -->
                            </FormItem>
                            <FormItem class="jz-meaningless" v-for="(item,index) in 3" :key="index">
                                <template slot="label">无意义</template>
                                <Input disabled></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="20">
                        <Col span="18">
                            <p class="item-form-title">货物信息</p>
                            <div class="public-line"></div>
                            <div class="scroll-box">
                                <cargo-info @cargoInfoItem="cargoInfoItem_m">
                                    <template slot="btns-end">
                                        <span>货物类型：</span>
                                        <span>
                                            <Select
                                                v-model="planForm.cargoType"
                                                filterable
                                                clearable
                                            >
                                                <Option
                                                    v-for="item in cargoTypeList"
                                                    :value="item.dictionaryKey"
                                                    :key="item.dictionaryKey"
                                                >{{ item.dictionaryValue }}</Option>
                                            </Select>
                                        </span>
                                        <!-- <span>{{planForm.cargoType}}</span> -->
                                    </template>
                                </cargo-info>
                            </div>
                        </Col>
                        <Col span="6">
                            <p class="item-form-title">运输要求</p>
                            <FormItem label="主要运输方式：">
                                <!-- <Input v-model="planForm.trspMode"></Input> -->
                                <Select v-model="planForm.trspMode" clearable>
                                    <Option
                                        v-for="(item, index) in trspModeList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                                <!-- <span>{{planForm.trspMode}}</span> -->
                            </FormItem>
                            <FormItem label="物流类型：">
                                <!-- <Input v-model="planForm.logisticsType"></Input> -->
                                <Select v-model="planForm.logisticsType" clearable>
                                    <Option
                                        v-for="(item, index) in logisticsTypeList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                                <!-- <span>{{planForm.logisticsType}}</span> -->
                            </FormItem>
                            <FormItem label="提箱类型：">
                                <!-- <Input v-model="planForm.suitcaseType"></Input> -->
                                <Select v-model="planForm.suitcaseType" clearable>
                                    <Option
                                        v-for="(item, index) in suitcaseTypeList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                                <!-- <span>{{planForm.suitcaseType}}</span> -->
                            </FormItem>
                            <FormItem label="集装箱数量：">
                                <Input v-model="planForm.suitcaseQty"></Input>
                                <!-- <span>{{planForm.suitcaseQty}}</span> -->
                            </FormItem>
                            <FormItem label="货物适宜温度：">
                                <Input v-model="planForm.setTemperatureAt">
                                    <span slot="append">℃</span>
                                </Input>
                                <!-- <span>{{planForm.setTemperatureAt}}°C</span> -->
                            </FormItem>
                            <FormItem label="出口报关地：">
                                <!-- <Input v-model="planForm.exPort"></Input> -->
                                <Cascader :data="cityList" v-model="planForm.exPort"></Cascader>
                                <!-- <span>{{planForm.exPort}}</span> -->
                            </FormItem>
                            <FormItem label="进口报关地：">
                                <!-- <Input v-model="planForm.imPort"></Input> -->
                                <Cascader :data="cityList" v-model="planForm.imPort"></Cascader>
                                <!-- <span>{{planForm.imPort}}</span> -->
                            </FormItem>
                            <FormItem label="最迟启运时间：">
                                <DatePicker
                                    type="datetime"
                                    placeholder="Select date"
                                    v-model="formModel.lastStartTime"
                                ></DatePicker>
                            </FormItem>
                            <FormItem label="最低时长要求：">
                                <Input v-model="planForm.lowestTimeReq">
                                    <span slot="append">天</span>
                                </Input>
                                <!-- <span>{{planForm.lowestTimeReq}}天</span> -->
                            </FormItem>
                            <FormItem label="最高费用要求：">
                                <Input v-model="planForm.highestCostReq"></Input>
                                <!-- <span>{{planForm.highestCostReq}}</span> -->
                            </FormItem>
                            <FormItem label="预计货好时间：" prop="cargoReadyTime">
                                <DatePicker
                                    type="datetime"
                                    placeholder="Select date"
                                    v-model="formModel.cargoReadyTime"
                                ></DatePicker>
                            </FormItem>
                            <FormItem label="最晚到达时间：">
                                <DatePicker
                                    type="datetime"
                                    placeholder="Select date"
                                    v-model="formModel.lastArriveTime"
                                ></DatePicker>
                            </FormItem>
                            <FormItem label="合同编号：">
                                <Input v-model="formModel.contractCode"></Input>
                            </FormItem>
                            <FormItem label="备注：">
                                <Input v-model="formModel.remark"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
import { apiOnceEntrustInfoAdd } from '@/api/logisticsCommission'
import validateRules from '@/libs/validateRules'
import moment from 'moment'
import CargoInfo from './CargoInfo'
import formCargoInfo from '@/mixins/formCargoInfo'
import dictionaryList from '@/mixins/dictionaryList'
export default {
    name: 'ae-form',
    mixins: [formCargoInfo, dictionaryList],
    props: {
        planData: {
            type: Object,
            default () {
                return {}
            },
        },
    },
    components: {
        CargoInfo,
    },
    data () {
        return {
            // 运输类型
            trspTypeList: this.$getDictionary('TRANSPORT_TYPE'),
            //集装箱尺寸类型
            contaSizeList: this.$getDictionary('CONTAINER_SIZE_TYPE'),
            // 集装箱来源
            containerSourceList: this.$getDictionary('CONTAINER_SOURCE'),
            // 运输方式
            trspModeList: this.$getDictionary('TRANSPORT_MODE'),
            // 物流类型
            logisticsTypeList: this.$getDictionary('LOGISTICS_TYPE'),
            // 提箱类型
            suitcaseTypeList: this.$getDictionary('SUITCASE_TYPE'),
            // 货物类型
            cargoTypeList: this.$getDictionary('GOODS_TYPE'),

            // 表单
            formModel: {},
            // 货物信息列表
            CargoInfoList: [],
            // 方案过来的数据
            planForm: {
                cargoType: 'G', //货物类型
                trspType: '', //运输类型
                contaSize: '', //集装箱尺寸
                containerSource: '', //集装箱来源
                trspMode: '1', //主要运输方式
                logisticsType: 'I', //物流类型
                suitcaseType: 'Y', //提箱类型
                suitcaseQty: null, //集装箱数量
                setTemperatureAt: null, //适宜温度
                // exPort: '中国/重庆', //出口报关地
                // imPort: '中国/北京', //进口报关地
                lowestTimeReq: null, //最低时长
                highestCostReq: '', //最高费用
            },
            formItemRule: {
                FattenName: [validateRules.required('名称')[0]],
                FattenAddr: [validateRules.required('地址')[0]],
                FattenTel: [validateRules.required('电话')[0]],
                SattenName: [validateRules.required('名称')[0]],
                SattenAddr: [validateRules.required('地址')[0]],
                SattenTel: [validateRules.required('电话')[0]],
                TattenName: [validateRules.required('名称')[0]],
                TattenAddr: [validateRules.required('地址')[0]],
                TattenEmail: [validateRules.required('邮箱')[0]],
                cargoReadyTime: [
                    {
                        required: true,
                        type: 'date',
                        message: '',
                        trigger: 'change',
                    },
                ],
                TattenTel: [validateRules.required('电话')[0]],
                connum: [
                    validateRules.required('')[0],
                    validateRules.number()[0],
                ],
            },
        }
    },
    created () {
        this.initdataplan()
        this.getCity_m()
    },
    methods: {
        hjz (arr) {
            return arr.join(',')
        },
        initdataplan () {
            let { routeLists, ...all } = this.planData
            let obj = {
                ...all,
                ...this.planForm,
            }
            this.planForm = obj
        },
        _add () {
            // jiekou
            if (this.CargoInfoList.length <= 0) {
                this.$Message.error('货物信息必填')
                return
            }
            let list = this.CargoInfoList.map((item) => {
                // 货物信息
                return {
                    cargoName: item.cargoName, //货物名称
                    cargoType: this.planForm.cargoType, //货物类型
                    cargoVol: +item.cargoVol || 0, //货物体积
                    cargoQty: +item.cargoQty || 0, // 货物件数 数字
                    grossWeight: +item.grossWeight || 0, //毛重
                    weightUnit: 'kg', //重量单位
                    hsCode: item.hsCode, //HS编码
                    markNo: item.markNo, //唛头
                    netWeight: +item.netWeight, //净重 数字
                    vodUnit: 'm³', //体积单位
                    suitcaseQty: 0, // 箱量
                    entrustPackagingReqList: [
                        // 包装信息
                        {
                            grossWeight: +item.grossWeight0 || 0, //包装毛重 数字
                            netWeight: +item.netWeight0 || 0, //包装净重 数字
                            packPcode: '0', //包装上级编码 0/1
                            packQty: +item.packQty0 || 0, //包装件数 数字
                            packType: item.packType0, //包装类型
                            packVol: +item.packVol0 || 0, //包装体积
                        },
                        {
                            grossWeight: +item.grossWeight1 || 0, //包装毛重 数字
                            netWeight: +item.netWeight1 || 0, //包装净重 数字
                            packPcode: '1', //包装上级编码 0/1
                            packQty: +item.packQty1 || 0, //包装件数 数字
                            packType: item.packType1, //包装类型
                            packVol: +item.packVol1 || 0, //包装体积
                        },
                    ],
                }
            })
            let cargoReadyTime = moment(this.formModel.cargoReadyTime).valueOf()
            let lastStartTime = moment(this.formModel.lastStartTime).valueOf()
            let lastArriveTime = moment(this.formModel.lastArriveTime).valueOf()
            let data = {
                contactReqList: [
                    //联系人信息
                    {
                        attenAddr: this.formModel.FattenAddr, //地址
                        attenEmail: this.formModel.FattenEmail || null, //邮箱
                        attenFax: this.formModel.FattenFax, //传真
                        attenName: this.formModel.FattenName, //名称
                        attenTel: this.formModel.FattenTel, //电话
                        linkType: '发货人', //类型
                        code: this.formModel.Fcode, //代码
                    },
                    {
                        attenAddr: this.formModel.SattenAddr, //地址
                        attenEmail: this.formModel.SattenEmail || null, //邮箱
                        attenFax: this.formModel.SattenFax, //传真
                        attenName: this.formModel.SattenName, //名称
                        attenTel: this.formModel.SattenTel, //电话
                        linkType: '收货人', //类型
                        code: this.formModel.Scode, //代码
                    },
                    {
                        attenAddr: this.formModel.TattenAddr, //地址
                        attenEmail: this.formModel.TattenEmail || null, //邮箱
                        attenFax: this.formModel.TattenFax, //传真
                        attenName: this.formModel.TattenName, //名称
                        attenTel: this.formModel.TattenTel, //电话
                        linkType: '通知人', //类型
                        code: this.formModel.Tcode, //代码
                    },
                ],
                entrustCargoReq: list, // 货物信息
                transportationAskReq: {
                    // 运输要求
                    cargoReadyTime: cargoReadyTime, //预计货好时间
                    contaSize: this.planForm.contaSize, //集装箱尺寸
                    containerSource: this.planForm.containerSource, //集装箱来源
                    curr: this.formModel.curr, //货币单位
                    exPort: this.planForm.exPort
                        ? this.planForm.exPort.join(';')
                        : '', //出口报关地
                    highestCostReq: +this.planForm.highestCostReq || 0, //最高费用要求 数字
                    imPort: this.planForm.imPort
                        ? this.planForm.imPort.join(';')
                        : '', //进口报关地
                    lastStartTime: lastStartTime, //最迟启运时间
                    logisticsType: this.planForm.logisticsType, //物流类型
                    lowestTimeReq: +this.planForm.lowestTimeReq || 0, //最低时长要求 数字
                    lowestTimeUnit: '天', //最低时长要求单位
                    setTemperatureAt: +this.planForm.setTemperatureAt || 0, //货物适宜温度 数字
                    setTemperatureUnit: '°C', //货物适宜温度单位
                    suitcaseQty: +this.planForm.suitcaseQty || 0, //集装箱数量 数字
                    suitcaseType: this.planForm.suitcaseType, //提箱类型
                    trspMode: this.planForm.trspMode, //主要运输方式
                    trspType: this.planForm.trspType, //运输类型
                    remark: this.formModel.remark, //备注
                    lastArriveTime: lastArriveTime, //最晚到达时间
                },
                trsspmPort: this.planData.routeLists.map(
                    (item) => item.departurePort
                ), //中转地
                contractCode: this.formModel.contractCode, //合同编号
                departurePort: this.planData.routeLists[0].departurePort, //启运地
                destinationPort: this.planData.routeLists[
                    this.planData.routeLists.length - 1
                ].destinationPort, //目的地
                freightReqCode: this.planData.freightReqCode, //货运需求编码
                logisticsSchemeCode: this.planData.logisticsSchemeCode, //方案编号
                vodUnit: 'm³', //体积单位
                weightUnit: 'kg', //重量单位
            }
            apiOnceEntrustInfoAdd({ data })
                .then((res) => {
                    this.$Message.success('新增成功!')
                    this.$router.push('/logisstics-commission/one-logistics/1')
                })
                .catch((res) => {
                })
        },
    },
}
</script>
<style lang="scss" scoped>
/deep/.ivu-select {
    width: 150px;
}
.scroll-box {
    height: 400px;
    overflow-y: auto;
}
.public-line {
    height: 1px;
    background: $light-color;
    margin-bottom: 4px;
}
.ae-form {
}
</style>