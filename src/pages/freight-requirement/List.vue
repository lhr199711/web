<template>
    <div class="conract-entrust-list">
        <list-search-box v-if="!isSearched" :searchContent="search" @search="confirmSearch"></list-search-box>
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
                    <div v-show="search.freighterStatus" class="item">
                        货运要求状态:
                        <span :title="search.freighterStatus">
                            {{ search.freighterStatusTranslate }}
                        </span>
                    </div>
                    <div v-show="search.transportType" class="item">
                        {{ search.transportType && search.transportType.split('~')[1] }}
                    </div>
                </div>
                <Button shape="circle" size="large" @click="isSearched = false">重新查询</Button>
            </div>
            <div class="result-lists">
                <div class="btns-paginator">
                    <adt-button :allDelShow="true" :delUrl="delUrl" :selectList="selectList">
                        <Button @click="addFreightRequire">
                            新建货运需求
                            <svg class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                            </svg>
                        </Button>
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
                                    <Col span="4">货运要求编号：{{ entrust.freightReqCode }}</Col>
                                    <!-- <Col span="2"><span class="table-status">{{ entrust.freightReqStatus }}</span></Col> -->
                                    <Col span="2"><span class="table-status">已接收</span></Col>
                                    <Col span="4">录入时间：{{ entrust.createDateTime }}</Col>
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
                                <div class="tab-content" style="background-color: white;">
                                    <div v-show=" entrust.isShow ? id === id : id === 0" class="line-info" v-for="(routeList, id) in entrust.routeResList">
                                        <!-- <div class="line-info-disply"> -->
                                            <template v-for="(route, endex) in routeList.list">
                                                <div v-if='endex === 0' class="site">{{ route.departurePort }}</div>
                                                <div class="translate-info">
                                                    <div class="info">
                                                        {{ route.logisticsType }}-{{ route.trspType }}-{{ route.cargoType }}
                                                    </div>
                                                    <svg class="iconfont icon-color" aria-hidden="true">
                                                        <use xlink:href="#icon-andaotongV3ICON_zhi"></use>
                                                    </svg>
                                                </div>
                                                <div class="site">{{ route.destinationPort }}</div>
                                            </template>
                                            <div class="line-status">
                                                <svg class="iconfont status-log" aria-hidden="true">
                                                    <use xlink:href="#icon-gouxuan-xuanzhong-yuankuang"></use>
                                                </svg>
                                                <span class="status-title">有方案</span>
                                            </div>
                                            <div v-show="id === 0" class="line-show" @click="unfold(entrust)">{{ entrust.isShow ? '收起' : '展示' }}></div>
                                        <!-- </div> -->
                                    </div>
                                    <!-- <Row class="contract-info">
                                        <Col span="6">发货人：{{ entrust.consignee }}</Col>
                                        <Col span="18">收货人：{{ entrust.consigner }}</Col>
                                    </Row> -->
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
    import ListSearchBox from './ListSearchBox'
    import AdtListItem from '@/components/adt-list-item/Index'
    import paginator from '@/mixins/paginator'
    import { timestampFormat } from '@/libs/utils'
    import {
        apiQueryEntSingleOrderList,
        apiQueryDisSingleOrderList,
        apiQuerySaleSingleOrderList,
        apiDeleteOnceEntrust
    } from '@/api/logisticsEntrust'
    export default {
        mixins: [paginator],
        components: {
            ListSearchBox,
            AdtListItem
        },
        props: {
            departurePort: '',
            departurePortLabel: '',
            destinationPort: '',
            destinationPortLabel: '',
            cargoType: '',
            freighterStatus: '',
            freighterStatusTranslate: '',
            transportType: ''
        },
        data () {
            return  {
                // isShow: '',
                // 展示路线
                isShowRoute: false,
                isSearched: false, // 是否已经查询
                search: {
                    departurePort: this.departurePort,
                    destinationPort: this.destinationPort,
                    cargoType: this.cargoType,
                    transportType: this.transportType,
                    freighterStatus: this.freighterStatus
                },
                resetCheckStatus: false, // 清空选中
                selectList: [], // 选中的
                listData: [
                    {
                        freightReqCode: '1233122',
                        routeResList: [
                            {
                                matchScheme: '有方案',
                                list: [
                                    {
                                        departurePort: '重庆',
                                        destinationPort: '香港',
                                        trspMode: '1',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际',
                                        matchScheme: true
                                    },
                                    {
                                        departurePort: '香港',
                                        destinationPort: '纽约',
                                        trspMode: '2',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    },
                                    {
                                        departurePort: '重庆',
                                        destinationPort: '香港',
                                        trspMode: '3',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    },
                                    {
                                        departurePort: '香港',
                                        destinationPort: '纽约',
                                        trspMode: '4',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    }
                                ]
                            },
                            {
                                matchScheme: '无方案',
                                list: [
                                    {
                                        departurePort: '重庆',
                                        destinationPort: '香港',
                                        trspMode: '1',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际',
                                        matchScheme: true
                                    },
                                    {
                                        departurePort: '香港',
                                        destinationPort: '纽约',
                                        trspMode: '2',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    },
                                    {
                                        departurePort: '重庆',
                                        destinationPort: '香港',
                                        trspMode: '3',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    },
                                    {
                                        departurePort: '香港',
                                        destinationPort: '纽约',
                                        trspMode: '4',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        freightReqCode: '1233122',
                        routeResList: [
                            {
                                matchScheme: '有方案',
                                list: [
                                    {
                                        departurePort: '重庆',
                                        destinationPort: '香港',
                                        trspMode: '1',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际',
                                        matchScheme: true
                                    },
                                    {
                                        departurePort: '香港',
                                        destinationPort: '纽约',
                                        trspMode: '2',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    },
                                    {
                                        departurePort: '重庆',
                                        destinationPort: '香港',
                                        trspMode: '3',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    },
                                    {
                                        departurePort: '香港',
                                        destinationPort: '纽约',
                                        trspMode: '4',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    }
                                ]
                            },
                            {
                                matchScheme: '无方案',
                                list: [
                                    {
                                        departurePort: '重庆',
                                        destinationPort: '香港',
                                        trspMode: '1',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际',
                                        matchScheme: true
                                    },
                                    {
                                        departurePort: '香港',
                                        destinationPort: '纽约',
                                        trspMode: '2',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    },
                                    {
                                        departurePort: '重庆',
                                        destinationPort: '香港',
                                        trspMode: '3',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    },
                                    {
                                        departurePort: '香港',
                                        destinationPort: '纽约',
                                        trspMode: '4',
                                        cargoType: '普货',
                                        trspType: '集装箱',
                                        logisticsType: '国际'
                                    }
                                ]
                            }
                        ]
                    }
                ], // 查询出的内容
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
            unfold (val) {
                this.$set(val, 'isShow', !val.isShow)
            },
            // 取消委托
            cancel (val) {},
            // 发送委托
            send (val) {},
            // 详情
            detail (entrust) {
                this.$router.push('')
            },
            // 新建货运需求
            addFreightRequire () {
                this.$router.push('')
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
            // 获取列表
            getData () {
                const data = {
                    page: this.page,
                    size: this.size,
                    ...this.search,
                    cargoType: this.search.cargoType && this.search.cargoType.split('~')[0],
                    transportType: this.search.transportType && this.search.transportType.split('~')[0]
                }
                // 去除选中的状态（写两遍是为了触发watch监听）
                this.resetCheckStatus = false
                // 调度角色 查询
                const getDISList = (data) => {
                    // apiQueryDisSingleOrderList({ data }).then(({ data }) => {
                    //    changeSingleList(data) //调用数据赋值函数
                    // })
                };
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
                // this.isSearched = true
                // this.search = searchContent
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
            margin-bottom: 5px;
            padding: 20px 20px;
            background-color: #F9F9F9;
            // .line-info-disply {
            //     display: flex;
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
                    margin: 8px 5px;
                    // justify-content: center;
                    // align-items: center;
                    // flex-direction: column;
                    // margin: 0 40px;
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
                    .icon-color {
                        color: #02ADB5;
                        margin-top: 3px;
                    }
                }
                .line-status {
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    background: #F1F2F5;
                    border-radius: 4px;
                    margin-left: 480px;
                    padding-left: 30px;
                    .status-log {
                        color: #02ADB5;
                    }
                    .status-title {
                        color: #02ADB5;
                        margin-left: 5px;
                    }
                }
                .line-show {
                    line-height: 40px;
                    margin-left: 10px;
                    cursor: pointer;
                }
            // }
        }
    }
</style>
