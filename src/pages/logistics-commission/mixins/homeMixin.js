export default {
    data () {
        return {}
    },
    watch: {},
    created () {
        this.handelRouteHome()
        // this.home_entrustIndex()
    },
    methods: {
        // 首页过来货运执行的方法
        handelRouteHome () {
            if (this.$route.name !== 'dispatch_list') {
                return
            }
            if (
                !this.$route.query.jzName ||
                !this.$route.query.jzName === 'Home'
            ) {
                return
            }
            if (this.$route.query.freightReqStatus) {
                this.statusValue = this.$route.query.freightReqStatus
            }
            if (this.$route.query.stepId) {
                this.search.stepId = JSON.parse(this.$route.query.stepId)
            }
            this.getData()
        },
        // 首页过来物流委托执行的方法
        home_entrustIndex_m () {
            if (
                !this.$route.query.jzName ||
                !this.$route.query.jzName === 'Home'
            ) {
                return
            }
            if (this.$route.query.stepId) {
                this.searchForm.stepId = JSON.parse(
                    this.$route.query.stepId
                )
            }
            this.searchForm.entrustExecutoryStatus = this.$route.query.entrustExecutoryStatus
            this.handleFilter_m()
        }
    }
}
