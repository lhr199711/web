<template>
    <div class="adt-recomfirm-modal">
        <Modal
            v-model="isShowModal"
            :title="title ? title : $t('common.systemHint')"
            :mask-closable="false"
            :footer-hide="true"
            @on-cancel="handleCancel"
            @on-visible-change="modalChange">
            <div class="message">
                <Icon type="md-alert" /><span v-html="message">{{ message }}</span>
            </div>
            <div class="modal-footer">
                <Button v-show="cancelShow" shape="circle" @click="handleCancel">{{ cancelText ? cancelText : $t('common.cancel') }}</Button>
                <Button type="primary" shape="circle" @click="handleConfirm">{{ okText ? okText : $t('common.ok') }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: 'adt-reconfirm-modal',
    props: {
        title: {
            type: String,
            default: ''
        },
        showModal: {
            type: Boolean,
            default: false
        },
        cancelShow: {
            type: Boolean,
            default: true
        },
        message: {
            type: String,
            default: '确认删除吗？'
        },
        okText: {
            type: String
        },
        cancelText: {
            type: String
        }
    },
    data () {
        return {
            loading: true,
            isShowModal: false
        }
    },
    watch: {
        showModal (to) {
            this.isShowModal = to
        }
    },
    methods: {
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
    /deep/ .ivu-modal-header{
        border: none;
        padding: 20px 30px;
    }
    .message {
        text-align: center;
        margin-bottom: 20px;
        /deep/ .ivu-icon {
            color: $warning-color;
            font-size: 18px;
            margin-right: 6px;
        }
    }
    .modal-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        button + button {
            margin-left: 12px;
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
        top: 18px;
        content: '';
        height: 14px;
        border: 2px solid $light-color;

    }
    /deep/ .ivu-modal-body {
        .message {
            a {
                color: $light-color !important;
                text-decoration: underline;
            }
        }
    }
</style>
