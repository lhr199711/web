<template>
    <!-- 我是第一层的 -->
    <div class="flod-box">
        <div class="btns">
            <slot name="btns-start"></slot>
            <Button @click="addItemData">
                新增单次委托
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
                            <span>00{{index + 1}}单次委托</span>
                            <div>
                                <span class="btn">
                                    <span
                                        v-if="!item.isContentShow"
                                        @click.de="onOpen(item,index)"
                                    >编辑</span>
                                    <span v-if="item.isContentShow" @click="onClose(item,index)">保存</span>
                                </span>
                                <span class="icon">
                                    <Icon v-if="item.isContentShow" type="ios-arrow-down" />
                                    <Icon v-else type="ios-arrow-up" />
                                </span>
                            </div>
                        </div>
                        <!--这里的可以使用动画-->
                        <div class="main-box" v-show="item.isContentShow">
                            <cargo-info @cargoInfoItem="cargoInfoItem_m">
                                <template slot="btns-end">
                                    <span style="color:red;">*</span>
                                    <span>开始时间：</span>
                                    <DatePicker
                                        type="datetime"
                                        placeholder="Select date"
                                        v-model="list[index].startDatetime"
                                    ></DatePicker>
                                </template>
                            </cargo-info>
                        </div>
                    </div>
                </Col>
            </Row>
        </CheckboxGroup>
    </div>
</template>

<script>
import validateRules from '@/libs/validateRules'
import CargoInfo from './CargoInfo2-1'
import formCargoInfo from '@/mixins/formCargoInfo'
export default {
    mixins: [formCargoInfo],
    components: {
        CargoInfo
    },
    data () {
        return {
            socialSelection: [], //选中的
            formModel: {},
            formItemRule: {
                cargoName: [validateRules.required('')[0]]
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
            // 收起单次委托新增
            this.list[index].isContentShow = false
            this.list[index].itemArr = this.CargoInfoList
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
.flod-box {
    padding: 0 20px;
}
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
    .header {
        width: 100%;
        height: 40px;
        padding: 0 20px;
        background: #fff6e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn > span {
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
        }
    }
    .main-box {
        width: 100%;
        padding: 5px;
        background: #f9f9f9;
    }
}
</style>