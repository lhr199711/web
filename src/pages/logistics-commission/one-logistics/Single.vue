<template>
    <div class="one-logistics">
        <div class="public-headejz">
            <tab-two @handelTab="handelTab"></tab-two>
        </div>
        <div class="public-search-headjz">
            <search-status :status-list="cptauditStatusList" @auditStatus="auditStatus"></search-status>
            <Divider style="margin:20px 0" />
            <div class="public-search-input-jz">
                <Row :gutter="20" class="publc-bottom20">
                    <Col span="8">
                        <Col span="12">
                            <span style="padding-left: 14px;">&nbsp;&nbsp;启运地:</span>
                            <!-- <Cascader
                            :data="cityData"
                            clearable
                            filterable
                            placeholder="国家/省份/城市"
                            @on-change="handelDirStart"
                            ></Cascader>-->
                            <adt-city-selector @on-change="handelDirStart" :defaultData="startstr"></adt-city-selector>
                        </Col>
                        <Col span="12">
                            <span style="padding-left:5px;">选择场所:</span>
                            <Select v-model="searchForm.departurePort" filterable clearable>
                                <Option
                                    v-for="item in departurePortList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Col>
                    <Col span="8">
                        <Col span="12">
                            <span style="padding-left: 14px;">目的地:</span>
                            <adt-city-selector @on-change="handelDirEnd" :defaultData="endstr"></adt-city-selector>
                        </Col>
                        <Col span="12">
                            <span style="padding-left:5px;">选择场所:</span>
                            <Select v-model="searchForm.destinationPort" filterable clearable>
                                <Option
                                    v-for="item in destinationPortList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Col>
                    <Col span="8">
                        <Col span="12">
                            <span style="padding-left: 14px;">中转地:</span>
                            <adt-city-selector @on-change="handelDirMid" :defaultData="midstr"></adt-city-selector>
                        </Col>
                        <Col span="12">
                            <span style="padding-left:5px;">选择场所:</span>
                            <Select v-model="searchForm.trsspmPort" filterable clearable>
                                <Option
                                    v-for="item in trsspmPortList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Col>
                </Row>
                <Row :gutter="20" class="publc-bottom20">
                    <Col span="8">
                        <Col span="12">
                            <span @click="hh()">合同编号:</span>
                            <Input v-model="searchForm.contractCode" clearable></Input>
                        </Col>
                    </Col>
                    <Col span="8">
                        <Col span="12">
                            <span>运输类型:</span>
                            <Select v-model="searchForm.trspType" filterable clearable>
                                <Option
                                    v-for="item in trspModeList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Col>
                    <Col span="8">
                        <Col span="12">
                            <span>货物类型:</span>
                            <Select v-model="searchForm.cargoType" filterable clearable>
                                <Option
                                    v-for="item in cargoTypeList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
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
        <table-cart :tableList="listData" @goodOkCal="goodOkCal"></table-cart>
    </div>
</template>

<script>
import searchStatus from '../order/search-status/index'
import pagination from '../order/pagination/index'
import tableCart from './table-cart/index'
import {
    apiGetRoleCstmEntrustList,
    apiGetRoleMktEntrustList,
    apiGetRoleDsptEntrustList,
    apiCityDic,
    apiChangJing,
} from '@/api/logisticsCommission'
import lineHeader from './line-header/index'
import tabTwo from './tab-two/index'
import tableMixin from '@/mixins/tableMixin'
import authMixin from '@/mixins/authMixin'
import homeMixin from '../mixins/homeMixin'
import { apiDictionaryQueryByCacheTypeKey } from '@/api/dictionary'
import { mapGetters } from 'vuex'
import { isDIS, isSALE, isENT } from '@/libs/roles.js'
export default {
    mixins: [tableMixin, authMixin,homeMixin],
    components: {
        lineHeader,
        tabTwo,
        searchStatus,
        pagination,
        tableCart,
    },
    data () {
        return {
            // 分页的搜索条件
            searchForm: {
                page: 1,
                size: 4,
            },
            total: 0,
            startstr: '',
            endstr: '',
            midstr: '',
            // 表格的数据
            listData: [],
            // 状态 后期会取值字典
            auditStatusList: this.$getDictionary('ENTRUST_STATUS'),
            // 联集选择器
            cityData: [],
            //启运地场所集合
            departurePortList: [],
            //目的地场所集合
            destinationPortList: [],
            //中转地场所集合
            trsspmPortList: [],
            // 运输类型
            trspModeList: [],
            // 货物类型
            cargoTypeList: [], // 货物类型
        }
    },
    computed: {
        cptauditStatusList () {
            let arr = this.auditStatusList.map((item) => {
                return {
                    label: item.dictionaryValue,
                    value: item.dictionaryKey,
                }
            })
            return arr
        },
    },
    created () {
        this.initDic()
        this.home_entrustIndex_m()
    },
    methods: {
        auditStatus (code) {
            // 控制状态切换传值
            this.searchForm.entrustExecutoryStatus = code
        },
        // tab的切换
        handelTab (path) {
            this.$router.push(path)
        },
        hh () {
            // alert('开发的时候用的入口')
            this.$router.push('/logisstics-commission/add-single')
        },
        // 货好确认的回调
        goodOkCal () {
            this.handleFilter_m()
        },
        // 直接接口
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
                entrustType: 0, // 0/1   单次 / 周期
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
        // 初始化字典数据
        initDic () {
            // 运输类型
            apiDictionaryQueryByCacheTypeKey({
                dictionaryTypeKey: 'TRANSPORT_TYPE',
            }).then(({ data }) => {
                let newData = data.map((item) => {
                    return {
                        value: item.dictionaryKey,
                        label: item.dictionaryValue,
                    }
                })
                this.trspModeList = newData
            })
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
            //城市三联
            apiCityDic().then(({ data }) => {
                this.cityData = this._processDr(data)
            })
        },
        // 拿到启运地的场景字典
        async handelDirStart (value) {
            this.startstr = value.value.join('~')
            this.departurePortList = await this._handelDir(value.value)
        },
        // 拿到目的地的场景字典
        async handelDirEnd (value) {
            this.endstr = value.value.join('~')
            this.destinationPortList = await this._handelDir(value.value)
        },
        // 中转地的场景字典
        async handelDirMid (value) {
            this.midstr = value.value.join('~')
            this.trsspmPortList = await this._handelDir(value.value)
        },
        //拿到场景的字典
        // _handelDir(val, data) {
        //     return new Promise((reslove, rejact) => {
        //         let code = val[val.length - 1]
        //         let iscode = val[val.length - 2]
        //         if (
        //             iscode == '110000000000' ||
        //             iscode == '120000000000' ||
        //             iscode == '500000000000' ||
        //             iscode == '310000000000'
        //         ) {
        //             code = iscode
        //         }
        //         apiChangJing({ city: code }).then(({ data }) => {
        //             let arr = data[0]
        //             let newArr = arr.map((item) => {
        //                 return {
        //                     value: item.sttnCode,
        //                     label: item.sttnName,
        //                 }
        //             })
        //             reslove(newArr)
        //         })
        //     })
        // },
        // 根据城市获取场所
        _handelDir (val) {
            return new Promise((resolve) => {
                const code = val[val.length - 1]
                apiChangJing({ city: code }).then(({ data }) => {
                    const arr = data && data.length ? data[0] : []
                    const newArr = arr.map((item) => {
                        return {
                            value: item.sttnCode,
                            label: item.sttnName,
                        }
                    })
                    resolve(newArr)
                })
            })
        },
        // 处理练级城市  这个方法可能不会用了
        _processDr (arr) {
            let setChildren = (child) => {
                child.forEach((item) => {
                    if (item.child) {
                        item.value = item.addressCode
                        item.label = item.addressName
                        item.children = item.child
                        delete item.child
                        setChildren(item.children)
                    }
                    if (!item.child) {
                        delete item.child
                    }
                })
            }
            setChildren(arr)
            arr.forEach((item) =>
                item.children.forEach((item) =>
                    item.children.forEach((item) => delete item.children)
                )
            )
            return arr
        },
    },
}
</script>

<style lang="scss" scoped>
.one-logistics {
}
</style>
