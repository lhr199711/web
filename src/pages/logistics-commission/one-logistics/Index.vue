<template>
    <div class="one-logistics">
        <tab-two @handelTab="handelTab"></tab-two>
        <adt-search-folder
            :searchRouter="{query: {
                    departurePort: search.departurePort,
                    destinationPort: search.destinationPort,
                    trsspmPort: search.trsspmPort,
                    contractCode: search.contractCode,
                }}"
            :isTitle="false"
            :isStatus="true"
        >
            <template slot="status">
                <div class="public-search-status">
                    <div class="status-left">
                        <p>状态:</p>
                        <span
                            v-for="(status, id) in auditStatusList"
                            :key="id"
                            @click="auditStatus(id,status.code)"
                            :class="{test: auditStatusNum == id}"
                        >{{status.status}}</span>
                    </div>
                </div>
                <Divider />
            </template>
            <template slot="always-show">
                <div class="public-search-input-jz">
                    <Row :gutter="40" class="publc-bottom20">
                        <Col span="4">
                            <span>启运地：</span>
                            <!-- <adt-city-selector @on-change="handelDirStart"></adt-city-selector> -->
                            <Cascader
                                :data="cityData"
                                clearable
                                filterable
                                placeholder="国家/省份/城市"
                                @on-change="handelDirStart"
                            ></Cascader>
                        </Col>
                        <Col span="4">
                            <span>选择场所：</span>
                            <Select v-model="search.departurePort" filterable clearable>
                                <Option
                                    v-for="item in departurePortList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <span>目的地：</span>
                            <!-- <adt-city-selector @on-change="handelDirEnd"></adt-city-selector> -->
                            <Cascader
                                :data="cityData"
                                clearable
                                filterable
                                @on-change="handelDirEnd"
                            ></Cascader>
                        </Col>
                        <Col span="4">
                            <span>选择场所：</span>
                            <Select v-model="search.destinationPort" filterable>
                                <Option
                                    v-for="item in destinationPortList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <span>中转地：</span>
                            <Cascader
                                :data="cityData"
                                clearable
                                filterable
                                @on-change="handelDirMid"
                            ></Cascader>
                        </Col>
                        <Col span="4">
                            <span>选择场所：</span>
                            <Select v-model="search.trsspmPort" filterable>
                                <Option
                                    v-for="item in trsspmPortList"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row :gutter="40" class="publc-bottom20">
                        <Col span="4">
                            <span @click="hh()">合同编号：</span>
                            <Input v-model="search.contractCode" clearable></Input>
                        </Col>
                        <Col span="4">
                            <span>运输类型：</span>
                            <Select v-model="search.trspMode" filterable clearable>
                                <Option
                                    v-for="item in trspModeList"
                                    :value="item.label"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <span>货物类型：</span>
                            <Select v-model="search.cargoType" filterable clearable>
                                <Option
                                    v-for="item in cargoTypeList"
                                    :value="item.label"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
            </template>
        </adt-search-folder>
        <div class="public-btn-pagina">
            <!-- <AdtButton class="btn-operating" :allDelShow="true" :selectList="selectList"></AdtButton> -->
            <div></div>
            <adt-paginator
                @getPages="getPages"
                class="pagination"
                :currentPage="~~page"
                :total="~~total"
                path="/logisstics-commission/one-logistics"
            />
        </div>
        <div class="public-component-line"></div>
        <div class="public-list">
            <div class="public-component-card" v-for="(logistics, id) in listData" :key="id">
                <AdtListItem
                    :logistics="logistics"
                    :showCheckbox="Boolean(isRecommend)"
                    @checkData="checkData"
                >
                    <template slot="tab-title">
                        <span>单次委托编号:{{ logistics.entrustCode }}</span>
                    </template>
                    <template slot="tab-operat">
                        <span
                            v-if="distinguishCharacter == 'dspt'"
                            class="card-status-success"
                        >{{ logistics.entrustStatus }}</span>
                        <Poptip placement="right-start" class="card-icon">
                            <span>编辑</span>
                            <Icon type="md-arrow-dropdown" />
                            <div class="card-poptip-font" slot="content">
                                <p @click="edit(logistics)">编辑</p>
                                <p @click="detail(logistics)">详情</p>
                                <p @click="remove(logistics)" class="failure">删除</p>
                            </div>
                        </Poptip>
                    </template>
                    <template slot="tab-content">
                        <div class="jz-card-route">
                            <div
                                class="card-content"
                                v-for="(location, index) in logistics.location"
                            >
                                <span class="card-outset">{{ location.departurePort }}</span>
                                <div class="card-transit">
                                    <div class="card-way">
                                        <svg class="icon" aria-hidden="true">
                                            <use
                                                v-if="location.trspMode == '空运'"
                                                fill="#FFBB32"
                                                xlink:href="#icon-andaotongcaidanICON_feiji"
                                            />
                                            <use
                                                v-if="location.trspMode == '铁路'"
                                                fill="#FFBB32"
                                                xlink:href="#icon-andaotongcaidanICON_huoche"
                                            />
                                            <use
                                                v-if="location.trspMode == '海运'"
                                                fill="#FFBB32"
                                                xlink:href="#icon-andaotongcaidanICON_lunchuan"
                                            />
                                        </svg>
                                    </div>
                                    <div class="card-line">
                                        <svg class="icon" aria-hidden="true">
                                            <use
                                                fill="#02ADB5"
                                                xlink:href="#icon-andaotongcaidanICON_jiantou3"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="card-genre"
                                    >{{ location.cargoType }}.{{ location.logisticsType }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="card-botton-box">
                            <div class="main">
                                <div class="item">
                                    发货人:
                                    <span>{{logistics.consigner}}</span>
                                </div>
                                <div class="item">
                                    收货人:
                                    <span>{{logistics.consignee}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template slot="tab-bottom">
                        <div class="jz-card-bottom">
                            <span>合同编号: {{ logistics.contractCode }}</span>
                            <span></span>
                        </div>
                    </template>
                </AdtListItem>
            </div>
        </div>
    </div>
</template>

<script>
import paginator from '@/mixins/paginator'
import AdtListItem from '@/components/adt-list-item/Index'
import {
    apiGetRoleCstmEntrustList,
    apiCityDic,
    apiChangJing
} from '@/api/logisticsCommission'
import lineHeader from './line-header/index'
import tabTwo from './tab-two/index'
import { apiDictionaryQueryByCacheTypeKey } from '@/api/dictionary'
import { mapGetters } from 'vuex'
export default {
    mixins: [paginator],
    props: {
        // 路由解耦
        departurePort: '',
        destinationPort: '',
        trsspmPort: '',
        contractCode: ''
    },
    components: {
        AdtListItem,
        lineHeader,
        tabTwo
    },
    data () {
        return {
            // 分页的搜索条件
            search: {
                departurePort: this.departurePort,
                destinationPort: this.destinationPort,
                trsspmPort: this.trsspmPort,
                contractCode: this.contractCode
            },
            isRecommend: 0, // 默认为0，拒绝为1，同意为2
            distinguishCharacter: 'dspt', // 状态颜色是否显示
            listData: [
                {
                    entrustStatus: '委托已接受',
                    entrustCode: '12dvhbv',
                    contractCode: 'hetongbianhao',
                    location: []
                }
            ],
            // 删除按钮上面的
            selectList: {},
            auditStatusNum: '默认值',
            auditStatusList: [
                { code: '', status: '全部' },
                { code: '已下单', status: '已下单' },
                { code: 'stock', status: '已接受' },
                { code: '已拒绝', status: '已拒绝' },
                { code: 'stock', status: '已取消' },
                { code: 'stock', status: '未确定计划' },
                { code: 'stock', status: '不同意计划' },
                { code: 'stock', status: '待货好' },
                { code: 'progress', status: '进行中' },
                { code: 'status', status: '已完成' },
                { code: 'progress', status: '异常进行中' },
                { code: 'progress', status: '异常处结束' },
                { code: 'progress', status: '已撤销' },
                { code: 'progress', status: '已支付' }
            ],
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
            cargoTypeList: []
        }
    },
    computed: {
        ...mapGetters('logisticsCommission', ['classList']),
        searchRouter () {
            let routerObj = {
                query: {
                    departurePort: this.search.departurePort,
                    destinationPort: this.search.destinationPort,
                    trsspmPort: this.search.trsspmPort
                }
            }
            return routerObj
        }
    },
    created () {
        this.initDic()
    },
    methods: {
        handelTab (path) {
            this.$router.push(path)
        },
        // 分页里面要用的方法，还是必须写
        dataInit () {
            this.getTableList()
        },
        hh () {
            this.$router.push('/logisstics-commission/add-single')
        },
        getTableList () {
            let data = {
                page: this.page,
                ...this.search,
                entrustType: 0 // 0/1   单次 / 周期
            }
            apiGetRoleCstmEntrustList({ data }).then(({ data }) => {
                let { content } = data
                let arr = content[0].res.map(item => {
                    return {
                        ...item,
                        location: item.getSchemePathListRes
                    }
                })
                this.listData = arr
                this.total = content[0].totalElements
            })
        },
        checkData (data, status) {
            // 多选
            // if (data && !status) {
            //     return data
            // }
            // this.checkList.push(data)
            // console.log(this.checkList)
        },
        getPages (page) {
            // 分页
            // this.page = page
        },
        edit (val) {
            alert('功能开发中')
        },
        detail (val) {
            // 跳转到单次的详情
            this.$router.push({
                path: '/logisstics-commission/singleDetail',
                query: {
                    entrustCode: val.entrustCode,
                    executoryEntrustCode: val.executoryEntrustCode,
                    lineHeaderData: JSON.stringify(val.location)
                }
            })
        },
        remove (val) {
            alert('功能开发中')
        },
        // 初始化字典数据
        initDic () {
            // 运输类型
            apiDictionaryQueryByCacheTypeKey({
                dictionaryTypeKey: 'TRANSPORT_TYPE'
            }).then(({ data }) => {
                let newData = data.map(item => {
                    return {
                        value: item.dictionaryKey,
                        label: item.dictionaryValue
                    }
                })
                this.trspModeList = newData
            })
            // 货物类型
            apiDictionaryQueryByCacheTypeKey({
                dictionaryTypeKey: 'GOODS_TYPE'
            }).then(({ data }) => {
                let newData = data.map(item => {
                    return {
                        value: item.dictionaryKey,
                        label: item.dictionaryValue
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
        async handelDirStart (data) {
            let arr = await this._handelDir(data.value)
            this.departurePortList = arr
        },
        // 拿到目的地的场景字典
        async handelDirEnd (val, data) {
            let arr = await this._handelDir(val, data)
            this.destinationPortList = arr
        },
        // 中转地的场景字典
        async handelDirMid (val, data) {
            let arr = await this._handelDir(val, data)
            this.trsspmPortList = arr
        },
        //拿到场景的字典
        _handelDir (val, data) {
            return new Promise((reslove, rejact) => {
                let code = val[val.length - 1]
                let iscode = val[val.length - 2]
                if (
                    iscode == '110000000000' ||
                    iscode == '120000000000' ||
                    iscode == '500000000000' ||
                    iscode == '310000000000'
                ) {
                    code = iscode
                }
                apiChangJing({ city: code }).then(({ data }) => {
                    let arr = data[0]
                    let newArr = arr.map(item => {
                        return {
                            value: item.sttnCode,
                            label: item.sttnName
                        }
                    })
                    reslove(newArr)
                })
            })
        },
        handeljz (data) {
            console.log(data.value)
        },
        // 处理练级城市
        _processDr (arr) {
            let setChildren = child => {
                child.forEach(item => {
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
            arr.forEach(item =>
                item.children.forEach(item =>
                    item.children.forEach(item => delete item.children)
                )
            )
            return arr
        },
        auditStatus (index, code) {
            // 控制状态切换传值
            this.auditStatusNum = index
            this.search.entrustExecutoryStatus = code
        }
    }
}
</script>

<style lang="scss" scoped>
.one-logistics {
    .public-list
        .public-component-card
        .card-route
        .card-content:last-child
        div {
        display: none;
    }
    .card-botton-box {
        height: 40px;
        background: #f5f5f5;
        padding: 0 20px;
        .main {
            border-top: #999999 dashed 1px;
            display: flex;
            justify-content: space-between;
            .item {
                line-height: 30px;
            }
        }
    }
    //必须写  后面要封装
    .card-content {
        height: 70px;
        line-height: 65px;
        margin-left: 20px;
        &:first-child {
            .card-outset {
                font-size: 18px;
                font-weight: bold;
            }
        }
        &:last-child {
            .card-outset {
                font-size: 18px;
                font-weight: bold;
                color: #999;
            }
        }
        &:last-child {
            .card-transit {
                display: none;
            }
        }
        .card-transit {
            display: flex;
            flex-direction: column;
            height: 70px;
            margin-top: -68px;
            margin-left: 50px;
            .icon {
                width: 160px;
                height: 20px;
            }
            .card-way {
                height: 10px;
            }
            .card-line {
                height: 10px;
            }
            .card-genre {
                height: 20px;
                color: $light-color;
                text-align: center;
            }
        }
    }
    .jz-card-route {
        display: flex;
        background-color: $filling-color;
        border-radius: 4px;
        overflow: auto;
        overflow-y: hidden;
        .card-content {
            height: 70px;
            line-height: 65px;
            margin-left: 20px;
            &:first-child {
                .card-outset {
                    font-size: 18px;
                    font-weight: bold;
                }
            }
            &:last-child {
                .card-address {
                    font-size: 18px;
                    font-weight: bold;
                    white-space: nowrap;
                    margin-left: 120px;
                }
            }
            .card-transit {
                display: flex;
                flex-direction: column;
                height: 70px;
                margin-top: -68px;
                margin-left: 50px;
                .icon {
                    width: 100px;
                    height: 20px;
                }
                .card-way {
                    height: 10px;
                }
                .card-line {
                    height: 10px;
                }
                .card-genre {
                    height: 20px;
                    color: $light-color;
                    text-align: center;
                }
            }
        }
    }
    .jz-card-bottom {
        margin: 10px 10px 0 10px;
        display: flex;
        font-size: 13px;
        span {
            width: 33%;
            line-height: 20px;
        }
        .card-center {
            text-align: center;
        }
        .card-right {
            text-align: right;
            .card-right-size {
                font-size: 18px;
            }
        }
    }
}
</style>
