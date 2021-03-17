<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>查看推荐列表</h3>
            <div class="sender-info">
            </div>
            <div class="public-btns-group">
                <Button type="primary" shape="circle" size="large" @click="recommend">推荐方案</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
    export default {
        name: 'ViewRecommendations',
        props: {
            showDrawer: {
                type: Boolean,
                default: false
            },
            routeList: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                isShowDrawer: false
            }
        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                },
                immediate: true
            }
        },
        methods: {
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            },
            // 推荐方案
            recommend () {}
        },
    }
</script>

<style lang="scss" scoped>
    .collapse {
        background: #fff;
        max-height: 500px;
        border: 1px solid white;
        overflow-y: auto;
        overflow-x: hidden;
        /deep/ .ivu-collapse-header {
            height: 40px;
            padding-left: 0;
            background-color: #FFF6E5;
            border-bottom: 1px solid white;
            /deep/ i {
                float: right;
                line-height: 45px;
            }
        }
        .title {
            margin-left: 10px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #333333;
        }
        .subtitle {
            display: flex;
            margin: 30px 0;
            .subtitle-font {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #303548;
            }
            .subtitle-line {
                height: 1px;
                background: #D7D8DF;
                width: 90%;
                margin-top: 12px;
            }
        }
        .collapse-font {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #303548;
        }
    }
    .time-tabs {
        .subtitle {
            display: flex;
            margin: 25px 0;
            .subtitle-font {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #303548;
            }
            .subtitle-line {
                height: 1px;
                background: #D7D8DF;
                width: 88%;
                margin-top: 12px;
            }
        }
    }
</style>