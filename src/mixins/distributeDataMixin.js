/* 根组件、中间组件分发数据 */
import { mapState } from 'vuex'
export default {
    props: {
        // 父组件分发给子组件的数据
        toChildData: {
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            componentsName: [],
            currentChildren: [],
            formData: {},
            showComponents: [],
            defaultShowComponents: []
        }
    },
    created () {
        this.initData(this.toChildData)
    },
    computed: {
        ...mapState(['state'])
    },
    watch: {
        state: {
            handler (newState) {
                const stateData = newState[this.$options.name] ? newState[this.$options.name].templateName : ''
                if (!stateData) return
                if (stateData !== 'useDefaultData') {
                    this.showComponents = [...stateData]
                } else {
                    this.showComponents = [...this.defaultShowComponents]
                }
            },
            deep: true
        }
    },
    methods: {
        // 动态加载子组件
        initData (data) {
            for (const component of Object.keys(data)) {
                // 如果键名不是'items'，则不是数据项，是子组件
                if (component !== 'items') {
                    this.asyncComponents(component)
                    this.showComponents.push(component)
                }
            }
            this.defaultShowComponents = [...this.showComponents]
            this.formData = data
        },
        // 动态引入子组件
        asyncComponents (templateName) {
            // 异步组件，性能更好
            const component = resolve => { require([`@/components/${templateName}`], resolve) }
            // 非异步组件
            // const component = require(`@/components/${templateName}`).default
            this.currentChildren.push(component)
            this.componentsName.push(templateName)
        },
        // 子组件数据发生改变，同步到父组件，并对数据进行组装
        syncData (childData) {
            this.formData = { ...this.formData, ...childData }
            // this.$options.name, 获取组件名称,组件名称和数据结构里的键名保持一致
            this.$emit('syncData', { [this.$options.name]: this.formData })
        },
        // 对子组件进行校验
        validateChildForm () {
            const validStatus = []
            for (const i in this.showComponents) {
                validStatus.push(this.$refs[`childForm${i}`][0].validateChildForm())
                // console.log(this.$refs[`childForm${i}`][0].validateChildForm())
            }
            // 验证通过
            if (!validStatus.includes(false)) {
                return true
            } else {
                // 验证未通过
                return false
            }
        }
    }
}
