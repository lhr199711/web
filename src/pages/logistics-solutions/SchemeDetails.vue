<template>
    <div>
        <!-- 方案基本信息 -->
        <div class="title">方案基本信息</div>
        <AdtSchemeInformationRoute :logistics="logistics">
            <!-- 客户看到的方案基本信息 -->
            <template slot="price" v-if="distinguishCharacter == 'ENT'">
                <Row>
                    <Col span="5">
                        <span>参考价格:{{ listData.hghtPrice }}/{{ listData.offerCurrTranslate }}</span>
                    </Col>
                    <Col span="5">
                        <span>参考时长:{{ listData.hghtTmeff }}{{ listData.tmeffUnitTranslate }}</span>
                    </Col>
                    <Col span="4">
                        <span>结算固定汇率:{{ listData.exrt }}</span>
                    </Col>
                    <Col span="5">
                        <span>方案截至时间:{{ listData.endOfTime }}</span>
                    </Col>
                    <Col span="5">
                        <span>方案截止前提醒时间:{{ listData.remindTime }}天</span>
                    </Col>
                    <!-- <Col span="4">
                        <span>集装箱尺寸类型</span>
                    </Col>
                    <Col span="3">
                        <span>集装箱来源</span>
                    </Col> -->
                </Row>
            </template>
            <template v-if="distinguishCharacter == 'ENT'" slot="service">
                <Row>
                    <Col v-for="(scheme, id) in schemeProxyList" :key="id" span="6">
                        <span>{{ scheme.sceneName }}</span>
                        <span>费用：</span>
                        <span>{{ scheme.fee }}</span>
                        <span>{{ scheme.currTranslate }}</span>
                    </Col>
                </Row>
            </template>
            <!-- 调度/销售看到的方案基本信息 -->
            <template v-if="distinguishCharacter == 'DIS' || distinguishCharacter == 'SALE'" slot="price">
                <Row>
                    <Col span="5">
                        <span>参考价格:{{ listData.lwstPrice }}-{{ listData.hghtPrice }}/{{ listData.offerCurrTranslate }}</span>
                    </Col>
                    <Col span="5">
                        <span>参考时长:{{ listData.lwstTmeff }}-{{ listData.hghtTmeff }}{{ listData.tmeffUnitTranslate }}</span>
                    </Col>
                    <Col span="4">
                        <span>结算固定汇率:{{ listData.exrt }}</span>
                    </Col>
                    <Col span="5">
                        <span>方案截至时间:{{ listData.endOfTime }}</span>
                    </Col>
                        <span>方案截止前提醒时间:{{ listData.remindTime }}天</span>
                    <Col span="5">
                    </Col>
                </Row>
            </template>
            <template v-if="distinguishCharacter == 'DIS' || distinguishCharacter == 'SALE'" slot="service">
                <Row>
                    <Col span="6" v-for="(service, id) in schemeProxyList" :key="id">
                        <span>代理服务</span>
                        <span class="agency-service">{{ service.sceneName }}</span>
                        <span class="agency-service">{{ service.fee}}{{ service.currTranslate }}</span>
                    </Col>
                </Row>
            </template>
        </AdtSchemeInformationRoute>
        <!-- 产品服务信息 -->
        <p class="title">产品服务信息</p>
        <Card>
            <adt-tab-btns
                :height="40"
                :width="200"
                :isUnderline="true"
                :titleNames="titleNames"
                :btnIndex="changeIndex"
                @handleBtn="handleBtn"
            >
                <Divider />
            </adt-tab-btns>
            <!-- 运输服务 -->
            <div class="collapse">
                <Collapse v-model="value" accordion @on-change="changeFont">
                    <Panel
                    v-for="( serverTransportList, index ) in programData[tabNames[changeIndex - 1]]"
                    :key="index"
                    :name=String(index)>
                        <div
                            v-show="changeIndex == 1"
                            class="collapse-head"
                            @click="clickRoute(changeIndex, serverTransportList)"
                        >
                            <span>{{ serverTransportList.departurePortTranslate }}</span>
                            <svg class="icon" aria-hidden="true">
                                <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                            </svg>
                            <span>{{ serverTransportList.destinationPortTranslate }}</span>
                            <span>{{ changeText }}</span>
                        </div>
                        <div
                            v-show="changeIndex == 2"
                            class="collapse-head"
                            @click="clickRoute(changeIndex, serverTransportList)"
                        >
                            <span>{{ serverTransportList.sttnCodeTranslate }}</span>
                            <span>{{ changeText }}</span>
                        </div>
                        <template>
                            <!-- 客户看到的详情 -->
                            <div v-if="distinguishCharacter == 'ENT'" slot="content">
                                <div :class="['scene-btns', { spread: isSceneSpread }]">
                                    <adt-tab-btns
                                        class="scene-tab"
                                        :titleNames="titleNamesScenesClient"
                                        :isSmallBtn="true"
                                        :btnIndex="changeIndexScenesClient || - 1"
                                        @handleBtn="handleBtnScenesClient"
                                    />
                                    <div class="right-item">
                                        <div class="show-all-scene" @click="isSceneSpread = !isSceneSpread">
                                            {{`${!isSceneSpread ? '展开' : '收起'}所有 >`}}
                                        </div>
                                    </div>
                                </div>
                                <hr size=1 style="border-style:dotted; margin: 10px 0; color: #E5E5E5">
                                <AdtTaskContent
                                    :basicTask="basicTaskClient"
                                    :isShow="false"
                                    :spanNumAdditionalTasks="4"
                                    :additionalTasks="additionalTasksClient"
                                />
                            </div>
                            <!-- 销售/调度看到的详情 -->
                            <div v-if="distinguishCharacter == 'DIS' || distinguishCharacter == 'SALE'" slot="content">
                                <Row>
                                    <!-- 选择服务商 -->
                                    <Col span="8" class="service-provider">
                                        <div class="service-provider-title">
                                            <span class="service-provider-merchant">选择服务商</span>
                                            <!-- <RadioGroup class="service-provider-group" v-model="customs">
                                                <Radio label="export">
                                                    <span>出口报关</span>
                                                </Radio>
                                                <Radio label="import">
                                                    <span>进口口报关</span>
                                                </Radio>
                                            </RadioGroup> -->
                                        </div>
                                        <div class="service-provider-company">
                                            <div v-for="(serviceProvider, id) in serverTransportList.supplierList" :key="id" :class="{'service-select-click': num == id}">
                                                <p class="service-select" @click="selectCompany(index, id, serviceProvider)">
                                                    <span>{{ serviceProvider.enterpriseName }}</span>
                                                    <span class="price">基础价格: {{ serviceProvider.priceTotal }}{{ serviceProvider.currTranslate }}</span>
                                                    <span class="time">时长: {{ serviceProvider.totalTime }}{{ serviceProvider.totalTimeUnitTranslate }}</span>
                                                    <div style="position: absolute;" :class="{'triangle': num == id}"></div>
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                    <!-- 产品编号 -->
                                    <Col v-if="isShow" class="product" span="16">
                                        <div class="product-title">产品编号: {{ serverCode }}</div>
                                        <adt-tab-btns :isSmallBtn="true" :titleNames="titleNamesScenes" :btnIndex="changeIndexScenes" @handleBtn="handleBtnScenes">
                                        </adt-tab-btns>
                                        <hr size=1 style="border-style:dashed; margin: 10px 0; color: #E5E5E5">
                                        <adt-tab-btns
                                            :isBaseBtn="true"
                                            :titleNames="titleNamesTask"
                                            :btnIndex="changeIndexTask"
                                            :width="200"
                                            :height="30"
                                            @handleBtn="handleBtnTask"
                                            style="justify-content: flex-start"
                                        />
                                        <div v-show="changeIndexScenes - 1 == id" v-for="(scence, id) in sceneList" :key="id">
                                            <!-- 任务 -->
                                            <div v-if="changeIndexTask == 1">
                                                <AdtTaskContent class="spacing" :basicTask="basicTask" :basicTaskData="basicTaskData" :additionalTasks="additionalTasks" />
                                            </div>
                                            <!-- 监控设置 -->
                                            <div v-if="changeIndexTask == 2">
                                                <div class="spacing">监控:</div>
                                                <div class="monitor">
                                                    <div class="monitor-abnormal">
                                                        <Row>
                                                            <Col span="4">异常1</Col>
                                                            <Col span="6">异常通知方式：{{}}</Col>
                                                            <Col span="14">异常通知内容：{{}}</Col>
                                                        </Row>
                                                    </div>
                                                    <div class="monitor-notice">
                                                        <span>异常通知企业：</span>
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
                                                        <span>异常通知企业：</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- 协同协作设置 -->
                                            <div v-if="changeIndexTask == 3">
                                                <div>
                                                    <div class="spacing">协同协作1:</div>
                                                    <div class="cooperation">
                                                        <div class="cooperation-notice">
                                                            <span>协同协作方：</span>
                                                        </div>
                                                        <Row class="cooperation-description">
                                                            <Col span="8">协同协作方式：{{1122}}</Col>
                                                            <Col span="16">协同协作内容：{{3344}}</Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div class="spacing">协同协作2:</div>
                                                    <div class="cooperation">
                                                        <div class="cooperation-notice">
                                                            <span>协同协作方：</span>
                                                        </div>
                                                        <Row class="cooperation-description">
                                                            <Col span="8">协同协作方式：{{1122}}</Col>
                                                            <Col span="16">协同协作内容：{{3344}}</Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </template>
                    </Panel>
                </Collapse>
            </div>
        </Card>
    </div>
</template>

<script>
import addProductContent from '@/mixins/addProductContent'
import AdtSchemeInformationRoute from '@/components/adt-scheme-information-route/Index'
import AdtTaskContent from '@/components/adt-task-content/Index'
import {
    apiGetSchemeDetails,
    apiGetSceneQueryList,
    apiGetSceneCstm
} from '@/api/logistics'
export default {
    mixins: [addProductContent],
    components: {
        AdtTaskContent,
        AdtSchemeInformationRoute
    },
    props: {
        logisticsData: {}
    },
    data() {
        return {
            tabNames: ['serverTransportList', 'serverStationList', 'serverCustomsList', 'serverBondList'],
            isShow: false,
            programData: {},
            // 代理服务
            schemeProxyList: [],
            getDetailsData: {},
            logistics: [],
            value: '',
            listData: {},
            distinguishCharacter: '',
            changeText: '展开',
            changeIndex: 1,
            titleNames: ['运输服务', '场所服务'],
            // titleNames: ['运输服务', '场所服务', '关务服务', '综保区服务'],
            sceneListClient: [],
            basicTaskClient: [],
            additionalTasksClient: [],
            basicTaskDataClient: {},
            // 场景数据
            sceneList: [],
            // 产品编号
            serverCode: '',
            titleNamesScenesClient: [],
            changeIndexScenesClient: 1,
            titleNamesScenes: [],
            transportServiceProvider: [],  // 运输展示的服务商
            placeServiceProvider: [], // 场所展示的服务商
            customsServiceProvider: [], // 关务服务展示的服务商
            bondServiceProvider: [], // 综保区展示的服务商
            checkAllGroup: [],
            num: '默认值',
            changeIndexScenes: 1,
            titleNamesTask: ['任务', '监控设置', '协同协作设置'],
            changeIndexTask: 1,
            basicTask: [],
            basicTaskData: {},
            additionalTasks: [],
            distinguishRole: ''
        }
    },
    mounted() {
        // 取本地的账号角色信息 调度：DIS，销售：SALE，客户：ENT，
        this.distinguishCharacter = this.$getUserInfo().roleType
        // 获取列表中存储在本地sessionStorage的数据
        this.listData = JSON.parse(window.sessionStorage.getItem('logisticsData')) || {}
        this.logistics = this.listData.routeLists || []
        this.getData ()
    },
    methods: {
        // 获取服务信息
        getData () {
            const data = {
                freightReqCode: this.listData.freightReqCode,
                logisticsSchemeCode: this.listData.logisticsSchemeCode,
                routeCode: this.listData.routeCode,
                stepId: this.listData.stepId
            }
            apiGetSchemeDetails({ data: data }).then( res => {
                if (res.code == 200) {
                    this.getDetailsData = res.data
                    const arr = res.data.schemeProxyList || []
                    const arr2 = []
                    arr.forEach(item => {
                        if (item.checked == 'true') {
                            arr2.push(item)
                        }
                    })
                    this.schemeProxyList = arr2
                    this.combinedData(this.getDetailsData)
                }
            })
        },
        // 获取客户的服务信息
        getSceneCstm (data) {
            if (this.distinguishCharacter == 'ENT') {
                apiGetSceneCstm({ data: data }).then( res => {
                    this.sceneListClient = res.data || []
                    // 重置场景名称
                    this.titleNamesScenesClient = []
                    this.sceneListClient.forEach(item => {
                        this.titleNamesScenesClient.push(item.sceneName)
                    })
                    this.scenesDataHandleClient(this.sceneListClient)
                })
            }
        },
        // 动态添加场景及里面的内容
        scenesDataHandleClient (data) {
            const scenesTransition = data[Number(this.changeIndexScenesClient) - 1] || {}
            this.basicTaskDataClient = {
                serverDuration: scenesTransition.serverDuration,
                serverDurationUnit: scenesTransition.serverDurationUnit,
                taskCost: scenesTransition.taskCost,
                currTranslate: scenesTransition.currTranslate,
            }
            this.basicTaskClient = scenesTransition.taskRes.taskBaseList || []
            this.additionalTasksClient = scenesTransition.taskRes.taskAffixList || []
        },
        // 切换服务类型
        clickRoute (index, data) {
            const dataList = []
            data.supplierList.forEach(element => {
                dataList.push({serverCode: element.serverCode, serviceType: element.serviceType})
            })
            this.getSceneCstm(dataList)
        },
        // 处理数据
        combinedData (data) {
            // 判断数据赋值时不能为null
            data.serverTransportList = data.serverTransportList || []
            data.serverStationList = data.serverStationList || []
            data.serverCustomsList = data.serverCustomsList || []
            data.serverBondList = data.serverBondList || []
            // 将运输服务路段/场所服务场景/关务服务区域/综保区提取出来
            const transportList = []
            const stationList = []
            const customsList = []
            const bondList = []
            // 将服务商状态为选择（checked: true）提取出来
            this.extractServer(data.serverTransportList, transportList, 'departurePortTranslate', 'destinationPortTranslate')
            this.extractServer(data.serverStationList, stationList, 'sttnCodeTranslate')
            this.extractServer(data.serverCustomsList, customsList, 'customsCode')
            this.extractServer(data.serverBondList, bondList, 'seboCode')
            // 将服务数据加在listData里面 // 数据深拷贝
            this.listData.serverTransportList = JSON.parse(JSON.stringify(transportList))
            this.listData.serverStationList = JSON.parse(JSON.stringify(stationList))
            this.listData.serverCustomsList = JSON.parse(JSON.stringify(customsList))
            this.listData.serverBondList = JSON.parse(JSON.stringify(bondList))
            // 将供应商的数据加在服务里
            this.addSupplier('serverTransportList', data)
            this.addSupplier('serverStationList', data)
            this.addSupplier('serverCustomsList', data)
            this.addSupplier('serverBondList', data)
            this.programData = {...this.listData}
        },
        // 将服务商的名字提出来并将状态为false的删除
        extractServer (list, arr, val, value) {
            list.forEach(item => {
                arr.push({ [val]: item[0][val], [value]: item[0][value] })
                // 将服务商状态为选择（checked: true）提取出来
                for (let index = 0; index < item.length; index++) {
                    if (item[index].checked == 'false') {
                        item.splice(index--, 1)
                    }
                }
            })
        },
        // 将供应商的数据加在服务里
        addSupplier (val, data) {
            this.listData[val].forEach((item, index) => {
                item.supplierList = data[val][index]
            })
        },
        // 折叠面板展开/收起切换
        changeFont (index) {
           if (this.isShow == true) {
                this.isShow = false
            }
            if (this.changeText == '展开') {
                this.changeText = '收起'
            } else {
                this.changeText = '展开'
            }
        },
        handleBtn (index) {
            this.changeIndex = index + 1
            this.value = []
            this.changeText = '展开'
            // 客户详时重置场景数据
            this.titleNamesScenesClient = []
            this.getData()
        },
        handleBtnScenesClient (index) {
            this.changeIndexScenesClient = index + 1
            this.scenesDataHandleClient(this.sceneListClient)
        },
        handleBtnScenes (index) {
            this.changeIndexScenes = index + 1
            // 场景切换的时候重新从后台拿数据
            this.scenesDataHandle(this.sceneList)
        },
        handleBtnTask (index) {
            this.changeIndexTask = index + 1
        },
        selectCompany (index, id, val) {
            this.num = id
            this.serverCode = val.serverCode
            const data = {
                "serverCode": val.serverCode,
                "serviceType": val.serviceType
            }
            apiGetSceneQueryList({ data: data }).then(res => {
                if (res.code == 200) {
                    if (res.data.length) {
                        this.isShow = true
                        this.sceneList = res.data || []
                        this.scenesDataHandle(this.sceneList)
                         // 组装数据，获取到场景数据后，调用方法，将数据添加到对应的位置
                        if (this.changeIndex == 1) {
                            this.programData.serverTransportList[index].supplierList[id].sceneList = this.sceneList
                        }
                        if (this.changeIndex == 2) {
                            this.programData.serverStationList[index].supplierList[id].sceneList = this.sceneList
                        }
                        if (this.changeIndex == 3) {
                            this.programData.serverCustomsList[index].supplierList[id].sceneList = this.sceneList
                        }
                        if (this.changeIndex == 4) {
                            this.programData.serverBondList[index].supplierList[id].sceneList = this.sceneList
                        }
                    } else {
                        this.isShow = false
                    }
                } else {
                    this.isShow = false
                }
            })
        },
        scenesDataHandle (data) {
            const arr = []
            const scenesTransition = data[Number(this.changeIndexScenes) - 1] || {}
            data.forEach((item,index) => {
                arr.push(item.sceneName)
            });
            this.titleNamesScenes = arr
            this.basicTaskData = {
                serverDuration: scenesTransition.serverDuration,
                serverDurationUnitTranslate: scenesTransition.serverDurationUnitTranslate,
                taskCost: scenesTransition.taskCost,
                currTranslate: scenesTransition.currTranslate,
            }
            this.basicTask = scenesTransition.taskRes.taskBaseList || []
            this.additionalTasks = scenesTransition.taskRes.taskAffixList || []
        }
    },
}
</script>

<style lang="scss" scoped>
.ivu-divider-horizontal{
    margin: 10px 0;
}
.agency-service{
    padding-left: 20px;
}
.title{
    font-size: $font-size-base;
    font-weight: bold;
    padding: 20px 0 10px 20px;
}
/* 修改记录公共样式 */
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
                    padding-left: 20px;
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
        .service-provider-merchant  {
            font-size: $font-size-large;
            font-weight: bold;
            color: $main-font-color;
        }
        .service-provider-group {
            float: right;
            font-weight: bold;
            margin-right: 30px;
            margin-top: 3px;
            cursor: pointer;
        }
    }
    .service-provider-company{
        margin: 10px 30px 0 0;
        padding: 10px 0 10px 20px;
        background-color: white;
        p {
            display: inline-block;
            padding: 5px 0 5px 10px;
            cursor: pointer;
        }
        .service-select {
            width: 95%;
            .price {
                margin-left: 10px;
            }
            .time {
                margin-left: 20px;
            }
            &:hover {
                background-color: $filling-color;
            }
        }
        .service-select-click {
            width: 95%;
            background-color: $filling-color;
        }
        .triangle {
            display: inline-block;
            right: 30px;
            margin-top: 10px;
            width: 0; 
            height: 0;
            border-width: 5px;
            border-style: solid;
            border-color: $light-color transparent transparent transparent;
            transform: rotate(270deg)
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
            padding: 3px;
            color: $main-font-color;
            border: 1px solid $placeholder-font-color;
            border-radius: 5px;
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
// 通用间距顶部和底部10px
.spacing {
    margin: 10px 0;
}
// 协同协作
.cooperation {
    padding: 0 20px;
    background-color: white;
    .cooperation-notice {
        padding: 10px 0;
        border-bottom: 1px dashed  $border-color;
        .cooperation-notice-people{
            padding: 3px;
            color: $main-font-color;
            border: 1px solid $placeholder-font-color;
            border-radius: 5px;
        }
        .cooperation-company {
            padding: 10px 50px;
        }
    }
    .cooperation-description {
        padding: 10px 0;
    }
}
.scene-btns {
    display: flex;
    justify-content: space-between;;
    height: 38px;
    margin-bottom: 10px;
    border-bottom: 1px dashed $border-color;
    overflow: hidden;
    &.spread {
        height: auto;
    }
    /deep/ .small-btn .tabBtn {
        margin: 0 12px 12px 12px;
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
.scene-tab {
    display: flex;
    justify-content: space-between;
}
</style>