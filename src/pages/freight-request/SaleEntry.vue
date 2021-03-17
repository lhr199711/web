
<template>
    <div class="feedback-details simple-entry">
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="4">
                        <div class="name">录入货运要求</div>
                    </Col>
                    <Col span="20">
                        <Button @click="send" v-if="sendShow">发送</Button>
                        <Button type="primary" class="save-btn" @click="save('formValidate')">保存</Button>
                    </Col>
                </Row>
            </div>
        </div>
        <div class="public-table-content public-input">
            <div class="l-content">
                <div class="table-data">
                    <ul class="transit">
                        <p class="table-title">基本信息</p>
                        <Form
                            ref="formValidate"
                            label-position="left"
                            :model="transitModal"
                            :label-width="100"
                            :rules="ruleValidate"
                        >
                            <div class="form-item-content">
                                <FormItem label="启运地：" class="min-width">
                                    <small class="rule-class">*</small>
                                    <adt-city-selector @on-change="handelDirStart" style="width:120px;display: inline-block;marginRight: 10px" />
                                    <Select v-model="transitModal.custStartPlace" filterable clearable @on-change="onPlaceChange">
                                        <Option v-for="item in custStartPlace" :value="item.value+'-'+item.label" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                    <span class="btn-ok" @click="okPlace">确定</span>
                                    <p class="hint" v-show="startHintShow">请输入启运地</p>
                                    <p class="select-value">
                                        <span v-for="(value, index) in startPlace" :key="index">
                                            {{ value }}
                                            <Icon type="ios-close-circle" @click="delPlaceDeparture(index)" />
                                        </span>
                                    </p>
                                </FormItem>
                                <FormItem label="目的地：" class="min-width">
                                    <small class="rule-class">*</small>
                                    <adt-city-selector @on-change="handelDirEnd" style="width:120px;display: inline-block;marginRight: 10px" />
                                    <Select v-model="transitModal.custEndPlace" filterable clearable @on-change="onEndPlaceChange">
                                        <Option v-for="item in custEndPlace" :value="item.value+'-'+item.label" :key="item.value" >{{ item.label }}</Option>
                                    </Select>
                                    <span class="btn-ok" @click="okEndPlace">确定</span>
                                    <p class="hint" v-show="endHintShow">请输入目的地</p>
                                    <p class="select-value">
                                        <span v-for="(value, index) in endPlace" :key="index">
                                            {{ value }}
                                            <Icon type="ios-close-circle" @click="delCustEndPlace(index)"/></span>
                                    </p>
                                </FormItem>
                                <FormItem label="中转地：" class="min-width">
                                    <adt-city-selector @on-change="handelDirTrsspmPort" style="width:120px;display: inline-block;marginRight: 10px"></adt-city-selector>
                                    <Select v-model="transitModal.custTransitPlace" filterable clearable @on-change="onSiteChange">
                                        <Option v-for="item in custTransitPlace" :value="item.value+'-'+item.label" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                    <span class="btn-ok" @click="okCustTransitPlace">确定</span>
                                    <p class="select-value">
                                        <span v-for="(value, index) in ctransitPlace" :key="index">
                                            {{ value }}
                                            <Icon type="ios-close-circle" @click="delTransit(index)" />
                                        </span>
                                    </p>
                                </FormItem>
                                <FormItem label="货物类型：" prop="cargoType">
                                    <Select v-model="transitModal.cargoType" clearable @on-change="cargoTypeChange" style="width:120px;">
                                        <Option v-for="(item, index) in cargoType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="物流类型：" prop="logisticsType">
                                    <Select v-model="transitModal.logisticsType" clearable style="width:120px;">
                                        <Option v-for="(item, index) in logisticsType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="运输类型：" prop="trspType">
                                    <Select v-model="transitModal.trspType" clearable style="width:120px;">
                                        <Option v-for="(item, index) in trspType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                    </Select>
                                </FormItem>
                            </div>
                            <div class="create-path">
                                <span @click="createPathClick('formValidate')">生成路线</span>
                            </div>
                        </Form>
                    </ul>
                </div>
            </div>
        </div>
        <div class="back">
            <div v-if="this.pathData.length > 0" class="path-info">
                <Row>
                    <Col span="22">
                        <ul class="path-list">
                             <li
                                v-for="(list, index) of pathData"
                                :key="index"
                                :class="{'path-click': pathNum == index}"
                                @click="pathClick(index, list)"
                            >
                                {{ list.routeStr.split(';').join('-') }}
                            </li>
                        </ul>
                    </Col>
                    <Col span="2">
                        <span class="select-path" @click="selectPathClick">选择路线</span>
                    </Col>
                </Row>
            </div>
            <div class="path-info-details">
                <div v-show="pathIndex === pathNum" v-for="(pathList, pathIndex) of pathData" :key="pathIndex" class="details-switchover">
                    <div class="title">
                        <adt-tab-btns
                            :height="40"
                            :width="200"
                            :isUnderline="isUnderline"
                            :titleNames="titleNames"
                            :btnIndex="changeIndex"
                            @handleBtn="handleBtn"
                        />
                    </div>
                    <!-- 路线参数模块 -->
                    <div v-if="tabBarShow" class="route-param">
                        <p class="left-tit">
                            <span :class="{'tab-click': tabNum == 0}" @click="leftTabClick(0)">运输服务</span>
                            <span :class="{'tab-click': tabNum == 1}" @click="leftTabClick(1)">节点服务</span>
                        </p>
                        <!-- 运输服务模块 -->
                        <div v-if="transportServiceShow" class="route-param-content">
                            <ul>
                                <li
                                    v-for="(list, index) of pathList.roadList"
                                    :key="index"
                                    class="path"
                                    :class="{'path-click': pathList.lineNum == index || (!pathList.lineNum && index === 0)}"
                                    @click="lineSectionsClick(index, pathIndex)"
                                >
                                    <span>
                                        {{ list.startPlace }}
                                        <i>-</i>
                                        {{ list.endPlace }}
                                    </span>
                                </li>
                            </ul>
                            <Divider />
                            <div class="public-table-content" >
                                <div class="l-content">
                                    <!-- 运输服务 -->
                                    <div
                                        v-show="pathList.lineNum == index || (!pathList.lineNum && index === 0)"
                                        v-for="(list, index) of pathList.roadList"
                                        :key="index"
                                        class="table-data"
                                    >
                                        <ul>
                                            <p class="table-title">
                                                <span>设置服务参数：</span>
                                                <span class="look-btn" @click="selectAttachingTask(list, index)">选择附加任务</span>
                                            </p>
                                            <!-- 下面的表格 -->
                                            <div class="input-table">
                                                <Form ref="formRoadListValidate" label-position="left" :model="list.serverParam" :label-width="100">
                                                    <FormItem label="运输方式：" prop="trspMode">
                                                        <small class="rule-class">*</small>
                                                        <RadioGroup v-model="list.serverParam.trspMode" >
                                                            <Radio v-for="(item, index) in trspMode" :key="index" :label="item.dictionaryKey">{{ item.dictionaryValue }}</Radio>
                                                        </RadioGroup>
                                                    </FormItem>
                                                    <FormItem v-if="list.serverParam.contaShow" label="集装箱来源：">
                                                        <small class="rule-class-five">*</small>
                                                        <Select v-model="list.serverParam.contaSource" clearable style="width:120px;">
                                                            <Option v-for="(item, index) in contaSource" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem v-else>
                                                    </FormItem>
                                                    <FormItem label="物流类型：" prop="logisticsType">
                                                        <small class="rule-class">*</small>
                                                        <Select v-model="list.serverParam.logisticsType" clearable style="width:120px;">
                                                            <Option v-for="(item, index) in logisticsType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem v-if="list.serverParam.contaShow" label="集装箱尺寸类型：">
                                                        <small class="rule-class-seven">*</small>
                                                        <Select
                                                            v-model="list.serverParam.contaSizeType"
                                                            clearable
                                                            @on-open-change="contaSizeTypeChange"
                                                            style="width:120px;"
                                                        >
                                                            <Option v-for="(item, index) in contaSizeType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem v-else>
                                                    </FormItem>
                                                    <FormItem label="运输类型："  prop="trspType">
                                                        <small class="rule-class">*</small>
                                                        <Select
                                                            v-model="list.serverParam.trspType"
                                                            clearable
                                                            @on-change="trspTypeChange($event, list, index)"
                                                            style="width:120px;"
                                                        >
                                                            <Option v-for="(item, index) in trspType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem v-if="list.serverParam.contaShow" label="提箱类型：">
                                                        <small class="rule-class">*</small>
                                                        <RadioGroup v-model="list.serverParam.suitcaseType" >
                                                            <Radio v-for="(item, index) in suitcaseType" :key="index" :label="item.dictionaryKey">{{ item.dictionaryValue }}</Radio>
                                                        </RadioGroup>
                                                    </FormItem>
                                                    <FormItem v-else>
                                                    </FormItem>
                                                    <FormItem v-if="list.serverParam.contaShow" label="集装箱数量：">
                                                        <small class="rule-class-five">*</small>
                                                        <Input v-model="list.serverParam.contaQty" type="number" style="width:120px;" />
                                                    </FormItem>
                                                    <FormItem v-else>
                                                    </FormItem>
                                                    <FormItem>
                                                    </FormItem>
                                                </Form>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 节点服务模块 -->
                        <div v-else class="route-param-content">
                            <ul>
                                <li
                                    v-for="(list, index) of pathList.nodeList" :key="index" 
                                    :class="{'path-click': pathList.nodeNum == index || (!pathList.nodeNum && index === 0)}"
                                    class="path one-path"
                                    @click="nodeSectionsClick(index, pathIndex)" 
                                >{{ list.node }}</li>
                            </ul>
                            <Divider />
                            <div class="public-table-content">
                                <div class="l-content">
                                    <div
                                        v-show="pathList.nodeNum == index || (!pathList.nodeNum && index === 0)"
                                        v-for="(list, index) of pathList.nodeList"
                                        :key="index"
                                        class="table-data"
                                    >
                                        <ul>
                                            <p class="table-title">
                                                <span>设置服务参数：</span>
                                                <span class="look-btn" @click="selectAttachingTask(list, index)">选择附加任务</span>
                                            </p>
                                            <!-- 节点服务 -->
                                            <!-- 下面的表格 -->
                                            <div class="input-table">
                                                <Form :model="list.serverParam" label-position="left" :label-width="100">
                                                    <FormItem label="物流类型：" prop="logisticsType">
                                                        <small class="rule-class">*</small>
                                                        <Select v-model="list.serverParam.logisticsType" clearable style="width:120px;">
                                                            <Option v-for="(item, index) in logisticsType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem v-if="list.serverParam.contaNodeShow" label="集装箱来源：">
                                                        <small class="rule-class-five">*</small>
                                                        <Select v-model="list.serverParam.contaSource" clearable style="width:120px;">
                                                            <Option v-for="(item, index) in contaSource" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem v-else>
                                                    </FormItem>
                                                    <FormItem label="运输类型："  prop="trspType">
                                                        <small class="rule-class">*</small>
                                                        <Select
                                                            v-model="list.serverParam.trspType"
                                                            clearable
                                                            @on-change="trspTypeNodeChange($event, list, index)"
                                                            style="width:120px;"
                                                        >
                                                            <Option v-for="(item, index) in trspType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem v-if="list.serverParam.contaNodeShow" label="集装箱尺寸类型：">
                                                        <small class="rule-class-seven">*</small>
                                                        <Select
                                                            v-model="list.serverParam.contaSizeType"
                                                            clearable
                                                            @on-open-change="contaSizeTypeChange"
                                                            style="width:120px;"
                                                        >
                                                            <Option v-for="(item, index) in contaSizeType" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem v-else>
                                                    </FormItem>
                                                    <FormItem v-if="list.serverParam.contaNodeShow" label="提箱类型：">
                                                        <small class="rule-class">*</small>
                                                        <RadioGroup v-model="list.serverParam.suitcaseType" >
                                                            <Radio v-for="(item, index) in suitcaseType" :key="index" :label="item.dictionaryKey">{{ item.dictionaryValue }}</Radio>
                                                        </RadioGroup>
                                                    </FormItem>
                                                    <FormItem v-else>
                                                    </FormItem>
                                                    <FormItem v-if="list.serverParam.contaNodeShow" label="集装箱数量：">
                                                        <small class="rule-class-five">*</small>
                                                        <Input v-model="list.serverParam.contaQty" type="number" style="width:120px;" />
                                                    </FormItem>
                                                    <FormItem v-else>
                                                    </FormItem>
                                                </Form>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 运输要求模块 -->
                    <div
                        v-else
                        v-show="index === pathNum"
                        v-for="(list, index) of pathData"
                        :key="index"
                        class="trans-requry"
                    >
                        <div class="transport-requry public-detail">
                            <div class="input-table">
                                <Form :model="list" :label-width="100" label-position="left">
                                    <FormItem label="主要运输方式：">
                                        <small class="rule-class-six">*</small>
                                        <RadioGroup v-model="list.mainTrspMode" >
                                            <Radio v-for="(item, index) in trspMode" :key="index" :label="item.dictionaryKey">{{ item.dictionaryValue }}</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <FormItem label="最晚到达时间：">
                                        <DatePicker v-model="list.lastArriveTime"  type="date" style="width: 200px;"></DatePicker>
                                    </FormItem>
                                    <FormItem label="提箱类型：">
                                        <RadioGroup v-model="list.suitcaseType" >
                                            <Radio v-for="(item, index) in suitcaseType" :key="index" :label="item.dictionaryKey">{{ item.dictionaryValue }}</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <FormItem label="最低时长要求：">
                                        <Input v-model="list.lowestTimeReq" type="text" />
                                        <!-- 单位 -->
                                        <Select v-model="list.timeUnit" clearable style="width:120px;">
                                            <Option v-for="(item, index) in timeUnit" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="集装箱数量：">
                                        <Input v-model="list.contaQty" type="text" />
                                    </FormItem>
                                    <FormItem label="最高价格要求：">
                                        <Input v-model="list.highestCostReq" type="text" />
                                        <!-- 单位 -->
                                        <Select v-model="list.currencyUnit" clearable style="width:120px;">
                                            <Option v-for="(item, index) in currencyUnit" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="货物适宜温度">
                                        <Input v-model="list.cargoSuitTemp" type="text" />
                                        <!-- 单位 -->
                                        <Select v-model="list.tempUnit" clearable style="width:120px;">
                                            <Option v-for="(item, index) in tempUnit" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="">
                                    </FormItem>
                                    <FormItem label="报关地要求：">
                                        <Input v-model="list.customsReq" type="text" />
                                    </FormItem>
                                    <FormItem label="">
                                    </FormItem>
                                    <FormItem label="最迟起运时间：">
                                        <DatePicker v-model="list.lastStartTime" type="date" style="width: 200px;" />
                                    </FormItem>
                                    <FormItem label="">
                                    </FormItem>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Divider class="light-color" />
            <!-- 备注 -->
            <p class="remark">
                <span class="remark-tit">货运要求备注：</span>
                <Input
                    v-model="transitModal.freightBrief"
                    :autosize="{minRows: 3,maxRows: 5}"
                    type="textarea"
                    placeholder="请输入货运要求备注，500字以内！"
                    maxlength="500" 
                />
            </p>
        </div>
        <adt-reconfirm-modal
            :showModal="isTransitModal"
            :message="transitText"
            @on-ok="transitConfirm"
            @on-visible-change="visibleChange"
        />
        <adt-reconfirm-modal
            :showModal="isPlaceDepartureModal"
            :message="placeDepartureText"
            @on-visible-change="visiblePlaceDeparture"
            @on-ok="handleConfirm"
            @on-cancel="handleCancel"
        />
        <adt-my-modal
            title="选择附加任务"
            width="670px"
            :showModal="isModalShow"
            @on-visible-change="visibleChangeSelect"
            @on-ok="handleSelectConfirm"
        >
            <div class="scene-box">
                <span
                    v-for="(item, key) of taskData"
                    :key="key"
                    :class="{'path-click': attachingTaskNum === key}"
                    class="scene"
                    @click="attachingTaskClick(key, item)"
                    
                >
                    {{ item.sceneName }}
                </span>
            </div>
            <ul class="attaching-task-tit">
                <p
                    v-show="attachingTaskNum === key"
                    v-for="(item, key) of taskData"
                    :key="key"
                    class="attaching-task-content"
                >
                    <span class="title">选择附加任务</span>
                    <CheckboxGroup v-model="attachingTaskVal">
                        <Checkbox
                            v-for="(list, index) of item.affixList"
                            :key="index"
                            :label="list.taskName+'-'+list.taskCode+';'+list.sceneName+','+list.sceneCode"
                        >
                            {{list.taskName}}
                        </Checkbox>
                    </CheckboxGroup>
                </p>
            </ul>
        </adt-my-modal>
        <adt-my-modal
            title="选择路线"
            width="800px"
            :showModal="isPathModalShow"
            @on-visible-change="visibleChangePath"
            @on-ok="handlePathConfirm"
        >
            <Form
                class= "select-path"
                ref="deadLineFormValidate"
                inline
                label-position="left"
                :model="pathValData"
                :label-colon="true"
            >
                <FormItem>
                    <CheckboxGroup v-model="pathValue" class="scene-checkbox">
                        <Checkbox v-for="(list, index) of pathDataValue" :key="index" :label="list.routeCode">
                            <p class="select-path-value">
                                {{ list.routeStr.split(';').join('-') }}
                            </p>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
        </adt-my-modal>
    </div>
</template>

<script>
    import { apiChangJing } from '@/api/logisticsCommission'
    import validateRules from '@/libs/validateRules'
    import freightRequestEntry from '@/mixins/freightRequestEntry'
    import {
        apiGenerateRoute,
        apiSaleAddFreight,
        apiSendDispatch,
        apiGetTaskAffix
    } from '@/api/freight'
    import { toTimestamp } from '@/libs/utils'
    export default {
        mixins: [freightRequestEntry],
        name: 'SaleEntry',
        data() {
            return {
                // 运输类型
                trspType: this.$getDictionary('TRANSPORT_TYPE'),
                // 货物类型
                cargoType: this.$getDictionary('GOODS_TYPE'),
                // 物流类型
                logisticsType: this.$getDictionary('LOGISTICS_TYPE'),
                //集装箱尺寸类型
                contaSizeType: this.$getDictionary('CONTAINER_SIZE_TYPE'),
                // 集装箱来源
                contaSource: this.$getDictionary('CONTAINER_SOURCE'),
                // 运输方式
                trspMode: this.$getDictionary('TRANSPORT_MODE'),
                // 提箱类型
                suitcaseType: this.$getDictionary('SUITCASE_TYPE'),
                // 天
                timeUnit: this.$getDictionary('TIME_UNIT'),
                // 币种
                currencyUnit: this.$getDictionary('CURRENCY_CODE'),
                // 温度
                tempUnit: this.$getDictionary('TEMPERATURE_UNIT'),
                pathValData: {},
                // 选中的路线
                pathValue: [],
                // 选择附加任务
                isModalShow: false,
                // 选择路线
                isPathModalShow: false,
                attachingTaskNum: 0,
                // 选择附加任务的值
                attachingTaskVal: [],
                // 启运地
                custStartPlace: [],
                // 中转地
                custTransitPlace: [],
                // 目的地
                custEndPlace: [],
                transitText: '',
                placeDepartureText: '',
                isTransitModal: false,
                isPlaceDepartureModal: false,
                ruleValidate: {
                    cargoType: [
                        validateRules.select('货物类型')[0]
                        // { required: true, message: '请选择货物类型', trigger: 'change' }
                    ],
                    logisticsType: [
                        validateRules.select('物流类型')[0]
                    ],
                    trspType: [
                        validateRules.select('运输类型')[0]
                    ]
                },
                ctransitPlace: [],
                startPlace: [],
                endPlace: [],
                checkList: [],
                btnIndex: 1,
                titleTabNames: ['客户录入信息', '销售编辑信息', '调度编辑信息'],
                isUnderline: true,
                changeIndex: 1,
                titleNames: ['设置路线参数', '设置运输要求'],
                // 货运路线
                pathNum: 0,
                // 路段
                lineNum: 0,
                // 节点
                nodeNum: 0,
                // 左侧tab
                tabNum: 0,
                tabBarShow: true,
                // 运输服务模块
                transportServiceShow: true,
                // 启运地目的地超过三个，继续添加
                addPlaceChange: false,
                isStartPlaceModalShow: false,
                // 目的地目的地超过三个，继续添加
                addEndPlaceChange: false,
                isEndPlaceModalShow: false,
                // 是否是客户
                isClient: false,
                // 点击生成路线的路线值
                pathDataValue: [],
                // 选择的路线展示在页面
                selectPathData: [],
                freightReqCode: '',
                freightReqStatus: '',
                sendShow: false,
                startPlaceCode: [],
                endPlaceCode: [],
                ctransitPlaceCode: [],
                // 附加任务
                taskData: [],
                taskList: [],
                curList: []
            }
        },
        mounted () {
            this.transitText = `中转地过多会导致物流方案的费用过高，<br>时效过长，如需添加请<a class="modal-a" href="">联系客服</a>`;
            this.placeDepartureText = `您增加的启运地（目的地）已超过三个， 会匹配出多条路线。是否继续增加？`
        },
        methods: {
            // 点击附加任务的场景
            attachingTaskClick (key) {
                this.attachingTaskNum = key
            },
            // 选择附加任务打开
            selectAttachingTask (list, index) {
                this.attachingTaskVal = []
                let reqtasks = list.reqTaskList
                reqtasks.forEach(element => {
                    let sceneCode = element.sceneCode
                    let sceneName = element.sceneName
                    element.affixList.forEach(affixs => {
                        this.attachingTaskVal.push(affixs.taskName + '-' + affixs.taskCode + ';' + sceneName + ',' + sceneCode)
                    })
                })
                this.curList = list
                this.taskList = JSON.parse(JSON.stringify(list.reqTaskList))
                let data = {
                    'logisticsType': list.serverParam.logisticsType,
                    'trspType': list.serverParam.trspType
                }
                apiGetTaskAffix(data).then((res) => {
                    this.taskData = res.data
                })
                this.isModalShow = true
            },
            // 选择附加任务点击
            handleSelectConfirm () {
                this.taskList = []
                if (this.attachingTaskVal) {
                    let sceneCodes = ''
                    for (const item of this.attachingTaskVal) {
                        let taskaffix = {}
                        let sceneCode = item.split(',')[1]
                        let taskAffixlist = []
                        if (sceneCodes.search(sceneCode) > -1) {
                            this.taskList.forEach(element => {
                                if (element['sceneCode'] === sceneCode) {
                                    taskaffix = element
                                    taskAffixlist = taskaffix.affixList
                                    let affix = {}
                                    this.$set(affix, 'taskCode', item.substring(item.indexOf('-') + 1, item.lastIndexOf(';')))
                                    this.$set(affix, 'taskName', item.split('-')[0])
                                    this.$set(affix, 'sceneCode', sceneCode)
                                    this.$set(affix, 'sceneName', item.substring(item.indexOf(';') + 1, item.lastIndexOf(',')))
                                    taskAffixlist.push(affix)
                                    taskaffix['affixList'] = taskAffixlist
                                }
                            })
                        } else {
                            this.$set(taskaffix, 'sceneCode', sceneCode)
                            this.$set(taskaffix, 'sceneName', item.substring(item.indexOf(';') + 1, item.lastIndexOf(',')))
                            let affix = {}
                            this.$set(affix, 'taskCode', item.substring(item.indexOf('-') + 1, item.lastIndexOf(';')))
                            this.$set(affix, 'taskName', item.split('-')[0])
                            this.$set(affix, 'sceneCode', sceneCode)
                            this.$set(affix, 'sceneName', item.substring(item.indexOf(';') + 1, item.lastIndexOf(',')))
                            taskAffixlist.push(affix)
                            this.$set(taskaffix, 'affixList', taskAffixlist)
                            sceneCodes += (sceneCode + ';')
                            this.taskList.push(taskaffix)
                            this.taskList = [...new Set(this.taskList)]
                        }
                    }
                }
                this.isModalShow = false
                this.curList.reqTaskList = this.taskList
            },
            // 点击货运路线
            pathClick (key, value){
                this.pathNum = key
            },
            // 点击下面的tab
            handleBtn (index, titleItem) {
                this.changeIndex = index + 1
                if (titleItem === '设置运输要求') {
                    this.tabBarShow = false
                } else {
                    this.tabBarShow = true
                }
            },
            // 点击下面的路段
            lineSectionsClick (index, pathIndex) {
                this.$set(this.pathData[pathIndex], 'lineNum', index)
            },
            // 点击下面的节点
            nodeSectionsClick (index, pathIndex) {
                // this.nodeNum = key
                this.$set(this.pathData[pathIndex], 'nodeNum', index)
            },
            // 点击左侧tab
            leftTabClick (key) {
                this.tabNum = key
                if(this.tabNum == 0) {
                    this.transportServiceShow = true
                } else {
                    this.transportServiceShow = false
                }
            },
            // 保存
            save (name) {
                const data = JSON.parse(JSON.stringify(this.pathData))
                for (const item of data) {
                    item.lastArriveTime = toTimestamp(item.lastArriveTime)
                    item.lastStartTime = toTimestamp(item.lastStartTime)
                    item.cargoSuitTemp = Number(item.cargoSuitTemp)
                    item.contaQty = Number(item.contaQty)
                    item.highestCostReq = Number(item.highestCostReq)
                    // 改成code
                    item.custStartPlace = this.startPlaceCode
                    item.custTransitPlace = this.ctransitPlaceCode
                    item.custEndPlace = this.endPlaceCode
                    for (const nodeItem of item.nodeList) {
                        nodeItem.serverParam.contaQty = Number(nodeItem.serverParam.contaQty)
                    }
                    for (const roadItem of item.roadList) {
                        roadItem.serverParam.contaQty = Number(roadItem.serverParam.contaQty)
                    }
                    this.$set(item, 'cargoType', this.transitModal.cargoType)
                    this.$set(item, 'logisticsType', this.transitModal.logisticsType)
                    this.$set(item, 'trspType', this.transitModal.trspType)
                    this.$set(item, 'freightBrief', this.transitModal.freightBrief)
                }
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        apiSaleAddFreight({ data }).then(res => {
                            this.$Message.info(res.message)
                            this.freightReqCode = res.data.freightReqCode
                            this.freightReqStatus = res.data.freightReqStatus
                            // 显示发送按钮
                            this.sendShow = true
                        })
                    }
                })
            },
            // 发送
            send () {
                const data = {
                    freightReqCode: this.freightReqCode,
                    freightReqStatus: this.freightReqStatus
                }
                apiSendDispatch({ data }).then(res => {
                    this.$Message.info(res.message)
                    if(res.code == 200) {
                        this.$router.push(`/freight-request/sale-list/1`)
                    }

                })
            },
            // 启运地超过3个弹框确定
            handleConfirm () {
                this.addPlaceChange = true
                this.isPlaceDepartureModal = false
            },
            // 启运地超过三个弹框取消
            handleCancel () {
                this.isEndPlaceModalShow = false
                this.isStartPlaceModalShow = false
                this.isPlaceDepartureModal = false
            },
            // 中转地
            transitConfirm () {
                this.isTransitModal = false
            },
            // 选择路线的确定
            handlePathConfirm () {
                // 取到code之后跟data比对，拿到对应的路线，push到pathData里面。
                const dataValue = []
                for (const item of this.pathDataValue) {
                    if (this.pathValue.includes(item.routeCode)) {
                        dataValue.push(item)
                    }
                }
                for (const item of dataValue) {
                    this.$set(item, 'roleList', {})
                    this.$set(item, 'custEndPlace', this.endPlace)
                    this.$set(item, 'custStartPlace', this.startPlace)
                    this.$set(item, 'custTransitPlace', this.ctransitPlace)
                    // 集装箱
                    this.$set(item, 'contaList', [])
                    for (const list of item.roadList) {
                        this.$set(list, 'departurePort', list.startPlace)
                        this.$set(list, 'destinationPort', list.endPlace)
                        this.$set(list, 'serverParam', {})
                        this.$set(list, 'reqTaskList', [])
                    }
                    for (const list of item.nodeList) {
                        this.$set(list, 'nodePort', list.node)
                        this.$set(list, 'serverParam', {})
                        this.$set(list, 'reqTaskList', [])
                    }
                }
                this.pathData = dataValue
                // 如果为件杂货隐藏当前集装箱的字段
                // 循环每个节点和路段插入contaShow
                for (const list of this.pathData) {
                    for (const item of list.roadList) {
                        this.$set(item.serverParam, 'contaShow', true)
                    }
                }
                for (const list of this.pathData) {
                    for (const item of list.nodeList) {
                        this.$set(item.serverParam, 'contaNodeShow', true)
                    }
                }
                this.isPathModalShow = false
            },
            // 点击选择路线
            selectPathClick () {
                this.isPathModalShow = true
            }
        }
    }
</script>
<style lang="scss" scoped>
    .feedback-details .path-info-details .details-switchover .route-param .left-tit span {
        padding: 22px 30px;
    }
    .details-switchover {
        padding-top: 0 !important;
    }
    .feedback-details {
        .path-info .path-list {
            width: 100%;;
            padding-bottom: 20px !important;
        }
        .back {
            background: #fff;
            padding-bottom: 10px;
        }
    }
    .input-table {
        .ivu-form-item {
            position: relative;
        }
    }
    .light-color {
        width: 80% !important;
        background: $light-color;
    }
    .remark {
        margin: 10px 20px;
        .remark-tit {
            font-weight: bold;
            vertical-align: middle;
        }
        .remark-val{
            display: inline-block;
            width: 89%;
            min-height: 50px;
            vertical-align: middle;
            padding: 14px 30px;
            margin-top: 8px;
            background: #f9f9f9;
            border: 1px solid #e5e5e5;
        }
    }
    .scene-box{
        overflow: auto;
        white-space: nowrap;
        margin: 0 28px;
        @extend %scrollbar-crosswise;
        .scene {
            display: inline-block;
            padding: 0px 30px;
            margin-left: 20px;
            margin-bottom: 4px;
            background: #E5E5E5;
            border-radius: 4px;
            cursor: pointer;
            &:first-child {
                margin: 0;
            }
        }
    }

    .attaching-task-tit {
        margin-top: 10px;
    }
    .attaching-task-content {
        margin: 8px 30px;
        .title {
            display: inline-block;
            margin-bottom: 10px;
        }
        .ivu-checkbox-wrapper {
            width: 31%;
            text-align: left;
            line-height: 3;
        }
    }
    .input-table {
        /deep/ .ivu-form-item-error-tip {
            top: 12%;
            left: 70%;
        }
    }
    .path-click {
        background-color:$info-prompt-color !important;
        border: 1px solid $light-color !important;
    }
    /deep/ .ivu-icon-ios-calendar-outline {
        line-height: 20px !important;
    }
    .select-path {
        .ivu-checkbox-wrapper {
            width: 100%;
            margin-bottom: 20px;
        }
        .select-path-value {
            display: inline-block;
            width: 666px;
            background: #f5f5f5;
            padding: 6px 40px;
            margin-left: 6px;
            border-radius: 4px;
        }
    }
    .ivu-cascader-size-default {
        /deep/ .ivu-input {
            width: 120px !important;
            height: 20px;
        }
        /deep/ .ivu-cascader-label {
            line-height: 20px;
        }
    }
    .btn-ok {
        font-size: 12px;
        color: #fff;
        background: $light-color;
        padding: 2px 8px;
        margin-left: 6px;
        border-radius: 4px;
        cursor: pointer;
    }
    .table-data {
        .hint {
            display: inline-block;
            font-size: 12px;
            color: $error-color;
        }
    }
    .rule-class {
        position: absolute;
        z-index: 10;
        left: -78px;
        top: 4px;
        color: $error-color;
    }
    .rule-class-five{
        position: absolute;
        z-index: 100;
        left: -98px;
        top: 22%;
        color: red;
    }
    .rule-class-seven {
        position: absolute;
        z-index: 100;
        left: -120px;
        top: 22%;
        color: red;
    }
    .rule-class-six {
        position: absolute;
        z-index: 100;
        left: -106px;
        top: 22%;
        color: red;
    }
    .public-input {
        padding: 20px !important;
        background: #fff !important;
        .table-data {
            background-color: #f9f9f9 !important;
            .transit {
                background: #f9f9f9 !important;
            }
        }
    }
</style>