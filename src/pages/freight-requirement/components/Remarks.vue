<template>
    <div class="remarks">
        <div class="public-remarks">
            <div class="head">
                <h6>备注信息</h6>
                <template v-if="!isDetail">
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_piliangxiangqing" />
                    </svg>
                    <div class="tip">如果您觉得没有完全表达您的货运要求，请备注在下面，我们将竭诚为您服务！</div>
                </template>
            </div>
            <Input v-model="formItem.remark" type="textarea" maxlength="500" :placeholder="isDetail ? '无' : '请输入备注内容'" />
        </div>
        <div v-if="!isDetail" class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="submitForm">保存</Button>
            <Button shape="circle" size="large" @click="send">发送要求</Button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            defaultData: {
                type: Object,
                default: () => ({})
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                formItem: this.defaultData
            }
        },
        watch: {
            defaultData (newVal) {
                this.formItem = newVal
            }
        },
        methods: {
            submitForm () {
                this.$emit('submit-form', this.formItem.remark)
            },
            send () {
                this.$emit('on-send')
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
