<template>
    <div class="forms-box">
        <Row :gutter="20">
            <Col span="18">
                <Col span="8">
                    <edit-form :ref="fhrForm.formId" isTitle="发货人信息" :list="fhrForm.list"></edit-form>
                </Col>
                <Col span="8">
                    <!-- <edit-form :ref="shrForm.formId" isTitle="收货人信息" :list="shrForm.list"></edit-form> -->
                </Col>
                <Col span="8">
                    <!-- <edit-form :ref="tzrForm.formId" isTitle="通知人信息" :list="tzrForm.list"></edit-form> -->
                </Col>
            </Col>
            <Col span="6">
                <edit-form
                    :ref="fwForm.formId"
                    isTitle="服务参数"
                    :list="fwForm.list"
                    :labelWidth="fwForm.labelWidth"
                    :ruleValidate="fwForm.ruleValidate"
                    :DefaultVal="fwForm.DefaultVal"
                ></edit-form>
            </Col>
        </Row>
    </div>
</template>

<script>
import editForm from '../edit-form/index'
import vr from '@/libs/validateRules'
export default {
    name: "",
    components: {
        editForm
    },
    data () {
        return {
            fhrForm: {
                formId: 'fhrFormId',
                list: [
                    {
                        type: 'input',
                        label: '发货人名称：',
                        value: 'attenName',
                        prop: 'attenName',
                    },
                    {
                        type: 'input',
                        label: '代码：',
                        value: 'code',
                        prop: 'code',
                    },
                    {
                        type: 'input',
                        label: '地址：',
                        value: 'attenAddr',
                        prop: 'attenAddr',
                    },
                    {
                        type: 'input',
                        label: '电话：',
                        value: 'attenTel',
                        prop: 'attenTel',
                    },
                    {
                        type: 'input',
                        label: '传真：',
                        value: 'attenFax',
                    },
                    {
                        type: 'input',
                        label: '邮箱：',
                        value: 'attenEmail',
                    },
                ]
            },
            shrForm: {
                formId: 'shrFormId',
                list: [
                    {
                        type: 'input',
                        label: '收货人名称：',
                        value: 'attenName',
                        prop: 'attenName',
                    },
                    {
                        type: 'input',
                        label: '代码：',
                        value: 'code',
                        prop: 'code',
                    },
                    {
                        type: 'input',
                        label: '地址：',
                        value: 'attenAddr',
                        prop: 'attenAddr',
                    },
                    {
                        type: 'input',
                        label: '电话：',
                        value: 'attenTel',
                        prop: 'attenTel',
                    },
                    {
                        type: 'input',
                        label: '传真：',
                        value: 'attenFax',
                    },
                    {
                        type: 'input',
                        label: '邮箱：',
                        value: 'attenEmail',
                    },
                ]
            },
            tzrForm: {
                formId: 'tzrFormId',
                list: [
                    {
                        type: 'input',
                        label: '通知人名称：',
                        value: 'attenName',
                        prop: 'attenName',
                    },
                    {
                        type: 'input',
                        label: '代码：',
                        value: 'code',
                        prop: 'code',
                    },
                    {
                        type: 'input',
                        label: '地址：',
                        value: 'attenAddr',
                        prop: 'attenAddr',
                    },
                    {
                        type: 'input',
                        label: '电话：',
                        value: 'attenTel',
                        prop: 'attenTel',
                    },
                    {
                        type: 'input',
                        label: '传真：',
                        value: 'attenFax',
                    },
                    {
                        type: 'input',
                        label: '邮箱：',
                        value: 'attenEmail',
                        prop: 'attenEmail'
                    },
                ]
            },
            fwForm: {
                formId: 'fwFormId',
                labelWidth: 150,
                ruleValidate: {
                    timeArr: [
                        {
                            required: true,
                            validator: vr.validateTime,
                            trigger: 'change',
                        }
                    ],
                },
                DefaultVal:{
                    timeArr:[],
                    cargoTotal:1
                },
                list: [
                    {
                        type: 'select',
                        label: '运输类型：',
                        value: 'trspType',
                        prop: 'trspType',
                        opList: this.$getDictionary('TRANSPORT_TYPE'),
                    },
                    {
                        type: 'select',
                        label: '集装箱尺寸：',
                        value: 'contaSize',
                        prop: 'contaSize',
                        opList: this.$getDictionary('TRANSPORT_TYPE'),
                    },
                    {
                        type: 'select',
                        label: '集装箱来源：',
                        value: 'containerSource',
                        prop: 'containerSource',
                        opList: this.$getDictionary('TRANSPORT_TYPE'),
                    },
                    {
                        type: 'datetimerange',
                        label: '合同委托有效期：',
                        value: 'timeArr',
                        prop: 'timeArr',
                    },
                    {
                        type: 'number',
                        label: '货物总量：',
                        value: 'cargoTotal',
                        prop: 'cargoTotal',
                    },
                ]
            }

        };
    },
    created () {
    },
    mounted () {

    },
    methods: {
        // 表单提交并验证
        oksubmite () {
            // let fhrObj = this.$refs[this.fhrForm.formId].handelValidate()
            // let shrObj = this.$refs[this.shrForm.formId].handelValidate()
            // let tzrObj = this.$refs[this.tzrForm.formId].handelValidate()
            // let ps = [fhrObj, shrObj, tzrObj]
            let fwObj = this.$refs[this.fwForm.formId].handelValidate()
            let ps = [fwObj]
            console.log(ps)
            let flag = ps.every(item => item)
            if (flag) {
                // console.log(ps)
            } else {
                // console.log('0000')
            }
        },
    }
};
</script>

<style scoped lang="scss">
.forms-box {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
    padding: 20px;
}
</style>
