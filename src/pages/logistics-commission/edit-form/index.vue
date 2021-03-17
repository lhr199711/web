<template>
    <div class="form-content">
        <div :class="{ 'item-form-title':cptTitleClass }">{{ cptTitleVal }}</div>
        <Form ref="formId" :model="formValidate" :rules="cptruleValidate" :label-width="labelWidth">
            <FormItem
                :label="item.label"
                :prop="item.prop"
                v-for="(item,index) in cptlistOk"
                :key="index"
            >
                <Input
                    v-if="item.type == 'input'"
                    v-model="formValidate[item.value]"
                    :disabled="item.disabled"
                ></Input>

                <Input
                    v-if="item.type == 'number'"
                    v-model="formValidate[item.value]"
                    number
                    :disabled="item.disabled"
                ></Input>

                <Select
                    v-if="item.type == 'select'"
                    v-model="formValidate[item.value]"
                    :disabled="item.disabled"
                    clearable
                >
                    <Option
                        v-for="op in item.opList"
                        :key="op.value || op.dictionaryKey"
                        :value="op.value || op.dictionaryKey"
                    >{{op.label || op.dictionaryValue}}</Option>
                </Select>
                <DatePicker
                    v-if="item.type == 'datetime'"
                    v-model="formValidate[item.value]"
                    type="datetime"
                    placeholder="Select date"
                ></DatePicker>
                <DatePicker
                    v-if="item.type == 'datetimerange'"
                    v-model="formValidate[item.value]"
                    type="datetimerange"
                    placeholder="Select date"
                ></DatePicker>
            </FormItem>
            <div class="table-box">
                <div class="table-rowjz" v-for="(item,index) in cptlistNo" :key="index">
                    <div class="l"></div>
                    <div class="r"></div>
                </div>
            </div>
        </Form>
    </div>
</template>

<script>
import utilMixin from '../mixins/utilMixin'
export default {
    name: 'edit-form',
    mixins: [utilMixin],
    props: {
        list: {
            type: Array,
            default () {
                return [{
                    type: 'input',
                    label: '姓名',
                    value: 'name',
                    prop: 'name',
                    // disabled:true
                },
                {
                    type: 'select',
                    label: '选择',
                    value: 'status',
                    prop: 'status',
                    opList: [
                        { value: 1, label: '状态1' },
                        { value: 2, label: '状态2' },
                    ],
                },
                {},
                {},
                {},
                {},]
            },
        },
        //标题
        isTitle: {
            type: String,
            default: '',
        },
        //左边字的宽度
        labelWidth: {
            type: Number,
            default: 120,
        },
        // 外部特殊校验规则
        ruleValidate: {
            type: Object,
            default () {
                return {}
            },
        },
        // 默认值
        DefaultVal: {
            type: Object,
            default () {
                return {}
            },
        },
    },
    data () {
        return {
            // formValidate: {
            //     timeArr: [],
            //     cargoTotal: 1
            // },
        }
    },
    computed: {
        formValidate(){
            return this.DefaultVal
        },
        //空格行
        cptlistNo () {
            let arr = this.list.filter((item) => !item.type)
            return arr
        },
        //有值行
        cptlistOk () {
            let arr = this.list.filter((item) => item.type)
            return arr
        },
        //外部/内部合并校验规则
        cptruleValidate () {
            let obj = {}
            this.list.forEach((item) => {
                if (item.prop) {
                    obj[item.prop] = [
                        {
                            required: true,
                            message: '必填',
                            trigger: 'blur,change',
                        },
                    ]
                }
                if (item.prop && item.type === 'number') {
                    obj[item.prop] = [
                        { required: true, message: '请输入数字', trigger: 'blur', type: 'number' }
                    ]
                }
            })
            return {
                ...obj,
                ...this.ruleValidate,
            }
        },
        // 是否有标题样式
        cptTitleClass () {
            if (this.isTitle || this.isTitle === '空') {
                return true
            }
            return false
        },
        // 是否有标题值
        cptTitleVal () {
            if (!this.isTitle || this.isTitle === '空') {
                return ''
            }
            return this.isTitle
        }
    },
    created () { },
    mounted () { },
    methods: {
        handelValidate () {
            let flag = null
            this.$refs.formId.validate((valid) => {
                if (valid) {
                    let timeobj = this.datetimerange_m(this.formValidate.timeArr, "a", "b")
                    delete this.formValidate.timeArr
                    flag = {
                        ...this.formValidate,
                        ...timeobj
                    }
                } else {
                    flag = false
                    this.$Message.error('请填入必填项')
                }
            })
            return flag
        },
    },
}
</script>

<style scoped lang="scss">
.form-content {
    /deep/.ivu-row {
        margin-bottom: 16px;
    }
    .item-form-title {
        height: 16px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 16px;
        margin: 0 0 10px 26px;
    }
    /deep/ .ivu-form-item {
        margin: 0;
        /deep/.ivu-form-item-label {
            background: #f5f6f8;
            border: 1px solid #e6e6e6;
            border-bottom: none;
            vertical-align: middle;
        }
        /deep/.ivu-form-item-content {
            padding-left: 4px;
            padding-right: 4px;
            border: 1px solid #e6e6e6;
            border-bottom: none;
            border-left: none;
            background: #fff;
            vertical-align: middle;
        }
        /deep/.ivu-select,
        /deep/.ivu-input {
            width: 146px;
            background: rgba(249, 249, 249, 1);
            border-radius: 4px;
            .ivu-select-selection {
                background: rgba(249, 249, 249, 1);
            }
        }
        /deep/.ivu-input-group {
            width: 60%;
        }
        /deep/.ivu-input-group-append {
            width: 70px;
        }
        /deep/.ivu-form-item-error-tip {
            top: 6px;
            left: 152px;
            display: none;
        }
        // 给最后一行添加
        &:nth-last-child(2) {
            border-bottom: 1px solid #e6e6e6;
        }
    }
    // 没有数据的行样式
    .table-box {
        .table-rowjz {
            height: 35px;
            line-height: 30px;
            display: flex;
            border-bottom: 1px solid #e6e6e6;
            &:first-child {
                .l {
                    border-top: 1px solid #e6e6e6;
                }
                .r {
                    border-top: 1px solid #e6e6e6;
                }
            }
            .l,
            .r {
                font-size: 14px;
                height: 100%;
                font-weight: bold;
                color: rgba(102, 102, 102, 1);
            }
            .l {
                width: 120px;
                text-align: right;
                background: #f5f6f8;
                border-right: 1px solid #e6e6e6;
                border-left: 1px solid #e6e6e6;
            }
            .r {
                flex: 1;
                background: #fff;
                padding-left: 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                border-right: 1px solid #e6e6e6;
            }
        }
    }
}
</style>
