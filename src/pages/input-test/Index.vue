<template>
    <div class="order"
         style="padding:50px">
        <Form ref="formInline"
              :model="formInline"
              inline>
            <FormItem prop="user">
                <Input type="text"
                       v-model="formInline.user"
                       placeholder="Username">
                <Icon type="ios-person-outline"
                      slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary"
                        @click="handleWebSocktSubmit('formInline')">提交</Button>
            </FormItem>
        </Form>
        <div v-for="(item, index) in currentChildren.length"
             :key="index">
            <component :is="currentChildren[index]"
                       :ref="`childForm${index}`"
                       @syncData="syncData"
                       :toChildData="formData[componentsName[index]]"></component>
        </div>
        <div id="printTest"
             style="width:774px;padding:10px">
            <Table stripe
                   :columns="columns1"
                   :data="data1"></Table>
        </div>

        <Button v-print="'#printTest'">打印v-print</Button>
        <Button @click="handlePrint()">打印</Button>
        <Button @click="handleSubmit()">保存</Button>
    </div>
</template>

<script>
import mockData from './mock'
import distributeDataMixin from '@/mixins/distributeDataMixin'
// import { createSocket, sendWSPush, sendPing } from './websoket.js'
import { createSocket, socketSend } from './websoket.js'

export default {
    name: 'imitate',
    mixins: [distributeDataMixin],
    data() {
        return {
            websock: null,
            formInline: {
                user: ''
            },
            columns1: [
                {
                    title: 'Name',
                    key: 'name'
                },
                {
                    title: 'Age',
                    key: 'age'
                },
                {
                    title: 'Address',
                    key: 'address'
                }
            ],
            data1: []
        }
    },
    created() {
        let tableArr = {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            date: '2016-10-04'
        }
        for (let i = 0; i < 50; i++) {
            this.data1.push(tableArr)
        }
        // 模拟异步加载
        setTimeout(() => {
            for (let component of Object.keys(mockData)) {
                // 不是数据项，是子组件
                if (component !== 'items') {
                    this.asyncComponents(component)
                }
            }
            this.formData = mockData
        }, 1000)
        createSocket() //创建
        // onopenWS()
        // sendWSPush(11111) //发送数据
    },
    methods: {
        // 动态加载子组件
        asyncComponents(templateName) {
            this.currentChildren.push(require(`./components/${templateName}`).default)
            this.componentsName.push(templateName)
        },

        handleSubmit() {
            // 提交时，调用子组件的表单校验
            console.log(this.formData)
            const validStatus = []
            for (const i in this.currentChildren) {
                // 如果使用v-for循环出子组件，通过refs获取到的子组件实例是个数组
                validStatus.push(this.$refs[`childForm${i}`][0].validateChildForm())
            }
            // 全部验证通过，才能进行后续的操作
            if (!validStatus.includes(false)) {
                console.log('验证通过')
            } else {
                console.log('验证未通过')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.ivu-btn {
    color: $light-color;
}
</style>
