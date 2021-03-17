<template>
    <div :class="cptClass2">
        <div :class="cptClass">
            <div class="route-item" v-for="(location, index) in cptData">
                <div class="route-text">{{ location.departurePortTranslate }}</div>
                <div class="icon-box">
                    <div class="card-way">
                        <svg class="icon lunchuan" aria-hidden="true">
                            <use
                                v-if="location.trspMode == '2'"
                                fill="#FFBB32"
                                xlink:href="#icon-feiji800"
                            />
                            <use
                                v-if="location.trspMode == '3'"
                                fill="#FFBB32"
                                xlink:href="#icon-huoche"
                            />
                            <use
                                v-if="location.trspMode == '4'"
                                fill="#FFBB32"
                                xlink:href="#icon-andaotongcaidanICON_huoche"
                            />
                            <use
                                v-if="location.trspMode == '1'"
                                fill="#FFBB32"
                                xlink:href="#icon-andaotongcaidanICON_lunchuan"
                            />
                        </svg>
                    </div>
                    <div class="card-line">
                        <svg v-if="isBig" class="icon1" aria-hidden="true">
                            <use
                                fill="#02ADB5"
                                xlink:href="#icon-andaotongcaidanICON_changjiantou_changjiantou"
                            />
                        </svg>
                        <svg v-if="!isBig" class="icon" aria-hidden="true">
                            <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou3" />
                        </svg>
                    </div>
                    <div
                        class="card-genre"
                    >{{ cargoTypeTranslate || location.logisticsTypeTranslate }}-{{ trspTypeTranslate || location.trspTypeTranslate }}</div>
                </div>
            </div>
        </div>
        <Button v-if="cptClass2 && status=='RECEIVE' && isRoles_m(['DIS']) && isFWSShow" @click="fwsok">确定服务商</Button>
    </div>
</template>

<script>
import authMixin from '@/mixins/authMixin'
export default {
    name: '',
    mixins: [authMixin],
    props: {
        lineHeaderData: {
            type: Array,
            default: () => {
                let arr = [
                    {
                        departurePort: '重庆',
                        destinationPort: '开州',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 1,
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '开州',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 2,
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '开州',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 3,
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '开州',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 4,
                    },
                    {
                        departurePort: '重庆',
                        destinationPort: '测试',
                        trspMode: '铁路',
                        cargoType: '普货',
                        logisticsType: '件杂货',
                        sort: 5,
                    },
                ]
                return arr
            },
        },
        isBig: {
            type: Boolean,
            default: true,
        },
        entrustCode: {
            type: String,
            default: '委托编号错误',
        },
        freightReqCode: {
            type: String,
            default: '',
        },
        logisticsSchemeCode: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            default: '父组件传过来的状态',
        },
        cargoTypeTranslate:{
            type:String,
            default:''
        },
        trspTypeTranslate:{
            type:String,
            default:''
        },
        isFWSShow:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    created() {
        // console.log(this.status)
        // console.log(111)
    },
    computed: {
        cptData() {
            let end = this.lineHeaderData[this.lineHeaderData.length - 1]
            let itemarr = [
                {
                    departurePortTranslate: end.destinationPortTranslate,
                },
            ]
            let list = this.lineHeaderData.concat(itemarr)
            return list
        },
        cptClass() {
            if (this.isBig) {
                return 'big-detail-box'
            }
            if (!this.isBig) {
                return 'mini-detail-box'
            }
        },
        cptClass2() {
            if (this.isBig) {
                return 'line-header-box'
            }
            if (!this.isBig) {
                return ''
            }
        },
    },
    created() {},
    mounted() {},
    methods: {
        fwsok() {
            this.$router.push({
                path:
                    '/logistics-solutions/determine-logistics-solution-service-provider',
                query: {
                    executoryEntrustCode: this.entrustCode,
                    logisticsSchemeCode: this.$route.query.logisticsSchemeCode,
                    freightReqCode: this.$route.query.freightReqCode,
                    routeList:JSON.stringify(this.lineHeaderData)
                },
            })
        },
    },
}
</script>

<style scoped lang="scss">
.line-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 46px;
    height: 100px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
}
.mini-detail-box {
    padding: 0px 20px;
    background: #f5f5f5;
    height: 76px;
    display: flex;
    align-items: center;
    overflow-x: auto;
    @extend %scrollbar-crosswise;
}
.big-detail-box {
    display: flex;
    align-items: center;
    overflow-x: auto;
    @extend %scrollbar-crosswise;
    // margin-bottom: 24px;
}
.route-item {
    display: flex;
    align-items: center;
    .route-text {
        font-size: 12px;
        // font-weight: bold;
        white-space: nowrap;
    }
    &:first-child {
        .route-text {
            font-size: 18px;
            font-weight: bold;
        }
    }
    &:last-child {
        .route-text {
            font-size: 18px;
            font-weight: bold;
            // color: #999;
        }
    }
    .icon-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        .card-way,
        .card-line {
            height: 10px;
        }
        .card-genre {
            height: 20px;
            color: $light-color;
            text-align: center;
            font-size: 12px;
            padding-top: 3px;
        }
        .icon1 {
            width: 210px;
            height: 20px;
        }
        .icon {
            width: 108px;
            height: 16px;
        }
        .lunchuan {
            width: 32px;
            height: 22px;
        }
    }
    &:last-child {
        .icon-box {
            display: none;
        }
    }
}
</style>
