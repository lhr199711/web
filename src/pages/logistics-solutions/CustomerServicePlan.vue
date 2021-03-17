<template>
    <div :class="{'content-none': isRecommend == 1}">
        <div class="btn-audit clearfix" v-if="isRecommend == 0 && (distinguishCharacter =='SALE' || distinguishCharacter =='ENT')">
            <Button class="btn-recommend" @click="refuseRecommend">拒绝推荐</Button>
            <Button type="primary" class="btn-recommend" @click="agreeRecommend">同意推荐</Button>
        </div>
        <!-- <AdtMyModal
            title="不同意推荐方案原因"
            okText="确定"
            cancelText="取消货运要求"
            showThirdTitle="编辑货运要求"
            :isShowThirdBtn="true"
            :showModal="isModalRecommend"
            @on-visible-change="isShow"
            @on-ok="save()"
            @on-cancel="cancel()"
            @handleFeatures="handleFeatures"
        > -->
        <AdtMyModal
            title="不同意推荐方案原因"
            okText="确定"
            :showCancelBtn="false"
            :showModal="isModalRecommend"
            @on-visible-change="isShow"
            @on-ok="save()"
            @on-cancel="cancel()"
            @handleFeatures="handleFeatures"
        >
            <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <FormItem prop="remark" label="不同意推荐原因:">
                    <Input v-model="formInline.remark" type="textarea" style="width:400px" />
                </FormItem>
            </Form>
        </AdtMyModal>
        <adt-logistics-route :logisticsRouteList="listDatas" @clickPath="clickPath" />
        <!-- 调度需要展示的提示 -->
        <Alert
            v-if="distinguishCharacter == 'DIS'"
            class="alart-box"
            type="warning"
            show-icon
        >
            根据货运要求匹配的推荐物流服务方案请在详情内确认方案后推荐给销售！
        </Alert>
        <div class="btn-pagina">
            <span v-if="isRecommend == 0 || isRecommend == 1 || isRecommend == 3" class="title">推荐物流服务方案</span>
            <div v-if="isRecommend == 2" class="btn-tabs" >
                <adt-btns :btnIndex="btnIndex" :titleNames="titleNames" @handleBtn="handleBtn" />
                <AdtButton v-if="btnIndex == 1 && distinguishCharacter == 'DIS' || btnIndex == 2 && distinguishCharacter == 'SALE'">
                    <Button @click="recommendCheck()">推荐勾选
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-tuijian"></use>
                        </svg>
                    </Button>
                    <Button @click="recommendAll()">推荐全部
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-xiangbao"></use>
                        </svg>
                    </Button>
                    <Button @click="recommendCurrent()">推荐当前路线方案
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-ziyuan"></use>
                        </svg>
                    </Button>
                </AdtButton>
            </div>
            <adt-paginator class="pagination" :currentPage="~~page" :total="~~total" :size="6" />
        </div>
        <div class="public-component-line"></div>
        <div class="public-list">
            <div v-for="(logistics, id) in listData" :key="id" class="public-component-card">
                <AdtListItem
                    :logistics="logistics"
                    :showCheckbox="isCheckbox"
                    :resetCheckStatus="resetCheckStatus"
                    @checkData="checkData"
                >
                    <template slot="tab-title">
                        <span>物流方案编号:{{ logistics.logisticsSchemeCode }}</span>
                    </template>
                    <template slot="tab-operat">
                        <span
                            v-if="distinguishCharacter == 'DIS'"
                            :class="{'card-status-success': logistics.statusCode == 'disagree', 'card-status-error': logistics.statusCode == 'refuse', 'card-status': logistics.statusCode == 'agree' }"
                        >
                            {{ logistics.status }}
                        </span>
                        <Poptip placement="right-start" class="card-icon">
                            <span>查看详情</span>
                            <Icon type="md-arrow-dropdown" />
                            <!-- 客户的操作 -->
                            <div v-if="distinguishCharacter == 'ENT'" class="card-poptip-font" slot="content">
                                <p @click="detail(logistics)">查看详情</p>
                                <p v-if="isRecommend !== '3'" @click="delegate(logistics)">发起委托</p>
                                <!-- <p @click="collect(logistics)" class="failure">收藏</p> -->
                                <!-- <p @click="uncollect(logistics)" class="failure">取消收藏</p> -->
                            </div>
                            <!-- 销售的操作 -->
                            <div v-if="distinguishCharacter == 'SALE'" class="card-poptip-font" slot="content">
                                <p @click="detail(logistics)">查看详情</p>
                                <!-- <p @click="delegate(logistics)" v-if="btnIndex == 0">发起委托</p> -->
                                <p v-if="btnIndex == 2" @click="recommend(logistics)">推荐客户</p>
                                <!-- <p @click="collect(logistics)" class="failure">收藏</p> -->
                            </div>
                            <!-- 调度的操作 -->
                            <div v-if="distinguishCharacter == 'DIS'" class="card-poptip-font" slot="content">
                                <div v-show="btnIndex == 1" @click="edit(logistics)">编辑方案</div>
                                <div v-show="btnIndex == 2" @click="edit(logistics)">确定方案</div>
                                <div v-show="btnIndex == 1" @click="recommend(logistics)">推荐销售</div>
                                <!-- <div @click="confirm(logistics)">确认方案</div> -->
                                <div @click="detail(logistics)">查看详情</div>
                            </div>
                        </Poptip>
                    </template>
                    <template slot="tab-content">
                        <div class="card-route">
                            <div v-for="(location, index) in logistics.routeLists" :key="index" class="card-content">
                                <span class="card-outset">{{ location.departurePortTranslate }}</span>
                                <div class="card-transit">
                                    <div class="card-way">
                                        <svg :class="['iconfont', { car: location.trspModeTranslate == '公路' }]" aria-hidden="true">
                                            <use v-if="location.trspModeTranslate == '铁运'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_huoche"></use>
                                            <use v-if="location.trspModeTranslate == '公路'" fill="#FFBB32" xlink:href="#icon-huoche"></use>
                                            <use v-if="location.trspModeTranslate == '水运'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_lunchuan"></use>
                                            <use v-if="location.trspModeTranslate == '空运'" fill="#FFBB32"
                                            xlink:href="#icon-feiji800"></use>
                                        </svg>
                                    </div>
                                    <div class="card-line">
                                        <svg class="icon" aria-hidden="true">
                                            <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou3"></use>
                                        </svg>
                                    </div>
                                    <div class="card-genre">{{ location.logisticsTypeTranslate }}{{ location.trspTypeTranslate }}</div>
                                </div>
                                <template v-if="index === logistics.routeLists.length - 1">
                                    <span class="card-address">{{ location.destinationPortTranslate }}</span>
                                </template>
                            </div>
                        </div>
                    </template>
                    <template slot="tab-bottom">
                        <!-- 客户看到的最高时效/价格 -->
                        <div class="card-bottom" v-if="distinguishCharacter == 'ENT'">
                            <span>时效: {{ logistics.hghtTmeff }}{{ logistics.tmeffUnitTranslate}}</span>
                            <span></span>
                            <span class="card-right">
                                <span>价格:</span>
                                <span class="card-right-size">{{ logistics.lwstPrice }}</span>
                                <span>/{{ logistics.offerCurrTranslate }}</span>
                            </span>
                        </div>
                        <!-- 调度/销售看到的时效段/价格区间 -->
                        <div class="card-bottom"  v-if="distinguishCharacter == 'SALE' || distinguishCharacter == 'DIS'">
                            <span>时效: {{ logistics.lwstTmeff }}-{{ logistics.hghtTmeff }}{{ logistics.tmeffUnitTranslate}}</span>
                            <span></span>
                            <span class="card-right">
                                <span>价格:</span>
                                <span class="card-right-size">{{ logistics.lwstPrice }}-{{ logistics.hghtPrice }}</span>
                                <span>/{{ logistics.offerCurrTranslate }}</span>
                            </span>
                        </div>
                    </template>
                </AdtListItem>
            </div>
        </div>
    </div>
</template>

<script>
    import paginator from '@/mixins/paginator'
    import AdtLogisticsRoute from '@/components/adt-logistics-route/Index'
    import AdtListItem from '@/components/adt-list-item/Index'
    import validateRules from '@/libs/validateRules'
    import {
        apiLogisticsSchemeDspt,
        apiLogisticsSchemeMkt,
        apiRecommendPass,
        apiRecommendCheck,
        apiRecommendRoute,
        apiRecommendAll,
        apiRecommendCheckCstm,
        apiRecommendRouteCstm,
        apiRecommendAllCstm
    } from '@/api/logistics'
    import {
        apiAgreeScheme,
        apiDisgreeScheme,
        apiSaleRefuseRecommend,
        apiSaleAgreeRecommend,
        apiBakSale
    } from '@/api/freight'
    export default {
        mixins: [paginator],
        components: {
            AdtLogisticsRoute,
            AdtListItem
        },
        props: {
            value: '',
            sign: ''
        },
        data() {
            return {
                search: {},
                resetCheckStatus: false,
                isModalRecommend: false,
                distinguishCharacter: '',
                formInline: {
                    remark: ''
                },
                ruleInline: {
                    remark: [validateRules.required('原因')[0]],
                },
                isRecommend: 0,  // 默认为0，拒绝为1，销售同意/调度默认为2，客户同意为3
                // SALEDiff: 0, // 默认0， 销售 拒绝为1，同意为2
                isCheckbox: false,
                // tabsSwitch: 0, // 默认为0，调度为1，销售为2
                titleNames: [],
                confirmStatus: '0', // 判断当前是已确认还是未确认  1为已确认，2为未确认
                recommendNames: ['已推荐客户方案', '未推荐客户方案'],
                confirmNames: ['已确认方案', '未确认方案'],
                btnIndex: 0,
                selectList: [], // 勾选的数据
                selectListData: [], // 勾选去重后的数据
                auditStatusList: [
                    {code: 'unreviewed', status: '未审核'},
                    {code: 'stock', status: '未货好'},
                    {code: 'progress', status: '执行中'}
                ],
                enableStatusList: [
                    {code: 'unreviewed', status: '已启用'},
                    {code: 'stock', status: '未启用'},
                    {code: 'progress', status: '已启用'}
                ],
                listData: [],
                listDatas: [
                ],
                selectedRoute: {}
            }
        },
        mounted() {
            // 获取货运要求传过来的路线信息
            const routeData = JSON.parse(window.localStorage.getItem('freightData'))
            if (this.sign == 'viewRecommendations_detail') {
                this.listDatas = routeData
                this.processData(this.listDatas[0])
            } else {
                this.listDatas = routeData.freightRouteList
                // 第一次进入时默认选择第一条路线
                this.processData(this.listDatas[0])
            }
        },
        methods: {
            // 同步推荐模态框状态
            isShow (val) {
                this.isModalRecommend = val
            },
            dataInit () {
                this.getUserData()
                this.getData()
                // this.processData()
            },
            // 取本地的账号角色信息 调度：DIS，销售：SALE，客户：ENT，
            getUserData () {
                this.distinguishCharacter = this.$getUserInfo().roleType
                // 销售的tabs切换name
                if (this.distinguishCharacter == 'SALE') {
                    this.titleNames = this.recommendNames
                    this.isCheckbox = true
                }
                // 调度的tabs切换name
                if (this.distinguishCharacter == 'DIS') {
                    this.titleNames = this.confirmNames
                    this.isCheckbox = true
                    this.isRecommend = 2
                    this.btnIndex = 2
                }
            },
            // 获取列表数据
            getData (val) {
                // 环节号，区分方案是已确认还是未确认 为空的话未进行操作;
                // 调度 20001已确认， 20002未确认;
                // 销售 maktStepId 20005已推荐客户方案，20006未推荐客户方案
                // 客户 cstmStepId 已同意销售推荐 20009，已拒绝销售推荐20010
                this.selectedRoute.page = this.page
                const data = this.selectedRoute
                // 调度
                if (this.distinguishCharacter == 'DIS') {
                    if (this.btnIndex == 1) {
                        data.stepId = '20001'
                    } if (this.btnIndex == 2) {
                        data.stepId = '20002'
                    }
                    apiLogisticsSchemeDspt({data: data}).then( res => {
                        if (res.code == 200) {
                            this.listData = res.data.content || []
                            this.total = res.data.totalElements
                        }
                    })
                }
                // 销售/客户
                if (this.distinguishCharacter == 'SALE' || this.distinguishCharacter == 'ENT') {
                    // 销售
                    if (this.distinguishCharacter == 'SALE') {
                        // 销售还未操作第一次访问，初始化页面
                        if (this.confirmStatus == 0) {
                            data.mktFirst = 'true'
                        }
                        if (this.confirmStatus == 1) {
                            data.stepId = '20005'
                            data.mktFirst = 'false'
                        }
                        if (this.confirmStatus == 2) {
                            data.stepId = '20006'
                            data.mktFirst = 'false'
                        }
                    }
                    // 客户
                    if (this.distinguishCharacter == 'ENT') {
                        data.stepId = '20005'
                        data.mktFirst = 'false'
                    }
                    apiLogisticsSchemeMkt({data: data}).then( res => {
                        if (res.code == 200) {
                            this.listData = res.data.content || []
                            this.total = res.data.totalElements
                            // 销售
                            if (this.distinguishCharacter == 'SALE') {
                                // 控制销售同意隐藏按钮
                                if (this.listData[0].mktStepId == '20007') {
                                    this.isRecommend = 2
                                }
                                // 控制销售拒绝隐藏按钮，页面置灰
                                if (this.listData[0].mktStepId == '20008') {
                                    this.isRecommend = 1
                                }
                            }
                            // 客户
                            if (this.distinguishCharacter == 'ENT') {
                                // 控制销售同意隐藏按钮
                                if (this.listData[0].cstmStepId == '20009') {
                                    this.isRecommend = 3
                                }
                                // 控制销售拒绝隐藏按钮，页面置灰
                                if (this.listData[0].cstmStepId == '20010') {
                                    this.isRecommend = 1
                                }
                            }
                        }
                    })
                }
            },
            // 拒绝推荐
            refuseRecommend () {
                this.isModalRecommend = true
            },
            // 同意推荐
            agreeRecommend () {
                const data = {
                    freightReqCode: this.selectedRoute.freightReqCode,
                    flag: true,
                    roleType: this.distinguishCharacter
                }
                apiRecommendPass({ data: data }).then( res => {
                    if (res.code == 200) {
                        const passData = {
                            freightReqCode: this.selectedRoute.freightReqCode,
                            freightReqStatus: this.selectedRoute.freightReqStatus,
                            routeCode: this.selectedRoute.routeCode
                        }
                        if (this.distinguishCharacter == 'SALE') {
                            apiSaleAgreeRecommend({ data: passData }).then(res => {
                                this.$Message.info("推荐成功")
                                this.isRecommend = 2
                            })
                        }
                        if (this.distinguishCharacter == 'ENT') {
                            apiAgreeScheme({ data: passData }).then(res => {
                                this.$Message.info("推荐成功")
                                this.isRecommend = 3
                            })
                        }
                    }
                })
            },
            // 拒绝方案推荐保存
            save () {
                const data = {
                    freightReqCode: this.selectedRoute.freightReqCode,
                    flag: false,
                    roleType: this.distinguishCharacter,
                    remark: this.formInline.remark
                }
                this.$refs["formInline"].validate((valid) => {
                    if (valid) {
                        apiRecommendPass({ data: data }).then( res => {
                            if (res.code == 200) {
                                if (this.distinguishCharacter == 'SALE') {
                                    const passData = {
                                        freightReqCode: this.selectedRoute.freightReqCode,
                                        freightReqStatus: this.selectedRoute.freightReqStatus,
                                        routeCode: this.selectedRoute.routeCode
                                    }
                                    apiSaleRefuseRecommend({data: passData}).then(res => {
                                        this.$Message.info("拒绝成功")
                                    })
                                }
                                if (this.distinguishCharacter == 'ENT') {
                                    const passData = {
                                        freightReqCode: this.selectedRoute.freightReqCode,
                                        freightReqStatus: this.selectedRoute.freightReqStatus,
                                        routeCode: this.selectedRoute.routeCode,
                                        disagreeReason: this.formInline.remark
                                    }
                                    apiDisgreeScheme({data: passData}).then(res => {
                                        this.$Message.info("拒绝成功")
                                    })
                                }
                                this.isRecommend = 1
                                this.isModalRecommend = false
                                // 重置新增模态框
                                this.$refs.formInline.resetFields()
                            }
                        })
                    }
                })
            },
            // 取消货运需求
            cancel () {
                this.isModalRecommend = true
                // 重置新增模态框
                this.$refs.formInline.resetFields()
            },
            // 编辑货运要求
            handleFeatures () {
                // 客户跳转至简易货运要求页面
                if (this.distinguishCharacter == 'ENT') {
                    this.$router.push({ path: '/freight-request/simple-entry'})
                }
                // 销售/调度跳转至详细货运要求页面
                if (this.distinguishCharacter == 'SALE' || this.distinguishCharacter == 'DIS') {
                    this.$router.push({ path: '/freight-request/detail-entry'})
                }
            },
            // 路线切换
            clickPath (val) {
                // this.getData(val)
                this.processData(val)
                this.resetCheckStatus = false
                setTimeout(() => {
                    this.resetCheckStatus = true
                }, 100);
                // 重置勾选的方案
                this.selectListData = []
                this.selectList = []
            },
            // 货运要求列表传来的数据处理
            processData (val) {
                // console.log(val)
                const roadList = []
                const roadListData = val.roadList || []
                roadListData.forEach(item => {
                    roadList.push({
                        departurePort: item.departurePort,
                        destinationPort: item.destinationPort,
                        roadCode: item.roadCode,
                    })
                })
                // console.log(roadList)
                this.selectedRoute = {
                    freightReqCode: val.freightReqCode,
                    routeCode: val.routeCode,
                    routeList: roadList,
                    size: 6,
                    page: this.page
                }
                // console.log(this.selectedRoute)
                this.getData()
            },
            // tabs切换
            handleBtn (index) {
                this.btnIndex = index + 1
                // 判断当前是已确认还是未确认  1为已确认，2为未确认
                this.confirmStatus = this.btnIndex
                // 切换的时候将初始page
                this.page = '1'
                this.resetCheckStatus = false
                setTimeout(() => {
                    this.resetCheckStatus = true
                }, 100);
                // 重置勾选的方案
                this.selectListData = []
                this.selectList = []
                this.getData()
            },
            // 推荐勾选
            recommendCheck () {
                const data = this.selectListData
                // 调度推荐勾选
                if (this.distinguishCharacter == 'DIS') {
                    apiRecommendCheck({ data: data }).then(res => {
                        if (res.code == 200) {
                            const passData = {
                                freightReqCode: this.selectedRoute.freightReqCode,
                                freightReqStatus: this.selectedRoute.freightReqStatus,
                                routeCode: this.selectedRoute.routeCode
                            }
                            apiBakSale({data: passData}).then(res => {
                                this.$Message.info("推荐成功")
                            })
                        }
                    })
                }
                // 销售推荐勾选
                if (this.distinguishCharacter == 'SALE') {
                    apiRecommendCheckCstm({ data: data }).then(res => {
                        if (res.code == 200) {
                            this.$Message.info("推荐成功")
                        }
                    })
                }
            },
            // 推荐全部
            recommendAll () {
                // 调度推荐全部
                if (this.distinguishCharacter == 'DIS') {
                    const data = {
                        freightReqCode: this.selectedRoute.freightReqCode,
                        stepId: '20001'
                    }
                    apiRecommendAll({ data: data }).then(res => {
                        if (res.code == 200) {
                            const passData = {
                                freightReqCode: this.selectedRoute.freightReqCode,
                                freightReqStatus: this.selectedRoute.freightReqStatus,
                                routeCode: this.selectedRoute.routeCode
                            }
                            apiBakSale({data: passData}).then(res => {
                                this.$Message.info("推荐成功")
                            })
                        }
                    })
                }
                // 销售推荐全部
                if (this.distinguishCharacter == 'SALE') {
                    const data = {
                        freightReqCode: this.selectedRoute.freightReqCode,
                        stepId: ''
                    }
                    apiRecommendAllCstm({ data: data }).then(res => {
                        if (res.code == 200) {
                            this.$Message.info("推荐成功")
                        }
                    })
                }
            },
            // 推荐当前
            recommendCurrent () {
                // 调度推荐当前
                if (this.distinguishCharacter == 'DIS') {
                    const data = {
                        freightReqCode: this.selectedRoute.freightReqCode,
                        routeCode: this.selectedRoute.routeCode,
                        stepId:"20001",
                        cstmStepId:"",
                        mktFirst:"",
                        roleType: this.distinguishCharacter,
                        routeList: this.selectedRoute.routeList
                    }
                    // console.log(data)
                    apiRecommendRoute({ data: data }).then(res => {
                        if (res.code == 200) {
                            const passData = {
                                freightReqCode: this.selectedRoute.freightReqCode,
                                freightReqStatus: this.selectedRoute.freightReqStatus,
                                routeCode: this.selectedRoute.routeCode
                            }
                            apiBakSale({data: passData}).then(res => {
                                this.$Message.info("推荐成功")
                            })
                        }
                    })
                }
                // 销售推荐当前
                if (this.distinguishCharacter == 'SALE') {
                    const data = {
                        freightReqCode: this.selectedRoute.freightReqCode,
                        routeCode: this.selectedRoute.routeCode,
                        stepId: "",
                        cstmStepId: "",
                        mktFirst: "false",
                        roleType: this.distinguishCharacter,
                        routeList: this.selectedRoute.routeList
                    }
                    apiRecommendRouteCstm({ data: data }).then(res => {
                        if (res.code == 200) {
                            this.$Message.info("推荐成功")
                        }
                    })
                }
            },
            // 勾选数据
            checkData (data, status) {
                data.check = status
                if (status == true) {
                    this.selectList.push(data)
                }
                // 数组去重
                let transiteArr = new Set(this.selectList)
                let transiteArrTwo = Array.from(transiteArr)
                let transiteArrThree = []
                // 将未勾选的数组去除掉
                transiteArrTwo.forEach( element => {
                    if (element.check == true) {
                        transiteArrThree.push(element)
                    }
                })
                this.selectListData = transiteArrThree
                // 数据组装
                const transiteArrFour = []
                transiteArrThree.forEach(item => {
                    const obj = {
                        logisticsSchemeCode: item.logisticsSchemeCode,
                        freightReqCode: item.freightReqCode,
                        routeCode: item.routeCode
                    }
                    transiteArrFour.push(obj)
                })
                this.selectListData = transiteArrFour
                console.log(this.selectListData)
            },
            // 发起委托
            delegate (val) {
                const data = val
                this.$router.push({ path: '/logisstics-commission/add-single', query:{data:JSON.stringify(data)} })
            },
            // 收藏
            collect (val) {
                console.log("收藏")
            },
            // 取消收藏
            uncollect (val) {
                console.log("收藏")
            },
            // 推荐客户/销售
            recommend (val) {
                const data = [{
                    logisticsSchemeCode: val.logisticsSchemeCode,
                    freightReqCode: val.freightReqCode,
                    routeCode: val.routeCode
                }]
                // 调度推荐销售
                if ( this.distinguishCharacter == 'DIS') {
                    apiRecommendCheck({data: data}).then(res => {
                        if (res.code == 200) {
                            const passData = {
                                freightReqCode: val.freightReqCode,
                                freightReqStatus: val.freightReqStatus,
                                routeCode: val.routeCode
                            }
                            apiBakSale({data: passData}).then(res => {
                                this.$Message.info("推荐成功")
                            })
                        }
                    })
                }
                // 销售推荐给客户
                if (this.distinguishCharacter == 'SALE') {
                    apiRecommendCheckCstm({ data: data }).then(res => {
                        if (res.code == 200) {
                            this.$Message.info("推荐成功")
                        }
                    })
                }
            },
            // 编辑方案
            edit (val) {
                const data = val
                window.sessionStorage.setItem('logisticsData', JSON.stringify(data))
                this.$router.push({ path: '/logistics-solutions/confirmation-logistics-plan'})
            },
            // 方案详情
            detail (val) {
                const data = val
                window.sessionStorage.setItem('logisticsData', JSON.stringify(data))
                this.$router.push({ path: '/logistics-solutions/scheme-details'})
            },
            // 调度确认方案
            confirm (val) {
                const data = val
                window.sessionStorage.setItem('logisticsData', JSON.stringify(data))
                this.$router.push({ path: '/logistics-solutions/determine-logistics-solution-service-provider'})
            },
            // 删除
            remove (val) {}
        },
    }
</script>

<style lang="scss" scoped>
    .content-none {
        pointer-events: none;
        opacity: 0.5;
        // cursor: not-allowed;
    }
    .btn-audit {
        float: right;
        margin-right: 20px;
        margin-top: -7px;
        .btn-recommend {
            width: 120px;
            margin-left: 20px;
            border: 1px solid
        }
    }
    .alart-box{
        margin-top: 10px;
        padding-left: 70px;
        /deep/.ivu-alert-icon {
            padding-left: 30px;
            padding-top: 2px;
        }
    }
    .search-condition {
        display: flex;
        span{
        min-width: 70px;
        line-height: 30px;
    }
    }
    .line-margin {
        margin-left: 30px;
    }
    .icon-action {
        margin: 0 10px;
    }
    .btn-pagina {
        display: flex;
        padding: 10px 0 0 0;
        .title {
            font-size: $font-size-large;
            font-family: Microsoft YaHei;
            font-weight: 400;
            width: 50%;
        }
        .btn-tabs{
            display: -webkit-inline-box;
            width: 50%;
            .adt-button {
                width: 100%;
            }
        }
    }
</style>
