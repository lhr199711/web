<template>
    <div class="child">
        <Form
            ref="formValidate"
            :model="formData"
            :rules="validateRules"
            @on-validate="submitChildFormDataToFather()"
        >
            <div class="module">
                <h1>我是grandsonOne</h1>
                <ul>
                    <li v-for="element in dynamicData" :key="element.name" v-show="element.isShow">
                        <FormItem class="form-item" :label="element.label" :prop="element.name">
                            <Input
                                v-model.trim="formData[element.name]"
                                :maxlength="element.maxLength"
                                @on-change="handleEffectOtherTemplate(element.relevancyInfo, element.name)"
                            ></Input>
                        </FormItem>
                    </li>
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
    name: 'GrandsonOne',
    mixins: [renderDataMixin]
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
