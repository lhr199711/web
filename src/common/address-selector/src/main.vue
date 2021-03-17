<template>
    <Cascader
        v-model="address"
        :data="data"
        :load-data="loadAddress"
        :disabled="isDisabled"
        :clearable="clearable"
        :style="{ width: width + 'px' }"
        class="holder"
        @on-change="selected" />
</template>

<script>
export default {
    name: 'AddressSelector',
    props: {
        clearable: {
            default: false
        },
        value: {
            default () {
                return []
            }
        },
        isDisabled: Boolean,
        width: {
            default: 220
        }
    },
    model: {
        event: 'change',
        props: 'value'
    },
    data () {
        return {
            data: [],
            address: this.value
        }
    },
    watch: {
        address (to) {
            this.$emit('change', to)
        },
        value (to) {
            this.address = to
        }
    },
    methods: {
        loadAddress (item, callback) {
            item.loading = true
            const data = {
                addressParent: item.addressCode
            }
            apiGetDictionaryAddress({data: data}).then(res => {
                if (res.data.length && res.data.length > 0) {
                    item['children'] = res.data.map(unit => {
                        unit['value'] = unit.addressCode
                        unit['label'] = unit.addressName
                        if (unit.hasChildAddress) {
                            unit['children'] = []
                            unit['loading'] = false
                        }
                        return unit
                    })
                }
                item.loading = false
                callback()
            })
        },
        selected (val, selectData) {
            this.$emit('getFullData', { value: val, data: selectData })
        }
    }
}
</script>

<style scoped>
.holder {
    display: inline-block;
}
</style>
