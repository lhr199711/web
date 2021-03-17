<template>
    <div class="public-form-content">
        <Form
            :ref="formId"
            :model="formValidate"
            :rules="cptruleValidate"
            :label-width="labelWidth"
        >
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

                <Select
                    v-if="item.type == 'select'"
                    v-model="formValidate[item.value]"
                    :disabled="item.disabled"
                    clearable
                >
                    <Option v-for="op in item.opList" :key="op.value" :value="op.value">{{op.label}}</Option>
                </Select>
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
export default {
    name: 'edit-form',
    props: {
        list: {
            type: Array,
            default() {
                return []
            },
        },
        formId: {
            type: String,
            default: '',
        },
        labelWidth: {
            type: Number,
            default: 120,
        },
        formValidate: {
            type: Object,
            default() {
                return {}
            },
        },
        ruleValidate: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    data() {
        return {}
    },
    computed: {
        cptlistNo() {
            let arr = this.list.filter((item) => !item.type)
            return arr
        },
        cptlistOk() {
            let arr = this.list.filter((item) => item.type)
            return arr
        },
        cptruleValidate() {
            let obj = {}
            this.list.forEach((item) => {
                if (item.prop) {
                    obj[item.prop] = [
                        {
                            required: true,
                            message: '必填',
                            trigger: 'blur',
                        },
                    ]
                }
            })
            return {
                ...obj,
                ...this.ruleValidate,
            }
        },
    },
    created() {},
    mounted() {},
    methods: {
        handelValidate() {
            return new Promise((resolve, reject) => {
                this.$refs.formId1.validate((valid) => {
                    if (valid) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
        },
    },
}
</script>

<style scoped lang="scss">
.public-form-content {
    background: rgba(249, 249, 249, 1);
    padding: 0 20px 20px 20px;
    /deep/.ivu-row {
        margin-bottom: 16px;
    }
    .item-form-title {
        height: 35px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 35px;
    }
    .ivu-form-item {
        margin-bottom: 0;
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
        &:last-child {
            /deep/.ivu-form-item-label {
                border-bottom: 1px solid #e6e6e6;
            }
            /deep/.ivu-form-item-content {
                border-bottom: 1px solid #e6e6e6;
            }
        }
    }
    // 没有数据的行样式
    .table-box {
        .table-rowjz {
            height: 30px;
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
