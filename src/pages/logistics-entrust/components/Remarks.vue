<template>
    <div>
        <div id="Remarks">
            <div class="notes">
                <span class="sNotes">备注信息</span>
                <span class="icon">
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_piliangxiangqing" />
                    </svg>
                </span>
                <span class="words">如果您觉得没有完全表达您的委托要求，请备注在下面，我们将竭诚为您服务!</span>
            </div>
            <div class="areaText">
                <Form :model="formItem" :rules="ruleValidate" ref="formItemData"  label-colon>
                    <FormItem prop="desc">
                        <Input v-model="formItem.desc" type="textarea" :autosize="{minRows: 10,maxRows: 20}" placeholder="请输入备注内容..."></Input>
                    </FormItem>
                </Form>
            </div>
        </div>
        <div v-if="!isDetail" class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="submitForm">保存</Button>
        </div>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    export default {
        props: {
            defaultData: {
                type: Object,
                default: () => ({})
            },
            isDetail: {
                type: Boolean,
                default: false
            },
            Type: {
                type: Boolean,
                default: false //默认是单次的备注
            }
        },
        data () {
            return {
                // 委托类型
                delegationType: this.$getDictionary('DELEGATION_TYPE'),
                formItem: this.defaultData,
                ruleValidate: {
                }
            }
        },
        methods:{
            // 保存按钮 本地 sessionStorage 保存 刷新赋值给父组件 传递到各子组件 可更改
            submitForm () {
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        this.$emit('submit-form', this.formItem)
                    }
                })
            },
            // 调用 发送api 接口 成功后不可更改
            sendForm(){
                this.$refs.formItemData.validate((valid) => {
                    if (valid) {
                        this.$emit('send-form', this.formItem)
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
#Remarks{
    background: #ffffff;
    margin-top: 30px;
    padding: 20px;
}
</style>
