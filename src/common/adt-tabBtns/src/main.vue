<template>
    <div class="tab-wrapper">
        <div :class="{ 'underline': isUnderline == true, 'underline-gray': isUnderlineGray == true, 'small-btn': isSmallBtn == true, 'tabTitle': isBaseBtn == true, 'tab-container': true }">
            <div
                :style="`min-width: ${width}px; height: ${height}px; line-height: ${height}px`"
                class="tabBtn"
                :class="{ 'tabBtnActive':btnIndex == index + 1 } "
                v-for="(titleItem, index) in titleNames"
                :key="index"
                @click="handleBtnClick(index, titleItem)"
            >
                <span>{{ titleItem }}</span>
                <div v-if="isUnderline && isMark">
                    <svg class="icon" aria-hidden="true">
                        <use fill="#02ADB5" xlink:href="#icon-youxiajiaogouxuan"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="tabMain">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'adt-tab-btns',
    props: {
        btnIndex: {
            default: 1,
            type: Number
        },
        titleNames: {
            type: Array,
            default: () => []
        },
        width: {
            default: 100,
            type: Number
        },
        height: {
            default: 25,
            type: Number
        },
        // 无间隔tab切换
        isBaseBtn: {
            default: false,
            type: Boolean
        },
        // 下划线tab切换
        isUnderline: {
            default: false,
            type: Boolean
        },
        // 下划线tab切换加勾选
        isMark: {
            default: false,
            type: Boolean
        },
        isUnderlineGray: {
            default: false,
            type: Boolean
        },
        // 小按钮间隔tab切换
        isSmallBtn: {
            default: false,
            type: Boolean
        },
        // 创建产品时需要用到的（特殊）
        productIndex: {
            type: Number
        }
    },
    data() {
        return {}
    },
    methods: {
        //  点击头部
        handleBtnClick(index, titleItem) {
            this.$emit('handleBtn', index, titleItem, this.productIndex)
        }
    }
}
</script>
<style lang='scss' scoped>
// 无间隔按钮tab切换
.tabTitle {
    display: flex;
    align-items: center;
    justify-content: center;
    .tabBtn {
        width: 205px;
        text-align: center;
        font-size: 14px;
        padding: 5px 0px;
        border: 1px solid $placeholder-font-color;
        color: $main-font-color;
        background-color: white;
        cursor: pointer;
        &:first-child {
            border-radius: 5px 0 0 5px;
        }
        &:last-child {
            border-radius: 0 5px 5px 0;
        }
    }
    .tabBtnActive {
        border-color: $light-color;
        background-color: #E8EFF5;
        color: $light-color;
    }
}
// 下划线tab切换
.underline {
    display: flex;
    align-items: center;
    justify-content: left;
    .tabBtn {
        min-width: 205px;
        text-align: center;
        font-size: 14px;
        padding: 5px 0px;
        height: 40px;
        line-height: 30px;
        border: 1px solid $border-color;
        color: $main-font-color;
        background-color: white;
        cursor: pointer;
        &:first-child {
            border-radius: 5px 0 0 5px;
        }
        &:last-child {
            border-radius: 0 5px 5px 0;
        }
    }
    .tabBtnActive {
        border-bottom: 2px solid $light-color;
        color: $light-color;
    }
    // 只有第一个tab有下标，后面的全部隐藏
    .icon {
        position: absolute;
        width: 20px;
        height: 20px;
        margin-left: 173px;
        margin-top: -21px;
        display: none;
    }
    & :first-child{
        svg{
            display: block;
        }
    }
}
// 灰色下划线
.underline-gray {
    display: flex;
    align-items: center;
    justify-content: left;
    .tabBtn {
        min-width: 205px;
        text-align: center;
        font-size: 14px;
        padding: 5px 0px;
        height: 40px;
        line-height: 30px;
        border: 1px solid $border-color;
        color: $main-font-color;
        background-color: white;
        cursor: pointer;
        &:first-child {
            border-radius: 5px 0 0 5px;
        }
        &:last-child {
            border-radius: 0 5px 5px 0;
        }
    }
    .tabBtnActive {
        border-bottom: 2px solid #999;
        color: #333;
    }
}
// 小按钮间隔tab切换
.small-btn {
    display: flex;
    align-items: center;
    justify-content: left;
    .tabBtn {
        min-width: 100px;
        text-align: center;
        font-size: 14px;
        padding: 5px 0px;
        height: 30px;
        line-height: 20px;
        color: $main-font-color;
        background-color:$border-color;
        margin-left: 20px;
        cursor: pointer;
        border: 1px solid transparent;
        border-radius: 5px;
        &:first-child{
            margin-left: 0;
        }
    }
    .tabBtnActive {
        border: 1px solid $placeholder-font-color;
        border-color: $light-color;
        background-color: #E8EFF5;
        color: $light-color;
    }
}
.tab-container {
    flex-wrap: wrap;
    .tabBtn {
        flex-shrink: 0;
        padding: 0 6px;
    }
}
</style>
