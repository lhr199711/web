<template>
    <div class="add-product">
        <Row>
            <Col span="12">
                <div class="choose-type">
                    产品编号：GHDF8787
                </div>
            </Col>
            <Col span="12" style="text-align: right;">
                <Button type="primary" @click="saveProduct()">保存产品</Button>
            </Col>
        </Row>
        <div class="white-bg">
            <!-- 运输编辑 -->
            <div class="add-site add-site-detail" v-if="type === 'transport'">
                <Row>
                    <Col span="3">
                        <div class="name">场所：</div>
                    </Col>
                    <Col span="11">
                        启运地：中国重庆
                        <div style="display: inline-block; margin-left: 50px;">场所名称：重庆寸滩</div>
                    </Col>
                    <Col span="10">
                        目的地：中国重庆
                        <div style="display: inline-block; margin-left: 50px;">场所名称：重庆寸滩</div>
                    </Col>
                </Row>
                <Row class="display-line">
                    <Col span="3">
                        <div class="name">路段展示:</div>
                    </Col>
                    <Col span="21" class="line">
                        重庆
                        <svg class="iconfont arrow" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_jiantou"></use>
                        </svg>
                        纽约
                    </Col>
                </Row>
                <Row class="parameter">
                    <Col span="3">
                        <div class="name">参数:</div>
                    </Col>
                    <Col span="21">
                        <Row>
                            <Col span="5">
                                运输方式：铁运
                            </Col>
                            <Col span="5">
                                运输类型：20
                            </Col>
                            <Col span="5">
                                物流类型：普柜
                            </Col>
                            <Col span="5">
                                集装箱来源：普柜
                            </Col>
                            <Col span="5" style="margin-top: 16px;">
                                集装箱类型：普柜
                            </Col>
                            <Col span="5" style="margin-top: 16px;">
                                集装箱尺寸：普柜
                            </Col>
                            <Col span="5" style="margin-top: 16px;">
                                装箱类型：普柜
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <!-- 场所编辑 -->
            <div class="add-site add-site-detail" v-if="type === 'site'">
                <Row>
                    <Col span="3">
                        <div class="name">场所：</div>
                    </Col>
                    <Col span="5">
                        国家地区：中国重庆
                    </Col>
                    <Col span="5">
                        场所名称：重庆寸滩
                    </Col>
                </Row>
                <Row class="parameter">
                    <Col span="3">
                        <div class="name">参数:</div>
                    </Col>
                    <Col span="5">
                        运输类型：铁运
                    </Col>
                    <Col span="5">
                        集装箱尺寸：20
                    </Col>
                    <Col span="5">
                        集装箱类型：普柜
                    </Col>
                </Row>
            </div>
            <!-- 关务编辑 -->
            <div class="add-site add-site-detail" v-if="type === 'customs'">
                <Row>
                    <Col span="4">
                        报关类型：进口报关
                    </Col>
                    <Col span="4">
                        国家地区：中国
                    </Col>
                    <Col span="4">
                        城市：重庆
                    </Col>
                </Row>
                <Row class="gq" v-show="gqShow" style="margin-top: 20px;">
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
            <!-- 综保区编辑 -->
            <div class="add-site add-site-detail" v-if="type === 'cpa'">
                <Row>
                    <Col span="4">
                        国家地区：中国
                    </Col>
                    <Col span="10">
                        综保区名称：重庆两江综保区
                    </Col>
                </Row>
            </div>
        </div>
        <div class="white-bg middle-white-bg">
            <div class="product-list">
                <div class="product-content only-one">
                    <adt-tab-btns :titleNames="sceneTitleNames" :isSmallBtn="true" :btnIndex="sceneTabIndex" @handleBtn="handleSceneBtn" class="scene-tab"></adt-tab-btns>
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
                    <div class="public-component-line thin-line"></div>
                    <Row class="set-dead-line">
                        <Col span="10">
                            产品报价截止时间：<DatePicker type="date" @on-change=""></DatePicker>
                        </Col>
                        <Col span="14">
                            产品报价截止时间前几天开始提醒：
                            <Input v-model.number="cost" />
                            天
                        </Col>
                    </Row>
                </div>
            </div>
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
    import AdtTaskContent from '@/components/adt-task-content/Index'
    import validateRules from '@/libs/validateRules'
    export default {
        components: {
            AdtTaskContent
        },
        props: ['type'],
        data () {
            return {
                isModalShow: false,
                isSceneModalShow: false,
                deadLineData: {},
                delUrl: function () {},
                productType: '',
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
                curCollapse: '1',
                sceneTabIndex: 1,
                tabIndex: 1,
                isBasicTask: true,
                sceneTitleNames: ['场景1', '场景2'],
                titleNames: ['设置基础任务费用时长', '设置附加任务费用时长'],
                cost: '',
                time: '',
                unit: '',
                basicTask: ['fdfd', '发个施工队'],
                dispatchLoading: false,
                destinationLoading: false,
                dispatchOptions: [],
                destinationOptions: [],
                chosenScene: [],
                gqShow: true
            }
        },
        methods: {
            visibleChange (changeStatus) {
                this.isModalShow = changeStatus
            },
            sceneVisibleChange (changeStatus) {
                this.isSceneModalShow = changeStatus
            },
            handleSceneBtn (index) {
                console.log(index)
            },
            handleBtn (index) {
                this.tabIndex = index + 1
                // 基础任务
                if (index === 0) {
                    this.isBasicTask = true
                } else {
                    // 附加任务
                    this.isBasicTask = false
                }
            },
            confirmSetDeadLine () {

            },
            confirmChooseScene () {

            },
            setDeadLine () {
                this.isModalShow = true
            },
            showAllScene () {
                this.isSceneModalShow = true
            },
            saveParameter () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.isSceneModalShow = true
                        const data = {}
                        api({ data }).then(({ data }) => {

                        })
                    }
                })
            },
            handleReset () {
                this.$refs.parameterFormValidate.resetFields()
            },
            dispatchRemoteMethod () {

            },
            destinationRemoteMethod () {

            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './style.scss';
</style>
