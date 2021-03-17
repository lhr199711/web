<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>查看包装信息</h3>
            <Form
                :model="defaultData"
                label-colon
            >
                <Row :gutter="20">
                    <Col span="8">
                        <FormItem label="包装类型" prop="packType">
                            {{ defaultData.packType }}
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="包装毛重" prop="packGrossWeight">
                           {{ defaultData.packGrossWeight }}KG
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="包装件数" prop="packQty">
                           {{ defaultData.packQty }}
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="8">
                        <FormItem label="包装特殊要求" prop="packSpecialRequest">
                           {{ defaultData.packSpecialRequest }}
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="包装体积" prop="packVol">
                           {{ defaultData.packVol }}m³
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
            },
            defaultData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                isShowDrawer: false
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
    h6 {
        margin-bottom: 30px;
        font-size: 16px;
    }
</style>
