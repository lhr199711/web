<template>
    <div class="entire">
        <div class="basic-info">
            <span>物流全程计划</span>
            <span class="basic-code">物流委托编号：{{}}</span>
        </div>
        <div class="route">
            <line-infi :routeResList="routeList" type="isBig"></line-infi>
        </div>
        <div class="time">
            <span class="time-title">计划时间</span>
            <div class="time-content" v-for="(list, id) in timeList" :key="id">
                <div v-if="id !== timeList.length - 1" style="padding-bottom: 10px">
                    <span class="time-log" style="font-size: 10px">{{ `${id === 0 ? '始' : '到'}` }}</span>
                    <span>{{ list.predctStartTime }}</span>
                    <!-- <span>{{ timestampFormat(list.predctStartTime) }}</span> -->
                </div>
                <div v-if="id !== 0">
                    <span class="time-log" style="font-size: 10px">{{ `${id === timeList.length - 1 ? '终' : '离'}` }}</span>
                    <span>{{ list.predctEndTime }}</span>
                    <!-- <span>{{ timestampFormat(list.predctEndTime) }}</span> -->
                </div>
            </div>
        </div>
        <div v-show="isBtnShow" class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="receivePlan">接收计划</Button>
            <Button shape="circle" size="large" @click="refusePlan">拒绝计划</Button>
        </div>
        <adt-my-modal title="系统提示" :showModal="showRefuseModal" @on-visible-change="visibleChange" @on-ok="handle()" @on-cancel="cancel()">
            <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <FormItem prop="reason" label="不同意原因备注">
                    <Input type="textarea" v-model="formInline.reason" placeholder="请输入内容..." style="width: 420px">
                    </Input>
                </FormItem>
            </Form>
        </adt-my-modal>
    </div>
</template>

<script>
    import LineInfi from '../components/LineInfo'
    import { timestampFormat } from '@/libs/utils'
    import validateRules from '@/libs/validateRules'
    export default {
        components: {
            LineInfi
        },
        data() {
            return {
                // 按钮显示隐藏
                isBtnShow: true,
                // 拒绝弹窗
                showRefuseModal: false,
                formInline: {
                    reason: ''
                },
                ruleInline: {
                    reason: [
                        validateRules.required('原因备注')[0],
                    ],
                },
                // 路线数据
                routeList: [
                    {
                        departurePort: 'AD_ONE',
                        departurePortTranslate: '重庆',
                        destinationPort: 'AD_TWO',
                        destinationPortTranslate: '北京',
                        trspMode: 'PUBROAD'
                    },
                    {
                        departurePort: 'AD_TWO',
                        departurePortTranslate: '北京',
                        destinationPort: 'AD_THREE',
                        destinationPortTranslate: '上海',
                        trspMode: 'RAILWAY'
                    }
                ],
                timeList: [
                    {
                        predctStartTime: 1605237264,
                        predctEndTime: 1605237264
                    },
                    {
                        predctStartTime: 1605237264,
                        predctEndTime: 1605237264
                    },
                    {
                        predctStartTime: 1605237264,
                        predctEndTime: 1605237264
                    },
                    {
                        predctStartTime: 1605237264,
                        predctEndTime: 1605237264
                    }
                ],
            }
        },
        methods: {
            // 拒绝计划绑定弹窗
            visibleChange (changeStatus) {
                this.showRefuseModal = changeStatus
            },
            // 接收计划
            receivePlan () {
                this.isBtnShow = false
            },
            // 拒绝计划
            refusePlan () {
                this.showRefuseModal = true
            },
            // 拒绝计划确认
            handle () {
                this.$refs["formInline"].validate((valid) => {
                    if (valid) {
                        this.showRefuseModal = false
                        this.$refs.formInline.resetFields()
                    }
                })
            },
            // 取消确认计划
            cancel () {
                this.showRefuseModal = false
                // 重置form表单
                this.$refs.formInline.resetFields()
            }
        },
    }
</script>

<style lang="scss" scoped>
    .entire {
        .basic-info {
            margin-bottom: 30px;
            padding: 20px 20px;
            border-bottom: 1px solid #C8C8C8;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #303548;
            .basic-code {
                margin-left: 80px;
            }
        }
        .route {
            background-color: white;
            padding: 30px 0 10px 0;
        }
        .time {
            display: flex;
            padding: 40px 80px;
            margin: 30px 0;
            background-color: white;
            .time-title {
                font-size: 13px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #333333;
            }
            .time-content {
                margin: 0 100px 0 15px;
                font-size: 13px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #333333;
                .time-log {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    line-height: 15px;
                    padding: 0px 1px;
                    margin-right: 3px;
                    border: 1px solid #333333;
                    border-radius: 50%;
                }
            }
        }
    }
</style>