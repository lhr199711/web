<template>
    <div class="freight-request">
        <adt-btns
            :titleNames="titleTabNames"
            :btnIndex="btnIndex"
            :width="160"
            @handleBtn="goToOtherProductList"
        />
        <adt-search-folder
            :searchRouter="{query: {
                createBy: search.createBy,
                enterpriseCode: search.enterpriseCode,
                freightReqCode: search.freightReqCode,
                freightReqStatus: statusValue,
                saleName: search.saleName
                }
            }"
            :isTitle="false"
            :isStatus="true">
            <template slot="status">
                <div v-if="queryType === '1'" class="status">
                    <div class="status-left">
                        <p><i>*</i> 货运要求状态:</p>
                        <span
                            v-for="(status, id) in auditStatusList"
                            :key="id"
                            :class="{'click-status': auditStatusNum == id}"
                            @click="auditStatus(id, status)"
                        >{{ status.dictionaryValue }}</span>
                    </div>
                </div>
            </template>
            <template slot="always-show">
                <div class="public-transit">
                    <Form :model="search" ref="search" inline label-colon>
                        <Row>
                            <Col span="6">
                                <FormItem label="货运要求编号">
                                    <Input v-model="search.freightReqCode" type="text" />
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="企业名称">
                                    <Input v-model="search.enterpriseCode" type="text" />
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建人">
                                    <Input v-model="search.createBy" type="text" />
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="销售名称">
                                    <Input v-model="search.saleName" type="text" />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <AdtButton>
                <Button @click="addFreight">新建货运要求<Icon type="ios-add-circle-outline" /></Button>
            </AdtButton>
            <adt-paginator :currentPage="~~page" :total="~~total" :size="3"/>
        </div>
        <div class="public-component-line"></div>
        <div class="public-list">
            <Col class="public-component-card public-card-width" span="24" v-for="(product, key) in listData" :key="key">
                <adt-list-item :data="product" :showCheckbox="true" @checkData="checkData">
                    <template slot="tab-title">
                        <span>货运要求编号:{{ product.freightReqCode }}</span>
                    </template>
                    <template slot="tab-operat">
                        <span
                            v-if="product.freightReqStatus"
                            class="card-status-success"
                            :class="{'card-status-error': product.freightReqStatus == '未同意方案','card-status': product.freightReqStatus == '取消货运要求'}"
                        >{{ product.freightReqStatus }}</span>
                        <Poptip placement="right-start" class="card-icon">
                            <span>编辑要求</span>
                            <Icon type="md-arrow-dropdown" />
                            <!-- 接受的要求状态显示 -->
                            <div v-if="queryType === '1'" class="card-poptip-font" slot="content">
                                <!-- <div v-if="product.freightReqStatus === '待调度处理'" @click="edit(product)">编辑要求</div> -->
                                <div  @click="detail(product)">查看详情</div>
                                <div v-if="product.freightReqStatus === '已同意方案'" @click="viewRecommendations(product)">查看推荐方案</div>
                                <div v-if="product.freightReqStatus === '待调度处理'" @click="generateLogisticsSolutions(product)">生成物流方案</div>
                                <div v-if="product.freightReqStatus === '待调度处理'" @click="queryLogisticsSolution(product)">查询物流方案</div>
                                <div v-if="product.freightReqStatus === '调度已反馈方案' || product.freightReqStatus === '已反馈方案'" @click="ViewLogisticsSolution(product)">查看物流方案</div>
                            </div>
                            <!-- 录入的要求的状态显示 -->
                            <div v-else class="card-poptip-font" slot="content">
                                <!-- <div @click="edit(product)">编辑要求</div> -->
                                <div @click="detail(product)">查看详情</div>
                                <div @click="send(product)">发送要求</div>
                                <div @click="queryLogisticsSolution(product)">查询物流方案</div>
                                <div @click="generateLogisticsSolutions(product)">生成物流方案</div>
                                <div @click="ViewLogisticsSolution(product)">查看物流方案</div>
                                <!-- <div @click="delete(product)">删除</div> -->
                            </div>
                        </Poptip>
                    </template>
                    <template slot="tab-content">
                        <div class="public-modify-record data-item tab-content">
                        <div v-if="product.freightRouteList" class="collapse">
                            <Collapse accordion>
                                <Panel name="1">
                                    <Row>
                                        <Col span="22">
                                            <ul>
                                                <li v-for="(item, index) of product.freightRouteList[0].roadList" :key="index">
                                                    <span class="path">{{ item.departurePort }}</span>
                                                    <span class="desc">{{ item.serverParam.logisticsType }}-{{ item.serverParam.trspType }}</span>
                                                    <svg class="iconfont icon-arrows"  aria-hidden="true">
                                                        <use fill="#02ADB5" xlink:href="#icon-andaotongV3ICON_zhi"></use>
                                                    </svg>
                                                    <template v-if="index === product.freightRouteList[0].roadList.length - 1">
                                                        <span class="path last-path">{{ item.destinationPort }}</span>
                                                    </template>
                                                </li>
                                            </ul>
                                            <p class="status">
                                                <Icon v-show="product.freightRouteList[0].matchScheme === '0'" type="ios-information-circle" />
                                                <Icon v-show="product.freightRouteList[0].matchScheme === '1'" type="ios-checkmark-circle" />
                                                {{ product.freightRouteList[0].matchScheme === '0' ? '未匹配到物流方案' : '已匹配到物流方案' }}
                                            </p>
                                        </Col>
                                        <Col span="2" />
                                    </Row>
                                    <div slot="content">
                                        <Row v-show="index!==0" v-for="(itemList, index) of product.freightRouteList" :key="index" class="content-row">
                                            <Col span="22">
                                                <ul>
                                                    <li v-for="(item,key) of itemList.roadList" :key="key">
                                                        <span class="path">{{ item.departurePort }}</span>
                                                        <span class="desc">{{ item.serverParam.logisticsType }}-{{ item.serverParam.trspType }}</span>
                                                        <svg class="iconfont icon-arrows" aria-hidden="true">
                                                            <use fill="#02ADB5" xlink:href="#icon-andaotongV3ICON_zhi"></use>
                                                        </svg>
                                                        <template v-if="key === itemList.roadList.length - 1">
                                                            <span class="path last-path">{{ item.destinationPort }}</span>
                                                        </template>
                                                    </li>
                                                </ul>
                                                <p class="status">
                                                    <Icon v-show="itemList.matchScheme === '0'" type="ios-information-circle" />
                                                    <Icon v-show="itemList.matchScheme === '1'" type="ios-checkmark-circle" />
                                                    {{itemList.matchScheme === '0' ? '未匹配到物流方案' : '已匹配到物流方案'}}
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                    </template>
                    <template slot="tab-bottom">
                        <div class="tab-bottom">
                            <Row>
                                <Col span="6">接收时间：{{ timestampFormat(product.modifyDatetime) }}</Col>
                                <Col span="6">企业名称：{{ product.roleCompanyName }}</Col>
                                <Col span="6">创建人：{{ product.createBy }}</Col>
                                <Col span="6">销售名称：{{ product.saleName }}</Col>
                            </Row>
                        </div>
                    </template>
                </adt-list-item>
            </Col>
        </div>
    </div>
</template>

<script>
    import { apiChangJing } from '@/api/logisticsCommission'
    import { apiDictionaryQueryByCacheTypeKey } from '@/api/dictionary'
    import paginator from '@/mixins/paginator'
    import AdtListItem from '@/components/adt-list-item/Index'
    import homeMixin from '../logistics-commission/mixins/homeMixin'
    import {
        apiDispatchQueryFreight,
        apiSendSale,
        apiGetGenerate
    } from '@/api/freight'
    import { timestampFormat } from '@/libs/utils'
    export default {
        mixins: [paginator,homeMixin],
        components: {
            AdtListItem
        },
        data() {
            return {
                trspType: this.$getDictionary('TRANSPORT_TYPE') || [],
                cargoType: this.$getDictionary('GOODS_TYPE') || [],
                auditStatusList: this.$getDictionary('FREIGHTREQ_STATUS'),
                changeText: '展开',
                btnIndex: 1,
                titleTabNames: ['接收的要求', '录入的要求'],
                dataValue: [],
                search: {
                    freightReqCode: '',
                    saleName: '',
                    // 创建人
                    createBy: '',
                    // 企业名称
                    enterpriseCode: '',
                },
                // 启运地下面的场所的集合
                departurePort: [],
                // 中转地下面的场所的集合
                trsspmPort: [],
                // 目的地下面的场所的集合
                destinationPort: [],
                freightReqParam: {},
                listData: [],
                selectList: {},
                transitLoading: false,
                transitData: [],
                transitSelect: [],
                checkList: [],
                // search: {},
                auditStatusNum: '0',
                statusValue: 'PENDDSPC',
                queryType: '1'
            }
        },
        mounted() {
            // 删除字典里的未发送状态
            this.auditStatusList.forEach((value, index, array) => {
                if (value.dictionaryValue == '未发送') {
                    array.splice(value, 1)
                }
            })
            // 删除字典里的待销售处理状态
            this.auditStatusList.forEach((value, index, array) => {
                if (value.dictionaryValue == '待销售处理') {
                    array.splice(value, 1)
                }
            })
        },
        methods: {
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp)
            },
            //拿到场景的字典
            _handelDir (val, data) {
                return new Promise((reslove, rejact) => {
                    let code = val[val.length - 1]
                    let iscode = val[val.length - 2]
                    if (
                        iscode == '110000000000' ||
                        iscode == '120000000000' ||
                        iscode == '500000000000' ||
                        iscode == '310000000000'
                    ) {
                        code = iscode
                    }
                    apiChangJing({ city: code }).then(({ data }) => {
                        let arr = data[0]
                        let newArr = arr.map(item => {
                            return {
                                value: item.sttnCode,
                                label: item.sttnName
                            }
                        })
                        reslove(newArr)
                    })
                })
            },
            // 拿到启运地的场景字典
            async handelDirStart (data) {
                let arr = await this._handelDir(data.value)
                this.departurePort = arr
            },
            // 拿到中转地的场景字典
            async handelDirTrsspmPort (data) {
                let arr = await this._handelDir(data.value)
                this.trsspmPort = arr
            },
            // 拿到目的地的场景字典
            async handelDirEnd (data) {
                let arr = await this._handelDir(data.value)
                this.destinationPort = arr
            },
            // 编辑，下一版本做
            edit (value) {},
            // 查看详情
            detail (value) {
                if (value.freightReqStatus == null) {
                    // 调度自己录入的显示推荐方案按钮
                    this.$router.push({
                        path: `/freight-request/feedback-detail/${value.freightReqCode}`,
                        query: {
                            sign: 'show'
                        }
                    })
                } else if(value.freightReqStatus == '调度已反馈方案') {
                    this.$router.push({
                        path: `/freight-request/dispatch-to-edit/${value.freightReqCode}`,
                        query: {
                            sign: 'show'
                        }
                    })
                } else {
                    this.$router.push(`/freight-request/dispatch-to-edit/${value.freightReqCode}`)
                }
            },
            // 生成物流方案
            generateLogisticsSolutions (value) {
                var data = value.freightReqCode
                apiGetGenerate( {data} ).then(res=> {
                    if (res.code == '200') {
                        // 刷新页面拿到新的数据
                        this.getData()
                        let dataCode = {}
                        setTimeout(() => {
                            this.listData.forEach(element => {
                                if(data == element.freightReqCode){
                                    dataCode = element
                                }
                            })
                            window.localStorage.setItem('freightData', JSON.stringify(dataCode))
                            this.$router.push({
                                path: `/logistics-solutions/customer-service-plan/1`,
                                query: {
                                    sign: 'generate'
                                }
                            })
                        }, 2000)
                    } else {
                        this.$Message.info(res.message)
                    }
                })
            },
            // 查看物流方案
            ViewLogisticsSolution (value) {
                window.localStorage.setItem('freightData', JSON.stringify(value))
                this.$router.push({
                    path: `/logistics-solutions/customer-service-plan/1`,
                    query: {
                        sign: 'viewLogisticsSolution'
                    }
                })
            },
            // 查看推荐方案
            viewRecommendations (value) {
                window.localStorage.setItem('freightData', JSON.stringify(value))
                this.$router.push({
                    path: `/logistics-solutions/customer-service-plan/1`,
                    query: {
                        sign: 'viewRecommendations'
                    }
                })
            },
            // 查询物流方案
            queryLogisticsSolution (value) {
                window.localStorage.setItem('freightData', JSON.stringify(value))
                this.$router.push({
                    path: `/logistics-solutions/customer-service-plan/1`,
                    query: {
                        sign: 'queryLogisticsSolution'
                    }
                })
            },
            // 新建货运要求
            addFreight () {
                this.$router.push(`/freight-request/dispatch-entry`)
            },
            // 折叠面板切换
            checkData (data, status) {
                if(data && status) {
                    this.checkList.push(data)
                } else if (data && !status) {
                    this.checkList.splice(this.checkList.indexOf(data), 1)
                }
                // 选中的数据
                this.selectList = {
                    params: this.checkList
                }
            },
            // 点击货运要求状态
            auditStatus (index, status) {
                // 控制状态切换传值
                this.auditStatusNum = index
                // 拿到选中的状态，传入查询接口中
                this.statusValue = status.dictionaryKey
            },
            // 点击查询调用查询的接口
            dataInit () {
                this.getData()
            },
            // 初始化数据
            getData () {
                const data = {
                    size: 3,
                    page: this.page,
                    freightReqStatus: this.statusValue,
                    ...this.search,
                    queryType: this.queryType
                }
                apiDispatchQueryFreight({ data }).then(res => {
                    if (res.data == null) {
                        this.listData = []
                        this.total = 0
                        return false
                    }
                    this.listData = res.data.content
                    this.total = res.data.totalElements
                })
            },
            // 发送
            send (value) {
                const data = {
                    freightReqCode: value.freightReqCode,
                    freightReqStatus: value.freightReqStatus
                }
                apiSendSale({ data }).then(res => {
                    this.$Message.info(res.message)
                    this.getData()
                })
            },
            // 接受录入的要求
            goToOtherProductList (index) {
                this.btnIndex = index+1
                switch (index) {
                    case 0:
                        this.queryType = '1'
                        this.statusValue = 'PENDSALE'
                        this.getData()
                        break
                    case 1:
                        this.statusValue = ''
                        this.queryType = '0'
                        this.getData()
                        break
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .icon-arrows {
        font-size: 18px;
        vertical-align: text-top;
    }
    /deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
        height: 52px;
        line-height: 52px;
    }
    .status-left {
        i {
            color: $error-color;
            vertical-align: middle;
        }
    }
    .card-poptip-font {
        div:hover {
            background: #eee;
        }
    }
    .content-row {
        line-height: 40px;
    }
    .tab-content {
        .collapse {
            padding: 0;
            .ivu-col-span-2 {
                text-align: right;
                padding-right: 30px;
            }
            ul {
                display: inline-block;
                overflow-x: auto;
                width: 85%;
                white-space: nowrap;
                li {
                    display: inline-block;
                    vertical-align: middle;
                    .path {
                        padding-left: 8px;
                        vertical-align: middle;
                    }
                    .desc {
                        font-size: 12px;
                        color: $light-color;
                        padding: 0 8px;
                        vertical-align: middle;
                    }
                    i {
                        color: $light-color;
                    }
                    &:first-child {
                        .path {
                            font-size: 20px;
                            font-weight: 400;
                        }
                    }
                    &:last-of-type {
                        .last-path {
                                font-size: 20px;
                                font-weight: 400;
                            }
                    }
                }
            }
            .status {
                display: inline-block;
                float: right;
                color: $light-color;
                font-size: 12px;
                vertical-align: middle;
                .ivu-icon{
                    font-size: 16px;
                }
            }
            /deep/ .ivu-collapse-content {
                width: 100%;
                padding: 0;
                padding-left: 25px;
            }
        }
    }
    .tab-bottom {
        .ivu-col-span-24 {
            font-size: 13px;
        }
    }
    .public-card-width {
        width: 100% !important;
    }
    span {
        width: 120px;
        line-height: 30px;
    }
    .search-condition {
        margin-right: 30px;
        span {
            width: 200px !important;
        }
    }
    .min-width {
        span {
            width: 60px !important;
        }
        .ivu-input-wrapper {
            width: 60%;
        }
    }
    .ivu-modal-body {
        .search-condition {
            span {
                width: 180px !important;
            }
        }
    }
    .line {
        border:0.5px dashed $border-color;
        margin: 20px 0;
    }
    .search-condition {
        display: flex;
    }
    .modal-code {
        font-size: 14px;
        font-weight: 400;
        span {
            margin-left: 10px;
        }
    }
    .line-margin {
        margin-left: 30px;
    }
    .modal-css {
        margin-left: 0;
    }
    .icon-action {
        margin: 0 4px;
    }
</style>
