<template>
    <ve-ring
        :data="val"
        :settings="settings"
        :legend-visible="false"
        :extend="extend"
        :data-empty="!val.rows.length"
        height="100%"
    />
</template>

<script>
import VeRing from 'v-charts/lib/ring.common'
export default {
    name: 'logistics-ring',
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
            radius: ['35%', '60%'],
            offsetY: 'center',
            labelMap: {
                type: '类型',
                number: '数量'
            },
            label: {
                formatter: '{b}: {c}%'
            },
            labelLine: { // 设置指示线的长度
                normal: {
                    length: 8,
                    length2: 6
                }
            }
        }
        this.extend = {
            color: ['#7ebcf7', '#8378ea', '#7dffff', '#a8d59d', '#bdd3df', '#e9f5b4']
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
