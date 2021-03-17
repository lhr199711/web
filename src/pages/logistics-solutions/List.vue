<template>
    <div>
        <adt-search-folder
            :searchRouter="{ query: search }"
            :isStatus="false"
        >
            <template slot="always-show">
                <div class="public-search-input-jz">
                <Form ref="formSearchInline" :model="search" :rules="ruleSearchInline" inline>
                    <Row :gutter="20" class="publc-bottom20" style="margin-bottom: 5px; padding-left: 10px;">
                        <!-- 启运地 -->
                        <Col span="8">
                            <Col span="12">
                                <FormItem label="启运地:" prop="dispatchCity" style="margin-top: -20px;">
                                    <adt-city-selector :defaultData="search.dispatchCity" @on-change="changeDispatchCity" />
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <span style="padding-left: 5px;">选择场所:</span>
                                <Select v-model="search.dispatchSite" clearable>
                                    <Option v-for="(option, index) in dispatchOptions" :key="index" :value="option.value">
                                        {{ option.label }}
                                    </Option>
                                </Select>
                            </Col>
                        </Col>
                        <!-- 目的地 -->
                        <Col span="8" offset="1" style="padding-left: 20px;">
                            <Col span="12">
                                <FormItem label="目的地:" prop="destinationCity" style="margin-top: -20px; margin-left: -7px;">
                                    <adt-city-selector :defaultData="search.destinationCity" @on-change="changeDestinationCity" />
                                </FormItem>
                            </Col?
                            <Col span="12">
                                <span>选择场所:</span>
                                <Select v-model="search.destinationSite" clearable>
                                    <Option v-for="(option, index) in destinationOptions" :key="index" :value="option.value">
                                        {{ option.label }}
                                    </Option>
                                </Select>
                            </Col>
                        </Col>
                        <!-- 时长 -->
                        <Col span="6" offset="1">
                            <Col span="16">
                                <span style="padding-left: 26px;">时长:</span>
                                <Input v-model="search.schemeValidity" clearable />
                            </Col>
                            <span style="padding-left: 5px;">天</span>
                        </Col>
                    </Row>
                    <Row class="publc-bottom20" :gutter="20">
                        <!-- 运输类型 -->
                        <Col span="8">
                            <Col span="12">
                                <span style="padding-left: 7px;">运输类型:</span>
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
                        </Col>
                        <!-- 运输方式 -->
                        <Col span="8" offset="1">
                            <Col span="12">
                                <span style="padding-left: 5px;">运输方式:</span>
                                <Select v-model="search.trspMode" class="fromItem-content" clearable>
                                    <Option
                                        v-for="(selectData, id) in dictionaryTransportMode"
                                        :key="id"
                                        :value="selectData.dictionaryKey"
                                    >
                                        {{selectData.dictionaryValue}}
                                    </Option>
                                </Select>
                            </Col>
                        </Col>
                        <!-- 货物类型 -->
                        <Col span="6" offset="1">
                            <Col span="16">
                                <span style="text-align: right;">货物类型:</span>
                                <Select v-model="search.cargoType" class="fromItem-content" clearable>
                                    <Option
                                        v-for="(selectData, id) in dictionaryGoodsType"
                                        :key="id"
                                        :value="selectData.dictionaryKey"
                                    >
                                        {{ selectData.dictionaryValue }}
                                    </Option>
                                </Select>
                            </Col>
                        </Col>
                    </Row>
                    <Row class="publc-bottom20" :gutter="20">
                    <!-- 集装箱尺寸 -->
                        <Col span="8">
                            <Col span="12">
                                <span style="padding-right: 4px;">集装箱尺寸:</span>
                                <Input v-model="search.contaSizeType" clearable />
                            </Col>
                        </Col>
                        <!-- 集装箱来源 -->
                        <Col span="8" offset="1">
                            <Col span="12">
                                <span style="padding-right: 2px;">集装箱来源:</span>
                                <Select v-model="search.contaSource" class="fromItem-content" clearable>
                                    <Option
                                        v-for="(selectData, id) in dictionaryContaSource"
                                        :key="id"
                                        :value="selectData.dictionaryKey"
                                    >
                                        {{ selectData.dictionaryValue }}
                                    </Option>
                                </Select>
                            </Col>
                        </Col>
                    </Row>
                </Form>
                </div>
            </template>
        </adt-search-folder>
        <div class="btn-pagina">
            <div class="btn-tabs" >
                <AdtButton>
                    <Button @click="addFreightDemand()">新增货运需求
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#icon-xiangbao"></use>
                        </svg>
                    </Button>
                </AdtButton>
            </div>
            <adt-paginator class="pagination" :currentPage="~~page" :total="~~total" :size="6" />
        </div>
        <div class="public-component-line"></div>
        <div class="public-list">
            <div v-for="(logistics, id) in listData" :key="id" class="public-component-card">
                <AdtListItem
                    :logistics="logistics"
                    :showCheckbox="isCheckbox"
                    :resetCheckStatus="resetCheckStatus"
                >
                    <template slot="tab-title">
                        <span>物流方案编号:{{ logistics.logisticsSchemeCode }}</span>
                    </template>
                    <template slot="tab-operat">
                        <span
                            v-if="distinguishCharacter === 'DIS'"
                            :class="{'card-status-success': logistics.statusCode === 'disagree', 'card-status-error': logistics.statusCode === 'refuse', 'card-status': logistics.statusCode === 'agree' }"
                        >
                            {{ logistics.status }}
                        </span>
                        <Poptip placement="right-start" class="card-icon">
                            <span>查看详情</span>
                            <Icon type="md-arrow-dropdown" />
                            <!-- 客户的操作 -->
                            <div v-if="distinguishCharacter === 'ENT'" class="card-poptip-font" slot="content">
                                <div @click="detail(logistics)">查看详情</div>
                                <!-- <div @click="delegate(logistics)">发起委托</div> -->
                                <!-- <div @click="collect(logistics)" class="failure">收藏</div> -->
                                <!-- <div @click="uncollect(logistics)" class="failure">取消收藏</div> -->
                            </div>
                            <!-- 销售的操作 -->
                            <div v-if="distinguishCharacter === 'SALE'" class="card-poptip-font" slot="content">
                                <div @click="detail(logistics)">查看详情</div>
                                <!-- <div @click="delegate(logistics)" v-if="btnIndex === 0">发起委托</div> -->
                                <!-- <div @click="recommend(logistics)">推荐客户</div> -->
                                <!-- <div @click="collect(logistics)" class="failure">收藏</div> -->
                            </div>
                            <!-- 调度的操作 -->
                            <div v-if="distinguishCharacter === 'DIS'" class="card-poptip-font" slot="content">
                                <!-- <div @click="edit(logistics)">编辑方案</div> -->
                                <!-- <div @click="edit(logistics)">确定方案</div>
                                <div @click="recommend(logistics)">推荐销售</div> -->
                                <!-- <div @click="confirm(logistics)">确认方案</div> -->
                                <div @click="detail(logistics)">查看详情</div>
                            </div>
                        </Poptip>
                    </template>
                    <template slot="tab-content">
                        <div class="card-route">
                            <div v-for="(location, index) in logistics.routeLists" :key="index" class="card-content">
                                <span class="card-outset">{{ location.departurePortTranslate }}</span>
                                <div class="card-transit">
                                    <div class="card-way">
                                        <svg :class="['iconfont', { car: location.trspModeTranslate === '公路' }]" aria-hidden="true">
                                            <use v-if="location.trspModeTranslate === '铁运'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_huoche"></use>
                                            <use v-if="location.trspModeTranslate === '公路'" fill="#FFBB32" xlink:href="#icon-huoche"></use>
                                            <use v-if="location.trspModeTranslate === '水运'" fill="#FFBB32" xlink:href="#icon-andaotongcaidanICON_lunchuan"></use>
                                            <use v-if="location.trspModeTranslate === '空运'" fill="#FFBB32"
                                            xlink:href="#icon-feiji800"></use>
                                        </svg>
                                    </div>
                                    <div class="card-line">
                                        <svg class="icon" aria-hidden="true">
                                            <use fill="#02ADB5" xlink:href="#icon-andaotongcaidanICON_jiantou3"></use>
                                        </svg>
                                    </div>
                                    <div class="card-genre">{{ location.logisticsTypeTranslate }}{{ location.trspTypeTranslate }}</div>
                                </div>
                                <template v-if="index === logistics.routeLists.length - 1">
                                    <span class="card-address">{{ location.destinationPortTranslate }}</span>
                                </template>
                            </div>
                        </div>
                    </template>
                    <template slot="tab-bottom">
                        <!-- 客户看到的最高时效/价格 -->
                        <div class="card-bottom" v-if="distinguishCharacter === 'ENT'">
                            <span>时效: {{ logistics.hghtTmeff }}{{ logistics.tmeffUnitTranslate }}</span>
                            <span></span>
                            <span class="card-right">
                                <span>价格:</span>
                                <span class="card-right-size">{{ logistics.lwstPrice }}</span>
                                <span>/{{ logistics.offerCurrTranslate }}</span>
                            </span>
                        </div>
                        <!-- 调度/销售看到的时效段/价格区间 -->
                        <div class="card-bottom"  v-if="distinguishCharacter === 'SALE' || distinguishCharacter === 'DIS'">
                            <span>时效: {{ logistics.lwstTmeff }}-{{ logistics.hghtTmeff }}{{ logistics.tmeffUnitTranslate }}</span>
                            <span></span>
                            <span class="card-right">
                                <span>价格:</span>
                                <span class="card-right-size">{{ logistics.lwstPrice }}-{{ logistics.hghtPrice }}</span>
                                <span>/{{ logistics.offerCurrTranslate }}</span>
                            </span>
                        </div>
                    </template>
                </AdtListItem>
            </div>
        </div>
    </div>
</template>

<script>
    import productList from '@/mixins/productList'
    import AdtListItem from '@/components/adt-list-item/Index'
    import validateRules from '@/libs/validateRules'
    import { apiGetSchemeList } from '@/api/logistics'
    export default {
        mixins: [productList],
        components: {
            AdtListItem
        },
        props: {
            dispatchCity: '',
            dispatchSite: '',
            destinationCity: '',
            destinationSite: '',
            trspMode: '',
            trspType: '',
            cargoType: '',
            schemeValidity: '',
            contaSource: '',
            contaSizeType: ''
        },
        data() {
            return {
                // 运输类型
                dictionaryTransportType: this.$getDictionary('TRANSPORT_TYPE') || [],
                // 运输方式
                dictionaryTransportMode: this.$getDictionary('TRANSPORT_MODE') || [],
                // 货物类型
                dictionaryGoodsType: this.$getDictionary('GOODS_TYPE') || [],
                // 集装箱来源
                dictionaryContaSource: this.$getDictionary('CONTAINER_SOURCE') || [],
                // 查询条件
                search: {
                    dispatchCity: this.dispatchCity,
                    dispatchSite: this.dispatchSite,
                    destinationCity: this.destinationCity,
                    destinationSite: this.destinationSite,
                    trspMode: this.trspMode,
                    trspType: this.trspType,
                    cargoType: this.cargoType,
                    schemeValidity: this.schemeValidity,
                    contaSource: this.contaSource,
                    contaSizeType: this.contaSizeType
                },
                // 必填校验
                ruleSearchInline: {
                    dispatchCity: [validateRules.required('启运地')[0]],
                    destinationCity: [validateRules.required('目的地')[0]],
                },
                resetCheckStatus: false,
                // 角色类型
                distinguishCharacter: '',
                // 是否展示复选框
                isCheckbox: false,
                // 方案路线
                listData: [],
                // 启运地
                dispatchOptions: [],
                // 目的地
                destinationOptions: []
            }
        },
        async created () {
            // 根据默认的城市获取场所
            if (this.search.dispatchCity) {
                this.dispatchOptions = await this._handelDir(this.search.dispatchCity.split('~'))
            }
            if (this.search.destinationCity) {
                this.destinationOptions = await this._handelDir(this.search.destinationCity.split('~'))
            }
        },
        mounted () {
            // 取本地的账号角色信息 调度：DIS，销售：SALE，客户：ENT，
            this.distinguishCharacter = this.$getUserInfo().roleType
            // this.distinguishCharacter = 'DIS'
            // this.distinguishCharacter = 'ENT'
            // 调度的tabs切换name
            if (this.distinguishCharacter === 'DIS') {
                this.isCheckbox = true
            }
        },
        methods: {
            // 获取列表数据
            getData () {
                let departurePortString = ""
                let destinationPortString = ""
                // 将国家省份城市的'~'连接改为';'连接
                // 暂时放在这里，这种数据处理是正确的，只是数据库现在不支持
                // if(this.dispatchCity) {
                //     departurePortString = this.dispatchCity.replace(/~/g,";")
                // }
                // if (this.destinationCity) {
                //     destinationPortString = this.destinationCity.replace(/~/g,";")
                // }
                // // 将场所拼接到国家省份城市后面
                // if (this.dispatchSite) {
                //     let arr = [departurePortString, this.dispatchSite]
                //     departurePortString = arr.join(';')
                // }
                // if (this.destinationSite) {
                //     let arr = [destinationPortString, this.destinationSite]
                //     destinationPortString = arr.join(';')
                // }
                //
                // 如果选择启运地没选择场所则只留下城市，选择了场所则留下场所
                if (this.dispatchCity) {
                    // 截取启运地，只留下城市
                    let addressList = this.dispatchCity.split('~')
                    departurePortString = addressList[addressList.length - 1]
                    // departurePortString = (this.dispatchCity.match(/~(\S*)/)[1]).match(/~(\S*)/)[1]
                    if (this.dispatchSite) {
                        departurePortString = this.dispatchSite
                    }
                }
                if (this.destinationCity) {
                    let addressArr = this.destinationCity.split('~')
                    destinationPortString = addressArr[addressArr.length - 1]
                    // destinationPortString = (this.destinationCity.match(/~(\S*)/)[1]).match(/~(\S*)/)[1]
                    if (this.destinationSite) {
                        destinationPortString = this.destinationSite
                    }
                }
                const data = {
                    departurePort: departurePortString,
                    destinationPort: destinationPortString,
                    trspMode: this.trspMode,
                    trspType: this.trspType,
                    cargoType: this.cargoType,
                    schemeValidity: this.schemeValidity,
                    contaSource: this.contaSource,
                    contaSizeType: this.contaSizeType,
                    page: this.page,
                    size: 6
                }
                // 解决mounted调用getData方法时，from表单还没渲染完成
                // setTimeout(() => {
                if (this.$refs["formSearchInline"]) {
                    this.$refs["formSearchInline"].validate((valid) => {
                        if (valid) {
                            apiGetSchemeList({ data }).then( res => {
                                this.listData = res.data.content || []
                                this.total = res.data.totalElements
                            })
                        }
                    })
                }
                // }, 200)
            },
            // 新增货运需求
            addFreightDemand () {
                this.$router.push({ path: '/freight-request/simple-entry' })
            },
            // 收藏
            collect (val) {
                console.log("收藏")
            },
            // 取消收藏
            uncollect (val) {
                console.log("收藏")
            },
            // 方案详情
            detail (val) {
                const data = val
                window.sessionStorage.setItem('logisticsData', JSON.stringify(data))
                this.$router.push({ path: '/logistics-solutions/scheme-details'})
            },
            // 选择启运地城市
            async changeDispatchCity (value) {
                this.search.dispatchCity = value.value.join('~')
                this.dispatchOptions = await this._handelDir(value.value)
            },
            // 选择目的地城市
            async changeDestinationCity (value) {
                this.search.destinationCity = value.value.join('~')
                this.destinationOptions = await this._handelDir(value.value)
            }
        },
    }
</script>

<style lang="scss" scoped>
    /deep/ .ivu-form-item-content {
        display: flex;
        margin-top: 22px;
    }
    /deep/ .ivu-form .ivu-form-item-label {
        padding-top: 30px;
    }
    .btn-pagina {
        display: flex;
        padding: 10px 0 0 0;
        .title {
            font-size: $font-size-large;
            font-family: Microsoft YaHei;
            font-weight: 400;
            width: 50%;
        }
        .btn-tabs{
            display: -webkit-inline-box;
            width: 50%;
            .adt-button {
                width: 100%;
            }
        }
    }
</style>
