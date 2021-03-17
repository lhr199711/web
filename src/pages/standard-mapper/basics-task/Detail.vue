<template>
    <div class="basics-details">
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="6">
                        <div class="name">基础任务名称：</div>
                        <div class="content">{{ taskData.taskName }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">基础任务编号：</div>
                        <div class="content">{{ taskData.taskCode }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">审核状态：</div>
                        <div class="content">{{ taskData.examineStatusTranslate }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">启用状态：</div>
                        <div class="content">{{ taskData.useStatusTranslate }}</div>
                    </Col>
                </Row>
            </div>
            <div class="normal-info-table">
                <div class="table">
                    <div class="cell">
                        <div class="cell-name">物流类型：</div>
                        <div class="cell-content">{{ taskData.logisticsTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建人：</div>
                        <div class="cell-content">{{ taskData.createByTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核人：</div>
                        <div class="cell-content">{{ taskData.examineBy }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">运输类型：</div>
                        <div class="cell-content">{{ taskData.trspTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建时间：</div>
                        <div class="cell-content">{{ timestampFormat(taskData.createDatetime) }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核时间：</div>
                        <div class="cell-content">{{ timestampFormat(taskData.examineDatetime) }}</div>
                    </div>
                </div>
            </div>
        </div>
        <template>
            <div class="data-item">
                <div class="table-title">数据项</div>
                <div class="table-padding">
                    <Table :columns="columns" :data="taskData.taskDatas" max-height="570" stripe>
                        <template #rules="{ row }">
                            <Button size="small" type="primary" ghost @click="showRules(row)">查看校验规则</Button>
                        </template>
                        <template #message="{ row }">
                            <Button size="small" type="primary" ghost @click="showMsg(row)">查看提示信息</Button>
                        </template>
                    </Table>
                </div>
            </div>
            <!-- <div class="modify-record public-modify-record">
                <div class="table-title">修改记录</div>
                <div class="collapse">
                    <Collapse v-model="value" accordion>
                        <Panel v-for="item in 20" :key="item" :name="item + ''">
                            <Row>
                                <Col span="7">
                                    时间：2020/06/16
                                </Col>
                                <Col span="13">
                                    修改人：刘笑笑
                                </Col>
                                <Col span="4">修改内容</Col>
                            </Row>
                            <div slot="content">
                                <div class="content">
                                    <ul class="record-list">
                                        <li>
                                            <div class="modify-name">修改基础任务名称：</div>
                                            <div class="before-content"><span class="icon">前</span>字符串</div>
                                            <div class="after-content"><span class="icon">后</span>字符串</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            </div> -->
        </template>
        <!-- 查看提示信息modal -->
        <adt-my-modal
            title="数据项提示信息"
            :showModal="isEnterInfoModalShow"
            :showCancelBtn="false"
            @on-visible-change="enterInfoVisibleChange"
            @on-ok="confirm()"
        >
            <div class="msg" style="min-height: 100px; margin: 0 20px; padding: 12px; background-color: #f9f9f9;">
                {{ message ? message : '暂无提示信息' }}
            </div>
        </adt-my-modal>
        <!-- 查看校验规则modal -->
        <adt-my-modal
            title="数据项校验规则"
            :showModal="isRuleModalShow"
            :showCancelBtn="false"
            @on-visible-change="ruleVisibleChange"
            @on-ok="confirm('rule')"
        >
            <ul v-if="rules.length" style="display: flex; flex-wrap: wrap;">
                <li v-for="(rule, index) in rules" :key="index" style="margin: 12px 20px 20px 20px;">{{ rule }}</li>
            </ul>
            <span v-else>暂无校验规则</span>
        </adt-my-modal>
    </div>
</template>

<script>
    import { apiBasicTaskQueryDetail } from '@/api/standard-mapper/basicTask'
    import { timestampFormat } from '@/libs/utils'
    export default {
        name: 'BasicsDetail',
        props: {
            taskCode: ''
        },
        data () {
            return {
                value: '1',
                isEnterInfoModalShow: false,
                isRuleModalShow: false,
                columns: [
                    {
                        title: '数据项编码',
                        align: 'center',
                        key: 'dataCode'
                    },
                    {
                        title: '数据项名称',
                        align: 'center',
                        key: 'dataName'
                    },
                    {
                        title: '排序值',
                        align: 'sort',
                        key: 'sort'
                    },
                    {
                        title: '关联数据项',
                        align: 'center',
                        key: 'relationData'
                    },
                    {
                        title: '是否多条数据',
                        align: 'center',
                        key: 'isMoreTranslate'
                    },
                    {
                        title: '是否可编辑',
                        align: 'center',
                        key: 'isEditTranslate'
                    },
                    {
                        title: '是否展示',
                        align: 'center',
                        key: 'isShowTranslate'
                    },
                    {
                        title: '校验规则',
                        align: 'center',
                        slot: 'rules',
                        width: 120
                    },
                    {
                        title: '提示信息',
                        align: 'center',
                        slot: 'message',
                        width: 120
                    },
                ],
                message: '',
                rules: [],
                taskData: {}
            }
        },
        created () {
            this.getData()
        },
        methods: {
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat (timeStamp)
            },
            getData () {
                apiBasicTaskQueryDetail({ taskCode: this.taskCode }).then(({ data }) => {
                    this.taskData = data
                })
            },
            showRules (row) {
                this.rules = row.rulesTranslate ? row.rulesTranslate.split(';') : []
                this.isRuleModalShow = true
            },
            showMsg (row) {
                this.message = row.message
                this.isEnterInfoModalShow = true
            },
            enterInfoVisibleChange (changeStatus) {
                this.isEnterInfoModalShow = changeStatus
            },
            ruleVisibleChange (changeStatus) {
                this.isRuleModalShow = changeStatus
            },
            confirm (type) {
                if (type === 'rule') {
                    this.isRuleModalShow = false
                } else {
                    this.isEnterInfoModalShow = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .basics-details {
        .data-item {
            display: inline-block;
            // width: 58%;
            // margin-right: 2%;
            width: 100%;
            .table-padding {
                min-height: calc(100vh - 325px);
                padding: 20px;
                background-color: #fff;
            }
        }
        .modify-record {
            width: 40%;
            display: inline-block;
            vertical-align: top;
            .collapse {
                min-height: calc(100vh - 325px);
            }
        }
        .table-title {
            margin: 0 0 6px 40px;
        }
    }
</style>
