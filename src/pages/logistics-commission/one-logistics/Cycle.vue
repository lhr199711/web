<template>
    <div class="two-logistics">
        <div class="public-headejz">
            <tab-two :activeIndex="1" @handelTab="handelTab"></tab-two>
        </div>
        <div class="public-search-headjz">
            <div class="public-search-input-jz public-search-ipts-jz">
                <Row class="publc-bottom20">
                    <Col span="6">
                        <span>合同委托编号:</span>
                        <Input v-model="searchForm.entrustCode" clearable />
                    </Col>
                    <Col span="6">
                        <span>销售合同编号:</span>
                        <Input v-model="searchForm.contractCode" clearable />
                    </Col>
                    <Col span="6">
                        <span>货物类型:</span>
                        <Select v-model="searchForm.cargoType" filterable clearable>
                            <Option
                                v-for="item in cargoTypeList"
                                :value="item.value"
                                :key="item.value"
                            >{{ item.label }}</Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <span>委托有效期:</span>
                        <DatePicker
                            type="datetimerange"
                            placeholder="Select date"
                            v-model="timeArr"
                            @on-ok="handelTimeOk"
                            @on-clear="handelTimeClear"
                        />
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
        <cycle-table-cart :tableList="listData"></cycle-table-cart>
    </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import authMixin from '@/mixins/authMixin'
import pagination from '../order/pagination/index'
import {
    apiGetRoleCstmEntrustList,
    apiGetRoleMktEntrustList,
    apiGetRoleDsptEntrustList,
} from '@/api/logisticsCommission'
import { apiDictionaryQueryByCacheTypeKey } from '@/api/dictionary'
import tabTwo from './tab-two/index'
import moment from 'moment'
import lineHeader from './line-header/index'
import cycleTableCart from './cycle-table-cart/index'
import { isDIS, isSALE, isENT } from '@/libs/roles.js'
export default {
    mixins: [tableMixin, authMixin],
    components: {
        tabTwo,
        lineHeader,
        pagination,
        cycleTableCart,
    },
    data () {
        return {
            // 分页的搜索条件
            searchForm: {
                page: 1,
                size: 4,
            },
            total: 0,
            timeArr: [],
            // 表格的数据
            listData: [],
            // 货物类型
            cargoTypeList: [],
        }
    },
    computed: {},
    created () {
        this.initDic()
    },
    methods: {
        handelTab (path) {
            this.$router.push(path)
        },
        handelTimeOk (val) {
            if (this.timeArr && this.timeArr.length > 0) {
                this.searchForm.startPeriod = moment(this.timeArr[0]).valueOf();
                this.searchForm.untilPeriod = moment(this.timeArr[1]).valueOf()
            }
        },
        handelTimeClear (val) {
            this.timeArr = []
            delete this.searchForm.startPeriod
            delete this.searchForm.untilPeriod
        },
        // 初始化字典数据
        initDic () {
            // 货物类型
            apiDictionaryQueryByCacheTypeKey({
                dictionaryTypeKey: 'GOODS_TYPE',
            }).then(({ data }) => {
                let newData = data.map((item) => {
                    return {
                        value: item.dictionaryKey,
                        label: item.dictionaryValue,
                    }
                })
                this.cargoTypeList = newData
            })
        },
        getTableList () {
            let api = null
            //调度
            if (this.isRoles_m(['DIS'])) api = apiGetRoleDsptEntrustList
            //销售
            if (this.isRoles_m(['SALE'])) api = apiGetRoleMktEntrustList
            //客户
            if (this.isRoles_m(['ENT'])) api = apiGetRoleCstmEntrustList
            let data = {
                ...this.searchForm,
                entrustType: 1, // 0/1   单次 / 周期
            }
            api({ data }).then(({ data }) => {
                let { content } = data
                let arr = (content[0].res || []).map((item) => {
                    return {
                        ...item,
                        location: item.getSchemePathListRes,
                    }
                })
                this.listData = arr
                this.total = content[0].totalElements
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.two-logistics {
}
</style>
