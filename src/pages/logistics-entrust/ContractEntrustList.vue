<template>
    <div class="conract-entrust-list">
        <contract-entrust-search v-if="!isSearched" :searchContent="search" @search="confirmSearch"></contract-entrust-search>
        <div v-else class="search-result">
            <div class="public-search-condition">
                <div class="condition">
                    <div v-show="search.entrustCode" class="item">合同委托编号: <span :title="search.entrustCode">{{ search.entrustCode }}</span></div>
                    <div v-show="search.contractCode" class="item">合同号: <span :title="search.contractCode">{{ search.contractCode }}</span></div>
                    <div v-show="search.cargoType" class="item">{{ search.cargoType && search.cargoType.split('~')[1] }}</div>
                    <div v-show="search.startPeriod" class="item">合同委托起期: <span :title="timestampFormat(search.startPeriod)">{{ timestampFormat(search.startPeriod) }}</span></div>
                    <div v-show="search.untilPeriod" class="item">合同委托止期: <span :title="timestampFormat(search.untilPeriod)">{{ timestampFormat(search.untilPeriod) }}</span></div>
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
                                    <Col span="8">合同委托编号：{{ entrust.entrustCode }}</Col>
                                    <Col class="weight-info" span="16">
                                        <Row>
                                            <Col class="total-weight htzl" span="7">
                                            合同总量：{{ entrust.cargoTotal }}KG
                                            </Col>
                                            <Col class="total-weight yjfzl" span="7">
                                            已交付总量：{{ entrust.deliveredWeight }}KG
                                            </Col>
                                            <Col class="total-weight wqyzl" span="7">
                                            未启运总量：{{ entrust.noPlaceWeight }}KG
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </template>
                            <template slot="tab-operat">
                                <Poptip class="card-icon" placement="right-start" trigger="hover">
                                    <span>详情</span>
                                    <Icon type="md-arrow-dropdown" />
                                    <div class="card-poptip-font" slot="content">
                                        <div @click="detail(entrust)">详情</div>
                                        <div @click="edit(entrust)">编辑</div>
                                        <div @click="remove(entrust)" class="failure">删除</div>
                                    </div>
                                </Poptip>
                            </template>
                            <template slot="tab-content">
                                <!-- 运输产品 -->
                                <div class="tab-content">
                                    <line-info :routeResList="entrust.getSchemePathListRes"></line-info>
                                    <Row class="contract-info">
                                        <Col span="6">合同编号：{{ entrust.totalTime }}</Col>
                                        <Col span="18">
                                            合同有效期：
                                            {{ timestampFormat(entrust.startPeriod) }}
                                            --
                                            {{ timestampFormat(entrust.untilPeriod) }}
                                        </Col>
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
    import ContractEntrustSearch from './components/ContractEntrustSearch'
    import AdtListItem from '@/components/adt-list-item/Index'
    import LineInfo from './components/LineInfo'
    import paginator from '@/mixins/paginator'
    import { timestampFormat } from '@/libs/utils'
    import {
        apiQueryEntContractEntrustList,
        apiQueryDisContractEntrustList,
        apiQuerySaleContractEntrustList,
        apiGetPeriodEntrustDetails,
        apiDeletePeriodEntrust
    } from '@/api/logisticsEntrust'  //获取不同角色合同列表 删除合同
    export default {
        mixins: [paginator],
        components: {
            ContractEntrustSearch,
            AdtListItem,
            LineInfo
        },
        props: {
            entrustCode: '',
            contractCode: '',
            cargoType: '',
            startPeriod: '',
            untilPeriod: ''
        },
        data () {
            return  {
                roleType: this.$getUserInfo().roleType,
                isSearched: false, // 是否已经查询
                search: {
                    entrustCode: this.entrustCode,
                    contractCode: this.contractCode,
                    cargoType: this.cargoType,
                    startPeriod: this.startPeriod,
                    untilPeriod: this.untilPeriod
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
            // 详情
            detail ({entrustCode}) {
                this.$router.push({path: '/logistics-entrust/contract-entrust-entering',query: {isDetail:entrustCode}})
            },
            edit (entrust) {
                this.$router.push('')
            },
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
            // 获取列表
            getData () {
                const data = {
                    page: Number(this.page),
                    size: this.size,
                    ...this.search,
                    cargoType: this.search.cargoType && this.search.cargoType.split('~')[0],
                    startPeriod: this.search.startPeriod && +new Date(this.search.startPeriod) || undefined,
                    untilPeriod: this.search.untilPeriod && +new Date(this.search.untilPeriod) || undefined
                }
                // 去除选中的状态（写两遍是为了触发watch监听）
                this.resetCheckStatus = false
                console.log(data,this.roleType, "查询合同列表参数");
                // let dd = ()=> {
                // 数据赋值函数
                const changeSingleList = (data) => {
                    this.listData = data.content || []
                    this.total = data.totalElements
                    // 重置选中的值
                    this.selectList = []
                    // 去除选中的状态
                    this.resetCheckStatus = true
                }
                // 调度角色 查询合同列表
                const getDISList = (data) => {
                    apiQueryDisContractEntrustList({ data }).then(({ data }) => {
                    changeSingleList(data) //调用数据赋值函数
                    })
                };
                // 销售角色 查询合同列表
                const getSALEList = (data) => {
                    apiQuerySaleContractEntrustList({ data }).then(({ data }) => {
                        changeSingleList(data) //调用数据赋值函数
                    })
                };
                // 客户角色 查询合同列表
                const getENTList = (data) => {
                    apiQueryEntContractEntrustList({ data }).then(({ data }) => {
                        changeSingleList(data) //调用数据赋值函数
                    })
                };
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
            // 重新查询
            searchAgain () {
                this.listData = [] //数据清空
                this.total = 0 //条数清零
                this.selectList = [] // 重置选中的值
                this.isSearched = false
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
    .public-list {
        margin: 0;
    }
    .weight-info {
        .total-weight {
            margin: 0 10px;
            padding-left: 10px;
            background-color: #f1f1f1;
            &.htzl {
                border-left: 2px solid #53ACFF;
            }
            &.yjfzl {
                border-left: 2px solid #02ADB5;
            }
            &.wqyzl {
                border-left: 2px solid #FF0000;
            }
        }
    }
    .tab-content {
        padding: 20px;
        .contract-info {
            margin-top: 25px;
            padding-top: 8px;
            border-top: 2px dashed $border-color;
        }
    }
</style>
