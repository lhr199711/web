<template>
    <div class="header-btns">
        <div class="header-btnjz">
            <div class="l">{{ title }}</div>
            <div class="r">
                <slot name="btn"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'header-btns',
    props: {
        title: {
            type: String,
        },
    },
    data () {
        return {}
    },
    created () { },
    mounted () { },
    methods: {},
}
</script>

<style scoped lang="scss">
.header-btns {
    .header-btnjz {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 34px;
        padding: 0 46px;
        position: relative;
        top: -10px;
        .l {
            font-size: 16px;
            color: rgba(51, 51, 51, 1);
            font-weight: bold;
            line-height: 16px;
            align-self: flex-end;
        }
        .r {
            /deep/.ivu-btn {
                margin-left: 20px;
            }
        }
    }
}
</style>
