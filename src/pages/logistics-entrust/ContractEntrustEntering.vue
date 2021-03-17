<template>
    <div class="contract-entrust-entering" :class="{ 'is-detail': isDetail }">
        <!-- 路线方案 -->
        <line-info v-if="hasRoute" :routeResList="formData.entrustRouteListReq" type="isBig"></line-info>
        <!-- 规律性合同委托编号 -->
        <div v-if="isDetail" class="entrust-number">规律性合同委托编号：GV000</div>
        <!-- 0 路线 1 合同 2 合同单次(规律 非规律) -->
        <adt-progress-tab :tabs="tabs" :activeIndex="activeIndex" :allowClick="isDetail" class="main-tabs" type="btn" @click-tab="clickTab"></adt-progress-tab>
        <!-- 录入路线信息 -->
        <route-information v-show="!hasRoute && activeIndex === 0" @submit-form="submitRouteInfo"></route-information>
        <!-- 合同委托基本信息 -->
        <div v-if="(!hasRoute && activeIndex === 1) || (hasRoute && activeIndex === 0 )">
            <adt-progress-tab :tabs="baseInfoTabs" :activeIndex="baseInfoActiveIndex" :allowClick="allowclick" class="base-info-tabs" @click-tab="clickBaseInfoTab"></adt-progress-tab>
            <!-- 基本信息 -->
            <base-info v-show="baseInfoActiveIndex === 0" :defaultData="formData.periodEntrustBaseReq" :isDetail="isDetail" @submit-form="submitBaseInfo"></base-info>
            <!-- 货物信息 -->
            <div v-show="baseInfoActiveIndex === 1">
                <cargo-info ref="childForm" :defaultData="formData.entrustCargoListReq" :isDetail="isDetail" @submit-form="submitCargoInfo"></cargo-info>
                <div v-if="!isDetail" class="public-btns-group">
                    <Button type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
                    <Button shape="circle" size="large" @click="addCargoInfo">添加货物信息</Button>
                    <Button shape="circle" size="large" @click="delCargoInfo">删除</Button>
                </div>
            </div>
            <!-- 集装箱信息 -->
            <container-information v-show="baseInfoActiveIndex === 2" :defaultData="formData.entrustContainerListReq" :isDetail="isDetail" @submit-form="submitContainerInfo"></container-information>
            <!-- 费用要求 -->
            <cost-info v-show="baseInfoActiveIndex === 3" :defaultData="formData.entrustCostReq" :isDetail="isDetail" @submit-form="submitCostInfo"></cost-info>
            <!-- 报关要求 -->
            <customs-clearance-req v-show="baseInfoActiveIndex === 4" :defaultData="formData.entrustAdressReq" :isDetail="isDetail" @submit-form="submitCustomsInfo"></customs-clearance-req>
            <!-- 备注 -->
            <remarks v-show="baseInfoActiveIndex === 5" :Type="true" :defaultData="formData.entrustRemark" :isDetail="isDetail" @submit-form="submitRemarksInfo"></remarks>
        </div>
        <!-- 单次委托信息规律规则 -->
        <once-entrust-info-gl v-show="((!hasRoute && activeIndex === 2) || (hasRoute && activeIndex === 1 )) && formData.periodEntrustBaseReq.entrustType === 'R'" :isDetail="isDetail"></once-entrust-info-gl>
        <!-- 自测用 -->
        <!-- <once-entrust-info-gl v-show="((!hasRoute && activeIndex === 2) || (hasRoute && activeIndex === 1 ))" :isDetail="isDetail"></once-entrust-info-gl> -->
        <!-- 单次委托信息非规律 -->
        <once-entrust-info-fgl v-show="((!hasRoute && activeIndex === 2) || (hasRoute && activeIndex === 1 )) && formData.periodEntrustBaseReq.entrustType === 'I'" :isDetail="isDetail"></once-entrust-info-fgl>
        <!-- 自测用 -->
        <!-- <once-entrust-info-fgl v-show="((!hasRoute && activeIndex === 2) || (hasRoute && activeIndex === 1 ))" :isDetail="isDetail"></once-entrust-info-fgl> -->
    </div>
</template>

<script>
    import {
        apiAddperiodEntrustBase,
        apiGetPeriodBaseDetails,
        apiGetPeriodOnceNumber,
        apiGetPeriodOnceDetail
    } from '@/api/logisticsEntrust'
    import { deepClone } from '@/libs/utils'
    import { dealCargo,dealRoute,dealContainer } from './utils/entrustTranslate'
    export default {
        components: {
            RouteInformation: ()=>import('./components/RouteInformation'), //路线信息组件
            BaseInfo: ()=>import('./components/BaseInfo'), //合同基本信息组件
            CargoInfo: ()=>import('./components/CargoInfo'), //货物信息组件
            ContainerInformation: ()=>import('./components/ContainerInformation'), //集装箱信息组件
            CostInfo: ()=>import('./components/CostInfo'), //合同费用要求组件
            CustomsClearanceReq: ()=>import('./components/CustomsClearanceReq'), //报关要求组件
            Remarks: ()=>import('./components/Remarks'), //备注组件
            OnceEntrustInfoGl: ()=>import('./components/OnceEntrustInfoGl'), //合同单次 规律组件
            OnceEntrustInfoFgl: ()=>import('./components/OnceEntrustInfoFgl'), //合同单次 非规律组件
            LineInfo: ()=>import('./components/LineInfo') //带方案组件
        },
        data () {
            return {
                isDetail:  Boolean(this.$route.query.isDetail), // 查看详情
                allowclick: true, // 允许点击
                hasRoute: true, // 从方案进入，有路线信息，不展示路线信息tab
                tabs: ['路线信息', '合同委托基本信息', '单次委托信息'],
                baseInfoTabs: ['基本信息', '货物信息', '集装箱信息', '费用要求', '报关要求', '备注'],
                activeIndex: 0, //路线 合同 合同单次 导航下标
                baseInfoActiveIndex: 0, // 合同委托基本信息等activeIndex
                // JSON.parse(sessionStorage.getItem("contractEntrustsave")||0)||
                formData: {
                    periodEntrustBaseReq: {
                        entrustType: 'I', // 委托类型 R I 规律 非规律
                        startPeriod: null, // 合同委托起期 time
                        untilPeriod: null, // 合同委托止期 time
                        cargoTotal: '', // 货物总量 number
                        entrustPeriod: '', // 委托周期 number
                        entrustPeriodUnit: '天', //委托周期单位
                        cooperationType: 'D' //合作模式  C合同 S 单次
                    }, //基本信息
                    entrustRouteListReq: [
                        {
                            routeCode: String(Math.random()*10000), //路线编码 no have routeCode
                            roadCode: String(Math.random()*10000), //路段编码 no have roadCode
                            // trspModeTranslate: '公路', //运输方式 name
                            // logisticsTypeTranslate: '国际', // 物流类型 name I 国际 N 国内 B 保税
                            // logisticsType: "N", // 物流类型 key I 国际 N 国内 B 保税
                            // trspTypeTranslate: '集装箱', //运输类型 name
                            // trspType: 'C', //运输类型 key C 集装箱 B 件杂货
                            departurePort: 'AD_ONE', // 启运地点key
                            departurePortTranslate: '重庆', //启运地点name
                            destinationPort: 'AD_TWO', // 运抵地点key
                            destinationPortTranslate: '北京', //运抵地点name
                            trspMode: 'AIRLIFT' //运输方式 TRANSPORT_MODE // 轮 水 WATERWAY 空 AIRLIFT 公 PUBROAD 铁 RAILWAY
                        }
                    ], // 带方案 路线信息 entrustRouteListReq
                    entrustCargoListReq: [
                        // {
                        //     checked: false, //选中框
                        //     cargoName: 'k', //货物名称
                        //     markNo: '', //唛头
                        //     hsCode: '', //HS编码
                        //     grossWeight: '', //毛重
                        //     netWeight: '', //净重
                        //     cargoQty: '', //货物件数
                        //     cargoVol: '', //货物体积
                        //     cargoType: '', //货物类型
                        //     suitableTemperature: '', //货物适宜温度
                        //     assignTemperature: '' //指定温度
                        //     firstPackageType: '', //一级包装类型
                        //     firstGrossWeight: '', //一级包装毛重
                        //     firstNetWeight: '', //一级包装净重
                        //     firstPackQty: '', //一级包装件数
                        //     firstPackVol: '', //一级包装体积
                        //     secondPackageType: '', //二级包装类型
                        //     secondGrossWeight: '', //二级包装毛重
                        //     secondNetWeight: '', //二级包装净重
                        //     secondPackQty: '', //二级包装件数
                        //     secondPackVol: '', //二级包装体积
                        // }
                    ], //货物信息 entrustCargoListReq
                    entrustContainerListReq: [
                        {
                            roadCode: String(Math.random()*10000), //包装信息 路线编码 no have roadCode
                            routeCode: String(Math.random()*10000), //包装信息 路段编码 no have routeCode
                            transportType:'',
                            contaSize:'',
                            suitcaseQty:'',
                            containerSource: '',
                            suitcaseType:'',
                            titleName:"重庆"
                        }, //集装箱1
                        {
                            roadCode: String(Math.random()*10000), //包装信息 路线编码 no have roadCode
                            routeCode: String(Math.random()*10000), //包装信息 路段编码 no have routeCode
                            transportType:'',
                            contaSize:'',
                            suitcaseQty:'',
                            containerSource: '',
                            suitcaseType:'',
                            titleName:"重庆-北京"
                        }, //集装箱2
                        {
                            roadCode: String(Math.random()*10000), //包装信息 路线编码 no have roadCode
                            routeCode: String(Math.random()*10000), //包装信息 路段编码 no have routeCode
                            transportType:'', //运输类型
                            contaSize:'', //集装箱尺寸
                            suitcaseQty:'', //箱量
                            containerSource: '', //来源
                            suitcaseType:'', //提箱类型
                            titleName:"北京"
                        } //集装箱3
                    ], //集装箱信息 entrustContainerListReq
                    entrustCostReq: {
                        highestCostReq: ''  //最高费用要求
                    }, //费用 要求
                    entrustAdressReq: {
                        customsClearanceReq:'2',
                        imPortDefault: '',
                        imPortArea: '',
                        exPortDefault: '',
                        exPortArea: '',
                        customsClearanceArea:[]
                    }, //报关要求
                    entrustRemark: {
                        desc: ''
                    } //备注
                }
            }
        },
        created () {
            // 从方案进入，有路线信息，不展示路线信息tab
            if (this.hasRoute) {
                this.tabs.shift()
            }
            if (this.$route.query.isDetail) {
                this.getDetails() //详情获取
            }
        },
        methods: {
            // 保存路线
            submitRouteInfo (info) {
                this.formData.entrustRouteListReq = info
                this.activeIndex++
            },
            // 保存基本信息
            submitBaseInfo (info) {
                this.formData.periodEntrustBaseReq = deepClone(info) //有时间 禁JSON
                this.formData.periodEntrustBaseReq.cooperationType = 'C' //合作模式  C合同 S 单次
                // console.log(this.formData.periodEntrustBaseReq,'合同委托基本信息');
                this.baseInfoActiveIndex++
            },
            // 保存货物信息
            submitCargoInfo (info) {
                this.formData.entrustCargoListReq = deepClone(info)
                this.baseInfoActiveIndex++
            },
            // 保存集装箱信息
            submitContainerInfo (info) {
                this.formData.entrustContainerListReq = deepClone(info)
                this.baseInfoActiveIndex++
            },
            // 保存费用要求
            submitCostInfo (info) {
                this.formData.entrustCostReq = deepClone(info)
                this.baseInfoActiveIndex++
            },
            // 保存报关要求
            submitCustomsInfo (info) {
                this.formData.entrustAdressReq = deepClone(info)
                this.baseInfoActiveIndex++
            },
            // 保存备注 测试用
            submitRemarksInfow () {
                this.formData.periodEntrustBaseReq.entrustType = 'R' || 'I' //规律 非规律
                this.activeIndex++ //打开单次录入
            },
            // 保存备注 下一步
            submitRemarksInfo (info) {
                this.formData.entrustRemark = deepClone(info)
                let cargoArr = [],routeArr=[],conArr=[]; //货物包装 路线参数 集装箱 组装数组参数
                // 货物包装参数处理
                let cargoParms = dealCargo(this.formData.entrustCargoListReq)
                // 路线参数处理
                let routeParms = dealRoute(this.formData.entrustRouteListReq)
                // 集装箱参数处理
                let containerParms = dealContainer(this.formData.entrustContainerListReq)
                // 进口报关地 处理
                let imstr1 = this.formData.entrustAdressReq.imPortDefault
                let imstr2 = this.formData.entrustAdressReq.imPortArea
                let str1 = imstr1&&imstr1.replace(/~/g,";") + ';' + imstr2 ||''
                // 出口报关地 处理
                let exstr1 = this.formData.entrustAdressReq.exPortDefault
                let exstr2 = this.formData.entrustAdressReq.exPortArea
                let str2 = exstr1&&exstr1.replace(/~/g,";") + ';' + exstr2 ||''
                // 综保区报关地(['1','2'])
                let bondPortstr = [];
                this.formData.entrustAdressReq.customsClearanceArea && this.formData.entrustAdressReq.customsClearanceArea.forEach((item)=>{
                    bondPortstr.push(String(item));
                })
                let parms = {
                    // 合同委托基本信息
                    ...this.formData.periodEntrustBaseReq,
                    // 货物包装信息[] (及其包装信息[])
                    entrustCargoListReq: cargoParms.arr,
                    // 路线信息[] 带方案 直接获取
                    entrustRouteListReq: routeParms.arr,
                    // 集装箱信息[]
                    entrustContainerListReq: containerParms.arr,
                    // 委托基础数据
                    remark: this.formData.entrustRemark.desc || '', //备注信息
                    highestCostReq: Number(this.formData.entrustCostReq.highestCostReq) || 0, //最高费用要求
                    curr: '元', //货币单位 原型未涉及 写死?
                    imPort: str1, // 进口报关地
                    exPort: str2, // 出口报关地
                    bondPort: bondPortstr, // 综保区报关地(多个 ;连接)
                    freightReqCode: routeParms.arr.length? String(parseInt(Math.random()*100000)):undefined, //no 货运需求编号
                    logisticsSchemeCode: '123456789' || String(Math.random()*10000) //no 物流方案编号
                }
                let ObjData = JSON.parse(JSON.stringify(parms));
                // 处理时间为空的情况
                ObjData.startPeriod = ObjData.startPeriod? ObjData.startPeriod: null // 合同委托起期 time
                ObjData.untilPeriod = ObjData.untilPeriod? ObjData.untilPeriod: null // 合同委托止期 time
                // console.log(ObjData,"parms1");
                // console.log(JSON.stringify(ObjData),"JSON");
                apiAddperiodEntrustBase({data:ObjData}).then((res) => {
                    if (res.code == 200) { //新增成功
                        let data = res.data || {
                            createBy: "测试人",
                            createDataTime: 1605779140000,
                            entrustCode: "LT202011191745403629",
                            freightReqCode: "9276.868454238944"
                        }
                        let deepItem = deepClone(this.formData)
                        // 启运 运抵 节点 key code
                        deepItem.routeCode = containerParms.routeCode //路线编号 一致
                        deepItem.departurePortName = routeParms.departurePortName // 第一段启运地点 port name
                        deepItem.destinationPortName = routeParms.destinationPortName // 最后一段运抵地点 port name
                        deepItem.lastStartPort = routeParms.lastStartPort // 第一段启运地点 port key
                        deepItem.lastArrivePort = routeParms.lastArrivePort // 最后一段运抵地点 port key
                        deepItem.lastStartLoad = containerParms.lastStartLoad // 第一个路段 节点编号
                        deepItem.lastArriveLoad = containerParms.lastArriveLoad // 最后一个路段 节点编号
                        deepItem.entrustCode = data.entrustCode //委托编号
                        // deepItem.freightReqCode = data.freightReqCode // 方案编号
                        deepItem.periodEntrustBaseReq.startPeriod = this.formData.periodEntrustBaseReq.startPeriod.toISOString()
                        deepItem.periodEntrustBaseReq.untilPeriod = this.formData.periodEntrustBaseReq.untilPeriod.toISOString()
                        // startPeriod: '', // 合同委托起期 time
                        // untilPeriod: '', // 合同委托止期 time
                        sessionStorage.setItem("contractEntrustsave",JSON.stringify(deepItem))
                        // ObjData.entrustType // R 规律 I 非规律
                        this.formData.periodEntrustBaseReq.entrustType = ObjData.entrustType || 'R'
                        this.activeIndex++ //打开单次录入
                    }
                })
            },
            submitForm () {
                this.$refs['childForm'].submitForm()
            },
            addCargoInfo () {
                this.$refs['childForm'].addCargoInfo()
            },
            delCargoInfo () {
                this.$refs['childForm'].delCargoInfo()
            },
            clickTab (index) {
                this.activeIndex = index
            },
            clickBaseInfoTab (index) {
                this.baseInfoActiveIndex = index
            },
            getDetails() {
                let data = this.$route.query
                apiGetPeriodBaseDetails({entrustCode: data.isDetail }).then((res)=>{
                    if (res.code == 200) {
                        // let pageinfo = res.data
                        // pageinfo.entrustCargoListReq = JSON.parse(JSON.stringify(pageinfo.entrustCargoRes))
                        // pageinfo.entrustRouteListReq = deepRes(pageinfo.entrustRouteListRes)
                        // pageinfo.customsClearanceReq = '2' //默认不需要报关服务
                        // delete pageinfo.entrustRouteListRes //删除减少 双向绑定
                        // delete pageinfo.entrustCargoRes //删除减少 双向绑定
                        // console.log(pageinfo, "回参 渲染");
                        // cooperationType == 'C' //S //cooperationTypeTranslate
                        // this.Message.success({content:res.message})
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .contract-entrust-entering {
        margin-top: 10px;
        .main-tabs {
            padding-bottom: 30px;
        }
        .base-info-tabs {
            margin-bottom: 30px;
            padding-top: 30px;
            border-top: 1px solid #999;
        }
        .entrust-number {
            margin-bottom: 30px;
            padding-bottom: 20px;
            font-size: 16px;
            border-bottom: 1px solid #c8c8c8;
        }
    }
</style>
