<template>
    <div>
        <Card>
            <div class="card-route">
                <div class="card-content" v-for="(location, id) in logistics" :key="id">
                    <span class="card-outset">{{ location.departurePortTranslate }}</span>
                    <div class="card-transit">
                        <div class="card-way">
                            <svg :class="['iconfont', { car: location.trspModeTranslate == '公路' }]" aria-hidden="true">
                                <use v-if="location.trspModeTranslate == '铁运'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_huoche"></use>
                                <use v-if="location.trspModeTranslate == '公路'" fill="#FFBB32" xlink:href="#icon-huoche"></use>
                                <use v-if="location.trspModeTranslate == '水运'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_lunchuan"></use>
                                <use v-if="location.trspModeTranslate == '空运'" fill="#FFBB32"
                                xlink:href="#icon-feiji800"></use>
                            </svg>
                        </div>
                        <div class="card-line">
                            <svg class="icon" aria-hidden="true">
                                <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou3"></use>
                            </svg>
                        </div>
                        <div class="card-genre">{{ location.logisticsTypeTranslate }}{{ location.trspTypeTranslate}}</div>
                    </div>
                    <template v-if="id === logistics.length - 1">
                        <span class="card-address">{{ location.destinationPortTranslate }}</span>
                    </template>
                </div>
            </div>
            <div class="scheme-reference">
                <slot name="price"></slot>
            </div>
            <div class="scheme-service">
                <slot name="service"></slot>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'AdtSchemeInformationRoute',
    props: {
        // logistics: {
        //     type: Array,
        //     default: function () {
        //         return []
        //     }
        // }
    },
    data() {
        return {
            logistics: [
                {
                    departurePortTranslate: '重庆',
                    trspModeTranslate: '公路',
                    destinationPortTranslate: '成都',
                    logisticsTypeTranslate: '国际',
                    trspTypeTranslate: '集装箱'
                },
                {
                    departurePortTranslate: '成都',
                    trspModeTranslate: '铁路',
                    destinationPortTranslate: '上海',
                    logisticsTypeTranslate: '国际',
                    trspTypeTranslate: '集装箱'
                },
                {
                    departurePortTranslate: '上海',
                    trspModeTranslate: '空运',
                    destinationPortTranslate: '北京',
                    logisticsTypeTranslate: '国际',
                    trspTypeTranslate: '集装箱'
                }
            ]
        }
    },
    methods: {
    },
}
</script>

<style lang="scss" scoped>
.scheme-reference{
    margin: 0 20px;
    padding: 20px 0;
    border-bottom: 1px dashed $border-color;
}
.scheme-service{
    padding: 20px;
}
/*物流方案路线样式*/
.card-route{
    display: flex;
    background-color: $filling-color;
    border-radius: 4px;
    overflow-x: auto;
    overflow-y: hidden;
    .card-content{
        display: flex;
        align-items: center;
        height: 70px;
        // margin-left: 20px;
        &:first-child {
            .card-outset {
                font-size: 18px;
                font-weight: bold;
                margin: 0 20px;
                line-height: 75px;
                white-space: nowrap;
            }
        }
        &:last-child {
            .card-address {
                font-size: 18px;
                font-weight: bold;
                white-space: nowrap;
                line-height: 75px;
                margin: 0 20px;
                // margin-left: 120px;
            }
        }
        .card-outset {
            font-size: 16px;
            margin: 0 20px;
            line-height: 75px;
            white-space: nowrap;
        }
        .card-transit{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 70px;
            // margin-top: -68px;
            // margin-left: 50px;
            .icon{
                width: 150px;
                height: 20px;
            }
            .iconfont {
                font-size: 35px;
                margin-top: -7px;
                &.car {
                    transform: rotateY(180deg);
                    font-size: 35px;
                    margin-top: -8px;
                }
            }
            .card-way{
                height: 10px;
            }
            .card-line{
                margin-bottom: 4px;
                height: 10px;
            }
            .card-genre{
                height: 20px;
                color: $light-color;
                text-align: center;
            }
        }
    }
}
</style>