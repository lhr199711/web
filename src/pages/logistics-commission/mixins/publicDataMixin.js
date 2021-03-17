export default {
    data () {
        return {}
    },
    watch: {},
    computed: {
        // 子委托编号
        cptRouteExecutoryEntrustCode_m () {
            const str = this.$route.query.executoryEntrustCode
            return str
        },
        // 委托编号
        cptRouteEntrustCode_m () {
            const str = this.$route.query.entrustCode
            return str
        },
        // 路线信息数组
        cptRouteLineHeaderData_m () {
            const arr = JSON.parse(this.$route.query.lineHeaderData)
            return arr
        }
    },
    methods: {}
}
