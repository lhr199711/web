<template>
    <div class="container">
        <header>
            <img src="@/assets/images/show/logo.png" alt="安道通多式联运供应链管理平台logo" />
            <img src="@/assets/images/show/head-title.png" alt="安道通多式联运供应链管理平台" />
            <img src="@/assets/images/show/logo.png" alt="安道通多式联运供应链管理平台logo" />
        </header>
        <div class="statistics">
            <div class="map-container">
                <div class="map-mask"></div>
                <channel-map />
            </div>
            <!-- 即刻开始 -->
            <div class="map-start" @click="gotoLogin"></div>
            <section class="order-info-section">
                <div class="order-info">
                    <div class="order-info-logo">
                        <img src="@/assets/images/show/order-title.png" alt="供应链服务资源" />
                    </div>
                    <!-- 运输产品 -->
                    <div>
                        <div class="chart">
                            <div class="chart-title">运输产品</div>
                            <node-ring :data="transportData" />
                        </div>
                    </div>
                    <!-- 场所产品 -->
                    <div>
                        <div class="chart">
                            <div class="chart-title">场所产品</div>
                            <node-ring :data="placeData" />
                        </div>
                    </div>
                    <!-- 关务产品 -->
                    <div>
                        <div class="chart">
                            <div class="chart-title">关务产品</div>
                            <node-ring :data="customsData" />
                        </div>
                    </div>
                </div>
            </section>
            <!-- 订单总量 && 通道信息 -->
            <section class="platform-info">
                <!-- 订单总量 -->
                <div class="order-info">
                    <div class="total-quantity total-info">
                        <div class="name">订单总量：</div>
                        <div class="box">
                            <div class="nums">
                                <div
                                    class="num"
                                    v-for="(item, index) in totalOrder"
                                    :key="index"
                                >{{ item }}</div>
                            </div>
                            <div class="unit">个</div>
                        </div>
                    </div>
                    <div class="chart">
                        <order-total :data="orderData" />
                    </div>
                </div>
                <!-- 通道信息 -->
                <div class="corridor-info">
                    <div class="corridor-num total-info">
                        <div class="name">通道统计：</div>
                        <div class="box">
                            <div class="nums">
                                <div
                                    class="num"
                                    v-for="(item, index) in totalCorridor"
                                    :key="index"
                                >{{ item }}</div>
                            </div>
                            <div class="unit">条</div>
                        </div>
                    </div>
                    <div class="corridor-items">
                        <div
                            v-for="(item, index) in channels"
                            :key="index"
                            @click="channelChange(index)"
                            :class="[{'active-item': activeChannelIndex === index}, 'item']"
                            v-show="index < 8"
                        >{{ item }}</div>
                        <div class="go-to-corridor-list">
                            <img src="@/assets/images/show/more-icon.png" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <footer>
            <img src="@/assets/images/show/bottom-banner.png" alt="footer-banner" />
        </footer>
    </div>
</template>

<script>
import channelMap from './chart/map'
import nodeRing from './chart/node'
import orderTotal from './chart/order'
import {
    apiQueryTransport,
    apiQueryOrder,
    apiQueryCustoms,
    apiQueryStation,
    apiQueryAisle
} from '@/api/home/mapHome'
export default {
    name: 'statistics',
    components: {
        channelMap,
        nodeRing,
        orderTotal
    },
    created () {
        this.getData()
    },
    data () {
        return {
            activeChannelIndex: 0,
            // 运输产品
            transportData: {
                columns: [],
                rows: []
            },
            // 场所产品
            placeData: {
                columns: [],
                rows: []
            },
            // 关务产品
            customsData: {
                columns: [],
                rows: []
            },
            // 订单
            orderData: {
                columns: [],
                rows: []
            },
            // 订单总数
            totalOrder: '',
            valueUnit: '',
            totalNumber: '',
            // 服务节点
            nodeData: {
                columns: [],
                rows: []
            },
            // 临时数据
            node: {
                columns: ['运输企业', '数量'],
                rows: [
                    { '运输企业': '空运', 数量: 10 },
                    { '运输企业': '海运', 数量: 20 },
                    { '运输企业': '铁运', 数量: 30 },
                    { '运输企业': '公路', 数量: 40 }
                ]
            },
            // 通道
            channels: ['新加波港口-上海-重庆-江津仓库', '新加波港口-上海-重庆-江津仓库', '新加波港口-上海-重庆-江津仓库'],
            totalCorridor: ''
        }
    },
    methods: {
        channelChange (index) {
            this.activeChannelIndex = index
        },
        getData () {
            // 获取运输产品数据
            apiQueryTransport().then(res => {
                let transportList = res.data.transportEntities || []
                transportList.forEach(element => {
                    this.transportData.rows.push({
                        'trspModeTranslate': element.trspModeTranslate,
                        'count': element.count
                    })
                })
                this.transportData.columns = [ 'trspModeTranslate', 'count' ]
            })
            // 场所产品
            apiQueryStation().then(res => {
                let placeList = res.data.stationEntitys || []
                placeList.forEach(element => {
                    this.placeData.rows.push({
                        'sttnTypeTranslate': element.sttnTypeTranslate,
                        'count': element.count
                    })
                })
                this.placeData.columns = [ 'sttnTypeTranslate', 'count' ]
            })
            // 关务产品
            apiQueryCustoms().then(res => {
                let customsList = res.data.customsEntities || []
                customsList.forEach(element => {
                    this.customsData.rows.push({
                        'ieflagTranslate': element.ieflagTranslate,
                        'count': element.count
                    })
                })
                this.customsData.columns = [ 'ieflagTranslate', 'count' ]
            })
            // 获取订单数据
            apiQueryOrder().then(res => {
                let orderList = res.data.orderEntities || []
                orderList.forEach(element => {
                    this.orderData.rows.push({
                        'cargoTypeTranslate': element.cargoTypeTranslate,
                        '数量': element.count
                    })
                })
                this.orderData.columns = [ 'cargoTypeTranslate', '数量' ]
                this.totalOrder = res.data.count + ''
            })
            // 获取通道的名称
            apiQueryAisle().then(res => {
                let aliasData = res.data || []
                let aliasList = []
                aliasData.forEach(item => {
                    let aliasArr = [ item.depart[0], item.depart[item.depart.length - 1] ]
                    let aliasStr = aliasArr.join("—//—")
                    aliasList.push(aliasStr)
                })
                this.channels = aliasList
                this.totalCorridor = aliasList.length + ''
            })
        },
        // 立即开始
        gotoLogin () {
            let user = JSON.parse(window.localStorage.getItem('user'))
            if (user === null) {
                this.$router.push('/login')
            } else {
                this.$router.push('/logisstics-commission/home')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
