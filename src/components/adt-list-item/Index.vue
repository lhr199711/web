<template>
    <div>
        <Checkbox v-if="showCheckbox" class="card-check" v-model="isCheck" @on-change="checkChange(logistics, isCheck)"></Checkbox>
        <Card :class="{'card-margin': showCheckbox == true}">
            <slot name="tab-title"></slot>
            <slot name="tab-operat"></slot>
            <Divider />
            <slot name="tab-content"></slot>
            <slot name="tab-bottom"></slot>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'adt-list-item',
    props: {
        // 是否展示checkbox
        showCheckbox: {
            type: Boolean,
            default: false
        },
        logistics: {
            type: Object,
            default: () => {}
        },
        resetCheckStatus: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            showModal: false,
            isCheck: false
        }
    },
    watch: {
        resetCheckStatus () {
            this.isCheck = false
        }
    },
    methods: {
        checkChange (data, status) {
            this.$emit('checkData', data, status)
        }
    }
}
</script>
