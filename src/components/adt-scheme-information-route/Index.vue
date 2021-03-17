<template>
    <div>
        <Card>
            <div :class="['line-info', { 'is-big': type === 'isBig' }]">
                <template v-for="(route, index) in routeResList">
                    <div v-if='index === 0' class="site">{{ route.departurePort }}</div>
                    <div class="translate-info">
                        <!-- 轮船 -->
                        <svg v-if="route.trspMode === '1'" class="iconfont way" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_lunchuan" />
                        </svg>
                        <!-- 空运 -->
                        <svg v-if="route.trspMode === '2'" class="iconfont way plane" aria-hidden="true">
                            <use xlink:href="#icon-feiji800" />
                        </svg>
                        <!-- 公路 -->
                        <svg v-if="route.trspMode === '3'" class="iconfont way" aria-hidden="true" style="transform: rotateY(180deg); font-size: 20px;">
                            <use xlink:href="#icon-huoche" />
                        </svg>
                        <!-- 铁运 -->
                        <svg v-if="route.trspMode === '4'" class="iconfont way" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_huoche" />
                        </svg>
                        <!-- 箭头 -->
                        <img v-if="type === 'isBig'" class="arrow-img" src="@/assets/images/big-arrow.png" alt="arrow">
                        <svg v-else class="iconfont arrow" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_jiantou3" />
                        </svg>
                        <div class="info">普货-集装箱</div>
                    </div>
                    <div class="site">{{ route.destinationPort }}</div>
                </template>
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
            routeResList: {
                type: Array,
                default: () => ([
                    {
                        departurePort: '重庆',
                        destinationPort: '香港',
                        trspMode: '1'
                    },
                    {
                        departurePort: '香港',
                        destinationPort: '纽约',
                        trspMode: '2'
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '香港',
                        trspMode: '3'
                    },
                    {
                        departurePort: '香港',
                        destinationPort: '纽约',
                        trspMode: '4'
                    }
                ])
            },
            type: ''
        },
        created () {
            // console.log(this.routeResList)
        }
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
    .line-info {
        display: flex;
        &.is-big {
            margin-bottom: 20px;
            padding: 30px 70px;
            background-color: #F9F9F9;
            .translate-info {
                margin: 0 6px;
            }
        }
        .site {
            line-height: 40px;
            font-size: 16px;
            color: #666;
            &:first-of-type(), &:last-of-type() {
                color: #333;
                font-size: 20px;
            }
        }
        .translate-info {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin: 0 40px;
            .way {
                height: 16px;
                font-size: 30px;
                color: $warning-color;
                &.plane {
                    position: relative;
                    top: 3px;
                    height: 22px;
                    margin-top: -3px;
                }
            }
            .arrow {
                height: 6px;
                font-size: 100px;
                color: $light-color;
            }
            .info {
                color: $light-color;
                font-size: 12px;
                transform: scale(.8);
            }
        }
    }
</style>
