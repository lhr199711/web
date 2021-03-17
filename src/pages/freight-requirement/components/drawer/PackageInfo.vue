<template>
    <div class="set-time-demand">
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>录入包装信息</h3>
            <Form
                :model="defaultData"
                :rules="ruleValidate"
                label-position="top"
                ref="formItemData"
                label-colon
            >
                <Row>
                    <Col span="12">
                        <FormItem label="包装类型" prop="packType">
                            <Select v-model="defaultData.packType" clearable>
                                <Option v-for="item in packageType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="包装毛重" prop="packGrossWeight">
                            <Input v-model="defaultData.packGrossWeight">
                                <span slot="suffix">KG</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="包装件数" prop="packQty">
                            <Input v-model="defaultData.packQty" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="包装特殊要求" prop="packSpecialRequest">
                            <Select v-model="defaultData.packSpecialRequest" clearable>
                                <Option v-for="item in packSpecialRequest" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="包装体积" prop="packVol">
                            <Input v-model="defaultData.packVol">
                                <span slot="suffix">m³</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="submitForm">确定</Button>
                <Button shape="circle" size="large" @click="isShowDrawer = false">取消</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
import { formItem } from '../../../standard-mapper/basics-task/data'
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
                // 包装类型
                packageType: this.$getDictionary('PACKAGE_TYPE'),
                // 包装特殊要求
                packSpecialRequest: this.$getDictionary('PACKAGE_SPECIAL_REQUEST'),
                isShowDrawer: false,
                formItem: {},
                ruleValidate: {}
            }
        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                },
                immediate: true
            },
            defaultData (newVal) {
                this.formItem = newVal
            }
        },
        methods: {
            submitForm () {
                this.$emit('submit-form', this.formItem)
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
