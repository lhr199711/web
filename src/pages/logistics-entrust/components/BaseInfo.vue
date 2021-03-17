<template>
    <div>
        <Form :model="formItem" :rules="ruleValidate" ref="formItemData" :label-width="200" label-colon>
            <div class="public-form-card">
                <Row>
                    <Col span="24">
                        <FormItem label="委托类型" prop="entrustType">
                            <Select v-model="formItem.entrustType" clearable>
                                <Option v-for="item in delegationTypeList" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="合同委托起期" prop="startPeriod">
                            <DatePicker v-model="formItem.startPeriod" type="date" split-panels></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="合同委托止期" prop="untilPeriod">
                            <DatePicker v-model="formItem.untilPeriod" type="date" split-panels></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="货物总量" prop="cargoTotal">
                            <Input v-model="formItem.cargoTotal" type="number"></Input>
                        </FormItem>
                    </Col>
                    <Col span="7" class="no-right-border">
                        <FormItem label="委托周期" prop="entrustPeriod">
                            <Input type="number" v-model="formItem.entrustPeriod"/>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem :label-width="0">
                            天
                            <!-- <Select v-model="formItem.entrustPeriodUnit" clearable>
                                <Option v-for="(item, index) in timeUnits" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                            </Select> -->
                        </FormItem>
                    </Col>
                </Row>
            </div>
        </Form>
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
                default: () => ({
                    entrustType: '', // 委托类型
                    startPeriod: '', // 合同委托起期 time
                    untilPeriod: '', // 合同委托止期 time
                    cargoTotal: '', // 货物总量 number
                    entrustPeriod: '', // 委托周期 number
                    entrustPeriodUnit: 'H', //委托周期单位
                    cooperationType: '' //合作模式
                })
            },
            // 是否详情
            isDetail: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                timeUnits: this.$getDictionary('TIME_UNIT'), //时间字典
                delegationTypeList: this.$getDictionary('DELEGATION_TYPE'), // 委托类型
                formItem: this.defaultData,
                ruleValidate: {
                    entrustType: [validateRules.select('委托类型')[0]],
                    startPeriod: [
                        {
                            required: true,
                            validator: validateRules.validateTime,
                            trigger: 'change'
                        }
                    ], //起 time
                    untilPeriod: [
                        {
                            required: true,
                            validator: validateRules.validateTime,
                            trigger: 'change'
                        }
                    ], //止 time
                    cargoTotal: [validateRules.required('货物总量')[0]],
                    entrustPeriod: [validateRules.required('委托周期')[0]]
                }
            }
        },
        methods:{
            submitForm () {
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        this.formItem.cargoTotal = Number(this.formItem.cargoTotal)
                        this.formItem.entrustPeriod = Number(this.formItem.entrustPeriod)
                        this.$emit('submit-form', this.formItem)
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.ivu-col-span-5 {
    .ivu-form-item {
        /deep/ .ivu-select {
            // margin-left: -20px;
        }
    }
}
</style>
