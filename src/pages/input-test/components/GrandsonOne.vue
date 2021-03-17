<template>
    <div class="child">
        <Form ref="formValidate"
              :model="formData"
              :rules="validateRules"
              @on-validate="submitChildFormDataToFather()">
            <div class="module">
                <h1>我是grandsonOne1111</h1>
                <ul>
                    <li v-for="(element, index) in dynamicData"
                        :key="index"
                        v-show="element.isShow">

                        <!-- 单选select -->
                        <template v-if="element.type == 'select'">
                            <FormItem class="form-item"
                                      style="width:100%"
                                      :label="element.label"
                                      :prop="element.name">
                                <Select v-model.trim="formData[element.name]">
                                    <Option v-for="item in optionsGather.edcation"
                                            :value="item.value"
                                            :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </template>
                        <!-- input框 + 后面单位select框 -->
                        <template v-if="element.type == 'input'">
                            <FormItem class="form-item"
                                      :label="element.label"
                                      :prop="element.name">
                                <Input v-model.trim="formData[element.name]"
                                       :maxlength="element.maxLength"
                                       @on-change="handleEffectOtherTemplate(element.relevancyInfo, element.name)"></Input>
                            </FormItem>
                            <FormItem class="form-item"
                                      :label="dynamicData[index+1].label"
                                      :prop="dynamicData[index+1].name"
                                      v-if="dynamicData[index+1].type == 'unit'">
                                <Select v-model.trim="formData[dynamicData[index+1].name]">
                                    <Option v-for="item in optionsGather.edcation"
                                            :value="item.propertyCode"
                                            :key="item.id">{{ item.propertyName }}</Option>
                                </Select>
                            </FormItem>
                        </template>

                        <!-- 多选框 -->
                        <template v-if="element.type == 'checkbox'">
                            <FormItem class="form-item"
                                      :label="element.label"
                                      :prop="element.name">
                                <CheckboxGroup v-model.trim="formData[element.name]"
                                               v-if="optionsGather.hobbyBox">
                                    <Checkbox v-for="(boxItem, index) in optionsGather.hobbyBox"
                                              :key="index"
                                              :label="boxItem.value">{{boxItem.label}}</Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                        </template>

                        <!-- 日期控件 -->
                        <template v-if="element.type == 'date'">
                            <FormItem class="form-item"
                                      :label="element.label"
                                      :prop="element.name">
                                <DatePicker v-model.trim="formData[element.name]"
                                            :type="element.dateTimeType"
                                            placeholder="请选择日期"
                                            style="width: 100%"></DatePicker>
                            </FormItem>
                        </template>

                        <!-- 地址选择 -->
                        <!-- <template v-if="element.type == 'cascaderAdress'">
                            <FormItem class="form-item"
                                      :label="element.label"
                                      :prop="element.name">
                                <Cascader :data="data"
                                          v-model="value1"></Cascader>

                            </FormItem>
                        </template> -->
                    </li>

                    <!-- 手机控件 -->

                    <!-- <li v-for="(key, index) in Object.keys(formData)" :key="index" >
                        <FormItem class="form-item" :label="formData[key].label" :prop="key">
                            <Input v-model.trim="formData[key].value" :maxlength="formData[key].maxLength"></Input>
                        </FormItem>
                    </li>-->
                </ul>
            </div>
        </Form>
    </div>
</template>

<script>
import renderDataMixin from '@/mixins/renderDataMixin'
import { getRules } from '@/libs/utils'

export default {
    name: 'grandsonOne',
    mixins: [renderDataMixin],
    mounted() {
        // 1字典2接口
        this.toChildData.items.forEach(element => {
            switch (element.source) {
                case 1:
                    this.getDictionary(element.sourceValue)
                    break
                case 2:
                    this.getUrl(element.sourceValue)
                    break
                default:
                    break
            }
        })
    },
    methods: {
        // 根据字典获取选项
        getDictionary(dictionary) {
            // 本地字典
            let dictionaryObj = this.$getDictionary('PAYMENT_CURRENCY_child')
            this.$set(this.optionsGather, 'edcation', dictionaryObj)
        },
        // 根据URL获取选项
        getUrl(url) {
            // 接口API
            // apiGetxxx().then(res => {
            //     this.$set(this.optionsGather, 'hobby', dictionaryArr)
            // })
            // this.$set(this.optionsGather, 'hobbyBox', [])
            setTimeout(() => {
                let urlArr = [
                    { label: '游泳', value: '1' },
                    { label: '登山', value: '2' },
                    { label: '吃饭', value: '3' }
                ]
                this.$set(this.optionsGather, 'hobbyBox', urlArr)
            }, 300)
        }
    }
}
</script>

<style lang="scss" scoped>
.form-item {
    margin-left: 20px;
}
.child {
    display: flex;
    .module {
        ul {
            li {
                display: flex;
                width: 300px;
                .name {
                    width: 100px;
                }
            }
        }
    }
}
</style>
