<template>
    <div class="task-list">
        <span
            class="item"
            v-for="(item, index) in list"
            :key="index"
            @click="auditStatus(index,item)"
            :class="{active: activeIndex == index}"
        >
            {{ item.taskName }}
            <span v-show="item.taskType === 'A'" class="text">
                (价格: ￥
                <span class="i-i">{{ item.taskCost }} / {{ item.goosUnit }}</span>
                <span class="i-i">
                    总时长：{{ item.serverDuration
                    }}{{ item.serverDurationUnit }}
                </span>)
            </span>
        </span>
    </div>
</template>

<script>
export default {
    name: "taskList",
    props: {
        list: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            activeIndex: 0,
        };
    },
    created () {

    },
    mounted () {
        this.auditStatus(0,this.list[0])
    },
    methods: {
        // 控制状态切换传值
        auditStatus (index, item) {
            this.activeIndex = index
            this.$emit('handelTask', item)
        },
    }
};
</script>

<style scoped lang="scss">
.task-list {
    background: rgba(249, 249, 249, 1);
    height: 53px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    overflow-x: auto;
    @extend %scrollbar-crosswise;
    .item {
        margin-left: 20px;
        margin-right: 100px;
        white-space: nowrap;
        cursor: pointer;
        color: $conventional-font-color;
        .i-i {
            margin-right: 20px;
        }
    }
    .text {
        color: $secondary-font-color;
        font-weight: normal;
    }
    .active {
        font-size: 14px;
        font-weight: bold;
        color: $light-color;
        position: relative;
        &::before {
            content: ' ';
            position: absolute;
            left: -10px;
            top: 8px;
            width: 6px;
            height: 6px;
            background-color: $light-color;
            border-radius: 3px;
        }
    }
}
</style>
