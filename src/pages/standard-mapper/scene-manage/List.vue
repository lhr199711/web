<template>
    <div>
        <adt-search-folder
            :searchRouter="{query: {sceneCode: search.sceneCode, sceneName: search.sceneName, serverType: search.serverType, trspType: search.trspType, examineStatus: search.examineStatus, useStatus: search.useStatus}}"
            :isStatus="true">
            <template slot="status">
                <div class="status">
                    <Col span="10">
                        <div class="name">审核状态:</div>
                        <span
                            v-for="status in dictionaryApprovalStatus"
                            :class="{'click-status': search.examineStatus === status.dictionaryKey}"
                            :key="status.dictionaryKey"
                            @click="auditStatus(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                    <Col span="14">
                        <div class="name">启用状态:</div>
                        <span
                            v-for="status in dictionaryEnabledStatus"
                            :key="status.dictionaryKey"
                            :class="{'click-status': search.useStatus === status.dictionaryKey}"
                            @click="enableStatus(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                </div>
            </template>
            <template slot="always-show">
                <Col span="6" class="form-item">
                    <span>场景编号:</span>
                    <Input v-model="search.sceneCode" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span>场景名称:</span>
                    <Input v-model="search.sceneName" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span>服务类型:</span>
                    <Select v-model="search.serverType" class="fromItem-content" clearable>
                        <Option
                            v-for="(selectData, id) in dictionaryServiceType"
                            :key="id"
                            :value="selectData.dictionaryKey"
                        >
                            {{ selectData.dictionaryValue }}
                        </Option>
                    </Select>
                </Col>
                <Col span="6" class="form-item">
                    <span>运输类型:</span>
                    <Select v-model="search.trspType" class="fromItem-content" clearable>
                        <Option
                            v-for="(selectData, id) in dictionaryTransportType"
                            :key="id"
                            :value="selectData.dictionaryKey"
                        >
                            {{ selectData.dictionaryValue }}
                        </Option>
                    </Select>
                </Col>
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="add()">
                        新增场景
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                        </svg>
                    </Button>
                    <Button @click="startUsing()">
                        {{ '批量启用' + (isManager ? '' : '申请') }}
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-shenqing" />
                        </svg>
                    </Button>
                    <Button @click="stopUsing()">
                        {{ '批量停用' + (isManager ? '' : '申请') }}
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-shenqing" />
                        </svg>
                    </Button>
            </AdtButton>
            <adt-paginator class="pagination" :currentPage="~~page" :total="~~total"/>
        </div>
        <AdtMyModal
            :title="modelTitle"
            :showModal="isModalShow"
            okText="保存"
            cancelText="取消"
            width="1300"
            @on-visible-change="addvisibleChange"
            @on-ok="saveAdd()"
            @on-cancel="cancelAdd()"
        >
            <!-- 新增场景 -->
            <div v-if="distinguish == 1">
                <Form
                    class="fromItem"
                    :model="addFormItem"
                    :rules="addFormItemRule"
                    :label-width="85"
                    ref="addFormItemData"
                    label-colon
                >
                    <FormItem label="场景名称" prop="sceneName">
                        <Input class="fromItem-content" v-model="addFormItem.sceneName" />
                    </FormItem>
                    <!-- 服务类型 -->
                    <!-- 服务类型为关务时，运输类型、物流类型为非必填 -->
                    <!-- 服务类型为代理时，服务类型为非必填 -->
                    <FormItem class="fromItem-margin" label="服务类型" prop="serverType">
                        <Select v-model="addFormItem.serverType" class="fromItem-content" @on-select="selectType">
                            <Option
                                v-for="(selectData, id) in dictionaryServiceType"
                                :key="id"
                                :tag="serviceTag"
                                :value="selectData.dictionaryKey"
                            >
                                {{ selectData.dictionaryValue }}
                            </Option>
                        </Select>
                    </FormItem>
                    <!-- 运输类型 -->
                    <!-- <FormItem
                        class="fromItem-margin"
                        :class="addFormItem.serverType === 'A' || !addFormItem.serverType ? '' : 'ivu-form-item-required ivu-form-item-label margin-top'"
                        :show-message="addFormItem.serverType === 'A' || !addFormItem.serverType ? false : true"
                        label="运输类型"
                        prop="trspType"
                    > -->
                    <FormItem
                        v-if="addFormItem.serverType === 'T' || addFormItem.serverType === 'Y' || addFormItem.serverType === 'C'"
                        class="fromItem-margin"
                        label="运输类型"
                        prop="trspType"
                        :class="addFormItem.serverType === 'C' || !addFormItem.serverType ? '' : 'ivu-form-item-required ivu-form-item-label margin-top'"
                        :show-message="addFormItem.serverType === 'C' || !addFormItem.serverType ? false : true"
                    >
                        <Select v-model="addFormItem.trspType" class="fromItem-content" @on-select="selectType">
                            <Option
                                v-for="(selectData, id) in dictionaryTransportType"
                                :key="id"
                                :tag="transportTag"
                                :value="selectData.dictionaryKey"
                            >
                                {{ selectData.dictionaryValue }}
                            </Option>
                        </Select>
                    </FormItem>
                    <!-- 场所类型 -->
                    <FormItem
                        v-if="addFormItem.serverType === 'Y'"
                        class="fromItem-margin"
                        label="场所类型"
                        prop="sttnType"
                    >
                        <Select v-model="addFormItem.sttnType" class="fromItem-content" @on-select="selectType">
                            <Option
                                v-for="(selectData, id) in dictionaryStationType"
                                :key="id"
                                :tag="transportTag"
                                :value="selectData.dictionaryKey"
                            >
                                {{ selectData.dictionaryValue }}
                            </Option>
                        </Select>
                    </FormItem>
                    <!-- 关务类型 -->
                    <FormItem
                        v-if="addFormItem.serverType === 'C'"
                        class="fromItem-margin"
                        label="关务类型"
                        prop="customsType"
                    >
                        <Select v-model="addFormItem.customsType" class="fromItem-content" @on-select="selectType">
                            <Option
                                v-for="(selectData, id) in dictionaryCustomsType"
                                :key="id"
                                :tag="transportTag"
                                :value="selectData.dictionaryKey"
                            >
                                {{ selectData.dictionaryValue }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        class="fromItem-margin"
                        label="物流类型"
                        prop="logisticsType"
                        :class="addFormItem.serverType === 'C' || addFormItem.serverType === 'A' ? '' : 'ivu-form-item-required ivu-form-item-label margin-top'"
                        :show-message="addFormItem.serverType === 'C' || addFormItem.serverType === 'A' ? false : true"
                    >
                        <Select v-model="addFormItem.logisticsType" class="fromItem-content" @on-select="selectType">
                            <Option
                                v-for="(selectData, id) in dictionaryLogisticsType"
                                :key="id"
                                :tag="logisticsTag"
                                :value="selectData.dictionaryKey"
                            >
                                {{ selectData.dictionaryValue }}
                            </Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <!-- 编辑场景 -->
            <div v-if="distinguish == 2">
                <div class="scene-edit">
                    <span class="scene-top">场景编号：{{ editSceneCode }}</span>
                    <span class="scene-top">场景类型：{{ serverTypeTranslate }}</span>
                    <span class="scene-top" v-if="trspTypeTranslate">运输类型：{{ trspTypeTranslate }}</span>
                    <span class="scene-top" v-if="sttnTypeTranslate">场所类型：{{ sttnTypeTranslate }}</span>
                    <span class="scene-top" v-if="customsTypeTranslate">关务类型：{{ customsTypeTranslate }}</span>
                    <Form
                        class="fromItem"
                        :model="editFormItem"
                        :rules="editFormItemRule"
                        :label-width="80"
                        ref="editFormItemData"
                        label-colon
                    >
                        <!-- <FormItem>
                            场景编号{{sceneNumber}}
                        </FormItem>
                        <FormItem>
                            场景编号{{sceneNumber}}
                        </FormItem>
                        <FormItem>
                            场景编号{{sceneNumber}}
                        </FormItem> -->
                        <FormItem label="场景名称" prop="sceneName">
                            <Input class="fromItem-content" v-model="editFormItem.sceneName" />
                        </FormItem>
                        <!-- <FormItem class="fromItem-margin" label="服务类型" prop="serverType">
                            <Select v-model="editFormItem.serverType" class="fromItem-content" @on-select="selectType">
                                <Option
                                    v-for="(selectData, id) in dictionaryServiceType"
                                    :key="id"
                                    :tag="serviceTag"
                                    :value="selectData.dictionaryKey"
                                >
                                    {{ selectData.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem class="fromItem-margin" label="运输类型" prop="trspType">
                            <Select v-model="editFormItem.trspType" class="fromItem-content" @on-select="selectType">
                                <Option
                                    v-for="(selectData, id) in dictionaryTransportType"
                                    :key="id"
                                    :tag="transportTag"
                                    :value="selectData.dictionaryKey"
                                >
                                    {{ selectData.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem class="fromItem-margin" label="物流类型" prop="logisticsType">
                            <Select v-model="editFormItem.logisticsType" class="fromItem-content" @on-select="selectType">
                                <Option
                                    v-for="(selectData, id) in dictionaryLogisticsType"
                                    :key="id"
                                    :tag="logisticsTag"
                                    :value="selectData.dictionaryKey"
                                >
                                    {{ selectData.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem> -->
                    </Form>
                </div>
            </div>
            <hr class="line-solid">
            <adt-tab-btns
                :height="40"
                :isBaseBtn="true"
                :titleNames="titleNames"
                :btnIndex="btnIndex"
                :width="255"
                @handleBtn="handleBtn"
            >
                <div class="line"></div>
                <div>
                    <!-- 选择基础任务 -->
                    <div class="tabs" v-show="btnIndex == 1">
                        <div class="tabs-task">
                            <div class="tabs-search">
                                <span>基础任务名称：</span>
                                <div class="tabs-condition">
                                    <Input class="tabs-condition-input" type="text" v-model="basicTaskName" />
                                    <svg class="icon-action iconfont tabs-condition-logo" aria-hidden="true" @click="searchTask(1)">
                                        <use xlink:href="#icon-andaotongV3ICON_sousuo" />
                                    </svg>
                                </div>
                                <Button class="tabs-btn" type="primary" @click="sort(1)">排序</Button>
                            </div>
                            <Table
                                :columns="tableColumnsBasicTask"
                                :data="tableDataBasicTask"
                                max-height="300"
                                stripe
                                @on-selection-change="checkBasicTask"
                            >
                                <template #sort="{ row, index }">
                                    <div style="position: relative;">
                                        <span class="required-tag" style="width: 30px">*</span>
                                        <Input
                                            v-model.trim="row.sort"
                                            clearable
                                            @on-change="changeRowData(row, index, 'sort', 'sortBasic')"
                                            style="width: 80px;"
                                        />
                                    </div>
                                </template>
                            </Table>
                        </div>
                        <div class="tabs-line"></div>
                        <!-- 基础任务排序 -->
                        <div class="tabs-sort">
                            <div class="tabs-title">基础任务排序:</div>
                            <Table :columns="tableColumnsBasicTaskSort" :data="tableDataBasicTaskSort" stripe />
                        </div>
                    </div>
                    <!-- 选择附加任务 -->
                    <div class="tabs" v-show="btnIndex == 2">
                        <div class="tabs-task">
                            <div class="tabs-search">
                                <span>附加任务名称：</span>
                                <div class="tabs-condition">
                                    <Input class="tabs-condition-input" type="text" v-model="affixTaskName" />
                                    <svg class="icon-action iconfont tabs-condition-logo" aria-hidden="true" @click="searchTask(2)">
                                        <use xlink:href="#icon-andaotongV3ICON_sousuo" />
                                    </svg>
                                </div>
                                <Button class="tabs-btn" type="primary" @click="sort(2)">排序</Button>
                            </div>
                            <Table
                                :columns="tableColumnsAdditionalTasks"
                                :data="tableDataAdditionalTasks"
                                max-height="300"
                                stripe
                                @on-selection-change="checkBasicTask"
                            >
                                <template #sort="{ row, index }">
                                    <div style="position: relative;">
                                        <span class="required-tag" style="width: 30px">*</span>
                                        <Input
                                            v-model.trim="row.sort"
                                            clearable
                                            @on-change="changeRowData(row, index, 'sort', 'sortAttach')"
                                            style="width: 80px;"
                                        />
                                    </div>
                                </template>
                            </Table>
                        </div>
                        <div class="tabs-line"></div>
                        <!-- 附加任务排序 -->
                        <div class="tabs-sort">
                            <div class="tabs-title">基础任务排序:</div>
                            <Table :columns="tableColumnsAdditionalTasksSort" :data="tableDataAdditionalTasksSort" stripe />
                        </div>
                    </div>
                    <!-- 选择单据 -->
                    <div class="tabs" v-show="btnIndex == 3">
                        <div class="tabs-task">
                            <div class="tabs-search">
                                <span>单据名称：</span>
                                <div class="tabs-condition">
                                    <Input class="tabs-condition-input" type="text" v-model="billName" />
                                    <svg class="icon-action iconfont tabs-condition-logo" aria-hidden="true" @click="searchTask(3)">
                                        <use xlink:href="#icon-andaotongV3ICON_sousuo" />
                                    </svg>
                                </div>
                                <Button class="tabs-btn" type="primary" @click="sort(3)">排序</Button>
                            </div>
                            <Table
                                :columns="tableColumnsDocument"
                                :data="tableDataDocument"
                                max-height="300"
                                stripe
                                @on-selection-change="checkBasicTask"
                            >
                                <template #sort="{ row, index }">
                                    <div style="position: relative;">
                                        <span class="required-tag" style="width: 30px">*</span>
                                        <Input
                                            v-model.trim="row.sort"
                                            clearable
                                            @on-change="changeRowData(row, index, 'sort', 'sortDocument')"
                                            style="width: 80px"
                                        />
                                    </div>
                                </template>
                            </Table>
                        </div>
                        <div class="tabs-line"></div>
                        <!-- 单据排序 -->
                        <div class="tabs-sort">
                            <div class="tabs-title">单据排序:</div>
                            <Table :columns="tableColumnsDocumentSort" :data="tableDataDocumentSort" stripe />
                        </div>
                    </div>
                </div>
                <div class="public-transit scen-select">
                    <Form ref="formScenes" :model="formScenes" inline label-colon>
                        <FormItem label="必须共存场景" class="select-transit" prop="symbiosisScene">
                            <Select
                                v-model="formScenes.symbiosisScene"
                                :loading="sceneLoading"
                                filterable
                                @on-select="onChangeClick"
                                style="width:170px"
                            >
                                <Option
                                    v-for="(option, index) in sceneData"
                                    :value="option.label"
                                    :key="index"
                                >
                                    {{ option.value }}
                                </Option>
                            </Select>
                            <p class="select-value">
                                <span v-for="(value, index) in sceneSelectList" :key="index">{{value.label}}
                                    <Icon type="ios-close-circle" @click="delTransit(index)"/>
                                </span>
                            </p>
                        </FormItem>
                        <FormItem
                            class="select-transit"
                            label="无法共存场景"
                            prop="exclusiveScene"
                            style="margin-bottom: 0px !important"
                        >
                            <Select
                                v-model="formScenes.exclusiveScene"
                                :loading="sceneNoLoading"
                                filterable
                                @on-select="noChangeClick"
                                style="width:170px"
                            >
                                <Option  v-for="(option, index) in sceneData" :value="option.label" :key="index">
                                    {{ option.value }}
                                </Option>
                            </Select>
                            <p class="select-value">
                                <span v-for="(value, index) in sceneNoSelectList" :key="index">{{value.label}}<Icon type="ios-close-circle" @click="delTransitNo(index)"/></span>
                            </p>
                        </FormItem>
                    </Form>
                </div>
            </adt-tab-btns>
        </AdtMyModal>
        <div class="public-table-data">
            <Table :columns="tableColumns" :data="tableData" @on-selection-change="selectionChange" stripe>
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
                        @click="startUsing(row)"
                    >启</span>
                    <span
                        v-if="(row.useStatus && row.useStatus === 'enable') && row.examineStatus !== 'wait'"
                        class="icon-action icon-action-word"
                        title="停用"
                        @click="stopUsing(row)"
                    >停</span>
                    <span title="审核">
                        <svg
                            v-if="isManager && row.examineStatus === 'wait'"
                            class="icon-action iconfont"
                            aria-hidden="true"
                            @click="examine(row)"
                        >
                            <use xlink:href="#icon-andaotongV3ICON_shenhe" />
                        </svg>
                    </span>
                    <span v-if="row.useStatus !== 'enable'" title="编辑">
                        <svg class="icon-action iconfont" aria-hidden="true" @click="edit(row)">
                            <use xlink:href="#icon-andaotongV3ICON_caozuo-bianji" />
                        </svg>
                    </span>
                    <span title="删除">
                        <svg class="icon-action iconfont" aria-hidden="true" @click="remove(row)">
                            <use xlink:href="#icon-andaotongV3ICON_caozuo-shanchu" />
                        </svg>
                    </span>
                    <span title="详情">
                        <svg class="icon-action iconfont" aria-hidden="true" @click="detail(row)">
                            <use xlink:href="#icon-andaotongV3ICON_caozuo-xiangqing" />
                        </svg>
                    </span>
                </template>
            </Table>
        </div>
        <!-- 场景审核 -->
        <adt-my-modal
            :title="examineModalTitle"
            :showModal="isAuditShow"
            @on-visible-change="auditvisibleChange"
            @on-ok="saveAudit()"
            width="600">
            <RadioGroup v-model="agree" style="margin-bottom: 20px;">
                <Radio label="1">同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
                <Radio label="0" style="margin-left: 30px;">不同意{{ examineType === 1 ? '启用' : '停用' }}</Radio>
            </RadioGroup>
            <div v-show="agree === '0'">
                <div class="reason-name" style="margin-bottom: 6px;">填写驳回原因:</div>
                <Input type="textarea" v-model.trim="reason" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
        <adt-reconfirm-modal :showModal="isActionDel" @on-visible-change="visibleChange" @on-ok="allDelClick()" />
    </div>
</template>

<script>
import {
    tableColumns,
    tableColumnsBasicTask,
    tableColumnsAdditionalTasks,
    tableColumnsAdditionalTasksSort,
    tableColumnsDocument,
    tableColumnsDocumentSort,
    tableColumnsBasicTaskSort
} from './data'
import paginator from '@/mixins/paginator'
import validateRules from '@/libs/validateRules'
import { timestampFormat, isRepeat, dateToString } from '@/libs/utils'
import{
    apiQueryPage,
    apiEnable,
    apiDisable,
    apiExamEnablePass,
    apiExamEnableFail,
    apiExamDisablePass,
    apiExamDisableFail,
    apiInitSceneAdd,
    apiQueryTaskBase,
    apiQueryTaskAffix,
    apiAdd,
    apiEditSave,
    apiSceneDetail,
    apiQueryBillsData,
    apiQueryScene
} from '@/api/standard-mapper/sceneManage'
export default {
    mixins: [paginator],
    props: {
        examineStatus: '',
        useStatus: '',
        sceneCode: '',
        sceneName: '',
        serverType: '',
        trspType: ''
    },
    data() {
        return {
            userType: '',
            modelTitle: '',
            isModalShow: false,
            isActionDel: false,
            isAuditShow: false,
            isEditAuditShow: false,
            isManager: this.$isManager,
            examineType: 1,
            examineModalTitle: '启用审核',
            value: '1',
            // 新增编辑区分  1为新增 2为编辑
            distinguish: 0,
            // 区分当前是否可以调用接口
            judgment: 0,
            search: {
                sceneCode: this.sceneCode,
                sceneName: this.sceneName,
                serverType: this.serverType,
                trspType: this.trspType,
                examineStatus: this.examineStatus,
                useStatus: this.useStatus
            },
            // 新增搜索名称
            basicTaskName: '',
            affixTaskName: '',
            billName: '',
            // 新增需要的类型
            addType: {},
            auditStatusNum: '默认值',
            enableStatusNum: '默认值',
            titleNames: ['基础任务映射设置', '附加任务映射设置', '单据映射设置'],
            btnIndex: 1,
            addFormItem: {
                sceneName: '',
                serverType: '',
                trspType: '',
                sttnType: '',
                customsType: '',
                logisticsType: ''
            },
            addFormItemRule: {
                sceneName: [validateRules.required('场景名称')[0]],
                serverType: [validateRules.select('服务类型')[0]],
                // trspType: [validateRules.select('运输类型')[0]],
                sttnType: [validateRules.select('场所类型')[0]],
                customsType: [validateRules.select('关务类型')[0]],
                // logisticsType: [validateRules.select('物流类型')[0]]
            },
            // 编辑数据
            //  场景类型
            serverTypeTranslate: '',
            //  运输类型
            trspTypeTranslate: '',
            // 场所类型
            sttnTypeTranslate: '',
            // 关务类型
            customsTypeTranslate: '',
            editSceneCode: '',
            editFormItem: {
                sceneName: ''
            },
            editFormItemRule: {
                sceneName: [validateRules.required('场景名称')[0]],
            },
            // 服务类型
            dictionaryServiceType: this.$getDictionary('SERVICE_TYPE') || [],
            // 场所类型
            dictionaryStationType: this.$getDictionary('STATION_TYPE') || [],
            // 运输类型
            dictionaryTransportType: this.$getDictionary('TRANSPORT_TYPE') || [],
            // 关务类型
            dictionaryCustomsType: this.$getDictionary('CUSTOMS_TYPE') || [],
            // 物流类型
            dictionaryLogisticsType: this.$getDictionary('LOGISTICS_TYPE') || [],
            // 审核状态
            dictionaryApprovalStatus: this.$getDictionary('AUDIT_STATUS') || [],
            // 启用状态
            dictionaryEnabledStatus: this.$getDictionary('ENABLE_STATUS') || [],
            tableColumnsBasicTask,
            tableColumnsAdditionalTasks,
            tableColumnsDocument,
            tableDataBasicTaskAudit: [],
            tableDataAdditionalTasksAudit: [],
            tableDataDocumentAudit: [],
            // 基础任务
            tableDataBasicTask: [],
            formBasis: {
                sort: '',
            },
            ruleBasis: {
                sort: [validateRules.required('基础任务名称')[0]]
            },
            // 勾选的数据
            checkTask: [],
            selectionList: [],
            // 基础任务排序
            tableDataBasicTaskSort: [],
            tableColumnsBasicTaskSort,
            // 附加任务
            tableColumnsAdditionalTasks,
            tableColumnsAdditionalTasksSort,
            tableDataAdditionalTasksSort: [],
            // 单据
            tableColumnsDocument,
            tableColumnsDocumentSort,
            tableDataDocumentSort: [],
            // 选择场景
            formScenes: {
                symbiosisScene: '',
                exclusiveScene: ''
            },
            // 附加任务
            tableDataAdditionalTasks: [],
            // 单据
            tableDataDocument: [],
            tableColumns,
            tableData: [],
            isAdd: true,
            // modal任务选中的值
            selectedData: [],
            // 添加共存场景
            sceneLoading: false,
            // list: ['北京', '重庆'],
            list: [{sceneCode: '111', sceneName: '场景1'},{sceneCode: '222', sceneName: '场景2'}],
            sceneData: [],
            sceneSelect: [],
            sceneSelectList: [],
            // 添加不必要共存场景
            sceneNoLoading: false,
            sceneNoData: [],
            sceneNoSelect: [],
            sceneNoSelectList: [],
            // 审核信息
            examineInfo: {},
             // 审核同意、不同意
            agree: '1',
            // 不同意驳回原因
            reason: '',
            // 测试
            test: [],
            serviceTag: '服务类型',
            transportTag: '运输类型',
            logisticsTag: '物流类型',
            stationTag: '场所类型',
            customsTag: '关务类型',
            dataNoList: [],
            dataList: [],
            // 下拉选项选择的数据
            // selectTypeData: {}
        }
    },
    methods: {
        // 新增的状态绑定
        addvisibleChange (changeStatus) {
            this.isModalShow = changeStatus
        },
        // 审核的状态绑定
        auditvisibleChange (changeStatus) {
            this.isAuditShow = changeStatus
        },
        // 二次确定状态绑定
        visibleChange (changeStatus) {
            this.isActionDel = changeStatus
        },
        // 全选
        selectionChange (selectionList) {
            this.selectionList = selectionList
            // console.log(this.selectionList)
        },
        dataInit () {
            this.getData()
        },
        // 获取列表
        getData () {
            const data = {
                direction: 'asc', //"排序方式（asc 正序  desc 倒序）",
                examineStatus:  this.search.examineStatus,// "审核状态",
                page: this.page, //当前页码,
                sceneCode: this.search.sceneCode, //"场景编码",
                sceneName: this.search.sceneName, //"场景名称（模糊匹配）",
                serverType: this.search.serverType,//"服务类型",
                trspType: this.search.trspType,  // 运输类型
                useStatus: this.search.useStatus //"启用状态"
            }
            apiQueryPage({ data: data }).then(res => {
                if (res.code == 200) {
                    this.tableData = res.data.content || []
                    this.total = res.data.totalElements
                    this.tableData.forEach(element => {
                        element.createDatetime = dateToString(element.createDatetime)
                        element.examineDatetime = dateToString(element.examineDatetime)
                    })
                }
            })
        },
        // 新增场景
        add () {
            this.isModalShow = true
            this.distinguish = 1
            this.modelTitle = '新增场景'
            this.isAdd = true
        },
        // 选择类型时，调用相应的接口
        selectType (val) {
            console.log(val)
            if (val.tag === '服务类型') {
                // 服务类型不为运输
                if (val.value !== 'T') {
                    this.addFormItem.trspType = ''
                }
                // 服务类型不为场所
                if(val.value !== 'Y') {
                    this.addFormItem.sttnType = ''
                }
                // 服务类型不为关务
                if(val.value !== 'C') {
                    this.addFormItem.customsType = ''
                }
            }
            setTimeout(() => {
                this.getBaiscTableData()
            },200)
        },
        // 获取基础任务/附加任务/单据
        getBaiscTableData () {
            let data = {
                serverType: this.addFormItem.serverType || '',
                trspType: this.addFormItem.trspType || '',
                logisticsType: this.addFormItem.logisticsType || ''
            }
            apiInitSceneAdd({data: data}).then(res => {
                if (res.code == 200) {
                    this.tableDataBasicTask = res.data.baseTasks || []
                    this.tableDataAdditionalTasks = res.data.affixTasks || []
                    this.tableDataDocument = res.data.bills || []
                    this.sceneNoData = res.data.sceneInfo || []
                    // 请求接口前，先重置必须共存场景和无法共存场景的数据
                    this.sceneData = []
                    this.sceneNoData.forEach(item => {
                        this.sceneData.push({
                            value: item.sceneName,
                            label: item.sceneCode
                        })
                    })
                }
            })
        },
        // 启用
        startUsing (dataSource) {
            const data = this.handleRequestData(dataSource)
            // 批量操作，没有选择场景
            if (!data.length) return
            apiEnable({ data }).then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 禁用
        stopUsing (dataSource) {
            const data = this.handleRequestData(dataSource)
            // 批量操作，没有选择场景
            if (!data.length) return
            apiDisable({ data }).then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 将数据处理成ajax请求需要的入参数据
        handleRequestData (data) {
            const requestData = []
            // 单个启用、停用
            if (data) {
                requestData.push(handle(data))
                return requestData
            } else {
                // 批量启用、停用
                if (!this.selectionList.length) {
                    this.$Message.warning('请先选择场景')
                } else {
                    for (const list of this.selectionList) {
                        requestData.push(handle(list))
                    }
                }
                return requestData
            }
            function handle (obj) {
                const { sceneCode, taskCode, useStatus, version, examineStatus } = obj
                return {
                    sceneCode,
                    taskCode,
                    useStatus,
                    version,
                    examineStatus
                }
            }
        },
        // 勾选新增基础任务
        checkBasicTask (row) {
            this.selectedData[this.btnIndex] = row
            // 将勾选的数据提取出来
        },
        // 排序
        sort (index) {
            // console.log(index)
            if (index == 1) {
                if (!this.verifyItem()) return
                this.tableDataBasicTaskSort = this.selectedData[this.btnIndex]
            }
            if (index == 2) {
                if (!this.verifyItem()) return
                this.tableDataAdditionalTasksSort = this.selectedData[this.btnIndex]
            }
            if (index == 3) {
                if (!this.verifyItem()) return
                this.tableDataDocumentSort = this.selectedData[this.btnIndex]
            }
        },
        // 新增搜索
        searchTask (index) {
            const data = JSON.parse(JSON.stringify(this.addType))
            // 基础任务搜索
            if (index == 1) {
                data.taskName = this.basicTaskName
                apiQueryTaskBase({data: data}).then(res => {
                    if (res.code == 200) {
                        this.tableDataBasicTask = res.data || []
                    }
                })
            }
            // 附加任务搜索
            if (index == 2) {
                data.taskName = this.affixTaskName
                apiQueryTaskAffix({data: data}).then(res => {
                    if (res.code == 200) {
                        this.tableDataAdditionalTasks = res.data || []
                    }
                })
            }
            // 单据搜索
            if (index === 3) {
                data.billsName = this.billName
                apiQueryBillsData({ data }).then(res => {
                    this.tableDataDocument = res.data || []
                })
            }
        },
        // 必须共存场景展示场景
        delTransit (index) {
            // console.log(this.sceneSelectList)
            this.sceneSelectList.splice(index, 1)
            this.dataList = []
            this.sceneSelectList.forEach(item => {
                this.dataList.push(item.value)
            })
        },
        // 必须共存场景选择场景
        onChangeClick(val) {
            // 数组去重
            this.dataList.push(val.value)
            console.log(this.dataList)
            let arr = new Set(this.dataList)
            this.sceneSelect = Array.from(arr)
            // 数组中对象去重
            const arr2 = []
            this.sceneData.forEach(item => {
                this.sceneSelect.forEach(element => {
                    if (element == item.label) {
                        arr2.push({
                            label: item.value,
                            value: item.label
                        })
                    }
                })
            })
            this.sceneSelectList = arr2
        },
        // 无法共存场景展示场景
        delTransitNo (index) {
            this.sceneNoSelectList.splice(index, 1)
            this.dataNoList = []
            this.sceneNoSelectList.forEach(item => {
                this.dataNoList.push(item.value)
            })
        },
        // 无法共存场景选择场景
        noChangeClick(val) {
            // 数组去重
            this.dataNoList.push(val.value)
            let arr = new Set(this.dataNoList)
            this.sceneNoSelect = Array.from(arr)
            // 数组中对象去重
            const arr2 = []
            this.sceneData.forEach(item => {
                this.sceneNoSelect.forEach(element => {
                    if (element == item.label) {
                        arr2.push({
                            label: item.value,
                            value: item.label
                        })
                    }
                })
            })
            this.sceneNoSelectList = arr2
        },
        // 任务发生改变
        changeRowData (row, index, key, judge) {
            // 将改行改变后的数据更新到accountData，后续选中才有数据
            // this.tableDataBasicTask[index] = row
            if (judge == 'sortBasic') {
                this.tableDataBasicTask[index] = row
            }
            if (judge == 'sortAttach') {
                this.tableDataAdditionalTasks[index] = row
            }
            if (judge == 'sortDocument') {
                this.tableDataDocument[index] = row
            }
            // this.tableDataBasicTask[index] = row
            // 先选中，再选择帐户类型，需要手动改变选中的帐户的帐户类型
            for (const item of this.selectedData[this.btnIndex]) {
                if (item.taskName === row.taskName) {
                    // 排序值在后面的排序要用到，要转换成Number类型，不然字符串之间比较大小会出错
                    // if (key === 'sortBasic' || key === 'sortAttach' || key === 'sortDocument') {
                    if (key === 'sort' ) {
                        // Number(row[key])可能会被转换成NaN
                        item[key] = Number(row[key])
                    } else {
                        item[key] = row[key]
                    }
                    break
                }
            }
        },
        examine (row) {
            // 根据状态判断是启用审核
            // if (row.useStatus !== 'enable') {
            if (!row.useStatus || row.useStatus === '已停用') {
                this.examineType = 1
                this.examineModalTitle = '启用审核'
            } else {
                this.examineType = 0
                this.examineModalTitle = '停用审核'
            }
            // console.log(row.sceneCode)
            this.examineInfo.sceneCode = row.sceneCode
            this.examineInfo.version = row.version
            this.isAuditShow = true
        },
        // 审核
        audit (row) {
            this.isAuditShow = true
        },
        // 编辑
        edit (row) {
            this.isModalShow = true
            this.distinguish = 2
            this.modelTitle = '编辑场景'
            this.isAdd = false
            const data = row.sceneCode
            // 共存
            let symbiosisScene = []
            // 不共存
            let mutuallyScene = []
            let taskBases = []
            let taskAffixs = []
            let bills = []
            apiSceneDetail({ data }).then(res => {
                // 处理基础任务/附加任务/单据完成反选
                this.editFormItem.sceneName = res.data.sceneName
                this.tableDataBasicTask = this.processingTask(res.data.taskBases)
                this.tableDataAdditionalTasks = this.processingTask(res.data.taskAffixs)
                this.tableDataDocument = this.processingTask(res.data.bills)
                this.editSceneCode = res.data.sceneCode,
                // 服务类型
                this.serverTypeTranslate = res.data.serverTypeTranslate
                //  运输类型
                this.trspTypeTranslate = res.data.trspTypeTranslate
                // 场所类型
                this.sttnTypeTranslate = res.data.sttnTypeTranslate
                // 关务类型
                this.customsTypeTranslate = res.data.customsTypeTranslate
                // 将类型存起来
                this.editFormItem.serverType = res.data.serverType || ''
                this.editFormItem.trspType = res.data.trspType || ''
                this.editFormItem.sttnType = res.data.sttnType || ''
                this.editFormItem.customsType = res.data.customsType || ''
                this.editFormItem.logisticsType = res.data.logisticsType || ''
                taskBases = this.filterTask(res.data.taskBases)
                taskAffixs = this.filterTask(res.data.taskAffixs)
                bills = this.filterTask(res.data.bills)
                this.selectedData = [, taskBases, taskAffixs, bills ]
                // 必须共存场景
                symbiosisScene = res.data.symbiosisScenes || []
                // this.sceneSelectList = res.data.mutexScenes,
                // 无法共存场景
                mutuallyScene = res.data.mutexScenes || []
                // this.sceneNoSelectList = res.data.symbiosisScenes
                apiQueryScene().then(res => {
                    if (res.data) {
                        this.sceneNoData = res.data || []
                        // 请求接口前，先重置必须共存场景和无法共存场景的数据
                        this.sceneData = []
                        this.sceneNoData.forEach(item => {
                            this.sceneData.push({
                                value: item.sceneName,
                                label: item.sceneCode
                            })
                        })
                        res.data.forEach(item => {
                            // 必须共存场景
                            symbiosisScene.forEach(element => {
                                if (item.sceneCode === element) {
                                    this.sceneSelectList.push({
                                        label: item.sceneName,
                                        value: item.sceneCode
                                    })
                                    this.sceneSelect.push(item.sceneCode)
                                }
                            })
                            // 必须共存场景选择赋值，避免编辑选择共存场景时，重头选择
                            this.dataList = this.sceneSelect
                            // 无法共存场景
                            mutuallyScene.forEach(element => {
                                if (item.sceneCode === element) {
                                    this.sceneNoSelectList.push({
                                        label: item.sceneName,
                                        value: item.sceneCode
                                    })
                                    this.sceneNoSelect.push(item.sceneCode)
                                }
                            })
                            // 必须无法共存场景选择赋值，避免编辑选择无法共存场景时，重头选择
                            this.dataNoList = this.sceneNoSelect
                        })
                    }
                })
            })
        },
        // 处理任务
        processingTask (val) {
            if (val) {
                val.map( item => {
                    item._checked = item.checked
                })
            }
            return val
        },
        filterTask (val) {
            let list = []
            val.map(item => {
                if(item.checked) {
                    list.push(item)
                }
            })
            return list
        },
        // 删除
        remove () {
            this.isActionDel = true
        },
        // 删除确定
        allDelClick () {},
        // 新增/编辑场景保存
        saveAdd () {
            const vm = this
            if (this.isAdd) {
                // 服务类型为代理，数据来源吧和数据来源值是非必填的
                if (this.addFormItem.serverType === 'T' || this.addFormItem.serverType === 'Y' ) {
                    this.addFormItemRule.trspType = validateRules.select('运输类型')
                    this.addFormItemRule.logisticsType = validateRules.select('物流类型')
                } else {
                    this.addFormItemRule.trspType = []
                    this.addFormItemRule.logisticsType = []
                }
                this.$refs.addFormItemData.validate((valid) => {
                    if (valid) {
                        // 切换任务时，还有勾选任务没有填写排序值，保存时的校验
                        let isTask = true
                        this.selectedData.map(item => {
                            item.map(element => {
                                if (element.sort === undefined) {
                                    isTask = false
                                }
                            })
                        })
                        if (isTask) {
                            const data = { ...this.addFormItem }
                            console.log(this.selectedData)
                            data.baseTasks = this.selectedData[1]
                            data.affixTasks = this.selectedData[2]
                            data.blsCodes = this.selectedData[3]
                            data.symbiosisScenes = this.sceneSelect
                            data.mutexScenes = this.sceneNoSelect
                            apiAdd({ data: data }).then(res => {
                                // 重置表单数据
                                this.$refs.addFormItemData.resetFields()
                                successCallback()
                            })
                        } else {
                            this.$Message.warning('勾选任务后必须填写排序值')
                        }
                    }
                })
            } else {
                this.$refs.editFormItemData.validate((valid) => {
                    if (valid) {
                        // 切换任务时，还有勾选任务没有填写排序值，保存时的校验
                        let isTask = true
                        let selectList = [this.selectedData[1], this.selectedData[2], this.selectedData[3]]
                        selectList.forEach(item => {
                            item.forEach(element => {
                                if (!element.sort) {
                                    isTask = false
                                }
                            })
                        })
                        if (isTask) {
                            const data = { ...this.editFormItem }
                            data.sceneCode = this.editSceneCode
                            data.baseTasks = this.selectedData[1]
                            data.affixTasks = this.selectedData[2]
                            data.blsCodes = this.selectedData[3]
                            data.symbiosisScenes = this.sceneSelect
                            data.mutexScenes = this.sceneNoSelect
                            // 编辑保存
                            apiEditSave({ data: data }).then(res => {
                                this.$refs.editFormItemData.resetFields()
                                successCallback()
                            })
                        } else {
                            this.$Message.warning('勾选任务后必须填写排序值')
                        }
                    }
                })
            }
            function successCallback () {
                vm.$Message.info("保存成功")
                // 重置场景框数据
                vm.$refs.formScenes.resetFields()
                // 重置新增/编辑场景中的表格
                vm.tableDataBasicTask = []
                vm.tableDataAdditionalTasks = []
                vm.tableDataDocument = []
                // 重置排序任务
                vm.tableDataBasicTaskSort = []
                vm.tableDataAdditionalTasksSort = []
                vm.tableDataDocumentSort = []
                // 重置必须共存场景/无法共存场景
                vm.sceneSelectList = []
                vm.sceneNoSelectList = []
                vm.sceneSelect = []
                vm.sceneNoSelect = []
                // 重置选中的任务
                vm.selectedData = []
                // 隐藏新增模态框
                vm.isModalShow = false
                // 重置场景选择框
                vm.sceneNoData = []
                // 刷新列表
                vm.getData()
            }
        },
        // 新增任务保存、排序校验
        verifyItem () {
            // 至少选择一个任务
            if (this.selectedData.length == 0 || !this.selectedData[this.btnIndex]) {
            // if (this.selectedData.length == 0 || !this.selectedData[this.btnIndex].length) {
                this.$Message.warning('请至少选择一个任务！')
                return false
            }
            const sort = []
            for (const item of this.selectedData[this.btnIndex]) {
                // 勾选的任务的排序值必填
                // 排序值可能会被转换成NaN
                if (!item.sort && !Number.isNaN(item.sort)) {
                    this.$Message.warning('选中任务的排序值必填！')
                    return false
                }
                // 排序值只能是正整数
                if (!/^\d+$/.test(item.sort)) {
                    this.$Message.warning('排序值只能是整数！')
                    return
                }
                sort.push(item.sort)
            }
            // 勾选的任务的排序值不能重复
            if (isRepeat(sort)) {
                this.$Message.warning('选中的任务的排序值不能重复！')
                return false
            }
            return true
        },
        // 同意审核
        saveAudit () {
            const data = { ...this.examineInfo}
            if (this.examineType === 1) {
                // 同意
                if (this.agree === '1') {
                    apiExamEnablePass({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isAuditShow = false
                        this.getData()
                    })
                } else {
                    if (!this.reason) {
                        this.$Message.warning('请填写输入驳回原因！')
                        return
                    }
                    data.message = this.reason
                    // 不同意
                    apiExamEnableFail({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isAuditShow = false
                        this.getData()
                    })
                }
            } else {
                // 停用审核
                // 同意
                if (this.agree === '1') {
                    apiExamDisablePass({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isAuditShow = false
                        this.getData()
                    })
                } else {
                    if (!this.reason) {
                        this.$Message.warning('请填写输入驳回原因！')
                        return
                    }
                    data.message = this.reason
                    // 不同意
                    apiExamDisableFail({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isAuditShow = false
                        this.reason = ''
                        this.getData()
                    })
                }
            }
        },
        // 新增取消
        cancelAdd () {
            // 重置场景选择框
            this.sceneNoData = []
            // 共生场景置空
            this.sceneSelectList = []
            // 互斥场景置空
            this.sceneNoSelectList = []
            // 清空基础任务
            this.tableDataBasicTask = []
            this.tableDataAdditionalTasks = []
            this.tableDataDocument = []
        },
        detail (row) {
            const data = row.sceneCode
            this.$router.push({path: '/standard-mapper/scene-manage/detail', query: {sceneCode: data}})
        },
        auditStatus (id) {
            if (this.search.examineStatus === id) {
                this.search.examineStatus = ''
            } else {
                this.search.examineStatus = id
            }
        },
        enableStatus (id) {
            // 控制状态切换传值
            if (this.search.useStatus === id) {
                this.search.useStatus = ''
            } else {
                this.search.useStatus = id
            }
        },
        // 切换tab
        handleBtn (index) {
            this.btnIndex = index + 1
            // tabs切换的时候，将勾选的数据置空避免带到下一个tabs列表下
            // this.selectedData = []
        }
    },
}
</script>

<style lang="scss" scoped>
/deep/.public-transit .select-transit {
    width: 100%;
}
.ivu-modal-content /deep/.modal-footer {
    margin-top: 20px;
}
.scen-select {
    margin-top: 20px;
}
.checkStatus {
    background-color: $filling-color;
}
// tabs切换向左对齐
/deep/.tabTitle {
    justify-content: left;
}
.margin-top {
    margin-top: -10px;
}
.scene-top {
    // margin-bottom: 10px;
    line-height: 40px;
}
.fromItem {
    display: flex;
    .fromItem-content {
        width: 150px;
    }
    .fromItem-margin {
        margin-left: 15px;
    }
}
.scene-edit {
    display: flex;
    span {
        margin-left: 15px;
        width: 160px;
    }
}
// 审核状态、启用状态
.line {
    border:0.5px dashed $border-color;
    margin: 10px 0 20px 0;
}
.line-solid {
    border:0.5px solid $border-color;
    margin: 0 0 10px 0;
}
.search-condition {
    display: flex;
}
.line-margin {
    margin-left: 30px;
}
.btn-pagina {
    display: flex;
    padding: 20px 0;
    .pagination {
        width: 50%;
        text-align: right;
        margin-right: 2%;
    }
}
// 审核的modal的title样式
.modal-title {
    .ivu-row {
        font-size: 14px;
    }
    .line {
        margin: 20px 30px;
    }
}
// tabs切换内的内容
.tabs {
    display: flex;
    margin-top: 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid $light-color;
    .tabs-task {
        width: 49%;
        // tabs切换内的搜索
        .tabs-search {
            // display: flex;
            margin-bottom: 10px;
            // .tabs-title {
            //     // display: inline-block;
            // }
            .tabs-condition {
                display: inline-block;
                .tabs-condition-input {
                    width: 200px;
                }
                .tabs-condition-logo{
                    margin-left: 20px;
                    color: $light-color;
                    font-size: 30px;
                    position: absolute;
                }
            }
            .tabs-btn {
                margin-left: 182px;
                // display: inline-block;
            }
        }
    }
    .tabs-line {
        margin: 0 1%;
        width: 1px;
        background-color: $border-color;
    }
    .tabs-sort {
        width: 49%;
        .tabs-title {
            padding: 7px 0 14px 0;
        }
    }
}
// *号标识
.required-tag {
    position: absolute;
    left: 35px;
    z-index: 10;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    font-family: SimSun;
    color: #ff001b;
    width: 30px;
}
</style>
