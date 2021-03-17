<template>
    <ve-ring
        :data="val"
        :settings="settings"
        :legend-visible="false"
        :extend="extend"
        :data-empty="!val.rows.length"
        height="100%"
        style="padding: 20px 20px 5px 20px;"
    />
</template>

<script>
import VeRing from 'v-charts/lib/ring.common'
export default {
    name: 'node-ring',
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
        this.settings = {
            radius: ['35%', '55%'],
            // offsetY: 'center',
            offsetY: 75,
            labelMap: {
                type: '类型',
                number: '数量'
            },
            label: {
                // formatter: '{b}: {d}%'
                formatter: '{d}%'
            },
            labelLine: { // 设置指示线的长度
                normal: {
                    length: 8,
                    length2: 6
                }
            }
        }
        this.extend = {
            // color: ['#7ebcf7', '#8378ea', '#7dffff', '#a8d59d', '#bdd3df', '#e9f5b4'],
            color: ['#7dffff', '#71b4f7', '#8378ea', '#ea5b24'],
            legend: {
                y: 'bottom',
                itemWidth: 10,//图例的宽度
                itemHeight: 10,//图例的高度
                textStyle:{//图例文字的样式
                    color:'#fff'
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
