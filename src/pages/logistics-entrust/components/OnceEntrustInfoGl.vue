<template>
    <div>
        <div v-show="!hasSubmit" class="public-form-card">
            <Form :model="formItem" :rules="ruleValidate" ref="formItemData" :label-width="200" label-colon>
                <div class="public-form-card">
                    <Row>
                        <Col span="24">
                            <FormItem label="开始时间" prop="startDate">
                                <DatePicker v-model="formItem.startDate" type="date"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </Form>
            <cargo-info ref="childForm" @submit-form="submitCargoInfo" :isDisabled="true"></cargo-info>
            <div v-if="!isDetail" class="public-btns-group">
                <Button type="primary" shape="circle" size="large" @click="submitForm">保存</Button>
                <Button shape="circle" size="large" @click="send">发送</Button>
                <Button shape="circle" size="large" @click="addCargoInfo">添加货物信息</Button>
                <Button shape="circle" size="large" @click="choosePeople">选择通知人信息</Button>
                <Button shape="circle" size="large" @click="setTimeDemand">设置时间要求</Button>
                <Button shape="circle" size="large" @click="delCargoInfo">删除</Button>
            </div>
            <set-time-demand :showDrawer="showSetTimeDrawer" @on-ok="submitTimeDemand" @on-visible-change="setTimeVisiableChange"></set-time-demand>
            <choose-people :showDrawer="showPeopleDrawer" @on-ok="submitPeople" @on-visible-change="peopleVisiableChange"></choose-people>
        </div>
        <once-entrust-info-fgl v-show="hasSubmit" :defaultData="entrustList"></once-entrust-info-fgl>
    </div>
</template>

<script>
    import CargoInfo from './CargoInfo'
    // import SetTimeDemand from './SetTimeDemand'
    import ChoosePeople from './ChoosePeople'
    import OnceEntrustInfoFgl from './OnceEntrustInfoFgl'
    import validateRules from '@/libs/validateRules'
    import { apiAddperiodOnceEntrust,apiAddGeneratePeriodEntrust } from '@/api/logisticsEntrust'
    export default {
        components: {
            CargoInfo,
            SetTimeDemand: ()=>import('./SetTimeDemand'),
            ChoosePeople,
            OnceEntrustInfoFgl
        },
        props: {
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                hasSubmit: false, // 是否保存
                entrustList: [],
                formItem: {
                    startDate: ''
                },
                ruleValidate: {
                    startDate: [
                        {
                            required: true,
                            validator: validateRules.validateTime,
                            trigger: 'change'
                        }
                    ]
                },
                showSetTimeDrawer: false,
                showPeopleDrawer: false
            }
        },
        methods: {
            submitCargoInfo (info) {
                this.formItem.entrustCargoReq = info
                // 发送请求提交单次委托内容，生成规则，现在录入委托页面 apiAddperiodOnceEntrust
                console.log(this.formItem) //periodEntrustBaseReq
                let onceCode='',onceType='',entrustCode=''
                let contractData = JSON.parse(sessionStorage.getItem('contractEntrustsave'))
                if (contractData) { //没有直接返回
                    onceCode = JSON.parse(sessionStorage.getItem('contractEntrustsave')).routeCode || false //默认路线 编号
                    entrustCode = JSON.parse(sessionStorage.getItem('contractEntrustsave')).entrustCode || "" //默认 无编号
                    onceType = JSON.parse(sessionStorage.getItem('contractEntrustsave')).periodEntrustBaseReq.entrustType == 'R'? 0 : 1 //默认 规律
                    if(!onceCode)return
                }else{
                    console.log('请检查参数,session丢失');
                    return
                }
                let JsonData = JSON.parse(JSON.stringify(this.formItem)) //深拷贝 变时间戳
                // this.formData.periodEntrustBaseReq.cooperationType = 'C' //合作模式 C合同 S 单次
                let cargoArr = [],userArr=[]; //货物包装 路线参数 集装箱 联系人 组装数组参数
                // 联系人 参数处理
                JsonData.contactReqList.forEach((ele,idx) => {
                    idx = idx + 1 // 联系人 类型 默认字符串 1 2 3
                    console.log(idx,"idx");
                    let useritem = {
                        attenAddr: ele.attenAddr || '',
                        attenEmail: ele.attenEmail || '',
                        attenFax: ele.attenFax || '',
                        attenName: ele.attenName || '',
                        attenTel: ele.attenTel || '',
                        code: ele.code || '',
                        linkType: '1'
                    }
                    userArr.push(useritem);
                })
                // 货物包装参数处理
                JsonData.entrustCargoReq.forEach(ele => {
                    let cargoitem = {
                        "cargoType": ele.cargoType || '', //货物类型
                        "cargoName": ele.cargoName || '', //货物名称
                        "cargoQty": Number(ele.cargoQty) || 0, //货物件数
                        "cargoVol": Number(ele.cargoVol) || 0, //货物体积
                        "grossWeight": Number(ele.grossWeight) || 0, //毛重
                        "weightUnit": "kg", //no 重量单位 固定写死
                        "volUnit": "m³", //no 体积单位 固定写死
                        "hsCode": ele.hsCode || '', //HS编码
                        "markNo": ele.markNo || '', //唛头
                        "netWeight": Number(ele.netWeight) || 0, //净重
                        "suitableTemperature": ele.suitableTemperature || '', //货物适宜温度
                        "assignTemperature": ele.assignTemperature || '', //指定温度
                        "entrustPackagingReqList": [
                            {
                                "grossWeight": Number(ele.firstGrossWeight) || 0, //包装毛重
                                "netWeight": Number(ele.firstNetWeight) || 0, //包装净重
                                "packQty": Number(ele.firstPackQty) || 0, //包装件数
                                "packPcode": "0", //一级包装编码 写死
                                "packType": ele.firstPackageType || '', //包装类型
                                "packVol": Number(ele.firstPackVol) || 0 //包装体积
                            },
                            {
                                "grossWeight": Number(ele.secondGrossWeight) || 0,
                                "netWeight": Number(ele.secondNetWeight) || 0,
                                "packQty": Number(ele.secondPackQty) || 0,
                                "packPcode": "1", //二级包装编码 写死
                                "packType": ele.secondPackageType || '',
                                "packVol": Number(ele.secondPackVol) || 0
                            }
                        ]
                    }
                    cargoArr.push(cargoitem);
                })
                let parms = {
                    entrustCode: entrustCode, //委托编号
                    entrustExcetoryType: Number(onceType) || 0, //子委托类型 默认规律0 非0
                    entrustOnceReqs: [
                        {
                            // 开始时间
                            startDatetime: JsonData.startDate,
                            // 货物信息[] (及其包装信息[])
                            entrustCargoReq: cargoArr,
                            // 联系人信息 发货人 收货人 通知人
                            contactReqList: userArr,
                            // 时间要求 没有选择时间 地点为空 路段默认传递 时间要求默认0 时间单位默认小时
                            cargoReadyTime: JsonData.entrustBaseReq.cargoReadyTime || null,
                            lastStartTime: JsonData.entrustBaseReq.lastStartTime || null,
                            lastArriveTime: JsonData.entrustBaseReq.lastArriveTime || null,
                            lastDeliveryTime: JsonData.entrustBaseReq.lastDeliveryTime || null,
                            lastStartPort: JsonData.entrustBaseReq.lastStartTime && contractData.lastStartPort || "", //启运地点
                            lastArrivePort: JsonData.entrustBaseReq.lastArriveTime && contractData.lastArrivePort || "", //运抵地点
                            lastStartLoad: contractData.lastStartLoad || null,
                            lastArriveLoad: contractData.lastArriveLoad || null,
                            lowestTimeReq: JsonData.lowestTimeReq || 0,
                            lowestTimeUnit: "天"
                        }
                    ] //子委托信息 数组 entrustOnceReqs
                }
                console.log(JSON.stringify(parms),"parms1");
                // apiAddperiodOnceEntrust({data:parms}).then((res)=>{ //创建 规律
                //     if (res.code == 200) {
                //         apiAddGeneratePeriodEntrust({entrustCode}).then((res)=>{ //规律 生成单次
                //             if (res.code == 200) {
                //                 this.$Message.success({content:res.message})
                //             }
                //         });
                //     }
                // });
                // this.hasSubmit = true //显示非规律组件
                // this.entrustList = [] //生成的规律单次委托 赋值给 非规律组件
            },
            submitForm () {
                // apiAddGeneratePeriodEntrust({entrustCode:'LT202011202117424441'}).then((res)=>{
                //     if (res.code == 200) {
                //         this.$Message.success({content:res.message})
                //     }
                // });
                // return
                let allValid = true
                // 校验通知人信息
                if (!this.formItem.contactReqList) {
                    allValid = false
                    this.$Message.warning('请先选择通知人')
                    return
                }
                // 校验时间要求
                if (!this.formItem.entrustBaseReq) {
                    allValid = false
                    this.$Message.warning('请先设置时间要求')
                    return
                }
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        this.$refs['childForm'].submitForm()
                    }
                })
            },
            addCargoInfo () {
                this.$refs['childForm'].addCargoInfo()
            },
            delCargoInfo () {
               this.$refs['childForm'].delCargoInfo()
            },
            send () {
                //
            },
            // 选择通知人
            choosePeople (index) {
                this.showPeopleDrawer = true
            },
            // 选择通知人子组件验证通过，传递货物通知人信息到父组件
            submitPeople (people) {
                this.formItem.contactReqList = people
            },
            // 设置时间要求
            setTimeDemand (index) {
                this.showSetTimeDrawer = true
            },
            // 设置时间要求子组件验证通过，传递货物时间要求到父组件
            submitTimeDemand (timeDemand) {
                this.formItem.entrustBaseReq = timeDemand
                console.log('设置时间要求',timeDemand,this.formItem.entrustBaseReq);
            },
            setTimeVisiableChange (changeStatus) {
                this.showSetTimeDrawer = changeStatus
            },
            peopleVisiableChange (changeStatus) {
                this.showPeopleDrawer = changeStatus
            }
        }
    }
</script>

<style lang="scss" scoped>
    .public-form-card {
        margin-bottom: 20px;
    }
</style>
