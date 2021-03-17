<template>
    <div class="singleDetail">
        <header-btn title="方案信息">
            <div slot="btn">
                <div
                    class="btns"
                    v-if="formModel.entrustExecutoryStatus=='AFORM' && isRoles_m(['DIS'])"
                >
                    <Button type="primary" @click="accept('formValidate')">接受委托</Button>
                    <Button @click="unacceptDialog">拒绝委托</Button>
                </div>
                <div
                    class="btns"
                    v-if="formModel.entrustExecutoryStatus=='CREATE' && isRoles_m(['ENT','SALE'])"
                >
                    <Button type="primary" @click="sendTrust_m">发送委托</Button>
                </div>
            </div>
        </header-btn>
        <!-- 头部路线箭头 -->
        <line-header
            :lineHeaderData="cptlineHeaderData"
            :trspTypeTranslate="cpttrspTypeTranslate"
            :cargoTypeTranslate="cptcargoTypeTranslate"
            :entrustCode="cptexecutoryEntrustCode"
            :logisticsSchemeCode="formModel.logisticsSchemeCode"
            :freightReqCode="formModel.freightReqCode"
            :status="formModel.entrustExecutoryStatus"
            :isFWSShow="true"
        ></line-header>
        <div class="tas-box">
            <span>单次物流委托编号：</span>
            <span>{{cptId}}</span>
        </div>

        <div class="public-form-box">
            <div class="public-form-content">
                <Row :gutter="20" class="publc-bottom20">
                    <Col span="18">
                        <Col span="8">
                            <detaiFormItem tit="发货人信息" :titleList="titleList" :valueObj="FH"></detaiFormItem>
                        </Col>
                        <Col span="8">
                            <detaiFormItem tit="收货人信息" :titleList="titleList" :valueObj="SH"></detaiFormItem>
                        </Col>
                        <Col span="8">
                            <detaiFormItem tit="通知人信息" :titleList="titleList" :valueObj="TZ"></detaiFormItem>
                        </Col>
                    </Col>
                    <Col span="6">
                        <detaiFormItem tit="服务参数" :titleList="titleFuWu" :valueObj="formModel"></detaiFormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="18">
                        <p class="item-form-title">货物信息</p>
                        <div class="public-line"></div>
                        <div class="scroll-box">
                            <cargo-info v-if="timeShow" :arr="entrustCargoRes" :isOne="isOne">
                                <template slot="btns-end">
                                    <span>货物类型：</span>
                                    <span>{{formModel.cargoTypeTranslate}}</span>
                                </template>
                            </cargo-info>
                        </div>
                    </Col>
                    <Col span="6">
                        <detaiFormItem tit="运输要求" :titleList="titleYunShu" :valueObj="formModel"></detaiFormItem>
                    </Col>
                </Row>
            </div>
        </div>
        <!--  拒绝理由弹框 -->
        <adt-my-modal
            :showModal="showItemModal"
            :title="itemTitle"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk"
        >
            <Form
                ref="formValidate"
                :model="remarkForm"
                :rules="remarkFormruleValidate"
                :label-width="80"
            >
                <FormItem label="拒绝理由" prop="remark">
                    <Input
                        v-model="remarkForm.remark"
                        type="textarea"
                        :autosize="{minRows: 2,maxRows: 5}"
                        placeholder="请输入..."
                    ></Input>
                </FormItem>
            </Form>
        </adt-my-modal>
        <!--  确定唯一服务商 -->
        <!-- 删除二次确认modal -->
        <adt-reconfirm-modal
            :showModal="fwsReconfirm.showDeleteModal"
            :message="fwsReconfirm.message"
            :cancelShow="false"
            @on-visible-change="deleteVisibleChange"
            @on-ok="handleDeleteModalOk"
        ></adt-reconfirm-modal>
    </div>
</template>

<script>
import {
    apiGetPeriodOnceEntrustDetails,
    apiModifyEntrustStatus,
} from '@/api/logisticsCommission'
import validateRules from '@/libs/validateRules'
import moment from 'moment'
import formCargoInfo from '@/mixins/formCargoInfo'
import authMixin from '@/mixins/authMixin'
import CargoInfo from './CargoInfo4'
import lineHeader from './line-header/index'
import headerBtn from '../order/header-btn/index'
import detaiFormItem from './detai-form-item/index'

export default {
    name: 'singleDetail',
    mixins: [formCargoInfo, authMixin],
    components: {
        CargoInfo,
        lineHeader,
        headerBtn,
        detaiFormItem,
    },
    data () {
        return {
            // 是单次
            isOne: true,
            //确定服务商
            fwsReconfirm: {
                showDeleteModal: false,
                message:
                    '接受委托后必须要去确定方案唯一 服务商，才能生成物流全程计划！',
            },
            // 收发通
            titleList: [
                { title: '通知人名称：', name: 'attenName' },
                { title: '代码：', name: 'code' },
                { title: '地址：', name: 'attenAddr' },
                { title: '电话：', name: 'attenTel' },
                { title: '传真：', name: 'attenFax' },
                { title: '邮箱：', name: 'attenEmail' },
            ],
            FH: {},
            SH: {},
            TZ: {},
            // 服务参数
            titleFuWu: [
                { title: '运输类型：', name: 'trspTypeTranslate' },
                { title: '集装箱尺寸：', name: 'contaSizeTranslate' },
                { title: '集装箱来源：', name: 'containerSourceTranslate' },
                {},
                {},
                {},
            ],
            // 运输要求
            titleYunShu: [
                { title: '主要运输方式：', name: 'trspModeTranslate' },
                { title: '物流类型：', name: 'logisticsTypeTranslate' },
                { title: '提箱类型：', name: 'suitcaseTypeTranslate' },
                { title: '集装箱数量：', name: 'suitcaseQty' },
                {
                    title: '货物适宜温度：',
                    name: 'setTemperatureAt',
                    unit: '°C',
                },
                { title: '出口报关地：', name: 'exPortTranslate' },
                { title: '进口报关地：', name: 'imPortTranslate' },
                { title: '最迟启运时间：', name: 'lastStartTime' },
                { title: '最低时长要求：', name: 'lowestTimeReq', unit: '天' },
                { title: '最高费用要求：', name: 'highestCostReq', unit: '元' },
                { title: '预计货好时间：', name: 'cargoReadyTime' },
                { title: '最晚到达时间：', name: 'lastArriveTime' },
                { title: '合同编号：', name: 'contractCode' },
                { title: '备注：', name: 'remark' },
            ],
            showItemModal: false,
            itemTitle: '拒绝理由',
            remarkForm: {},
            remarkFormruleValidate: {
                remark: [
                    {
                        required: true,
                        message: '拒绝理由必填',
                        trigger: 'blur',
                    },
                    {
                        type: 'string',
                        min: 2,
                        message: '最小输入两个字符',
                        trigger: 'blur',
                    },
                ],
            },
            // 数据等待
            timeShow: false,
            // 表单
            formModel: {},
            entrustCargoRes: [],
        }
    },
    computed: {
        cptId () {
            let str = this.$route.query.executoryEntrustCode
            return str
        },
        // 子委托编号
        cptexecutoryEntrustCode () {
            let str = this.$route.query.executoryEntrustCode
            return str
        },
        cptentrustCode () {
            let str = this.$route.query.entrustCode
            return str
        },
        cptlineHeaderData () {
            let arr = JSON.parse(this.$route.query.lineHeaderData)
            return arr
        },
        // 货物类型
        cptcargoTypeTranslate () {
            let str = this.$route.query.cargoTypeTranslate
            return str
        },
        // 集装箱类型
        cpttrspTypeTranslate () {
            let str = this.$route.query.trspTypeTranslate
            return str
        },
        //零时判断角色的
        cptisDiaodu () {
            let str = this.$route.query.role
            if (str == 'admin') {
                return true
            } else {
                return false
            }
        },
    },
    created () {
        this.getDetail()
    },
    methods: {
        // 退出
        deleteVisibleChange (data) {
            this.fwsReconfirm.showDeleteModal = data
        },
        // 确定唯一服务商
        handleDeleteModalOk () {
            this.fwsReconfirm.showDeleteModal = false
            this.$router.push({
                path:
                    '/logistics-solutions/determine-logistics-solution-service-provider',
                query: {
                    executoryEntrustCode: this.cptexecutoryEntrustCode,
                    // logisticsSchemeCode: this.formModel.logisticsSchemeCode,
                    // freightReqCode: this.formModel.freightReqCode,
                    // routeList:JSON.parse(this.$route.query.lineHeaderData)
                    logisticsSchemeCode: this.$route.query.logisticsSchemeCode,
                    freightReqCode: this.$route.query.freightReqCode,
                    routeList: this.$route.query.lineHeaderData
                },
            })
        },
        // 弹框里面的取消按钮
        visibleChange (data) {
            this.showItemModal = data
        },
        // 弹框里面的确认按钮
        handleItemModalOk () {
            this.showItemModal = false
            this.unaccept()
        },
        //点击打开拒绝弹框
        unacceptDialog (name) {
            this.showItemModal = true
        },
        //我是接受委托
        accept (name) {
            let data = {
                executoryEntrustCode: this.cptexecutoryEntrustCode, //子委托编号
                entrustExecutoryStatus: 'RECEIVE', //子委托状态
            }
            apiModifyEntrustStatus({
                data,
            }).then(({ data }) => {
                this.fwsReconfirm.showDeleteModal = true
                this.$Message.success('操作成功')
            })
        },
        unaccept (name) {
            //拒绝接受委托
            let data = {
                executoryEntrustCode: this.cptexecutoryEntrustCode, //子委托编号
                remark: this.remarkForm.remark,
                entrustExecutoryStatus: 'REJECT', //子委托状态
            }
            apiModifyEntrustStatus({
                data,
            }).then(({ data }) => {
                this.$router.push('/logisstics-commission/one-logistics/1')
                this.$Message.success('操作成功')
            })
        },
        getDetail () {
            // 查询详情
            apiGetPeriodOnceEntrustDetails({
                executoryEntrustCode: this.cptId,
            }).then(({ data }) => {
                let {
                    transportationAskRes,
                    entrustAttenResList,
                    entrustCargoRes,
                } = data
                let f = entrustAttenResList.find(
                    (item) => item.linkType == '发货人'
                )
                this.FH = f
                let s = entrustAttenResList.find(
                    (item) => item.linkType == '收货人'
                )
                this.SH = s
                let t = entrustAttenResList.find(
                    (item) => item.linkType == '通知人'
                )
                this.TZ = t
                let obj = {
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
                    entrustExecutoryStatus: data.entrustExecutoryStatus,
                    logisticsSchemeCode: data.logisticsSchemeCode,
                    freightReqCode: data.freightReqCode,
                }
                this.entrustCargoRes = entrustCargoRes
                this.timeShow = true
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.singleDetail {
    .scroll-box {
        height: 450px;
        overflow-y: auto;
    }
    .public-form-box {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
        padding: 20px;
    }
    @import url('./index.scss');
}
</style>