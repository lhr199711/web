<template>
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
                        <div class="header">
                            <div class="header-l">{{list[index].cargoName}}</div>
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
                                                <Input v-model="list[index].cargoName"></Input>
                                            </FormItem>
                                            <FormItem label="唛头：" prop="markNo">
                                                <Input v-model="list[index].markNo"></Input>
                                            </FormItem>
                                            <FormItem label="HS编码：">
                                                <Input v-model="list[index].hsCode"></Input>
                                            </FormItem>
                                            <FormItem
                                                label="毛重："
                                                prop="grossWeight"
                                                class="jz-input-group"
                                            >
                                                <Input
                                                    v-model="list[index].grossWeight"
                                                    type="number"
                                                >
                                                    <span slot="append">kg</span>
                                                </Input>
                                            </FormItem>
                                            <FormItem
                                                label="净重："
                                                prop="netWeight"
                                                class="jz-input-group"
                                            >
                                                <Input
                                                    v-model="list[index].netWeight"
                                                    type="number"
                                                >
                                                    <span slot="append">kg</span>
                                                </Input>
                                            </FormItem>
                                            <FormItem label="货物件数：" prop="cargoQty">
                                                <Input v-model="list[index].cargoQty" type="number"></Input>
                                            </FormItem>
                                            <FormItem label="货物体积：">
                                                <Input
                                                    v-model.number="list[index].cargoVol"
                                                    type="number"
                                                >
                                                    <span slot="append">m³</span>
                                                </Input>
                                            </FormItem>
                                        </Col>
                                        <Col span="8">
                                            <p class="item-form-title">一级包装</p>
                                            <FormItem label="包装类型：" prop="packType0">
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
                                                >
                                                    <span slot="append">kg</span>
                                                </Input>
                                            </FormItem>
                                            <FormItem label="包装净重：" prop="packType0">
                                                <Input
                                                    v-model="list[index].netWeight0"
                                                    type="number"
                                                >
                                                    <span slot="append">kg</span>
                                                </Input>
                                            </FormItem>
                                            <FormItem label="包装件数：">
                                                <Input v-model="list[index].packQty0" type="number"></Input>
                                            </FormItem>
                                            <FormItem label="包装体积：">
                                                <Input v-model="list[index].packVol0" type="number">
                                                    <span slot="append">m³</span>
                                                </Input>
                                            </FormItem>
                                            <FormItem
                                                class="jz-meaningless"
                                                v-for="(item,index) in 2"
                                                :key="index"
                                            >
                                                <template slot="label">无意义</template>
                                                <Input disabled></Input>
                                            </FormItem>
                                        </Col>
                                        <Col span="8">
                                            <p class="item-form-title">二级包装</p>
                                            <FormItem label="包装类型：">
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
                                                <Input v-model.number="list[index].grossWeight1">
                                                    <span slot="append">kg</span>
                                                </Input>
                                            </FormItem>
                                            <FormItem label="包装净重：">
                                                <Input v-model.number="list[index].netWeight1">
                                                    <span slot="append">kg</span>
                                                </Input>
                                            </FormItem>
                                            <FormItem label="包装件数：">
                                                <Input v-model.number="list[index].packQty1"></Input>
                                            </FormItem>
                                            <FormItem label="包装体积：">
                                                <Input v-model.number="list[index].packVol1">
                                                    <span slot="append">m³</span>
                                                </Input>
                                            </FormItem>
                                            <FormItem
                                                class="jz-meaningless"
                                                v-for="(item,index) in 2"
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
import dictionaryList from '@/mixins/dictionaryList'
export default {
    mixins: [dictionaryList],
    components: {},
    data () {
        return {
            socialSelection: [], //选中的
            //表单验证规则
            formItemRule: {
                cargoName: [validateRules.required('')[0]],
                markNo: [validateRules.required('')[0]],
                grossWeight: [validateRules.required('')[0]],
                netWeight: [validateRules.required('')[0]],
                cargoNum: [validateRules.required('')[0]],
                packType: [validateRules.required('')[0]],
                netWeight: [validateRules.required('')[0]],
                cargoQty: [validateRules.required('')[0]],
                cargoVol: [validateRules.required('')[0]],
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
    },
    methods: {
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
.flod-box {
    .item-box {
        width: 100%;
    }
    .header {
        width: 100%;
        height: 40px;
        padding: 0 20px;
        background: #fff6e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn {
            border: 1px solid #ccc;
            background: #fff;
            height: 27px;
            line-height: 27px;
            padding: 4px 8px;
            border-radius: 4px;
            margin: 0 10px;
            cursor: pointer;
        }
        .icon {
            cursor: pointer;
        }
    }
    .main-box {
        width: 100%;
        padding: 5px;
        background: #f9f9f9;
    }
}
</style>
