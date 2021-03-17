<template>
    <div class="template-manage">
        <adt-search-folder :searchRouter="{query: {classificationName:searchData.name}}" class="query-tit">
            <template slot="table-btn-group">
                <Form ref="templateForm" :model="searchData" :rules="rules" :label-width="80">
                    <FormItem label="模版名称：" prop="name">
                        <Input type="text" v-model="searchData.name" clearable></Input>
                    </FormItem>
                </Form>
            </template>
        </adt-search-folder>
        <!-- 下面的表格内容 -->
        <div class="content">
            <div class="btns-paginator">
                <adt-button>
                    <Button @click="addTemplate">新增模版<Icon type="ios-add-circle-outline" /></Button>
                </adt-button>
                <adt-paginator :currentPage="~~templatePage" :total="~~templateTotal" path="/template-manage" />
            </div>
            <template class="table-data">
                <Table :columns="columns" :data="templateList">
                    <template slot-scope="{ row, index }" slot="action">
                        <Icon type="ios-options-outline" @click="configShow(row)"/>
                        <Icon type="ios-brush-outline" @click="modifyShow(row,index)" />
                        <Icon type="ios-close" @click="deleteShow(row)"/>
                    </template>
                </Table>
            </template>
        </div>
        <!-- 配置模版弹框 -->
        <template class="config-modal">
            <adt-my-modal title="配置模版"
                width="90%"
                :showModal="isConfigShow"
                @on-visible-change="configVisible"
                @on-ok="configConfirm"
                @on-cancel="configCancel">
                <div class="modal-title">
                    <span class="template-name">模版名称：物流设置服务 </span>
                    <span>模版编号：123098787</span>
                    <adt-paginator style="display:inline-block;float:right" :currentPage="~~configPage" :total="~~configTotal" path="/template-manage" />
                </div>
                <div class="relevance-data">
                    <Table size="small" :columns="columnsConfig" :data="configData" height="400">
                        <!-- 关联数据项 -->
                        <template slot-scope="{ row, index }" slot="relationData">
                            <Select v-model="moreData" style="width:80px;textAlign: left;">
                                <Option v-for="(item, key) in relationData"
                                    :value="item.value"
                                    :key="key"
                                    style="textAlign: left;"
                                >{{ item.value }}</Option>
                            </Select>
                        </template>
                        <!-- 是否多条数据项 -->
                        <template slot-scope="{ row, index }" slot="isMore">
                            <Select v-model="moreData" style="width:80px;textAlign: left;">
                                <Option v-for="(item, key) in relationData"
                                    :value="item.value"
                                    :key="key"
                                    style="textAlign: left;"
                                >{{ item.value }}</Option>
                            </Select>
                        </template>
                        <!-- 是否展示 -->
                        <template slot-scope="{ row, index }" slot="isShow">
                            <Select v-model="moreData" style="width:80px;textAlign: left;">
                                <Option v-for="(item, key) in relationData"
                                    :value="item.value"
                                    :key="key"
                                    style="textAlign: left;"
                                >{{ item.value }}</Option>
                            </Select>
                        </template>
                        <!-- 是否编辑 -->
                        <template slot-scope="{ row, index }" slot="isEdit">
                            <Select v-model="moreData" style="width:80px;textAlign: left;">
                                <Option v-for="(item, key) in relationData"
                                    :value="item.value"
                                    :key="key"
                                    style="textAlign: left;"
                                >{{ item.value }}</Option>
                            </Select>
                        </template>
                        <!-- 提示信息 -->
                        <template slot="message">
                            <Input v-model="value" placeholder="请输入提示信息" style="width: 112px" />
                        </template>
                        <!-- 排序值 -->
                        <template slot="sort">
                            <Input v-model="value" placeholder="" style="width: 40px" />
                        </template>
                    </Table>
                </div>
            </adt-my-modal>
        </template>
        <!-- 新增模版 -->
        <template class="add-template-modal">
            <adt-my-modal title="新增模版"
                width="30%"
                :showModal="isAddTemplateShow"
                @on-visible-change="templateVisible"
                @on-ok="templateConfirm"
                @on-cancel="templateCancel">
                <div class="template-modal">
                    <Form ref="templateRef" :model="templateData" label-position="left" :label-width="100">
                        <FormItem label="模版编码：" prop="classificationCode">
                            <Input v-model="templateData.classificationCode"></Input>
                        </FormItem>
                        <FormItem label="模版名称：">
                            <div class="template-name">
                                <FormItem v-for="(item, key) in templateData.nameAndLang" :key="key" :label="item.dictionaryValue" prop="classificationName">
                                    <Input v-model="item.classificationName"></Input>
                                </FormItem>
                            </div>
                        </FormItem>
                        <FormItem label="页面组建：" prop="pageBuild">
                            <Select v-model="templateData.pageBuild" style="width:162px">
                                <Option v-for="item in templateData.compont" :value="item.dictionaryValue" :key="item.dictionaryValue">{{ item.dictionaryValue }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </adt-my-modal>
        </template>
        <!-- 修改模版 -->
        <template class="add-template-modal">
            <adt-my-modal title="修改模版"
                width="30%"
                :showModal="isModifyTemplateShow"
                @on-visible-change="modifyVisible"
                @on-ok="modifyConfirm"
                @on-cancel="modifyCancel">
                <div class="template-modal">
                    <Form ref="templateRef" :model="templateData" label-position="left" :label-width="100">
                        <FormItem label="模版编码：" prop="classificationCode">
                            <Input disabled v-model="templateData.classificationCode"></Input>
                        </FormItem>
                        <FormItem label="模版名称：">
                            <div class="template-name">
                                <FormItem v-for="(item, key) in templateData.nameAndLang" :key="key" :label="item.dictionaryValue" prop="classificationName">
                                    <Input v-model="item.classificationName"></Input>
                                </FormItem>
                            </div>
                        </FormItem>
                        <FormItem label="页面组建：" prop="pageBuild">
                            <Select v-model="templateData.pageBuild" style="width:162px">
                                <Option v-for="item in templateData.compont" :value="item.dictionaryValue" :key="item.dictionaryValue">{{ item.dictionaryValue }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </adt-my-modal>
        </template>
        <adt-reconfirm-modal :showModal="isDelTemplateShow" @on-visible-change="delTemplateVisible" @on-ok="delTemplateData"></adt-reconfirm-modal>
    </div>
</template>

<script>
import {
    delTemplateBasic,
    apiTemplateQuery,
    apiTemplateRelDataAdd,
    apiTemplateRelDataQuery,
    apiTemplateBasicClassificationAdd,
    apiTemplateBasicClassificationQuery,
    apiTemplateBasicClassifitionUpdate,
} from '@/api/template.js'
import { apiDictionaryQueryByCacheTypeKey } from '@/api/dictionary.js'

import paginator from '@/mixins/paginator'
export default {
    mixins: [paginator],
    name: 'templateManage',
    data() {
        return {
            // 分页初始化数据
            templatePage: 1,
            templateTotal: 1,
            configPage: 1,
            configTotal: 1,
            languageType: [],
            // 提示信息的value
            value: '',
            moreData: '',
            relationData: [
                {value: '是'},
                {value: '否'}
            ],
            isDelTemplateShow: false,
            isConfigShow: false,
            isAddTemplateShow: false,
            isModifyTemplateShow: false,
            searchData: {
                name: ''
            },
            templateData: {
                classificationCode: '',
                name: '',
                nameAndLang: [],
                pageBuild: '',
                compont: [],
                note: ''
            },
            rules: {
                name: [
                    { validator: '', trigger: 'blur' }
                ]
            },
            columns: [
                {title: '模版编码',width: 400,key: 'classificationCode',align: 'center'},
                {title: '模版名称',key: 'classificationName',width: 500,align: 'center'},
                {title: '操作',slot: 'action',align: 'center'}
            ],
            columnsConfig: [
                {type: 'selection',width: 54,align: 'center'},
                {title: '数据项编码',key: 'name',align: 'center'},
                {title: '数据项名称',key: 'label',align: 'center'},
                {title: '备注',key: 'note',align: 'note'},
                {title: '是否多条数据项',key: 'isMore',align: 'center', slot: 'isMore'},
                {title: '关联数据项',key: 'relationData',align: 'center', slot: 'relationData'},
                {title: '是否展示',key: 'isShow',align: 'center', slot: 'isShow'},
                {title: '是否编辑',key: 'isEdit',align: 'center', slot: 'isEdit'},
                {title: '提示信息',key: 'message',align: 'center', slot: 'message'},
                {title: '排序值',key: 'sort',align: 'center', slot: 'sort'}
            ],
            configData: [],
            templateList: [],
            // 要删除的模版数据
            deleteData: ''
        }
    },
    mounted () {
        // 初始化调用查询接口
        this.templateDataQuery()
        // 初始化字典数据
        this.initdict()
    },
    methods: {
        // 点击搜索调用查询接口
        dataInit () {
            this.templateDataQuery()
        },
        // 模版数据查询
        templateDataQuery () {
            let params = {
                page: this.templatePage,
                size: this.perpage,
                direction: '',
                properties: '',
                classificationCode: '',
                classificationName: this.searchData.name
            }
            apiTemplateQuery({data: params}).then(res => {
                this.templateList = res.data.content
                this.templateTotal = res.data.totalElements
            })
        },
        // 初始化字典数据
        initdict(){
            let params = {dictionaryTypeKey: 'LANGUAGE_TYPE'}
            apiDictionaryQueryByCacheTypeKey(params).then(res => {
                this.languageType = res.data
                if(res.data && res.data.length>0){
                    res.data.forEach(element => {
                        element["il8nLangCode"] = element.dictionaryKey;
                        element["classificationName"] = "";
                    });
                }
                this.templateData.nameAndLang = res.data
            })
            let param = {dictionaryTypeKey: 'WEB_COMPONT'}
            apiDictionaryQueryByCacheTypeKey(param).then(res => {
                console.log(res)
                this.templateData.compont = res.data
            })
        },
        // 新增模版(显示弹窗)
        addTemplate () {
            this.initdict()
            this.isAddTemplateShow = true
        },
        // 二次弹框的显示给父级
        configVisible (isShow) {
            this.isConfigShow = isShow
        },
        templateVisible (isShow) {
            this.isAddTemplateShow = isShow
        },
        modifyVisible (isShow) {
            this.isModifyTemplateShow = isShow
        },
        delTemplateVisible (isShow) {
            this.isDelTemplateShow = isShow
        },
        // 确定绑定配置信息
        configConfirm () {
            console.log(this.configData)
            // apiTemplateRelDataAdd().then(res => {
            //     console.log(res)
            // })
        },
        // 取消绑定配置信息
        configCancel () {
            this.isConfigShow = false
        },
        // 确认新增模版
        templateConfirm () {
            let params = {
                classificationCode: this.templateData.classificationCode,
                nameAndLang: this.templateData.nameAndLang,
                compont: this.templateData.compont.dictionaryValue,
                note: this.templateData.note
            }
            console.log(params)
            // apiTemplateBasicClassificationAdd({data: params}).then(res => {
            //     this.$refs.templateRef.resetFields()
            //     this.isAddTemplateShow = false
            //     this.templateDataQuery()
            // })
        },
        // 取消新增模版
        templateCancel () {
            this.$refs.templateRef.resetFields()
            this.isAddTemplateShow = false
        },
        // 确认修改模版
        modifyConfirm () {
            let params = {
                classificationCode: this.templateData.classificationCode,
                nameAndLang: this.templateData.nameAndLang,
                compont: this.templateData.compont.dictionaryValue,
                note: this.templateData.note
            }
            apiTemplateBasicClassifitionUpdate({data: params}).then(res => {
                console.log(res)
                this.$refs.templateRef.resetFields()
                this.isModifyTemplateShow = false
                this.templateDataQuery()
            })
        },
        // 取消修改模版
        modifyCancel () {
            this.$refs.templateRef.resetFields()
            this.isModifyTemplateShow = false
        },
        // 配置模版弹框数据信息
        configShow (row) {
            this.isConfigShow = true
            let params = {
                page: this.page,
                size: this.perpage,
                direction: '',
                properties: '',
                classificationCode: row.classificationCode,
            }
            apiTemplateRelDataQuery({data: params}).then(res => {
                res.data.content.forEach(element => {
                    console.log(element.checked)
                })
                this.configData = res.data.content
                this.configTotal = res.data.totalElements
            })
        },
        // 修改弹框
        modifyShow (row) {
            let params = {classificationCode: row.classificationCode}
            apiTemplateBasicClassificationQuery(params).then(res=> {
                // 把字典的模版名称写入到模版接口的弹框里面
                this.templateData.classificationCode = res.data.classificationCode
                this.templateData.compont = res.data.compont
                this.templateData.note = res.data.note
                let nameAndLangInterface = {}
                if(res.data.nameAndLang && res.data.nameAndLang.length>0){
                     res.data.nameAndLang.forEach(element => {
                         nameAndLangInterface[element.il8nLangCode] = null == element.classificationName ? "" : element.classificationName
                     })
                }
                if(this.languageType && this.languageType.length>0){
                    this.languageType.forEach(element => {
                        element["il8nLangCode"] = element.dictionaryKey
                        element["classificationName"] = nameAndLangInterface[element.dictionaryKey]
                    });
                }
                this.templateData.nameAndLang = this.languageType
            })
            this.isModifyTemplateShow = true
            let param = {dictionaryTypeKey: 'WEB_COMPONT'}
            // 获取页面组建下拉框的数据
            apiDictionaryQueryByCacheTypeKey(param).then(res => {
                this.templateData.compont = res.data
            })
        },
        // 删除模版数据
        delTemplateData (index) {
            let params = {classificationCode: this.deleteData}
            console.log(params)
            delTemplateBasic(params).then(res => {
                this.$Message.info(res.message)
                this.isDelTemplateShow = false
                this.templateDataQuery()
            })
        },
        // 删除弹框
        deleteShow (row) {
            this.isDelTemplateShow = true
            this.deleteData = row.classificationCode
        }
    },
}
</script>

<style lang="scss" scoped>
.template-manage{
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
    .relevance-data{
        .ivu-table-wrapper{
            width: 100%;
        }
    }
}
.modal-title{
    width: 100%;
    display: inline-block;
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
