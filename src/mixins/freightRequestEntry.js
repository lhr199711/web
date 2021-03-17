import { _handelDir } from '@/libs/utils'
import { apiGenerateRoute } from '@/api/freight'
export default {
    data () {
        return {
            // 上面的数据
            transitModal: {
                // 启运地
                custStartPlace: '',
                custStartPlace1: '',
                // 目的地
                custEndPlace: '',
                custEndPlace1: '',
                // 中转地
                custTransitPlace: '',
                custTransitPlace1: '',
                // 货物类型
                cargoType: '',
                // 物流类型
                logisticsType: '',
                // 运输类型
                trspType: '',
                // 备注
                freightBrief: ''
            },
            // 路线data
            pathData: [],
            // 启运地提示
            startHintShow: false,
            // 目的地提示
            endHintShow: false,
            // 拿到的选择的城市
            startCity: '',
            startCityCode: '',
            endCity: '',
            endCityCode: '',
            custTransitCity: '',
            custTransitCityCode: '',
            // 拿到的场所的东西先存起来
            startSite: '',
            startSiteCode: '',
            endSite: '',
            endSiteCode: '',
            custTransitSite: '',
            custTransitSiteCode: '',
            typeShowSizeType: '',
            contaShow: true,
            contaNodeShow: true
        }
    },
    watch: {
        startPlaceCode: {
            handler (newVal) {
                if (newVal.length === 0) {
                    this.startHintShow = true
                } else {
                    this.startHintShow = false
                }
            },
            deep: true
        },
        endPlaceCode: {
            handler (newVal) {
                if (newVal.length === 0) {
                    this.endHintShow = true
                } else {
                    this.endHintShow = false
                }
            },
            deep: true
        }
    },
    methods: {
        // 运输下面的
        trspTypeChange (value, list, index) {
            console.log(value, index)
            // 如果件杂货隐藏集装箱的字段
            if (value === 'B') {
                console.log(list)
                list.serverParam.contaShow = false
            } else {
                list.serverParam.contaShow = true
            }
        },
        // 节点下面的
        trspTypeNodeChange (value, list, index) {
            if (value === 'B') {
                list.serverParam.contaNodeShow = false
            } else {
                list.serverParam.contaNodeShow = true
            }
        },
        // 货物类型选择的是
        cargoTypeChange (value) {
            console.log(this.contaSizeType)
            this.typeShowSizeType = value
        },
        // 如果为恒温集装箱不能选择45的集装箱尺寸类型
        contaSizeTypeChange (value) {
            if (value) {
                if (this.typeShowSizeType === 'C') {
                    for (let i = 0; i < this.contaSizeType.length; i++) {
                        if ((this.contaSizeType[i].dictionaryValue).indexOf('45GP') > -1) {
                            this.contaSizeType.splice(i, 1)
                        }
                    }
                } else {
                    for (let i = 0; i < this.contaSizeType.length; i++) {
                        // 不存在
                        if ((this.contaSizeType[i].dictionaryValue).indexOf('45GP') === -1) {
                            this.contaSizeType = this.$getDictionary('CONTAINER_SIZE_TYPE')
                        }
                    }
                }
            }
        },
        // 生成路线，弹出
        createPathClick () {
            const data = {
                startPlace: this.startPlaceCode,
                endPlace: this.endPlaceCode,
                ctransitPlace: this.ctransitPlaceCode
            }
            if (this.startPlaceCode.length === 0) {
                this.startHintShow = true
                return
            }
            if (this.endPlaceCode.length === 0) {
                this.endHintShow = true
                return
            }
            // 先调用生成路线的接口，拿到路线，选择后展示在页面上
            if (this.$refs.formValidate) {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        apiGenerateRoute({ data }).then(res => {
                            this.pathDataValue = res.data
                            this.isPathModalShow = true
                        })
                    }
                })
            } else {
                apiGenerateRoute({ data }).then(res => {
                    this.pathDataValue = res.data
                    this.isPathModalShow = true
                })
            }
        },
        // 拿到启运地的场景字典
        async handelDirStart (data) {
            if (data.data.length !== 0) {
                const arr = await _handelDir(data.value)
                this.custStartPlace = arr
                this.startCity = data.data[data.data.length - 1].label
                this.startCityCode = data.data[data.data.length - 1].__value.split(',').join(';')
            }
        },
        // 拿到中转地的场景字典
        async handelDirTrsspmPort (data) {
            if (data.data.length !== 0) {
                const arr = await _handelDir(data.value)
                this.custTransitPlace = arr
                this.custTransitCity = data.data[data.data.length - 1].label
                this.custTransitCityCode = data.data[data.data.length - 1].__value.split(',').join(';')
            }
        },
        // 拿到目的地的场景字典
        async handelDirEnd (data) {
            if (data.data.length !== 0) {
                const arr = await _handelDir(data.value)
                this.custEndPlace = arr
                this.endCity = data.data[data.data.length - 1].label
                this.endCityCode = data.data[data.data.length - 1].__value.split(',').join(';')
            }
        },
        okPlace () {
            if (this.startPlace.length >= 3) {
                this.placeDepartureText = '最多只能添加3个启运地'
                this.isPlaceDepartureModal = true
                return
            }
            // 如果场所为空，就推入城市
            if (this.startSite.length === 0) {
                this.startPlace.push(this.startCity)
                // 拿到选择的城市展示的code
                this.startPlaceCode.push(this.startCityCode)
            }
            // 选择了场所才推入场所
            if (this.startSite.length !== 0) {
                this.startPlace.push(this.startSite)
                this.startPlaceCode.push(this.startSiteCode)
            }
            this.startPlace = [...new Set(this.startPlace)]
            this.startPlaceCode = [...new Set(this.startPlaceCode)]
            // 刚开始会有空的，截取出去
            if (this.startPlace.indexOf('') === 0) {
                this.startPlace.splice(0, 1)
            }
            if (this.startPlaceCode.indexOf('') === 0) {
                this.startPlaceCode.splice(0, 1)
            }
        },
        okEndPlace () {
            if (this.endPlace.length >= 3) {
                this.placeDepartureText = '最多只能添加3个目的地'
                this.isPlaceDepartureModal = true
                return
            }
            // 如果场所为空，就推入城市
            if (this.endSite.length === 0) {
                this.endPlace.push(this.endCity)
                // 拿到选择的城市展示的code
                this.endPlaceCode.push(this.endCityCode)
            }
            // 选择了场所才推入场所
            if (this.endSite.length !== 0) {
                this.endPlace.push(this.endSite)
                this.endPlaceCode.push(this.endSiteCode)
            }
            this.endPlace = [...new Set(this.endPlace)]
            this.endPlaceCode = [...new Set(this.endPlaceCode)]
            if (this.endPlace.indexOf('') === 0) {
                this.endPlace.splice(0, 1)
            }
            if (this.endPlaceCode.indexOf('') === 0) {
                this.endPlaceCode.splice(0, 1)
            }
        },
        okCustTransitPlace () {
            if (this.ctransitPlace.length >= 5) {
                this.placeDepartureText = '最多只能添加5个中转地'
                this.isPlaceDepartureModal = true
                return
            }
            // 如果场所为空，就推入城市
            if (this.custTransitSite.length === 0) {
                this.ctransitPlace.push(this.custTransitCity)
                // 拿到选择的城市展示的code
                this.ctransitPlaceCode.push(this.custTransitCityCode)
            }
            // 选择了场所才推入场所
            if (this.custTransitSite.length !== 0) {
                this.ctransitPlace.push(this.custTransitSite)
                this.ctransitPlaceCode.push(this.custTransitSiteCode)
            }
            this.ctransitPlace = [...new Set(this.ctransitPlace)]
            this.ctransitPlaceCode = [...new Set(this.ctransitPlaceCode)]
            if (this.ctransitPlace.indexOf('') === 0) {
                this.ctransitPlace.splice(0, 1)
            }
            if (this.ctransitPlaceCode.indexOf('') === 0) {
                this.ctransitPlaceCode.splice(0, 1)
            }
        },
        // 中转地过多弹框
        visibleChange (changeStatus) {
            this.isTransitModal = changeStatus
        },
        // 启运地目的地过多弹款
        visiblePlaceDeparture (changeStatus) {
            this.isPlaceDepartureModal = changeStatus
        },
        // 选择附加任务
        visibleChangeSelect (changeStatus) {
            this.isModalShow = changeStatus
        },
        // 选择路线
        visibleChangePath (changeStatus) {
            this.isPathModalShow = changeStatus
        },
        // 中转地的场所
        onSiteChange (val) {
            if (val) {
                const code = val.split('-')[0]
                const value = val.split('-')[1]
                this.custTransitSite = value
                this.custTransitSiteCode = code
            }
        },
        // 启运地
        onPlaceChange (val) {
            if (val) {
                const code = val.split('-')[0]
                const value = val.split('-')[1]
                this.startSite = value
                this.startSiteCode = code
            }
        },
        // 目的地的场所
        onEndPlaceChange (val) {
            if (val) {
                const code = val.split('-')[0]
                const value = val.split('-')[1]
                this.endSite = value
                this.endSiteCode = code
            }
        },
        onPlaceClear () {
            this.startSite = ''
            this.startSiteCode = ''
        },
        onEndClear () {
            this.endSite = ''
            this.endSiteCode = ''
        },
        onSiteClear () {
            this.custTransitSite = ''
            this.custTransitSiteCode = ''
        },
        delTransit (index) {
            this.ctransitPlace.splice(index, 1)
            this.ctransitPlaceCode.splice(index, 1)
        },
        delPlaceDeparture (index) {
            this.startPlace.splice(index, 1)
            this.startPlaceCode.splice(index, 1)
        },
        delCustEndPlace (index) {
            this.endPlace.splice(index, 1)
            this.endPlaceCode.splice(index, 1)
        }
    }
}
