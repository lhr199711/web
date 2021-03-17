/* eslint-disable */
import { apiDictionaryQueryByCacheTypeKey } from '@/api/dictionary'
import { apiGetEntrustCargo } from '@/api/logisticsCommission'
import { apiCityDic } from '@/api/logisticsCommission'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
    data() {    
        return {
            //城市
            cityList:[],
            //包装类型
            packTypeList: [],
            //货物类型
            cargoTypeList: [],
            //运输方式
            trspModeList: [],
            //订单状态
            orderStatusList: [],
            //货物信息对象
            goodsObj: {},
            //货物信息表de名称
            goodsNameList: []
        }
    },
    watch: {},
    computed: {
        ...mapGetters("logisticsCommission", ["LawCallback"])
    },
    methods: {
        handel_orderStatusList_m() {
            apiDictionaryQueryByCacheTypeKey({
                dictionaryTypeKey: 'ORDER_STATUS'
            }).then(({ data }) => {
                let newData = data.map(item => {
                    return {
                        value: item.dictionaryKey,
                        label: item.dictionaryValue
                    }
                })
                this.orderStatusList = newData
            })
        },
        handel_packTypeList_m() {
            apiDictionaryQueryByCacheTypeKey({
                dictionaryTypeKey: 'PACKAGE_TYPE'
            }).then(({ data }) => {
                let newData = data.map(item => {
                    return {
                        value: item.dictionaryKey,
                        label: item.dictionaryValue
                    }
                })
                this.packTypeList = newData
            })
        },

        handel_cargoTypeList_m() {
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
        },
        handel_trspModeList_m() {
            apiDictionaryQueryByCacheTypeKey({
                dictionaryTypeKey: 'TRANSPORT_MODE'
            }).then(({ data }) => {
                let newData = data.map(item => {
                    return {
                        value: item.dictionaryKey,
                        label: item.dictionaryValue
                    }
                })
                this.trspModeList = newData
            })
        },
        handel_goodsNameList_m() {
            // 查询货物信息表
            console.log(this.LawCallback.huhai)
            apiGetEntrustCargo({ entrustCode: this.LawCallback.entrustCode }).then(
                ({ data }) => {
                    this.goodsNameList = Object.keys(data)
                    this.goodsObj = data
                }
            )
        },
        //搜索包装信息
        handelSearch_m(name, index) {
            let obj = this.goodsObj[name]
            let { getEntrustPackagingListRes, ...data } = obj
            let info1 = {}
            let info2 = {}
            if (getEntrustPackagingListRes.length > 0) {
                let one = getEntrustPackagingListRes.find(item => item.packPcode == '0')
                info1 = {
                    grossWeight0: one.grossWeight, //包装毛重 数字
                    netWeight0: one.netWeight, //包装净重 数字
                    packPcode0: '0', //包装上级编码 0/1
                    packQty0: one.packQty, //包装件数 数字
                    packType0: one.packType, //包装类型
                    packVol0: one.packVol //包装体积
                }
            }
            if (getEntrustPackagingListRes.length > 1) {
                let two = getEntrustPackagingListRes.find(item => item.packPcode !== '0')
                info2 = {
                    grossWeight1: two.grossWeight, //包装毛重 数字
                    netWeight1: two.netWeight, //包装净重 数字
                    packPcode1: '1', //包装上级编码 0/1
                    packQty1: two.packQty, //包装件数 数字
                    packType1: two.packType, //包装类型
                    packVol1: two.packVol //包装体积
                }
            }
            let newObj = {
                ...this.list[index],
                ...info1,
                ...info2,
                ...data
            }
            this.$set(this.list, index, newObj)
        },
        //处理时间
        moment_time_m(time) {
            return moment(time).format('YYYY-MM-DD')
        },

        // 初始化城市字典数据
        getCity_m() {
            apiCityDic().then(({ data }) => {
                this.cityList = this._processDr(data)
            })
        },
        // 处理级联城市
        _processDr(arr) {
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
    },
}
