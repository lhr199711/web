<template>
    <div class="add-product">
        <div class="choose-type" style="display:flex;">
            选择服务产品类型：
            <Select v-model="productType" @on-change="goToAddProduct">
                <Option v-for="item in serviceType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                    {{ item.dictionaryValue }}
                </Option>
            </Select>
            <Form
                class="titleRequire"
                :model="titleRequiredOption"
                :rules="ruleValidate"
                ref="sttnTypeFormValid"
                style="margin:0 0 0 20px;"
            >
                <FormItem label="选择场所类型：" prop="sttnType">
                    <Select v-model="titleRequiredOption.sttnType">
                        <Option v-for="item in stationType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                            {{ item.dictionaryValue }}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
        </div>
        <div class="white-bg add-product-content">
            <div class="add-site">
                <Row>
                    <Col span="3">
                        <div class="name">添加场所:</div>
                    </Col>
                    <Col span="21">
                        <Form
                            ref="formValidate"
                            label-position="left"
                            :model="siteData"
                            :rules="ruleValidate"
                            :label-colon="true"
                            :label-width="85"
                            inline
                        >
                            <FormItem label="国家城市" prop="dispatchCity">
                                <adt-city-selector @on-change="changeDispatchCity" />
                            </FormItem>
                            <FormItem label="选择场所" prop="dispatchSite">
                                <Select v-model="siteData.dispatchSite" clearable>
                                    <Option v-for="(option, index) in dispatchOptions" :key="index" :value="`${option.value}~${option.label}`">
                                        {{ option.label }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
            <div class="choose-parameter">
                <h6 style="margin-top: 0;">选择参数：</h6>
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
                    </Form>
                    <div class="btns">
                        <Button @click="handleReset()">重置参数</Button>
                        <Button type="primary" @click="saveParameter()">保存参数</Button>
                    </div>
                </div>
            </div>
            <div class="public-component-line"></div>
            <!-- 一期不做删除、以后要做的时候，记得把./style.scss 165行的代码改一下 -->
            <!-- <adt-button :allDelShow="true" :delUrl="delUrl" :selectList="selectList" v-if="productAllInfo.length"></adt-button> -->
            <div class="product-list public-modify-record">
                <div class="collapse">
                    <Collapse v-model="curCollapse" accordion>
                        <template v-for="(product, index) in productAllInfo">
                            <!-- 一期不做删除、以后要做的时候，记得把./style.scss 165行的代码改一下 -->
                            <!-- <Checkbox v-model="product.checked" @on-change="chooseProduct(product.id, product.checked)" :disabled="index === 0 && hasPendingProduct"></Checkbox> -->
                            <Panel :name="index + ''" @click="curCollapse = index">
                                <Row>
                                    <!-- <Col span="5" class="product-number" v-if="product.serverCode">
                                        产品编号：{{ product.serverCode }}
                                    </Col>
                                    <Col span="5" class="line">
                                        {{ product.sites.dispatchCity }}{{ product.sites.dispatchSite }}
                                    </Col>
                                    <Col :span="product.serverCode ? 10 : 14" class="parameter">
                                        产品参数：{{ product.parameters }}
                                    </Col>
                                    <Col span="3" class="btns" v-if="index === 0 && hasPendingProduct">
                                        <Button size="small" @click.stop="saveProduct(product)">保存产品</Button>
                                    </Col> -->
                                    <Col v-if="product.serverCode" class="product-number" span="6">
                                        产品编号：{{ product.serverCode }}
                                    </Col>
                                    <Col class="parameter" span="13">
                                        产品参数：{{ product.parameters }}
                                    </Col>
                                    <Col v-if="index === 0 && hasPendingProduct" class="btns" span="4">
                                        <Button style="margin-right:10px;" size="small" @click.stop="setWaitTime(index)">设置等待时长</Button>
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
                                                    <Col span="10" class="item">
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
                                                    <Col span="14" class="item">
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
                                            <div class="additional-item" v-show="!isBasicTask">
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
                    <Table :columns="previewColumns" :data="previewTableData"max-height="500" stripe  />
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
        <!-- 设置外层等待时长弹窗 -->
        <adt-my-modal
            title="系统提示"
            width="430px"
            :showModal="isShowWaitTimeModal"
            @on-visible-change="waitModalChange"
            @on-ok="setProWaitTime"
        >

            <Form
                v-if="productAllInfo.length"
                :model="productAllInfo[nowPlaceProIndex]"
                :rules="ruleValidate"
                ref="waitTimeForm"
            >
                <Row>
                    <Col span="6">
                        <p style="line-height:32px;">等待时长:</p>
                    </Col>
                    <Col span="10">
                        <FormItem prop="waitTime" class="transportTimeItem1">
                            <Input v-model.number.trim="productAllInfo[nowPlaceProIndex].waitTime" placeholder="请输入"></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem prop="waitTimeUnit" class="transportTimeItem2">
                            <Select
                                v-model="productAllInfo[nowPlaceProIndex].waitTimeUnit"
                                clearable
                            >
                                <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </adt-my-modal>
    </div>
</template>

<script>
    import addProductContent from '@/mixins/addProductContent'
    import AdtTaskContent from '@/components/adt-task-content/Index'
    import validateRules from '@/libs/validateRules'
    import { apiStationAddCode, apiStationAddServer } from '@/api/productEditor'
    export default {
        mixins: [addProductContent],
        components: {
            AdtTaskContent
        },
        data () {
            return {
                titleRequiredOption: {
                    sttnType: ''
                },
                productType: 'Y',
                goodsUnit: this.$getDictionary('GOODS_UNIT'),
                serviceType: this.$getDictionary('SERVICE_TYPE'),
                trspType: this.$getDictionary('TRANSPORT_TYPE'),
                logisticsType: this.$getDictionary('LOGISTICS_TYPE'),
                contaSizeType: this.$getDictionary('CONTAINER_SIZE_TYPE'),
                currencyCode: this.$getDictionary('CURRENCY_CODE'),
                timeUnit: this.$getDictionary('TIME_UNIT'),
                stationType: this.$getDictionary('STATION_TYPE'),
                siteData: {
                    dispatchCity: '',
                    dispatchSite: ''
                },
                ruleValidate: {
                    dispatchCity: [
                        validateRules.select('国家城市')[0]
                    ],
                    dispatchSite: [
                        validateRules.select('场所')[0]
                    ],
                    waitTime: [
                        validateRules.requiredNumber('数字')[0]
                    ],
                    waitTimeUnit: [
                        validateRules.select('时间单位')[0]
                    ],
                    sttnType: [
                        validateRules.select('场所类型')[0]
                    ]
                },
                parameterData: {
                    trspType: '',
                    logisticsType: ''
                },
                parameterRuleValidate: {
                    trspType: [
                        validateRules.select('运输类型')[0]
                    ],
                    logisticsType: [
                        validateRules.select('物流类型')[0]
                    ]
                },
                dispatchOptions: [],
                delUrl: function () {},
                isShowWaitTimeModal: false,
                nowPlaceProIndex: 0
            }
        },
        methods: {
            // 保存参数（层叠掉mixin中的方法）
            saveParameter () {
                const vm = this
                if (this.hasPendingProduct) {
                    this.$Message.warning('请先保存产品！')
                    return
                }
                let [siteValid, parameterValid, sttnTypeValid] = [true, true, true]
                // 路线场所form
                if (this.$refs.formValidate) {
                    this.$refs.formValidate.validate(valid => {
                        valid ? siteValid = true : siteValid = false
                    })
                }
                // 参数form
                if (this.$refs.parameterFormValidate) {
                    this.$refs.parameterFormValidate.validate(valid => {
                        valid ? parameterValid = true : parameterValid = false
                    })
                }
                //选择场所类型form
                if (this.$refs.sttnTypeFormValid) {
                    this.$refs.sttnTypeFormValid.validate(valid => {
                        valid ? sttnTypeValid = true : sttnTypeValid = false
                    })
                }
                // 所有的表单验证都通过
                if (siteValid && parameterValid && sttnTypeValid) {
                    // 运输产品 && 运输类型为集装箱（C）
                    if (this.productType === 'T' && this.parameterData.trspType.split('~')[0] === 'C' && (!this.parameterData.contaSizeType || !this.parameterData.contaSource)) {
                        this.$Message.warning('运输类型为集装箱，集装箱尺寸类型和集装箱来源必填')
                        return
                    }
                    const parameters = Object.values(this.parameterData)
                    // 判断是否选择了参数
                    const hasParameter = parameters.some(item => item)
                    if (!hasParameter) {
                        this.$Message.warning('请先选择参数！')
                        return
                    }
                    // 判断参数是否完全重复，需要发送ajax请求让后端来判断
                    // 因为有的产品已经提前新增过了，这里拿不到其他产品的参数信息
                    // 将参数value从数据中提取出来
                    // 后续保存产品的时候还要发送这些数据
                    const postData = {}
                    for (const key in this.parameterData) {
                        // 点击重置后，this.parameterData[key]为undefined
                        postData[key] = this.parameterData[key] && this.parameterData[key].split('~')[0]
                    }
                    for (const key in this.siteData) {
                        postData[key] = this.siteData[key] && this.siteData[key].split('~')[0]
                    }
                    // 运输产品：整合启运地、场所，目的地、场所
                    if (this.productType === 'T') {
                        postData.departurePort = `${postData.dispatchCity};${postData.dispatchSite}`
                        postData.destinationPort = `${postData.destinationCity};${postData.destinationSite}`
                        delete postData.dispatchCity
                        delete postData.dispatchSite
                        delete postData.destinationCity
                        delete postData.destinationSite
                    } else if (this.productType === 'Y') {
                        // 场所产品：整合国家城市、场所
                        postData.sttnCode = `${postData.dispatchCity};${postData.dispatchSite}`
                        delete postData.dispatchCity
                        delete postData.dispatchSite
                    }

                    // 获取产品编号
                    if (this.productType === 'T') {
                        // 运输产品
                        apiTransportAddCode().then(({ data }) => {
                            successCallback(data)
                        })
                    } else if (this.productType === 'Y') {
                        // 场所产品
                        apiStationAddCode().then(({ data }) => {
                            successCallback(data)
                        })
                    }
                    // eslint-disable-next-line
                    function successCallback (data) {
                        vm.curCollapse = '0'
                        vm.hasPendingProduct = true
                        const showParameters = []
                        const showSites = []
                        for (const val of parameters) {
                            // 点击重置后，vm.parameterData[key]为undefined
                            // 去除undefined
                            if (val) {
                                showParameters.push(val.split('~')[1])
                            }
                        }

                        for (const key in vm.siteData) {
                            showSites[key] = vm.siteData[key].split('~')[1]
                        }
                        vm.productAllInfo.unshift({
                            sttnType: vm.titleRequiredOption.sttnType,
                            serverCode: data,
                            sceneTabIndex: -1,
                            parameters: showParameters.join('+'),
                            sites: showSites,
                            ...postData
                        })
                    }
                }
            },
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
                            if (scene.taskAffixesList[key].taskCost === undefined || scene.taskAffixesList[key].taskCost === '') {
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
                delete product.parameters
                delete product.sceneNames
                delete product.sceneTabIndex
                delete product.sites
                // 保存成功
                console.log(product);
                apiStationAddServer({ data: product }).then(res => {
                    this.$Message.success(res.message)
                    this.hasPendingProduct = false
                })
            },
            // 选择启运地城市
            async changeDispatchCity (value) {
                this.siteData.dispatchCity = value.data.length ? `${value.value.join(';')}~${value.data[value.data.length - 1].addressName}` : ''
                this.dispatchOptions = await this._handelDir(value.value)
            },
            waitModalChange (val) {
                this.isShowWaitTimeModal = val
            },
            setWaitTime (index) {
                this.nowPlaceProIndex = index;
                if(!this.productAllInfo[index].hasOwnProperty('waitTime')){
                    this.$set(this.productAllInfo[index],'waitTime','')
                    this.$set(this.productAllInfo[index],'waitTimeUnit','')
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
        }
    }
</script>

<style lang="scss" scoped>
    @import './style.scss';
    .titleRequire {
        .ivu-form-item {
            display: flex;
        }
    }
</style>
