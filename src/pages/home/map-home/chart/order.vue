<template>
    <ve-histogram
        :data="val"
        :legend-visible="false"
        :settings="chartSettings"
        :extend="extend"
        :data-empty="!val.rows.length"
        height="100%"
    />
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram.common'
export default {
    name: 'order-histogram',
    props: {
        data: {
            type: Object,
            default: () => {
                return {
                    columns: [],
                    rows: []
                }
            }
        }
    },
    components: {
        VeHistogram
    },
    data () {
        this.extend = {
            barWidth: 30,
            // label: { show: true, position: "top" },
            grid: {
                y: 15,
                y2: 5
            },
            yAxis: {
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['rgba(255, 255, 255, .06)'],
                        width: 1,
                        type: 'solid'
                    }
                },
                type: 'value',
                axisLabel: {
                    textStyle: {
                        fontSize: '12px',
                        color: '#fff' //这里是改变字体颜色
                    }
                }
            },
            xAxis: {
                axisLabel: {
                    textStyle: {
                        fontSize: '12px',
                        color: '#fff' //这里是改变字体颜色
                    }
                }
            }
        }
        this.chartSettings = {
            itemStyle:{ //面积图颜色设置
                    color:{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(10, 177, 255, 1)', // 0% 处的颜色
                            },
                            {
                                offset: 0.6,
                                color: 'rgba(10, 177, 255, .5)', // 60% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(10, 177, 255, .1)' // 100% 处的颜色
                            },
                        ],
                        globalCoord: false // 缺省为 false
                    }

                }
        }
        return {
            val: this.data
        }
    },
    watch: {
        data (to, from) {
            if (to) {
                this.val = to
            }
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
</style>
