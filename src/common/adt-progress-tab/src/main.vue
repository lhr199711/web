<template>
    <div class="adt-progress-tab">
        <div class="tabs">
            <!-- active: 当前项， done: 已经完成的项 -->
            <div v-for="(tab, index) in tabs" :key="index" :class="['tab', type, { active: activeIndex === index, done:  index < activeIndex }]" @click="clickTab(index)">
                <span></span>{{ tab }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdtProgressTab',
    props: {
        // tab名称数组集合
        tabs: {
            type: Array,
            default: () => []
        },
        // 当前激活项的下标
        activeIndex: {
            type: Number
        },
        // 默认是base类型，可以传入btn类型
        type: {
            type: String,
            default: 'base'
        },
        // 是否允许点击
        allowClick: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            showModal: false
        }
    },
    methods: {
        clickTab (index) {
            if (this.allowClick) {
                this.$emit('click-tab', index)
                // this.activeIndex = index
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .adt-progress-tab {
        .tabs {
            display: flex;
            color: #666;
            .tab {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 40px;
                cursor: default;
                &.base {
                    width: 207px;
                    background: url(~@/assets/images/tabs/tab-bg.png) no-repeat;
                    background-size: 100% 100%;
                    span {
                        display: none;
                    }
                    &.active {
                      background: url(~@/assets/images/tabs/tab-bg-active.png) no-repeat;
                      background-size: 100% 100%;
                    }
                    &:first-child {
                        width: 190px;
                        background: url(~@/assets/images/tabs/first-tab-bg.png) no-repeat;
                        background-size: 100% 100%;
                        &.active {
                          background: url(~@/assets/images/tabs/first-tab-bg-active.png) no-repeat;
                          background-size: 100% 100%;
                        }
                    }
                    &:last-child {
                        width: 188px;
                        background: url(~@/assets/images/tabs/last-tab-bg.png) no-repeat;
                        background-size: 100% 100%;
                        &.active {
                          background: url(~@/assets/images/tabs/last-tab-bg-active.png) no-repeat;
                          background-size: 100% 100%;
                        }
                    }
                }
                &.btn {
                    width: 180px;
                    background-color: #fff;
                    border-radius: 40px;
                    & + .btn {
                        margin-left: 30px;
                    }
                    &.active {
                        span {
                            display: block;
                            color: #333;
                            background-color: $warning-color;
                        }
                    }
                    &.done {
                        span {
                            display: block;
                            background-color: $light-color;
                        }
                    }
                    span {
                        display: none;
                        width: 8px;
                        height: 8px;
                        margin-right: 6px;
                        border-radius: 100%;
                    }
                }
            }
        }
    }
</style>
