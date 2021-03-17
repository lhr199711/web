/* eslint-disable */
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return {}
    },
    watch: {},
    computed: {},
    created() {
        this.initSearchForm_m()
    },
    methods: {
        // 进入页面后记录或初始化数据
        initSearchForm_m() {
            this.searchForm = {
                ...this.searchForm,
                ...this.$route.query,
                page: +this.$route.query.page || 1,
                size: +this.$route.query.size || this.searchForm.size
            }
            this.getTableList()
        },
        //按条件搜索事件
        handleFilter_m() {
            this.searchForm.page = 1
            // if (this.timeArr && this.timeArr.length) {
            //     this.searchForm.startPeriod = moment(this.timeArr[0]).valueOf()
            //     this.searchForm.untilPeriod = moment(this.timeArr[1]).valueOf()
            // }
            this.getTableList()
            this._setSearchFormUrl()
        },
        // 分页回调的搜索
        changePage_m() {
            this.getTableList()
            this._setSearchFormUrl()
        },
        // 暂存搜索条件再地址中
        _setSearchFormUrl() {
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.searchForm
                }
            })
        }
    }
}
