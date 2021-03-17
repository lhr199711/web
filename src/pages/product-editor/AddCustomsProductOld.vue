<template>
    <div class="add-product">
        <div class="customs-type">
            <Form :model="obj" :rules="ruleValidate">
                <FormItem label="关务类型" prop="customsType">
                    <Select v-model="obj.customsType">
                        <Option v-for="(val,index) in customsTypeDictionaries" :key="index" :value="val">{{val}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </div>
        <!-- <div class="from-where">
            <div v-if="type==='zbq'">
                <h4 style="font-size:16px;margin-right:150px;">设置关区：</h4>
                <Form
                    style="display:flex;"
                    :ref="`${type}Form`"
                    :model="formInline"
                >
                    <FormItem
                        label="综保区名称："
                        style='position:relative;margin:0 10px 0 0;'
                    >
                        <Select>
                            <Option v-for="i in 4" :key="i"></Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select>
                            <Option v-for="i in 4" :key="i"></Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        label="关务类型"
                        style="position:relative;margin-left:300px;"
                    >
                        <Select>
                            <Option v-for="i in 4" :key="i"></Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </div> -->
        <Row>
            <Col span="12">
                <div class="choose-type">
                    选择服务产品类型：
                    <Select v-model="productType" @on-change="goToAddProduct">
                        <Option value="transport">运输产品</Option>
                        <Option value="site">场所产品</Option>
                        <Option value="customs">关务产品</Option>
                        <Option value="cpa">综保区产品</Option>
                    </Select>
                </div>
            </Col>
            <Col span="12" style="text-align: right;">
                <Button type="primary" @click="saveProduct()">保存产品</Button>
            </Col>
        </Row>
        <div class="white-bg" style="padding-bottom: 0;">
            <div class="add-site">
                <Row>
                    <Col span="3">
                        <div class="name">报关城市:</div>
                    </Col>
                    <Col span="21">
                        <Form
                        ref="formValidate"
                        inline
                        :model="siteData"
                        :rules="ruleValidate"
                        :label-colon="true"
                        label-position="left"
                        :label-width="100">
                            <FormItem label="国家地区" prop="dispatchSite">
                                <Select v-model="siteData.dispatchCity">
                                    <Option value="1">运输产品</Option>
                                    <Option value="2">场所产品</Option>
                                    <Option value="3">关务产品</Option>
                                    <Option value="4">综保区产品</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="城市" prop="destinationSite">
                                <Select v-model="siteData.destinationCity">
                                    <Option value="1">运输产品</Option>
                                    <Option value="2">场所产品</Option>
                                    <Option value="3">关务产品</Option>
                                    <Option value="4">综保区产品</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="报关类型" prop="destinationSite">
                                <RadioGroup v-model="siteData.Radio" @on-change="chooseType">
                                    <Radio label="1">进口报关</Radio>
                                    <Radio label="2" style="position: relative; left: 16px;">出口报关</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Row class="gq" v-show="gqShow">
                    <Col span="2" class="all-checkbox">
                        <Checkbox v-model="allCheckbox" @on-change="handleChooseAllGq">全选</Checkbox>
                    </Col>
                    <Col span="22">
                        <CheckboxGroup v-model="checkedGq" class="gq-checkbox">
                            <Checkbox v-for="(item, index) in 20" :key="index" :label="item">item</Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
            </div>
        </div>
        <div class="white-bg middle-white-bg">
            <div class="product-list">
                <div class="product-content only-one">
                    <!-- <adt-tab-btns :titleNames="sceneTitleNames" :isSmallBtn="true" :btnIndex="sceneTabIndex" @handleBtn="handleSceneBtn" class="scene-tab"></adt-tab-btns> -->
                    <adt-tab-btns :titleNames="titleNames" :isUnderline="true" :btnIndex="tabIndex" @handleBtn="handleBtn" :width="250" :height="40" class="task-tab"></adt-tab-btns>
                    <div class="basic-item" v-show="isBasicTask">
                        <Row class="item-container">
                            <Col span="10" class="item">
                                基础服务总费用：
                                <Input v-model.number="cost" />
                                元/标箱
                            </Col>
                            <Col span="14" class="item">
                                基础服务总时长：
                                <Select v-model="time">
                                    <Option value="1">10</Option>
                                    <Option value="2">20</Option>
                                </Select>
                                <Select v-model="unit" style="width: 80px;">
                                    <Option value="1">天</Option>
                                    <Option value="2">小时</Option>
                                </Select>
                            </Col>
                        </Row>
                        <adt-task-content :basicTask="basicTask" :isAdditionalTasks="false" />
                    </div>
                    <div class="additional-item" v-show="!isBasicTask">
                        <h6>选择附加任务:</h6>
                        <div class="task-container">
                            <!-- 一行放2个放不下，不能按照设计图来 -->
                            <div class="task-item">
                                <Checkbox></Checkbox>
                                <div class="task-name">附加任务1</div>
                                <div class="cost">
                                    费用：
                                    <Input v-model.number="cost"/>
                                    元
                                </div>
                                <div class="time">
                                    费用：
                                    <Select v-model="time">
                                        <Option value="1">10</Option>
                                        <Option value="2">20</Option>
                                    </Select>
                                    <Select v-model="unit" style="width: 80px;">
                                        <Option value="1">天</Option>
                                        <Option value="2">小时</Option>
                                    </Select>
                                </div>
                            </div>
                            <div class="task-item">
                                <Checkbox></Checkbox>
                                <div class="task-name">附加任务1</div>
                                <div class="cost">
                                    费用：
                                    <Input v-model.number="cost"/>
                                    元
                                </div>
                                <div class="time">
                                    费用：
                                    <Select v-model="time">
                                        <Option value="1">10</Option>
                                        <Option value="2">20</Option>
                                    </Select>
                                    <Select v-model="unit" style="width: 80px;">
                                        <Option value="1">天</Option>
                                        <Option value="2">小时</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="white-bg">
            <Row class="set-dead-line">
                <Col span="10">
                    <Icon type="md-alert" />方案报价截止时间：<DatePicker type="date" @on-change=""></DatePicker>
                </Col>
                <Col span="14">
                    提醒时间设置：方案截止时间几天前开始提醒:
                    <Select v-model="productType.remindTime" style="width: 80px;">
                        <Option value="1">1天</Option>
                        <Option value="2">2天</Option>
                    </Select>
                </Col>
            </Row>
        </div>
        <!-- 查看全部场景modal -->
        <adt-my-modal
            title="选择产品场景"
            :showModal="isSceneModalShow"
            @on-visible-change="sceneVisibleChange"
            @on-ok="confirmChooseScene()">
            <Form
                ref="deadLineFormValidate"
                inline
                :model="deadLineData"
                :rules="ruleValidate"
                :label-colon="true"
                label-position="left">
                <FormItem>
                    <CheckboxGroup v-model="chosenScene" class="scene-checkbox">
                        <Checkbox v-for="(item, index) in 10" :key="index" :value="item">{{ `场景${index}` }}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
        </adt-my-modal>
    </div>
</template>

<script>
    import addProductContent from '@/mixins/addProductContent'
    import AdtTaskContent from '@/components/adt-task-content/Index'
    import validateRules from '@/libs/validateRules'
    export default {
        mixins: [addProductContent],
        components: {
            AdtTaskContent
        },
        data () {
            return {
                obj: {
                    customsType: ''
                },
                customsTypeDictionaries: ['综保区报关','普通报关'],
                deadLineData: {},
                productType: 'customs',
                siteData: {
                    dispatchSite: '',
                    destinationSite: ''
                },
                ruleValidate: {
                    dispatchSite: [
                        validateRules.select('启运地')[0]
                    ],
                    destinationSite: [
                        validateRules.select('目的地')[0]
                    ],
                    customsType: [
                        validateRules.select('关务类型')[0]
                    ]
                    // dispatchCity: [
                    //     validateRules.select('启运地城市')[0]
                    // ],
                    // destinationCity: [
                    //     validateRules.select('目的地城市')[0]
                    // ]
                },
                parameterData: {
                    way: ''
                },
                selectList: {
                    ids: []
                },
                sceneTitleNames: ['场景1', '场景2'],
                cost: '',
                time: '',
                unit: '',
                basicTask: ['fdfd', '发个施工队'],
                dispatchLoading: false,
                destinationLoading: false,
                dispatchOptions: [],
                destinationOptions: [],
                chosenScene: [],
                gqShow: false,
                checkedGq: [],
                allCheckbox: false
            }
        },
        methods: {
            // 切换场景
            handleSceneBtn (index) {
                this.sceneTabIndex = ++index
            },
            dispatchRemoteMethod () {

            },
            destinationRemoteMethod () {

            },
            chooseType (val) {
                if (val === '1') {
                    this.gqShow = true
                } else {
                    this.gqShow = false
                }
            },
            handleChooseAllGq (val) {
                if (val) {
                    this.checkedGq = [1, 2]
                } else {
                    this.checkedGq = []
                }
            },
            saveProduct () {

            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './style.scss';
    .add-product {
        .customs-type {

        }
        .from-where {
            background-color: #fff;
            padding: 20px;
            /deep/ .ivu-form-item {
                margin: 0;
            }
            >div {
                display: flex;
                align-items: center;
            }
            /deep/ .ivu-form-item-label {
                position: absolute;
                top: 0;
                left: -90px;
            }
        }
    }
</style>
