<template>
    <div class="route-info">
        <base-info v-if="!isDetail" :defaultData="baseInfo" @generate-route="generateRoute"></base-info>
        <div v-show="pureRouteList.length" class="route-info-container">
            <div class="public-head">
                <svg class="iconfont" aria-hidden="true" style="margin-left: 0;">
                    <use xlink:href="#icon-andaotongV3ICON_piliangxiangqing" />
                </svg>
                <div class="tip">
                    请删除您不需要的物流路线，我们将根据您保留的路线和录入参数为您组织对应物流方案！
                </div>
            </div>
            <div class="route-list">
                <div v-for="(route, index) in pureRouteList" :key="index" :class="['route', { active: curRouteActiveIndex === index }]" @click="chooseRoute(index)">
                    <div v-for="(site, idx) in route" :key="idx" class="site">
                        {{ site }}
                        <span v-if="idx !== route.length - 1" class="line"></span>
                    </div>
                    <Icon type="ios-close-circle" @click="delRoute(index)" />
                </div>
            </div>
            <div v-for="(route, index) in routeList" :key="index" v-show="curRouteActiveIndex === index" class="route-data">
                <div class="time-demand">
                    <h6>时间要求：</h6>
                    <Form :model="route.routeTime" :rules="timeRuleValidate" :ref="`timeFormItemData_${index}`" :label-width="160" label-colon>
                        <div class="public-form-card">
                            <Row>
                                <Col span="12">
                                    <FormItem v-if="isDetail" label="预计货好时间">
                                        {{ timestampFormat(route.routeTime.expectGoodsTime) }}
                                    </FormItem>
                                    <FormItem v-else label="预计货好时间" prop="expectGoodsTime">
                                        <DatePicker v-model="route.routeTime.expectGoodsTime" type="date"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem v-if="isDetail" label="最迟交货时间">
                                        {{ timestampFormat(route.routeTime.lastDeliveryTime) }}
                                    </FormItem>
                                    <FormItem v-else label="最迟交货时间" >
                                        <DatePicker v-model="route.routeTime.lastDeliveryTime" type="date"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col v-if="isDetail" span="12">
                                    <FormItem class="no-right-border" label="最低时间要求">
                                        {{ route.routeTime.lowestTimeReq }} {{ route.routeTime.timeUnit }}
                                    </FormItem>
                                </Col>
                                <template v-else>
                                    <Col span="7">
                                        <FormItem class="no-right-border" label="最低时间要求">
                                            <Input v-model.number="route.routeTime.lowestTimeReq"></Input>
                                        </FormItem>
                                    </Col>
                                    <Col span="5">
                                        <FormItem :label-width="0">
                                            <Select v-model="route.routeTime.timeUnit" clearable>
                                                <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                    {{ item.dictionaryValue }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </template>
                                <Col span="12">
                                    <FormItem v-if="isDetail" label="最晚运抵时间" >
                                        {{ timestampFormat(route.routeTime.lastArriveTime) }}( {{ route.routeTime.lastArriveRoad }})
                                    </FormItem>
                                    <FormItem v-else label="最晚运抵时间" >
                                        <DatePicker v-model="route.routeTime.lastArriveTime" type="date">
                                        </DatePicker>
                                        <Button size="small" @click="assignSite(route, 1)">指定节点</Button>
                                        <span class="assign-site">{{ route.routeTime.lastArrivePortTranslate && route.routeTime.lastArrivePortTranslate.split(';').pop() }}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="12">
                                    <FormItem v-if="isDetail" label="最迟启运时间" >
                                        {{ timestampFormat(route.routeTime.lastStartTime) }}( {{ route.routeTime.lastStartRoad }})
                                    </FormItem>
                                    <FormItem v-else label="最迟启运时间" >
                                        <DatePicker v-model="route.routeTime.lastStartTime" type="date">
                                        </DatePicker>
                                        <Button size="small" @click="assignSite(route, 2)">指定节点</Button>
                                        <span class="assign-site">{{ route.routeTime.lastStartPortTranslate && route.routeTime.lastStartPortTranslate.split(';').pop() }}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
                <div class="cost-demand">
                    <h6>费用要求：</h6>
                    <Form :model="route.cost" :label-width="160" label-colon>
                        <div class="public-form-card">
                            <Row>
                                <Col span="12">
                                    <FormItem label="最高费用要求">
                                        <Input v-model.number="route.cost.highestCostReq"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem v-if="isDetail" label="是否有结算要求" >
                                        {{ route.cost.hasStlactDmd }}
                                    </FormItem>
                                    <FormItem v-else label="是否有结算要求" >
                                        <RadioGroup v-model="route.cost.hasStlactDmd">
                                            <Radio v-for="item in yesOrNo" :key="item.dictionaryKey" :label="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                            </Row>
                            <div v-show="route.cost.hasStlactDmd === 'Y'">
                                <Row style="border-top: none;">
                                    <Col span="12">
                                        <FormItem label="结算地点">
                                            <Select v-model="route.cost.settleAccountsSiteType" clearable>
                                                <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                    {{ item.dictionaryValue }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="指定结算地点" >
                                            <Input v-model="route.cost.assignAccountsSite"></Input>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem label="结算时间">
                                            <Select v-model="route.cost.settleAccountsTimeType" clearable>
                                                <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                    {{ item.dictionaryValue }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="指定结算时间" >
                                            <DatePicker v-model="route.cost.assignAccountsTime" type="date">
                                            </DatePicker>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem label="结算币种">
                                            <Select v-model="route.cost.settleAccountsCurr" clearable>
                                                <Option v-for="item in timeUnit" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                                    {{ item.dictionaryValue }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Form>
                </div>
                <div class="customs-demand">
                    <h6>报关要求：</h6>
                    <Form :label-width="160" label-colon>
                        <div class="public-form-card">
                            <Row>
                                <Col span="24">
                                    <FormItem v-if="isDetail" label="是否需要报关服务">
                                        {{ route.hasStlactDmd }}
                                    </FormItem>
                                    <FormItem v-else label="是否需要报关服务">
                                        <RadioGroup v-model="route.hasStlactDmd">
                                            <Radio v-for="item in yesOrNo" :key="item.dictionaryKey" :label="item.dictionaryKey">
                                                {{ item.dictionaryValue }}
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                            </Row>
                            <div v-show="route.hasStlactDmd === 'Y'">
                                <Row v-if="route.isChina" style="border-top: none;">
                                    <template v-if="isDetail">
                                        <Col span="12">
                                            <FormItem label="进口报关地要求" style="position: relative;">
                                                <Input :value="route.imPort">
                                                </Input>
                                                <Button class="detail-btn" size="small" @click="checkAffixTask(route, 1)" style="position: absolute; top: 4px; right: 12px;">查看附加服务</Button>
                                            </FormItem>
                                        </Col>
                                    </template>
                                    <template v-else>
                                        <Col class="no-right-border" span="6">
                                            <FormItem label="进口报关地要求">
                                                <adt-city-selector :defaultData="route.imCity" @on-change="handelImportPlace" />
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem :label-width="0">
                                                <Select v-model="route.imSite" filterable clearable>
                                                    <Option v-for="item in importPlace" :key="item.value" :value="item.value">{{ item.label }}</Option>
                                                </Select>
                                                <Button size="small" @click="chooseAffixTask(route, 1)">选择附加服务</Button>
                                            </FormItem>
                                        </Col>
                                    </template>
                                    <template v-if="isDetail">
                                        <Col span="12">
                                            <FormItem label="出口报关地要求" style="position: relative;">
                                                <Input :value="route.exPort">
                                                </Input>
                                                <Button class="detail-btn" size="small" @click="checkAffixTask(route, 2)" style="position: absolute; top: 4px; right: 12px;">查看附加服务</Button>
                                            </FormItem>
                                        </Col>
                                    </template>
                                    <template v-else>
                                        <Col class="no-right-border" span="6">
                                            <FormItem label="出口报关地要求">
                                                <adt-city-selector :defaultData="route.exCity" @on-change="handelExportPlace" />
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem :label-width="0">
                                                <Select v-model="route.exSite" filterable clearable>
                                                    <Option v-for="item in exportPlace" :key="item.value" :value="item.value">{{ item.label }}</Option>
                                                </Select>
                                                <Button size="small" @click="chooseAffixTask(route, 2)">选择附加服务</Button>
                                            </FormItem>
                                        </Col>
                                    </template>
                                </Row>
                                <Row>
                                    <Col span="24">
                                        <FormItem class="choose-cpa" label="选择报关综保区">
                                            <CheckboxGroup v-model="route.customsBondListChecked">
                                                <Checkbox v-for="(item, idx) in route.customsBondListAll" :key="item.port" :label="item.port">
                                                    <span>{{ item.name }}</span>
                                                    <Button size="small" @click="chooseAffixTask(route, 3, idx)">选择附加服务</Button>
                                                    <Button v-if="isDetail" class="detail-btn" size="small" @click="checkAffixTask(route, 3, idx)">查看附加服务</Button>
                                                </Checkbox>
                                            </CheckboxGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Form>
                </div>
                <div class="road-list">
                    <adt-tab-btns
                        class="road-tab"
                        :titleNames="roadList"
                        :isSmallBtn="true"
                        :btnIndex="curRoadActiveIndex || -1"
                        @handleBtn="handleRoadBtn"
                    />
                    <div v-for="(road, idx) in route.roadFreights" :key="idx">
                        <div v-show="curRoadActiveIndex === idx + 1">
                            <div class="head">
                                <h6>参数：</h6>
                                <Button v-show="road.trspType === 'C'" size="small" @click="inputContainerInfo(road)">录入集装箱信息</Button>
                                <Button size="small" @click="chooseAffixTask(road, 4)">选择附加服务</Button>
                                <Button v-if="isDetail && road.trspType === 'C'" class="detail-btn" size="small" @click="checkContainerInfo(road)">查看集装箱信息</Button>
                                <Button v-if="isDetail" class="detail-btn" size="small" @click="checkAffixTask(road, 4)">查看附加服务</Button>
                            </div>
                            <Form :model="road" :rules="roadRuleValidate" :ref="`roadFormItemData_${index}_${idx}`" :label-width="180" label-colon>
                                <div class="public-form-card">
                                    <Row>
                                        <Col :span="(idx + 1) % 2 !== 0 ? 12: 24">
                                            <FormItem v-if="isDetail" label="运输类型">
                                                {{ road.trspType }}
                                            </FormItem>
                                            <FormItem v-else label="运输类型" prop="trspType">
                                                <RadioGroup v-model="road.trspType">
                                                    <Radio v-for="item in trspType" :key="item.dictionaryKey" :label="item.dictionaryKey">
                                                        {{ item.dictionaryValue }}
                                                    </Radio>
                                                </RadioGroup>
                                            </FormItem>
                                        </Col>
                                        <!-- 节点才显示是否需要综保区场所服务 -->
                                        <Col v-if="(idx + 1) % 2 !== 0" span="12">
                                            <FormItem v-if="isDetail" label="是否需要综保区场所服务">
                                                {{ road.hasStationBond }}
                                            </FormItem>
                                            <FormItem v-else label="是否需要综保区场所服务">
                                                <RadioGroup v-model="road.hasStationBond">
                                                    <Radio v-for="item in yesOrNo" :key="item.dictionaryKey" :label="item.dictionaryKey">
                                                        {{ item.dictionaryValue }}
                                                    </Radio>
                                                </RadioGroup>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <!-- 路段才显示，节点不显示 -->
                                    <template v-if="(idx + 1) % 2 === 0">
                                        <Row>
                                            <Col span="24">
                                                <FormItem label="物流类型">
                                                    <Input :value="road.isChina ? '国内物流' : '国际物流'" disabled style="margin-left: 12px;"></Input>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span="12">
                                                <FormItem v-if="isDetail" label="运输方式">
                                                    {{ road.trspMode }}
                                                </FormItem>
                                                <FormItem v-else label="运输方式">
                                                    <RadioGroup v-model="road.trspMode">
                                                        <Radio v-for="item in trspMode" :key="item.dictionaryKey" :label="item.dictionaryKey">
                                                            {{ item.dictionaryValue }}
                                                        </Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </Col>
                                            <Col span="12">
                                                <FormItem v-if="isDetail" label="船舶运输要求">
                                                    {{ road.shippingRequire }}
                                                </FormItem>
                                                <FormItem v-else label="船舶运输要求">
                                                    <RadioGroup v-model="road.shippingRequire">
                                                        <Radio v-for="item in yesOrNo" :key="item.dictionaryKey" :label="item.dictionaryKey">
                                                            {{ item.dictionaryValue }}
                                                        </Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </template>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Button v-if="!isDetail" class="next-step-btn" type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
        <!-- 录入集装箱信息 -->
        <container-info :defaultData="containerInfo" :showDrawer="showContainerDrawer" @submit-form="submitContainerForm" @on-visible-change="containerVisiableChange"></container-info>
        <!-- 选择附加服务 -->
        <choose-affix-task :defaultData="affixTask" :requestData="affixTaskRequestData" :showDrawer="showAffixDrawer" @submit-form="submitAffixForm" @on-visible-change="affixVisiableChange"></choose-affix-task>
        <!-- 指定节点 -->
        <choose-site :defaultData="siteData" :label="siteLabel" :showDrawer="showSiteDrawer" @submit-form="submitSiteForm" @on-visible-change="siteVisiableChange"></choose-site>
        <!-- 查看附加服务 -->
        <check-affix-task :defaultData="affixTask" :showDrawer="showCheckAffixTaskDrawer" @on-visible-change="checkAffixTaskVisiableChange"></check-affix-task>
        <!-- 查看集装箱信息 -->
        <check-container :defaultData="containerInfo" :showDrawer="showCheckContainerDrawer" @on-visible-change="checkContainerVisiableChange"></check-container>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import { _handelDir, timestampFormat } from '@/libs/utils'
    import ContainerInfo from './drawer/ContainerInfo'
    import ChooseAffixTask from './drawer/ChooseAffixTask'
    import CheckAffixTask from './drawer/CheckAffixTask'
    import CheckContainer from './drawer/CheckContainer'
    import BaseInfo from './BaseInfo'
    import ChooseSite from '@/components/choose-site/Index'
    export default {
        components: {
            ContainerInfo,
            ChooseAffixTask,
            ChooseSite,
            BaseInfo,
            CheckAffixTask,
            CheckContainer
        },
        props: {
            defaultData: {
                type: Object,
                default: () => ({})
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                formItem: {},
                // 是否
                yesOrNo: this.$getDictionary('Y_N'),
                // 运输类型
                trspType: this.$getDictionary('TRANSPORT_TYPE'),
                // 运输方式
                trspMode: this.$getDictionary('TRANSPORT_MODE'),
                // 船舶运输要求
                // cargoType: this.$getDictionary('GOODS_TYPE'),
                //集装箱尺寸类型
                contaSizeType: this.$getDictionary('CONTAINER_SIZE_TYPE'),
                // 集装箱来源
                contaSource: this.$getDictionary('CONTAINER_SOURCE'),
                // 时间单位
                timeUnit: this.$getDictionary('TIME_UNIT'),
                // 货币单位
                // currencyUnit: this.$getDictionary(''),
                // 结算币种
                // tempUnit: this.$getDictionary(''),
                // 结算地点
                // tempUnit: this.$getDictionary(''),
                // 结算时间
                // tempUnit: this.$getDictionary(''),

                // 生成的路线信息
                // routeList: this.defaultData,
                routeList: this.defaultData,
                // 由路段组装成的路线
                pureRouteList: [],
                // 当前选中的路线index
                curRouteActiveIndex: -1,
                // 时间要求表单校验
                timeRuleValidate: {
                    expectGoodsTime: [
                        {
                            required: true,
                            validator: validateRules.validateTime,
                            trigger: 'change'
                        }
                    ]
                },
                // 路段要求表单校验
                roadRuleValidate: {
                    trspType: [
                        validateRules.required('运输类型')[0]
                    ]
                },
                // 路綫下的路段信息
                roadList: [],
                // 当前选中的路段index
                curRoadActiveIndex: 1,

                // 进口报关地场所集合
                importPlace: [],
                // 出口报关地场所集合
                exportPlace: [],

                // 基本信息
                baseInfo: {},
                // 集装箱信息
                containerInfo: {},
                // 附加任务
                affixTask: [{}],
                // 路线
                siteData: {},
                // 指定节点的所有节点
                assignSiteList: [],

                showContainerDrawer: false,
                showAffixDrawer: false,
                showSiteDrawer: false,

                // 当前选择附加服务的路线
                curRoute: {},
                // 当前录入集装箱信息、选择附加服务的路段
                curRoad: {},

                // 选择附加服务类型
                // 1: 进口报关地要求, 2: 出口报关地要求, 3: 路段
                affixType: 0,
                // 请求附加任务的参数
                affixTaskRequestData: {},

                // 指定节点
                // 1: 最晚运抵时间, 2: 最迟启运时间
                siteType: 0,
                // 指定节点

                // 当前第几个选择附加服务的综保区
                curCpaIndex: 0,

                // 指定节点弹框label
                siteLabel: '',

                showCheckAffixTaskDrawer: false,
                showCheckContainerDrawer: false,

                // 基本信息里的启运地、目的地、中转地数据
                placeData: {}
            }
        },
        watch: {
            defaultData (newVal) {
                this.initRouteList(newVal.routeList)
                this.baseInfo = newVal.baseInfo
            }
        },
        methods: {
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp, true)
            },
            // 编辑、完善初始化数据
            async initRouteList (data) {
                for (const route of data) {
                    // 国家省市区场所拆分
                    const importArr = route.imPort.split(';')
                    const exportArr = route.exPort.split(';')
                    route.imSite = importArr.pop()
                    route.exSite = exportArr.pop()
                    route.imCity = importArr.join(';') + ';'
                    route.exCity = exportArr.join(';') + ';'
                    this.importPlace = await _handelDir(importArr)
                    this.exportPlace = await _handelDir(exportArr)
                    // 时间戳转换为日期格式
                    for (const key in route.routeTime) {
                        if (key === 'expectGoodsTime' || key === 'lastDeliveryTime' || key === 'lastArriveTime' || key === 'lastStartTime') {
                            route.routeTime[key] = this.timestampFormat(route.routeTime[key])
                        }
                    }
                }
                this.packageRouteRoad(data)
            },
            // 生成路线
            generateRoute (data, placeData) {
                this.placeData = placeData
                this.packageRouteRoad(data, true)
            },
            // 组装路线、路段
            // isGenerate: { true: 生成路线， false: 编辑、完善 }
            packageRouteRoad (data, isGenerate) {
                this.pureRouteList = []
                // 将返回的路段拼成路线
                for (const route of data) {
                    // 判断路段、路线是国内还是国外
                    this.judgeLogisticsType(route)
                    if (isGenerate) {
                        // 给提交到后端的数据默认值，不然后面操作会报错
                        route.imSceneList = []
                        route.exSceneList = []
                        route.routeTime = {}
                        route.cost = {}
                        route.customsBondListAll = []
                    }
                    const nodeArr = [] // 组装的路线集合
                    this.assignSiteList = []
                    for (const key in route.roadFreights) {
                        route.roadFreights[key].sceneList = []
                        // 奇数位的就是节点
                        if ((key - 0 + 1) % 2 !== 0) {
                            // 组装指定节点集合
                            this.assignSiteList.push({
                                name: route.roadFreights[key].departurePortTranslate.split(';').pop() + ';' + route.roadFreights[key].roadCode,
                                port: route.roadFreights[key].departurePort
                            })
                            // 报关综保区就是所有的节点
                            route.customsBondListAll.push({
                                bondSeneList: [],
                                port: route.roadFreights[key].departurePort,
                                roadCode: route.roadFreights[key].roadCode,
                                name: route.roadFreights[key].departurePortTranslate.split(';').pop()
                            })
                            nodeArr.push(route.roadFreights[key].departurePortTranslate.split(';').pop())
                        }
                    }
                    // 编辑、完善要将选中的综保区体现在所有的综保区里
                    if (!isGenerate) {
                        route.customsBondListChecked = []
                        for (const customsChecked of route.customsBondList) {
                            route.customsBondListChecked.push(customsChecked.port)
                            for (const customs of route.customsBondListAll) {
                                if (customsChecked.port === customs.port) {
                                    customs.bondSeneList = customsChecked.bondSeneList
                                }
                            }
                        }
                    }
                    this.pureRouteList.push(nodeArr)
                }
                console.log(data)
                // 展示路线信息
                this.routeList = data
            },
            // 判断物流类型是国内还是国际物流
            judgeLogisticsType (route) {
                this.$set(route, 'isChina', true)
                for (const road of route.roadFreights) {
                    this.$set(road, 'isChina', true)
                    this.$set(road, 'logisticsType', 'N')
                    if ((road.departurePort && !this.isChina(road.departurePort)) || (road.destinationPort && !this.isChina(road.destinationPort))) {
                        this.$set(road, 'isChina', false)
                        this.$set(road, 'logisticsType', 'I')
                        this.$set(route, 'isChina', false)
                    }
                }
            },
            // 下一步
            submitForm () {
                let allValid = true
                for (let i = 0; i < this.routeList.length; i++) {
                    console.log(this.routeList[i].imSite)
                    this.routeList[i].imPort = (this.routeList[i].imCity || '') + (this.routeList[i].imSite || '')
                    this.routeList[i].exPort = (this.routeList[i].exCity || '') + (this.routeList[i].exSite || '')
                    // 为了后端能够校验通过，日期没填的时候不能传'',可以不传（undefined）或者传null
                    this.routeList[i].routeTime.expectGoodsTime = this.routeList[i].routeTime.expectGoodsTime || undefined
                    this.routeList[i].routeTime.lastArriveTime = this.routeList[i].routeTime.lastArriveTime || undefined
                    this.routeList[i].routeTime.lastDeliveryTime = this.routeList[i].routeTime.lastDeliveryTime || undefined
                    this.routeList[i].routeTime.lastStartTime = this.routeList[i].routeTime.lastStartTime || undefined
                    this.routeList[i].cost.assignAccountsTime = this.routeList[i].cost.assignAccountsTime || undefined

                    this.$refs[`timeFormItemData_${i}`][0].validate(valid => {
                        if (!valid) {
                            allValid = false
                        }
                    })
                    // 校验未通过，展示未通过的route
                    if (!allValid) {
                        this.curRouteActiveIndex = i
                        break
                    }
                    for (let j = 0; j < this.routeList[i].roadFreights.length; j++) {
                        this.$refs[`roadFormItemData_${i}_${j}`][0].validate(valid => {
                            if (!valid) {
                                allValid = false
                            }
                        })
                        // 校验未通过，展示未通过的route、road
                        if (!allValid) {
                            this.curRouteActiveIndex = i
                            this.curRoadActiveIndex = j + 1
                            break
                        }
                    }
                }
                if (allValid) {
                    // 将选中的综保区放到customsBondList
                    for (const route of this.routeList) {
                        route.customsBondList = []
                        route.customsBondListChecked = route.customsBondListChecked || []
                        for (const port of route.customsBondListChecked) {
                            for (const customs of route.customsBondListAll) {
                                if (port === customs.port) {
                                    route.customsBondList.push(customs)
                                }
                            }
                        }
                    }
                    console.log(this.routeList)
                    this.$emit('submit-form', this.routeList, this.placeData)
                }
            },
            // 选择路线
            chooseRoute (index) {
                this.curRouteActiveIndex = index
                // 获取当前路线下的路段集合
                this.roadList = []
                for (const road of this.routeList[index].roadFreights) {
                    this.roadList.push(road.departurePortTranslate.split(';').pop() + (road.destinationPortTranslate && '——') + road.destinationPortTranslate.split(';').pop())
                }
            },
            // 删除路线
            delRoute (index) {
                this.routeList.splice(this.curRouteActiveIndex, 1)
            },
            // 选择进口报关地城市
            async handelImportPlace (data) {
                if (data.data.length !== 0) {
                    const arr = await _handelDir(data.value)
                    this.importPlace = arr
                }
                // 重置选择的场所
                this.routeList[this.curRouteActiveIndex].imSite = ''
                this.routeList[this.curRouteActiveIndex].imCity = data.value.length ? data.value.join(';') + ';' : ''
            },
            // 选择出口报关地城市
            async handelExportPlace (data) {
                if (data.data.length !== 0) {
                    const arr = await _handelDir(data.value)
                    this.exportPlace = arr
                }
                // 重置选择的场所
                this.routeList[this.curRouteActiveIndex].exSite = ''
                this.routeList[this.curRouteActiveIndex].exCity = data.value.length ? data.value.join(';') + ';' : ''
            },
            // 点击路段
            handleRoadBtn (index) {
                this.curRoadActiveIndex = ++index
            },

            // 录入集装箱信息
            // data: 当前路段
            inputContainerInfo (data) {
                this.curRoad = data
                this.containerInfo = { ...data }
                this.showContainerDrawer = true
            },
            // 查看集装箱信息
            // data: 当前路段
            checkContainerInfo (data) {
                this.curRoad = data
                this.containerInfo = { ...data }
                this.showCheckContainerDrawer = true
            },
            // 保存集装箱信息
            submitContainerForm (data) {
                this.curRoad = Object.assign(this.curRoad, data)
            },
            containerVisiableChange (changeStatus) {
                this.showContainerDrawer = changeStatus
            },
            checkContainerVisiableChange (changeStatus) {
                this.showCheckContainerDrawer = changeStatus
            },

            // 选择附加服务
            // { data: 当前路线或者路段, type: { 1: 进口报关地要求, 2: 出口报关地要求, 3: 综保区, 4: 路段 }, index: 当前第几个综保区 }
            chooseAffixTask (data, type, index) {
                this.handleAffixTask(data, type, index)
                this.showAffixDrawer = true
            },
            // 查看附加服务
            // { data: 当前路线或者路段, type: { 1: 进口报关地要求, 2: 出口报关地要求, 3: 综保区, 4: 路段 }, index: 当前第几个综保区 }
            checkAffixTask (data, type, index) {
                this.handleAffixTask(data, type, index)
                this.showCheckAffixTaskDrawer = true
            },
            handleAffixTask (data, type, index) {
                this.affixType = type
                this.curCpaIndex = index
                switch (type) {
                    case 1:
                        this.affixTaskRequestData = {
                            serverType: 'C',
                            customsType: 'A',
                            iEFlag: 'I',
                            customsCity: data.imCity && (data.imCity + (data.imSite || ''))
                        }
                        this.curRoute = data
                        this.affixTask = [ ...data.imSceneList ]
                        break
                    case 2:
                        this.affixTaskRequestData = {
                            serverType: 'C',
                            customsType: 'A',
                            iEFlag: 'E',
                            customsCity: data.exCity && (data.exCity + (data.exSite || ''))
                        }
                        this.curRoute = data
                        this.affixTask = [ ...data.exSceneList ]
                        break
                    case 3:
                        this.affixTaskRequestData = {
                            serverType: 'C',
                            customsType: 'B',
                            customsCity: data.customsBondListAll[index].port
                        }
                        this.curRoute = data
                        this.affixTask = [ ...data.customsBondListAll[index].bondSeneList ]
                        break
                    case 4:
                        this.affixTaskRequestData = {
                            serverType: data.destinationPort ? 'T' : 'Y',
                            trspType: data.trspType,
                            logisticsType: data.destinationPort ? (data.isChina ? 'N' : 'I') : '',
                            // trspMode: data.trspMode,
                            sttnType: data.destinationPort ? undefined : (data.hasStationBond ? 'B' : 'A')
                        }
                        this.curRoad = data
                        this.affixTask = [ ...data.sceneList ]

                }
            },
            // 保存附加任务
            submitAffixForm (data) {
                switch (this.affixType) {
                    case 1:
                        this.curRoute.imSceneList = data
                        break
                    case 2:
                        this.curRoute.exSceneList = data
                        break
                    case 3:
                        this.curRoute.customsBondListAll[this.curCpaIndex].bondSeneList = data
                        break
                    case 4:
                        this.curRoad.sceneList = data
                }
            },
            affixVisiableChange (changeStatus) {
                this.showAffixDrawer = changeStatus
            },
            checkAffixTaskVisiableChange (changeStatus) {
                this.showCheckAffixTaskDrawer = changeStatus
            },

            // 指定节点
            // { data: 当前路线, index: 当前是第几个路线, type：{ 1：最晚运抵时间, 2: 最迟启运时间 } }
            assignSite (data, type) {
                this.siteType = type
                this.curRoute = data
                if (type === 1) {
                    this.siteLabel = '最晚运抵时间'
                    this.siteData = {
                        date: data.routeTime.lastArriveTime,
                        // site: data.routeTime.lastArrivePortTranslate.split(';').pop() + ';' + data.routeTime.lastArriveRoad,
                        lists: this.assignSiteList
                    }
                } else {
                    this.siteLabel = '最迟启运时间'
                    this.siteData = {
                        date: data.routeTime.lastStartTime,
                        // site: data.routeTime.lastStartPortTranslate.split(';').pop() + ';' + data.routeTime.lastStartRoad,
                        lists: this.assignSiteList
                    }
                }
                this.showSiteDrawer = true
            },
            // 保存节点
            submitSiteForm (data) {
                console.log(data)
                switch (this.siteType) {
                    case 1:
                        this.curRoute.routeTime.lastArriveTime = data.date
                        this.curRoute.routeTime.lastArriveRoad = data.site.split('~')[0].split(';')[1]
                        this.curRoute.routeTime.lastArrivePortTranslate = data.site.split('~')[0].split(';')[0]
                        this.curRoute.routeTime.lastArrivePort = data.site.split('~')[1]
                        break
                    case 2:
                        this.curRoute.routeTime.lastStartTime = data.date
                        this.curRoute.routeTime.lastStartRoad = data.site.split('~')[0].split(';')[1]
                        this.curRoute.routeTime.lastStartPortTranslate = data.site.split('~')[0].split(';')[0]
                        this.curRoute.routeTime.lastStartPort = data.site.split('~')[1]
                }
            },
            siteVisiableChange (changeStatus) {
                this.showSiteDrawer = changeStatus
            },
            siteVisiableChange (changeStatus) {
                this.showSiteDrawer = changeStatus
            },

            // 判断站点是国内还是国外
            // port: 用;连接的家省市区级联port
            isChina (port) {
                const countryPort = port.split(';')[0]
                return countryPort === 'CN' ? true : false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .next-step-btn {
        margin: 30px 0;
    }
    .route-info  {
        .route-info-container {
            margin-top: 20px;
            padding: 20px;
            background-color: #fff;
            .route-list {
                @extend %scrollbar-x;
                display: flex;
                align-items: center;
                // padding: 0 20px 20px 0;
                padding-right: 20px;
                .route {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                    height: 40px;
                    margin-right: 20px;
                    padding: 0 12px 0 30px;
                    background-color: #f5f5f5;
                    border: 1px solid #f5f5f5;
                    border-radius: 4px;
                    color: #666;
                    cursor: pointer;
                    .site {
                        display: flex;
                        align-items: center;
                        .line {
                            width: 30px;
                            height: 1px;
                            margin: 0 2px;
                            background-color: #666;
                        }
                    }
                    i {
                        margin-left: 20px;
                        font-size: 20px;
                        color: #dcdcdc;
                    }
                    &:hover, &.active {
                        border-color: $light-color;
                        background-color: #E8EFF5;
                        i {
                            color: $light-color;
                        }
                    }
                }
            }
            h6 {
                margin: 20px 0 10px 0;
                font-size: 16px;
            }
        }
        .public-form-card {
            padding: 0;
        }
        .choose-cpa {
            /deep/ .ivu-checkbox-group {
                @extend %scrollbar-x;
                display: flex;
            }
            /deep/ .ivu-checkbox-group-item {
                display: flex;
                align-items: center;
                flex-shrink: 0;
                width: 20%;
                /deep/ .ivu-checkbox {
                    margin: 0 6px 0 20px;
                    & + span + button {
                        display: none;
                    }
                    &.ivu-checkbox-checked + span + button {
                        display: inline-block;
                    }
                }
            }
        }
        .road-list {
            .road-tab  {
                margin-top: 20px;
                padding: 20px 0;
                border-top: 1px solid #c8c8c8;
                border-bottom: 1px dashed #999;
            }
            .head {
                display: flex;
                align-items: center;
                margin: 18px 0 10px 0;
                h6 {
                   margin: 0;
                }
                button {
                    margin: 0 5px;
                }
            }
        }
    }
    .assign-site {
        display: inline-block;
        margin-left: 18px;
    }
    .ivu-col-span-5 {
        .ivu-form-item {
            /deep/ .ivu-select {
                margin-left: -63px;
            }
        }
    }
</style>
