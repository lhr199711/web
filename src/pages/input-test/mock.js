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
                    value: '1',
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
                                    templateName: 'grandsonOne',
                                    name: 'name',
                                    value: '123'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'childTwo',
                            // 该参数影响关联模板的数据
                            relevancyData: [
                                // {
                                //     name: 'fz',
                                //     label: '赋值',
                                //     rules: [],
                                //     maxLength: 10,
                                //     value: '888'
                                // },
                                // {
                                //     name: 'phone',
                                //     label: '手机号码',
                                //     rules: ['required', 'phone'],
                                //     maxLength: 11,
                                //     value: ''
                                // },
                                // {
                                //     name: 'email',
                                //     label: '邮箱',
                                //     rules: ['required', 'phone'],
                                //     maxLength: 20,
                                //     value: ''
                                // }
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
                                    templateName: 'grandsonOne',
                                    name: 'name',
                                    value: '345'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'greatGrandson',
                            // 该参数影响关联模板的数据
                            relevancyData: [
                                // {
                                //     name: 'initial',
                                //     label: '初始值3',
                                //     rules: [],
                                //     maxLength: 10,
                                //     value: ''
                                // },
                                // {
                                //     name: 'age',
                                //     label: '年龄2',
                                //     rules: ['required'],
                                //     maxLength: 3,
                                //     value: ''
                                // }
                                {
                                    name: 'age',
                                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                                    // 数据来源是字典key或者接口url
                                    sourceValue: ''
                                }
                            ],
                            templateName: ''
                        }
                    ]
                },
                {
                    name: 'phone',
                    label: '手机号码',
                    rules: ['required', 'phone'],
                    maxLength: 11,
                    type: 'input',
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
                                    templateName: 'grandsonOne',
                                    name: 'sex',
                                    value: 'man'
                                },
                                {
                                    templateName: 'grandsonOne',
                                    name: 'phone',
                                    value: '15757176713'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'greatGrandson',
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
                    name: 'price',
                    label: '价格',
                    rules: ['required', 'phone'],
                    maxLength: 11,
                    type: 'input',
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
                                    templateName: 'grandsonOne',
                                    name: 'sex',
                                    value: 'man'
                                },
                                {
                                    templateName: 'grandsonOne',
                                    name: 'phone',
                                    value: '15757176713'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'greatGrandson',
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
                    name: 'unit',
                    label: '单位',
                    value: '',
                    type: 'unit',
                    rules: ['select'],
                    // 数据来源
                    source: 1, // 1: 字典， 2: 接口， 0: 没有来源
                    // 数据来源是字典key或者接口url
                    sourceValue: 'edcations',

                    // 是否展示
                    isShow: true,
                    // 是否可编辑
                    isEdit: true
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
                                    templateName: 'grandsonOne',
                                    name: 'sex',
                                    value: 'man'
                                },
                                {
                                    templateName: 'grandsonOne',
                                    name: 'phone',
                                    value: '15757176713'
                                }
                            ],
                            // 关联模板
                            relevancyTemplate: 'greatGrandson',
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
                    name: 'hobby',
                    label: '爱好',
                    value: [],
                    type: 'checkbox',
                    rules: ['multipleChoice'],
                    // 数据来源
                    source: 2, // 1: 字典， 2: 接口， 0: 没有来源
                    // 数据来源是字典key或者接口url
                    sourceValue: '',
                    // 是否展示
                    isShow: true,
                    // 是否可编辑
                    isEdit: true
                },
                {
                    name: 'site',
                    label: '场站',
                    value: '',
                    type: 'select',
                    rules: ['select'],
                    // 数据来源
                    source: 1, // 1: 字典， 2: 接口， 0: 没有来源
                    // 数据来源是字典key或者接口url
                    sourceValue: 'edcations',

                    // 是否展示
                    isShow: true,
                    // 是否可编辑
                    isEdit: true
                },
                {
                    name: 'dateTime',
                    label: '时间',
                    value: '',
                    type: 'date',
                    rules: [],
                    // 数据来源
                    source: 0, // 1: 字典， 2: 接口， 0: 没有来源
                    // 数据来源是字典key或者接口url
                    sourceValue: '',
                    // 时间类型   date:2020-05-03  dateTime:2020-05-03 12:03:09
                    // date、daterange、datetime、datetimerange、year、month
                    dateTimeType: 'datetime',

                    // 是否展示
                    isShow: true,
                    // 是否可编辑
                    isEdit: true
                }, {
                    name: 'adress',
                    label: '地址级联选择',
                    value: [],
                    type: 'cascaderAdress',
                    rules: [],
                    // 数据来源
                    source: 2, // 1: 字典， 2: 接口， 0: 没有来源
                    // 数据来源是字典key或者接口url
                    sourceValue: 'url',
                    // 时间类型   date:2020-05-03  dateTime:2020-05-03 12:03:09
                    // date、daterange、datetime、datetimerange、year、month
                    dateTimeType: 'datetime',

                    // 是否展示
                    isShow: true,
                    // 是否可编辑
                    isEdit: true
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
                        name: 'price',
                        label: '价格',
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
