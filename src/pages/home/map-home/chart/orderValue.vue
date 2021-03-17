<template>
    <ve-ring
        :data="val"
        :legend-visible="false"
        :extend="extend"
        :settings="settings"
        :data-empty="!val.rows.length"
        height="100%"
    />
</template>

<script>
import VeRing from 'v-charts/lib/line.common'
export default {
    name: 'order-value-ring',
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
        VeRing
    },
    data () {
        this.extend = {
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
            },
            'xAxis.0.axisLabel.rotate': 45,
            color: '#7ebcf7'
        }
        this.settings = {
            labelMap: {
              'goodsValue': '货值'
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
