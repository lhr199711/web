<template>
    <div>
        <div v-for="(formItem, index) in entrustList" :key="index" class="entrust-item">
            <Checkbox v-if="!isDetail" v-model="formItem.checked"/>
            <div class="entrust-info">
                <div class="title">
                    <div class="name">00{{ index + 1 }}单次委托</div>
                    <div v-if="isDetail" class="contract-info">
                        <div class="item">合同重量：250kg</div>
                        <div class="item">已交付重量：250kg</div>
                        <div class="item">在途货量：250kg</div>
                        <div class="item">未启运总量：250kg</div>
                    </div>
                    <span class="icon">
                        <Icon
                            v-if="formItem.isShow"
                            type="ios-arrow-down"
                            @click="onClose(formItem)"
                        />
                        <Icon
                            v-else
                            type="ios-arrow-up"
                            @click="onOpen(formItem)"
                        />
                    </span>
                </div>
                <div v-show="formItem.isShow" class="public-form-card">
                    <div class="cargo-head">
                        <div class="btns" v-if="!isDetail">
                            <Button @click="delCargoInfo(index)">
                                批量删除
                                <svg class="iconfont" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongV3ICON_piliangshanchu"></use>
                                </svg>
                            </Button>
                            <Button @click="addCargoInfo(index)">
                                添加货物信息
                                <svg class="iconfont" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                                </svg>
                            </Button>
                            <Button @click="choosePeople(index)">
                                选择通知人信息
                                <svg class="iconfont" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                                </svg>
                            </Button>
                            <Button @click="setTimeDemand(index)">
                                设置时间要求
                                <svg class="iconfont" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                                </svg>
                            </Button>
                        </div>
                        <div class="btns" v-else>
                            <Button @click="checkPeople(index)">
                                查看通知人
                            </Button>
                            <Button @click="checkTimeDemand(index)">
                                查看时间要求
                            </Button>
                        </div>
                        <Form :model="startDateList[index]" :rules="ruleValidate" :ref="`formItemData_${index}`" :label-width="100" label-colon>
                            <FormItem label="开始时间" prop="startDate">
                                <span v-if="isDetail">{{ startDateList[index].startDate }}</span>
                                <DatePicker v-else v-model="startDateList[index].startDate" type="date"></DatePicker>
                            </FormItem>
                        </Form>
                    </div>
                    <cargo-info :ref="`childForm_${index}`" :entrustIndex="index" :isDetail="isDetail" @submit-form="submitCargoInfo"></cargo-info>
                </div>
            </div>
        </div>
        <!-- <div v-if="!isDetail" class="public-btns-group"> -->
        <div class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="submitEntrustForm">保存</Button>
            <Button shape="circle" size="large" @click="send">发送</Button>
            <Button shape="circle" size="large" @click="addEntrust">添加单次委托</Button>
            <Button shape="circle" size="large" @click="delEntrust">删除</Button>
        </div>
        <set-time-demand :showDrawer="showSetTimeDrawer" @on-ok="submitTimeDemand" @on-visible-change="setTimeVisiableChange"></set-time-demand>
        <choose-people :showDrawer="showPeopleDrawer" @on-ok="submitPeople" @on-visible-change="peopleVisiableChange"></choose-people>
        <check-time-demand :showDrawer="showCheckSetTimeDrawer" @on-visible-change="checkTimeVisiableChange"></check-time-demand>
        <check-people :showDrawer="showCheckPeopleDrawer" @on-visible-change="checkPeopleVisiableChange"></check-people>
    </div>
</template>

<script>
    import CargoInfo from './CargoInfo'
    // import SetTimeDemand from './SetTimeDemand'
    import ChoosePeople from './ChoosePeople'
    import CheckTimeDemand from './CheckTimeDemand'
    import CheckPeople from './CheckPeople'
    import validateRules from '@/libs/validateRules'
    import { apiAddperiodOnceEntrust,apiAddGeneratePeriodEntrust } from '@/api/logisticsEntrust'
    export default {
        components: {
            CargoInfo,
            SetTimeDemand: ()=>import('./SetTimeDemand'),
            ChoosePeople,
            CheckTimeDemand,
            CheckPeople
        },
        props: {
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                entrustList: [], // 存放所有的委托信息
                startDateList: [], // 存放所有的开始时间
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
                showPeopleDrawer: false,
                showCheckSetTimeDrawer: false,
                showCheckPeopleDrawer: false,
                curOperateEntrustIndex: 0, // 当前操作的是第几个委托，用于选择通知人、设置时间要求后把数据放到对应的委托下
                cargoIsValidCount: 0, // 货物信息通过校验的委托个数
                cargoValid: false
            }
        },
        methods: {
            // 货物信息子组件验证通过，传递货物信息到父组件
            submitCargoInfo (cargoList, entrustIndex) {
                this.cargoValid = true
                // 每个委托的货物信息校验通过，将货物信息放到对应的委托下
                this.entrustList[entrustIndex].entrustCargoReq = cargoList
                this.cargoIsValidCount++
                // 所有委托的货物信息的校验都通过
                if (this.cargoIsValidCount === this.entrustList.length) {
                    // 发送请求提交单次委托内容
                    console.log(JSON.parse(JSON.stringify(this.entrustList)))
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
                    let JsonData = JSON.parse(JSON.stringify(this.entrustList))[entrustIndex] //深拷贝 变时间戳
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
                    console.log(JSON.stringify(parms),parms,"parms1");
                    apiAddperiodOnceEntrust({data:parms}).then((res)=>{ //创建 规律
                        if (res.code == 200) {
                            apiAddGeneratePeriodEntrust({entrustCode}).then((res)=>{ //规律 生成单次
                                if (res.code == 200) {
                                    this.$Message.success({content:res.message})
                                }
                            });
                        }
                    });
                }
            },
            // 添加货物信息
            addCargoInfo (index) {
                this.$refs[`childForm_${index}`][0].addCargoInfo()
            },
            // 删除货物信息
            delCargoInfo (index) {
               this.$refs[`childForm_${index}`][0].delCargoInfo()
            },
            // 选择通知人
            choosePeople (index) {
                this.showPeopleDrawer = true
                this.curOperateEntrustIndex = index
            },
            // 选择通知人子组件验证通过，传递货物通知人信息到父组件
            submitPeople (people) {
                this.entrustList[this.curOperateEntrustIndex].contactReqList = people
            },
            // 设置时间要求
            setTimeDemand (index) {
                this.showSetTimeDrawer = true
                this.curOperateEntrustIndex = index
            },
            // 设置时间要求子组件验证通过，传递货物时间要求到父组件
            submitTimeDemand (timeDemand) {
                this.entrustList[this.curOperateEntrustIndex].entrustBaseReq = timeDemand
            },
            // 查看通知人
            checkPeople (index) {
                this.showCheckPeopleDrawer = true
            },
            // 查看时间要求
            checkTimeDemand (index) {
                this.showCheckSetTimeDrawer = true
            },
            onOpen (formItem) {
                formItem.isShow = true
            },
            onClose (formItem) {
                formItem.isShow = false
            },
            // 发送
            send () {

            },
            // 添加委托
            addEntrust () {
                this.entrustList.unshift({ isShow: true })
                this.startDateList.unshift({ startDate: '' })
            },
            // 删除委托
            delEntrust () {
                for (let i = 0; i < this.entrustList.length; i++) {
                    if (this.entrustList[i].checked) {
                        this.entrustList.splice(i, 1)
                        this.startDateList.splice(i, 1)
                        i--
                    }
                }
            },
            // 保存
            submitEntrustForm () {
                this.cargoIsValidCount = 0
                if (this.entrustList.length == 0) {
                    this.$Message.warning({content:'请至少添加一个货物!'})
                    return
                }
                let allValid = true
                for (let i = 0; i < this.entrustList.length; i++) {
                    // 校验每个委托的开始时间
                    this.$refs[`formItemData_${i}`][0].validate((valid) => {
                        if (!valid) {
                            allValid = false
                            // 展开校验未通过的货物信息
                            this.entrustList[i].isShow = true
                        } else {
                            this.entrustList[i].startDate = this.startDateList[i].startDate
                        }
                    })
                    if (!allValid) {
                        return
                    }
                    // 校验每个委托的通知人信息
                    if (!this.entrustList[i].contactReqList) {
                        allValid = false
                        this.$Message.warning(`00${i + 1}单次委托的通知人没有选择`)
                        // 展开校验未通过的货物信息
                        this.entrustList[i].isShow = true
                        return
                    }
                    // 校验每个委托的时间要求信息
                    if (!this.entrustList[i].entrustBaseReq) {
                        allValid = false
                        this.$Message.warning(`00${i + 1}单次委托的时间要求没有设置`)
                        // 展开校验未通过的货物信息
                        this.entrustList[i].isShow = true
                        return
                    }
                }
                if (allValid) {
                    // 校验每个委托的货物信息
                    for (let i = 0; i < this.entrustList.length; i++) {
                        this.$refs[`childForm_${i}`][0].submitForm()
                        // 只有前一个委托的货物信息验证通过后才进行后续的委托的货物信息验证（防止一次性出现多个提示信息）
                        if (!this.cargoValid) {
                            this.entrustList[i].isShow = true
                            break
                        }
                        this.cargoValid = false
                    }
                }
            },
            setTimeVisiableChange (changeStatus) {
                this.showSetTimeDrawer = changeStatus
            },
            peopleVisiableChange (changeStatus) {
                this.showPeopleDrawer = changeStatus
            },
            checkTimeVisiableChange (changeStatus) {
                this.showCheckSetTimeDrawer = changeStatus
            },
            checkPeopleVisiableChange (changeStatus) {
                this.showCheckPeopleDrawer = changeStatus
            }
        }
    }
</script>

<style lang="scss" scoped>
    .entrust-item {
        display: flex;
        margin-bottom: 20px;
        /deep/ .ivu-checkbox-wrapper {
            width: 20px;
        }
        .entrust-info {
            flex-grow: 1;
            background-color: #fff;
            .title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 60px;
                padding: 0 20px;
            }
            .public-form-card {
                padding-top: 0;
            }
            .cargo-head {
                display: flex;
                margin-left: 45px;
                .btns {
                    button {
                        margin-right: 20px;
                    }
                }
            }
            /deep/ .cargo-item {
                margin-left: 20px;
            }
            /deep/ .cargo-info, /deep/ .public-form-card {
                margin-right: 20px;
                background-color: #f9f9f9;
            }
            .contract-info {
                display: flex;
                justify-content: flex-end;
                width: 90%;
                .item {
                    margin-right: 40px;
                }
            }
        }
    }
</style>
