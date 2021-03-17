<template>
    <!-- 我是第二层 -->
    <div class="flod-box">
        <div class="btns">
            <slot name="btns-start"></slot>
            <Button @click="addItemData">
                新增货物信息
                <Icon type="ios-add-circle-outline" />
            </Button>
            <Button @click="deleteItemData">
                批量删除
                <Icon type="ios-close-circle-outline" />
            </Button>
            <slot name="btns-end"></slot>
        </div>
        <CheckboxGroup v-model="socialSelection">
            <Row v-for="(item,index) in list" :key="index">
                <Col span="24">
                    <Checkbox :label="index"></Checkbox>
                    <div class="item-box">
                        <div class="public-flod-header" style="background: #f5f5f5;">
                            <div class="header-l">00{{index + 1}}货物</div>
                            <div class="header-r">
                                <span
                                    class="btn"
                                    v-if="item.isContentShow"
                                    @click="onClose(item,index)"
                                >保存</span>
                                <span class="icon">
                                    <Icon v-if="item.isContentShow" type="ios-arrow-down" />
                                    <Icon
                                        v-if="!item.isContentShow"
                                        @click="onOpen(item,index)"
                                        type="ios-arrow-up"
                                    />
                                </span>
                            </div>
                        </div>
                        <!--这里的可以使用动画-->
                        <div class="main-box" v-show="item.isContentShow">
                            <div class="public-form-content">
                                <Form
                                    :ref="`formCargoInfo${index}`"
                                    label-position="right"
                                    :label-width="152"
                                    :rules="formItemRule"
                                    :model="list[index]"
                                >
                                    <Row :gutter="2">
                                        <Col span="8">
                                            <p class="item-form-title">货物信息</p>
                                            <FormItem label="货物名称：" prop="cargoName">
                                                <Select
                                                    v-model="list[index].cargoName"
                                                    @on-change="handelSearch_m(item.cargoName,index)"
                                                >
                                                    <Option
                                                        v-for="item in goodsNameList"
                                                        :value="item"
                                                        :key="item"
                                                    >{{ item }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="单次箱量：">
                                                <Input
                                                    type="number"
                                                    v-model="list[index].suitcaseQty"
                                                ></Input>
                                            </FormItem>
                                            <FormItem label="单次毛重：" prop="grossWeight">
                                                <Input
                                                    v-model="list[index].grossWeight"
                                                    type="number"
                                                ></Input>
                                            </FormItem>
                                            <FormItem label="单次净重：" prop="netWeight">
                                                <Input
                                                    type="number"
                                                    v-model="list[index].netWeight"
                                                ></Input>
                                            </FormItem>
                                            <FormItem label="单次件数：" prop="cargoQty">
                                                <Input type="number" v-model="list[index].cargoQty"></Input>
                                            </FormItem>
                                            <FormItem label="单次体积：">
                                                <Input v-model="list[index].cargoVol" type="number"></Input>
                                            </FormItem>
                                        </Col>
                                        <Col span="8">
                                            <p class="item-form-title">一级包装</p>
                                            <FormItem label="包装类型：" prop="packType0">
                                                <!-- <Input v-model="list[index].packType0"></Input> -->
                                                <Select
                                                    v-model="list[index].packType0"
                                                    filterable
                                                    clearable
                                                >
                                                    <Option
                                                        v-for="item in packTypeList"
                                                        :value="item.value"
                                                        :key="item.value"
                                                    >{{ item.label }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="包装毛重：" prop="packType0">
                                                <Input
                                                    v-model="list[index].grossWeight0"
                                                    type="number"
                                                ></Input>
                                            </FormItem>
                                            <FormItem label="包装净重：" prop="packType0">
                                                <Input
                                                    v-model="list[index].netWeight0"
                                                    type="number"
                                                ></Input>
                                            </FormItem>
                                            <FormItem label="包装件数：" prop="packType0">
                                                <Input v-model="list[index].packQty0" type="number"></Input>
                                            </FormItem>
                                            <FormItem label="包装体积：">
                                                <Input v-model="list[index].packVol0" type="number"></Input>
                                            </FormItem>
                                            <FormItem
                                                class="jz-meaningless"
                                                v-for="(item,index) in 1"
                                                :key="index"
                                            >
                                                <template slot="label">无意义</template>
                                                <Input disabled></Input>
                                            </FormItem>
                                        </Col>
                                        <Col span="8">
                                            <p class="item-form-title">二级包装</p>
                                            <FormItem label="包装类型：">
                                                <!-- <Input v-model="list[index].packType1"></Input> -->
                                                <Select
                                                    v-model="list[index].packType1"
                                                    filterable
                                                    clearable
                                                >
                                                    <Option
                                                        v-for="item in packTypeList"
                                                        :value="item.value"
                                                        :key="item.value"
                                                    >{{ item.label }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="包装毛重：">
                                                <Input
                                                    type="number"
                                                    v-model="list[index].grossWeight1"
                                                ></Input>
                                            </FormItem>
                                            <FormItem label="包装净重：">
                                                <Input
                                                    type="number"
                                                    v-model="list[index].netWeight1"
                                                ></Input>
                                            </FormItem>
                                            <FormItem label="包装件数：">
                                                <Input type="number" v-model="list[index].packQty1"></Input>
                                            </FormItem>
                                            <FormItem label="包装体积：">
                                                <Input type="number" v-model="list[index].packVol1"></Input>
                                            </FormItem>
                                            <FormItem
                                                class="jz-meaningless"
                                                v-for="(item,index) in 1"
                                                :key="index"
                                            >
                                                <template slot="label">无意义</template>
                                                <Input disabled></Input>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </CheckboxGroup>
    </div>
</template>

<script>
import validateRules from '@/libs/validateRules'
import { apiGetEntrustCargo } from '@/api/logisticsCommission'
import dictionaryList from '@/mixins/dictionaryList'
export default {
    mixins: [dictionaryList],
    components: {},
    data () {
        return {
            socialSelection: [], //选中的
            // 处理的货物信息key
            itemName: [],
            // 后端货物信息
            itemNameObj: {},
            formItemRule: {
                cargoName: [
                    { required: true, message: '必填', trigger: 'change' }
                ],
                markNo: [validateRules.required('')[0]],
                grossWeight: [validateRules.required('')[0]],
                netWeight: [validateRules.required('')[0]],
                cargoNum: [validateRules.required('')[0]],
                packType: [validateRules.required('')[0]],
                cargoQty: [validateRules.required('')[0]],
                // 包装
                packType0: [validateRules.required('')[0]]
            },
            list: [{ isContentShow: false }] // 得到的数据
        }
    },
    watch: {
        list: {
            handler (newVal, oldVal) {
                this.$emit('cargoInfoItem', oldVal)
            },
            deep: true
        }
    },
    created () {
        this.handel_packTypeList_m()
        this.handel_goodsNameList_m()
    },
    computed: {},
    methods: {
        getItemNames () {
            // 查询货物信息表
            apiGetEntrustCargo({ entrustCode: this.bianHao.entrustCode }).then(
                ({ data }) => {
                    this.itemName = Object.keys(data)
                    this.itemNameObj = data
                }
            )
        },
        onOpen (item, index) {
            //打开
            let off = this.list.some(op => op.isContentShow == true)
            if (off) {
                this.$Message.error('请先保存编辑项')
                return
            }
            this.list[index].isContentShow = true
        },
        onClose (item, index) {
            // 收起
            this.$refs[`formCargoInfo${index}`][0].validate(valid => {
                if (valid) {
                    this.list[index].isContentShow = false
                    this.$Message.success('新增货物信息成功!')
                } else {
                    this.$Message.error('表单验证不通过!请修改，或删除这条记录')
                }
            })
        },
        deleteItemData () {
            //批量删除新增
            let newList = this.list.filter(
                (op, index) => !this.socialSelection.some(item => item == index)
            )
            this.list = newList
            this.socialSelection = []
        },
        addItemData () {
            // 添加
            this.list.push({ isContentShow: false })
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.ivu-row {
    margin-bottom: 10px;
}
/deep/.ivu-col-span-24 {
    display: flex;
}
/deep/.ivu-checkbox + span {
    display: none;
}
/deep/.ivu-checkbox {
    padding: 4px 6px;
}
.btns {
    padding: 8px 0;
    /deep/.ivu-btn {
        margin-right: 12px;
    }
}
.public-form-content {
    background: rgba(249, 249, 249, 1);
    /deep/.ivu-row {
        margin-bottom: 16px;
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
        /deep/.ivu-form-item-error-tip {
            top: 6px;
            left: 152px;
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
    // 额外加的包裹层
    .jz-meaningless {
        /deep/.ivu-form-item-label {
            color: #f5f6f8 !important;
        }
    }
    .jz-input-group {
        /deep/.ivu-form-item-error-tip {
            left: 225px !important;
        }
    }
}
.flod-box {
    .item-box {
        width: 100%;
    }
    .main-box {
        width: 100%;
        padding: 5px;
        background: #f9f9f9;
    }
}
</style>