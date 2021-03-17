export default {
    ChildOne: {
        GrandsonOne: {
            // 数据项
            items: [
                {
                    name: 'name',
                    label: '名称',
                    rules: ['required'],
                    maxLength: 10,
                    value: '12',
                    type: 'input',
                    // 数据来源
                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                    // 数据来源是字典key或者接口url
                    sourceValue: '',
                    // 是否展示
                    isShow: true,
                    // 是否可编辑
                    isEdit: true,
                    // 不同的值影响其他模板
                    relevancyInfo: [
                        {
                            uniteParams: [
                                {
                                    templateName: 'GrandsonOne',
                                    name: 'name',
                                    value: '123'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'ChildTwo',
                            // 该参数影响关联模板的数据
                            relevancyData: [
                                {
                                    name: 'initial',
                                    source: 1, // 1: 字典， 2: 接口， 0: 没有来源
                                    // 数据来源是字典key或者接口url
                                    sourceValue: ''
                                }
                            ],
                            // 该参数影响关联模板的子模板显示
                            templateName: ['name1', 'name2']
                        },
                        {
                            uniteParams: [
                                {
                                    templateName: 'GrandsonOne',
                                    name: 'name',
                                    value: '345'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'GrandsonTwo',
                            // 该参数影响关联模板的数据
                            relevancyData: [],
                            templateName: ['GreatGrandson']
                        }
                    ]
                },
                {
                    name: 'phone',
                    label: '手机号码',
                    rules: ['required', 'phone'],
                    maxLength: 11,
                    tupe: 'input',
                    value: '15757176733',
                    // 数据来源
                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                    // 数据来源是字典key或者接口url
                    sourceValue: '',
                    // 是否展示
                    isShow: true,
                    // 是否可编辑
                    isEdit: true,
                    relevancyInfo: [
                        {
                            uniteParams: [
                                {
                                    templateName: 'GrandsonOne',
                                    name: 'sex',
                                    value: 'man'
                                },
                                {
                                    templateName: 'GrandsonOne',
                                    name: 'phone',
                                    value: '15757176713'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'GreatGrandson',
                            // 该参数影响关联模板的数据
                            relevancyData: [
                                {
                                    name: 'name',
                                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                                    // 数据来源是字典key或者接口url
                                    sourceValue: ''
                                },
                                {
                                    name: 'phone',
                                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                                    // 数据来源是字典key或者接口url
                                    sourceValue: ''
                                }
                            ],
                            templateName: []
                        }
                    ]
                },
                {
                    name: 'sex',
                    label: '性别',
                    value: '男',
                    type: 'radio',
                    rules: [],
                    // 数据来源
                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                    // 数据来源是字典key或者接口url
                    sourceValue: '',
                    // 是否展示
                    isShow: true,
                    // 是否可编辑
                    isEdit: true,
                    relevancyInfo: [
                        {
                            uniteParams: [
                                {
                                    templateName: 'GrandsonOne',
                                    name: 'sex',
                                    value: 'man'
                                },
                                {
                                    templateName: 'GrandsonOne',
                                    name: 'phone',
                                    value: '15757176713'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'GreatGrandson',
                            // 该参数影响关联模板的数据
                            relevancyData: [
                                {
                                    name: 'name',
                                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                                    // 数据来源是字典key或者接口url
                                    sourceValue: ''
                                },
                                {
                                    name: 'phone',
                                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                                    // 数据来源是字典key或者接口url
                                    sourceValue: ''
                                }
                            ],
                            templateName: []
                        }
                    ]
                }
            ]
        },
        GrandsonTwo: {
            GreatGrandson: {
                items: [
                    {
                        name: 'name',
                        label: '姓名',
                        rules: ['required'],
                        maxLength: 10,
                        value: '',
                        // 数据来源
                        source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                        // 数据来源是字典key或者接口url
                        sourceValue: '',
                        // 是否展示
                        isShow: true,
                        // 是否可编辑
                        isEdit: true
                    },
                    {
                        name: 'age',
                        label: '年龄',
                        rules: ['required'],
                        maxLength: 3,
                        value: '18',
                        // 数据来源
                        source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                        // 数据来源是字典key或者接口url
                        sourceValue: '',
                        // 是否展示
                        isShow: true,
                        // 是否可编辑
                        isEdit: true
                    },
                    {
                        name: 'phone',
                        label: '手机号',
                        rules: ['required', 'phone'],
                        maxLength: 11,
                        value: '',
                        // 数据来源
                        source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                        // 数据来源是字典key或者接口url
                        sourceValue: '',
                        // 是否展示
                        isShow: true,
                        // 是否可编辑
                        isEdit: true
                    }
                ]
            },
            GreatGrandsonTwo: {
                items: [
                    {
                        name: 'name',
                        label: '姓名',
                        rules: ['required'],
                        maxLength: 10,
                        value: '',
                        // 数据来源
                        source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                        // 数据来源是字典key或者接口url
                        sourceValue: '',
                        // 是否展示
                        isShow: true,
                        // 是否可编辑
                        isEdit: true
                    },
                    {
                        name: 'age',
                        label: '年龄',
                        rules: ['required'],
                        maxLength: 3,
                        value: '18',
                        // 数据来源
                        source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                        // 数据来源是字典key或者接口url
                        sourceValue: '',
                        // 是否展示
                        isShow: true,
                        // 是否可编辑
                        isEdit: true
                    }
                ]
            }
        }
    },
    ChildTwo: {
        items: [
            {
                name: 'initial',
                label: '初始值',
                rules: ['required'],
                maxLength: 10,
                value: '999',
                // 数据来源
                source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                // 数据来源是字典key或者接口url
                sourceValue: '',
                // 是否展示
                isShow: true,
                // 是否可编辑
                isEdit: true
            },
            {
                name: 'age',
                label: '年龄',
                rules: [],
                maxLength: 3,
                value: '',
                // 数据来源
                source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                // 数据来源是字典key或者接口url
                sourceValue: '',
                // 是否展示
                isShow: true,
                // 是否可编辑
                isEdit: true
            }
        ]
    }
}
