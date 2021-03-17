<template>
    <div id="OnceEntrustEntering" :class="{ 'is-detail': isDetail }">
        <!-- 路线tab -->
        <line-info v-if="hasRoute" :routeResList="formData.entrustRouteListReq" type="isBig"/>
        <!-- 单次物流委托编号 -->
        <div v-if="isDetail" class="entrust-number">单次物流委托编号：GV000</div>
        <!-- 进度tab -->
        <adt-progress-tab :tabs="baseInfoTabs" :allowClick="allowclick" :activeIndex="baseInfoActiveIndex" @click-tab="clickTab" class="base-info-tabs"/>
        <!-- 通知人信息 isDetail-->
        <recipient-information :defaultData="formData.entrustContactListReq" @submit-form="submitCustomsInformation" v-if="baseInfoActiveIndex === 0" :isDetail="isDetail" />
        <!-- 货物信息 isDetail-->
        <div v-show="baseInfoActiveIndex === 1">
            <cargo-info ref="childForm" :defaultData="formData.entrustCargoListReq" :isDetail="isDetail" @submit-form="submitCargoInfo"/>
            <div v-if="!isDetail" class="public-btns-group">
                <Button type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
                <Button shape="circle" size="large" @click="addCargoInfo">添加货物信息</Button>
                <Button shape="circle" size="large" @click="delCargoInfo">删除</Button>
            </div>
        </div>
        <!-- 集装箱信息 isDetail-->
        <container-information :defaultData="formData.entrustContainerListReq" @submit-form="submitContainerInfo" v-if="baseInfoActiveIndex === 2" :isDetail="isDetail"/>
        <!-- 时间费用信息 -->
        <time-cost-information :defaultData="formData.entrustTimeReq" @submit-form="submitTimeCostInfo" v-if="baseInfoActiveIndex === 3" :isDetail="isDetail"/>
        <!-- 报关要求 isDetail-->
        <customs-clearance-req :defaultData="formData.entrustAdressReq" @submit-form="submitCustomsInfo" v-if="baseInfoActiveIndex === 4" :isDetail="isDetail"/>
        <!-- 备注信息 isDetail-->
        <remarks :defaultData="formData.entrustRemark" @send-form="sendForm" @submit-form="submitRemarksInfo" v-if="baseInfoActiveIndex === 5" :isDetail="isDetail"/>
    </div>
</template>

<script>
    import { apiAddSingleOrder,apiGetOnceEntrustDetails } from '@/api/logisticsEntrust'
    import { deepClone } from '@/libs/utils'
    import { dealCargo,dealRoute,dealContainer } from './utils/entrustTranslate'
    export default {
        components: {
            LineInfo:()=>import('./components/LineInfo'), //路线组件
            CargoInfo:()=>import('./components/CargoInfo'), //货物信息
            ContainerInformation:()=>import('./components/ContainerInformation'), //集装箱
            RecipientInformation:()=>import('./components/RecipientInformation'), //通知人信息
            TimeCostInformation:()=>import('./components/TimeCostInformation'), //时间费用(指定节点)
            CustomsClearanceReq:()=>import('./components/CustomsClearanceReq'), //报关地区要求
            Remarks:()=>import('./components/Remarks') //备注
        },
        data(){
            return {
                allowclick: true, //默认允许点击
                isDetail: Boolean(this.$route.query.isDetail), // 查看详情
                hasRoute: true, // 从方案进入，有路线信息，不展示路线信息tab
                baseInfoTabs: ['通知人信息', '货物信息', '集装箱信息', '时间费用要求','报关要求', '备注'],
                baseInfoActiveIndex: 0, //默认处于通知人信息 0
                formData: JSON.parse(sessionStorage.getItem("OnceEntrustsave")||0)||{
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
                            trspMode: 'AIRLIFT' //运输方式 key TRANSPORT_MODE // 轮 水 WATERWAY 空 AIRLIFT 公 PUBROAD 铁 RAILWAY
                        }
                    ], // 带方案 路线信息
                    entrustContactListReq: [], //通知人信息 entrustContactListReq
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
                    ], //集装箱信息
                    entrustTimeReq: {
                        lastStartPort:'', //启运地点
                        lastArrivePort:'', //运抵地点
                        cargoReadyTime:null, //货好时间
                        lastStartTime:null, //启运时间
                        lastArriveTime:null, //运抵时间
                        lastDeliveryTime:null, //最迟交货时间
                        lowestTimeReq:'', //最低时长要求
                        lowestTimeUnit: 'H', //时长要求单位
                        highestCostReq: ''  //最高费用要求
                    }, //时间 费用
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
        created() {
            if (this.$route.query.isDetail) {
                this.getDetails() //详情获取
            }
        },
        methods:{
            // 切换当前tab
            clickTab(index) {
                this.baseInfoActiveIndex = index
            },
            // 保存通知人信息 0
            submitCustomsInformation (info) {
                this.formData.entrustContactListReq = JSON.parse(JSON.stringify(info))
                // console.log(this.formData,"保存通知人信息");
                this.baseInfoActiveIndex++
            },
            // 保存货物信息 1
            submitCargoInfo (info) {
                this.formData.entrustCargoListReq = JSON.parse(JSON.stringify(info))
                // console.log(this.formData,"保存货物信息");
                this.baseInfoActiveIndex++
            },
            // 保存集装箱信息 2
            submitContainerInfo (info) {
                this.formData.entrustContainerListReq = JSON.parse(JSON.stringify(info))
                // console.log(this.formData,"保存集装箱信息");
                this.baseInfoActiveIndex++
            },
            // 保存时间费用要求 3
            submitTimeCostInfo (info) {
                this.formData.entrustTimeReq = info //JSON.parse(JSON.stringify(info))
                this.formData.entrustTimeReq.lowestTimeReq = Number(info.lowestTimeReq) || 0; // 最低时长
                this.formData.entrustTimeReq.highestCostReq = Number(info.highestCostReq) || 0; // 最高费用要求
                this.formData.entrustTimeReq.lastArriveTime = info.lastArriveTime || null; // 最高费用要求
                this.formData.entrustTimeReq.cargoReadyTime = info.cargoReadyTime || null; // 最高费用要求
                this.formData.entrustTimeReq.lastDeliveryTime = info.lastDeliveryTime || null; // 最高费用要求
                this.formData.entrustTimeReq.lastStartTime = info.lastStartTime || null; // 最高费用要求
                console.log(this.formData.entrustTimeReq,"保存时间费用要求")
                this.baseInfoActiveIndex++
            },
            // 保存报关要求 4
            submitCustomsInfo (info) {
                this.formData.entrustAdressReq = JSON.parse(JSON.stringify(info))
                // console.log(this.formData,"保存报关要求");
                this.baseInfoActiveIndex++
            },
            // 保存备注(进行保存sessionStorge操作) 5
            submitRemarksInfo (info) {
                this.formData.entrustRemark = JSON.parse(JSON.stringify(info));
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
                });
                let parms = {
                    // 联系人信息 发货人 收货人 通知人
                    entrustContactListReq: [this.formData.entrustContactListReq[0],this.formData.entrustContactListReq[1],this.formData.entrustContactListReq[2]],
                    // 货物信息[] (及其包装信息[])
                    entrustCargoListReq: cargoParms.arr,
                    // 路线信息[] 带方案 直接获取
                    entrustRouteListReq: routeParms.arr,
                    // 集装箱信息[]
                    entrustContainerListReq: containerParms.arr,
                    // 委托基础数据
                    remark: this.formData.entrustRemark.desc || '', //备注信息
                    ...this.formData.entrustTimeReq, //时间费用要求 解构赋值
                    curr: '元', //货币单位 原型未涉及 写死?
                    imPort: str1, // 进口报关地
                    exPort: str2, // 出口报关地
                    bondPort: bondPortstr, // 综保区报关地(多个 ;连接)
                    customsClearanceReq: this.formData.entrustAdressReq.customsClearanceReq || '2', //是否需要报关服务 2不需要
                    freightReqCode: routeParms.arr.length? String(parseInt(Math.random()*100000)):undefined, //no 货运需求编号
                    logisticsSchemeCode: '123456789' || String(Math.random()*10000) //no 物流方案编号
                }
                let ObjData = JSON.parse(JSON.stringify(parms));
                // console.log(ObjData,"parms1");
                // console.log(JSON.stringify(ObjData),"parms2"); //成功后直接跳转到单次列表
                apiAddSingleOrder({data:ObjData}).then((res) => {
                    if (res.code == 200) { //新增成功
                        this.$Message.success({content:res.message})
                        // sessionStorage.setItem("OnceEntrustsave",JsonData)
                        // sessionStorage.setItem("allowClick",false) //保存之后不可点击
                    }
                });
            },
            // 详情界面可以 发送操作 (调用发送接口,成功后隐藏发送按钮) 5
            sendForm (info) {
                this.formData.entrustRemark = info //JSON.parse(JSON.stringify(info))
                // imPortArea exPortArea
                // let ObjData = deepClone(this.formData) // JSON.parse(JSON.stringify(this.formData));
                // let status = sessionStorage.getItem("allowClick"),type=true; //默认是可以点击的类型
                // switch(status){
                //     case false: type = false //保存过 不可以进行保存
                //         break;
                //     default: type = true //允许保存 可以进行保存
                // }
                // if (type) { //保存并发送
                //     console.log('保存并发送');
                // }else if(type == false) { //已经保存 直接发送
                //     console.log('已经保存直接发送');
                // }
                console.log(this.formData,"this.formData");
                // console.log(ObjData,"ObjData {}");
                // console.log(JSON.parse(JSON.stringify(this.formData)),"formData JSON");
                // 发送接口
                // sessionStorage.setItem("allowClick",false) //发送之后不可点击
                // setTimeout(()=>{
                //     this.allowClick = false;
                // },5000)
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
            getDetails() {
                let data = this.$route.query
                apiGetOnceEntrustDetails({entrustCode:data.entrustCode,isDetail:data.isDetail }).then((res)=>{
                    if (res.code == 200) {
                        //cooperationType == 'C' //S //cooperationTypeTranslate
                        // this.Message.success({content:res.message})
                        // this.formData
                    }
                });
            }
        },
        beforeDestroy(){
            sessionStorage.clear()
        }
    }
</script>

<style lang="scss" scoped>
#OnceEntrustEntering{
    .base-info-tabs {
        padding-bottom: 30px;
    }
}
    
</style>