<template>
    <div>
        <div id="TimeCostInformation">
            <Form :model="formItem" :rules="ruleValidate" ref="formItemData" :label-width="200" label-colon>
                <div class="public-form-card">
                    <Row>
                        <Col span="24">
                            <FormItem label="最高费用要求" prop="lowestCostReq">
                                <Input type="text" v-model="formItem.highestCostReq"/>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </Form>
        </div>
        <div v-if="!isDetail" class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
        </div>
    </div>
</template>

<script>
import validateRules from '@/libs/validateRules'
    export default {
        props: {
            defaultData: {
                type: Object,
                default: () => ({
                    highestCostReq:''
                })
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return{
                formItem: this.defaultData,
                ruleValidate: {}
            }
        },
        methods:{
            submitForm () {
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        this.$emit('submit-form', this.formItem)
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    button {
        margin-top: 30px;
    }
</style>
