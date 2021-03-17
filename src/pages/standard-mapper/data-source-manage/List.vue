<template>
    <div class="data-source-manage">
        <adt-search-folder
            :searchRouter="{ query: { sourceCode: search.sourceCode, displayName: search.displayName, remark: search.remark, examineStatus: search.examineStatus, useStatus: search.useStatus } }"
            :isStatus="true"
        >
            <template slot="status">
                <div class="status">
                    <Col span="10">
                        <div class="name">审核状态:</div>
                        <span
                            v-for="status in auditStatus"
                            :key="status.dictionaryKey"
                            :class="{ 'click-status': search.examineStatus === status.dictionaryKey }"
                            @click="chooseExamineStatus(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                    <Col span="14">
                        <div class="name">启用状态:</div>
                        <span
                            v-for="status in enableStatus"
                            :key="status.dictionaryKey"
                            :class="{ 'click-status': search.useStatus === status.dictionaryKey }"
                            @click="chooseUseStatus(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                </div>
            </template>
            <template slot="always-show">
                <Col class="form-item" span="6">
                    <span>数据源编号:</span>
                    <Input v-model="search.sourceCode" clearable />
                </Col>
                <Col class="form-item" span="6">
                    <span>数据源名称:</span>
                    <Input v-model="search.displayName" clearable />
                </Col>
                <Col class="form-item" span="6">
                    <span>数据源内容:</span>
                    <Input v-model="search.remark" clearable />
                </Col>
            </template>
        </adt-search-folder>
        <div class="content">
            <div class="btns-paginator">
                <adt-button>
                    <Button @click="add()">
                        新增数据源
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-andaotongV3ICON_tianjia" />
                        </svg>
                    </Button>
                    <Button @click="startUsing(apiEnable, '', ...startAndStopData)">
                        {{ '批量启用' + (isManager ? '' : '申请') }}
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-shenqing" />
                        </svg>
                    </Button>
                    <Button @click="stopUsing(apiDisable, '', ...startAndStopData)">
                        {{ '批量停用' + (isManager ? '' : '申请') }}
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-shenqing" />
                        </svg>
                    </Button>
                </adt-button>
                <adt-paginator :currentPage="~~page" :total="~~total" />
            </div>
            <div class="public-table-data">
                <Table
                    tooltip-theme="light"
                    :columns="columns"
                    :data="tableData"
                    stripe
                    @on-selection-change="selectionChange"
                >
                    <template #createDatetime="{ row }">
                        {{ timestampFormat(row.createDatetime) }}
                    </template>
                    <template #examineDatetime="{ row }">
                        {{ timestampFormat(row.examineDatetime) }}
                    </template>
                    <!-- 审核状态 -->
                    <template #examineStatus="{ row }">
                        <span :class="{ 'success': row.examineStatus === 'pass', 'error': row.examineStatus === 'fail' }">
                            {{ row.examineStatusTranslate }}
                        </span>
                    </template>
                    <!-- 启用状态 -->
                    <template #useStatus="{ row }">
                        <span :class="{ 'success': row.useStatus === 'enable', 'error': row.useStatus === 'disable' }">
                            {{ row.useStatusTranslate }}
                        </span>
                    </template>
                    <template #action="{ row }">
                        <!-- 审核状态为待审核（wait），不显示启用停用按钮 -->
                        <span
                            v-if="(!row.useStatus || row.useStatus === 'disable') && row.examineStatus !== 'wait'"
                            class="icon-action icon-action-word"
                            title="启用"
                            @click="startUsing(apiEnable, row, ...startAndStopData)"
                        >启</span>
                        <span
                            v-if="(row.useStatus && row.useStatus === 'enable') && row.examineStatus !== 'wait'"
                            class="icon-action icon-action-word"
                            title="停用"
                            @click="stopUsing(apiDisable, row, ...startAndStopData)"
                        >停</span>
                        <span title="审核">
                            <svg
                                v-if="isManager && row.examineStatus === 'wait'"
                                class="icon-action iconfont"
                                aria-hidden="true"
                                @click="examine(row, 'sourceCode', 'version')"
                            >
                                <use xlink:href="#icon-andaotongV3ICON_shenhe" />
                            </svg>
                        </span>
                        <!-- <span title="编辑">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="edit(row)">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                            </svg>
                        </span> -->
                        <!-- 只有管理员才能删除 -->
                        <span v-if="isManager && row.useStatus !== 'enable'" title="删除">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="remove(row, ['sourceCode', 'trtr'])">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-shanchu" />
                            </svg>
                        </span>
                        <!-- <span title="详情">
                            <svg class="icon-action iconfont" aria-hidden="true" @click="detail(row)">
                                <use xlink:href="#icon-andaotongV3ICON_caozuo-xiangqing" />
                            </svg>
                        </span> -->
                    </template>
                </Table>
            </div>
        </div>
        <!-- 新增数据源modal -->
        <adt-my-modal
            okText="保存"
            width="600"
            :title="modalTitle"
            :showModal="isModalShow"
            @on-visible-change="addVisibleChange"
            @on-ok="save()"
            @on-cancel="cancel()"
        >
            <Form
                ref="formItemData"
                label-position="left"
                class="two-column"
                :model="formItem"
                :rules="formItemRule"
                :label-width="96"
                inline
                label-colon
            >
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px dashed #e5e5e5;">
                    <FormItem label="数据源类型" prop="sourceType">
                        <Select v-model="formItem.sourceType" clearable @on-change="chooseSourceType">
                            <Option v-for="item in dataSourceType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                {{ item.dictionaryValue }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-if="formItem.sourceType !== 'EXE'" label="表名" prop="tableName">
                        <Select v-model="formItem.tableName" clearable @on-change="chooseTableName">
                            <Option v-for="(item, index) in tableNames" :key="index" :value="item.tableName">
                                {{ item.tableComment }}
                            </Option>
                        </Select>
                    </FormItem>
                </div>
            </Form>
            <div v-if="sceneNames.length" :class="['scene-btns', { spread: isSceneSpread }]">
                <adt-tab-btns
                    class="scene-tab"
                    :titleNames="sceneNames"
                    :isSmallBtn="true"
                    :btnIndex="sceneTabIndex || -1"
                    @handleBtn="handleSceneBtn"
                />
                <div class="right-item">
                    <div class="show-all-scene" @click="isSceneSpread = !isSceneSpread">
                        {{ `${!isSceneSpread ? '展开' : '收起'}所有 >` }}
                    </div>
                </div>
            </div>
            <div v-if="sceneTabIndex !== -1" class="task-btns">
                <adt-tab-btns
                    class="task-tab"
                    :titleNames="taskNames"
                    :isSmallBtn="true"
                    :btnIndex="taskTabIndex || -1"
                    @handleBtn="handleTaskBtn"
                />
            </div>
            <div v-if="sceneTabIndex !== -1 && taskTabIndex !== -1" class="choose-task">
                <title>选择{{ taskTabIndex === 1 ? '基础' : '附加' }}任务</title>
                <RadioGroup v-model="taskInfo" class="tasks" @on-change="chooseTask">
                    <Radio v-for="item in tasks" :key="item.taskCode" :label="`${item.taskCode}~${item.taskName}~${item.taskType}`">
                        {{ item.taskName }}
                    </Radio>
                </RadioGroup>
            </div>
            <div v-if="taskInfo || (formItem.sourceType !== 'EXE' && formItem.tableName)" class="database">
                <title>选择数据库字段</title>
                <Table
                    :columns="dbColumns"
                    :data="dbTableData"
                    max-height="300"
                    stripe
                    @on-selection-change="dbSelectionChange"
                >
                    <template #displayName="{ row, index }">
                        <div style="position: relative;">
                            <span class="required-tag">*</span>
                            <Input v-model.trim="row.displayName" maxlength="10" clearable @on-change="changeRowData(row, index, 'displayName')" />
                        </div>
                    </template>
                </Table>
            </div>
            <div>
                <div style="margin-bottom: 6px;">备注信息:</div>
                <Input v-model.trim="formItem.remark" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
        <!-- 审核modal -->
        <adt-my-modal
            width="600"
            :title="examineModalTitle"
            :showModal="isExamineModalShow"
            @on-visible-change="examineVisibleChange"
            @on-ok="examineSave(apiEnableExamPass, apiEnableExamFail, apiDisableExamPass, apiDisableExamFail)"
        >
            <RadioGroup v-model="agree" style="margin-bottom: 20px;">
                <Radio label="1">同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
                <Radio label="0" style="margin-left: 30px;">不同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
            </RadioGroup>
            <div v-show="agree === '0'">
                <div class="reason-name" style="margin-bottom: 6px;">填写驳回原因:</div>
                <Input v-model.trim="reason" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
        <!-- 删除modal -->
        <adt-my-modal
            :showModal="isActionDel"
            title="系统提示"
            @on-visible-change="visibleChange"
            @on-ok="confirmDel(apiDel)"
        >
            <div>
                <div style="margin-bottom: 6px;">填写删除原因:</div>
                <Input v-model.trim="delInfo.removeRsn" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
    import {
        apiQueryDataSource,
        apiAddDataSource,
        apiEnableDataSource,
        apiDisableDataSource,
        apiEnableExamPassDataSource,
        apiEnableExamFailDataSource,
        apiDisableExamPassDataSource,
        apiDisableExamFailDataSource,
        apiDelDataSource,
        apiGetTableBySourceType,
        apiGetTableFieldByTable,
        apiGetSceneList,
        apiGetSceneTask,
        apiGetTaskData
    } from '@/api/standard-mapper/dataSourceManage'
    import validateRules from '@/libs/validateRules'
    import { isRepeat } from '@/libs/utils'
    import standardMapperList from '@/mixins/standardMapperList'
    import { columns, dbColumns } from './data'
    export default {
        name: 'DataSourceManage',
        mixins: [standardMapperList],
        props: {
            sourceCode: '',
            displayName: '',
            db: '',
            examineStatus: '',
            useStatus: ''
        },
        data () {
            return {
                // 任务类型
                taskType: this.$getDictionary('TASK_TYPE'),
                // 数据源类型
                dataSourceType: this.$getDictionary('DATA_SOURCE_TYPE'),

                // （批量）启用（申请）、（批量）停用（申请）api，作为参数传到mixin
                // 操作员启用申请、管理员启用
                apiEnable: apiEnableDataSource,
                // 操作员停用申请、管理员停用
                apiDisable: apiDisableDataSource,
                // 后端需要的启用、停用字段
                startAndStopData: ['sourceCode', 'version', 'useStatus', 'examineStatus'],

                // 审核的api，作为参数传到mixin
                // 启用同意
                apiEnableExamPass: apiEnableExamPassDataSource,
                // 启用不同意
                apiEnableExamFail: apiEnableExamFailDataSource,
                // 停用同意
                apiDisableExamPass: apiDisableExamPassDataSource,
                // 停用不同意
                apiDisableExamFail: apiDisableExamFailDataSource,

                // 删除的api，作为参数传到mixin
                apiDel: apiDelDataSource,

                // 传到mixin
                name: '数据源',
                search: {
                    sourceCode: this.sourceCode,
                    displayName: this.displayName,
                    remark: this.remark,
                    examineStatus: this.examineStatus,
                    useStatus: this.useStatus
                },
                // 表格数据
                tableData: [],
                // 表格列配置
                columns,
                // 数据可字段表格数据
                dbTableData: [],
                // 数据库表格列配置
                dbColumns,
                // 新增form信息
                formItem: {
                    sourceType: '',
                    tableName: '',
                    remark: '',
                },
                // 表单校验
                formItemRule: {
                    sourceType: [
                        validateRules.select('数据源类型')[0]
                    ],
                    tableName: [
                        validateRules.select('表名')[0]
                    ]
                },
                // modal数据库字段选中的值
                selectedData: [],
                // 场景
                sceneData: [],
                sceneNames: [],
                sceneName: '',
                sceneCode: '',
                sceneTabIndex: -1,
                isSceneSpread: false,
                // 任务
                taskNames: [],
                taskTabIndex: -1,
                // 任务信息（包含taskCode、taskType、taskName）
                taskInfo: '',
                tasks: [],
                // 表名
                tableNames: []
            }
        },
        mounted () {
            // 取出任务类型的名称用于展示
            for (const item of this.taskType) {
                this.taskNames.push(item.dictionaryValue)
            }
        },
        methods: {
            // 选择数据库列表数据
            dbSelectionChange (selectedData) {
                this.selectedData = selectedData
            },
            // 获取列表数据
            getData () {
                const data = {
                    page: this.page,
                    ...this.search
                }
                apiQueryDataSource({ data }).then(({ data }) => {
                    this.tableData = data.content || []
                    this.total = data.totalElements
                })
            },
            // 取消新增,重置数据
            cancel () {
                this.$refs.formItemData.resetFields()
                this.reset()
            },
            // 修改数据源
            edit (row) {
                this.isAdd = false
                const params = { name: row.name }
                getQueryDataSource(params).then(res => {
                    this.formItem = res.data
                    this.formItem.maxLength = this.formItem.maxLength.toString()
                    this.formItem.rules = res.data.rules || []
                    this.isModalShow = true
                    this.modalTitle = '编辑数据源'
                })
            },
            // 详情
            detail (row) {
                this.$router.push(`/standard-mapper/data-source-manage/detail/${row.name}`)
            },
            // 保存数据源
            save () {
                const vm = this
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        if (!this.verifyItem()) return
                        const taskInfo = this.taskInfo.split('~')
                        const data = { ...this.formItem }
                        data.dataSourceDisplaysName = this.selectedData
                        // 执行
                        if (this.formItem.sourceType === 'EXE') {
                            data.taskCode = taskInfo[0]
                            data.taskName = taskInfo[1]
                            data.taskType = taskInfo[2]
                            data.sceneName = this.sceneName
                            data.sceneCode = this.sceneCode
                            // 数据源为执行，表名置空
                            data.tableName = ''
                        }
                        // 新增保存
                        if (this.isAdd) {
                            apiAddDataSource({ data }).then(res => {
                                successCallback()
                            })
                        } else {
                            // 编辑保存
                            apiUpdateDataSource({ data }).then(res => {
                                successCallback()
                            })
                        }
                    }
                })
                function successCallback () {
                    vm.$Message.info("保存成功")
                    // 重置表单数据
                    vm.$refs.formItemData.resetFields()
                    // 重置
                    vm.reset()
                    // 隐藏新增模态框
                    vm.isModalShow = false
                    // 刷新列表
                    vm.getData()
                }
            },
            // 数据库字段发生改变
            changeRowData (row, index, key) {
                // 将改行改变后的数据更新到accountData，后续选中才有数据
                this.dbTableData[index] = row
                // 先选中，再选择帐户类型，需要手动改变选中的帐户的帐户类型
                for (const item of this.selectedData) {
                    if (item.columnName === row.columnName) {
                        item[key] = row[key]
                        break
                    }
                }
            },
            // 新增任务保存、预览排序校验
            verifyItem () {
                // 至少选择一个数据库字段
                if (!this.selectedData.length) {
                    this.$Message.warning('请至少选择一个数据库字段！')
                    return false
                }
                const displayName = []
                for (const item of this.selectedData) {
                    // 勾选的数据库字段的字段显示名称必填
                    if (!item.displayName) {
                        this.$Message.warning('选中的数据库字段的字段显示名称必填！')
                        return false
                    }
                    displayName.push(item.displayName)
                }
                // 勾选的数据库字段的字段显示名称不能重复
                if (isRepeat(displayName)) {
                    this.$Message.warning('选中的数据库字段的字段显示名称不能重复！')
                    return false
                }
                return true
            },
            // 选择数据源类型
            chooseSourceType (val) {
                // 重置也会触发change事件
                if (!val) return
                // 数据源类型为执行，获取场景
                if (val === 'EXE') {
                    apiGetSceneList().then(({ data }) => {
                        const sceneNames = []
                        this.sceneData = data
                        for (const item of data) {
                            sceneNames.push(item.sceneName)
                        }
                        this.sceneNames = sceneNames
                    })
                } else {
                    // 数据源类型为非执行，获取表名
                    apiGetTableBySourceType({ sourceType: this.formItem.sourceType }).then(({ data }) => {
                        this.tableNames = data
                    })
                }
                // 重置
                this.reset()
            },
            // 选择表名
            chooseTableName () {
                // 重置也会触发change事件
                if (!this.formItem.tableName) return
                apiGetTableFieldByTable({ tableName: this.formItem.tableName }).then(({ data }) => {
                    this.dbTableData = data
                })
            },
            // 切换场景
            handleSceneBtn (index, sceneName) {
                this.sceneTabIndex = index + 1
                this.sceneCode = this.sceneData[index].sceneCode
                this.sceneName = sceneName
                // 重置
                this.taskTabIndex = -1
                this.taskInfo = ''
            },
            // 切换任务
            handleTaskBtn (index) {
                this.taskTabIndex = index + 1
                // 重置
                this.taskInfo = ''
                // 查询场景下的所有任务
                apiGetSceneTask({ data: { sceneCode: this.sceneCode, taskType: this.taskType[index].dictionaryKey } }).then(({ data }) => {
                    this.tasks = data
                })
            },
            // 选择任务
            chooseTask () {
                apiGetTaskData({ taskCode: this.taskInfo.split('~')[0] }).then(({ data }) => {
                    this.dbTableData = data
                })
            },
            // 重置数据
            reset () {
                // 重置选中的数据库字段
                this.selectedData = []
                // 重置
                this.taskInfo = ''
                this.sceneNames = []
                this.sceneCode = ''
                this.sceneName = ''
                this.formItem.remark = ''
                this.isSceneSpread = false
                this.sceneTabIndex = -1
                this.taskTabIndex = -1
            }
        }
    }
</script>

<style lang="scss" scoped>
    title {
        display: block;
    }
    /deep/ .ivu-form-item {
        margin-right: 0;
    }
    .database {
        margin: 30px 0 20px 0;
        title {
            margin-bottom: 10px;
        }
        .required-tag {
            position: absolute;
            left: -10px;
            z-index: 10;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            font-family: SimSun;
            color: #ff001b;
        }
    }
    .scene-btns {
        display: flex;
        justify-content: space-between;;
        height: 45px;
        margin: 20px 0 0 -10px;
        overflow: hidden;
        &.spread {
            height: auto;
            max-height: 300px;
            overflow-y: auto;
        }
        /deep/ .small-btn .tabBtn {
            margin: 0 10px 20px 10px;
        }
        & > .show-all-scene {
            width: 200px;
            text-align: right;
            cursor: pointer;
        }
        .right-item {
            display: flex;
            justify-content: flex-end;
            // align-items: center;
            width: 200px;
            .show-all-scene {
                flex-shrink: 0;
                margin-left: 32px;
                line-height: 24px;
                cursor: pointer;
            }
        }
    }
    .task-btns {
        margin-bottom: 20px;
    }
    .choose-task {
        margin-bottom: 20px;
        padding: 20px 0;
        border-top: 1px dashed $border-color;
        border-bottom: 1px dashed $border-color;
        .tasks {
            width: 100%;
            /deep/ .ivu-radio-wrapper {
                &:nth-child(3n + 2) {
                    text-align: center;
                }
                &:nth-child(3n + 3) {
                    text-align: right;
                }
                width: 33%;
                margin: 20px 0 0 0;
            }
        }
    }
</style>
