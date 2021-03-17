<template>
    <div class="imitate">
        <div v-if="!isPrint">
            <div>
                <Button @click="handleSubmit()">保存</Button>
                <Button @click="handlePrint()">打印</Button>
            </div>
            <div v-for="(item, index) in currentChildren.length" :key="index" v-show="showComponents.includes(componentsName[index])">
                <!-- 动态组件 -->
                <component
                    :is="currentChildren[index]"
                    :ref="`childForm${index}`"
                    @syncData="syncData"
                    :toChildData="formData[componentsName[index]]"
                ></component>
            </div>
        </div>
        <div v-else>
            <h3>我是打印内容</h3>
        </div>
        <adt-reconfirm-modal :showModal="showModal" @on-visible-change="visibleChange"></adt-reconfirm-modal>
    </div>
</template>

<script>
import mockData from '../mock'
import distributeDataMixin from '@/mixins/distributeDataMixin'
// import { apiGetDictionary } from '@/api/dictionary.js'
// import { timestampFormat } from '../../libs/utils'
export default {
    name: 'Imitate',
    mixins: [distributeDataMixin],
    data () {
        return {
            showModal: true,
            isPrint: false
        }
    },
    created () {
        // 模拟异步加载
        setTimeout(() => {
            this.initData(mockData)
        }, 1000)
        // console.log(timestampFormat(21318673563526))
    },
    methods: {
        visibleChange (data) {
            this.showModal = data
            console.log(data)
        },
        handleSubmit () {
            this.showModal = true
            // 提交时，调用子组件的表单校验
            // console.log(this.formData)
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
            // apiGetDictionary().then(() => {
            //     console.log('请求成功')
            // })
        },
        handlePrint () {
            this.isPrint = true
            // 添加定时器，让打印功能在页面内容替换后再执行
            setTimeout(() => {
                window.print()
                this.isPrint = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.ivu-btn {
    color: $light-color;
}
</style>
