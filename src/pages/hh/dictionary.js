export default [
    {
        label: '手机号码',
        prop: 'phone',
        rules: ['required', 'phone'],
        maxLength: 14,
        value: ''
    },
    {
        label: '姓名',
        prop: 'name',
        rules: ['required'],
        maxLength: 10,
        value: ''
    },
    {
        label: '状态',
        prop: 'status',
        rules: ['required'],
        type: 'select',
        maxLength: 10,
        value: 'chongqing'
    }
]
// export default {
//     phone: {
//         label: '手机号码',
//         rules: ['required', 'phone'],
//         maxLength: 14,
//         value: ''
//     },
//     name: {
//         label: '姓名',
//         rules: ['required'],
//         maxLength: 10,
//         value: ''
//     }
// }
