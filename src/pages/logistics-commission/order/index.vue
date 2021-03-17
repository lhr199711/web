<template>
    <div class="order-list">
        <header-btn title="查询条件">
            <div slot="btn"></div>
        </header-btn>
        <div class="public-search-headjz">
            <search-status :status-list="orderStatusList" @auditStatus="auditStatus"></search-status>
            <Divider style="margin:20px 0" />
            <div class="public-search-input-jz public-search-ipts-jz">
                <Row class="publc-bottom20">
                    <Col span="6">
                        <span>客户名称:</span>
                        <Input v-model="searchForm.createEtpsName" clearable></Input>
                    </Col>
                    <Col span="6">
                        <span>服务所在地:</span>
                        <Input v-model="searchForm.serverLocus" clearable></Input>
                    </Col>
                    <Col span="6">
                        <span>运输方式:</span>
                        <Select v-model="searchForm.trspMode" clearable>
                            <Option
                                v-for="(item,index) in trspModeList"
                                :value="item.value"
                                :key="index"
                            >{{ item.label }}</Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <span>货物类型:</span>
                        <Select v-model="searchForm.cargoType" clearable>
                            <Option
                                v-for="(item,index) in cargoTypeList"
                                :value="item.value"
                                :key="index"
                            >{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
            <Divider style="margin:20px 0" />
            <div class="search-btn">
                <Button class="searchButton" shape="circle" @click="handleFilter_m">
                    查询
                    <Icon type="ios-search" />
                </Button>
            </div>
        </div>
        <div class="public-btn-pagina">
            <div></div>
            <pagination
                :total="total"
                :page.sync="searchForm.page"
                :limit="searchForm.size"
                @changePage="changePage_m"
            ></pagination>
        </div>
        <div class="public-component-linejz"></div>
        <table-cart :list="tableData" @updateList="handleFilter_m"></table-cart>
    </div>
</template>

<script>
import { apiGetOrderList } from '@/api/logisticsCommission'
import headerBtn from './header-btn/index'
import searchHeader from './search-header/index'
import pagination from './pagination/index'
import searchStatus from './search-status/index'
import tableCart from './table-cart/index'
import tableMixin from '@/mixins/tableMixin'
import dictionaryList from '@/mixins/dictionaryList'
import { mapGetters } from 'vuex'
export default {
    mixins: [tableMixin, dictionaryList],
    props: {},
    components: {
        headerBtn,
        searchHeader,
        pagination,
        searchStatus,
        tableCart,
    },
    data () {
        return {
            searchForm: {
                page: 1,
                size: 6
            },
            total: 0,
            tableData: [],
        }
    },
    computed: {},
    created () {
        this.handel_cargoTypeList_m()
        this.handel_trspModeList_m()
        this.handel_orderStatusList_m()
        this.handelRouteHome()
    },
    methods: {
        // 首页过来执行的方法
        handelRouteHome(){
            if(!this.$route.query.jzName === 'Home'){
                return
            }
        },
        // 接口
        getTableList () {
            let data = {
                ...this.searchForm,
            }
            apiGetOrderList({ data }).then(({ data }) => {
                let arr = data.content
                this.tableData = arr
                this.total = +data.totalElements
            })
        },
        // 状态的传值
        auditStatus (code) {
            this.searchForm.orderStatus = code
        },
    },
}
</script>

<style lang="scss" scoped>
.order-list {
}
</style>
