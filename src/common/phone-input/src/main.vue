<template>
    <div class="phone-input-wrap">
        <Select v-model="prefixCode" class="prefix-wrap" placeholder :disabled="disabled">
            <Option v-for="(item, index) in prefixList" :value="item" :key="index">{{ item }}</Option>
        </Select>
        <Input v-model="suffixCode" :disabled="disabled" :maxlength="11" :style="{width: `${width}px`}"/>
    </div>
</template>

<script>
import prefixData from './data.js'
export default {
    name: 'PhoneInput',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        suffix: {
            type: [String, Number],
            default: ''
        },
        prefix: {
            default: ''
        },
        width: {
            type: [String, Number],
            default: 210
        }
    },
    mounted() {
        this.prefixCode = this.prefixCode ? this.prefixCode : '+86'
    },
    data() {
        return {
            prefixList: prefixData,
            prefixCode: this.prefix,
            suffixCode: this.suffix
        }
    },
    watch: {
        suffix(to, from) {
            this.suffixCode = to
        },
        prefix(to, from) {
            this.prefixCode = to
        },
        prefixCode(to, from) {
            this.$emit('prefixChange', to ? to : '+86')
        },
        suffixCode(to, from) {
            this.$emit('suffixChange', to)
        }
    }
}
</script>

<style lang="scss" scoped>
.phone-input-wrap {
    display: inline-block;

    .prefix-wrap {
        width: 80px;
        margin-right: 4px;
    }
}
</style>
