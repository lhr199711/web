<template>
    <div class="cargo-info">
        <div v-if="peopleFormItem" class="people-info">
            <Form :model="peopleFormItem" :rules="peopleRuleValidate" ref="peopleFormItemData" :label-width="160" label-colon>
                <div class="public-form-card">
                    <Row>
                        <Col span="8">
                            <FormItem label="发货人名称" prop="senderName">
                                <!-- <Select v-model="peopleFormItem.senderName" clearable @on-change="chooseName(1)">
                                    <Option v-for="(item, index) in sender" :key="index" :value="item.senderName">
                                        {{ item.senderName }}
                                    </Option>
                                </Select>
                                <Button @click="addPeople(1)">添加发货人</Button> -->
                                <Input v-model="peopleFormItem.senderName"></Input>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="收货人名称" prop="consigneeName">
                                <!-- <Select v-model="peopleFormItem.consigneeName" clearable @on-change="chooseName(2)">
                                    <Option v-for="(item, index) in taker" :key="index" :value="item.consigneeName">
                                        {{ item.consigneeName }}
                                    </Option>
                                </Select>
                                <Button @click="addPeople(2)">添加收货人</Button> -->
                                <Input v-model="peopleFormItem.consigneeName"></Input>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="通知人名称" prop="noticerName">
                                <!-- <Select v-model="peopleFormItem.noticerName" clearable @on-change="chooseName(3)">
                                    <Option v-for="(item, index) in notifier" :key="index" :value="item.noticerName">
                                        {{ item.noticerName }}
                                    </Option>
                                </Select>
                                <Button @click="addPeople(3)">添加通知人</Button> -->
                                <Input v-model="peopleFormItem.noticerName"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="电话" prop="senderTel">
                                <!-- <Input v-model="peopleFormItem.senderTel" disabled /> -->
                                <Input v-model="peopleFormItem.senderTel" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="电话" prop="consigneeTel">
                                <!-- <Input v-model="peopleFormItem.consigneeTel" disabled /> -->
                                <Input v-model="peopleFormItem.consigneeTel" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="电话" prop="noticerTel">
                                <!-- <Input v-model="peopleFormItem.noticerTel" disabled /> -->
                                <Input v-model="peopleFormItem.noticerTel" />
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </Form>
        </div>
        <div v-if="cargoList" class="cargo-list">
            <!-- 不能用index作为key，不然用unshift会出现update问题 -->
            <div v-for="(formItem, index) in cargoList" class="cargo-item">
                <Checkbox v-if="!isDetail" v-model="formItem.checked" />
                <div class="cargo-info">
                    <div class="title">
                        <div class="name">
                            00{{ cargoList.length - index }}货物信息
                            <Button size="small" @click="inputPackageInfo(formItem)">录入包装信息</Button>
                            <Button v-if="isDetail" class="detail-btn" size="small" @click="checkPackageInfo(formItem)">查看包装信息</Button>
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
                    <Form :model="formItem" :rules="cargoRuleValidate" :ref="`formItemData_${index}`" :label-width="160" label-colon>
                        <div v-show="formItem.isShow" class="public-form-card">
                            <Row>
                                <Col span="12">
                                    <FormItem label="货物名称" prop="cargoName">
                                        <!-- <Select v-model="formItem.cargoName" clearable @on-change="chooseNameOrHsCode(formItem)">
                                            <Option v-for="item in cargoNameList" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select> -->
                                        <Input v-model="formItem.cargoName" />
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="HS编码" prop="hsCode">
                                        <!-- <Select v-model="formItem.hsCode" clearable @on-change="chooseNameOrHsCode(formItem)">
                                            <Option v-for="item in hsCodeList" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select> -->
                                        <Input v-model="formItem.hsCode" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="12">
                                    <FormItem label="货物类型" prop="cargoType">
                                        <!-- <Select v-model="formItem.cargoType" disabled clearable> -->
                                        <Select v-model="formItem.cargoType" clearable>
                                            <Option v-for="item in cargoType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="毛重" prop="grossWeight">
                                        <span v-if="isDetail">{{ formItem.grossWeight }}KG</span>
                                        <Input v-else v-model.number="formItem.grossWeight">
                                            <span slot="append">KG</span>
                                        </Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="12">
                                    <FormItem label="体积" prop="cargoVol">
                                        <span v-if="isDetail">{{ formItem.cargoVol }}m³</span>
                                        <Input v-else v-model.number="formItem.cargoVol">
                                            <span slot="append">m³</span>
                                        </Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="件数" prop="packQty">
                                        <Input v-model.number="formItem.packQty" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="12">
                                    <FormItem label="货物适宜温度" prop="suitableTemperature">
                                        <Select v-model="formItem.suitableTemperature" clearable>
                                            <Option v-for="item in formItem.suitableTemperatureList" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col v-if="isDetail && formItem.suitableTemperature !== 'BD'" span="12">
                                    <FormItem label="指定温度" prop="assignTemperature">
                                        {{ formItem.assignTemperature }}{{ formItem.temperatureUnit }}
                                    </FormItem>
                                </Col>
                                <template v-else>
                                    <!-- 货物适宜温度为指定温度则必填 -->
                                    <Col span="7" v-if="formItem.suitableTemperature !== 'BD'" class="no-right-border">
                                        <FormItem label="指定温度" prop="assignTemperature">
                                            <Input v-model.number="formItem.assignTemperature" style="width: 40%;" />
                                        </FormItem>
                                    </Col>
                                    <!-- 货物适宜温度为指定温度则必填 -->
                                    <Col span="5" v-if="formItem.suitableTemperature !== 'BD'">
                                        <FormItem :label-width="0" prop="temperatureUnit">
                                            <Select v-model="formItem.temperatureUnit" clearable>
                                                <Option v-for="item in temperatureUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                    {{ item.dictionaryValue }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </template>
                            </Row>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
        <div v-if="!isDetail" class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
            <Button shape="circle" size="large" @click="addCargoInfo">添加货物信息</Button>
            <Button shape="circle" size="large" @click="delCargoInfo">删除</Button>
        </div>
        <Drawer
            v-model="isShowAddDrawer"
            width="1100"
        >
            <h3>录入{{ addType === 1 ? '发货人' : (addType === 2 ? '收货人' : '通知人') }}信息</h3>
            <Form
                :model="addFormItem"
                :rules="addRuleValidate"
                label-position="top"
                ref="addFormItemData"
                label-colon
            >
                <Row>
                    <Col span="12">
                        <FormItem :label="`${addType === 1 ? '发货人' : (addType === 2 ? '收货人' : '通知人')}名称`" prop="attenName">
                            <Input v-model="addFormItem.attenName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="联系电话" prop="attenTel">
                           <Input v-model="addFormItem.attenTel"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="代码" prop="code">
                            <Input v-model="addFormItem.code"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="地址" prop="attenAddr">
                           <Input v-model="addFormItem.attenAddr"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="传真" prop="attenFax">
                            <Input v-model="addFormItem.attenFax"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="邮箱" prop="attenEmail">
                           <Input v-model="addFormItem.attenEmail"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="submitAddForm">确定</Button>
                <Button shape="circle" size="large" @click="isShowAddDrawer = false">取消</Button>
            </div>
        </Drawer>
        <package-info :defaultData="packageInfo" :showDrawer="showPackageDrawer" @submit-form="submitPackageForm" @on-visible-change="packageVisiableChange"></package-info>
        <check-package-info :defaultData="packageInfo" :showDrawer="showCheckPackageDrawer" @on-visible-change="checkPackageVisiableChange"></check-package-info>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import addPeople from '@/mixins/addPeople'
    import PackageInfo from './drawer/PackageInfo'
    import CheckPackageInfo from './drawer/CheckPackageInfo'
    export default {
        mixins: [addPeople],
        components: {
            PackageInfo,
            CheckPackageInfo
        },
        props: {
            defaultData: {
                type: Object,
                default: () => ({})
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                // 包装类型
                packageType: this.$getDictionary('PACKAGE_TYPE'),
                // 货物类型
                cargoType: this.$getDictionary('GOODS_TYPE'),
                temperatureUnit: this.$getDictionary('TEMPERATURE_UNIT'),
                cargoList: [],
                peopleFormItem: {},
                peopleRuleValidate: {
                    senderTel: [
                        validateRules.phone()[0]
                    ],
                    consigneeTel: [
                        validateRules.phone()[0]
                    ],
                    noticerTel: [
                        validateRules.phone()[0]
                    ]
                },
                cargoRuleValidate: {
                    cargoName: [
                        validateRules.select('货物名称')[0]
                    ],
                    hsCode: [
                        validateRules.select('HS编码')[0]
                    ],
                    cargoType: [
                        validateRules.select('货物类型')[0]
                    ],
                    grossWeight: [
                        validateRules.requiredNumber()[0]
                    ],
                    cargoVol: [
                        validateRules.requiredNumber()[0]
                    ],
                    packQty: [
                        validateRules.requiredNumber()[0]
                    ],
                    suitableTemperature: [
                        validateRules.select('货物适宜温度')[0]
                    ],
                    assignTemperature: [
                        validateRules.requiredNumber()[0]
                    ],
                    temperatureUnit: [
                        validateRules.select('单位')[0]
                    ]
                },
                showPackageDrawer: false,
                showCheckPackageDrawer: false,
                // 包装信息
                packageInfo: {},
                // 当前录入包装信息的货物
                curCargo: {},
                // 货物名称集合
                cargoNameList: [],
                // hsCode集合
                hsCodeList: []
            }
        },
        created () {
            // 详情页去除必填提示（*）
            if (this.isDetail) [
                this.cargoRuleValidate = {}
            ]
        },
        watch: {
            defaultData (newVal) {
                this.cargoList = newVal.cargoList
                this.peopleFormItem = newVal.peopleInfo
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
                            // this.cargoList[i].isShow = true
                        }
                    })
                }
                // 至少添加一个货物信息
                if (!this.cargoList.length) {
                    this.$Message.warning('请至少添加一个货物')
                    return
                }
                if (allValid) {
                    this.$emit('submit-form', this.peopleFormItem, this.cargoList)
                } else {
                    this.$Message.warning('货物信息还有必填项没有填写')
                }
            },
            addCargoInfo () {
                this.cargoList.unshift({
                    isShow: true,
                    volUnit: 'M3',
                    weightUnit: 'kg',
                    suitableTemperatureList: [{ dictionaryKey: 'assign', dictionaryValue: '指定温度' }]
                })
            },
            delCargoInfo () {
                for (let i = 0; i < this.cargoList.length; i++) {
                    if (this.cargoList[i].checked) {
                        this.cargoList.splice(i, 1)
                        i--
                    }
                }
            },
            chooseNameOrHsCode (data) {
                // this.$set(data, 'cargoName', '')
                // this.$set(data, 'hsCode', '')
                // this.$set(data, 'packType', '')
                // 货物适宜温度
                // this.$set(data, 'suitableTemperatureList', [
                //     { dictionaryKey: 'assign', dictionaryValue: '指定温度' },
                //     { dictionaryKey: 'yy', dictionaryValue: '10℃-50℃' }
                // ])
            },
            onOpen (formItem) {
                this.$set(formItem, 'isShow', true)
            },
            onClose (formItem) {
                this.$set(formItem, 'isShow', false)
            },
            submitAddForm () {
                this.$refs.addFormItemData.validate((valid) => {
                    if (valid) {
                        // 要发送请求保存信息,后端判断是否重复
                        // 如果不重复
                        if (this.addType === 1) {
                            this.sender.push({
                                senderName: this.addFormItem.attenName,
                                senderTel: this.addFormItem.attenTel
                            })
                        }
                        if (this.addType === 2) {
                            this.taker.push({
                                consigneeName: this.addFormItem.attenName,
                                consigneeTel: this.addFormItem.attenTel
                            })
                        }
                        if (this.addType === 3) {
                            this.notifier.push({
                                noticerName: this.addFormItem.attenName,
                                noticerTel: this.addFormItem.attenTel
                            })
                        }
                        this.isShowAddDrawer = false
                    }
                })
            },
            chooseName (type) {
                if (type === 1) {
                    this.peopleFormItem.senderTel = this.sender[this.getIndex(this.sender, this.peopleFormItem.senderName, 'senderName')].senderTel
                }
                if (type === 2) {
                    this.peopleFormItem.consigneeTel = this.taker[this.getIndex(this.taker, this.peopleFormItem.consigneeName, 'consigneeName')].consigneeTel
                }
                if (type === 3) {
                    this.peopleFormItem.noticerTel = this.notifier[this.getIndex(this.notifier, this.peopleFormItem.noticerName, 'noticerName')].noticerTel
                }
            },
            // 提交包装信息
            submitPackageForm (data) {
                // 浅拷贝实现数据同步改变
                this.curCargo = Object.assign(this.curCargo, data)
            },
            // 录入包装信息
            inputPackageInfo (data) {
                // 浅拷贝实现数据同步改变
                this.curCargo = data
                // 深拷贝
                this.packageInfo = { ...data }
                this.showPackageDrawer = true
            },
            // 查看包装信息
            checkPackageInfo (data) {
                // 浅拷贝实现数据同步改变
                this.curCargo = data
                // 深拷贝
                this.packageInfo = { ...data }
                this.showCheckPackageDrawer = true
            },
            packageVisiableChange (changeStatus) {
                this.showPackageDrawer = changeStatus
            },
            checkPackageVisiableChange (changeStatus) {
                this.showCheckPackageDrawer = changeStatus
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cargo-item {
        display: flex;
        margin-top: 20px;
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
                .name {
                    font-size: 16px;
                    button {
                        margin-left: 12px;
                    }
                }
            }
            .public-form-card {
                padding-top: 0;
            }
        }
    }
    .ivu-col-span-5 {
        .ivu-form-item {
            /deep/ .ivu-select {
                margin-left: -55px;
            }
        }
    }
</style>
