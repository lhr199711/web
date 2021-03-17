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
                <!-- 关务产品 -->
                <Col span="8" class="form-item">
                    <span>报关城市:</span>
                    <adt-city-selector :defaultData="search.customsCity" @on-change="changeCustomsCity" />
                </Col>
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
        <div class="public-list one-column">
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
                        <!-- 关务产品 -->
                        <div class="tab-content" style="padding-bottom: 24px;">
                            <div class="province" style="margin-left: 10px;">{{ 1 ? '普通关务' : '综保区关务' }}</div>
                            <div class="city-task">
                                {{ product.departurePortTranslate && product.departurePortTranslate.split(';').pop() }}-<span class="task">（进口报关、出口报关）</span>
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
                        <div class="tab-bottom" style="margin-top: 24px">
                            <Row>
                                <Col span="4">执行时长：{{ product.totalTime }}{{ product.totalTimeUnitTranslate }}</Col>
                                <Col span="6">
                                    有效期：
                                    {{ timestampFormat(product.serverStartTime) }}
                                    --
                                    {{ timestampFormat(product.serverEndTime) }}
                                </Col>
                                <Col span="14">
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
        apiCustomsQueryList,
        apiCustomsAuditTrue,
        apiCustomsAuditFalse,
        apiCustomsAuditTrueOk,
        apiCustomsAuditTrueNo,
        apiCustomsAuditFalseOk,
        apiCustomsAuditFalseNo,
        apiCustomsPrefPrice,
        apiCustomsOffPrice,
    } from '@/api/productEditor'
    export default {
        mixins: [productList],
        props: {
            customsCity: '',
            serverStatus: ''
        },
        data () {
            return {
                // （批量）有效（申请）、（批量）失效（申请）api，作为参数传到mixin
                // 操作员有效申请、管理员有效
                apiAuditTrue: apiCustomsAuditTrue,
                // 操作员失效申请、管理员失效
                apiAuditFalse: apiCustomsAuditFalse,

                // 审核的api，作为参数传到mixin
                // 有效同意
                apiAuditTrueOk: apiCustomsAuditTrueOk,
                // 有效不同意
                apiAuditTrueNo: apiCustomsAuditTrueNo,
                // 失效同意
                apiAuditFalseOk: apiCustomsAuditFalseOk,
                // 失效不同意
                apiAuditFalseNo: apiCustomsAuditFalseNo,

                search: {
                    CustomsCity: this.CustomsCity,
                    serverStatus: this.serverStatus
                },
                btnIndex: 1
            }
        },
        methods: {
            // 获取运输列表
            getData () {
                let customsCity = this.search.customsCity ? this.search.customsCity.split('~') : []
                const data = {
                    page: this.page,
                    size: this.size,
                    customsCity: customsCity.length ? customsCity.join(';') : '',
                    serverStatus: this.search.serverStatus
                }
                // 去除选中的状态（写两遍是为了触发watch监听）
                this.resetCheckStatus = false
                apiCustomsQueryList({ data }).then(({ data }) => {
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
            // 选择报关城市
            async changeCustomsCity (value) {
                this.search.customsCity = value.value.join('~')
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './style.scss';
</style>
