export default {
    props: {
        page: { default: 1 }
    },
    data () {
        return {
            total: 0,
            perpage: 15
        }
    },
    created () {
        // judgment区分第一次进入页面调用的方法
        this.dataInit('judgment')
    },
    watch: {
        $route () {
            this.dataInit()
        }
    },
    methods: {
        paginatorInit (perpage, total) {
            this.perpage = perpage
            this.total = total
        }
    }
}
