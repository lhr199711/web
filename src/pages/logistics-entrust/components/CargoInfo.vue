<template>
    <div>
        <div v-for="(formItem, index) in cargoList" :key="index" class="cargo-item">
            <Checkbox v-if="!isDetail" v-model="formItem.checked" />
            <div class="cargo-info">
                <div class="title">
                    <div class="name">00{{ cargoList.length - index }}货物信息</div>
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
                <Form :model="formItem" :rules="ruleValidate" :ref="`formItemData_${index}`" :label-width="160" label-colon>
                    <div v-show="formItem.isShow" class="public-form-card">
                        <Row>
                            <Col span="8">
                                <FormItem label="货物名称" prop="cargoName">
                                    <Input v-if="!isDisabled" v-model="formItem.cargoName">
                                    </Input>
                                    <Select v-if="isDisabled" v-model="formItem.cargoName" @on-clear="onclear(formItem)" clearable  @on-change="chooseName(formItem,index)">
                                        <Option v-for="item in cargoListName" :key="item.cargoName" :value="item.cargoName">
                                            {{ item.cargoName }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="一级包装类型" prop="firstPackageType">
                                    <Select v-model="formItem.firstPackageType" clearable :disabled="isDisabled">
                                        <Option v-for="item in packageType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                            {{ item.dictionaryValue }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="二级包装类型" prop="secondPackageType">
                                    <Select v-model="formItem.secondPackageType" clearable :disabled="isDisabled">
                                        <Option v-for="item in packageType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                            {{ item.dictionaryValue }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="唛头" prop="markNo">
                                    <Input v-model="formItem.markNo" :disabled="isDisabled"></Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="一级包装毛重" prop="firstGrossWeight">
                                    <Input v-model.number="formItem.firstGrossWeight" :disabled="isDisabled">
                                        <span slot="append">kg</span>
                                    </Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="二级包装毛重" prop="secondGrossWeight">
                                    <Input v-model.number="formItem.secondGrossWeight" :disabled="isDisabled">
                                        <span slot="append">kg</span>
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="HS编码" prop="hsCode">
                                    <Input v-model="formItem.hsCode" disabled></Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="一级包装净重" prop="firstNetWeight">
                                    <Input v-model.number="formItem.firstNetWeight" :disabled="isDisabled">
                                        <span slot="append">kg</span>
                                    </Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="二级包装净重" prop="secondNetWeight">
                                    <Input v-model.number="formItem.secondNetWeight" :disabled="isDisabled">
                                        <span slot="append">kg</span>
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="毛重" prop="grossWeight">
                                    <Input v-model.number="formItem.grossWeight" :disabled="isDisabled">
                                        <span slot="append">kg</span>
                                    </Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="一级包装件数" prop="firstPackQty">
                                    <Input v-model.number="formItem.firstPackQty" :disabled="isDisabled">
                                    </Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="二级包装件数" prop="secondPackQty">
                                    <Input v-model.number="formItem.secondPackQty" :disabled="isDisabled">
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="净重" prop="netWeight">
                                    <Input v-model.number="formItem.netWeight" :disabled="isDisabled">
                                        <span slot="append">kg</span>
                                    </Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="一级包装体积" prop="firstPackVol">
                                    <Input v-model.number="formItem.firstPackVol" :disabled="isDisabled">
                                        <span slot="append">m³</span>
                                    </Input>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="二级包装体积" prop="secondPackVol">
                                    <Input v-model.number="formItem.secondPackVol" :disabled="isDisabled">
                                        <span slot="append">m³</span>
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="货物件数" prop="cargoQty">
                                    <Input v-model.number="formItem.cargoQty" disabled>
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="货物体积" prop="cargoVol">
                                    <Input v-model.number="formItem.cargoVol" disabled>
                                    <span slot="append">m³</span>
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="货物类型" prop="cargoType">
                                    <Input v-model="formItem.cargoType" disabled>
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="货物适宜温度" prop="suitableTemperature">
                                    <Input v-model="formItem.suitableTemperature" disabled>
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="指定温度" prop="assignTemperature">
                                    <Input v-model="formItem.assignTemperature" disabled>
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import { apiGetEntrustCargo } from '@/api/logisticsEntrust'
    export default {
        props: {
            // 合同委托录入非规律单次委托信息需要
            entrustIndex: {
                type: Number,
                default: 0
            },
            defaultData: {
                type: Array,
                default: () => []
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                // 货物名称
                cargoListName: [],
                // 委托类型
                delegationType: this.$getDictionary('DELEGATION_TYPE'),
                packageType: this.$getDictionary('PACKAGE_TYPE'),
                cargoList: this.defaultData, // 存放所有的货物信息
                ruleValidate: {
                    cargoName: [
                        validateRules.select('货物名称')[0]
                    ],
                    markNo: [
                        validateRules.required('唛头')[0]
                    ],
                    grossWeight: [
                        validateRules.requiredNumber('毛重')[0]
                    ],
                    firstPackageType: [
                        validateRules.select('一级包装类型')[0]
                    ],
                    firstGrossWeight: [
                        validateRules.requiredNumber('一级包装毛重')[0]
                    ],
                    firstNetWeight: [
                        validateRules.requiredNumber('一级包装净重')[0]
                    ],
                    firstPackQty: [
                        validateRules.requiredNumber('一级包装件数')[0]
                    ],
                    firstPackVol: [
                        validateRules.requiredNumber('一级包装体积')[0]
                    ]
                }
            }
        },
        methods: {
            submitForm () {
                let allValid = true
                for (let i = 0; i < this.cargoList.length; i++) {
                    this.$refs[`formItemData_${i}`][0].validate((valid) => {
                        if (!valid) {
                            allValid = false
                            // 展开校验未通过的货物信息
                            this.cargoList[i].isShow = true
                        }
                    })
                }
                // 至少添加一个货物信息
                if (!this.cargoList.length) {
                    this.$Message.warning('请至少添加一个货物')
                    return
                }
                if (allValid) {
                    this.$emit('submit-form', this.cargoList, this.entrustIndex)
                } else {
                    this.$Message.warning('货物信息还有必填项没有填写')
                }
            },
            addCargoInfo () {
                this.cargoList.unshift({ isShow: true })
                if (this.isDisabled&&this.cargoList.length==1) { //需要选择合同委托
                    let entrustCode = JSON.parse(sessionStorage.getItem('contractEntrustsave')).entrustCode || "" //默认 无编号
                    apiGetEntrustCargo({entrustCode}).then((res)=>{
                        if (res.code == 200) {
                            this.cargoListName = []
                            for (let key in res.data) {
                                if (res.data.hasOwnProperty(key)) {
                                    let itemName = {
                                        checked: false, //选中框
                                        cargoName: res.data[key].cargoName || '', //货物名称
                                        markNo: res.data[key].markNo || '', //唛头
                                        hsCode: res.data[key].hsCode || '', //HS编码
                                        grossWeight: res.data[key].grossWeight || 0, //毛重
                                        netWeight: res.data[key].netWeight || 0, //净重
                                        cargoQty: res.data[key].cargoQty || 0, //货物件数
                                        cargoVol: res.data[key].cargoVol || 0, //货物体积
                                        cargoType: res.data[key].cargoType || 0, //货物类型
                                        suitableTemperature: res.data[key].suitableTemperature || '', //货物适宜温度
                                        assignTemperature: res.data[key].assignTemperature || '', //指定温度
                                        firstPackageType: res.data[key].entrustPackagingListRes[1].packType || '', //一级包装类型
                                        firstGrossWeight: res.data[key].entrustPackagingListRes[1].grossWeight || 0, //一级包装毛重
                                        firstNetWeight: res.data[key].entrustPackagingListRes[1].netWeight || 0, //一级包装净重
                                        firstPackQty: res.data[key].entrustPackagingListRes[1].packQty || 0, //一级包装件数
                                        firstPackVol: res.data[key].entrustPackagingListRes[1].packVol || 0, //一级包装体积
                                        secondPackageType: res.data[key].entrustPackagingListRes[0].packType || '', //二级包装类型
                                        secondGrossWeight: res.data[key].entrustPackagingListRes[0].grossWeight || 0, //二级包装毛重
                                        secondNetWeight: res.data[key].entrustPackagingListRes[0].netWeight || 0, //二级包装净重
                                        secondPackQty: res.data[key].entrustPackagingListRes[0].packQty || 0, //二级包装件数
                                        secondPackVol: res.data[key].entrustPackagingListRes[0].packVol || 0 //二级包装体积
                                    }
                                    this.cargoListName.push(itemName)
                                }
                            }
                        }
                    });
                }
            },
            delCargoInfo () {
                for (let i = 0; i < this.cargoList.length; i++) {
                    if (this.cargoList[i].checked) {
                        this.cargoList.splice(i, 1)
                        i--
                    }
                }
            },
            onOpen (formItem) {
                this.$set(formItem, 'isShow', true)
            },
            onClose (formItem) {
                this.$set(formItem, 'isShow', false)
            },
            // 选择名称后直接赋值
            chooseName (item) {
                let origin = this.cargoListName[this.getIndex(this.cargoListName, item.cargoName, 'cargoName')]
                for(let key in origin){
                    this.$set(item,key,origin[key])
                }
            },
            // 选择名字 对应 赋值
            getIndex (data, target, property) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i][property] === target) {
                        return i
                    }
                }
            },
            // 清空 选择的数据 类型的数据
            onclear(item) {
                for (let key in item) {
                    if (key!='isShow'&&key!='checked') { //除开某些属性
                        item[key] = ''
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cargo-item {
        display: flex;
        margin-bottom: 20px;
        /deep/ .ivu-checkbox-wrapper {
            width: 20px;
        }
        .cargo-info {
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
        }
    }
</style>
