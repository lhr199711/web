<template>
    <div class="tabWrapper">
        <div class="tabTitle">
            <!-- <div
                :style="`width: ${width}px`"
                class="tabBtn"
                :class="{'tabBtnActive':btnIndex == index+1} "
                v-for="(titleItem,index) in titleNames"
                :key="index"
                @click="handleBtnClick(index)"
            >{{titleItem}} -->
            <div
                class="tabBtn"
                :class="{'tabBtnActive':btnIndex == index+1} "
                v-for="(titleItem,index) in titleNames"
                :key="index"
                @click="handleBtnClick(index)"
            >{{titleItem}}
            <span class="slant-line">/</span>
            </div>
        </div>
        <div class="tabMain">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'adt-btns',
    props: {
        btnIndex: {
            default: 1,
            type: Number
        },
        titleNames: {
            default: [],
            type: Array
        },
        width: {
            default: 205,
            type: Number
        }
    },
    data() {
        return {}
    },
    methods: {
        //  点击头部
        handleBtnClick(index) {
            this.$emit('handleBtn', index)
        }
    }
}
</script>
<style lang='scss' scoped>
.tabTitle {
    display: flex;
    align-items: center;
    // justify-content: center;
    margin-left: 46px;
    .tabBtn {
        position: relative;
        // width: 205px;
        padding: 5px 0px;
        text-align: center;
        font-size: $font-size-large;
        font-weight: bold;
        color: $main-font-color;
        cursor: pointer;
        &:last-child {
            .slant-line {
                display: none;
            }
        }
        .slant-line {
            padding: 0 80px;
            color: $main-font-color;
        }
    }
    .tabBtnActive {
        color: $light-color;
    }
}
</style>
