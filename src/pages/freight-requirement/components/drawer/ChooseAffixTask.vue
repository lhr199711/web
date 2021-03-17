<template>
    <div class="set-time-demand">
        <Drawer
            v-model="isShowDrawer"
            width="1100"
            @on-visible-change="drawerChange"
        >
            <h3>选择附加任务</h3>
            <Form
                label-position="top"
                ref="formItemData"
                label-colon
            >
                <adt-tab-btns
                    class="scene-tab"
                    :titleNames="sceneNames"
                    :isSmallBtn="true"
                    :btnIndex="sceneActiveIndex || -1"
                    @handleBtn="handleSceneBtn"
                />
                <div class="affix-lists">
                    <FormItem v-for="(scene, index) in sceneList" :key="index" v-show="sceneActiveIndex === index + 1" prop="affix">
                        <CheckboxGroup v-model="scene.affixTaskList">
                            <div v-for="(affix, idx) in scene.affixRes" :key="idx" class="affix">
                                <Checkbox :label="`${affix.taskCode}~${affix.taskName}`">{{ affix.taskName }}</Checkbox>
                            </div>
                        </CheckboxGroup>
                    </FormItem>
                </div>
            </Form>
            <div class="drawer-btns">
                <Button type="primary" shape="circle" size="large" @click="submitForm">确定</Button>
                <Button shape="circle" size="large" @click="isShowDrawer = false">取消</Button>
                <!-- <Button shape="circle" size="large" @click="feedback">没有附加服务反馈客服</Button> -->
            </div>
        </Drawer>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import { apiGetSceneAffix } from '@/api/freightRequirement'
    export default {
        props: {
            showDrawer: {
                type: Boolean,
                default: false
            },
            defaultData: {
                type: Array,
                default: () => []
            },
            requestData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                isShowDrawer: false,
                sceneActiveIndex: '',
                sceneList: [],
                sceneNames: []
            }
        },
        created () {

        },
        watch: {
            showDrawer: {
                handler (to) {
                    this.isShowDrawer = to
                },
                immediate: true
            },
            // defaultData (newVal) {
            //     this.sceneActiveIndex = ''
            //     // 将选中的附加任务返显
            //     for (const scene of this.sceneList) {
            //         scene.affixTaskList = []
            //         for (const task of newVal) {
            //             if (scene.sceneName === task.sceneName) {
            //                 scene.affixTaskList = task.affixTaskList
            //             }
            //         }
            //     }
            // },
            requestData (newVal) {
                // 请求可以会慢，先清除数据
                this.sceneList = []
                this.sceneNames = []
                // 调用接口获取场景以及下面的附加任务
                apiGetSceneAffix({ data: newVal }).then(({ data }) => {
                    this.sceneList = data
                    for (const scene of this.sceneList) {
                        this.sceneNames.push(scene.sceneName)
                    }
                    // this.sceneActiveIndex = ''
                    this.sceneActiveIndex = 1
                    // 将选中的附加任务返显
                    for (const scene of this.sceneList) {
                        scene.affixTaskList = []
                        for (const task of this.defaultData) {
                            if (scene.sceneName === task.sceneName) {
                                scene.affixTaskList = task.affixTaskList
                            }
                        }
                    }
                })
            }
        },
        methods: {
            submitForm () {
                this.$refs.formItemData.validate(valid => {
                    if (valid) {
                        this.$emit('submit-form', JSON.parse(JSON.stringify(this.sceneList)))
                        this.isShowDrawer = false
                    }
                })
            },
            drawerChange (changeStatus) {
                // 将模态框当前的状态返回给父组件 同步父组件里面的值
                this.$emit('on-visible-change', changeStatus)
            },
            // 点击场景
            handleSceneBtn (index) {
                this.sceneActiveIndex = ++index
            }
        }
    }
</script>

<style lang="scss" scoped>
    .scene-tab {
        @extend %scrollbar-x;
        padding-bottom: 20px;
        /deep/ .tab-container {
            flex-wrap: nowrap;
        }
    }
    .ivu-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        .affix {
            flex-shrink: 0;
            width: 200px;
            margin-top: 20px;
        }
    }
</style>
