<template>
    <div>
        <adt-search-folder
        :searchRouter="{ query: search }"
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
                <Col span="6" class="form-item">
                    <span>场所编号:</span>
                    <Input v-model="search.sttnCode" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span>场所名称:</span>
                    <Input v-model="search.sttnName" clearable />
                </Col>
                <Col span="6" class="form-item">
                    <span>国家城市:</span>
                    <adt-city-selector
                        :defaultData="search.country"
                        :changeSelect="true"
                        @on-change="handelDirSearch"
                        style="display: inline-block; width:180px; marginRight: 10px;"
                    />
                </Col>
            </template>
        </adt-search-folder>
        <!-- 新增按钮 -->
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="add()">
                    新增场所
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_tianjia" />
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
            <adt-paginator :currentPage="~~page" :total="~~total"/>
        </div>
        <!-- 表格 -->
        <div class="public-table-data">
            <Table
                :columns="tableColumns"
                :data="tableData"
                stripe
                @on-selection-change="selectionChange"
            >
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
                        <!-- 如果是管理员并且审核状态为待审核的展示审核按钮 -->
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
                    <!-- 只有管理员才能删除 -->
                    <span v-if="isManager && row.useStatus !== 'enable'" title="删除">
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
        <!-- 编辑场所弹框 -->
        <AdtMyModal
            :title="'编辑场所'"
            :showModal="isEditModalShow"
            okText="保存"
            cancelText="取消"
            width="850"
            @on-visible-change="editvisibleChange"
            @on-ok="saveEdit()"
            @on-cancel="cancelEdit()"
        >
            <div>
                <Form
                    ref="editFormRef"
                    class="fromItem"
                    label-colon
                    :model="editFormItem"
                    :rules="editFormRule"
                    :label-width="100"
                >
                    <div class="edit-field">
                        <span class="name" style="width: 100px;">场所编号：</span>{{ siteEditCode }}
                    </div>
                    <Row>
                        <Col span="8">
                            <FormItem label="场所全称" prop="sttnName">
                                <Input class="fromItem-content" v-model="editFormItem.sttnName" maxlength="10" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="场所简称" prop="sttnAbbr">
                                <Input class="fromItem-content" v-model="editFormItem.sttnAbbr" maxlength="10" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="场所类型">
                                <Select v-model="editFormItem.sttnType" clearable>
                                    <Option v-for="item in sttnType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                        {{ item.dictionaryValue }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="国家城市" prop="country">
                                <adt-city-selector
                                    :defaultData="editFormItem.country"
                                    @on-change="handelEditCountry"
                                    style="display: inline-block; width:162px; marginRight: 10px;"
                                />
                            </FormItem>
                        </Col>
                        <Col span="16">
                        <FormItem label="场所地址" prop="sttnAddr">
                            <Input class="fromItem-content" v-model="editFormItem.sttnAddr" />
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="运输方式">
                                <small>*</small>
                                <Select
                                    v-model="editFormItem.trspMode"
                                    :class="{'trsp-hint': editTrspHintShow === true}"
                                    @on-change="onEditTrspChange"
                                    style="lineHeight: 1.5;"
                                >
                                    <Option
                                        v-for="item in trspMode"
                                        :key="item.dictionaryKey"
                                        :value="`${item.dictionaryKey}-${item.dictionaryValue}`"
                                    >
                                        {{ item.dictionaryValue }}
                                    </Option>
                                </Select>
                                <span v-show="editTrspHintShow" class="hint">请输入运输方式</span>
                            </FormItem>
                        </Col>
                        <p class="select-value">
                            <span v-for="(value, index) in editTrspModeData" :key="index">
                                {{ value }}
                                <Icon type="ios-close-circle" @click="delEditTrspMode(index)" />
                            </span>
                        </p>
                    </Row>
                    <Divider dashed />
                    <Row>
                        <Col span="8">
                            <FormItem label="监管场所编码">
                                <Input class="fromItem-content" v-model="editFormItem.supvSttn" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="企业名称">
                                <Input class="fromItem-content" v-model="editFormItem.etpsName" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="企业代码">
                                <Input class="fromItem-content" v-model="editFormItem.etpsCode" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="海关关区">
                                <Select v-if="editCNShow" v-model="editFormItem.customsCode" clearable>
                                    <Option v-for="item in customsCode" :key="item.dictCode" :value="item.dictCode">
                                        {{ item.dictName }}
                                    </Option>
                                </Select>
                                 <Input v-else class="fromItem-content" v-model="editFormItem.customsCode" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="业务负责人">
                                <Input class="fromItem-content" v-model="editFormItem.rspder" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row class="tab-work">
                        <Col span="3">
                            <span>作业时间范围:</span>
                        </Col>
                        <Col span="21">
                            <adt-tab-btns
                                class="tab-work"
                                :isSmallBtn="true"
                                :titleNames="titleNames"
                                :btnIndex="editChangeIndex"
                                :width='80'
                                @handleBtn="editHandleBtn"
                            />
                            <div v-for="(item, id) in editWorkingTimeRange" :key="id">
                            <!-- <div v-for="(item, id) in workTime" :key="id"> -->
                                <TimePicker
                                    v-if="item.name === titleNames[editChangeIndex - 1]"
                                    v-model="editWorkingTimeRange[id].time"
                                    format="HH:mm"
                                    type="timerange"
                                    placement="bottom-end"
                                    placeholder="请选择起止时间"
                                    style="width: 230px"
                                    clearable
                                />
                            </div>
                        </Col>
                    </Row>
                    <Divider dashed />
                    <FormItem label="备注信息">
                        <Input type="textarea" class="fromItem-content" v-model="editFormItem.remark" />
                    </FormItem>
                </Form>
            </div>
        </AdtMyModal>
        <!-- 新增场所弹框 -->
        <AdtMyModal
            :title="'创建新场所'"
            :showModal="isModalShow"
            okText="保存"
            cancelText="取消"
            width="850"
            @on-visible-change="addvisibleChange"
            @on-ok="saveAdd()"
            @on-cancel="cancelAdd()"
        >
            <div>
                <Form
                    ref="addFormRef"
                    class="fromItem"
                    label-colon
                    :model="addFormItem"
                    :rules="addFormRule"
                    :label-width="100"
                >
                    <Row>
                        <Col span="8">
                            <FormItem label="场所全称" prop="sttnName">
                                <Input class="fromItem-content" v-model="addFormItem.sttnName" maxlength="10" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="场所简称" prop="sttnAbbr">
                                <Input class="fromItem-content" v-model="addFormItem.sttnAbbr" maxlength="10" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="场所类型">
                                <Select v-model="addFormItem.sttnType" clearable>
                                    <Option v-for="item in sttnType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                        {{ item.dictionaryValue }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="国家城市" prop="country">
                                <adt-city-selector
                                    :defaultData="addFormItem.country"
                                    @on-change="handelDirStart"
                                    style="display: inline-block; width:162px; marginRight: 10px;"
                                />
                            </FormItem>
                        </Col>
                        <Col span="16">
                        <FormItem label="场所地址" prop="sttnAddr">
                            <Input class="fromItem-content" v-model="addFormItem.sttnAddr" />
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="运输方式">
                                <small>*</small>
                                <Select
                                    v-model="addFormItem.trspMode"
                                    :class="{'trsp-hint': trspHintShow === true}"
                                    @on-change="onTrspChange"
                                    style="lineHeight: 1.5;"
                                >
                                    <Option
                                        v-for="item in trspMode"
                                        :key="item.dictionaryKey"
                                        :value="`${item.dictionaryKey}-${item.dictionaryValue}`"
                                    >
                                        {{ item.dictionaryValue }}
                                    </Option>
                                </Select>
                                <span v-show="trspHintShow" class="hint">请输入运输方式</span>
                            </FormItem>
                        </Col>
                        <p class="select-value">
                            <span v-for="(value, index) in trspModeData" :key="index">{{ value }}<Icon type="ios-close-circle" @click="delTrspMode(index)" /></span>
                        </p>
                    </Row>
                    <Divider dashed />
                    <Row>
                        <Col span="8">
                            <FormItem label="监管场所编码">
                                <Input class="fromItem-content" v-model="addFormItem.supvSttn" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="企业名称">
                                <Input class="fromItem-content" v-model="addFormItem.etpsName" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="企业代码">
                                <Input class="fromItem-content" v-model="addFormItem.etpsCode" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="海关关区">
                                <Select v-if="CNShow" v-model="addFormItem.customsCode" clearable>
                                    <Option v-for="item in customsCode" :key="item.dictCode" :value="item.dictCode">
                                        {{ item.dictName }}
                                    </Option>
                                </Select>
                                <Input v-else class="fromItem-content" v-model="addFormItem.customsCode" />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="业务负责人">
                                <Input class="fromItem-content" v-model="addFormItem.rspder" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Divider dashed />
                    <Row class="tab-work">
                        <Col span="3">
                            <span>作业时间范围:</span>
                        </Col>
                        <Col span="21">
                            <adt-tab-btns
                                class="tab-work"
                                :isSmallBtn="true"
                                :titleNames="titleNames"
                                :btnIndex="changeIndex"
                                :width='80'
                                @handleBtn="handleBtn"
                            />
                            <div v-for="(item, id) in workTime" :key="id">
                                <TimePicker
                                    v-if="item.name === titleNames[changeIndex - 1]"
                                    v-model="item.time"
                                    format="HH:mm"
                                    type="timerange"
                                    placement="bottom-end"
                                    placeholder="请选择起止时间"
                                    style="width: 230px"
                                    clearable
                                />
                            </div>
                        </Col>
                    </Row>
                    <Divider dashed />
                    <FormItem label="备注信息">
                        <Input type="textarea" class="fromItem-content" v-model="addFormItem.remark" />
                    </FormItem>
                </Form>
            </div>
        </AdtMyModal>
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
        <!-- 编辑提示弹框 -->
        <adt-reconfirm-modal
            :showModal="editModalShow"
            :message="editMsg"
            @on-visible-change="visibleChangeEdit"
            @on-ok="editModalClick()"
        />
         <!-- 删除modal -->
        <adt-my-modal
            :showModal="isActionDel"
            title="系统提示"
            @on-visible-change="visibleChange"
            @on-ok="confirmDel()"
        >
            <div>
                <div style="margin-bottom: 6px;">填写删除原因:</div>
                <Input v-model.trim="delInfo.reason" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
    import {
        apiAddStation,
        apiUpdate,
        apiQueryList,
        apiQueryInfo,
        apiEnable,
        apiDisable,
        apiExamine,
        apiDelData
    } from '@/api/standard-mapper/siteManage'
    import { apiGetTranslate } from '@/api/logisticsCommission'
    import { tableColumns } from './data'
    import validateRules from '@/libs/validateRules'
    import standardMapperList from '@/mixins/standardMapperList'
    import { dateToString, toTimestamp } from '@/libs/utils'
    export default {
        mixins: [standardMapperList],
        props: {
            sttnCode: '',
            sttnName: '',
            country: '',
            city: '',
            examineStatus: '',
            useStatus: '',
            countrys: '',
            province: ''
        },
        data() {
            return {
                // 运输方式
                trspMode: this.$getDictionary('TRANSPORT_MODE') || [],
                // 场所类型
                sttnType: this.$getDictionary('STATION_TYPE') || [],
                // 星期
                week: this.$getDictionary('WEEK') || [],
                // week: this.$getDictionary('CERTIFICATE_TYPE') || [],
                // 海关关区
                siteEditCode: '',
                customsCode: [],
                // 选择的运输方式
                trspModeData: [],
                trspModeCode: [],
                // 编辑的运输方式
                editTrspModeData: [],
                editTrspModeCode: [],
                trspHintShow: false,
                editTrspHintShow: false,
                search: {
                    sttnCode: this.sttnCode || '',
                    sttnName: this.sttnName || '',
                    country: this.country || '',
                    countrys: this.countrys || '',
                    province: this.province || '',
                    city: this.city || '',
                    examineStatus: this.examineStatus || '',
                    useStatus: this.useStatus || ''
                },
                addFormItem: {
                    country: ''
                },
                editFormItem: {
                    country: ''
                },
                addFormRule: {
                    sttnName: [validateRules.required('场所全称')[0]],
                    sttnAbbr: [validateRules.required('场所简称')[0]],
                    sttnType: [validateRules.select('场所类型')[0]],
                    sttnAddr: [validateRules.select('场所地址')[0]],
                    country: [
                        { required: true, message: '请选择国家城市', trigger: 'change' }
                    ]
                },
                editFormRule: {
                    sttnName: [validateRules.required('场所全称')[0]],
                    sttnAbbr: [validateRules.required('场所简称')[0]],
                    sttnType: [validateRules.select('场所类型')[0]],
                    sttnAddr: [validateRules.select('场所地址')[0]],
                    country: [
                        { required: true, message: '请选择国家城市', trigger: 'change' }
                    ]
                },
                // 国家选择了中国
                CNShow: true,
                editCNShow: true,
                // 区分是新增还是编辑
                distinguish: 0,
                // 添加弹框的显示
                isModalShow: false,
                // 编辑弹框
                isEditModalShow: false,
                // 编辑提示
                editModalShow: false,
                // 编辑提示的文字
                editMsg: '',
                tableColumns,
                tableData: [],
                examineType: 1,
                isAuditShow: false,
                examineModalTitle: '启用审核',
                stopData: {},
                // 新增tab
                titleNames: [],
                changeIndex: 1,
                // 编辑tab
                editTitleNames: [],
                editChangeIndex: 1,
                // 选择的时间段
                checkTimeArr: [],
                workTime: [],
                // 场所作业时间范围
                stationOperationTimes: [],
                stationOperationTimesEdit: [],
                // 编辑反显的作业时间范围
                editWorkingTimeRange: []
            }
        },
        created () {
            // 初始化取得城市和国家
            if (this.search.country) {
                this.search.country = `${this.search.country}~${this.search.province}~${this.search.city}`
                console.log(this.search)
            }
        },
        mounted () {
            // 处理星期数据
            console.log(this.week)
            this.week.forEach((item, index) => {
                this.titleNames.push(item.dictionaryValue)
                this.workTime.push({
                    cycle: item.dictionaryKey,
                    name: item.dictionaryValue,
                    time: [],
                    id: index
                })
            })
            // 获取关区
            apiGetTranslate ( {data: 'CUSTOMS'} ).then(res => {
                this.customsCode = res.data
            })
        },
        methods: {
            // 新增点击tab切换
            handleBtn (index) {
                this.changeIndex = index + 1
                // 场景切换的时候重新从后台拿数据
                // this.scenesDataHandle(this.scenesList)
            },
            // 编辑点击tab切换
            editHandleBtn (index) {
                this.editChangeIndex = index + 1
                // 场景切换的时候重新从后台拿数据
                // this.scenesDataHandle(this.scenesList)
            },
            // 删除
            remove (row) {
                this.isActionDel = true
                this.delInfo.code = row.sttnCode
                this.delInfo.reason = ''
                this.delInfo.useStatus = row.useStatus
            },
            // 确认删除
            confirmDel () {
                let data = []
                data.push(this.delInfo)
                apiDelData({ data }).then(res => {
                    this.$Message.info(res.message)
                    // 隐藏模态框
                    this.isActionDel = false
                    // 重新获取列表数据
                    this.getData()
                })
            },
            // 拿到查询的城市和国家
            handelDirSearch (data) {
                // 如果有省份的话就加上province
                if (data.value.length > 2) {
                    this.search.province = data.value[1] || ''
                    this.search.city = data.value[2] || ''
                } else {
                    this.search.city = data.value[1] || ''
                    this.search.province = ''
                }
                this.search.country = `${data.value[0]}~${data.value[1]}~${data.value[2]}` || ''
                this.search.countrys = data.value[0]
            },
            // 添加的时候拿到城市
            handelDirStart (data) {
                // 如果是中国就选择关区，否则就输入
                if (data.value[0] === 'CN') {
                    this.CNShow = true
                } else {
                    this.CNShow = false
                }
                this.$set(this.addFormItem, 'country', data.data.length ? data.value.join('~') : '')
            },
            // 修改的时候拿到城市
            handelEditCountry (data) {
                // 如果是中国就选择关区，否则就输入
                if (data.value[0] === 'CN') {
                    this.editCNShow = true
                } else {
                    this.editCNShow = false
                }
                this.editFormItem.country = data.data.length ? data.value.join('~') : ''
            },
            // 审核的弹框状态
            auditvisibleChange (changeStatus) {
                this.isAuditShow = changeStatus
            },
            // 新增的弹框状态
            addvisibleChange (changeStatus) {
                this.isModalShow = changeStatus
            },
            // 编辑的弹框状态
            editvisibleChange (changeStatus) {
                this.isEditModalShow = changeStatus
            },
            // 编辑提示的二次确定弹框状态
            visibleChangeEdit (changeStatus) {
                this.editModalShow = changeStatus
            },
            // 新增选择运输方式推进数组中
            onTrspChange (val) {
                if (val) {
                    let code = val.split('-')[0]
                    let value = val.split('-')[1]
                    this.trspModeData.push(value)
                    this.trspModeCode.push(code)
                }
                this.trspModeData = [...new Set(this.trspModeData)]
                this.trspModeCode = [...new Set(this.trspModeCode)]
                if (this.trspModeData.length === 0) {
                    this.trspHintShow = true
                } else {
                    this.trspHintShow = false
                }
            },
            // 编辑页面的选择运输方式
            onEditTrspChange (val) {
                if (val) {
                    const code = val.split('-')[0]
                    const value = val.split('-')[1]
                    this.editTrspModeData.push(value)
                    this.editTrspModeCode.push(code)
                }
                console.log(val)
                console.log(this.editTrspModeData)
                this.editTrspModeData = [...new Set(this.editTrspModeData)]
                this.editTrspModeCode = [...new Set(this.editTrspModeCode)]
                if (this.editTrspModeData.length === 0) {
                    this.editTrspHintShow = true
                } else {
                    this.editTrspHintShow = false
                }
            },
            // 删除运输方式
            delTrspMode (index) {
                this.trspModeData.splice(index, 1)
                this.trspModeData.splice(index, 1)
                if (this.trspModeData.length === 0) {
                    this.trspHintShow = true
                }
            },
            // 编辑删除运输方式
            delEditTrspMode (index) {
                this.editTrspModeData.splice(index, 1)
                this.editTrspModeCode.splice(index, 1)
                if (this.editTrspModeData.length === 0) {
                    this.editTrspHintShow = true
                }
            },
            // 初始化数据
            getData () {
                let searchData = JSON.parse(JSON.stringify(this.search))
                searchData.country = searchData.country.split('~')[0]
                this.search.countrys = searchData.country
                searchData.countrys = this.search.countrys
                const data = {
                    page: this.page,
                    size: 15,
                    ...searchData
                }
                apiQueryList( {data} ).then(res => {
                    this.tableData = res.data.content || []
                    this.total = res.data.totalElements
                    this.tableData.forEach(element => {
                        element.createDatetime = dateToString(element.createDatetime)
                        element.examineDatetime = dateToString(element.examineDatetime)
                        element.provinceTranslate = element.provinceTranslate!== 'null' ? element.provinceTranslate : ''
                    })
                })
            },
            // 新增保存
            saveAdd () {
                console.log(this.stationOperationTimes)
                this.$refs.addFormRef.validate((valid) => {
                    // 如果选择完运输方式以后再删掉则提示
                    if (this.trspModeData.length === 0) {
                        this.trspHintShow = true
                        return
                    } else {
                        this.trspHintShow = false
                    }
                    if (valid && !this.trspHintShow) {
                        // 深拷贝add数据
                        let data = JSON.parse(JSON.stringify(this.addFormItem))
                        // 如果没有省份，就直接把第1项写入城市
                        if (!data.country.split('~')[2]) {
                            this.$set(data, 'city', data.country.split('~')[1])
                            this.$set(data, 'province', '')
                        } else {
                            this.$set(data, 'province', data.country.split('~')[1])
                            this.$set(data, 'city', data.country.split('~')[2])
                        }
                        data.country = data.country.split('~')[0]
                        let newTrspMode = this.trspModeCode.join(';')
                        data.trspMode = newTrspMode
                        // 处理填写了作业时间的数据
                        this.workTime.forEach(item => {
                            if(item.time[0]) {
                                this.stationOperationTimes.push({
                                    cycle: item.cycle,
                                    workShift: item.time[0],
                                    workOff: item.time[1]
                                })
                            }
                        })
                        data.stationOperationTimes = this.stationOperationTimes
                        apiAddStation({data}).then(res => {
                            this.$Message.info(res.message)
                            this.$refs.addFormRef.resetFields()
                            this.addFormItem = {}
                            this.trspModeData = []
                            this.stationOperationTimes = []
                            this.isModalShow = false
                            this.getData()
                        }).catch(this.stationOperationTimes = [])
                    }
                })
            },
            // 编辑保存
            saveEdit () {
                this.$refs.editFormRef.validate((valid) => {
                    // 如果选择完运输方式以后再删掉则提示
                    if (this.editTrspModeData.length === 0) {
                        this.editTrspHintShow = true
                        return
                    } else {
                        this.editTrspHintShow = false
                    }
                    if (valid && !this.editTrspHintShow) {
                        this.$set(this.editFormItem, 'province', this.editFormItem.country.split('~')[1])
                        this.$set(this.editFormItem, 'city', this.editFormItem.country.split('~')[2])
                        let data = JSON.parse(JSON.stringify(this.editFormItem))
                        let newTrspMode = this.editTrspModeCode.join(';')
                        data.country = this.editFormItem.country.split('~')[0]
                        data.trspMode = newTrspMode
                        // 处理填写了作业时间的数据
                        this.editWorkingTimeRange.forEach(item => {
                            if(item.time[0]) {
                                this.stationOperationTimesEdit.push({
                                    cycle: item.cycle,
                                    sttnCode: item.sttnCode,
                                    workShift: item.time[0],
                                    workOff: item.time[1]
                                })
                            }
                        })
                        data.stationOperationTimes = this.stationOperationTimesEdit
                        apiUpdate({data}).then(res => {
                            this.$Message.info(res.message)
                            this.isEditModalShow = false
                            this.stationOperationTimesEdit = []
                            this.getData()
                        }).catch(this.stationOperationTimesEdit = [])
                    }
                })
            },
            // 新增取消
            cancelAdd () {
                // 重置
                this.addFormItem = {}
                this.trspModeData = []
                if (this.$refs.addFormRef !== undefined) {
                    this.$refs.addFormRef.resetFields()
                }
            },
            // 编辑取消
            cancelEdit () {
                if (this.$refs.editFormRef !== undefined) {
                    this.$refs.editFormRef.resetFields()
                }
                this.editWorkingTimeRange = []
            },
            // 添加
            add () {
                this.isModalShow = true
                this.distinguish = 1
                this.trspHintShow = false
                // 置空
                this.addFormItem = {}
                this.trspModeData = []
            },
            // 编辑
            edit (row) {
                // 如果当前是启用状态，弹出弹框提示
                if (row.useStatus === 'enable') {
                    this.editModalShow = true
                    this.editMsg = `请停用${row.sttnName}场所再进行编辑`
                    this.stopData.useStatus = row.useStatus
                    this.stopData.sttnCode = row.sttnCode
                    this.stopData.examineDatetime = row.examineDatetime
                } else {
                    this.isEditModalShow = true
                    this.distinguish = 2
                    // 如果是中国就选择关区，否则就输入
                    if (row.country === 'CN') {
                        this.editCNShow = true
                    } else {
                        this.editCNShow = false
                    }
                    let data = {
                        'sttnCode': row.sttnCode
                    }
                    apiQueryInfo( data ).then(res => {
                        let editData = res.data
                        editData = JSON.parse(JSON.stringify(editData))
                        editData.country = `${editData.country}~${editData.province}~${editData.city}`
                        this.editTrspModeData = editData.trspModeTranslate.split(';')
                        this.editTrspModeCode = editData.trspMode.split(';')
                        this.editTrspModeData = [...new Set(this.editTrspModeData)]
                        this.editTrspModeCode = [...new Set(this.editTrspModeCode)]
                        this.editFormItem = editData
                        this.siteEditCode = res.data.sttnCode
                        // 处理场所作业时间返回的数据
                        if(res.data.stationOperationTimes) {
                            res.data.stationOperationTimes.forEach(item => {
                                this.editWorkingTimeRange.push({
                                    cycle: item.cycle,
                                    sttnCode: item.sttnCode,
                                    time: [item.workShift, item.workOff],
                                    name: item.cycleTranslate
                                })
                            })
                        }
                        // this.editWorkingTimeRange = res.data.stationOperationTimes || []
                    })
                }
            },
            // 启用
            startUsing (dataSource) {
                const data = this.handleRequestData(dataSource)
                // 批量操作，没有选择场所
                if (!data.length) return
                apiEnable({ data }).then(res => {
                    this.$Message.info(res.message)
                    this.getData()
                })
            },
            // 停用
            stopUsing (dataSource) {
                const data = this.handleRequestData(dataSource)
                // 批量操作，没有选择场所
                if (!data.length) return
                apiDisable({ data }).then(res => {
                    this.$Message.info(res.message)
                    this.getData()
                })
            },
            // 将数据处理ajax请求需要的入参数据
            handleRequestData (data) {
                const requestData = []
                // 单个启用，停用
                if (data) {
                    requestData.push(handle(data))
                    return requestData
                } else {
                    // 批量启用、停用
                    if (!this.selectionList.length) {
                        this.$Message.warning('请先选择场所')
                    } else {
                        for (const list of this.selectionList) {
                            requestData.push(handle(list))
                        }
                    }
                    return requestData
                }
                // 取到所需要的数据
                function handle (obj) {
                    const { examineStatus, useStatus, sttnCode, examineDatetime, version } = obj
                    return {
                        examineStatus,
                        useStatus,
                        sttnCode,
                        version,
                        examineDatetime: toTimestamp(examineDatetime)
                    }
                }
            },
            // 审核
            examine (row) {
                this.reason = ''
                // 根据状态判断是启用审核
                if (!row.useStatus || row.useStatus === 'disable') {
                    this.examineType = 1
                    this.examineModalTitle = '启用审核'
                } else {
                    this.examineType = 0
                    this.examineModalTitle = '停用审核'
                }
                this.examineInfo.examineStatus = row.examineStatus
                this.examineInfo.disagreeReason = ''
                this.examineInfo.opinion = ''
                this.examineInfo.sttnCode = row.sttnCode
                this.examineInfo.useStatus = row.useStatus
                this.isAuditShow = true
            },
            // 审核确定
            saveAudit () {
                const data = { ...this.examineInfo}
                // 启用
                if (this.examineType === 1) {
                    // 同意
                    if (this.agree === '1') {
                        data.opinion = 'AO'
                        apiExamine({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isAuditShow = false
                            this.getData()
                        })
                    } else {
                        if (!this.reason) {
                            this.$Message.warning('请填写输入驳回原因！')
                            return
                        }
                        data.opinion = 'DO'
                        data.disagreeReason = this.reason
                        // 不同意
                        apiExamine({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isAuditShow = false
                            this.getData()
                        })
                    }
                } else {
                    // 停用审核
                    // 同意
                    if (this.agree === '1') {
                        data.opinion = 'AC'
                        apiExamine({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isAuditShow = false
                            this.getData()
                        })
                    } else {
                        if (!this.reason) {
                            this.$Message.warning('请填写输入驳回原因！')
                            return
                        }
                        data.opinion = 'DC'
                        data.disagreeReason = this.reason
                        // 不同意
                        apiExamine({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.isAuditShow = false
                            this.getData()
                        })
                    }
                }
            },
            detail (row) {
                const data = row.sttnCode
                this.$router.push({path: '/standard-mapper/site-manage/detail', query: {sttnCode: data}})
            },
            // 编辑提示点击确定
            editModalClick () {
                // 停用
                this.stopUsing(this.stopData)
                this.editModalShow = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .ivu-form-item-error-tip {
        font-size: 12px;
    }
    .ivu-divider {
        margin-top: 0;
        background: #c8c8c8;
    }
    /deep/ .ivu-form-item-content {
        position: relative;
        line-height: 1.5;
        small{
            position: absolute;
            left: -80px;
            top: 28%;
            color: red;
            font-size: 14px;
        }
    }
    .hint {
        font-size: 12px;
        color: $error-color;
    }
    .trsp-hint {
        /deep/ .ivu-select-selection {
            border: 1px solid $error-color !important;
        }
        /deep/ .ivu-select-arrow{
            color: $error-color;
        }
    }
    .select-value {
        display: inline-block;
        vertical-align: sub;
        span {
            position: relative;
            display: inline-block;
            width: 112px;
            font-size: 12px;
            color: #666;
            background: #F5F5F5;
            padding: 2px 10px;
            margin-right: 20px;
            border-radius: 4px;
            .ivu-icon {
                position: absolute;
                right: 10px;
                top: 22%;
                font-size: 14px;
                color: #DCDCDC;
                cursor: pointer;
            }
            .ivu-icon:hover{
                color: $light-color;
            }
        }
    }
    .tab-work {
        margin-bottom: 20px;
    }
</style>
