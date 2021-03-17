<template>
    <div>
        <div id="CustomsClearanceReq">
            <Form :model="formItem" :rules="ruleValidate" ref="formItemData" :label-width="200" label-colon>
                <div class="public-form-card">
                    <Row>
                        <Col span="24">
                            <FormItem label="是否需要报关服务" prop="customsClearanceReq">
                                <RadioGroup v-model="formItem.customsClearanceReq" @on-change="handleChooseType">
                                    <Radio label="1">
                                    是
                                    </Radio>
                                    <Radio label="2" style="margin-left: 30px;">
                                        否
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" class="col-span">
                            <FormItem label="进口报关地要求">
                                <adt-city-selector @on-change="handelChangeImPort" :defaultData="imPortDefault" style="width:50%;"></adt-city-selector>
                                <Select v-model="formItem.imPortArea" filterable clearable style="width:50%;">
                                    <Option
                                        v-for="(value,key) in imPortAreaList"
                                        :value="value"
                                        :key="key"
                                    >{{ value }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12" class="col-span">
                            <FormItem label="出口报关地要求">
                                <adt-city-selector @on-change="handelChangeExPort" :defaultData="exPortDefault" style="width:50%;"></adt-city-selector>
                                <Select v-model="formItem.exPortArea" filterable clearable style="width:50%;">
                                    <Option
                                        v-for="(value,key) in exPortAreaList"
                                        :value="value"
                                        :key="key"
                                    >{{ value }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="选择报关综保区" prop="customsClearanceArea">
                                <CheckboxGroup v-model="formItem.customsClearanceArea">
                                        <Checkbox label="重庆">
                                        </Checkbox>
                                        <Checkbox label="上海">
                                        </Checkbox>
                                        <Checkbox label="香港">
                                        </Checkbox>
                                        <Checkbox label="大阪">
                                        </Checkbox>
                                </CheckBoxGroup>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
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
            return{
                formItem: this.defaultData,
                imPortAreaList:['中国','俄罗斯'],
                exPortAreaList:['中国','俄罗斯'],
                exPortDefault: '', //回显出口报关地
                imPortDefault: '', //回显进口报关地
                ruleValidate: {
                    // delegationType: [
                    //     validateRules.select('委托类型')[0]
                    // ],
                    // startEndDate: [
                    //     {
                    //         required: true,
                    //         validator: validateRules.validateTime,
                    //         trigger: 'change'
                    //     }
                    // ],
                    // cargoTotalWeight: [
                    //     validateRules.required('货物总量')[0]
                    // ],
                    // entrustPeriod: [
                    //     {
                    //         required: true,
                    //         validator: validateRules.validateTime,
                    //         trigger: 'change'
                    //     }
                    // ]
                }
            }
        },
        created() {
            if (this.formItem.exPortDefault!='') {
                this.exPortDefault = this.formItem.exPortDefault //回显出口报关地 //exPortDefault
            }
            if (this.formItem.imPortDefault!='') {
                this.imPortDefault = this.formItem.imPortDefault //回显进口报关地 //imPortDefault
            }
        },
        methods:{
            submitForm () {
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        this.$emit('submit-form', this.formItem)
                    }
                })
            }, //exPortDefault
            handleChooseType () {
                // console.log('');
                // 重置
                // this.$refs.formValidate.fields.forEach(e => {
                //     if (e.prop !== 'type') {
                //         e.resetField()
                //     }
                // })
            },
            // 出口报关地 拿到启运地的场景字典
            handelChangeImPort (value) {
                console.log(value,"value1")
                this.formItem.imPortDefault = value.value.join('~')
                // this.departurePortList = await this._handelDir(value.value)
            },
            // 出口报关地
            handelChangeExPort(value){
                console.log(value,"value2")
                this.formItem.exPortDefault = value.value.join('~')
                // this.departurePortList = await this._handelDir(value.value)
            }
        }
    }
</script>

<style lang="scss" scoped>
#CustomsClearanceReq{
    background: #ffffff;
    padding: 20px;
    .col-span{
        /deep/ .ivu-form-item-content{
            display: flex;
            .ivu-cascader-rel{
                width: 80%;
            }
        }
    }
}
</style>
