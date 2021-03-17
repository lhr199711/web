<template>
    <div>
        <!-- 方案基本信息 -->
        <p class="title">方案基本信息</p>
        <AdtSchemeInformationRoute :logistics="logistics">
            <template slot="price">
                <Row>
                    <Col span="12">价格区间：{{}}</Col>
                    <Col span="12">时长区间：{{}}</Col>
                </Row>
            </template>
            <template slot="service">
                <!-- 选择代理服务 -->
                <div class="service">
                    <p>
                        <span class="title">选择代理服务:</span>
                        <span>（没有可选代理服务请联系我们）</span>
                    </p>
                    <Row>
                        <CheckboxGroup v-model="agencyService">
                            <Col span="8" class="service-proxy">
                                <Checkbox label="代理服务1">
                                    <span>代理服务</span>
                                    <span>
                                        费用：<Input type="text" />
                                    </span>
                                    <span class="service-price">元</span>
                                </Checkbox>
                            </Col>
                            <Col span="8" class="service-proxy">
                                <Checkbox label="代理服务2">
                                    <span>代理服务</span>
                                    <span>
                                        费用：<Input type="text" />
                                    </span>
                                    <span>元</span>
                                </Checkbox>
                            </Col>
                            <Col span="8" class="service-proxy">
                                <Checkbox label="代理服务3">
                                    <span>代理服务</span>
                                    <span>
                                        费用：<Input type="text" />
                                    </span>
                                    <span>元</span>
                                </Checkbox>
                            </Col>
                        </CheckboxGroup>
                    </Row>
                </div>
                <!-- 汇率及方案 -->
                <Row class="program">
                    <Col span="16">
                        <span class="title">结算汇率:</span>
                        <RadioGroup class="program-settlement" v-model="exchangeRate">
                            <!-- <Row>
                                <Col span="8"> -->
                                    <Radio label="金斑蝶">非固有汇率</Radio>
                                <!-- </Col>
                                <Col span="16"> -->
                                    <Radio class="program-inherent" label="爪哇犀牛">
                                        <span>固有汇率</span>
                                        <Input type="text" />
                                    </Radio>
                                <!-- </Col>
                            </Row> -->
                        </RadioGroup>
                    </Col>
                    <Col span="8">
                        <span class="title">方案截止前几天提醒：</span>
                        <Select v-model="selectTime" style="width:185px">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
            </template>
        </AdtSchemeInformationRoute>
        <!-- 产品服务信息 -->
        <p class="title">产品服务信息</p>
        <Card>
            <adt-tab-btns :height="40" :width="200" :isUnderline="true" :titleNames="titleNames" :btnIndex="changeIndex" @handleBtn="handleBtn">
                <Divider />
            </adt-tab-btns>
            <Button class="step-save">保存</Button>
            <!-- 运输服务 -->
            <div class="collapse" v-if="changeIndex == 1">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <div class="collapse-head">
                            <span>重庆</span>
                            <svg class="icon" aria-hidden="true">
                                <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                            </svg>
                            <span>成都</span>
                            <span>展开</span>
                        </div>
                        <div slot="content">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col span="8" class="service-provider">
                                    <div class="service-provider-title">
                                        <span>选择服务商</span>
                                    </div>
                                    <div class="service-provider-company">
                                        <RadioGroup v-model="checkAllGroup">
                                            <Radio label="香蕉">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                            <Radio label="苹果">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                            <Radio label="西瓜">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}}</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                    </adt-tab-btns>
                                    <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                    <adt-tab-btns :isBaseBtn="true" :titleNames="titleNamesTask" :btnIndex="changeIndexTask" @handleBtn="handleBtnTask" :width="200" :height="30" style="justify-content: flex-start" />
                                    <!-- 任务 -->
                                    <div v-if="changeIndexTask == 1">
                                        <AdtTaskContent class="spacing" :basicTask="basicTask" :additionalTasks="additionalTasks" />
                                    </div>
                                    <!-- 监控设置 -->
                                    <div v-if="changeIndexTask == 2">
                                        <p class="spacing">监控:</p>
                                        <div class="monitor">
                                            <div class="monitor-abnormal">
                                                <Row>
                                                    <Col span="4">异常1</Col>
                                                    <Col span="6">异常通知方式：{{}}</Col>
                                                    <Col span="14">异常通知内容：{{}}</Col>
                                                </Row>
                                            </div>
                                            <div class="monitor-notice">
                                                <p>
                                                    <span>异常通知企业：</span>
                                                    <span class="monitor-notice-people">添加异常通知人</span>
                                                </p>
                                                <Row class="monitor-company">
                                                    <CheckboxGroup v-model="notifyCompany">
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务1">安道通1</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务2">安道通2</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务3">安道通3</Checkbox>
                                                        </Col>
                                                    </CheckboxGroup>
                                                </Row>
                                            </div>
                                        </div>
                                        <div class="monitor">
                                            <div class="monitor-abnormal">
                                                <Row>
                                                    <Col span="4">异常1</Col>
                                                    <Col span="6">异常通知方式：{{}}</Col>
                                                    <Col span="14">异常通知内容：{{}}</Col>
                                                </Row>
                                            </div>
                                            <div class="monitor-notice">
                                                <p>
                                                    <span>异常通知企业：</span>
                                                    <span class="monitor-notice-people">添加异常通知人</span>
                                                </p>
                                                <Row class="monitor-company">
                                                    <CheckboxGroup v-model="notifyCompany">
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务1">安道通1</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务2">安道通2</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务3">安道通3</Checkbox>
                                                        </Col>
                                                    </CheckboxGroup>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 协同协作设置 -->
                                    <div v-if="changeIndexTask == 3">
                                        <div>
                                            <p class="spacing">协同协作1:</p>
                                            <div class="cooperation">
                                                <div class="cooperation-notice">
                                                    <p>
                                                        <span>协同协作方：</span>
                                                        <span class="cooperation-notice-people">添加协同协作方</span>
                                                    </p>
                                                    <Row class="cooperation-company">
                                                        <CheckboxGroup v-model="notifyCompany">
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务1">安道通1</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务2">安道通2</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务3">安道通3</Checkbox>
                                                            </Col>
                                                        </CheckboxGroup>
                                                    </Row>
                                                </div>
                                                <Row class="cooperation-description">
                                                    <Col span="8">协同协作方式：{{1122}}</Col>
                                                    <Col span="16">协同协作内容：{{3344}}</Col>
                                                </Row>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="spacing">协同协作2:</p>
                                            <div class="cooperation">
                                                <div class="cooperation-notice">
                                                    <p>
                                                        <span>协同协作方：</span>
                                                        <span class="cooperation-notice-people">添加协同协作方</span>
                                                    </p>
                                                    <Row class="cooperation-company">
                                                        <CheckboxGroup v-model="notifyCompany">
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务1">安道通1</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务2">安道通2</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务3">安道通3</Checkbox>
                                                            </Col>
                                                        </CheckboxGroup>
                                                    </Row>
                                                </div>
                                                <Row class="cooperation-description">
                                                    <Col span="8">协同协作方式：{{1122}}</Col>
                                                    <Col span="16">协同协作内容：{{3344}}</Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <!-- 场所服务 -->
            <div class="collapse" v-if="changeIndex == 2">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <div class="collapse-head">
                            <span>重庆</span>
                            <span>展开</span>
                        </div>
                        <div slot="content">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col span="8" class="service-provider">
                                    <div class="service-provider-title">
                                        <span>选择服务商</span>
                                    </div>
                                    <div class="service-provider-company">
                                        <RadioGroup v-model="checkAllGroup">
                                            <Radio label="香蕉">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                            <Radio label="苹果">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                            <Radio label="西瓜">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}}</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                    </adt-tab-btns>
                                    <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                    <adt-tab-btns :isBaseBtn="true" :titleNames="titleNamesTask" :btnIndex="changeIndexTask" @handleBtn="handleBtnTask" :width="200" :height="30" style="justify-content: flex-start" />
                                    <!-- 任务 -->
                                    <div v-if="changeIndexTask == 1">
                                        <AdtTaskContent class="spacing" :basicTask="basicTask" :additionalTasks="additionalTasks" />
                                    </div>
                                    <!-- 监控设置 -->
                                    <div v-if="changeIndexTask == 2">
                                        <p class="spacing">监控:</p>
                                        <div class="monitor">
                                            <div class="monitor-abnormal">
                                                <Row>
                                                    <Col span="4">异常1</Col>
                                                    <Col span="6">异常通知方式：{{}}</Col>
                                                    <Col span="14">异常通知内容：{{}}</Col>
                                                </Row>
                                            </div>
                                            <div class="monitor-notice">
                                                <p>
                                                    <span>异常通知企业：</span>
                                                    <span class="monitor-notice-people">添加异常通知人</span>
                                                </p>
                                                <Row class="monitor-company">
                                                    <CheckboxGroup v-model="notifyCompany">
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务1">安道通1</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务2">安道通2</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务3">安道通3</Checkbox>
                                                        </Col>
                                                    </CheckboxGroup>
                                                </Row>
                                            </div>
                                        </div>
                                        <div class="monitor">
                                            <div class="monitor-abnormal">
                                                <Row>
                                                    <Col span="4">异常1</Col>
                                                    <Col span="6">异常通知方式：{{}}</Col>
                                                    <Col span="14">异常通知内容：{{}}</Col>
                                                </Row>
                                            </div>
                                            <div class="monitor-notice">
                                                <p>
                                                    <span>异常通知企业：</span>
                                                    <span class="monitor-notice-people">添加异常通知人</span>
                                                </p>
                                                <Row class="monitor-company">
                                                    <CheckboxGroup v-model="notifyCompany">
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务1">安道通1</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务2">安道通2</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务3">安道通3</Checkbox>
                                                        </Col>
                                                    </CheckboxGroup>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 协同协作设置 -->
                                    <div v-if="changeIndexTask == 3">
                                        <div>
                                            <p class="spacing">协同协作1:</p>
                                            <div class="cooperation">
                                                <div class="cooperation-notice">
                                                    <p>
                                                        <span>协同协作方：</span>
                                                        <span class="cooperation-notice-people">添加协同协作方</span>
                                                    </p>
                                                    <Row class="cooperation-company">
                                                        <CheckboxGroup v-model="notifyCompany">
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务1">安道通1</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务2">安道通2</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务3">安道通3</Checkbox>
                                                            </Col>
                                                        </CheckboxGroup>
                                                    </Row>
                                                </div>
                                                <Row class="cooperation-description">
                                                    <Col span="8">协同协作方式：{{1122}}</Col>
                                                    <Col span="16">协同协作内容：{{3344}}</Col>
                                                </Row>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="spacing">协同协作2:</p>
                                            <div class="cooperation">
                                                <div class="cooperation-notice">
                                                    <p>
                                                        <span>协同协作方：</span>
                                                        <span class="cooperation-notice-people">添加协同协作方</span>
                                                    </p>
                                                    <Row class="cooperation-company">
                                                        <CheckboxGroup v-model="notifyCompany">
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务1">安道通1</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务2">安道通2</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务3">安道通3</Checkbox>
                                                            </Col>
                                                        </CheckboxGroup>
                                                    </Row>
                                                </div>
                                                <Row class="cooperation-description">
                                                    <Col span="8">协同协作方式：{{1122}}</Col>
                                                    <Col span="16">协同协作内容：{{3344}}</Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <!-- 关务服务 -->
            <div class="collapse" v-if="changeIndex == 3">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <div class="collapse-head">
                            <span>重庆</span>
                            <span>展开</span>
                        </div>
                        <div slot="content">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col span="8" class="service-provider">
                                    <div class="service-provider-title">
                                        <span>选择服务商</span>
                                    </div>
                                    <div class="service-provider-company">
                                        <RadioGroup v-model="checkAllGroup">
                                            <Radio label="香蕉">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                            <Radio label="苹果">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                            <Radio label="西瓜">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}}</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                    </adt-tab-btns>
                                    <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                    <adt-tab-btns :isBaseBtn="true" :titleNames="titleNamesTask" :btnIndex="changeIndexTask" @handleBtn="handleBtnTask" :width="200" :height="30" style="justify-content: flex-start" />
                                    <!-- 任务 -->
                                    <div v-if="changeIndexTask == 1">
                                        <AdtTaskContent class="spacing" :basicTask="basicTask" :additionalTasks="additionalTasks" />
                                    </div>
                                    <!-- 监控设置 -->
                                    <div v-if="changeIndexTask == 2">
                                        <p class="spacing">监控:</p>
                                        <div class="monitor">
                                            <div class="monitor-abnormal">
                                                <Row>
                                                    <Col span="4">异常1</Col>
                                                    <Col span="6">异常通知方式：{{}}</Col>
                                                    <Col span="14">异常通知内容：{{}}</Col>
                                                </Row>
                                            </div>
                                            <div class="monitor-notice">
                                                <p>
                                                    <span>异常通知企业：</span>
                                                    <span class="monitor-notice-people">添加异常通知人</span>
                                                </p>
                                                <Row class="monitor-company">
                                                    <CheckboxGroup v-model="notifyCompany">
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务1">安道通1</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务2">安道通2</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务3">安道通3</Checkbox>
                                                        </Col>
                                                    </CheckboxGroup>
                                                </Row>
                                            </div>
                                        </div>
                                        <div class="monitor">
                                            <div class="monitor-abnormal">
                                                <Row>
                                                    <Col span="4">异常1</Col>
                                                    <Col span="6">异常通知方式：{{}}</Col>
                                                    <Col span="14">异常通知内容：{{}}</Col>
                                                </Row>
                                            </div>
                                            <div class="monitor-notice">
                                                <p>
                                                    <span>异常通知企业：</span>
                                                    <span class="monitor-notice-people">添加异常通知人</span>
                                                </p>
                                                <Row class="monitor-company">
                                                    <CheckboxGroup v-model="notifyCompany">
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务1">安道通1</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务2">安道通2</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务3">安道通3</Checkbox>
                                                        </Col>
                                                    </CheckboxGroup>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 协同协作设置 -->
                                    <div v-if="changeIndexTask == 3">
                                        <div>
                                            <p class="spacing">协同协作1:</p>
                                            <div class="cooperation">
                                                <div class="cooperation-notice">
                                                    <p>
                                                        <span>协同协作方：</span>
                                                        <span class="cooperation-notice-people">添加协同协作方</span>
                                                    </p>
                                                    <Row class="cooperation-company">
                                                        <CheckboxGroup v-model="notifyCompany">
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务1">安道通1</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务2">安道通2</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务3">安道通3</Checkbox>
                                                            </Col>
                                                        </CheckboxGroup>
                                                    </Row>
                                                </div>
                                                <Row class="cooperation-description">
                                                    <Col span="8">协同协作方式：{{1122}}</Col>
                                                    <Col span="16">协同协作内容：{{3344}}</Col>
                                                </Row>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="spacing">协同协作2:</p>
                                            <div class="cooperation">
                                                <div class="cooperation-notice">
                                                    <p>
                                                        <span>协同协作方：</span>
                                                        <span class="cooperation-notice-people">添加协同协作方</span>
                                                    </p>
                                                    <Row class="cooperation-company">
                                                        <CheckboxGroup v-model="notifyCompany">
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务1">安道通1</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务2">安道通2</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务3">安道通3</Checkbox>
                                                            </Col>
                                                        </CheckboxGroup>
                                                    </Row>
                                                </div>
                                                <Row class="cooperation-description">
                                                    <Col span="8">协同协作方式：{{1122}}</Col>
                                                    <Col span="16">协同协作内容：{{3344}}</Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <!-- 综保区服务 -->
            <div class="collapse" v-if="changeIndex == 4">
                <Collapse v-model="value" accordion>
                    <Panel name="1">
                        <div class="collapse-head">
                            <span>重庆</span>
                            <span>展开</span>
                        </div>
                        <div slot="content">
                            <Row>
                                <!-- 选择服务商 -->
                                <Col span="8" class="service-provider">
                                    <div class="service-provider-title">
                                        <span>选择服务商</span>
                                    </div>
                                    <div class="service-provider-company">
                                        <RadioGroup v-model="checkAllGroup">
                                            <Radio label="香蕉">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                            <Radio label="苹果">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                            <Radio label="西瓜">
                                                <p @click="selectCompany">
                                                    <span>川普公司</span>
                                                    <span class="price">基础价格: {{}}</span>
                                                    <span class="time">时长: {{}}</span>
                                                </p>
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col span="16" class="product">
                                    <div class="product-title">产品编号: {{}}</div>
                                    <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                    </adt-tab-btns>
                                    <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                    <adt-tab-btns :isBaseBtn="true" :titleNames="titleNamesTask" :btnIndex="changeIndexTask" @handleBtn="handleBtnTask" :width="200" :height="30" style="justify-content: flex-start" />
                                    <!-- 任务 -->
                                    <div v-if="changeIndexTask == 1">
                                        <AdtTaskContent class="spacing" :basicTask="basicTask" :additionalTasks="additionalTasks" />
                                    </div>
                                    <!-- 监控设置 -->
                                    <div v-if="changeIndexTask == 2">
                                        <p class="spacing">监控:</p>
                                        <div class="monitor">
                                            <div class="monitor-abnormal">
                                                <Row>
                                                    <Col span="4">异常1</Col>
                                                    <Col span="6">异常通知方式：{{}}</Col>
                                                    <Col span="14">异常通知内容：{{}}</Col>
                                                </Row>
                                            </div>
                                            <div class="monitor-notice">
                                                <p>
                                                    <span>异常通知企业：</span>
                                                    <span class="monitor-notice-people">添加异常通知人</span>
                                                </p>
                                                <Row class="monitor-company">
                                                    <CheckboxGroup v-model="notifyCompany">
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务1">安道通1</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务2">安道通2</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务3">安道通3</Checkbox>
                                                        </Col>
                                                    </CheckboxGroup>
                                                </Row>
                                            </div>
                                        </div>
                                        <div class="monitor">
                                            <div class="monitor-abnormal">
                                                <Row>
                                                    <Col span="4">异常1</Col>
                                                    <Col span="6">异常通知方式：{{}}</Col>
                                                    <Col span="14">异常通知内容：{{}}</Col>
                                                </Row>
                                            </div>
                                            <div class="monitor-notice">
                                                <p>
                                                    <span>异常通知企业：</span>
                                                    <span class="monitor-notice-people">添加异常通知人</span>
                                                </p>
                                                <Row class="monitor-company">
                                                    <CheckboxGroup v-model="notifyCompany">
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务1">安道通1</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务2">安道通2</Checkbox>
                                                        </Col>
                                                        <Col span="4" class="service-proxy">
                                                            <Checkbox label="代理服务3">安道通3</Checkbox>
                                                        </Col>
                                                    </CheckboxGroup>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 协同协作设置 -->
                                    <div v-if="changeIndexTask == 3">
                                        <div>
                                            <p class="spacing">协同协作1:</p>
                                            <div class="cooperation">
                                                <div class="cooperation-notice">
                                                    <p>
                                                        <span>协同协作方：</span>
                                                        <span class="cooperation-notice-people">添加协同协作方</span>
                                                    </p>
                                                    <Row class="cooperation-company">
                                                        <CheckboxGroup v-model="notifyCompany">
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务1">安道通1</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务2">安道通2</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务3">安道通3</Checkbox>
                                                            </Col>
                                                        </CheckboxGroup>
                                                    </Row>
                                                </div>
                                                <Row class="cooperation-description">
                                                    <Col span="8">协同协作方式：{{1122}}</Col>
                                                    <Col span="16">协同协作内容：{{3344}}</Col>
                                                </Row>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="spacing">协同协作2:</p>
                                            <div class="cooperation">
                                                <div class="cooperation-notice">
                                                    <p>
                                                        <span>协同协作方：</span>
                                                        <span class="cooperation-notice-people">添加协同协作方</span>
                                                    </p>
                                                    <Row class="cooperation-company">
                                                        <CheckboxGroup v-model="notifyCompany">
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务1">安道通1</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务2">安道通2</Checkbox>
                                                            </Col>
                                                            <Col span="4" class="service-proxy">
                                                                <Checkbox label="代理服务3">安道通3</Checkbox>
                                                            </Col>
                                                        </CheckboxGroup>
                                                    </Row>
                                                </div>
                                                <Row class="cooperation-description">
                                                    <Col span="8">协同协作方式：{{1122}}</Col>
                                                    <Col span="16">协同协作内容：{{3344}}</Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </Card>
    </div>
</template>

<script>
import AdtTaskContent from '@/components/adt-task-content/Index'
import AdtSchemeInformationRoute from '@/components/adt-scheme-information-route/Index'
export default {
    components: {
        AdtTaskContent,
        AdtSchemeInformationRoute
    },
    data() {
        return {
            value: '',
            agencyService: [],
            exchangeRate: '',
            selectTime: '',
            checkAllGroup: '香蕉',
            changeIndex: 1,
            titleNames: ['运输服务', '场所服务', '关务服务', '综保区服务'],
            titleNamesScenes: ['场景1', '场景2', '场景3'],
            changeIndexScenes: 1,
            titleNamesTask: ['任务', '监控设置', '协同协作设置'],
            changeIndexTask: 1,
            indeterminate: true,
            checkAll: false,
            logistics: [
                {
                    city: '重庆1',
                    transport: '海运',
                    type: '国内集装箱'
                },
                {
                    city: '香港',
                    transport: '空运',
                    type: '国内集装箱'
                },
                {
                    city: '纽约',
                    transport: '空运',
                    type: '国内集装箱'
                },
                {
                    city: '纽约',
                    transport: '空运',
                    type: '国内集装箱'
                }
            ],
            cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
            basicTask: [
                '基础任务1',
                '基础任务2',
                '基础任务3',
                '基础任务4',
                '基础任务5',
                '基础任务6',
                '基础任务7',
                '基础任务8',
                '基础任务9',
                '基础任务10'
            ],
            additionalTasks: [
                '附加任务1',
                '附加任务2',
                '附加任务3',
                '附加任务4',
                '附加任务5',
                '附加任务6',
                '附加任务7',
                '附加任务8',
                '附加任务9',
                '附加任务10'
            ],
            notifyCompany: []
        }
    },
    methods: {
        handleBtn (index) {
            this.changeIndex = index + 1
        },
        handleBtnScenes (index) {
            this.changeIndexScenes = index + 1
        },
        handleBtnTask (index) {
            this.changeIndexTask = index + 1
        },
        selectCompany () {
            console.log(123)
        }
    },
}
</script>

<style lang="scss" scoped>
// 保存按钮样式
.step-save{
    position: absolute;
    right: 16px;
    top: 24px;
    width: 128px;
}
// 通用间距顶部和底部10px
.spacing {
    margin: 10px 0;
}
.ivu-divider-horizontal{
    margin: 10px 0;
}
.title {
    font-size: $font-size-base;
    font-weight: bold;
    padding: 20px 0 10px 0;
}
// 选择代理服务
.service {
    padding-bottom: 20px;
    border-bottom: 1px dashed $border-color;
    .service-proxy {
        margin-top: 10px;
        padding-left: 10px;
        // 修改输入框的长度
        .ivu-input-wrapper {
            width: 55%;
        }
    }
}

// 汇率及方案
.program {
    padding-top: 20px;
    .program-settlement {
        padding-left: 20px;
        font-size: $font-size-base;
        font-weight: bold;
        .program-inherent {
            display: inline-block;
            padding-left: 20px;
            // 修改输入框的长度
            .ivu-input-wrapper {
                padding-left: 5px;
                width: 75%;
            }
        }
    }
}

/* 修改展开记录公共样式 */
    .collapse {
        background: #fff;
        max-height: 500px;
        overflow-y: auto;
        .collapse-head {
            padding-top: 10px;
            span {
                font-size:20px;
                font-family:Microsoft YaHei;
                font-weight:400;
                &:last-child{
                    float: right;
                    margin-right: 30px;
                    font-size: 10px;
                }
            }
            .icon {
                width: 100px;
                height: 17px;
            }
        }
        .ivu-collapse {
            border: none;
            background-color: #fff;
            .ivu-collapse-item {
                background-color: #fff6e5;
                border: none;
                margin-bottom: 10px;
                /deep/.ivu-collapse-header {
                    border: 0;
                    font-size: 14px;
                    height: 60px;
                    /deep/.ivu-icon-ios-arrow-forward {
                        position: absolute;
                        right: 0;
                        top: 38%;
                    }
                }
                /deep/.ivu-collapse-content {
                    background-color: $filling-color;
                }
            }
        }
    }

// 选择服务商
.service-provider {
    padding: 4px 0;
    .service-provider-title {
        & :first-child{
            font-size: $font-size-large;
            font-weight: bold;
            color: $main-font-color;
        }
    }
    .service-provider-company{
        margin: 10px 30px 0 0;
        padding: 10px 0 10px 20px;
        background-color: white;
        p {
            padding: 10px 0 0 10px;
            cursor: pointer;
            display: inline-block;
        }
        .price {
            margin-left: 10px;
        }
        .time {
            margin-left: 20px;
        }
    }
}
// 产品详情
.product {
    padding: 4px 0;
    .product-title {
        font-size: $font-size-large;
        font-weight: bold;
        color: $main-font-color;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid $border-color;
    }
    /deep/.tabTitle {
        justify-content: flex-start;
    }
}
// 监控
.monitor {
    background-color: white;
    .monitor-abnormal {
        padding: 10px 0;
        margin: 0 20px;
        border-bottom: 1px dashed  $border-color;
    }
    .monitor-notice {
        padding: 10px 20px;
        border-bottom: 1px solid $light-color;
        .monitor-notice-people{
            border: 1px solid $placeholder-font-color;
            border-radius: 5px;
            padding: 3px;
            color: $main-font-color;
        }
        .monitor-company {
            padding: 10px 50px;
        }
    }
    &:last-child {
        .monitor-notice {
            border-bottom: none;
        }
    }
}
// 协同协作
.cooperation {
    padding: 0 20px;
    background-color: white;
    .cooperation-notice {
        padding: 10px 0;
        border-bottom: 1px dashed  $border-color;
        .cooperation-notice-people{
            border: 1px solid $placeholder-font-color;
            border-radius: 5px;
            padding: 3px;
            color: $main-font-color;
        }
        .cooperation-company {
            padding: 10px 50px;
        }
    }
    .cooperation-description {
        padding: 10px 0;
    }
}
</style>