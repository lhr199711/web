<template>
    <div>
        <adt-search-folder
            :searchRouter="{query: {dictionaryTypeKey: searchType.dictionaryTypeKeyType, dictionaryTypeValue: searchType.dictionaryTypeValue, searchMark: 1}}"
        >
            <template slot="always-show">
                <Col span="6" class="form-item">
                    <span> 字典类型名称:</span>
                    <Input v-model="searchType.dictionaryTypeValue" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span> 字典类型code:</span>
                    <Input v-model="searchType.dictionaryTypeKeyType" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="addDictionary()">新增类型
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                    </svg>
                </Button>
            </AdtButton>
            <adt-paginator :multipleFormJudgment=1 :currentPage="~~page" :total="~~total"/>
        </div>
        <AdtMyModal :title="modelTitle" okText="保存" cancelText="取消" :showModal="isModalType" @on-visible-change="isTypeShow" @on-ok="save()" @on-cancel="cancel()">
            <Form :model="formDictionaryType" :label-width="120" ref="formDictionaryTypeData" :rules="formDictionaryTypeRule" label-colon class="one-column">
                <FormItem label="字典类型Code" prop="dictionaryTypeKey">
                    <Input v-model.trim="formDictionaryType.dictionaryTypeKey"></Input>
                </FormItem>
                <FormItem label="字典类型名称" prop="dictionaryTypeValue">
                    <Input v-model.trim="formDictionaryType.dictionaryTypeValue"></Input>
                </FormItem>
                <FormItem label="字典状态" prop="dictionaryTypeStatus">
                    <Select v-model="formDictionaryType.dictionaryTypeStatus">
                        <Option v-for="(selectData, id) in formStatus" :key="id" :value="selectData.statusKey">{{selectData.statusValue}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="字典类型描述" prop="dictionaryTypeDescribe">
                    <Input v-model="formDictionaryType.dictionaryTypeDescribe" type="textarea"></Input>
                </FormItem>
            </Form>
        </AdtMyModal>
        <div class="public-table-data">
            <Table :columns="tableColumns" :data="tableData" stripe @on-row-click="rowClick">
                <!-- 状态 -->
                <template slot-scope="{ row, index }" slot="status">
                    <span v-if="row.dictionaryTypeStatus == 'enable'">可用</span>
                    <span v-if="row.dictionaryTypeStatus == 'disable'">禁用</span>
                </template>
                <!-- 操作 -->
                <template slot-scope="{ row, index }" slot="action">
                    <svg class="icon-action iconfont" aria-hidden="true" @click="tpyeEdit(row, index)">
                        <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                    </svg>
                    <svg class="icon-action iconfont" aria-hidden="true" @click="typeRemove(row, index)">
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
import { tableColumns, tableTwoColumns } from './data'
import { apiDictionaryTypeAdd, apiDictionaryTypeQueryList, apiDictionaryTypeUpdate, apiDictionaryTypeDeleteByKey } from '@/api/dictionary'
import validateRules from '@/libs/validateRules'
export default {
    mixins: [paginator],
    data() {
        return {
            modelTitle: '',
            isFoldShow: false,
            // 新增类型模态框
            isModalType: false,
            // 字典类型校验规则
            formDictionaryTypeRule: {
                dictionaryTypeKey: [
                    validateRules.required('字典类型')[0],
                ],
                dictionaryTypeValue: [
                    validateRules.required('字典类型名称')[0],
                ],
                dictionaryTypeStatus: [
                    validateRules.select('字典类型状态')[0]
                ]
            },
            formDictionaryType: {
                dictionaryTypeKey: '',
                dictionaryTypeValue: '',
                dictionaryTypeStatus: '',
                dictionaryTypeDescribe: ''
            },
            // 新增编辑操作区分
            // 1为新增字典类型，2为新增字典，3为编辑字典类型，4为编辑字典，5为字典类型删除，6为字典删除
            distinguish: 0,
            searchType: {
                dictionaryTypeKeyType: this.dictionaryTypeKeyType,
                dictionaryTypeValue: this.dictionaryTypeValue
            },
            tableColumns,
            tableTwoColumns,
            tableData: [],
            tableTwoData: [],
            formStatus: [
                { statusKey: 'enable', statusValue: '可用'},
                { statusKey: 'disable', statusValue: '禁用'}
            ],
            dictionaryTypeKey: [],
            isActionDel: false,
            rowData: {},
            passData: {},
        }
    },
    methods: {
        visibleChange (changeStatus) {
            this.isActionDel = changeStatus
        },
        dataInit () {
            this.getDictionaryTypeQueryList()
        },
        // 获取字典类型列表数据
        getDictionaryTypeQueryList () {
            let data = {
                size: 15,
                page: this.page,
                dictionaryTypeKey: this.searchType.dictionaryTypeKeyType,
                dictionaryTypeValue: this.searchType.dictionaryTypeValue
            }
            apiDictionaryTypeQueryList({ data: data }).then(res => {
                if (res.code == 200) {
                    this.tableData = res.data.content
                    this.total = res.data.totalElements
                }
            })
        },
        rowClick (row) {
            this.rowData = row.dictionaryTypeKey
        },
        // 新增
        addDictionary () {
            this.isModalType = true
            this.distinguish = 1
            this.modelTitle = '新增字典类型'
        },
        // 获取字典类型key下拉列表数据
        getDictionaryTypeQueryListData () {
            let data = {
                size: 200,
            }
            apiDictionaryTypeQueryList({ data: data }).then(res => {
                if (res.code == 200) {
                    res.data.content.forEach(element => {
                        this.dictionaryTypeKey.push({dictionaryKey: element.dictionaryTypeId, dictionaryValue: element.dictionaryTypeKey})
                    });
                }
            })
        },
        // 同步新增字典类型模态框的显示状态
        isTypeShow (val) {
            this.isModalType = val
        },
        // 编辑字典/类型保存
        save () {
            // 新增字典类型保存
            if (this.distinguish == 1) {
                const data = {
                    dictionaryTypeKey: this.formDictionaryType.dictionaryTypeKey,
                    dictionaryTypeValue: this.formDictionaryType.dictionaryTypeValue,
                    dictionaryTypeStatus: this.formDictionaryType.dictionaryTypeStatus,
                    dictionaryTypeDescribe: this.formDictionaryType.dictionaryTypeDescribe
                }
                this.$refs["formDictionaryTypeData"].validate((valid) => {
                    if (valid) {
                        apiDictionaryTypeAdd({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                this.isModalType = false
                                // 重置新增模态框
                                this.$refs.formDictionaryTypeData.resetFields()
                                // 刷新字典类型列表
                                this.getDictionaryTypeQueryList()
                            }
                        })
                    }
                })
            }
            // 编辑字典类型保存
            if (this.distinguish == 3) {
                const data = {
                    // dictionaryTypeId: this.formDictionaryType.dictionaryTypeId,
                    dictionaryTypeDescribe: this.formDictionaryType.dictionaryTypeDescribe,
                    dictionaryTypeKey: this.formDictionaryType.dictionaryTypeKey,
                    dictionaryTypeStatus: this.formDictionaryType.dictionaryTypeStatus,
                    dictionaryTypeValue: this.formDictionaryType.dictionaryTypeValue,
                    version: this.formDictionaryType.version
                }
                this.$refs["formDictionaryTypeData"].validate((valid) => {
                    if (valid) {
                        apiDictionaryTypeUpdate({ data: data }).then(res => {
                            if (res.code == 200) {
                                this.$Message.info("保存成功")
                                this.isModalType = false
                                // 刷新字典类型列表
                                this.getDictionaryTypeQueryList()
                                // 重置form表单
                                this.$refs.formDictionaryTypeData.resetFields()
                            }
                        })
                    }
                })
            }
        },
        cancel () {
            this.isModalType = false
            // 重置form表单
            this.$refs.formDictionaryTypeData.resetFields()
            // 刷新字典类型列表
            this.getDictionaryTypeQueryList()
        },
        // 字典类型编辑
        tpyeEdit (row, index) {
            this.isModalType = true
            this.distinguish = 3
            this.formDictionaryType = row
            this.modelTitle = '编辑字典类型'
        },
        // 字典类型删除
        typeRemove (row, index) {
            this.isActionDel = true
            this.distinguish = 5
            this.passData = {
                dictionaryTypeKey: row.dictionaryTypeKey
            }
        },
        allDelClick () {
            // 字典类型删除保存
            if (this.distinguish == 5) {
                apiDictionaryTypeDeleteByKey(this.passData).then(res => {
                    if (res.code == 200) {
                        this.$Message.info("删除成功")
                        this.isActionDel = false
                        // 刷新字典类型列表
                        this.getDictionaryTypeQueryList()
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
