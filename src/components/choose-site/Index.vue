<template>
    <div class="set-time-demand">
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>路线选择</h3>
            <Form
                :model="formItem"
                :rules="ruleValidate"
                label-position="top"
                ref="formItemData"
                label-colon
            >
                <Row>
                    <Col span="12">
                        <FormItem :label="label" prop="date">
                            <DatePicker v-model="formItem.date" type="date"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <div class="site-lists">
                    <FormItem prop="site">
                        <RadioGroup v-model="formItem.site">
                            <div v-for="(site, index) in formItem.lists" :key="index" class="site">
                                <Radio :label="site.name + '~' + site.port" border>{{ site.name.split(';')[0] }}</Radio>
                            <div v-if="index !== formItem.lists.length - 1" class="line"></div>
                        </div>
                    </RadioGroup>
                    </FormItem>
                </div>
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
    export default {
        props: {
            label: {
                type: String,
                default: '最迟启运时间'
            },
            showDrawer: {
                type: Boolean,
                default: false
            },
            defaultData: {
                type: Object,
                default: () => ({ site: '', date: '2020-11-11', lists: [{ name:'重庆', port:'123' },{ name:'大阪', port:'234' }] })
            }
        },
        data () {
            return {
                // 包装类型
                packageType: this.$getDictionary('PACKAGE_TYPE'),
                // 包装特殊要求
                packSpecialRequest: this.$getDictionary('pPACKAGE_SPECIAL_REQUEST'),
                isShowDrawer: false,
                formItem: this.defaultData,
                ruleValidate: {
                    date: [
                        {
                            required: true,
                            validator: validateRules.validateTime,
                            trigger: 'change'
                        }
                    ],
                    site: [
                        validateRules.select('路线')[0]
                    ]
                }
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
                this.$refs.formItemData.validate(valid => {
                    if (valid) {
                        this.$emit('submit-form', this.formItem)
                        this.isShowDrawer = false
                    }
                })
            },
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .site-lists {
        @extend %scrollbar-x;
        margin-top: 10px;
        padding: 30px 0 10px 0;
        border-top: 1px solid #D7D8DF;
        /deep/ .ivu-radio-group {
            display: flex;
        }
        /deep/ .ivu-radio-border {
            width: 160px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .site {
            display: flex;
            align-items: center;
            .line {
                width: 32px;
                height: 1px;
                margin-right: 8px;
                background-color: #dcdcdc;
            }
        }
    }
</style>
