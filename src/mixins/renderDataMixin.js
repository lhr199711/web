/* 最底层组件渲染数据项 */
import { mapState, mapActions } from 'vuex'
import { getRules } from '@/libs/utils'

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
            formData: {},
            validateRules: {},
            dynamicData: {},
            defaultData: JSON.parse(JSON.stringify(this.toChildData.items)),
            // 字典，接口数据项
            optionsGather: {}
        }
    },
    created () {
        this.initData(this.toChildData.items)
    },
    computed: {
        ...mapState(['state'])
    },
    watch: {
        state: {
            handler (newState) {
                const stateData = newState[this.$options.name] ? newState[this.$options.name].relevancyData : ''
                // 当数据项发生改变时，重新初始化
                // if (stateData && (JSON.stringify(stateData) !== JSON.stringify(this.dynamicData))) {
                //     this.initData(stateData)
                //     this.$refs.formValidate.resetFields()
                // }
                if (!stateData) return
                if (stateData !== 'useDefaultData') {
                    for (const item of this.dynamicData) {
                        item.isShow = false
                        for (const val of stateData) {
                            if (item.name === val.name) {
                                val.isShow = true
                                Object.assign(item, val)
                                break
                            }
                        }
                    }
                    this.initData(this.dynamicData)
                } else {
                    // 当前数据项跟默认数据项不一致才重新初始化默认数据项
                    if (JSON.stringify(this.defaultData) !== JSON.stringify(this.dynamicData)) {
                        this.initData(this.defaultData)
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(['setState']),
        initData (data) {
            // 数据重置
            [this.formData, this.validateRules, this.dynamicData] = [{}, {}, '']
            for (const element of data) {
                // 新创建一个对象用来存储数据，以便进行表单校验
                this.$set(this.formData, element.name, element.value)
                // 获取校验规则
                this.validateRules[element.name] = getRules(element)
                // 后端传过来的数据结构是不会变的，参数对其他模板的影响需要初始化的时候就去触发
                if (element.relevancyInfo && element.relevancyInfo.length > 1) {
                    this.handleEffectOtherTemplate(element.relevancyInfo, element.name)
                }
            }
            // 深拷贝
            this.dynamicData = JSON.parse(JSON.stringify(data))
        },
        validateChildForm () {
            let validStatus = false
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    validStatus = true
                } else {
                    validStatus = false
                }
            })
            return validStatus
        },
        submitChildFormDataToFather () {
            // 将页面数据合并到初始化时分发的数据里
            for (const element of this.dynamicData) {
                for (const key of Object.keys(this.formData)) {
                    if (element.name === key) {
                        element.value = this.formData[key]
                    }
                }
            }
            // 数据同步到父模板
            this.$emit('syncData', { [this.$options.name]: { items: this.dynamicData } })
        },
        // 数据项影响其他模板的数据项、子模板显示
        handleEffectOtherTemplate (relevancyInfo = [], name) {
            // 会影响其他的模板数据项或者子模板显示
            if (relevancyInfo.length > 0) {
                // 当前数据项的值
                const curValue = this.formData[name]
                // 循环出所有的关联关系
                for (const relevancy of relevancyInfo) {
                    // 如果state里已经有了关联数据项，则将关联数据项取出来，后续进行合并操作
                    const curState = this.state[relevancy.relevancyTemplate] ? this.state[relevancy.relevancyTemplate].uniteParams : ''
                    // uniteParams: 该数据项会跟不同的数据项（可能是统一模板，也可能是不同模板）去影响不同的模板，用于存放所有的关系
                    // curUniteParams: 该数据项当前跟其他数据项的关系
                    let [uniteParams, curUniteParams] = [{}, {}]
                    // 这里可能是多个参数一起影响影响其他的模板数据项或者子模板显示
                    for (const item of relevancy.uniteParams) {
                        curUniteParams[`${item.templateName}_${item.name}`] = false
                        // 判断有没有达到满足条件的值
                        // 使用setTimeout将下面的代码放到下一个事件循环执行
                        setTimeout(() => {
                            // item.templateName === this.$options.name: 当前模板
                            // item.name === name: 当前数据项
                            if (item.templateName === this.$options.name && item.name === name) {
                                // 所有的关联关系: 当前的关联关系和已经存在state里的关系关系合并
                                uniteParams = Object.assign({}, curUniteParams, curState)
                                // relevancyData: 影响其他模板的数据项
                                // templateName: 影响其他模板的子模板显示
                                let [relevancyData, templateName] = ['', '']
                                // 如果满足条件，则触发影响
                                if (item.value === curValue) {
                                    uniteParams[`${item.templateName}_${item.name}`] = true
                                    relevancyData = relevancy.relevancyData && relevancy.relevancyData.length ? relevancy.relevancyData : ''
                                    templateName = relevancy.templateName && relevancy.templateName.length ? relevancy.templateName : ''
                                } else {
                                    // 如果不满足条件，则使用默认数据
                                    uniteParams[`${item.templateName}_${item.name}`] = false
                                    relevancyData = 'useDefaultData'
                                    templateName = 'useDefaultData'
                                }
                                this.setState({
                                    // 键名，跟模板名保持一致
                                    key: relevancy.relevancyTemplate,
                                    // relevancyData代表影响的是数据项
                                    relevancyData,
                                    // templateName代表影响的是模板的子模板
                                    templateName,
                                    uniteParams,
                                    curUniteParams
                                })
                            }
                        }, 0)
                    }
                }
            }
        }
    }
}
