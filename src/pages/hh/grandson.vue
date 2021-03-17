<template>
    <div class="child">
        <Form ref="formValidate" :model="formData" :rules="validateRules" @on-validate="submitChildFormDataToFather">
            <FormItem class="form-item" v-for="(item, index) in dynamicData" :key="index" :label="item.label" :prop="item.prop">
                <Input v-model="item.value" :maxlength="item.maxLength"></Input>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    // import mockData from './dictionary'
    import renderDataMixin from '@/mixins/renderDataMixin'
    import { getRules } from '@/libs/utils'
    export default {
        mixins: [renderDataMixin],
        props: {
            mockData: {
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                title: '动态加载数据'
            }
        },
        methods: {
            initData () {
                for (let data of this.mockData) {
                    this.validateRules[data.prop] = getRules(data)
                }
                this.formData = { ...this.mockData }
                this.dynamicData = this.mockData
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-item {
        margin-left: 20px;
    }
</style>
