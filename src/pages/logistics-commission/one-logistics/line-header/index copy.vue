<template>
    <div>
        <div class="see-detail-box">
            <div class="card-route-jz">
                <div class="card-content" v-for="(location, index) in cptData">
                    <span class="card-outset">{{ location.departurePort }}</span>
                    <div class="card-transit">
                        <div class="card-way">
                            <svg class="icon" aria-hidden="true">
                                <use
                                    v-if="location.trspMode == '空运'"
                                    fill="#FFBB32"
                                    xlink:href="#icon-andaotongcaidanICON_feiji"
                                />
                                <use
                                    v-if="location.trspMode == '铁路'"
                                    fill="#FFBB32"
                                    xlink:href="#icon-andaotongcaidanICON_huoche"
                                />
                                <use
                                    v-if="location.trspMode == '海运'"
                                    fill="#FFBB32"
                                    xlink:href="#icon-andaotongcaidanICON_lunchuan"
                                />
                            </svg>
                        </div>
                        <div class="card-line">
                            <svg v-if="isBig" class="icon" aria-hidden="true">
                                <use
                                    fill="#02ADB5"
                                    xlink:href="#icon-andaotongcaidanICON_changjiantou"
                                />
                            </svg>
                            <svg v-if="!isBig" class="icon" aria-hidden="true">
                                <use
                                    fill="#02ADB5"
                                    xlink:href="#icon-andaotongcaidanICON_jiantou3"
                                />
                            </svg>
                        </div>
                        <div
                            class="card-genre"
                        >{{ location.cargoType || location.trspType }}.{{ location.logisticsType }}</div>
                    </div>
                </div>
            </div>
            <Button @click="seePlan">查看方案详情</Button>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    props: {
        lineHeaderData: {
            type: Array,
            default: () => {
                let arr = [
                    {
                        departurePort: '重庆',
                        destinationPort: '开州',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 1
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '开州',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 2
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '开州',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 3
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '开州',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 4
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '测试',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 5
                    }
                ]
                return arr
            }
        },
        isBig: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {}
    },
    computed: {
        cptData() {
            let end = this.lineHeaderData[this.lineHeaderData.length - 1]
            let itemarr = [
                {
                    departurePort: end.destinationPort
                }
            ]
            let list = this.lineHeaderData.concat(itemarr)
            return list
        }
    },
    created() {},
    mounted() {},
    methods: {
        seePlan() {
            // alert('跳转到方案页面')
            console.log(this.lineHeaderData)
        }
    }
}
</script>

<style scoped lang="scss">
.see-detail-box {
    padding: 0px 40px;
    height: 100px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}
.card-route-jz {
    display: flex;
    overflow: auto;
    overflow-y: hidden;
    .card-content {
        height: 70px;
        line-height: 65px;
        margin-left: 20px;
        &:first-child {
            .card-outset {
                font-size: 18px;
                font-weight: bold;
            }
        }
        &:last-child {
            .card-outset {
                font-size: 18px;
                font-weight: bold;
                color: #999;
            }
        }
        &:last-child {
            .card-transit {
                display: none;
            }
        }
        .card-transit {
            display: flex;
            flex-direction: column;
            height: 70px;
            margin-top: -68px;
            margin-left: 50px;
            .icon {
                width: 160px;
                height: 20px;
            }
            .card-way {
                height: 10px;
            }
            .card-line {
                height: 10px;
            }
            .card-genre {
                height: 20px;
                color: $light-color;
                text-align: center;
            }
        }
    }
}
</style>
