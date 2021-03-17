<template>
    <div class="add-product">
        <div class="choose-type">
            选择服务产品类型：
            <Select v-model="productType" @on-change="goToAddProduct">
                <Option v-for="item in serviceType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                    {{ item.dictionaryValue }}
                </Option>
            </Select>
        </div>
        <div class="white-bg add-product-content">
            <div class="add-site">
                <h6>添加路线场所：</h6>
                <div class="container">
                    <Form
                        ref="formValidate"
                        label-position="left"
                        :model="siteData"
                        :rules="ruleValidate"
                        :label-colon="true"
                        :label-width="75"
                        inline
                    >
                        <FormItem label="启运地" prop="dispatchCity" :label-width="70">
                            <adt-city-selector @on-change="changeDispatchCity" />
                        </FormItem>
                        <FormItem label="选择场所" prop="dispatchSite">
                            <Select v-model="siteData.dispatchSite" clearable>
                                <Option v-for="(option, index) in dispatchOptions" :key="index" :value="`${option.value}~${option.label}`">
                                    {{ option.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <svg class="iconfont arrow" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_jiantou" />
                        </svg>
                        <FormItem label="目的地" prop="destinationCity" :label-width="70" style="margin-left: 50px;">
                            <adt-city-selector @on-change="changeDestinationCity"></adt-city-selector>
                        </FormItem>
                       <FormItem label="选择场所" prop="destinationSite">
                            <Select v-model="siteData.destinationSite" clearable>
                                <Option v-for="(option, index) in destinationOptions" :key="index" :value="`${option.value}~${option.label}`">
                                    {{ option.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <div>
                            <FormItem class="mileage" label="里程" prop="mileage" :label-width="70">
                                <Input
                                    v-model="siteData.mileage"
                                />
                                <span>公里</span>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </div>
            <div class="choose-parameter">
                <h6>选择参数：</h6>
                <div class="container">
                    <Form
                        ref="parameterFormValidate"
                        label-position="left"
                        :model="parameterData"
                        :rules="parameterRuleValidate"
                        :label-colon="true"
                        :label-width="126"
                        inline
                    >
                        <FormItem label="运输方式" prop="trspMode">
                            <Select v-model="parameterData.trspMode" clearable>
                                <Option v-for="item in trspMode" :key="item.dictionaryKey" :value="`${item.dictionaryKey}~${item.dictionaryValue}`">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="运输类型" prop="trspType">
                            <Select v-model="parameterData.trspType" clearable>
                                <Option v-for="item in trspType" :key="item.dictionaryKey" :value="`${item.dictionaryKey}~${item.dictionaryValue}`">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="物流类型" prop="logisticsType">
                            <Select v-model="parameterData.logisticsType" clearable>
                                <Option v-for="item in logisticsType" :key="item.dictionaryKey" :value="`${item.dictionaryKey}~${item.dictionaryValue}`">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="货物类型" prop="cargoType">
                            <Select v-model="parameterData.cargoType" clearable>
                                <Option v-for="item in cargoType" :key="item.dictionaryKey" :value="`${item.dictionaryKey}~${item.dictionaryValue}`">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            :class="this.parameterData.trspType && this.parameterData.trspType.split('~')[0] === 'C' ? 'ivu-form-item-required' : ''"
                            label="集装箱尺寸类型"
                            prop="contaSizeType"
                        >
                            <Select v-model="parameterData.contaSizeType" clearable>
                                <Option v-for="item in contaSizeType" :key="item.dictionaryKey" :value="`${item.dictionaryKey}~${item.dictionaryValue}`">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            :class="this.parameterData.trspType && this.parameterData.trspType.split('~')[0] === 'C' ? 'ivu-form-item-required' : ''"
                            label="集装箱来源"
                            prop="contaSource"
                        >
                            <Select v-model="parameterData.contaSource" clearable>
                                <Option v-for="item in contaSource" :key="item.dictionaryKey" :value="`${item.dictionaryKey}~${item.dictionaryValue}`">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <div class="btns">
                        <Button @click="handleReset()">重置参数</Button>
                        <Button type="primary" @click="saveParameter()">保存参数</Button>
                    </div>
                </div>
            </div>
            <div class="public-component-line bot-10" />
            <!-- 一期不做删除、以后要做的时候，记得把./style.scss 165行的代码改一下 -->
            <!-- <adt-button :allDelShow="true" :delUrl="delUrl" :selectList="selectList" v-if="productAllInfo.length"></adt-button> -->
            <div class="product-list public-modify-record">
                <div class="collapse">
                    <Collapse v-model="curCollapse" accordion>
                        <template v-for="(product, index) in productAllInfo">
                            <!-- 一期不做删除、以后要做的时候，记得把./style.scss 165行的代码改一下 -->
                            <Checkbox class="checkbox" v-model="product.checked" @on-change="chooseProduct(product.id, product.checked)" :disabled="index === 0 && hasPendingProduct"></Checkbox>
                            <Panel :name="index + ''" @click="curCollapse = index">
                                <Row>
                                    <!-- <Col span="5" class="product-number" v-if="product.serverCode">
                                        产品编号：{{ product.serverCode }}
                                    </Col>
                                    <Col span="9" class="line">
                                        {{ product.sites.dispatchCity }}{{ product.sites.dispatchSite }}
                                        <svg class="iconfont arrow" aria-hidden="true">
                                            <use xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                                        </svg>
                                        {{ product.sites.destinationCity }} {{ product.sites.destinationSite }}
                                    </Col>
                                    <Col :span="product.serverCode ? 6 : 10" class="parameter">
                                        产品参数：{{ product.parameters }}
                                    </Col>
                                    <Col span="3" class="btns" v-if="index === 0 && hasPendingProduct">
                                        <Button size="small" @click.stop="saveProduct(product)">保存产品</Button>
                                    </Col> -->
                                    <Col v-if="product.serverCode" class="product-number" span="6">
                                        产品编号：{{ product.serverCode }}
                                    </Col>
                                    <Col class="parameter" span="10">
                                        产品参数：{{ product.parameters }}
                                    </Col>
                                    <Col v-if="index === 0 && hasPendingProduct" class="btns" span="7">
                                        <Button size="small" style="margin-right:10px;" @click.stop="setWaitTime(index)">设置等待时长</Button>
                                        <Button size="small" style="margin-right:10px;" @click.stop="setSchedule(product)">设置班期</Button>
                                        <Button size="small" @click.stop="saveProduct(product)">保存产品</Button>
                                    </Col>
                                </Row>
                                <div slot="content">
                                    <div class="product-content">
                                        <div :class="['scene-btns', { spread: isSceneSpread }]">
                                            <adt-tab-btns
                                                class="scene-tab"
                                                :titleNames="product.sceneNames"
                                                :isSmallBtn="true"
                                                :btnIndex="product.sceneTabIndex || -1"
                                                :productIndex="index"
                                                @handleBtn="handleSceneBtn"
                                            />
                                            <div class="right-item">
                                                <Button size="small" :disabled="!(index === 0 && hasPendingProduct)" @click="chooseScene(index)">
                                                    选择场景
                                                </Button>
                                                <div class="show-all-scene" @click="isSceneSpread = !isSceneSpread">
                                                    {{ `${!isSceneSpread ? '展开' : '收起'}所有 >` }}
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 循环场景，默认选中第一个场景 -->
                                        <!-- <div v-for="(item, idx) in product.sceneNames" :key="idx" v-show="item === curSceneName || (!product.sceneTabIndex && idx === 0)"> -->
                                            <!-- 循环场景，默认不选中场景 -->
                                        <div v-show="item === curSceneName" v-for="(item, idx) in product.sceneNames" :key="idx">
                                            <!-- 等待时长 -->
                                            <Row class="item-container" style="margin-bottom:10px;">
                                                等待时长：
                                                <Input
                                                    v-model.number.trim="product.scenesList[idx].waitTime"
                                                    :disabled="!(index === 0 && hasPendingProduct)"
                                                />
                                                <Select
                                                    v-model.number.trim="product.scenesList[idx].waitTimeUnit"
                                                    :disabled="!(index === 0 && hasPendingProduct)"
                                                    clearable
                                                    style="width: 80px;margin-left: 10px;"
                                                >
                                                    <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                        {{ item.dictionaryValue }}
                                                    </Option>
                                                </Select>
                                            </Row>
                                            <adt-tab-btns
                                                class="task-tab"
                                                :titleNames="titleNames"
                                                :isUnderline="true"
                                                :btnIndex="tabIndex"
                                                :width="250"
                                                :height="40"
                                                @handleBtn="handleBtn"
                                            />
                                            <div v-show="isBasicTask" class="basic-item">
                                                <Row class="item-container">
                                                    <Col class="item" span="10">
                                                        基础服务总费用：
                                                        <Input
                                                            v-model.number.trim="product.scenesList[idx].taskBasesList.taskCost"
                                                            :disabled="!(index === 0 && hasPendingProduct)"
                                                        />
                                                        <Select
                                                            v-model="product.scenesList[idx].taskBasesList.curr"
                                                            :disabled="!(index === 0 && hasPendingProduct)"
                                                            clearable
                                                            style="width: 80px;"
                                                        >
                                                            <Option v-for="item in currencyCode" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                                {{ item.dictionaryValue }}
                                                            </Option>
                                                        </Select>
                                                        /
                                                        <Select
                                                                v-model="product.scenesList[idx].taskBasesList.standarUnit"
                                                                :disabled="!(index === 0 && hasPendingProduct)"
                                                                clearable
                                                                style="width: 80px; margin-left: 12px;"
                                                            >
                                                                <Option v-for="item in goodsUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                                    {{ item.dictionaryValue }}
                                                                </Option>
                                                            </Select>
                                                    </Col>
                                                    <Col class="item" span="14">
                                                        基础服务总时长：
                                                        <Input
                                                            v-model.number.trim="product.scenesList[idx].taskBasesList.serverDuration" :disabled="!(index === 0 && hasPendingProduct)"
                                                        />
                                                        <Select
                                                            v-model="product.scenesList[idx].taskBasesList.serverDurationUnit"
                                                            :disabled="!(index === 0 && hasPendingProduct)"
                                                            clearable
                                                            style="width: 80px;"
                                                        >
                                                            <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                                {{ item.dictionaryValue }}
                                                            </Option>
                                                        </Select>
                                                    </Col>
                                                </Row>
                                                <adt-task-content
                                                    :basicTask="product.scenesList[idx].taskBasesList.lists"
                                                    :isAdditionalTasks="false"
                                                    :showPriceAndTime="false"
                                                />
                                            </div>
                                            <div v-show="!isBasicTask" class="additional-item">
                                                <h6>选择附加任务:</h6>
                                                <div class="task-container">
                                                    <!-- 一行放2个放不下，不能按照设计图来 -->
                                                    <div v-for="(additionalTask, key) in product.scenesList[idx].taskAffixesList" :key="key" class="task-item">
                                                        <Checkbox
                                                            v-model="additionalTask.isChecked"
                                                            :disabled="!(index === 0 && hasPendingProduct)"
                                                        />
                                                        <div class="task-name">{{ additionalTask.taskName }}</div>
                                                        <div class="cost">
                                                            费用：
                                                            <Input
                                                                v-model.number.trim="additionalTask.taskCost"
                                                                :disabled="!(index === 0 && hasPendingProduct)"
                                                            />
                                                            <Select
                                                                v-model="additionalTask.curr"
                                                                :disabled="!(index === 0 && hasPendingProduct)"
                                                                clearable
                                                                style="width: 80px; margin-left: 12px;"
                                                            >
                                                                <Option v-for="item in currencyCode" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                                    {{ item.dictionaryValue }}
                                                                </Option>
                                                            </Select>
                                                            /
                                                            <Select
                                                                v-model="additionalTask.currUnit"
                                                                :disabled="!(index === 0 && hasPendingProduct)"
                                                                clearable
                                                                style="width: 80px; margin-left: 12px;"
                                                            >
                                                                <Option v-for="item in goodsUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                                    {{ item.dictionaryValue }}
                                                                </Option>
                                                            </Select>
                                                        </div>
                                                        <div class="time">
                                                            时长：
                                                            <Input
                                                                v-model.number.trim="additionalTask.serverDuration"
                                                                :disabled="!(index === 0 && hasPendingProduct)"
                                                            />
                                                            <Select
                                                                v-model="additionalTask.serverDurationUnit"
                                                                :disabled="!(index === 0 && hasPendingProduct)"
                                                                clearable
                                                                style="width: 80px; margin-left: 12px;"
                                                            >
                                                                <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                                    {{ item.dictionaryValue }}
                                                                </Option>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="public-component-line thin-line"></div>
                                        <Row class="set-dead-line">
                                            <Col span="10">
                                                产品起止日期：
                                                <DatePicker v-model="product.serverStartTime" type="date" :disabled="!(index === 0 && hasPendingProduct)" />
                                                --
                                                <DatePicker v-model="product.serverEndTime" type="date" :disabled="!(index === 0 && hasPendingProduct)" />
                                            </Col>
                                            <Col span="14">
                                                产品报价截止时间前
                                                <Input v-model.number="product.serverRemindDuration" :disabled="!(index === 0 && hasPendingProduct)" />
                                                天开始提醒
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Panel>
                        </template>
                    </Collapse>
                </div>
            </div>
        </div>
        <!-- 外层设置等待时长弹窗 -->
        <adt-my-modal
            title="系统提示"
            width="430px"
            :showModal="isShowWaitTimeModal"
            @on-visible-change="waitModalChange"
            @on-ok="setProWaitTime"
        >

            <Form
                v-if="productAllInfo.length"
                :model="productAllInfo[nowProductIndex]"
                :rules="ruleWaitTime"
                ref="waitTimeForm"
            >
                <Row>
                    <Col span="6">
                        <p style="line-height:32px;">等待时长:</p>
                    </Col>
                    <Col span="10">
                        <FormItem prop="waitTime" class="transportTimeItem1">
                            <Input v-model.number.trim="productAllInfo[nowProductIndex].waitTime" placeholder="请输入"></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem prop="waitTimeUnit" class="transportTimeItem2">
                            <Select
                                v-model="productAllInfo[nowProductIndex].waitTimeUnit"
                                clearable
                            >
                                <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <!-- 等待时长:<Input
                    v-model.number.trim="productAllInfo[nowProductIndex].waitTime"
                />
                <Select
                    v-model="productAllInfo[nowProductIndex].waitTimeUnit"
                    clearable
                    style="width: 80px; margin-left: 12px;"
                >
                    <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                        {{ item.dictionaryValue }}
                    </Option>
                </Select> -->
            </Form>
        </adt-my-modal>
        <!-- 查看全部场景modal -->
        <adt-my-modal
            title="选择场景"
            width="60%"
            :showModal="isSceneModalShow"
            @on-visible-change="sceneVisibleChange"
            @on-ok="confirmChooseScene()"
        >
            <div class="choose-scene-container">
                <div class="scene-container">
                    <div class="search-container">
                        <div class="search">
                            场景名称：
                            <Input v-model="sceneName" />
                            <Icon class="search-btn" type="ios-search" @click="searchScene" />
                        </div>
                        <Button type="primary" @click="previewSort()">排序预览</Button>
                    </div>
                    <Table
                        max-height="500"
                        :columns="sceneColumns"
                        :data="sceneTableData"
                        stripe
                        @on-selection-change="selectionChange"
                    >
                        <template #sort="{ row, index }">
                            <div style="position: relative;">
                                <span class="required-tag">*</span>
                                <Input v-model.trim="row.sort" clearable @on-change="changeRowData(row, index, 'sort')" />
                            </div>
                        </template>
                    </Table>
                </div>
                <div class="sort-container">
                    <div class="title">场景排序</div>
                    <Table :columns="previewColumns" :data="previewTableData" max-height="500" stripe />
                </div>
            </div>
            <!-- <Form
                ref="sceneFormValidate"
                inline
                :label-colon="true"
                label-position="left">
                <FormItem>
                    <CheckboxGroup v-model="chosenScene" class="scene-checkbox">
                        <Checkbox v-for="(item, index) in 10" :key="index" :label="`${item}~场景`">{{ `场景${index}` }}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form> -->
        </adt-my-modal>
        <!-- 设置班期弹窗 -->
        <Drawer
            :mask-closable="false"
            v-model="showSetScheduleModal"
            width="1100"
            :closable="false"
        >
            <h3>设置班期</h3>
            <div class="operation-schedule">
                <Button size="small" style="margin-right:20px;" @click.stop="addSchedule">添加班期</Button>
                <Button size="small"  @click.stop="deleteSchedule">删除</Button>
            </div>
            <Collapse v-if="productAllInfo.length" v-model="setScheduleIndex" class="setScheduleCollapse">
                <Panel v-for="(item,index) in productAllInfo[nowProductIndex].scheduleList" :name="index+''" :key="index">
                    序号: {{item.scheduleCode}}
                    <Checkbox v-model="item.isChecked" class="checkboxs"></Checkbox>
                    <div slot="content">
                        <div class="add-schedule-title">
                            <span>服务时间周期</span>
                            <span></span>
                        </div>
                        <Form
                            class="add-schedule-form"
                            :model="productAllInfo[nowProductIndex].scheduleList[index]"
                            :rules="ruleAddSchedule"
                            label-position="top"
                            label-colon
                            :ref="`listForm${index}`"
                        >
                            <Row :gutter="20">
                                <Col span="12">
                                    <FormItem label="停靠时间" prop="stopTheTime">
                                        <DatePicker v-model="productAllInfo[nowProductIndex].scheduleList[index].stopTheTime" type="date"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="接货时间" prop="pickGoodsTime">
                                        <DatePicker v-model="productAllInfo[nowProductIndex].scheduleList[index].pickGoodsTime" type="date"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="20" class="endRow">
                                <Col span="12">
                                    <FormItem label="驶离时间" prop="departureDatetime">
                                        <DatePicker v-model="productAllInfo[nowProductIndex].scheduleList[index].departureDatetime" type="date"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="运抵时间" prop="shipDatetime">
                                        <DatePicker v-model="productAllInfo[nowProductIndex].scheduleList[index].shipDatetime" type="date"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="20" type="flex" justify="space-between">
                                <Col span="7">
                                    <FormItem prop="trspToolName" label="运输工具号">
                                        <Input v-model="productAllInfo[nowProductIndex].scheduleList[index].trspToolName" placeholder="请输入"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="7">
                                    <FormItem prop="meansNum" label="航次">
                                        <Input v-model="productAllInfo[nowProductIndex].scheduleList[index].meansNum" placeholder="请输入"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="7" class="transportTime">
                                    <FormItem prop="transportTime" label="运输时效" class="transportTimeItem1">
                                        <Input v-model.number.trim="productAllInfo[nowProductIndex].scheduleList[index].transportTime" placeholder="请输入"></Input>
                                    </FormItem>
                                    <FormItem prop="transportTimeUnit" class="transportTimeItem2">
                                        <Select
                                            v-model="productAllInfo[nowProductIndex].scheduleList[index].transportTimeUnit"
                                            clearable
                                        >
                                            <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                            <div class="add-schedule-title" style="margin:10px 0 30px;">
                                <span>截止时间</span>
                                <span></span>
                            </div>
                            <div class="add-schedule-deadline">
                                <Row :gutter="20" style="margin-bottom:30px;">
                                <Col span="12">
                                        <div class="deadline-title">截关时间:</div>
                                        <div class="deadline-item">
                                            <p>离港前</p>
                                            <FormItem prop="letDeclareDatetime">
                                                <Input v-model.number.trim="productAllInfo[nowProductIndex].scheduleList[index].letDeclareDatetime"/>
                                            </FormItem>
                                            <FormItem prop="letDeclareDatetimeUnit">
                                                <Select
                                                    v-model="productAllInfo[nowProductIndex].scheduleList[index].letDeclareDatetimeUnit"
                                                    clearable
                                                    style="width: 80px;margin-left: 10px;"
                                                >
                                                    <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                        {{ item.dictionaryValue }}
                                                    </Option>
                                                </Select>
                                            </FormItem>
                                        </div>
                                    </Col>
                                    <Col span="12">
                                        <div class="deadline-title">截港时间:</div>
                                        <div class="deadline-item">
                                            <p>离港前</p>
                                            <FormItem prop="letApproachDatetime">
                                                <Input v-model.number.trim="productAllInfo[nowProductIndex].scheduleList[index].letApproachDatetime"/>
                                            </FormItem>
                                            <FormItem prop="letApproachDatetimeUnit">
                                                <Select
                                                    v-model.number.trim="productAllInfo[nowProductIndex].scheduleList[index].letApproachDatetimeUnit"
                                                    clearable
                                                    style="width: 80px;margin-left: 10px;"
                                                >
                                                    <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                        {{ item.dictionaryValue }}
                                                    </Option>
                                                </Select>
                                            </FormItem>
                                        </div>
                                    </Col>
                                </Row>
                                <Row :gutter="20" style="margin-bottom:30px;">
                                    <Col span="12">
                                        <div class="deadline-title">截单时间:</div>
                                        <div class="deadline-item">
                                            <p>离港前</p>
                                            <FormItem prop="letBillDatetime">
                                                <Input v-model.number.trim="productAllInfo[nowProductIndex].scheduleList[index].letBillDatetime"/>
                                            </FormItem>
                                            <FormItem prop="letBillDatetimeUnit">
                                                <Select
                                                    v-model.number.trim="productAllInfo[nowProductIndex].scheduleList[index].letBillDatetimeUnit"
                                                    clearable
                                                    style="width: 80px;margin-left: 10px;"
                                                >
                                                    <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                        {{ item.dictionaryValue }}
                                                    </Option>
                                                </Select>
                                            </FormItem>
                                        </div>
                                    </Col>
                                    <Col span="12">
                                        <div class="deadline-title">截VGM时间:</div>
                                        <div class="deadline-item">
                                            <p>离港前</p>
                                            <FormItem prop="letPassDatetime">
                                                <Input v-model.number.trim="productAllInfo[nowProductIndex].scheduleList[index].letPassDatetime"/>
                                            </FormItem>
                                            <FormItem prop="letPassDatetimeUnit">
                                                <Select
                                                    v-model.number.trim="productAllInfo[nowProductIndex].scheduleList[index].letPassDatetimeUnit"
                                                    clearable
                                                    style="width: 80px;margin-left: 10px;"
                                                >
                                                    <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                        {{ item.dictionaryValue }}
                                                    </Option>
                                                </Select>
                                            </FormItem>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </div>
                </Panel>
            </Collapse>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="submitForm">确定</Button>
                <Button shape="circle" size="large" @click="cancel">取消</Button>
            </div>
        </Drawer>
        <!-- 添加班期弹窗 -->
        <Drawer
            :mask-closable="false"
            v-model="showAddScheduleModal"
            width="1100"
            :closable="false"
            style="width: 100px"
        >
            <h3>添加班期</h3>
            <div class="add-schedule-title">
                <span>服务时间周期</span>
                <span></span>
            </div>
            <Form
                class="add-schedule-form"
                :model="addScheduleObj"
                :rules="ruleAddSchedule"
                label-position="top"
                ref="addScheduleData"
                label-colon
            >
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="停靠时间" prop="stopTheTime">
                            <DatePicker v-model="addScheduleObj.stopTheTime" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="接货时间" prop="pickGoodsTime">
                            <DatePicker v-model="addScheduleObj.pickGoodsTime" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20" class="endRow">
                    <Col span="12">
                        <FormItem label="驶离时间" prop="departureDatetime">
                            <DatePicker v-model="addScheduleObj.departureDatetime" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="运抵时间" prop="shipDatetime">
                            <DatePicker v-model="addScheduleObj.shipDatetime" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20" type="flex" justify="space-between">
                    <Col span="7">
                        <FormItem prop="trspToolName" label="运输工具号">
                            <Input v-model="addScheduleObj.trspToolName" placeholder="请输入"></Input>
                        </FormItem>
                    </Col>
                    <Col span="7">
                        <FormItem prop="meansNum" label="航次">
                            <Input v-model="addScheduleObj.meansNum" placeholder="请输入"></Input>
                        </FormItem>
                    </Col>
                    <Col span="7" class="transportTime">
                        <FormItem prop="transportTime" label="运输时效" class="transportTimeItem1">
                            <Input v-model.number.trim="addScheduleObj.transportTime" placeholder="请输入"></Input>
                        </FormItem>
                        <FormItem prop="transportTimeUnit" class="transportTimeItem2">
                            <Select
                                v-model="addScheduleObj.transportTimeUnit"
                                clearable
                            >
                                <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <div class="add-schedule-title" style="margin:20px 0 30px;">
                    <span>截止时间</span>
                    <span></span>
                </div>
                <div class="add-schedule-deadline">
                    <Row :gutter="20" style="margin-bottom:30px;">
                    <Col span="12">
                            <div class="deadline-title">截关时间:</div>
                            <div class="deadline-item">
                                <p>离港前</p>
                                <FormItem prop="letDeclareDatetime">
                                    <Input v-model.number.trim="addScheduleObj.letDeclareDatetime"/>
                                </FormItem>
                                <FormItem prop="letDeclareDatetimeUnit">
                                    <Select
                                        v-model="addScheduleObj.letDeclareDatetimeUnit"
                                        clearable
                                        style="width: 80px;margin-left: 10px;"
                                    >
                                        <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                            {{ item.dictionaryValue }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </div>
                        </Col>
                        <Col span="12">
                            <div class="deadline-title">截港时间:</div>
                            <div class="deadline-item">
                                <p>离港前</p>
                                <FormItem prop="letApproachDatetime">
                                    <Input v-model.number.trim="addScheduleObj.letApproachDatetime"/>
                                </FormItem>
                                <FormItem prop="letApproachDatetimeUnit">
                                    <Select
                                        v-model.number.trim="addScheduleObj.letApproachDatetimeUnit"
                                        clearable
                                        style="width: 80px;margin-left: 10px;"
                                    >
                                        <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                            {{ item.dictionaryValue }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </div>
                        </Col>
                    </Row>
                    <Row :gutter="20" style="margin-bottom:30px;">
                        <Col span="12">
                            <div class="deadline-title">截单时间:</div>
                            <div class="deadline-item">
                                <p>离港前</p>
                                <FormItem prop="letBillDatetime">
                                    <Input v-model.number.trim="addScheduleObj.letBillDatetime"/>
                                </FormItem>
                                <FormItem prop="letBillDatetimeUnit">
                                    <Select
                                        v-model.number.trim="addScheduleObj.letBillDatetimeUnit"
                                        clearable
                                        style="width: 80px;margin-left: 10px;"
                                    >
                                        <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                            {{ item.dictionaryValue }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </div>
                        </Col>
                        <Col span="12">
                            <div class="deadline-title">截VGM时间:</div>
                            <div class="deadline-item">
                                <p>离港前</p>
                                <FormItem prop="letPassDatetime">
                                    <Input v-model.number.trim="addScheduleObj.letPassDatetime"/>
                                </FormItem>
                                <FormItem prop="letPassDatetimeUnit">
                                    <Select
                                        v-model.number.trim="addScheduleObj.letPassDatetimeUnit"
                                        clearable
                                        style="width: 80px;margin-left: 10px;"
                                    >
                                        <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                            {{ item.dictionaryValue }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Form>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="submitAddSchedule('addScheduleData')">确定</Button>
                <Button shape="circle" size="large" @click="cancelAddSchedule">取消</Button>
            </div>
        </Drawer>

    </div>
</template>

<script>
    import addProductContent from '@/mixins/addProductContent'
    import AdtTaskContent from '@/components/adt-task-content/Index'
    import validateRules from '@/libs/validateRules'
    import {
        apiTransportAddCode,
        apiTransportAddServer,
        apiAddScheduleCode
    } from '@/api/productEditor'
    import {toTimestamp,dateToString} from '@/libs/utils';
    export default {
        mixins: [addProductContent],
        components: {
            AdtTaskContent
        },
        data () {
            return {
                productType: 'T',
                serviceType: this.$getDictionary('SERVICE_TYPE'),
                trspMode: this.$getDictionary('TRANSPORT_MODE'),
                trspType: this.$getDictionary('TRANSPORT_TYPE'),
                logisticsType: this.$getDictionary('LOGISTICS_TYPE'),
                cargoType: this.$getDictionary('GOODS_TYPE'),
                contaSizeType: this.$getDictionary('CONTAINER_SIZE_TYPE'),
                contaSource: this.$getDictionary('CONTAINER_SOURCE'),
                currencyCode: this.$getDictionary('CURRENCY_CODE'),
                timeUnit: this.$getDictionary('TIME_UNIT'),
                goodsUnit: this.$getDictionary('GOODS_UNIT'),
                siteData: {
                    dispatchCity: '',
                    dispatchSite: '',
                    destinationCity: '',
                    destinationSite: '',
                    mileage: ''
                },
                ruleValidate: {
                    dispatchCity: [
                        validateRules.select('启运地')[0]
                    ],
                    destinationCity: [
                        validateRules.select('目的地')[0]
                    ],
                    mileage: [
                        validateRules.required('时间')[0]
                    ]
                },
                parameterData: {
                    trspMode: '',
                    trspType: '',
                    logisticsType: '',
                    cargoType: '',
                    contaSizeType: '',
                    contaSource: ''
                },
                parameterRuleValidate: {
                    trspMode: [
                        validateRules.select('运输方式')[0]
                    ],
                    trspType: [
                        validateRules.select('运输类型')[0]
                    ],
                    logisticsType: [
                        validateRules.select('物流类型')[0]
                    ],
                    cargoType: [
                        validateRules.select('货物类型')[0]
                    ]
                },
                dispatchOptions: [],
                destinationOptions: [],
                delUrl: function () {},
                showSetScheduleModal: false,
                 //添加班期的相关数据
                showAddScheduleModal: false,
                addScheduleObj: {
                    isChecked: false,//默认未选中
                    scheduleCode: '',//序号
                    stopTheTime: '',//停靠时间
                    pickGoodsTime: '',//接货时间
                    departureDatetime: '',//驶离时间
                    shipDatetime: '',//运抵时间
                    trspToolName: '',//运输工具号 未寻
                    meansNum: '',//航次
                    transportTime: '',//运输时效
                    transportTimeUnit: '',
                    letDeclareDatetime: '',//截关时间
                    letDeclareDatetimeUnit: '',
                    letApproachDatetime: '',//截港时间
                    letApproachDatetimeUnit: '',
                    letBillDatetime: '',//截单时间
                    letBillDatetimeUnit: '',
                    letPassDatetimeUnit: '',
                    letPassDatetime: ''//截VGM时间
                },
                ruleAddSchedule: {
                    stopTheTime: [
                        validateRules.validateTime
                    ],
                    pickGoodsTime: [
                        validateRules.validateTime
                    ],
                    departureDatetime: [
                        validateRules.validateTime
                    ],
                    shipDatetime: [
                        validateRules.validateTime
                    ],
                    trspToolName: [
                        validateRules.requiredEnglishNumber()[0]
                    ],
                    meansNum: [
                        validateRules.requiredEnglishNumber()[0]
                    ],
                    transportTime: [
                        validateRules.requiredNumber('数字')[0]
                    ],
                    transportTimeUnit: [
                        validateRules.select('时间单位')[0]
                    ],
                    letDeclareDatetime: [
                        validateRules.requiredNumber('数字')[0]
                    ],
                    letApproachDatetime: [
                        validateRules.requiredNumber('数字')[0]
                    ],
                    letBillDatetime: [
                        validateRules.requiredNumber('数字')[0]
                    ],
                    letPassDatetime: [
                        validateRules.requiredNumber('数字')[0]
                    ],
                    letDeclareDatetimeUnit: [
                        validateRules.select('时间单位')[0]
                    ],
                    letApproachDatetimeUnit: [
                        validateRules.select('时间单位')[0]
                    ],
                    letBillDatetimeUnit: [
                        validateRules.select('时间单位')[0]
                    ],
                    letPassDatetimeUnit: [
                        validateRules.select('时间单位')[0]
                    ]
                },
                setScheduleIndex: '-1',
                isShowWaitTimeModal: false,
                nowProductIndex: 0,
                ruleWaitTime: {
                    waitTime: [
                        validateRules.requiredNumber('数字')[0]
                    ],
                    waitTimeUnit: [
                        validateRules.select('时间单位')[0]
                    ]
                }
            }
        },
        methods: {
            // 保存产品
            saveProduct (productData) {
                let product = JSON.parse(JSON.stringify(productData))
                // 至少选择一个场景
                if (!product.sceneNames.length) {
                    this.$Message.warning('请先选择场景！')
                    return
                }
                product.serverStartTime = +new Date(product.serverStartTime) || ''
                product.serverEndTime = +new Date(product.serverEndTime) || ''
                // 产品起止日期必填
                if (!product.serverStartTime || !product.serverEndTime) {
                    this.$Message.warning('请输入产品起止日期！')
                    return
                }
                // 起始时间不能大于截止时间
                if (product.serverStartTime > product.serverEndTime) {
                    this.$Message.warning('起始时间不能大于截止时间！')
                    return
                }
                // 产品报价截止时间
                if (!product.serverRemindDuration) {
                    this.$Message.warning('请输入产品报价截止时间')
                    return
                }
                for (let scene of product.scenesList) {
                    // 基础任务必填校验
                    // 不填写为undefined，填写了再删除就为''
                    // 可以填0
                    if (scene.taskBasesList.taskCost === undefined || scene.taskBasesList.taskCost === '') {
                        this.$Message.warning(`请输入${scene.sceneName}下的基础服务总费用！`)
                        return
                    }
                    if (!scene.taskBasesList.curr) {
                        this.$Message.warning(`请输入${scene.sceneName}下的基础服务总费用单位！`)
                        return
                    }
                    if (scene.taskBasesList.serverDuration === undefined || scene.taskBasesList.serverDuration === '') {
                        this.$Message.warning(`请输入${scene.sceneName}下的基础服务总时长！`)
                        return
                    }
                    if (!scene.taskBasesList.serverDurationUnit) {
                        this.$Message.warning(`请输入${scene.sceneName}下的基础服务总时长单位！`)
                        return
                    }
                    // 基础任务数据结构组装
                    for (const list of scene.taskBasesList.lists) {
                        list.taskCost = scene.taskBasesList.taskCost
                        list.curr = scene.taskBasesList.curr
                        list.serverDuration = scene.taskBasesList.serverDuration
                        list.serverDurationUnit = scene.taskBasesList.serverDurationUnit
                        list.standarUnit = scene.taskBasesList.standarUnit
                    }
                    scene.taskBasesList = scene.taskBasesList.lists
                    // 附加任务
                    for (let key = 0; key < scene.taskAffixesList.length; key++) {
                        // 选中的附加任务
                        if (scene.taskAffixesList[key].isChecked) {
                            if (!scene.taskAffixesList[key].taskCost === undefined || scene.taskAffixesList[key].taskCost === '') {
                                this.$Message.warning(`请输入${scene.sceneName}选中的附加任务的费用！`)
                                return
                            }
                            if (!scene.taskAffixesList[key].curr) {
                                this.$Message.warning(`请输入${scene.sceneName}选中的附加任务的费用单位！`)
                                return
                            }
                            if (scene.taskAffixesList[key].serverDuration === undefined || scene.taskAffixesList[key].serverDuration === '') {
                                this.$Message.warning(`请输入${scene.sceneName}选中的附加任务的时长！`)
                                return
                            }
                            if (!scene.taskAffixesList[key].serverDurationUnit) {
                                this.$Message.warning(`请输入${scene.sceneName}选中的附加任务的时长单位！`)
                                return
                            }
                            delete scene.taskAffixesList[key].isChecked
                        } else {
                            scene.taskAffixesList.splice(key, 1)
                            key--
                        }
                    }
                }
                // 将数据结构处理成后端一摸一样的结构
                if(product.hasOwnProperty('parameters')){delete product.parameters}
                if(product.hasOwnProperty('sceneNames')){delete product.sceneNames}
                if(product.hasOwnProperty('sceneTabIndex')){delete product.sceneTabIndex}
                if(product.hasOwnProperty('sites')){delete product.sites}
                if(product.scheduleList && product.scheduleList.length){
                    for(var item of product.scheduleList) {
                        this.$set(item,'serverCode',product.serverCode)
                        // item.departureDatetime = toTimestamp(item.departureDatetime)
                        // item.pickGoodsTime = toTimestamp(item.pickGoodsTime)
                        // item.shipDatetime = toTimestamp(item.shipDatetime)
                        // item.stopTheTime = toTimestamp(item.stopTheTime)
                    }
                }
                product.mileage = product.mileage*1
                // 保存成功
                apiTransportAddServer({ data: product }).then(res => {
                    this.$Message.success(res.message)
                    this.hasPendingProduct = false
                })
            },
            // 选择启运地城市
            async changeDispatchCity (value) {
                // this.siteData.dispatchCity = `${value.data[value.data.length - 1].addressCode}~${value.data[value.data.length - 1].addressName}`
                this.siteData.dispatchCity = value.data.length ? `${value.value.join(';')}~${value.data[value.data.length - 1].addressName}` : ''
                this.dispatchOptions = await this._handelDir(value.value)
            },
            // 选择目的地城市
            async changeDestinationCity (value) {
                // this.siteData.destinationCity = `${value.data[value.data.length - 1].addressCode}~${value.data[value.data.length - 1].addressName}`
                this.siteData.destinationCity = value.data.length ? `${value.value.join(';')}~${value.data[value.data.length - 1].addressName}` : ''
                this.destinationOptions = await this._handelDir(value.value)
            },
            //设置班期
            setSchedule (product) {
                if(!product.scheduleList){
                    this.$set(product,'scheduleList',[])
                }
                this.showSetScheduleModal = true
            },
            // 设置班期确定与取消
            submitForm () {
                if (this.productAllInfo[this.nowProductIndex].scheduleList.length === 0) return;
                let allRight = true;
                let indexValue = -1;
                for(let i = 0;i < this.productAllInfo[this.nowProductIndex].scheduleList.length;i++) {
                    this.$refs[`listForm${i}`][0].validate((valid) => {
                        if (!valid) {
                            allRight = false;
                            indexValue = i;
                            return;
                        }
                    })
                }
                if (allRight) { //设置班期列表里面所有的form都校验成功
                    this.showSetScheduleModal = false
                } else {
                    this.setScheduleIndex = indexValue + ''
                }
            },
            cancel () {
                this.showSetScheduleModal = false
            },
            // 添加班期
            addSchedule () {
                this.showAddScheduleModal = true
                //模拟后端传过来一个编号
                apiAddScheduleCode().then(res => {
                    this.addScheduleObj.scheduleCode = res.data;
                })
            },
            //在设置班期页面删除选中的班期
            deleteSchedule () {
                function haveChecked(arr) {
                    for(let i = 0;i < arr.length;i++) {
                        if(arr[i].isChecked === true) {
                            return i
                        }
                    }
                    return -1
                }
                while(haveChecked(this.productAllInfo[this.nowProductIndex].scheduleList) !== -1){
                    let index = haveChecked(this.productAllInfo[this.nowProductIndex].scheduleList);
                    this.productAllInfo[this.nowProductIndex].scheduleList.splice(index,1);
                }
                this.setScheduleIndex = '-1'
            },
            //确定添加班期
            submitAddSchedule (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let arr = JSON.parse(JSON.stringify(this.addScheduleObj))
                        this.$set(arr,'stopTheTime',dateToString(arr.stopTheTime))
                        this.$set(arr,'pickGoodsTime',dateToString(arr.pickGoodsTime))
                        this.$set(arr,'departureDatetime',dateToString(arr.departureDatetime))
                        this.$set(arr,'shipDatetime',dateToString(arr.shipDatetime))
                        this.productAllInfo[this.nowProductIndex].scheduleList.push(arr)
                        this.$refs.addScheduleData.resetFields()
                        this.showAddScheduleModal = false
                    }
                })
            },
            //取消添加班期
            cancelAddSchedule () {
                this.$refs.addScheduleData.resetFields()
                this.showAddScheduleModal = false
            },
            //设置等待时长
            setWaitTime (index) {
                this.nowProductIndex = index
                if(!(this.productAllInfo[index].waitTime*1 >= 0)){
                    this.$set(this.productAllInfo[index], 'waitTime', '')
                    this.$set(this.productAllInfo[index], 'waitTimeUnit', '')
                }
                this.isShowWaitTimeModal = true
            },
            setProWaitTime () {
                this.$refs.waitTimeForm.validate((valid)=>{
                    if(valid){
                        this.isShowWaitTimeModal = false
                    }
                })
            },
            waitModalChange (val) {
                this.isShowWaitTimeModal = val
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './style.scss';
    .mileage {
        /deep/ .ivu-input {
            width: 100px;
            margin-right: 10px;
        }
    }
    .operation-schedule {
        display: flex;
        justify-content: flex-end;
        padding: 0 0 20px;
    }
    .add-schedule-deadline  {
        /deep/ .ivu-form-item {
            margin: 0;
        }
    }
    .add-schedule-title {
        height: 21px;
        position: relative;
        font-weight: 800;
        margin:0 0 26px;
        >span:nth-of-type(1) {
            position: absolute;
            top:0;
            left: 0;
            z-index: 1;
            background: #fff;
            &::before {
                content: '*';
                color: #FF0000;
            }
        }
        >span:nth-of-type(2) {
            display: inline-block;
            height: 1px;
            width: 100%;
            background: #D7D8DF;
            transform: translateY(-5px);
        }
    }
    .checkboxs {
        position: absolute;
        left: -30px;
        top: 0;
    }
    .endRow {
        border-bottom:1px solid #D7D8DF;
        padding: 0 0 20px;
        margin-bottom: 30px;
    }
    .deadline-title {
        font-weight: bold;
        color: #515A6E;
    }
    .add-schedule-form {
        /deep/ .ivu-form-item-label {
            font-weight: bold;
            color: #515A6E;
        }
        /deep/ .ivu-form-item-label::before {
            content: '';
        }
        .transportTime {
            position: relative;
            .transportTimeItem1 {
                width: 140px;
            }
            .transportTimeItem2 {
                position: absolute;
                top: 24px;
                right: 0;
                width: 80px;
            }
        }
    }
    .deadline-item {
        display:flex;
        justify-content: space-between;
        padding:10px 90px 0 0;
        align-items: center;
        >p {
            width: 50px;
            font-weight: 800;
            color: #515A6E;
        }
    }
    .setScheduleCollapse {
        border: none;
        /deep/ .ivu-collapse-header {
            background-color: #FFF6E5;
            border: none!important;
            .ivu-icon-ios-arrow-forward {
                position: absolute;
                right: 20px;
                top: 12px;
            }
        }
    }
</style>
