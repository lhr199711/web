<template>
    <div class="child">
        <Form
            ref="formValidate"
            :model="formData"
            :rules="validateRules"
            @on-validate="submitChildFormDataToFather()"
        >
            <div class="module">
                <h1>我是childTwo{{ $t('common.status') }}</h1>
                <Modal
                    v-model="showModal"
                    title="Common Modal dialog box title">
                    <p>Content of dialog</p>
                    <p>Content of dialog</p>
                    <p>Content of dialog</p>
                </Modal>
                <DatePicker type="date" tyle="width: 200px"></DatePicker>
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
    name: 'ChildTwo',
    mixins: [renderDataMixin],
    data () {
        return {
            showModal: false
        }
    },
    methods: {
        // 动态加载子组件
        asyncComponents(templateName) {
            this.currentChildren.push(require(`./${templateName}`).default)
            this.componentsName.push(templateName)
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
