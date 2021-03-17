<template>
    <div>
        <!-- <adt-btns
            :titleNames="titleNames"
            :btnIndex="btnIndex"
            :width="160"
            @handleBtn="goToOtherProductList"
        /> -->
        <adt-search-folder
            :searchRouter="{ query: search }"
            :isStatus="true"
            :isTitle="false"
        >
            <template slot="status">
                <div class="status">
                    <Col span="22">
                        <div class="name">产品状态：</div>
                        <span
                            v-for="status in productStatus"
                            :key="status.dictionaryKey"
                            :class="{'click-status': search.serverStatus === status.dictionaryKey}"
                            @click="auditStatus(status.dictionaryKey)"
                        >
                            {{ status.dictionaryValue }}
                        </span>
                    </Col>
                </div>
            </template>
            <template slot="always-show">
                <!-- 场所产品 -->
                <!-- <Col span="8" class="form-item">
                    <span>场所名称:</span>
                    <Input v-model="search.siteName" clearable />
                </Col> -->
                <!-- 运输产品 -->
                <Col span="8" class="form-item">
                    <span style="width: 55px; flex-shrink: 0;">启运地:</span>
                    <adt-city-selector :defaultData="search.dispatchCity" @on-change="changeDispatchCity" />
                    <span style="width: 65px; flex-shrink: 0;">选择场所:</span>
                    <Select v-model="search.dispatchSite" clearable>
                        <Option v-for="(option, index) in dispatchOptions" :key="index" :value="option.value">
                            {{ option.label }}
                        </Option>
                    </Select>
                </Col>
                <Col span="8" offset="2" class="form-item">
                    <span style="width: 55px; flex-shrink: 0;">目的地:</span>
                    <adt-city-selector :defaultData="search.destinationCity" @on-change="changeDestinationCity" />
                    <span style="width: 65px; flex-shrink: 0;">选择场所:</span>
                    <Select v-model="search.destinationSite" clearable>
                        <Option v-for="(option, index) in destinationOptions" :key="index" :value="option.value">
                            {{ option.label }}
                        </Option>
                    </Select>
                </Col>
                <Col span="5" offset="1" class="form-item">
                    <span style="margin-right: 12px; text-align: right;">产品编号:</span>
                    <Input v-model="search.serverCode" clearable />
                </Col>
                <!-- 关务产品 -->
                <!-- <Col span="8" class="form-item">
                    <span>报关城市:</span>
                    <Input v-model="search.siteName" clearable />
                </Col> -->
                <!-- 综保区产品 -->
                <!-- <Col span="8" class="form-item">
                    <span>综保区名称:</span>
                    <Input v-model="search.siteName" clearable />
                </Col> -->
            </template>
        </adt-search-folder>
        <div class="btns-paginator">
            <adt-button :selectList="selectList">
                <Button @click="addProduct()">
                    新建产品
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_tianjia" />
                    </svg>
                </Button>
                <!-- <Button @click="setDiscount()">
                    设置优惠折扣
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_zhekou" />
                    </svg>
                </Button>
                <Button @click="cancelDiscount()">
                    取消优惠折扣
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_piliangxiangqing" />
                    </svg>
                </Button> -->
                <Button @click="validApply(apiAuditTrue, '')">
                    {{ '有效' + ( isManager ? '' : '申请') }}
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-shenqing" />
                    </svg>
                </Button>
                <Button @click="invalidApply(apiAuditFalse, '')">
                    {{ '失效' + ( isManager ? '' : '申请') }}
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-shenqing" />
                    </svg>
                </Button>
            </adt-button>
            <adt-paginator :currentPage="~~page" :total="~~total" :size="size" />
        </div>
        <div class="public-component-line"></div>
        <div class="public-list three-column">
            <div v-for="(product, index) in listData" :key="index" class="public-component-card">
                <adt-list-item
                    :logistics="product"
                    :showCheckbox="true"
                    :resetCheckStatus="resetCheckStatus"
                    @checkData="checkData"
                >
                    <template slot="tab-title">
                        <span>产品编号:{{ product.serverCode }}</span>
                    </template>
                    <template slot="tab-operat">
                        <span
                            :class="{'card-status-success': product.serverStatus === 'upload' || product.serverStatus === '上载' || product.serverStatus === 'enable' || product.serverStatus === '有效' || product.serverStatus === 'wait' || product.serverStatus === '待审核', 'card-status-error': product.serverStatus === 'fail' || product.serverStatus === '审核未通过', 'card-status-disable': product.serverStatus === 'disable' || product.serverStatus === '失效' }"
                        >{{ product.serverStatusTranslate }}</span>
                        <Poptip class="card-icon" placement="right-start" trigger="hover">
                            <span>详情</span>
                            <Icon type="md-arrow-dropdown" />
                            <div class="card-poptip-font" slot="content">
                                <!-- <div @click="examine(product)">审核</div> -->
                                <div
                                    v-if="isManager && (product.serverStatus === 'wait' || product.serverStatus === '待审核')"
                                    @click="examine(product)"
                                >
                                    审核
                                </div>
                                <div
                                    v-if="product.serverStatus === 'upload' || product.serverStatus === '上载' || product.serverStatus === 'disable' || product.serverStatus === '失效' || product.serverStatus === 'fail' || product.serverStatus === '审核未通过'"
                                    @click="validApply(apiAuditTrue, product)"
                                >
                                    {{ '有效' + ( isManager ? '' : '申请') }}
                                </div>
                                <div
                                    v-if="product.serverStatus === 'enable' || product.serverStatus === '有效' || product.serverStatus === 'fail' || product.serverStatus === '审核未通过'"
                                    @click="invalidApply(apiAuditFalse, product)"
                                >
                                    {{ '失效' + ( isManager ? '' : '申请') }}
                                </div>
                                <div @click="detail(product)">详情</div>
                                <!-- <div @click="edit(product)">编辑</div> -->
                                <!-- <div @click="remove(product)" class="failure">删除</div> -->
                            </div>
                        </Poptip>
                    </template>
                    <template slot="tab-content">
                        <!-- 场所产品、综保区产品 -->
                        <!-- <div class="tab-content">
                            <div class="province">中国重庆</div>
                            <div class="site">两江寸滩物流堆场</div>
                            <div class="account"><span>90</span>%</div>
                            <svg class="iconfont account-tag" aria-hidden="true">
                                <use xlink:href="#icon-andaotongcaidanICON_huaban28youhuizhekou" />
                            </svg>
                        </div> -->
                        <!-- 关务产品 -->
                        <!-- <div class="tab-content">
                            <div class="province">中国重庆</div>
                            <div class="city-task">
                                重庆-<span class="task">（进口报关、出口报关）</span>
                            </div>
                            <div class="account"><span>90</span>%</div>
                            <svg class="iconfont account-tag" aria-hidden="true">
                                <use xlink:href="#icon-andaotongcaidanICON_huaban28youhuizhekou" />
                            </svg>
                        </div> -->
                        <!-- 运输产品 -->
                        <div class="tab-content">
                            <div class="province"></div>
                            <div class="transport-info">
                                <div class="city" :title="product.departurePortTranslate && product.departurePortTranslate.split(';').pop()">
                                    {{ product.departurePortTranslate && product.departurePortTranslate.split(';').pop() }}
                                </div>
                                <!-- 轮船 -->
                                <svg v-if="product.trspMode === '1' || product.trspMode === '水运'" class="iconfont way" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongcaidanICON_lunchuan" />
                                </svg>
                                <!-- 空运 -->
                                <svg v-if="product.trspMode === '2' || product.trspMode === '空运'" class="iconfont way" aria-hidden="true">
                                    <use xlink:href="#icon-feiji800" />
                                </svg>
                                <!-- 公路 -->
                                <svg v-if="product.trspMode === '3' || product.trspMode === '公路'" class="iconfont way" aria-hidden="true" style="transform: rotateY(180deg); font-size: 20px;">
                                    <use xlink:href="#icon-huoche" />
                                </svg>
                                <!-- 铁运 -->
                                <svg v-if="product.trspMode === '4' || product.trspMode === '铁运'" class="iconfont way" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongcaidanICON_huoche" />
                                </svg>
                                <div class="type">{{ product.logisticsTypeTranslate }}-{{ product.trspTypeTranslate }}</div>
                                <svg class="iconfont arrow" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongcaidanICON_jiantou" />
                                </svg>
                                <div class="city" :title="product.destinationPortTranslate && product.destinationPortTranslate.split(';').pop()">
                                    {{ product.destinationPortTranslate && product.destinationPortTranslate.split(';').pop() }}
                                </div>
                            </div>
                            <template v-if="product.PrefDiscount">
                                <div class="account"><span>{{ product.PrefDiscount }}</span>%</div>
                                <svg class="iconfont account-tag" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongcaidanICON_huaban28youhuizhekou" />
                                </svg>
                            </template>
                        </div>
                    </template>
                    <template slot="tab-bottom">
                        <div class="tab-bottom">
                            <Row>
                                <Col span="24">
                                    有效期：
                                    {{ timestampFormat(product.serverStartTime) }}
                                    --
                                    {{ timestampFormat(product.serverEndTime) }}
                                </Col>
                            </Row>
                            <Row>
                                <Col span="10">执行时长：{{ product.totalTime }}{{ product.totalTimeUnitTranslate }}</Col>
                                <Col class="text-right" span="14">
                                    价格：￥<span>{{ product.priceTotal }}</span>/{{ (product.trspType === 'C' || product.trspType === '集装箱') ? 'TEU' : 'KG' }}
                                </Col>
                            </Row>
                        </div>
                    </template>
                </adt-list-item>
            </div>
        </div>
        <!-- 设置优惠折扣比modal -->
        <adt-my-modal
            title="设置优惠折扣比"
            :showModal="isModalShow"
            @on-visible-change="visibleChange"
            @on-ok="confirmSetDiscount()"
        >
            <Form
                ref="formValidate"
                label-position="left"
                :model="discountData"
                :rules="ruleValidate"
                :label-colon="true"
                :label-width="120"
                inline
            >
                <FormItem label="优惠折扣比" prop="discount">
                    <Input v-model="discountData.discount" placeholder="输入1~99之间的数字">
                        <span slot="suffix" style="line-height: 32px;">%</span>
                    </Input>
                </FormItem>
            </Form>
        </adt-my-modal>
        <!-- 取消优惠折扣 -->
        <adt-reconfirm-modal
            message="确认取消勾选产品的优惠折扣吗？"
            title="取消折扣"
            :showModal="isCancelDiscountModalShow"
            @on-visible-change="cancelDiscountVisibleChange"
            @on-ok="confirmCancelDiscount()"
        />
        <!-- 审核modal -->
        <adt-my-modal
            width="600"
            :title="examineModalTitle"
            :showModal="isExamineModalShow"
            @on-visible-change="examineVisibleChange"
            @on-ok="examineSave(apiAuditTrueOk, apiAuditTrueNo, apiAuditFalseOk, apiAuditFalseNo)"
        >
            <RadioGroup v-model="agree" style="margin-bottom: 20px;">
                <Radio label="1">同意{{ examineType === 1 ? '有效' : '失效' }}</Radio>
                <Radio label="0" style="margin-left: 30px;">不同意{{ examineType === 1 ? '有效' : '失效' }}</Radio>
            </RadioGroup>
            <div v-show="agree === '0'">
                <div class="reason-name" style="margin-bottom: 6px;">不同意原因备注:</div>
                <Input v-model.trim="reason" type="textarea" placeholder="请输入内容..." />
            </div>
        </adt-my-modal>
        <!-- 失效审核：产品已经与方案绑定 -->
        <adt-reconfirm-modal title="失效审核" :message="sxMessage" :showModal="isSxModalShow" @on-visible-change="sxVisibleChange" @on-ok="confirmSx()" />
        <!-- 删除 -->
        <adt-reconfirm-modal :showModal="isDeleteModalShow" @on-visible-change="deleteVisibleChange" @on-ok="confirmDelete()" />
    </div>
</template>

<script>
    import productList from '@/mixins/productList'
    import {
        apiTransportQueryList,
        apiTransportAuditTrue,
        apiTransportAuditFalse,
        apiTransportAuditTrueOk,
        apiTransportAuditTrueNo,
        apiTransportAuditFalseOk,
        apiTransportAuditFalseNo,
        apiTransportPrefPrice,
        apiTransportOffPrice,
    } from '@/api/productEditor'
    export default {
        mixins: [productList],
        props: {
            dispatchCity: '',
            dispatchSite: '',
            destinationCity: '',
            destinationSite: '',
            serverStatus: '',
            serverCode: ''
        },
        data () {
            return {
                // （批量）有效（申请）、（批量）失效（申请）api，作为参数传到mixin
                // 操作员有效申请、管理员有效
                apiAuditTrue: apiTransportAuditTrue,
                // 操作员失效申请、管理员失效
                apiAuditFalse: apiTransportAuditFalse,

                // 审核的api，作为参数传到mixin
                // 有效同意
                apiAuditTrueOk: apiTransportAuditTrueOk,
                // 有效不同意
                apiAuditTrueNo: apiTransportAuditTrueNo,
                // 失效同意
                apiAuditFalseOk: apiTransportAuditFalseOk,
                // 失效不同意
                apiAuditFalseNo: apiTransportAuditFalseNo,

                search: {
                    dispatchCity: this.dispatchCity,
                    dispatchSite: this.dispatchSite,
                    destinationCity: this.destinationCity,
                    destinationSite: this.destinationSite,
                    serverStatus: this.serverStatus,
                    serverCode: this.serverCode
                },
                // 启运地
                dispatchOptions: [],
                // 目的地
                destinationOptions: [],
                btnIndex: 1
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
        methods: {
            // 获取运输列表
            getData () {
                let dispatchCity = this.search.dispatchCity ? this.search.dispatchCity.split('~') : []
                let destinationCity = this.search.destinationCity ? this.search.destinationCity.split('~') : []
                const data = {
                    page: this.page,
                    size: this.size,
                    departurePort: dispatchCity.length ? `${dispatchCity.join(';')};${this.search.dispatchSite || ''}` : '',
                    destinationPort: destinationCity.length ? `${destinationCity.join(';')};${this.search.destinationSite || ''}` : '',
                    serverStatus: this.search.serverStatus,
                    serverCode: this.search.serverCode
                }
                // 去除选中的状态（写两遍是为了触发watch监听）
                this.resetCheckStatus = false
                apiTransportQueryList({ data }).then(({ data }) => {
                    this.listData = data.content || []
                    this.total = data.totalElements
                    // 重置选中的值
                    this.selectList = []
                    // 去除选中的状态
                    this.resetCheckStatus = true
                })
            },
            // 新建产品
            addProduct () {
                this.$router.push('/product-editor/add-transport-product')
            },
            // 编辑
            edit (data) {
                this.$router.push('')
            },
            // 详情
            detail (data) {
                this.$router.push(`/product-editor/product-detail/${data.serverCode}?type=transport`)
            },
            // 选择启运地城市
            async changeDispatchCity (value) {
                // this.search.dispatchCity = value.value[value.value.length - 1]
                this.search.dispatchCity = value.value.join('~')
                this.dispatchOptions = await this._handelDir(value.value)
            },
            // 选择目的地城市
            async changeDestinationCity (value) {
                // this.search.destinationCity = value.value[value.value.length - 1]
                this.search.destinationCity = value.value.join('~')
                this.destinationOptions = await this._handelDir(value.value)
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './style.scss';
</style>
