import validateRules from '@/libs/validateRules'
export default {
    data () {
        return {
            addType: 1, // 1: 添加发货人， 2: 添加收货人， 3： 添加通知人
            isShowAddDrawer: false,
            addFormItem: {
                attenName: '',
                attenTel: '',
                code: '',
                attenAddr: '',
                attenFax: '',
                attenEmail: '',
                linkType: ''
            },
            addRuleValidate: {
                attenName: [
                    validateRules.required('名称')[0]
                ],
                attenTel: [
                    validateRules.required('联系电话')[0],
                    validateRules.phone()[0]
                ],
                attenAddr: [
                    validateRules.required('地址')[0]
                ],
                attenEmail: [
                    validateRules.email()[0]
                ]
            },
            sender: [],
            taker: [],
            notifier: []
        }
    },
    methods: {
        submitAddForm () {
            this.$refs.addFormItemData.validate((valid) => {
                if (valid) {
                    // 要发送请求保存信息,后端判断是否重复
                    // 如果不重复
                    if (this.addType === 1) {
                        this.addFormItem.linkType = '1' // 现在是随便写的，还没定
                        this.sender.push(JSON.parse(JSON.stringify(this.addFormItem)))
                    }
                    if (this.addType === 2) {
                        this.addFormItem.linkType = '2' // 现在是随便写的，还没定
                        this.taker.push(JSON.parse(JSON.stringify(this.addFormItem)))
                    }
                    if (this.addType === 3) {
                        this.addFormItem.linkType = '3' // 现在是随便写的，还没定
                        this.notifier.push(JSON.parse(JSON.stringify(this.addFormItem)))
                    }
                    this.isShowAddDrawer = false
                }
            })
        },
        addPeople (type) {
            this.addType = type
            this.isShowAddDrawer = true
        },
        // 获取当选中的联系人名称的下标，用于获取其他信息
        // { data: 联系人集合, target: 选择的名称, property: 名称字段名 }
        getIndex (data, target, property) {
            for (let i = 0; i < data.length; i++) {
                if (data[i][property] === target) {
                    return i
                }
            }
        }
    }
}
