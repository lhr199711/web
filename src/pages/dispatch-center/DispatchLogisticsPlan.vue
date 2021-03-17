<template>
    <div>
        <adt-search-folder
            :searchRouter="{query: {accountName: search.accountName, organizationId: search.organizationId, phoneNumber: search.phoneNumber}}"
            :isStatus="true">
            <template slot="status">
                <div class="status">
                    <div class="status-left">
                        <p>货运要求状态:</p>
                        <span v-for="(status, id) in auditStatusList" :key="id" @click="auditStatus(id)" :class="{'click-status': auditStatusNum == id}">
                            {{status.status}}
                        </span>
                    </div>
                </div>
            </template>
            <template slot="always-show">
                <div class="public-transit">
                    <Form ref="formInline" :model="formInline" inline label-colon>
                        <FormItem label="启运地">
                            <Input type="text" v-model="formInline.name">
                            </Input>
                        </FormItem>
                        <FormItem label="目的地">
                            <Input type="text" v-model="formInline.name">
                            </Input>
                        </FormItem>
                        <FormItem label="中转地" class="select-transit">
                            <Select
                                v-model="formInline.transit"
                                filterable
                                remote
                                :remote-method="transitRemote"
                                :loading="transitLoading"
                                @on-select="onChangeClick">
                                <Option v-for="(option, index) in transitData" :value="option.value" :key="index">{{option.label}}</Option>
                            </Select>
                            <p class="select-value">
                                <span v-for="(value, index) in transitSelect" :key="index">{{value}}<Icon type="ios-close-circle" @click="delTransit(index)"/></span>
                            </p>
                        </FormItem>
                        <FormItem label="合同号">
                            <Input type="text" v-model="formInline.name">
                            </Input>
                        </FormItem>
                        <FormItem label="运输方式">
                            <Select v-model="formInline.type" clearable>
                                <Option v-for="(item, index) in type" :key="index" :value="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </template>
        </adt-search-folder>
        <div class="btn-pagina">
            <span class="title">推荐物流服务方案</span>
            <adt-paginator class="pagination" :currentPage="~~page" :total="~~total" />
        </div>
        <div class="public-component-line"></div>
        <div class="public-list">
            <Col class="public-component-card" span="24" v-for="(product, key) in listData" :key="key">
                <adt-list-item :data="product" :showCheckbox="false" @checkData="checkData">
                    <template slot="tab-title">
                        <span>货运要求编号:{{ product.logisticsPlanNumber }}</span>
                    </template>
                    <template slot="tab-operat">
                        <span :class="{'card-status-success': product.statusCode == 'disagree', 'card-status-error': product.statusCode == 'refuse', 'card-status': product.statusCode == 'agree' }">{{ product.status }}</span>
                        <Poptip placement="right-start" class="card-icon">
                            <span>编辑计划</span>
                            <Icon type="md-arrow-dropdown" />
                            <div class="card-poptip-font" slot="content">
                                <div @click="edit(product)">编辑</div>
                                <div @click="detail(product)">详情</div>
                                <div @click="remove(product)" class="failure">删除</div>
                            </div>
                        </Poptip>
                    </template>
                    <template slot="tab-content">
                        <div class="tab-content">
                            <div class="path-data">
                                <p class="path-content" v-for="(item, key) of list" :key="key">
                                    <span class="path-name">{{item}}</span>
                                    <span class="icon-font">
                                        <svg class="iconfont icon-train" aria-hidden="true">
                                            <use xlink:href="#icon-andaotongcaidanICON_huoche"></use>
                                        </svg>
                                        <small>国际贸易</small>
                                        <svg class="iconfont icon-arrows" aria-hidden="true">
                                            <use xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                                        </svg>
                                    </span>
                                </p>
                            </div>
                            <div class="plan-time">
                                <p class="time-title">计划时间：</p>
                                <p class="time-content">
                                    <span><small>始</small>2020/06/20</span>
                                </p>
                                <p class="time-content">
                                    <span><small>始</small>2020/06/20</span><br>
                                    <span><small>到</small>2020/06/20</span>
                                </p>
                                <p class="time-content">
                                    <span><small>始</small>2020/06/20</span><br>
                                    <span><small>到</small>2020/06/20</span>
                                </p>
                                <p class="time-content">
                                    <span><small>始</small>2020/06/20</span><br>
                                    <span><small>到</small>2020/06/20</span>
                                </p>
                                <p class="time-content">
                                    <span><small>始</small>2020/06/20</span><br>
                                    <span><small>到</small>2020/06/20</span>
                                </p>
                                <p class="time-content">
                                    <span><small>始</small>2020/06/20</span><br>
                                    <span><small>到</small>2020/06/20</span>
                                </p>
                                <p class="time-content">
                                    <span><small>始</small>2020/06/20</span><br>
                                    <span><small>到</small>2020/06/20</span>
                                </p>
                            </div>
                        </div>
                    </template>
                    <template slot="tab-bottom">
                        <div class="tab-bottom">
                            <Row>
                                <Col span="8">合同号：DHKGDAV</Col>
                                <Col span="8">订舱号：JHKHHDA</Col>
                                <Col span="8" style="textAlign:right">提运单号：GJSQGYQFS</Col>
                            </Row>
                        </div>
                    </template>
                </adt-list-item>
            </Col>
        </div>
    </div>
</template>

<script>
import paginator from '@/mixins/paginator'
import AdtListItem from '@/components/adt-list-item/Index'
export default {
    mixins: [paginator],
    components: {
        AdtListItem
    },
    data() {
        return {
            search: {},
            formInline: {
                name: '',
                type: '',
                transit: '',
                age: '',
                type: ''
            },
            type: [
                {value: '空运', label: '空运'},
                {value: '火车', label: '火车'},
                {value: '顺丰', label: '顺丰'}
            ],
            list: ['加拿大', '北级', '北京', '加州','哈尔滨', '邯郸', '韩国'],
            auditStatusNum: '默认值',
            auditStatusList: [
                {code: 'unreviewed', status: '未审核'},
                {code: 'stock', status: '未货好'},
                {code: 'progress', status: '执行中'},
                {code: 'unreviewed', status: '未审核'},
                {code: 'stock', status: '未货好'},
                {code: 'progress', status: '执行中'},
                {code: 'unreviewed', status: '未审核'},
                {code: 'stock', status: '未货好'},
                {code: 'progress', status: '执行中'},
                {code: 'unreviewed', status: '未审核'},
                {code: 'stock', status: '未货好'},
                {code: 'progress', status: '执行中'}
            ],
            transitModal: '',
            transitLoading: false,
            transitData: [],
            transitSelect: [],
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
        auditStatus (index) {
            // 控制状态切换传值
            this.auditStatusNum = index
        },
        transitRemote (val) {
            if (val !== '') {
                this.transitLoading = true
                setTimeout(() => {
                    this.transitLoading = false
                    const list = this.list.map(item => {
                        return {
                            value: item,
                            label: item
                        }
                    })
                    this.transitData = list.filter(item => item.label.toLowerCase().indexOf(val.toLowerCase()) > -1)
                }, 200)
            } else {
                this.transitData = []
            }
        },
        delTransit (index) {
            this.transitSelect.splice(index, 1)
        },
        onChangeClick(val) {
            if(this.transitSelect.length >= 5) {
                console.log('不能超过5个中转地')
                return
            }
            this.transitSelect.push(val.value)
        },
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
.min-width {
    span{
        width: 60px!important;
    }
    .ivu-input-wrapper{
        width: 60%;
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
.public-component-card{
    width: 100%!important;
}
.tab-content{
    position: relative;
    overflow-x: auto;
    white-space: nowrap;
    .plan-time{
        margin: 0 10px;
        font-size: 12px;
        p{
            display: inline-block;
            vertical-align: top;
        }
        .time-content{
            width: 260px;
            &:last-child{
                width: 120px;
            }
        }
    }
    .path-data{
        margin: 6px 20px;
        .path-content{
            display: inline-block;
            vertical-align: middle;
            line-height: 61px;
            border-bottom: 1px dashed #e5e5e5;
            &:last-child{
                margin-right: 20px;
            }
            .icon-font{
                display: inline-block;
            }
            .icon-train{
                color: $warning-color;
                font-size: 24px;
                vertical-align: middle;
            }
            .icon-arrows{
                color: #1eafb7;
                font-size: 60px;
                vertical-align: middle;
            }
            small{
                color: #1eafb7;
                padding: 0 4px;
            }
            &:last-child .icon-font{
                display: none;
            }
            &:first-child span{
                font-size: 16px;
                color: #343434;
            }
            &:last-child span{
                font-size: 16px;
                color: #343434;
            }
            .path-name{
                display: inline-block;
                vertical-align: middle;
                width: 120px;
                text-align: center;
            }
            .account-tag{
                font-size: 40px;
                color: #1eafb7;
                vertical-align: middle;
            }
        }
    }
}
</style>
