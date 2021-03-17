<template>
    <div class="Feedback-form">
        <div class="main-box">
            <Form ref="formId" :model="formValidate" :label-width="120">
                <Row v-for="(arr, index) in cptList" :key="index">
                    <Col v-for="(item, index) in arr" :key="index" :span="6">
                        <FormItem :label="item.label" :prop="item.prop">
                            <Input v-if="item.controlType == 'I'" v-model="formValidate[item.name]"></Input>
                            <Select
                                v-if="item.controlType == 'D'"
                                v-model="formValidate[item.name]"
                                clearable
                            >
                                <Option
                                    v-for="op in item.opList"
                                    :key="op.value || op.dictionaryKey"
                                    :value="op.value || op.dictionaryKey"
                                >{{ op.label || op.dictionaryValue }}</Option>
                            </Select>
                            <RadioGroup
                                v-if="item.controlType == 'S'"
                                v-model="formValidate[item.name]"
                            >
                                <Radio
                                    v-for="op in item.opList"
                                    :key="op.value || op.dictionaryKey"
                                    :label="op.value || op.dictionaryKey"
                                >{{ op.label || op.dictionaryValue }}</Radio>
                            </RadioGroup>
                            <CheckboxGroup
                                v-if="item.controlType == 'C'"
                                v-model="formValidate[item.name]"
                            >
                                <Checkbox
                                    v-for="op in item.opList"
                                    :key="op.value || op.dictionaryKey"
                                    :label="op.value || op.dictionaryKey"
                                >{{ op.label || op.dictionaryValue }}</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <div class="right-box">
            <Button type="primary" @click="save">保存</Button>
        </div>
    </div>
</template>

<script>
import { apiAddExecuteFeedback } from '@/api/logisticsCommission'
import utilMixin from '../../mixins/utilMixin'
export default {
    name: 'FeedbackForm',
    mixins: [utilMixin],
    props: {
        list: {
            type: Array,
            default () {
                return []
            }
        },
        dataObj: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {}
    },
    computed: {
        // 计算表单4个一行,和数据处理
        cptList () {
            let data = this.list
            let result = []
            for (let i = 0; i < data.length; i += 4) {
                result.push(data.slice(i, i + 4))
            }
            return result
        },
        formValidate () {
            let obj = {}
            let data = this.list
            data.forEach((item) => {
                obj[item.name] = item.value
                if (item.controlType == 'C' && item.value) {
                    obj[item.name] = item.value.split(',')
                }
            })
            return obj
        }
    },
    created () { },
    mounted () { },
    methods: {
        //保存数据
        save () {
            let data = {
                taskCode: this.dataObj.taskCode,
                orderCode: this.dataObj.orderCode,
                dataResult: this._processFormData(this.formValidate, this.list)
            }
            apiAddExecuteFeedback({
                data
            }).then((res) => {
                this.$Message.success(res.message)
            })
            // console.log()
        },
        _processFormData (newValue, oldValue) {
            let arr = oldValue.map((item) => {
                return {
                    ...item,
                    value: this.isArrVal_m(newValue[item.name])
                        ? newValue[item.name].join(',')
                        : newValue[item.name]
                }
            })
            return arr
        }
    }
}
</script>

<style scoped lang="scss">
.Feedback-form {
    background: $background-color;
    height: 140px;
    padding: 20px 20px 0 20px;
    display: flex;
    .main-box {
        width: 1280px;
        overflow-y: auto;
        @extend %scrollbar;
        // @extend %scrollbar-crosswise;
    }
    .right-box {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
