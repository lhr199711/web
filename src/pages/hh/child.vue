<template>
    <div class="child">
        <Form ref="formValidate" :model="formData" :rules="validateRules" @on-validate="submitChildFormDataToFather">
            <FormItem class="form-item" v-for="(item, index) in dynamicData" :key="index" :label="item.label" :prop="item.prop">
                <Input v-if="item.type !== 'select'" v-model="formData[item.prop]" :maxlength="item.maxLength"></Input>
                <Select v-else v-model="formData[item.prop]">
                    <Option v-for="item in (optionsGather[item.prop + 'Options'])" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
        <grandson ref="childForm" @syncData="syncData" :mockData="toChildData"></grandson>
    </div>
</template>

<script>
    // import mockData from './dictionary'
    import renderDataMixin from '@/mixins/renderDataMixin'
    import { getRules } from '@/libs/utils'
    import grandson from './grandson'
    import dicData from './dic'
    export default {
        mixins: [renderDataMixin],
        components: {
            grandson
        },
        props: {
            // 父组件分发给子组件的数据
            mockData: {
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                toChildData: dicData,
                title: '动态加载数据',
                optionsGather: {}
            }
        },
        methods: {
            // 子组件数据发生改变，同步到父组件，并对数据进行组装，还要把数据同步到父组件
            syncData (childData) {
                this.formData = { ...this.formData, ...childData }
                // 把数据同步到父组件
                this.submitChildFormDataToFather()
            },
            initData () {
                // 动态生成校验规则
                for (let data of this.mockData) {
                    this.validateRules[data.prop] = getRules(data)
                    if (data.type === 'select') {
                        this.optionsGather[data.prop + 'Options'] = [
                            {
                                value: 'beijing',
                                label: '北京'
                            },
                            {
                                value: 'chongqing',
                                label: '重庆'
                            }
                        ]
                    }
                    console.log(this.optionsGather)
                }
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
