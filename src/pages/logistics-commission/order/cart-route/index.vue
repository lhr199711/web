<template>
    <div>
        <div class="main">
            <div
                class="item-main"
                v-if="
                    routeData.serverType == 'T' ||
                    routeData.serverTypeTranslate == '运输'
                "
            >
                <div
                    class="txt"
                    :title="routeData.departurePortTranslate"
                >{{ routeData.departurePortTranslate }}</div>
                <div class="icon">
                    <svg class="iconfont jiantou" aria-hidden="true">
                        <use xlink:href="#icon-andaotongcaidanICON_jiantou" />
                    </svg>
                </div>
                <div class="txt">{{ routeData.departurePortTranslate }}</div>
            </div>
            <div class="item-main">
                <div
                    class="txt"
                    :title="routeData.serverLocusTranslate"
                >{{ routeData.serverLocusTranslate }}</div>
            </div>
            <div class="icon-box">
                <svg class="icon" aria-hidden="true">
                    <use
                        v-if="routeData.trspMode == '2'"
                        fill="#FFBB32"
                        xlink:href="#icon-feiji800"
                    />
                    <use v-if="routeData.trspMode == '3'" fill="#FFBB32" xlink:href="#icon-huoche" />
                    <use
                        v-if="routeData.trspMode == '4'"
                        fill="#FFBB32"
                        xlink:href="#icon-andaotongcaidanICON_huoche"
                    />
                    <use
                        v-if="routeData.trspMode == '1'"
                        fill="#FFBB32"
                        xlink:href="#icon-andaotongcaidanICON_lunchuan"
                    />
                </svg>
                <!-- <svg class="icon huo_che" aria-hidden="true">
                    <use fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_changjiantou" />
                </svg>
                <svg class="icon lun_chuan" aria-hidden="true">
                    <use fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_lunchuan" />
                </svg>-->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    props: {
        routeData: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {}
    },
    created () { },
    mounted () { },
    methods: {}
}
</script>

<style scoped lang="scss">
.main {
    width: 100%;
    height: 80px;
    background: rgba(249, 249, 249, 1);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .item-main {
        display: flex;
        align-items: center;
        padding: 6px 0;
        .txt {
            // max-width: 154px;
            font-size: 20px;
            color: rgba(51, 51, 51, 1);
            line-height: 28px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .jiantou {
            width: 76px;
            color: $light-color;
        }
    }
    .icon-box {
        display: flex;
        align-items: center;
        .huo_che,
        .lun_chuan,
        .icon {
            width: 22px;
            height: 22px;
        }
    }
}
</style>
