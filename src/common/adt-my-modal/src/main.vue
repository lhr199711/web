<template>
    <div class="adt-my-modal">
        <!-- 宽由于modal的padding加大了，需要加大width，不然以前的页面样式可能会乱，如果宽度是%，就不加宽 -->
        <Modal
            v-model="isShowModal"
            :width="Number(width) ? width - 0 + 48 : width"
            :title="title"
            :mask-closable="false"
            :footer-hide="true"
            @on-cancel="handleCancel"
            @on-visible-change="modalChange">
            <slot />
            <div v-if="showBtn" class="modal-footer">
                <Button v-if="isShowThirdBtn" shape="circle" @click="handleFeatures">{{ showThirdTitle }}</Button>
                <Button v-if="showCancelBtn" shape="circle" @click="handleCancel">{{ cancelText ? cancelText : $t('common.cancel') }}</Button>
                <Button shape="circle" type="primary" @click="handleConfirm">{{ okText ? okText : $t('common.ok') }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: 'AdtMyModal',
    props: {
        showModal: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '450' // 如果是新增模态框有两列，width传450；如果是审核模态框，width传800
        },
        title: {
            type: String
        },
        okText: {
            type: String
        },
        cancelText: {
            type: String
        },
        showCancelBtn: {
            type: Boolean,
            default: true
        },
        showBtn: {
            type: Boolean,
            default: true
        },
        isShowThirdBtn: {
            type: Boolean,
            default: false
        },
        showThirdTitle: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            loading: true,
            isShowModal: false
        }
    },
    watch: {
        showModal: {
            handler (to) {
                this.isShowModal = to
            },
            immediate: true
        }
    },
    methods: {
        handleFeatures () {
            this.$emit('handleFeatures')
        },
        handleConfirm () {
            this.$emit('on-ok')
        },
        handleCancel () {
            this.$emit('on-cancel')
            this.isShowModal = false
        },
        modalChange (changeStatus) {
            //  将模态框当前的状态返回给父组件 同步父组件里面的值
            this.$emit('on-visible-change', changeStatus)
        }
    }
}
</script>

<style lang="scss" scoped>
    /deep/ .ivu-modal-header {
        border: none;
        padding: 20px 30px 0 30px;
    }
    /deep/ .ivu-modal-body {
        padding: 40px;
    }
    .modal-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 40px;
        button + button {
            margin-left: 20px;
        }
    }
    /deep/ .ivu-modal-header-inner {
        color: #666;
        font-weight: 500;
    }
    /deep/ .ivu-modal-header {
        position: relative;
    }
    /deep/ .ivu-modal-header-inner::after {
        position: absolute;
        left: 0;
        top: 23px;
        content: '';
        height: 16px;
        border: 3px solid $light-color;

    }
    /deep/ .ivu-btn-circle {
        border-color: inherit;
    }
</style>
