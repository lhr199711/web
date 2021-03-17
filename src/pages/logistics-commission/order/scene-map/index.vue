<template>
    <div class="search-status">
        <div
            v-for="(status, id) in List"
            :key="id"
            class="status-item"
            @click="auditStatus(id, status)"
            :class="{ active: activeIndex === id }"
        >
            {{ status.label }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'search-status',
        props: {
            List: {
                type: Array,
                default () {
                    return []
                },
            },
        },
        data () {
            return {
                activeIndex: 0,
            }
        },
        watch: {
            List () {
                if (this.List.length > 0) {
                    this.auditStatus(0, this.List[0])
                }
            }
        },
        methods: {
            auditStatus (index, code) {
                // 控制状态切换传值
                this.activeIndex = index
                this.$emit('auditStatus', code)
            },
        },
    }
</script>

<style scoped lang="scss">
    .search-status {
        display: flex;
        align-items: center;
        .status-tit {
            font-size: 16px;
            font-weight: bolder;
        }
        .status-item {
            display: inline-block;
            // width: 99px;
            padding: 0 6px;
            height: 24px;
            margin-right: 20px;
            background: rgba(229, 229, 229, 1);
            border-radius: 4px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            line-height: 24px;
            cursor: pointer;
            color: #333333;
        }
        .active {
            border: 1px solid #02adb5;
            background-color: #f5f5f5;
        }
    }
</style>
