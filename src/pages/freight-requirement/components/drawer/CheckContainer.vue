<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>查看集装箱信息</h3>
            <Form
                :model="defaultData"
                label-colon
            >
                <Row :gutter="20">
                    <Col span="8">
                        <FormItem label="集装箱尺寸类型" prop="contaSizeType">
                            {{ defaultData.contaSizeType }}
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="集装箱数量" prop="contaQty">
                           {{ defaultData.contaQty }}
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="集装箱来源" prop="contaSource">
                           {{ defaultData.contaSource }}
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col span="8">
                        <FormItem label="提箱类型" prop="suitcaseType">
                           {{ defaultData.suitcaseType }}
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
