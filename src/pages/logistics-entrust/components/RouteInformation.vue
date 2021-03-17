<template>
    <div>
        <div id="RouteInformation" class="public-form-card">
            <Form ref="formItemData" :model="formItem" :rules="ruleValidate" inline label-colon>
                <div class="wrap">
                    <div class="content-box">
                        <span style="width: 55px; flex-shrink: 0;">启运地:</span>
                        <adt-city-selector :defaultData="search.dispatchCity" @on-change="changeDispatchCity" />
                        <Select v-model="search.dispatchSite" clearable>
                            <Option v-for="(option, index) in dispatchOptions" :key="index" :value="option.value">
                                {{ option.label }}
                            </Option>
                        </Select>
                    </div>
                    <div class="icon">
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_jiantou2" />
                        </svg>
                    </div>
                    <div class="content-box">
                        <span style="width: 55px; flex-shrink: 0;">目的地:</span>
                        <adt-city-selector :defaultData="search.destinationCity" @on-change="changeDestinationCity" />
                        <Select v-model="search.destinationSite" clearable>
                            <Option v-for="(option, index) in destinationOptions" :key="index" :value="option.value">
                                {{ option.label }}
                            </Option>
                        </Select>
                    </div>
                </div>
                <Row class="last-row">
                    <Col span="12">
                        <FormItem label="物流类型" prop="logisticsType">
                            <Select v-model="formItem.logisticsType" clearable>
                                    <Option v-for="item in logisticsTypeListData" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                        {{ item.dictionaryValue }}
                                    </Option>
                                </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="运输方式" prop="trspMode">
                            <RadioGroup v-model="formItem.trspMode" @on-change="handleChooseType">
                                <Radio label="1">
                                海运
                                </Radio>
                                <Radio label="2" style="margin-left: 30px;">
                                    空运
                                </Radio>
                                <Radio label="3" style="margin-left: 30px;">
                                    公路
                                </Radio>
                                <Radio label="4" style="margin-left: 30px;">
                                    铁路
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <div v-if="!isDetail" class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
        </div>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    export default {
        props: {
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                trspMode: [],
                departurePortList: [],
                logisticsType: '',
                logisticsTypeList: [],
                logisticsTypeListData: this.$getDictionary('TRANSPORT_TYPE'),
                //
                search: {
                    dispatchCity: '',
                    dispatchSite: '',
                    destinationCity:  '',
                    destinationSite:  '',
                    serverStatus:  '',
                    serverCode:  ''
                },
                // 启运地
                dispatchOptions: [],
                // 目的地
                destinationOptions: [],
                formItem: {
                    logisticsType: '',
                    trspMode: ''
                },
                ruleValidate: {
                    logisticsType: [
                        {
                            required: true,
                        }
                    ],
                    trspMode: [
                        {
                            required: true,
                            validator: validateRules.validateTime,
                            trigger: 'change'
                        }
                    ]
                }
            }
        },
        methods:{
            handleChooseType () {
                // 重置
                // this.$refs.formValidate.fields.forEach(e => {
                //     if (e.prop !== 'type') {
                //         e.resetField()
                //     }
                // })
            },
            submitForm () {
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        this.$emit('submit-form', this.formItem)
                    }
                })
            },
            // 选择启运地城市
            async changeDispatchCity (value) {
                console.log(value)
                this.search.dispatchCity = value.value.join('~')
                // this.dispatchOptions = await this._handelDir(value.value)
                console.log(this.search.dispatchCity)
            },
            // 选择目的地城市
            async changeDestinationCity (value) {
                this.search.destinationCity = value.value.join('~')
                // this.destinationOptions = await this._handelDir(value.value)
            }
        }
    }
</script>

<style lang="scss" scoped>
#RouteInformation {
    background: #ffffff;
    margin-top: 30px;
    padding: 20px;
    .wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 76px;
        background: #F9F9F9;
        margin-bottom: 20px;
        .content-box{
            flex-grow: 8;
            display: flex;
            justify-content: center;
            align-items: center;
            /deep/ .ivu-form-item{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin: 20px;
                .ivu-form-item-content{
                    width: 160px;
                }
            }
            /deep/ .ivu-select{
                    width: 160px;
                    margin-left: 20px;
                }
        }

        .icon{
           flex-grow: 2;
           text-align: center;
           vertical-align: middle;
           .iconfont{
               width: 10em;
               height: 2em;
               color: #02ADB5;
           }
        }


    }
    .last-row{
        border: 1px solid #E5E5E5;
        /deep/ .ivu-form-item {
            display: flex;
            align-items: center;
            margin: 0;
            .ivu-form-item-label{
                flex: 3;
                color: #666666;
                font-size: 14px;
                background: #F5F6F8;
                border: 1px solid #E5E5E5;
            }
            .ivu-form-item-content{
                flex: 7;
            }
        }
    }
}
button {
    margin-top: 30px;
}
</style>
