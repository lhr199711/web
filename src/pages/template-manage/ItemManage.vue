<template>
    <div class="item-manage">
        <adt-search-folder :searchRouter="{query: {name: searchData.name}}" class="query-tit">
            <template slot="always-show">
                <Form ref="templateForm" :model="searchData" :label-width="90">
                    <FormItem label="数据项名称：" prop="name">
                        <Input type="text" v-model="searchData.name" clearable></Input>
                    </FormItem>
                </Form>
            </template>
        </adt-search-folder>
        <div class="content">
            <div class="btns-paginator">
                <adt-button>
                    <Button @click="addItemData">新增数据项<Icon type="ios-add-circle-outline" /></Button>
                </adt-button>
                <adt-paginator :currentPage="~~page" :total="~~total" />
            </div>
            <template class="table-data">
                <Table :columns="columns" :data="templateList" stripe height="380">
                    <template slot-scope="{ row, index }" slot="action">
                        <Icon type="md-create" @click="modifyShow(row)" />
                        <Icon type="ios-close" @click="deleteShow(row)"/>
                    </template>
                </Table>
            </template>
        </div>
        <AdtMyModal :title="modalTitle" okText="提交审核" cancelText="取消" :showModal="isModalShow" @on-visible-change="addvisibleChange" @on-ok="save()" @on-cancel="cancel()" width="800">
            <Form class="form-model" :model="formItem" ref="formItemData" :rules="formItemRule" :label-width="120" label-colon inline>
                <FormItem label="数据项编号" prop="name">
                    <Input class="input-width" v-model="formItem.name" :disabled="distinguish=='2'"></Input>
                </FormItem>
                <FormItem label="数据项名称" prop="label">
                    <Input class="input-width" v-model="formItem.label"></Input>
                </FormItem>
                <FormItem label="控件类型" prop="controlType">
                    <Select class="input-width" v-model="formItem.controlType">
                        <Option v-for="(selectData, id) in controlType" :key="id" :value="selectData.dictionaryKey">{{selectData.dictionaryValue}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="控件值来源" prop="source">
                    <RadioGroup v-model="formItem.source">
                        <Radio label="1">字典</Radio>
                        <Radio label="2">接口</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="控件值来源地址" prop="sourceValue">
                    <Input class="input-width" v-model="formItem.sourceValue"></Input>
                </FormItem>
                <FormItem label="数据类型" prop="dataType">
                    <Select class="input-width" v-model="formItem.dataType">
                        <Option v-for="(selectData, id) in dataTypeArr" :key="id" :value="selectData.dictionaryKey">{{selectData.dictionaryValue}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据精度" prop="accuracy">
                    <Input class="input-width" v-model="formItem.accuracy"></Input>
                </FormItem>
                <FormItem label="数据最大长度" prop="maxLength">
                    <Input class="input-width" v-model="formItem.maxLength"></Input>
                </FormItem>
                <FormItem label="备注规则" prop="note">
                    <Input type="textarea" v-model="formItem.note"></Input>
                </FormItem>
        </Form>
        </AdtMyModal>
        <adt-reconfirm-modal :showModal="isActionDel" @on-visible-change="visibleChange" @on-ok="allDelClick()" />
    </div>
</template>

<script>
import { apiTemplateDataQuery, apiTemplateDataAdd, getTemplateDataQuery, apiTemplateDataUpdate, apiTemplateDataDel } from '@/api/template'
import { apiDictionaryQueryByCacheTypeKey } from '@/api/dictionary'
import paginator from '@/mixins/paginator'
import validateRules from '@/libs/validateRules'
export default {
    mixins: [paginator],
    name: 'ItemManage',
    data() {
        return {
            searchData: {
                name: ''
            },
            modalTitle: '',
            columns: [
                {title: '数据项编号',key: 'name',align: 'center'},
                {title: '数据项目展示名称',key: 'label',align: 'center'},
                {title: '控件类型',key: 'controlType',align: 'center'},
                {title: '控件值来源',key: 'source',align: 'center'},
                {title: '控件值来源链接',key: 'sourceValue',align: 'center'},
                {title: '数据类型',key: 'dataType',align: 'center'},
                {title: '备注信息',key: 'note',align: 'center'},
                {title: '创建时间',key: 'createDatetime',align: 'center'},
                {title: '创建人',key: 'createBy',align: 'center'},
                {title: '操作', slot: 'action' ,align: 'center', width: 100},
            ],
            templateList: [],
            isModalShow: false,
            isActionDel: false,
            formItem: {},
            formItemRule: {
                name: [
                    {required: true, message: '请输入数据项编号', trigger: 'blur'},
                    {pattern: /^[0-9a-zA-Z]*$/, message: '只能输入数字和字母'}
                ],
                label: [
                    {required: true, message: '请输入数据项名称', trigger: 'blur'},
                    {pattern: /^[\u4E00-\u9FA5]+$/, message: '只能输入中文'}
                ],
                controlType: [
                    validateRules.select('控件类型')[0]
                ],
                source: [
                    validateRules.select('控件值来源')[0]
                ],
                dataType: [
                    validateRules.select('数据类型')[0]
                ],
                maxLength: [
                    {required: true, message: '请输入数据最大长度', trigger: 'blur'},
                    {pattern: /^[0-9]*$/, message: '只能输入数字'}
                ]
                // rules: [
                //     validateRules.minMultipleChoice('校验规则')[0]
                // ]
            },
            controlType: [],
            dataTypeArr: [],
            // 新增编辑区分  1为新增 2为编辑
            distinguish: 0,
            languageType: [],
            languageArray: [],
            selectLanguage: [],
            passData: {}
        }
    },
    mounted () {
        this.initdict()
    },
    methods: {
        test(val){
            const arr = val || []
            let array = []
            arr.forEach(item => {
                array.push({label: item.label, il8nLangCode: item.value})
            })
            this.selectLanguage = array
        },
        addvisibleChange (changeStatus) {
            this.isModalShow = changeStatus
        },
        visibleChange (changeStatus) {
            this.isActionDel = changeStatus
        },
        // 点击搜索调用查询接口
        dataInit () {
            this.getData()
        },
        getData () {
            const params = {
                page: this.page,
                direction: 'asc',
                properties: '',
                name: this.searchData.name
                // label: '数据项前端展示名称'
            }
            apiTemplateDataQuery({ data: params }).then(res => {
                this.templateList = res.data.content || []
                this.templateList.forEach(item => {
                    item.controlType === 'text'? item.controlType = '文本框': item.controlType = '下拉框'
                    item.dataType === 'string'? item.dataType = '字符串': item.dataType = '数字'
                })
                this.total = res.data.totalElements
            })
        },
        // 新增数据项
        addItemData () {
            this.isModalShow = true
            this.modalTitle = '新增数据项'
            this.distinguish = 1
        },
        // 修改数据项
        modifyShow (row) {
            this.distinguish = 2
            const params = {name: row.name}
            getTemplateDataQuery(params).then(res => {
                this.formItem = res.data
                this.formItem.maxLength = this.formItem.maxLength.toString()
                // this.languageArray = res.data.labelAndLanguage[0].label
                // 编辑时语言栏展示数据处理
                // let arr = []
                // res.data.labelAndLanguage.forEach(item => {
                //     arr.push(item.il8nLangCode)
                // })
                // this.formItem.nameAndLang = arr
                // this.formItem.nameAndLang = res.data.labelAndLanguage[0].label
                // 当后台返回的校验规则为空时赋值[]
                this.formItem.rules = res.data.rules || []
                this.isModalShow = true
                this.modalTitle = '编辑数据项'
                console.log(this.formItem)
            })
        },
        deleteShow (row) {
            this.isActionDel = true
            this.passData = {name: row.name}
        },
        allDelClick () {
            console.log(this.passData)
            apiTemplateDataDel(this.passData).then(res => {
                if (res.code == 200) {
                    this.$Message.info("删除成功")
                    // 隐藏模态框
                    this.isActionDel = false
                    // 刷新列表
                    this.getData()
                } else {
                    this.$Message.info("删除失败")
                }
            })
        },
        save () {
            const data = {
                name: this.formItem.name,
                label: this.formItem.label,
                controlType: this.formItem.controlType,
                sourceValue: this.formItem.sourceValue,
                source: this.formItem.source,
                dataType: this.formItem.dataType,
                accuracy: this.formItem.accuracy,
                maxLength: this.formItem.maxLength,
                note: this.formItem.note
            }
            // 新增保存
            if (this.distinguish == 1) {
                this.$refs["formItemData"].validate((valid) => {
                    if (valid) {
                        apiTemplateDataAdd({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                // 隐藏新增模态框
                                this.$refs.formItemData.resetFields()
                                this.isModalShow = false
                                // 刷新列表
                                this.getData()
                            } else {
                                this.$Message.info("保存失败")
                            }
                        })
                    }
                })
            }
            // 编辑保存
            if (this.distinguish == 2) {
                console.log(this.formItem)
                this.$refs["formItemData"].validate((valid) => {
                    if (valid) {
                        apiTemplateDataUpdate({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                // 隐藏新增模态框
                                this.$refs.formItemData.resetFields()
                                this.isModalShow = false
                                // 刷新列表
                                this.getData()
                            } else {
                                this.$Message.info("保存失败")
                            }
                        })
                    }
                })
            }
        },
        cancel () {
            this.$refs.formItemData.resetFields()
            this.isModalShow = false
        },
        // 初始化字典数据
        initdict () {
            // 获取语言种类
            // const params = {dictionaryTypeKey: 'LANGUAGE_TYPE'}
            // apiDictionaryQueryByCacheTypeKey(params).then(res => {
            //     const arr = res.data || []
            //     arr.forEach(element => {
            //         this.languageType.push({il8nLangCode: element.dictionaryKey, label: element.dictionaryValue})
            //     })
            //     this.languageArray = this.languageType
            // })
            // 获取前端控件数据
            const webControl = {dictionaryTypeKey: 'WEB_CONTROL'}
            apiDictionaryQueryByCacheTypeKey(webControl).then(res => {
                this.controlType = res.data
            })
            // 获取数据类型
            const dataType = {dictionaryTypeKey: 'DATA_TYPE'}
            apiDictionaryQueryByCacheTypeKey(dataType).then(res => {
                this.dataTypeArr = res.data
            })
        },
    },
}
</script>

<style lang="scss" scoped>
/deep/.ivu-form-item > .ivu-form-item-label{
    text-align: left;
}
// 数据项弹窗分栏
/deep/textarea.ivu-input{
    width: 560px;
}
.form-model{
    padding: 0 35px;
}
.input-width{
    width: 215px;
}
.item-manage{
    margin: 10px;
    .query-tit{
        .ivu-form-item{
            margin-bottom: 0;
            /deep/.ivu-form-item-label{
                text-align: left;
                padding: 10px 0;
            }
            .ivu-input-wrapper{
                width: 18%;
            }
        }
    }
    .content{
        margin-top: 20px;
        .ivu-icon{
            vertical-align: middle;
            cursor: pointer;
        }
        .ivu-table-wrapper{
            .ivu-table{
                overflow-y: scroll;
            }
        }
        .ivu-icon-ios-options-outline{
            font-size: 20px;
            transform: rotate(-90deg);
            margin-right: 8px;
        }
        .ivu-icon-ios-brush-outline{
            font-size: 20px;
        }
        .ivu-icon-ios-close{
            font-size: 34px;
        }
    }
    /deep/.ivu-modal{
        width: 76%!important;

    }
    .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
        text-align: left!important;
        padding-left: 0!important;
    }
    .ivu-input{
        font-size: 12px;
    }
}
.modal-title{
    margin-bottom: 10px;
    .template-name{
        margin-right: 20px;
    }
}
.template-modal{
    width: 70%;
    margin: 0 auto;
    .ivu-form-item{
        margin-bottom: 10px;
    }
    .ivu-input-wrapper{
        width: 90%;
    }
    .template-name{
        /deep/.ivu-form-item-label{
            width: 40px!important;
        }
        .ivu-input-wrapper{
            width: 68%;
        }
    }
}
</style>
