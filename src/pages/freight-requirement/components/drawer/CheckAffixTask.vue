<template>
    <div>
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>查看附加服务</h3>
            <div v-for="(scene, index) in dfaultData" :key="index">
                <h6>{{ scene.sceneName }}<div class="line"></div></h6>
                <div class="affix-task-lists">
                    <div v-for="(affixTask, idx) in scene.affixTaskList" :key="idx" class="affix">
                        {{ affixTask.split('~')[1] }}
                    </div>
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script>
    export default {
        props: {
            showDrawer: {
                type: Boolean,
                default: false
            },
            dfaultData: {
                type: Array,
                default: () => [
                    {
                        sceneName: '场景1',
                        affixTaskList: ['1~附加任务1', '2~附加任务2', '2~附加任务2', '2~附加任务2', '2~附加任务2', '2~附加任务2', '2~附加任务2']
                    },
                    {
                        sceneName: '场景2',
                        affixTaskList: ['3~附加任务3', '2~附加任务2', '2~附加任务2', '2~附加任务2', '2~附加任务2', '2~附加任务2', '2~附加任务2']
                    }
                ]
            }
        },
        data () {
            return {
                isShowDrawer: false
            }
        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                },
                immediate: true
            }
        },
        methods: {
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .affix-task-lists {
        display: flex;
        flex-wrap: wrap;
        .affix {
            margin: 0 120px 30px 0;
        }
    }
</style>
