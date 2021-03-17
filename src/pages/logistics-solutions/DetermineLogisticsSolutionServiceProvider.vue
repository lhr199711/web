<template>
    <div>
        <!-- 方案基本信息 -->
        <div class="title">方案基本信息</div>
        <AdtSchemeInformationRoute :logistics="logistics">
            <!-- 客户看到的方案基本信息 -->
            <template slot="price">
                <Row>
                    <Col span="5">
                        <span>参考价格:{{ programData.hghtPrice }}{{ programData.offerCurrTranslate }}</span>
                    </Col>
                    <Col span="5">
                        <span>参考时长:{{ programData.hghtTmeff }}{{ programData.tmeffUnitTranslate }}</span>
                    </Col>
                    <Col span="4">
                        <span>结算固定汇率:{{ programData.exrt }}</span>
                    </Col>
                    <Col span="5">
                        <span>方案截至时间:{{ programData.endOfTime }}</span>
                    </Col>
                    <Col span="5">
                        <span>方案截止前提醒时间:{{ programData.remindTime }}天</span>
                    </Col>
                    <!-- <Col span="4">
                        <span>集装箱尺寸类型</span>
                    </Col>
                    <Col span="3">
                        <span>集装箱来源</span>
                    </Col> -->
                </Row>
            </template>
            <template slot="service">
                <Row>
                    <Col span="6" v-for="(scheme, id) in schemeProxyList" :key="id">
                        <span>{{ scheme.sceneName }}</span>
                        <span>费用：</span>
                        <span>{{ scheme.fee }}</span>
                        <span>{{ scheme.currTranslate }}</span>
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
                :isMark="isMark"
                :titleNames="titleNames"
                :btnIndex="changeIndex"
                @handleBtn="handleBtn"
            >
                <Divider />
            </adt-tab-btns>
            <Button class="step-save" @click="saveServiceProvider">保存</Button>
            <!-- 运输服务 -->
            <div class="collapse">
                <Collapse v-model="value" accordion @on-change="changeFont">
                    <Panel
                        v-for="( serverTransportList, index ) in programData[tabNames[changeIndex - 1]]"
                        :key="index"
                        :name=String(index)
                    >
                        <div class="collapse-head" v-if="changeIndex == 1">
                            <span>{{ serverTransportList.departurePortTranslate }}</span>
                            <svg class="icon" aria-hidden="true">
                                <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                            </svg>
                            <span>{{ serverTransportList.destinationPortTranslate }}</span>
                            <span>{{ changeText }}</span>
                        </div>
                        <div class="collapse-head" v-if="changeIndex == 2">
                            <span>{{ serverTransportList.sttnCodeTranslate }}</span>
                            <span>{{ changeText }}</span>
                        </div>
                        <div slot="content" v-show="serverTransportList.supplierList">
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
                                        <RadioGroup
                                            v-model="serverTransportList.checkGroup"
                                            v-for="(serviceProvider, id) in serverTransportList.supplierList"
                                            :key="id"
                                        >
                                            <div @click="selectCompany(index, id, serverTransportList)">
                                                <Radio id="test" :class="{'service-select-click': num == id}" :label="serviceProvider.serverCode">
                                                    <p class="service-select">
                                                        <span>{{ serviceProvider.enterpriseName }}</span>
                                                        <span class="price">基础价格:{{ serviceProvider.priceTotal }}{{ serviceProvider.currTranslate }}</span>
                                                        <span class="time">时长: {{ serviceProvider.totalTime }}{{ serviceProvider.totalTimeUnitTranslate }}</span>
                                                        <div style="position: absolute;" :class="{'triangle': num == id}"></div>
                                                    </p>
                                                </Radio>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </Col>
                                <!-- 产品编号 -->
                                <Col v-if="isShow" class="product" span="16">
                                    <div class="product-title">产品编号: {{ serverCode }}</div>
                                    <adt-tab-btns
                                        :isSmallBtn="true"
                                        :titleNames="titleNamesScenes"
                                        :btnIndex="changeIndexScenes"
                                        @handleBtn="handleBtnScenes"
                                    />
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
                                        <div v-show="changeIndexTask == 1">
                                            <AdtTaskContent
                                                class="spacing"
                                                :basicTask="basicTask"
                                                :additionalTasks="additionalTasks"
                                                :basicTaskData="basicTaskData"
                                            />
                                        </div>
                                        <!-- 监控设置 -->
                                        <div v-show="changeIndexTask == 2">
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
                                                        <span
                                                            class="monitor-notice-people"
                                                            @click="addExceptionNotifier"
                                                        >
                                                            添加异常通知人
                                                        </span>
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
                                                            <span class="cooperation-notice-people" @click="addCollaborators">添加协同协作方</span>
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
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                    </Panel>
                    </Panel>
                    </Panel>
                </Collapse>
            </div>
            <AdtMyModal
                :title="modelTitle"
                :showModal="isModalShow"
                okText="确认"
                cancelText="取消"
                @on-visible-change="isModelShow"
                @on-ok="save()"
                @on-cancel="cancel()"
            >
                <Form
                    class="form"
                    ref="formInline"
                    :model="formItem"
                    :rules="ruleItem"
                    :label-width="100"
                    inline
                    label-colon
                >
                    <FormItem prop="companyName" label="企业名称">
                        <Input type="text" v-model="formItem.companyName" />
                    </FormItem>
                    <FormItem  label="数据对接方式">邮箱</FormItem>
                    <FormItem prop="emailAddress" label="邮箱地址">
                        <Input type="text" v-model="formItem.emailAddress" />
                    </FormItem>
                </Form>
            </AdtMyModal>
        </Card>
    </div>
</template>

<script>
import AdtTaskContent from '@/components/adt-task-content/Index'
import AdtSchemeInformationRoute from '@/components/adt-scheme-information-route/Index'
import validateRules from '@/libs/validateRules'
import {
    apiGetSchemeDetails,
    apiGetSceneQueryList,
    apiRecommendModify,
    apiConfirmOnlyScheme,
    apiGetScheme
} from '@/api/logistics'
export default {
    components: {
        AdtTaskContent,
        AdtSchemeInformationRoute
    },
    props: {
        executoryEntrustCode: '',
        freightReqCode: '',
        logisticsSchemeCode: '',
        routeList: ''
    },
    data() {
        return {
            tabNames: ['serverTransportList', 'serverStationList', 'serverCustomsList', 'serverBondList'],
            isShow: false,
            value: [],
            listData: {},
            programData: {},
            schemeProxyList: [],
            changeText: '展开',
            agencyService: [],
            exchangeRate: '',
            selectTime: '',
            checkAllGroup: Number(),
            customs: '',
            changeIndex: 1,
            isMark: false,
            showServiceProvider: [],  // 展示的服务商
            sceneList: [],
            num: '默认值',
            titleNames: ['运输服务', '场所服务'],
            // titleNames: ['运输服务', '场所服务', '关务服务', '综保区服务'],
            titleNamesScenes: ['场景1', '场景2', '场景3'],
            changeIndexScenes: 1,
            titleNamesTask: ['任务', '监控设置', '协同协作设置'],
            changeIndexTask: 1,
            indeterminate: true,
            checkAll: false,
            logistics: [],
            basicTask: [],
            additionalTasks: [],
            notifyCompany: [],
            // 添加异常通知人/协同协作方区分
            // 1为添加异常通知人，2为添加协同协作方区分
            distinguish: 0,
            modelTitle: '',
            isModalShow: false,
            formInline: {},
            formItem: {},
            ruleItem: {
                companyName: [
                    validateRules.required('企业名称')[0]
                ],
                emailAddress: [
                    validateRules.required('邮箱地址')[0]
                ]
            },
            serverCode: '',
            schemeServerList: [], // 选择的服务商
            routeDataList: []
        }
    },
    mounted() {
        this.getRouteData()
    },
    methods: {
        // 获取路线信息
        getRouteData () {
            const roadList = []
            this.routeDataList = JSON.parse(this.routeList) || []
            this.routeDataList.forEach(item => {
                roadList.push({
                    departurePort: item.departurePort,
                    destinationPort: item.destinationPort,
                    roadCode: item.roadCode,
                })
            })
            const data = {
                freightReqCode: this.freightReqCode,
                logisticsSchemeCode: this.logisticsSchemeCode,
                routeCode: this.routeDataList[0].routeCode,
                routeList: roadList
            }
            apiGetScheme({data: data}).then( res => {
                if (res.code == 200) {
                    this.listData = res.data || {}
                    this.logistics = this.listData.routeLists || []
                    this.getData()
                }
            })
        },
        // 获取服务商、代理商数据
        getData () {
            const data = {
                freightReqCode: this.listData.freightReqCode,
                logisticsSchemeCode: this.listData.logisticsSchemeCode,
                routeCode: this.listData.routeCode,
                stepId: ''
            }
            apiGetSchemeDetails({ data: data }).then( res => {
                if (res.code == 200) {
                    this.getDetailsData = res.data
                    // 将代理服务勾选的展示
                    const arr = res.data.schemeProxyList || []
                    const arr2 = []
                    arr.forEach(item => {
                        if (item.checked == 'true') {
                            arr2.push(item)
                        }
                    })
                    this.schemeProxyList = arr2
                    // 组合数据
                    this.combinedData(this.getDetailsData)
                }
            })
        },
        // 数据组合
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
                item.checkGroup = ''
            })
        },
        handleBtn (index) {
            this.changeIndex = index + 1
            this.value = []
            this.changeText = '展开'
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
            // 阻止冒泡事件
            if (event.target.nodeName !== 'INPUT') return
            const valData = val.supplierList[id]
            this.num = id
            this.serverCode = valData.serverCode
            if (this.changeIndex == 1) {
                if (valData) {
                    this.isMark = true
                }
            }
            const data = {
                "serverCode": valData.serverCode,
                "serviceType": valData.serviceType
            }
            apiGetSceneQueryList({ data: data }).then(res => {
                if (res.code == 200) {
                    if (res.data.length) {
                        this.isShow = true
                        this.sceneList = res.data || []
                        this.sceneList.forEach(element => {
                            element.taskReq = element.taskRes
                            delete element.taskRes
                        })
                        // console.log(this.sceneList)
                        // 获取到场景数据后，调用方法，将数据添加到对应的位置
                        // this.combinedData()
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
                        // console.log(this.checkAllGroup)
                        // console.log(this.programData)
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
            this.basicTask = scenesTransition.taskReq.taskBaseList || []
            this.additionalTasks = scenesTransition.taskReq.taskAffixList || []
            // 组装数据，获取到场景数据后，调用方法，将数据添加到对应的位置
        },
        saveServiceProvider () {
            // 将选中的数据筛选并添加 运输服务
            const serverTransportList = []
            this.programData.serverTransportList.forEach(element => {
                if (element.supplierList) {
                    element.supplierList.forEach(item => {
                        if (item.serverCode == element.checkGroup) {
                            item.checked = 'true'
                            serverTransportList.push(item)
                        }
                    })
                }
            })
            // 将选中的数据筛选并添加 场所服务
            const serverStationList = []
            this.programData.serverStationList.forEach(element => {
                if (element.supplierList) {
                    element.supplierList.forEach(item => {
                        if (item.serverCode == element.checkGroup) {
                            item.checked = 'true'
                            serverStationList.push(item)
                        }
                    })
                }
            })
            // 将选中的数据筛选并添加 关务服务
            const serverCustomsList = []
            this.programData.serverCustomsList.forEach(element => {
                if (element.supplierList) {
                    element.supplierList.forEach(item => {
                        if (item.serverCode == element.checkGroup) {
                            item.checked = 'true'
                            serverCustomsList.push(item)
                        }
                    })
                }
            })
            // 将选中的数据筛选并添加 综保区服务
            const serverBondList = []
            this.programData.serverBondList.forEach(element => {
                if (element.supplierList) {
                    element.supplierList.forEach(item => {
                        if (item.serverCode == element.checkGroup) {
                            item.checked = 'true'
                            serverBondList.push(item)
                        }
                    })
                }
            })
            const data = {
                executoryEntrustCode: this.executoryEntrustCode,
                logisticsSchemeCode: this.programData.logisticsSchemeCode,
                freightReqCode: this.programData.freightReqCode,
                serverAgentList: this.schemeProxyList,
                serverTransportList: serverTransportList,
                serverStationList: serverStationList,
                serverCustomsList: serverCustomsList,
                serverBondList: serverBondList
            }
            apiConfirmOnlyScheme({data: data}).then(res => {
                if (res.code == 200) {
                    this.$Message.info("保存成功")
                    // 确定成功跳转到物流委托列表
                    this.$router.push({path : '/logisstics-commission/one-logistics/1'})
                }
            })
        },
        // 修改展示/收起的文字
        changeFont (val) {
            // console.log(val)
            if (this.isShow == true) {
                this.isShow = false
            }
            if (this.changeText == '展开') {
                this.changeText = '收起'
            } else {
                this.changeText = '展开'
            }
        },
        // 同步新增字典模态框的显示状态
        isModelShow (val) {
            this.isModalShow = val
        },
        // 添加异常通知人
        addExceptionNotifier () {
            this.isModalShow = true
            this.modelTitle = "新增异常处理人"
            this.distinguish = 1
        },
        // 添加协同协作方
        addCollaborators () {
            this.isModalShow = true
            this.modelTitle = "新增协同协作方"
            this.distinguish = 2
        },
        // 添加异常通知人/协同协作方确认
        save () {
            const data = {
                companyName: this.formItem.companyName,
                emailAddress: this.formItem.emailAddress
            }
            this.$refs["formInline"].validate((vaild) => {
                if (vaild) {
                    if (this.distinguish == 1) {
                        // 调用新增异常通知人接口
                        testApi({ data: data }).then(res => {
                            if (res.code == 200) {
                            }
                        })
                    }
                    if (this.distinguish == 2) {
                        // 调用新增异常通处理人接口
                        testApi({ data: data }).then(res => {
                            if (res.code == 200) {
                            }
                        })
                    }
                }
            })
        },
        // 添加异常通知人/协同协作方取消
        cancel () {
            this.$refs.formInline.resetFields()
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
    padding: 20px 0 10px 20px;
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
            padding: 5px 0 5px 10px;
            cursor: pointer;
            display: inline-block;
        }
        /deep/.ivu-radio-wrapper:hover {
            width: 95%;
            background-color: $filling-color;
        }
        .service-select {
            width: 95%;
            .price {
                margin-left: 10px;
            }
            .time {
                margin-left: 20px;
            }
            // &:hover {
            //     background-color: $filling-color;
            // }
        }
        .service-select-click {
            width: 95%;
            background-color: $filling-color;
        }
        .triangle {
            right: -15px;
            margin-top: -20px;
            display: inline-block;
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
            border: 1px solid $placeholder-font-color;
            border-radius: 5px;
            padding: 3px;
            color: $main-font-color;
            cursor: pointer;
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
            cursor: pointer;
        }
        .cooperation-company {
            padding: 10px 50px;
        }
    }
    .cooperation-description {
        padding: 10px 0;
    }
}
// 修改form表单的样式
.form {
    padding: 0 60px;
    /deep/.ivu-form-item .ivu-form-item-label{
        text-align: left;
    }
}
</style>