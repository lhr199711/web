<template>
    <div>
        <slot></slot>
        <Button v-if="allDelShow" @click="delClick">
           批量删除
           <svg class="iconfont" aria-hidden="true">
                <use xlink:href="#icon-andaotongV3ICON_piliangshanchu"></use>
            </svg>
        </Button>
        <adt-reconfirm-modal :showModal="showModal" @on-visible-change="visibleChange" @on-ok="allDelClick" />
    </div>
</template>

<script>
export default {
    name: 'AdtButton',
    props: {
        allDelShow: {
            type: Boolean,
            default: false
        },
        selectList: {
            type: [Object, Array]
        },
        delUrl: {
            type: Function
        }
    },
    data () {
        return {
            showModal: false
        }
    },
    methods: {
        // 点击批量删除显示modal
        delClick () {
            // this.selectList是对象格式
            if (!Array.isArray(this.selectList)) {
                const values = Object.values(this.selectList)
                if (!values[0] || (values[0] && values[0].length <= 0)) {
                    this.$Message.warning('请选择要删除的数据')
                    return
                }
                this.showModal = true
            } else {
                // this.selectList是数组格式
                if (!this.selectList.length) {
                    this.$Message.warning('请选择要删除的数据')
                    return
                }
                this.showModal = true
            }
        },
        // 二次确认确定
        allDelClick () {
            this.delUrl(this.selectList).then(res => {
                if (res.data) {
                    this.$Message.success('操作成功')
                } else {
                    this.$Message.error('操作失败')
                }
            }).catch(() => {
                this.$Message.error('操作失败')
            })
        },
        visibleChange (changeStatus) {
            this.showModal = changeStatus
        }
    }
}
</script>

<style lang="scss" scoped>
    .adt-button {
        display: inline-block;
        width: 60%;
    }
    /deep/ .ivu-modal-header{
        border: none;
    }
    /deep/ .ivu-btn {
        &:first-child {
            margin-left: 30px;
        }
        margin-left: 20px;
        & > span {
            display: flex;
            justify-content: center;
            align-items: center;
            /deep/ .ivu-icon, /deep/ svg {
                margin-left: 6px;
                font-size: 16px;
                color: $conventional-font-color;
            }
        }
    }
</style>
