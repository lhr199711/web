<template>
    <div>
        <adt-search-folder
            :searchRouter="{query: {dictionaryKey: search.dictionaryKey, dictionaryTypeKey: search.dictionaryTypeKey, dictionaryValue: search.dictionaryValue, dictionaryTypeValue: search.dictionaryTypeValue, searchMark: 2}}"
        >
            <template slot="always-show">
                <Col span="6" class="form-item">
                    <span> 字典名称:</span>
                    <Input v-model="search.dictionaryValue" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span> 字典code:</span>
                    <Input v-model="search.dictionaryKey" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span> 字典类型名称:</span>
                    <Input v-model="search.dictionaryTypeValue" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span> 字典类型code:</span>
                    <Input v-model="search.dictionaryTypeKey" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="addDictionary()">新增字典
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                    </svg>
                </Button>
            </AdtButton>
            <adt-paginator :multipleFormJudgment=2 :currentPage="~~page" :total="~~total"/>
        </div>
        <AdtMyModal :title="modelTitle" okText="保存" cancelText="取消" @on-visible-change="isShow" :showModal="isModalDictionary" @on-ok="save()" @on-cancel="cancel()">
            <Form :model="formDictionary" :label-width="120" ref="formDictionaryData" :rules="formDictionaryRule" label-colon class="one-column">
                <FormItem label="字典Code" prop="dictionaryKey">
                    <Input v-model.trim="formDictionary.dictionaryKey"></Input>
                </FormItem>
                <FormItem label="字典名称" prop="dictionaryValue">
                    <Input v-model.trim="formDictionary.dictionaryValue"></Input>
                </FormItem>
                <FormItem label="字典类型Code" prop="dictionaryTypeKey">
                    <Select v-model="formDictionary.dictionaryTypeKey">
                        <Option v-for="(selectData, id) in dictionaryTypeKey" :key="id" :value="selectData.dictionaryValue">{{selectData.dictionaryValue}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="字典状态" prop="dictionaryStatus">
                    <Select v-model="formDictionary.dictionaryStatus">
                        <Option v-for="(selectData, id) in formStatus" :key="id" :value="selectData.statusKey">{{selectData.statusValue}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="字典语言" prop="dictionaryLangName">
                    <Select v-model="formDictionary.dictionaryLangName">
                        <Option v-for="(selectData, id) in dictionaryLanguage" :key="id" :value="selectData.languageKey">{{selectData.languageValue}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="字典描述" prop="dictionaryDescribe">
                    <Input v-model="formDictionary.dictionaryDescribe" type="textarea"></Input>
                </FormItem>
            </Form>
        </AdtMyModal>
        <div class="public-table-data">
            <Table :columns="tableTwoColumns" :data="tableTwoData" stripe>
                <!-- 状态 -->
                <template slot-scope="{ row, index }" slot="status">
                    <span v-if="row.dictionaryStatus == 'enable'">可用</span>
                    <span v-if="row.dictionaryStatus == 'disable'">禁用</span>
                </template>
                <!-- 操作 -->
                <template slot-scope="{ row, index }" slot="action">
                    <svg class="icon-action iconfont" aria-hidden="true" @click="dictionaryEdit(row, index)">
                        <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                    </svg>
                    <svg class="icon-action iconfont" aria-hidden="true" @click="dictionaryRemove(row, index)">
                        <use xlink:href="#icon-andaotongV3ICON_caozuo-shanchu" />
                    </svg>
                </template>
            </Table>
        </div>
        <!-- 单个删除调用的确认模态框 -->
        <adt-reconfirm-modal :showModal="isActionDel" @on-visible-change="visibleChange" @on-ok="allDelClick()" />
    </div>
</template>

<script>
import paginator from '@/mixins/paginator'
import { tableTwoColumns } from './data'
import { apiDictionaryAdd, apiDictionaryTypeQueryList, apiDictionaryQueryListByKeyAndType, apiDictionaryUpdate, apiDictionaryDeleteById } from '@/api/dictionary'
import validateRules from '@/libs/validateRules'
export default {
    mixins: [paginator],
    data() {
        return {
            modelTitle: '',
            // 新增字典模态框
            isModalDictionary: false,
            // 字典校验规则
            formDictionaryRule: {
                dictionaryKey: [
                    validateRules.required('字典key')[0],
                ],
                dictionaryLangName: [
                    validateRules.required('字典名称')[0],
                ],
                dictionaryStatus: [
                    validateRules.select('字典类型')[0],
                ],
                dictionaryTypeId: [
                    validateRules.select('字典状态')[0],
                ],
                dictionaryValue: [
                    validateRules.select('字典语言')[0],
                ]
            },
            formDictionary: {
                dictionaryDescribe: '',
                dictionaryKey: '',
                dictionaryLangName: '',
                dictionaryStatus: '',
                dictionaryTypeId: '',
                dictionaryValue: ''
            },
            // 新增编辑操作区分
            // 1为新增字典类型，2为新增字典，3为编辑字典类型，4为编辑字典，5为字典类型删除，6为字典删除
            distinguish: 0,
            search: {
                dictionaryKey: this.dictionaryKey,
                dictionaryTypeKey: this.dictionaryTypeKey,
                dictionaryValue: this.dictionaryValue,
                dictionaryTypeValue: this.dictionaryTypeValue
            },
            tableTwoColumns,
            tableTwoData: [],
            formStatus: [
                { statusKey: 'enable', statusValue: '可用'},
                { statusKey: 'disable', statusValue: '禁用'}
            ],
            dictionaryLanguage: [
                { languageKey: 'zh-cn', languageValue: '中文'},
                { languageKey: 'en-us', languageValue: '英文'}
            ],
            dictionaryTypeKey: [],
            isActionDel: false,
            rowData: {},
            passData: {}
        }
    },
    methods: {
        visibleChange (changeStatus) {
            this.isActionDel = changeStatus
        },
        dataInit () {
            this.getDictionaryData()
        },
        // 获取/查询字典列表数据
        getDictionaryData (index) {
            let data = {}
            if (index) {
                data = {
                    size: 15,
                    page: this.page,
                    dictionaryTypeKey: this.rowData,
                }
            } else {
                data = {
                    size: 15,
                    page: this.page,
                    dictionaryKey: this.search.dictionaryKey,
                    dictionaryTypeKey: this.search.dictionaryTypeKey,
                    dictionaryValue: this.search.dictionaryValue,
                    dictionaryTypeValue: this.search.dictionaryTypeValue
                }
            }
            apiDictionaryQueryListByKeyAndType({ data: data }).then(res => {
                if (res.code == 200) {
                    this.tableTwoData = res.data.content
                    this.total = res.data.totalElements
                }
            })
        },
        // 新增
        addDictionary () {
                this.isModalDictionary = true
                this.distinguish = 2
                this.modelTitle = '新增字典'
                this.getDictionaryTypeQueryListData()
        },
        // 获取字典类型key下拉列表数据
        getDictionaryTypeQueryListData () {
            let data = {
                size: 200,
            }
            apiDictionaryTypeQueryList({ data: data }).then(res => {
                if (res.code == 200) {
                    res.data.content.forEach(element => {
                        if (element.dictionaryTypeStatus == 'enable') {
                            this.dictionaryTypeKey.push({dictionaryKey: element.dictionaryTypeId, dictionaryValue: element.dictionaryTypeKey})
                        }
                    });
                }
            })
        },
        // 同步新增字典模态框的显示状态
        isShow (val) {
            this.isModalDictionary = val
        },
        // 同步新增字典类型模态框的显示状态
        isTypeShow (val) {
            this.isModalType = val
        },
        // 编辑字典/类型保存
        save () {
            // 新增字典保存
            if (this.distinguish == 2) {
                const data = {
                    dictionaryDescribe: this.formDictionary.dictionaryDescribe,
                    dictionaryKey: this.formDictionary.dictionaryKey,
                    dictionaryLangName: this.formDictionary.dictionaryLangName,
                    dictionaryStatus: this.formDictionary.dictionaryStatus,
                    dictionaryValue: this.formDictionary.dictionaryValue,
                    dictionaryTypeKey: this.formDictionary.dictionaryTypeKey
                }
                this.$refs["formDictionaryData"].validate((valid) => {
                    if (valid) {
                        apiDictionaryAdd({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                this.isModalDictionary = false
                                // 重置新增模态框
                                this.$refs.formDictionaryData.resetFields()
                                // 刷新字典列表
                                this.getDictionaryData()
                            }
                        })
                    }
                })
            }
            // 字典编辑保存
            if (this.distinguish == 4) {
                const data = {
                    dictionaryId: this.formDictionary.dictionaryId,
                    dictionaryDescribe: this.formDictionary.dictionaryDescribe,
                    dictionaryKey: this.formDictionary.dictionaryKey,
                    dictionaryLangName: this.formDictionary.dictionaryLangName,
                    dictionaryStatus: this.formDictionary.dictionaryStatus,
                    dictionaryTypeKey: this.formDictionary.dictionaryTypeKey,
                    dictionaryValue: this.formDictionary.dictionaryValue,
                    version: this.formDictionary.version
                }
                this.$refs["formDictionaryData"].validate((valid) => {
                    if (valid) {
                        apiDictionaryUpdate({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                this.isModalDictionary = false
                                // 重置新增模态框
                                this.$refs.formDictionaryData.resetFields()
                                // 刷新字典列表
                                this.getDictionaryData()
                            }
                        })
                    }
                })
            }
        },
        cancel () {
            this.isModalDictionary = false
            // 重置form表单
            this.$refs.formDictionaryData.resetFields()
            // 刷新字典列表
            this.getDictionaryData()
        },
        // 字典编辑
        dictionaryEdit (row, index) {
            this.isModalDictionary = true
            this.distinguish = 4
            this.formDictionary = row
            this.modelTitle = '编辑字典'
            this.getDictionaryTypeQueryListData()
        },
        // 字典删除
        dictionaryRemove (row, index) {
            this.isActionDel = true
            this.distinguish = 6
            this.passData = {
                dictionaryId: [row.dictionaryId]
            }
        },
        allDelClick () {
            // 字典删除保存
            if (this.distinguish == 6) {
                apiDictionaryDeleteById({ data: this.passData }).then(res => {
                    if (res.code == 200) {
                        this.$Message.info("删除成功")
                        this.isActionDel = false
                        // 刷新字典列表
                        this.getDictionaryData()
                    }
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    @import "./style.scss"
</style>
