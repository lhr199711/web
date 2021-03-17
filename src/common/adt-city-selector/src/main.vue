<template>
    <Cascader
        :data="cityData"
        :value="showData"
        clearable
        filterable
        :change-on-select="changeSelect"
        @on-change="onChange"
    />
</template>

<script>
import { apiCityDic } from '@/api/logisticsCommission'
export default {
    name: 'AdtCitySelector',
    props: {
        // 是~或者;连接的字符串
        defaultData: {
            type: String
        },
        changeSelect: {
            type: Boolean
        }
    },
    mounted () {
        this.getCity()
    },
    data () {
        return {
            cityData: [],
            showData: this.defaultData ? (this.defaultData.split('~').length > 1 ? this.defaultData.split('~') : this.defaultData.split(';')) : []
        }
    },
    watch: {
        defaultData (newVal) {
            this.showData = newVal ? (newVal.split('~').length > 1 ? newVal.split('~') : newVal.split(';')) : []
        }
    },
    methods: {
        // 初始化城市字典数据
        getCity () {
            apiCityDic().then(({ data }) => {
                this.cityData = this._processDr(data)
            })
        },
        // 处理级联城市
        _processDr (arr) {
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
        //发送事件
        onChange (val, selectData) {
            this.$emit('on-change', { value: val, data: selectData })
        }
    }
}
</script>
