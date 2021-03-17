<template>
    <div class="simple-entry">
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="4">
                        <div class="name">基础货运要求</div>
                    </Col>
                    <Col span="20">
                        <Button v-if="sendShow" @click="send">发送</Button>
                        <Button type="primary" class="save-btn" @click="save('formValidate')">保存</Button>
                    </Col>
                </Row>
            </div>
        </div>
        <div class="public-table-content public-input">
            <div class="l-content">
                <div class="table-data">
                    <ul class="transit">
                        <p class="table-title">基本信息</p>
                        <Form ref="formValidate" label-position="left" :model="transitModal" :label-width="100">
                            <FormItem label="启运地：" class="min-width">
                                <small class="rule-class">*</small>
                                <adt-city-selector :defaultData="startDefault" @on-change="handelDirStart" style="width:120px; display: inline-block; marginRight: 10px;" />
                                <Select
                                    v-model="transitModal.custStartPlace"
                                    filterable
                                    clearable
                                    @on-change="onPlaceChange"
                                    @on-clear="onPlaceClear"
                                >
                                    <Option v-for="item in custStartPlace" :value="item.value+'-'+item.label" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <span class="btn-ok" @click="startPlaceConfrim">确定</span>
                                <p v-show="startHintShow" class="hint">请输入启运地</p>
                                <p class="select-value">
                                    <span v-for="(value, index) in startPlace" :key="index">{{ value }}<Icon type="ios-close-circle" @click="delPlaceDeparture(index)" /></span>
                                </p>
                            </FormItem>
                            <FormItem label="目的地：" class="min-width">
                                <small class="rule-class">*</small>
                                <adt-city-selector :defaultData="endDefault" @on-change="handelDirEnd" style="width: 120px; display: inline-block; marginRight: 10px;" />
                                <Select
                                    v-model="transitModal.custEndPlace"
                                    filterable
                                    clearable
                                    @on-change="onEndPlaceChange"
                                    @on-clear="onEndClear"
                                >
                                    <Option v-for="item in custEndPlace" :value="item.value+'-'+item.label" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <span class="btn-ok" @click="endPlaceConfrim">确定</span>
                                <p v-show="endHintShow" class="hint">请输入目的地</p>
                                <p class="select-value">
                                    <span v-for="(value, index) in endPlace" :key="index">{{ value }}<Icon type="ios-close-circle" @click="delCustEndPlace(index)" /></span>
                                </p>
                            </FormItem>
                            <FormItem label="中转地：" class="min-width">
                                <adt-city-selector :defaultData="ctransitDefault" @on-change="handelDirTrsspmPort" style="width:120px; display: inline-block; marginRight: 10px;" />
                                <Select
                                    v-model="transitModal.custTransitPlace"
                                    filterable
                                    clearable
                                    @on-change="onSiteChange"
                                    @on-clear="onSiteClear"
                                >
                                    <Option v-for="item in custTransitPlace" :value="item.value+'-'+item.label" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <span class="btn-ok" @click="okCustTransitPlace">确定</span>
                                <p class="select-value">
                                    <span v-for="(value, index) in ctransitPlace" :key="index">{{ value }}<Icon type="ios-close-circle" @click="delTransit(index)"/></span>
                                </p>
                            </FormItem>
                            <FormItem label="货物类型：" prop="cargoType">
                                <Select v-model="transitModal.cargoType" clearable style="width:120px;">
                                    <Option v-for="(item, index) in cargoType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="物流类型：" prop="logisticsType">
                                <Select v-model="transitModal.logisticsType" clearable style="width:120px;">
                                    <Option v-for="(item, index) in logisticsType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="运输类型：" prop="trspType">
                                <Select v-model="transitModal.trspType" clearable style="width:120px;">
                                    <Option v-for="(item, index) in trspType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                </Select>
                            </FormItem>
                        </Form>
                    </ul>
                    <ul class="transit">
                        <div class="table-title">货运要求备注：</div>
                        <Input v-model="transitModal.freightBrief" :autosize="{minRows: 3, maxRows: 5}" type="textarea" placeholder="请输入货运要求备注，500字以内！" maxlength="500" />
                    </ul>
                    <div class="bottom">
                        <p>
                            如果需要准确匹配物流方案，请您<a @click="detailEntryClick">填写详细信息</a>！
                            <Icon type="ios-arrow-forward" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <adt-reconfirm-modal :showModal="isTransitModal" :message="transitText" @on-visible-change="visibleChange" @on-ok="transitConfrim" ></adt-reconfirm-modal>
        <adt-reconfirm-modal 
            :showModal="isPlaceDepartureModal"
            :message="placeDepartureText"
            @on-visible-change="visiblePlaceDeparture"
            @on-ok="handleConfirm"
            @on-cancel="handleCancel"
        />
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import { apiChangJing } from '@/api/logisticsCommission'
    import { apiAddFreightSimple, apiSendSale } from '@/api/freight'
    export default {
        name: 'SimpleEntry',
        data () {
            return {
                // 运输类型
                trspType: this.$getDictionary('TRANSPORT_TYPE'),
                // 货物类型
                cargoType: this.$getDictionary('GOODS_TYPE'),
                // 物流类型
                logisticsType: this.$getDictionary('LOGISTICS_TYPE'),
                // 发送按钮
                sendShow: false,
                transitModal: {
                    // 启运地
                    custStartPlace: '',
                    custStartPlace1: '',
                    // 目的地
                    custEndPlace: '',
                    custEndPlace1: '',
                    // 中转地
                    custTransitPlace: '',
                    custTransitPlace1: '',
                    // 货物类型
                    cargoType: '',
                    // 物流类型
                    logisticsType: '',
                    // 运输类型
                    trspType: '',
                    // 备注
                    freightBrief: ''
                },
                // 启运地
                custStartPlace: [],
                // 中转地
                custTransitPlace: [],
                custEndPlace: [],
                transitText: '',
                placeDepartureText: '',
                isTransitModal: false,
                isPlaceDepartureModal: false,
                ruleValidate: {
                    cargoType: [
                        validateRules.select('货物类型')[0]
                        // { required: true, message: '请选择货物类型', trigger: 'change' }
                    ],
                    logisticsType: [
                        validateRules.select('物流类型')[0]
                    ],
                    trspType: [
                        validateRules.select('运输类型')[0]
                    ]
                },
                // 选中的场所地点
                ctransitPlace: [],
                ctransitPlaceCode: [],
                startPlace: [],
                startPlaceCode: [],
                endPlace: [],
                endPlaceCode: [],
                checkList: [],
                // 启运地目的地超过三个，继续添加
                addPlaceChange: false,
                isStartPlaceModalShow: false,
                // 目的地目的地超过三个，继续添加
                addEndPlaceChange: false,
                isEndPlaceModalShow: false,
                freightReqCode: '',
                freightReqStatus: '',
                // 启运地提示
                startHintShow: false,
                // 目的地提示
                endHintShow: false,
                // 拿到的选择的城市
                startCity: '',
                startCityCode: '',
                endCity: '',
                endCityCode: '',
                custTransitCity: '',
                custTransitCityCode: '',
                // 拿到的场所的东西先存起来
                startSite: '',
                startSiteCode: '',
                endSite: '',
                endSiteCode: '',
                custTransitSite: '',
                custTransitSiteCode: '',
                startDefault: '',
                endDefault: '',
                ctransitDefault: '',
                startSiteDefault: ''
            }
        },
        mounted () {
            // 摸板字符串
            this.transitText = `中转地过多会导致物流方案的费用过高，<br>时效过长，如需添加请<a class="modal-a" href="">联系客服</a>`
            this.placeDepartureText = `您增加的启运地（目的地）已超过三个， 会匹配出多条路线。是否继续增加？`
        },
        watch: {
            // 监听选中的启运地的长度，如果没有则提示信息
            startPlaceCode: {
                handler (newVal) {
                    if(newVal.length == 0) {
                        this.startHintShow = true
                    } else {
                        this.startHintShow = false
                    }
                },
                deep: true
            },
            // 监听选中的目的地的长度，如果没有则提示信息
            endPlaceCode: {
                handler (newVal) {
                    if(newVal.length == 0) {
                        this.endHintShow = true
                    } else {
                        this.endHintShow = false
                    }
                },
                deep: true
            }
        },
        methods: {
            // 中转地弹框的确定
            transitConfrim () {
                this.isTransitModal = false
            },
            // 选择启运地后点击确定
            startPlaceConfrim () {
                if (!this.isStartPlaceModalShow) {
                    if (this.startPlace.length >= 3) {
                        this.isPlaceDepartureModal = true
                        this.isStartPlaceModalShow = true
                        if (!this.addPlaceChange) return
                    }
                }
                // 如果场所为空，就推入城市
                if (this.startSite.length == 0) {
                    this.startPlace.push(this.startCity)
                    // 拿到选择的城市展示的code
                    this.startPlaceCode.push(this.startCityCode)
                }
                // 选择了场所才推入场所
                if (this.startSite.length != 0) {
                    this.startPlace.push(this.startSite)
                    this.startPlaceCode.push(this.startSiteCode)
                }
                this.startPlace = [...new Set(this.startPlace)]
                this.startPlaceCode = [...new Set(this.startPlaceCode)]
                // 刚开始会有空的，截取出去
                if (this.startPlace.indexOf('') == 0){
                    this.startPlace.splice(0, 1)
                }
                if (this.startPlaceCode.indexOf('') == 0){
                    this.startPlaceCode.splice(0, 1)
                }
            },
            // 选择目的地后点击确定
            endPlaceConfrim () {
                if (!this.isEndPlaceModalShow) {
                    if (this.endPlace.length >= 3) {
                        this.isPlaceDepartureModal = true
                        this.isEndPlaceModalShow = true
                        if (!this.addEndPlaceChange) return
                    }
                }
                // 如果场所为空，就推入城市
                if (this.endSite.length == 0) {
                    this.endPlace.push(this.endCity)
                    // 拿到选择的城市展示的code
                    this.endPlaceCode.push(this.endCityCode)
                }
                // 选择了场所才推入场所
                if (this.endSite.length != 0) {
                    this.endPlace.push(this.endSite)
                    this.endPlaceCode.push(this.endSiteCode)
                }
                this.endPlace = [...new Set(this.endPlace)]
                this.endPlaceCode = [...new Set(this.endPlaceCode)]
                if (this.endPlace.indexOf('') == 0){
                    this.endPlace.splice(0, 1)
                }
                if (this.endPlaceCode.indexOf('') == 0){
                    this.endPlaceCode.splice(0, 1)
                }
            },
            // 选择中转地后点击确定
            okCustTransitPlace () {
                if (this.ctransitPlace.length >= 5) {
                    this.isTransitModal = true
                    return
                }
                // 如果场所为空，就推入城市
                if (this.custTransitSite.length == 0) {
                    this.ctransitPlace.push(this.custTransitCity)
                    // 拿到选择的城市展示的code
                    this.ctransitPlaceCode.push(this.custTransitCityCode)
                }
                // 选择了场所才推入场所
                if (this.custTransitSite.length != 0) {
                    this.ctransitPlace.push(this.custTransitSite)
                    this.ctransitPlaceCode.push(this.custTransitSiteCode)
                }
                this.ctransitPlace = [...new Set(this.ctransitPlace)]
                this.ctransitPlaceCode = [...new Set(this.ctransitPlaceCode)]
                if (this.ctransitPlace.indexOf('') == 0){
                    this.ctransitPlace.splice(0, 1)
                }
                if (this.ctransitPlaceCode.indexOf('') == 0){
                    this.ctransitPlaceCode.splice(0, 1)
                }
            },
            //拿到场景的字典
            _handelDir (val, data) {
                return new Promise((reslove, rejact) => {
                    let code = val[val.length - 1]
                    let iscode = val[val.length - 2]
                    if (
                        iscode == '110000000000' ||
                        iscode == '120000000000' ||
                        iscode == '500000000000' ||
                        iscode == '310000000000'
                    ) {
                        code = iscode
                    }
                    apiChangJing({ city: code }).then(({ data }) => {
                        let arr = data[0]
                        let newArr = arr.map(item => {
                            return {
                                value: item.sttnCode,
                                label: item.sttnName
                            }
                        })
                        reslove(newArr)
                    })
                })
            },
            // 拿到启运地的场景字典
            async handelDirStart (data) {
                if (data.data.length !== 0) {
                    let arr = await this._handelDir(data.value)
                    this.custStartPlace = arr
                    this.startCity = data.data[data.data.length-1].label
                    this.startCityCode = data.data[data.data.length - 1].value
                }
                this.startDefault = data.value.join('~')

            },
            // 启运地的场所
            onPlaceChange (val) {
                if (val) {
                    const code = val.split('-')[0]
                    const value = val.split('-')[1]
                    this.startSite = value
                    this.startSiteCode = code
                }
                this.startSiteDefault = val.split('-')[1]
            },
            // 拿到中转地的场景字典
            async handelDirTrsspmPort (data) {
                if (data.data.length != 0) {
                    let arr = await this._handelDir(data.value)
                    this.custTransitPlace = arr
                    this.custTransitCity = data.data[data.data.length-1].label
                    this.custTransitCityCode = data.data[data.data.length-1].value
                }
                this.ctransitDefault = data.value.join('~')
            },
            // 中转地的场所
            onSiteChange (val) {
                if (val) {
                    const code = val.split('-')[0]
                    const value = val.split('-')[1]
                    this.custTransitSite = value
                    this.custTransitSiteCode = code
                }
            },
            // 拿到目的地的场景字典
            async handelDirEnd (data) {
                if (data.data.length != 0) {
                    let arr = await this._handelDir(data.value)
                    this.custEndPlace = arr
                    this.endCity = data.data[data.data.length-1].label
                    this.endCityCode = data.data[data.data.length-1].value
                }
                this.endDefault = data.value.join('~')
                console.log(this.endDefault)
            },
            // 目的地的场所
            onEndPlaceChange (val) {
                if (val) {
                    const code = val.split('-')[0]
                    const value = val.split('-')[1]
                    this.endSite = value
                    this.endSiteCode = code
                }
            },
            // 模态框显示隐藏状态发生改变
            visibleChange (changeStatus) {
                this.isTransitModal = changeStatus
            },
            // 模态框显示隐藏状态发生改变
            visiblePlaceDeparture (changeStatus) {
                this.isPlaceDepartureModal = changeStatus
            },
            // 保存
            save (name) {
                const data = JSON.parse(JSON.stringify(this.transitModal))
                this.$set(data, 'inputType', '0')
                data.custStartPlace = this.startPlaceCode
                data.custTransitPlace = this.ctransitPlaceCode
                data.custEndPlace = this.endPlaceCode
                if (this.startPlaceCode.length === 0) {
                    this.startHintShow = true
                } else {
                    this.startHintShow = false
                }
                if (this.endPlaceCode.length === 0) {
                    this.endHintShow = true
                } else {
                    this.endHintShow = false
                }
                this.$refs[name].validate((valid) => {
                    if (valid && !this.startHintShow && !this.endHintShow) {
                        apiAddFreightSimple({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.freightReqCode = res.data.freightReqCode
                            this.freightReqStatus = res.data.freightReqStatus
                            // 显示发送按钮
                            this.sendShow = true
                        })
                    }
                })
            },
            // 发送
            send () {
                const data = {
                    freightReqCode: this.freightReqCode,
                    freightReqStatus: this.freightReqStatus
                }
                apiSendSale({ data }).then(res => {
                    this.$Message.info(res.message)
                    this.$router.push(`/freight-request/list-client/1`)
                })
            },
            // 点击跳转到详情录入页面，传送默认值
            detailEntryClick () {
                this.$set(this.transitModal, 'startPlaceArr', this.startPlace)
                this.$set(this.transitModal, 'endPlaceArr', this.endPlace)
                this.$set(this.transitModal, 'ctransitPlaceArr', this.ctransitPlace)
                // 把启运地的code也传过去
                this.$set(this.transitModal, 'startPlaceCode', this.startPlaceCode)
                this.$set(this.transitModal, 'endPlaceCode', this.endPlaceCode)
                this.$set(this.transitModal, 'ctransitPlaceCode', this.ctransitPlaceCode)
                this.$set(this.transitModal, 'startDefault', this.startDefault)
                this.$set(this.transitModal, 'ctransitDefault', this.ctransitDefault)
                this.$set(this.transitModal, 'endDefault', this.endDefault)
                this.$set(this.transitModal, 'startSiteDefault', this.startSiteDefault)
                var jsonData = JSON.stringify(this.transitModal)
                this.$router.push(`/freight-request/detail-entry?a=${jsonData}`)
            },
            // 启运地选择框点击清除按钮
            onPlaceClear (val) {
                this.startSite = ''
                this.startSiteCode = ''
            },
            // 目的地选择框点击清除按钮
            onEndClear (val) {
                this.endSite = ''
                this.endSiteCode = ''
            },
            // 中转地选择框点击清除按钮
            onSiteClear () {
                this.custTransitSite = ''
                this.custTransitSiteCode = ''
            },
            // 点击选中的中转地的删除按钮
            delTransit (index) {
                this.ctransitPlace.splice(index, 1)
                this.ctransitPlaceCode.splice(index, 1)
            },
            // 点击选中的启运地的删除按钮
            delPlaceDeparture (index) {
                this.startPlace.splice(index, 1)
                this.startPlaceCode.splice(index, 1)
            },
            // 点击选中的目的地的删除按钮
            delCustEndPlace (index) {
                this.endPlace.splice(index, 1)
                this.endPlaceCode.splice(index, 1)
            },
            // 启运地超过3个的弹框的点击确认按钮
            handleConfirm () {
                this.addPlaceChange = true
                this.isPlaceDepartureModal = false
            },
            // 启运地超过3个的弹框的点击取消按钮
            handleCancel () {
                this.isEndPlaceModalShow = false
                this.isStartPlaceModalShow = false
                this.isPlaceDepartureModal = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .btn-ok {
        padding: 2px 8px;
        margin-left: 6px;
        font-size: 12px;
        color: #fff;
        background: $light-color;
        border-radius: 4px;
        cursor: pointer;
    }
    .table-data {
        .hint {
            display: inline-block;
            font-size: 12px;
            color: $error-color;
        }
    }
    .ivu-form-item {
        margin-bottom: 0;
    }
    .ivu-cascader-size-default {
        /deep/ .ivu-input{
            width: 120px !important;
            height: 20px;
        }
        /deep/ .ivu-cascader-label {
            line-height: 20px;
        }
    }
    .rule-class {
        position: absolute;
        top: 6px;
        left: -78px;
        z-index: 10;
        color: $error-color;
    }
    .table-data {
        .transit {
            /deep/ .ivu-form-item {
                /deep/ .ivu-form-item-label {
                    width: 10% !important;
                }
            }
            /deep/ .ivu-form-item-content {
                width: 90% !important;
            }
        }
    }
    .public-table-content .l-content .table-data ul{
        padding-top: 0;
    }
</style>