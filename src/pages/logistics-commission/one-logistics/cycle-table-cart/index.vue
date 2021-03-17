<template>
    <div class="public-table-cart-boxjz">
        <div class="card-item" v-for="(cart,index) in tableList" :key="index">
            <div class="cart-itemjz">
                <div class="title">
                    <div class="l">
                        <span>合同委托编号：{{ cart.entrustCode }}</span>
                        <span>{{ cart.entrustStatusTranslate }}</span>
                    </div>
                    <div class="r">
                        <div class="num-box">
                            <div class="h-item">
                                <span>合同总量：</span>
                                <span>{{cart.cargoTotal}}KG</span>
                            </div>
                            <div class="h-item">
                                <span>已交付总量：</span>
                                <span>{{cart.deliveredWeight}}KG</span>
                            </div>
                            <div class="h-item">
                                <span>未启运总量：</span>
                                <span>{{cart.noPlaceWeight}}KG</span>
                            </div>
                        </div>
                        <Dropdown>
                            <span style="cursor: pointer;">查看详情</span>
                            <Icon type="ios-arrow-down"></Icon>
                            <DropdownMenu slot="list">
                                <DropdownItem>
                                    <span @click="seeDetail(cart)">查看详情</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div class="public-line1jz" style="margin:6px 0"></div>
                <line-header :lineHeaderData="cart.location" :isBig="false" :cargoTypeTranslate="cart.cargoTypeTranslate" :trspTypeTranslate="cart.trspTypeTranslate"></line-header>
                <div class="btm">
                    <div class="l">合同编号: {{ cart.contractCode }}</div>
                    <div class="r">合同有效期: {{moment_time_m(cart.startPeriod)}} -- {{ moment_time_m(cart.untilPeriod) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import lineHeader from '../../one-logistics/line-header/index'
import dictionaryList from '@/mixins/dictionaryList'

export default {
    name: 'cycle-table-cart',
    mixins:[dictionaryList],
    props: {
        tableList: {
            type: Array,
            default() {
                return []
            },
        },
    },
    components: {
        lineHeader,
    },
    data() {
        return {}
    },
    created() {},
    mounted() {},
    methods: {
        // 查看详情
        seeDetail(val) {
            // 跳转到周期的详情
            this.$router.push({
                path: '/logisstics-commission/cycleDetail',
                query: {
                    entrustCode: val.entrustCode,
                    executoryEntrustCode: val.executoryEntrustCode,
                    entrustExecutoryStatus:val.entrustStatus,
                    cargoTypeTranslate: val.cargoTypeTranslate,
                    trspTypeTranslate: val.trspTypeTranslate,
                    lineHeaderData: JSON.stringify(val.location),
                    logisticsSchemeCode: val.logisticsSchemeCode,
                    freightReqCode: val.freightReqCode,
                }
            })
        },
    },
}
</script>

<style scoped lang="scss">
.card-botton-box-bj {
    background: #f5f5f5;
    .card-botton-box {
        height: 40px;
        line-height: 40px;
        margin: 0 18px;
        border-top: #999999 dashed 1px;
        display: flex;
        justify-content: space-between;
    }
}
.public-table-cart-boxjz {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .card-item {
        width: 100%;
        // height: 221px;
        background: rgba(255, 255, 255, 1);
        // box-shadow: 0px 6px 14px 0px rgba(51, 51, 51, 0.1);
        border-radius: 2px;
        margin-bottom: 20px;
    }
    .card-item:hover{
        box-shadow: 0px 6px 14px 0px rgba(51, 51, 51, 0.1);
    }
    .cart-itemjz {
        // width: 496px;
        // height: 177px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 14px 0px rgba(51, 51, 51, 0.1);
        border-radius: 2px;
        padding: 20px;
        .title {
            display: flex;
            justify-content: space-between;
            .l {
                span {
                    &:nth-child(1) {
                        padding-right: 20px;
                    }
                    &:nth-child(2) {
                        width: 43px;
                        height: 16px;
                        border: 1px solid rgba(2, 173, 181, 1);
                        border-radius: 4px;
                        color: rgba(2, 173, 181, 1);
                        font-size: 12px;
                    }
                }
            }
            .r {
                display: flex;
                align-items: center;
                .num-box {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    .h-item {
                        background: #f9f9f9;
                        font-size: 14px;
                        font-weight: bold;
                        color: rgba(102, 102, 102, 1);
                        line-height: 21px;
                        padding: 0 20px;
                        margin-right: 15px;
                        &:nth-child(1) {
                            border-left: 2px solid #53acff;
                        }
                        &:nth-child(2) {
                            border-left: 2px solid #02adb5;
                        }
                        &:nth-child(3) {
                            border-left: 2px solid #fcc163;
                        }
                        &:nth-child(4) {
                            border-left: 2px solid #ff0000;
                        }
                    }
                }
            }
        }
        .main {
            margin-top: 4px;
            width: 455px;
            height: 80px;
            background: rgba(249, 249, 249, 1);
            border-radius: 4px;
            padding: 10px;
            .title {
                .r {
                    display: flex;
                    align-items: center;
                    .huo_che,
                    .lun_chuan {
                        width: 22px;
                        height: 22px;
                    }
                }
            }
            .item-main {
                display: flex;
                align-items: center;
                padding: 6px 0;
                .txt {
                    max-width: 154px;
                    font-size: 20px;
                    color: rgba(51, 51, 51, 1);
                    line-height: 28px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .jiantou {
                    width: 76px;
                    color: $light-color;
                }
            }
        }
        .btm {
            display: flex;
            justify-content: space-between;
            padding: 6px 10px 0px 10px;
        }
    }
}
</style>
