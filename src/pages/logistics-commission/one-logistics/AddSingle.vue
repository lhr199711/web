<template>
    <div class="add-single">
        <header-btn title="录入委托信息">
            <div slot="btn">
                <Button
                    v-if="(tabName=='基本信息' && isDisabled && law == '规律性周期委托' && animal == '周期' ) || (tabName=='基本信息' && noisDisabled && law == '非规律性周期委托' && animal == '周期')"
                    type="primary"
                    @click="save"
                >保存基本信息</Button>
                <span
                    v-else-if="(tabName=='基本信息' && !isDisabled && law == '规律性周期委托' && animal == '周期' ) || (tabName=='基本信息' && !noisDisabled && law == '非规律性周期委托' && animal == '周期')"
                ></span>
                <Button v-else type="primary" @click="save">保存委托</Button>
            </div>
        </header-btn>
        <!-- 头部路线箭头 -->
        <line-header :lineHeaderData="cptPlanData.routeLists"></line-header>
        <div class="tas-box">
            <span>选择委托模式：</span>
            <RadioGroup v-model="animal">
                <Radio label="单次">单次委托</Radio>
                <Radio label="周期">合同委托</Radio>
            </RadioGroup>
            <Select v-if="animal == '周期'" v-model="law" style="width: 170px;">
                <Option value="规律性周期委托">规律性周期委托</Option>
                <Option value="非规律性周期委托">非规律性周期委托</Option>
            </Select>
        </div>
        <!-- 单次 -->
        <div v-if="animal == '单次'" class="single-form-box">
            <single-form :planData="cptPlanData" ref="singleForm"></single-form>
        </div>
        <!-- 周期 -->
        <div v-if="animal == '周期'" class="piblic-rate-tabs-box">
            <div v-if="law == '规律性周期委托'" class="public-form-box">
                <Tabs v-model="tabName" type="card">
                    <TabPane label="录入委托基本信息" name="基本信息">
                        <cycle-formj
                            :planData="cptPlanData"
                            ref="cycleFormj"
                            @handelDisble="handelDisbleOk"
                        ></cycle-formj>
                    </TabPane>
                    <!-- <TabPane :disabled="isDisabled" label="录入单次委托信息" name="详细信息"> -->
                    <TabPane label="录入单次委托信息" name="详细信息">
                        <cycle-formx v-if="tabName == '详细信息'" :okBack="okBack" ref="cycleFormx"></cycle-formx>
                    </TabPane>
                </Tabs>
            </div>
            <div v-if="law == '非规律性周期委托'" class="public-form-box">
                <Tabs v-model="tabName" type="card">
                    <TabPane label="录入委托基本信息" name="基本信息">
                        <no-cycle-formj
                            :planData="cptPlanData"
                            ref="NocycleFormj"
                            @handelDisble="handelDisbleNo"
                        ></no-cycle-formj>
                    </TabPane>
                    <!-- <TabPane :disabled="noisDisabled" label="录入单次委托信息" name="详细信息"> -->
                    <TabPane label="录入单次委托信息" name="详细信息">
                        <no-cycle-formx v-if="tabName == '详细信息'" ref="NocycleFormx"></no-cycle-formx>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </div>
</template>

<script>
import validateRules from '@/libs/validateRules'
import SingleForm from './SingleForm'
import CycleFormj from './CycleFormj'
import CycleFormx from './CycleFormx'
import NoCycleFormj from './NoCycleFormj'
import NoCycleFormx from './NoCycleFormx'
import lineHeader from './line-header/index'
import headerBtn from '../order/header-btn/index'
export default {
    name: 'ConfirmFreightRequest',
    components: {
        SingleForm,
        CycleFormj,
        CycleFormx,
        NoCycleFormj,
        NoCycleFormx,
        lineHeader,
        headerBtn
    },
    data () {
        return {
            animal: '单次',
            law: '规律性周期委托',
            tabName: '基本信息',
            isDisabled: true,
            noisDisabled: true,
            // 规律基础新增的返回信息
            okBack: {},
            // 非规律基础新增的返回信息
            noBack: {
            }
        }
    },
    created () {
        this.setPlanData()
    },
    computed: {
        cptPlanData () {
            // let obj = JSON.parse(this.$route.query.data)
            // return obj

            let newobj =  {
                "logisticsSchemeCode": "LP202007201924010001",
                "freightReqCode": "TC202008051448089723",
                "routeCode": "RT1001",
                "hghtTmeff": "4",
                "lwstTmeff": null,
                "tmeffUnit": "D",
                "totalPrices": null,
                "offerCurr": "CNY",
                "hghtPrice": 2200.0,
                "lwstPrice": 2000.0,
                "cargoType": "G",
                "endOfTime": "2020-12-31",
                "remindTime": "3",
                "exrtMode": "固定",
                "exrt": null,
                "routeLists": [
                    {
                        "logisticsSchemeCode": "LP202007201924010001",
                        "routeCode": "RT1001",
                        "roadCode": null,
                        "departurePort": "20201001",
                        "destinationPort": "20201002",
                        "logisticsType": "N",
                        "trspMode": "3",
                        "trspType": "C",
                        "sortNum": 0
                    },
                    {
                        "logisticsSchemeCode": "LP202007201924010001",
                        "routeCode": "RT1001",
                        "roadCode": null,
                        "departurePort": "20201002",
                        "destinationPort": "20201010",
                        "logisticsType": "N",
                        "trspMode": "4",
                        "trspType": "C",
                        "sortNum": 0
                    }
                ]
            }
            return newobj
        }
    },
    methods: {
        //设置方法过来的信息在store
        setPlanData () {
            let obj = JSON.parse(this.$route.query.data)
            this.$store.commit("logisticsCommission/conmitPlanData", obj)
        },
        // 规律的基本信息调用成功返回
        handelDisbleOk (data) {
            this.okBack = data
            this.isDisabled = false
        },
        // 非规律的基本信息调用成功返回
        handelDisbleNo (data) {
            this.$store.commit('logisticsCommission/conmitnoBack', data)
            this.noisDisabled = false
        },
        save () {
            if (this.animal == '单次') {
                this.$refs.singleForm.saveForm_m()
            }
            if (this.animal == '周期') {
                if (this.law == '规律性周期委托') {
                    if (this.tabName == '基本信息') {
                        this.$refs.cycleFormj.saveForm_m()
                    }
                    if (this.tabName == '详细信息') {
                        this.$refs.cycleFormx.saveForm()
                    }
                }
                if (this.law == '非规律性周期委托') {
                    if (this.tabName == '基本信息') {
                        this.$refs.NocycleFormj.saveForm()
                    }
                    if (this.tabName == '详细信息') {
                        this.$refs.NocycleFormx.saveForm()
                    }
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.add-single {
    @import './rate-tabs/tabs.scss';
    @import url('./index.scss');
    .tas-box {
        display: flex;
        align-items: center;
        /deep/.ivu-radio-wrapper {
            &:last-child {
                margin-left: 94px;
            }
        }
    }
    .public-form-box {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
        padding: 20px;
    }
}
</style>
