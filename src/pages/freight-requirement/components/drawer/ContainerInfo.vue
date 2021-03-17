<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>录入集装箱信息</h3>
            <Form
                :model="formItem"
                :rules="ruleValidate"
                label-position="top"
                ref="formItemData"
            >
                <Row>
                    <Col span="12">
                        <FormItem label="集装箱尺寸类型:" prop="contaSizeType">
                            <Select v-model="formItem.contaSizeType" clearable>
                                <Option v-for="item in contaSizeType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="提箱类型:" prop="suitcaseType">
                            <Select v-model="formItem.suitcaseType" clearable>
                                <Option v-for="item in suitcaseType" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="集装箱数量:" prop="contaQty">
                            <!-- <Input v-model.number="formItem.contaQty" disabled /> -->
                            <Input v-model.number="formItem.contaQty" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="是否需要拼箱:" prop="px">
                            <RadioGroup v-model="formItem.px">
                                <Radio v-for="item in yesOrNo" :key="item.dictionaryKey" :label="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="集装箱来源:" prop="contaSource">
                            <Select v-model="formItem.contaSource" clearable>
                                <Option v-for="item in contaSource" :key="item.dictionaryKey" :value="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <!-- 先不做 -->
                <!-- <Row>
                    <Col span="12">
                        <FormItem label="是否需要提空箱\还空箱服务:" prop="hhh">
                            <RadioGroup v-model="formItem.hhh">
                                <Radio v-for="item in yesOrNo" :key="item.dictionaryKey" :label="item.dictionaryKey">
                                    {{ item.dictionaryValue }}
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="提空地:">
                            <adt-city-selector :defaultData="formItem.tkd" @on-change="handelTkd" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label=" ">
                            <Select v-model="formItem.tkd" filterable clearable>
                                <Option v-for="item in tkd" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label=" ">
                            <Input v-model="formItem.tkdAddress" placeholder="具体地址"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem label="还空地:">
                            <adt-city-selector :defaultData="formItem.hkd" @on-change="handelHkd" />
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label=" ">
                            <Select v-model="formItem.hkd" filterable clearable>
                                <Option v-for="item in hkd" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label=" ">
                            <Input v-model="formItem.hdkAddress" placeholder="具体地址"></Input>
                        </FormItem>
                    </Col>
                </Row> -->
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
    import { apiChangJing } from '@/api/logisticsCommission'
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
                // 集装箱尺寸类型
                contaSizeType: this.$getDictionary('CONTAINER_SIZE_TYPE'),
                // 提箱类型
                suitcaseType: this.$getDictionary('CONTAINER_SIZE_TYPE'),
                // 集装箱来源
                contaSource: this.$getDictionary('CONTAINER_SOURCE'),
                // 是否
                yesOrNo: this.$getDictionary('Y_N'),
                isShowDrawer: false,
                formItem: {},
                ruleValidate: {},
                tkd: [],
                hkd: []
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
            },
            // 选择提空地地城市
            async handelTkd (data) {
                if (data.data.length !== 0) {
                    const arr = await this._handelDir(data.value)
                    this.tkd = arr
                }
            },
            // 选择还空地城市
            async handelHkd (data) {
                if (data.data.length !== 0) {
                    const arr = await this._handelDir(data.value)
                    this.hkd = arr
                }
            },
            // 拿到场景的字典
            _handelDir (val) {
                return new Promise((resolve) => {
                    let code = val[val.length - 1]
                    const iscode = val[val.length - 2]
                    if (
                        iscode === '110000000000' ||
                        iscode === '120000000000' ||
                        iscode === '500000000000' ||
                        iscode === '310000000000'
                    ) {
                        code = iscode
                    }
                    apiChangJing({ city: code }).then(({ data }) => {
                        const arr = data[0]
                        const newArr = arr.map(item => {
                            return {
                                value: item.sttnCode,
                                label: item.sttnName
                            }
                        })
                        resolve(newArr)
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .ivu-radio-wrapper {
        margin: 0 20px;
    }
</style>
