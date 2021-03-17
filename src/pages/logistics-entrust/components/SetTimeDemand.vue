<template>
    <div class="set-time-demand">
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>设置时间要求</h3>
            <Form
                :model="formItem"
                :rules="ruleValidate"
                label-position="top"
                ref="formItemData"
                label-colon
            >
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="预计货好时间" prop="cargoReadyTime">
                            <DatePicker v-model="formItem.cargoReadyTime" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="最迟交货时间" prop="lastDeliveryTime">
                            <DatePicker v-model="formItem.lastDeliveryTime" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="最迟启运时间" prop="lastStartTime">
                            <DatePicker v-model="formItem.lastStartTime" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12" v-show="formItem.lastStartTime">
                        <FormItem label="指定地点">
                            <Input v-model="departurePortName" disabled>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="最晚运抵时间" prop="lastArriveTime">
                            <DatePicker v-model="formItem.lastArriveTime" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12" v-show="formItem.lastArriveTime">
                        <FormItem label="指定地点">
                            <Input v-model="destinationPortName" disabled>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="最低时长要求" prop="lowestTimeReq">
                            <Input v-model="formItem.lowestTimeReq">
                                <span slot="suffix">小时</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="submitForm">确定</Button>
                <Button shape="circle" size="large" @click="cancel">取消</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    export default {
        props: {
            showDrawer: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                isShowDrawer: '',
                formItem: {
                    cargoReadyTime: '',
                    lastDeliveryTime: '',
                    lastStartTime: '',
                    lastStartPort: '',
                    lastArriveTime: '',
                    lastArrivePort: '',
                    lowestTimeReq: '',
                    lowestTimeUnit: '小时'
                },
                ruleValidate: {
                    cargoReadyTime: [
                        {
                            required: true,
                            validator: validateRules.validateTime,
                            trigger: 'change'
                        }
                    ]
                },
                departurePortName:'', //启运地点 名字
                destinationPortName:'' //运抵地点 名字
            }
        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                    if (to) { //设置默认地点名称
                        let contractEntrustsave = JSON.parse(sessionStorage.getItem('contractEntrustsave'));
                        if (contractEntrustsave) {
                            this.departurePortName = contractEntrustsave.departurePortName || "重庆"
                            this.destinationPortName = contractEntrustsave.destinationPortName || "香港"
                        }
                    }
                },
                immediate: true
            }
        },
        methods: {
            submitForm () {
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        this.$emit('on-ok', this.formItem)
                        this.isShowDrawer = false
                    }
                })
            },
            cancel () {
                this.$emit('on-cancel')
                this.isShowDrawer = false
            },
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
