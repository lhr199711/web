<template>
    <div class="conract-entrust-list">
        <single-order-search v-if="!isSearched" :searchContent="search" @search="confirmSearch"></single-order-search>
        <div v-else class="search-result">
            <div class="public-search-condition">
                <div class="condition">
                    <div v-show="search.departurePort">
                        <div class="place-area">{{ search.departurePortLabel }}</div>
                        <div class="place-title">城市</div>
                    </div>
                    <div class="icon" v-show="search.departurePort && search.destinationPort">
                        <svg class="iconfont arrow" aria-hidden="true">
                            <use xlink:href="#icon-andaotongV3ICON_zhi" />
                        </svg>
                    </div>
                    <div v-show="search.destinationPort" style="margin-right: 40px;">
                        <div class="place-area">{{ search.destinationPortLabel }}</div>
                        <div class="place-title">场所</div>
                    </div>
                    <div v-show="search.cargoType" class="item">
                        {{ search.cargoType && search.cargoType.split('~')[1] }}
                    </div>
                    <div v-show="search.entrustStatus" class="item">
                        委托状态:
                        <span :title="search.entrustStatus">
                            {{ search.entrustStatusTranslate }}
                        </span>
                    </div>
                    <div v-show="search.contractCode" class="item">
                        合同号:
                        <span :title="search.contractCode">
                            {{ search.contractCode }}
                        </span>
                    </div>
                </div>
                <Button shape="circle" size="large" @click="searchAgain">重新查询</Button>
            </div>
            <div class="result-lists">
                <div class="btns-paginator">
                    <adt-button :allDelShow="true" :delUrl="delUrl" :selectList="selectList">
                    </adt-button>
                    <adt-paginator :currentPage="~~page" :total="~~total" :size="size" />
                </div>
                <div class="public-list one-column">
                    <div v-for="(entrust, index) in listData" :key="index" class="public-component-card">
                        <adt-list-item
                            :logistics="entrust"
                            :showCheckbox="true"
                            :resetCheckStatus="resetCheckStatus"
                            @checkData="checkData"
                        >
                            <template slot="tab-title">
                                <Row style="float: left; width: 95%; padding-bottom: 10px;">
                                    <Col span="6">单次委托编号：{{ entrust.executoryEntrustCode }}</Col>
                                    <Col span="6">合同编号：{{ entrust.contractCode }}</Col>
                                    <div>
                                        <span class="table-status">{{entrust.entrustStatusTranslate}}</span>
                                    </div>
                                </Row>
                            </template>
                            <template slot="tab-operat">
                                <Poptip class="card-icon" placement="right-start" trigger="hover">
                                    <span>详情</span>
                                    <Icon type="md-arrow-dropdown" />
                                    <div class="card-poptip-font" slot="content">
                                        <div @click="detail(entrust)">详情</div>
                                        <div @click="edit(entrust)">编辑</div>
                                        <div @click="cancel(entrust)">取消委托</div>
                                        <div @click="send(entrust)">发送</div>
                                        <div @click="remove(entrust)" class="failure">删除</div>
                                    </div>
                                </Poptip>
                            </template>
                            <template slot="tab-content">
                                <!-- 运输产品 -->
                                <div class="tab-content">
                                    <line-info :routeResList="entrust.getSchemePathListRes"></line-info>
                                    <Row class="contract-info">
                                        <Col span="6">发货人：{{ entrust.consignee }}</Col>
                                        <Col span="18">收货人：{{ entrust.consigner }}</Col>
                                    </Row>
                                </div>
                            </template>
                        </adt-list-item>
                    </div>
                </div>
            </div>
        </div>
        <adt-reconfirm-modal :showModal="showDelModal" @on-visible-change="visibleChange" @on-ok="handleRemove" />
    </div>
</template>

<script>
    import SingleOrderSearch from './components/SingleOrderSearch'
    import AdtListItem from '@/components/adt-list-item/Index'
    import paginator from '@/mixins/paginator'
    import { timestampFormat } from '@/libs/utils'
    import {
        apiQueryEntSingleOrderList,
        apiQueryDisSingleOrderList,
        apiQuerySaleSingleOrderList,
        apiDeleteOnceEntrust
    } from '@/api/logisticsEntrust' //获取单次列表 2个参 删除单次 2个参
    export default {
        mixins: [paginator],
        components: {
            LineInfo:()=>import('./components/LineInfo'), //路线组件
            SingleOrderSearch,
            AdtListItem
        },
        props: {
            departurePort: '',
            departurePortLabel: '',
            destinationPort: '',
            destinationPortLabel: '',
            cargoType: '',
            entrustStatus: '',
            entrustStatusTranslate: '',
            contractCode: ''
        },
        data () {
            return  {
                roleType: this.$getUserInfo().roleType,
                isSearched: false, // 是否已经查询
                search: {
                    departurePort: this.departurePort,
                    destinationPort: this.destinationPort,
                    cargoType: this.cargoType,
                    entrustStatus: this.entrustStatus,
                    contractCode: this.contractCode
                },
                resetCheckStatus: false, // 清空选中
                selectList: [], // 选中的
                listData: [{
                    routeResList: [
                        {
                            departurePort: 'AD_ONE',
                            departurePortTranslate: '重庆',
                            destinationPort: 'AD_TWO',
                            destinationPortTranslate: '北京',
                            trspMode: 'PUBROAD'
                        },
                        {
                            departurePort: 'AD_TWO',
                            departurePortTranslate: '北京',
                            destinationPort: 'AD_THREE',
                            destinationPortTranslate: '上海',
                            trspMode: 'RAILWAY'
                        }
                    ]
                }], // 查询出的内容
                size: 15, // 每页显示条数
                delUrl: function () {},
                delInfo: [],
                showDelModal: false
            }
        },
        methods: {
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp, true, '/')
            },
            visibleChange (changeStatus) {
                this.showDelModal = changeStatus
            },
            // 取消委托
            cancel (val) {},
            // 发送委托
            send (val) {},
            // 详情
            detail ({executoryEntrustCode,entrustCode}) {
                this.$router.push({path: '/logistics-entrust/once-entrust-entering',query: {isDetail:executoryEntrustCode,entrustCode}})
            },
            // 编辑
            edit (entrust) {
                this.$router.push('')
            },
            // 删除
            remove (entrust) {
                this.showDelModal = true
                this.delInfo = [entrust]
            },
            // 确定删除
            handleRemove (list) {
                this.delUrl(this.selectList).then(res => {
                    if (res.data) {
                        this.$Message.success('操作成功')
                    } else {
                        this.$Message.error('操作失败')
                    }
                }).catch(() => {
                    this.$Message.error('操作失败')
                })
            },
            // 初始化数据(获取列表)
            dataInit () {
                if (this.isSearched) {
                    this.getData()
                }
            },
            // 获取不同角色列表
            getData () {
                const data = {
                    page: Number(this.page),
                    size: 2 || this.size,
                    ...this.search,
                    cargoType: this.search.cargoType && this.search.cargoType.split('~')[0],
                    entrustStatus: this.search.entrustStatus && +new Date(this.search.entrustStatus),
                    contractCode: this.search.contractCode && +new Date(this.search.contractCode)
                }
                // console.log(data,this.roleType, "查询单次列表参数");
                // let ss = () => {
                // 去除选中的状态（写两遍是为了触发watch监听）
                this.resetCheckStatus = false
                // 调度角色 查询
                const getDISList = (data) => {
                    apiQueryDisSingleOrderList({ data }).then(({ data }) => {
                    changeSingleList(data) //调用数据赋值函数
                    })
                };
                // 销售角色 查询
                const getSALEList = (data) => {
                    apiQuerySaleSingleOrderList({ data }).then(({ data }) => {
                        changeSingleList(data) //调用数据赋值函数
                    })
                };
                // 客户角色 查询
                const getENTList = (data) => {
                    apiQueryEntSingleOrderList({ data }).then(({ data }) => {
                        changeSingleList(data) //调用数据赋值函数
                    })
                };
                // 数据赋值函数
                const changeSingleList = (data) => {
                    this.listData = data.content || []
                    this.total = Number(data.totalElements)
                    // 重置选中的值
                    this.selectList = []
                    // 去除选中的状态
                    this.resetCheckStatus = true
                }
                switch (this.roleType) { //目前默认是客户角色 修改之后放开
                    case 'DIS':
                        getDISList(data)
                        break;
                    case 'SALE':
                        getSALEList(data)
                        break;
                    case 'ENT':
                        getENTList(data)
                        break;
                    default:
                        getENTList(data)
                }
                // }
            },
            // 重新查询
            searchAgain () {
                this.listData = [] //数据清空
                this.total = 0 //条数清零
                this.selectList = [] // 重置选中的值
                this.isSearched = false
            },
            // 选择委托
            checkData (data, status) {
                // 后端需要多个字段
                if (status) {
                    this.selectList.push(data)
                } else {
                    // 取消选中
                    for (const index in this.selectList) {
                        if (this.selectList[index].serverCode === data.serverCode) {
                            this.selectList.splice(index, 1)
                        }
                    }
                }
            },
            // 查询
            confirmSearch (searchContent) {
                this.isSearched = true
                this.search = searchContent
                this.dataInit()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .place-area {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
    }
    .place-title {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
    }
    .icon {
        margin: 0 40px;
        color: #02ADB5;
    }
    .table-status {
        padding: 2px 5px;
        border: 1px solid #02ADB5;
        border-radius: 5px;
        color: #02ADB5;
    }
    .public-list {
        margin: 0;
    }
    .tab-content {
        padding: 20px;
        .line-info {
            display: flex;
            .site {
                line-height: 32px;
                font-size: 16px;
                color: #666;
                &:first-of-type(), &:last-of-type() {
                    color: #333;
                    font-size: 20px;
                }
            }
            .translate-info {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                margin: 0 40px;
                .way {
                    height: 16px;
                    font-size: 30px;
                    color: $warning-color;
                    &.plane {
                        position: relative;
                        top: 3px;
                        height: 22px;
                        margin-top: -3px;
                    }
                }
                .arrow {
                    height: 6px;
                    font-size: 100px;
                    color: $light-color;
                }
                .info {
                    color: $light-color;
                    font-size: 12px;
                    transform: scale(.8);
                }
            }
        }
        .contract-info {
            margin-top: 25px;
            padding-top: 8px;
            border-top: 2px dashed $border-color;
        }
    }
</style>
