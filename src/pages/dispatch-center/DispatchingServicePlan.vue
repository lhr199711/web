<template>
    <div>
        <adt-logistics-route :logisticsRouteList="listData"></adt-logistics-route>
        <Alert class="alart-box" type="warning" show-icon>根据货运要求匹配的推荐物流服务方案请在详情内确认方案后推荐给销售！</Alert>
        <div class="btn-pagina">
            <span class="title">推荐物流服务方案</span>
            <adt-paginator class="pagination" :currentPage="~~page" :total="~~total" />
        </div>
        <div class="public-component-line"></div>
        <div class="public-list">
            <div class="public-component-card" v-for="(logistics, id) in listData" :key="id">
                <AdtListItem :logistics="logistics" @checkData="checkData">
                    <template slot="tab-title">
                        <span >货运要求编号:{{ logistics.logisticsPlanNumber }}</span>
                    </template>
                    <template slot="tab-operat">
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
                        <div class="card-route">
                            <div class="card-content" v-for="(location, index) in logistics.location">
                                <span class="card-outset">{{ location.city }}</span>
                                <div class="card-transit">
                                    <div class="card-way">
                                        <svg class="icon" aria-hidden="true">
                                            <use fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_huoche"></use>
                                        </svg>
                                    </div>
                                    <div class="card-line">
                                        <svg class="icon" aria-hidden="true">
                                            <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou3"></use>
                                        </svg>
                                    </div>
                                    <div class="card-genre">{{ location.type }}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template slot="tab-bottom">
                        <div class="card-bottom">
                            <span>时效: {{ logistics.time }}</span>
                            <span></span>
                            <span class="card-right">价格: {{ logistics.price }}</span>
                        </div>
                    </template>
                </AdtListItem>
            </div>
        </div>
    </div>
</template>

<script>
import paginator from '@/mixins/paginator'
import AdtLogisticsRoute from '@/components/adt-logistics-route/Index'
import AdtListItem from '@/components/adt-list-item/Index'
export default {
    mixins: [paginator],
    components: {
        AdtLogisticsRoute,
        AdtListItem
    },
    data() {
        return {
            search: {},
            auditStatusList: [
                {code: 'unreviewed', status: '未审核'},
                {code: 'stock', status: '未货好'},
                {code: 'progress', status: '执行中'}
            ],
            enableStatusList: [
                {code: 'unreviewed', status: '已启用'},
                {code: 'stock', status: '未启用'},
                {code: 'progress', status: '已启用'}
            ],
            listData: [
                {
                    statusCode: 'disagree',
                    status: '需求未同意',
                    logisticsPlanNumber: '物流方案编号1',
                    time: '时效',
                    price: '价格',
                    location: [
                        {
                            city: '重庆1',
                            transport: '空运',
                            type: '国内集装箱'
                        },
                        {
                            city: '香港',
                            transport: '空运',
                            type: '国内集装箱'
                        },
                        {
                            city: '纽约',
                            transport: '空运',
                            type: '国内集装箱'
                        }
                    ]
                },
                {
                    statusCode: 'agree',
                    status: '方案已同意',
                    logisticsPlanNumber: '物流方案编号2',
                    time: '时效',
                    price: '价格',
                    location: [
                        {
                            city: '重庆2',
                            transport: '空运',
                            type: '国内集装箱'
                        },
                        {
                            city: '香港',
                            transport: '空运',
                            type: '国内集装箱'
                        },
                        {
                            city: '纽约',
                            transport: '空运',
                            type: '国内集装箱'
                        }
                    ]
                },
                {
                    statusCode: 'refuse',
                    status: '已拒绝',
                    logisticsPlanNumber: '物流方案编号3',
                    time: '时效',
                    price: '价格',
                    location: [
                        {
                            city: '重庆3',
                            transport: '空运',
                            type: '国内集装箱'
                        },
                        {
                            city: '香港',
                            transport: '空运',
                            type: '国内集装箱'
                        },
                        {
                            city: '纽约',
                            transport: '空运',
                            type: '国内集装箱'
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        dataInit () {
            this.getData()
        },
        getData () {},
        add () {
            this.isModalShow = true
        },
        searchChange () {},
        checkData (data, status) {
            console.log(data, status)
        },
        edit (val) {
            console.log(val)
        },
        detail (val) {},
        remove (val) {}
    },
}
</script>

<style lang="scss" scoped>
.alart-box{
    margin-top: 10px;
}
.search-condition{
    display: flex;
    span{
    min-width: 70px;
    line-height: 30px;
}
}
.line-margin {
    margin-left: 30px;
}
.icon-action{
    margin: 0 10px;
}
.btn-pagina{
    display: flex;
    padding: 20px 0 0 0;
    .title{
        font-size: $font-size-large;
        font-family: Microsoft YaHei;
        font-weight: 400;
        width: 50%;
    }
}
</style>
