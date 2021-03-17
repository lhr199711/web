<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>查看时间要求</h3>
            <Form
                :model="formItem"
                ref="formItemData"
                label-colon
            >
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="预计货好时间" prop="cargoReadyTime">
                            {{ formItem.cargoReadyTime }}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="最迟交货时间" prop="lastDeliveryTime">
                            {{ formItem.lastDeliveryTime }}
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="最迟启运时间" prop="lastStartTime">
                            {{ formItem.lastStartTime }}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="指定地点" prop="lastStartPort">
                            {{ formItem.lastStartPort }}
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="最晚运抵时间" prop="lastArriveTime">
                            {{ formItem.lastArriveTime }}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="指定地点" prop="lastArrivePort">
                            {{ formItem.lastArrivePort }}
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="12">
                        <FormItem label="最低时长要求" prop="lowestTimeReq">
                            {{ formItem.lowestTimeReq }} 小时
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    </div>
</template>

<script>
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
                }
            }
        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                },
                immediate: true
            }
        },
        methods: {
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
