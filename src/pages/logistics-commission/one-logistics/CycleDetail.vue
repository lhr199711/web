<template>
    <div class="cycleDetail">
        <header-btn title="方案信息">
            <div slot="btn">
                <div class="btns" v-if="cptentrustExecutoryStatus=='AFORM' && isRoles_m(['DIS'])">
                    <Button type="primary" @click="accept">接受委托</Button>
                    <Button @click="unacceptDialog">拒绝委托</Button>
                </div>
                <div
                    class="btns"
                    v-if="cptentrustExecutoryStatus=='CREATE' && isRoles_m(['ENT','SALE'])"
                >
                    <Button type="primary" @click="sendTrust">发送委托</Button>
                </div>
            </div>
        </header-btn>
        <!-- 头部路线箭头 -->
        <line-header
            :lineHeaderData="cptlineHeaderData"
            :entrustCode="cptexecutoryEntrustCode"
            :trspTypeTranslate="cpttrspTypeTranslate"
            :cargoTypeTranslate="cptcargoTypeTranslate"
            :status="cptentrustExecutoryStatus"
        ></line-header>
        <div class="tas-box">
            <div v-if="isGuilv">规律合同委托编号：{{ cptentrustCode }}</div>
            <div v-if="!isGuilv">非规律合同委托编号：{{cptentrustCode}}</div>
        </div>
        <div class="main-box">
            <div class="piblic-rate-tabs-box">
                <Tabs v-model="tabName" type="card">
                    <TabPane label="委托基本信息" name="基本信息">
                        <form-detailj ref="formDetailj" @handelLaw="handelLaw"></form-detailj>
                    </TabPane>
                    <TabPane label="单次委托信息" name="详细信息">
                        <form-detailx ref="formDetailx"></form-detailx>
                    </TabPane>
                </Tabs>
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
                        placeholder="请输入"
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
    apiOnceEntrustInfoAdd,
    apiModifyPeriodEntrustStatus,
} from '@/api/logisticsCommission'
import moment from 'moment'
import lineHeader from './line-header/index'
import formDetailj from './FormDetailj'
import formDetailx from './FormDetailx'
import formCargoInfo from '@/mixins/formCargoInfo'
import authMixin from '@/mixins/authMixin'
import headerBtn from '../order/header-btn/index'
export default {
    name: 'cycleDetail',
    mixins: [formCargoInfo, authMixin],
    components: {
        lineHeader,
        formDetailj,
        formDetailx,
        headerBtn
    },
    data () {
        return {
            fwsReconfirm: {
                showDeleteModal: false,
                message:
                    '接受委托后必须要去确定方案唯一 服务商，才能生成物流全程计划！',
            },
            showItemModal: false,
            itemTitle: '拒绝理由',
            isGuilv: true,
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
            // 表单
            tabName: '基本信息',
        }
    },
    computed: {
        cptlineHeaderData () {
            let arr = JSON.parse(this.$route.query.lineHeaderData)
            return arr
        },
        cptentrustCode () {
            let str = this.$route.query.entrustCode
            return str
        },
        cptexecutoryEntrustCode () {
            let str = this.$route.query.executoryEntrustCode
            return str
        },
        cptentrustExecutoryStatus () {
            let str = this.$route.query.entrustExecutoryStatus
            return str
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
    created () { },
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
                    logisticsSchemeCode: this.$route.query.logisticsSchemeCode,
                    freightReqCode: this.$route.query.freightReqCode,
                    routeList: this.$route.query.lineHeaderData
                },
            })
        },
        // 判断规律还是非规律函数
        handelLaw (data) {
            if (data == '周期性规律委托') {
                this.isGuilv = true
            } else {
                this.isGuilv = false
            }
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
                entrustCode: this.cptentrustCode, //委托编号
                entrustStatus: 'RECEIVE', //委托状态
            }
            apiModifyPeriodEntrustStatus({
                data,
            }).then(({ data }) => {
                // this.fwsReconfirm.showDeleteModal = true
                this.$router.push('/logisstics-commission/one-logistics/1')
                this.$Message.success('操作成功')
            })
        },
        unaccept (name) {
            //拒绝接受委托
            let data = {
                entrustCode: this.cptentrustCode, //委托编号
                reason: this.remarkForm.remark,
                entrustStatus: 'REJECT', //委托状态
            }
            apiModifyPeriodEntrustStatus({
                data,
            }).then(({ data }) => {
                this.$router.push('/logisstics-commission/one-logistics/1')
                this.$Message.success('操作成功')
            })
        },
        // 发送周期委托
        sendTrust () {
            let data = {
                entrustCode: this.cptentrustCode, //委托编号
                entrustStatus: 'AFORM', //委托状态
            }
            apiModifyPeriodEntrustStatus({
                data,
            }).then(({ data }) => {
                this.$Message.success('操作成功')
                this.$router.push('/logisstics-commission/one-logistics/1')
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.cycleDetail {
    @import './rate-tabs/tabs.scss';
    .important-info-box {
        display: flex;
        justify-content: space-between;
        /deep/.ivu-btn {
            margin-left: 20px;
        }
    }
    .main-box {
        padding: 20px;
        background: #fff;
    }
    @import url('./index.scss');
}
</style>