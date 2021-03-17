<template>
    <div class="logistics">
        <!-- <p class="logistics-title">货运要求路线</p> -->
        <Card>
            <div v-if="matched">
                <p>已匹配到的物流路线:</p>
                <div
                    v-if="logisticsRoute.matchScheme == '1'"
                    v-for="(logisticsRoute,id) in logisticsRouteList"
                    :key="id" 
                    class="logistics-line"
                    :class="{'logistics-click': num == id}"
                    @click="clickLine(id, logisticsRoute)"
                >
                    <div class="logistics-btn" v-for="(logistics, index) in logisticsRoute.roadList" :key="index">
                        <span>{{logistics.departurePort}}</span>
                        <span>——</span>
                        <template v-if="index === logisticsRoute.roadList.length - 1">
                            <span>{{logistics.destinationPort}}</span>
                        </template>
                    </div>
                </div>
            </div>
            <div v-if="notMatched">
                <p>未匹配到的物流路线:</p>
                <div v-if="logisticsRoute.matchScheme == '0'" class="logistics-line" v-for="(logisticsRoute,id) in logisticsRouteList" :key="id">
                    <div class="logistics-btn" style="cursor: not-allowed; color: #999999" v-for="(logistics, index) in logisticsRoute.roadList" :key="index">
                        <span>{{logistics.departurePort}}</span>
                        <span>——</span>
                        <template v-if="index === logisticsRoute.roadList.length - 1">
                            <span>{{logistics.destinationPort}}</span>
                        </template>
                    </div>
                </div>
            </div>
            <template>
                <slot name="prompt"></slot>
            </template>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'AdtLogisticsRoute',
    props: {
        logisticsRouteList: {
            type: Array,
            default: function () {
                return []
            }
        },
        matched: {
            type: Boolean,
            default: true
        },
        notMatched: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // 控制点击选择路线
            num: '0'
        }
    },
    methods: {
        clickLine (id, val) {
            this.num = id
            this.$emit("clickPath", val)
        }
    },
}
</script>

<style lang="scss" scoped>
.logistics{
    .logistics-title{
        font-size: $font-size-large;
        margin: 6px 0 10px 44px;
    }
    /deep/.ivu-card-body{
        padding: 30px 46px;
        p{
            font-size: $font-size-base;
            color: $conventional-font-color;
            font-weight: bold;
        }
        .logistics-line{
            padding: 10px 40px;
            margin: 10px 20px 30px 0;
            display: inline-block;
            font-size: $font-size-small;
            background-color: $filling-color;
            font-weight: bold;
            border: 1px solid $filling-color;
            border-radius:4px;
            cursor: pointer;
            .logistics-btn{
                display: inline-block;
                // &:last-child{
                //     span{
                //         &:last-child{
                //             display: none;
                //         }
                //     }
                // }
            }
        }
        .logistics-click{
            background-color:$info-prompt-color;
            border: 1px solid $light-color;
        }
    }
}
</style>