<template>
    <div class="search-status">
        <div class="status-tit">状态：</div>
        <div
            v-for="(status, id) in StatusList"
            :key="id"
            class="status-item"
            @click="auditStatus(id,status.value)"
            :class="{active: activeIndex == id}"
        >{{ status.label }}</div>
    </div>
</template>

<script>
export default {
    name: 'search-status',
    props: {
        StatusList: {
            type: Array,
            default () {
                return []
            },
        },
    },
    data () {
        return {
            activeIndex: null,
        }
    },
    created () { },
    mounted () { },
    methods: {
        auditStatus (index, value) {
            // 控制状态切换传值
            if (this.activeIndex != index) {
                this.activeIndex = index
                this.$emit('auditStatus', value)
            } else {
                this.activeIndex = -1
                this.$emit('auditStatus', '')
            }
        },
    },
}
</script>

<style scoped lang="scss">
.search-status {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .status-tit {
        font-size: 14px;
        font-weight: bolder;
    }
    .status-item {
        padding: 5px 10px;
        margin: 0px 10px;
        cursor: pointer;
        color: #333333;
        line-height: 1.2;
    }
    .active {
        background-color: #f5f5f5;
    }
}
</style>
