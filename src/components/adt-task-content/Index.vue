<template>
    <div class="package">
        <div v-if="isBasicTask">
            <!-- <p>基础任务内容: `服务总价:${} 总时长：${}` </p> -->
            <div>
                <span>基础任务内容：</span>
                <template v-if="showPriceAndTime">
                    <span v-if="isShow">
                        <span class="price">(服务总价：{{ basicTaskData.taskCost }}{{ basicTaskData.currTranslate }}</span>
                        <span class="price">总时长：{{ basicTaskData.serverDuration }}{{ basicTaskData.serverDurationUnitTranslate }})</span>
                    </span>
                </template>
            </div>
            <div class="task">
                <Row>
                    <Col class="task-content" :span="spanBasicTasks" v-for="(task, id) in basicTask" :key="id">{{task.taskName}}</Col>
                </Row>
            </div>
        </div>
        <div v-if="isAdditionalTasks">
            <p>附加任务内容:</p>
            <div class="task">
                <Row>
                    <Col class="task-content" :span="spanNumAdditionalTasks" v-for="(task, id) in additionalTasks" :key="id">
                    {{task.taskName}}
                    <span class="price" v-if="isShow">(价格：{{task.taskCost}}{{task.currTranslate}} 时长：{{task.serverDuration}}{{task.serverDurationUnitTranslate}})</span>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdtTaskContent',
    props: {
        isBasicTask: {
            type: Boolean,
            default: true
        },
        isAdditionalTasks: {
            type: Boolean,
            default: true
        },
        basicTask: {
            type: Array,
            default: function () {
                return []
            },
        },
        basicTaskData: {
            type: Object,
            default: function () {
                return {}
            },
        },
        additionalTasks: {
            type: Array,
            default: function () {
                return []
            },
        },
        spanBasicTasks: {
            type: Number,
            default: 4
        },
        spanNumAdditionalTasks: {
            type: Number,
            default: 8
        },
        showPriceAndTime: {
            type: Boolean,
            default: true
        },
        isShow: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
        }
    },
}
</script>

<style lang="scss" scoped>
.package {
    .price{
        color: $secondary-font-color;
    }
    .task {
        margin: 10px 0;
        padding: 15px;
        // background-color: $background-color;
        background-color: white;
        .task-content {
            padding: 5px;
        }
    }
}
</style>
