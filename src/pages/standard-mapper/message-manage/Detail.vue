<template>
    <div>
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="6">
                        <div class="name">消息名称：</div>
                        <div class="content">{{ itemData.messageName }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">消息编号：</div>
                        <div class="content">{{ itemData.messageCode }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">审核状态：</div>
                        <div class="content">{{ itemData.examineStatusTranslate }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">启用状态：</div>
                        <div class="content">{{ itemData.templateStatusTranslate }}</div>
                    </Col>
                </Row>
            </div>
            <div class="normal-info-table">
                <div class="table">
                    <div class="cell">
                        <div class="cell-name">业务环节：</div>
                        <div class="cell-content">{{ itemData.businessTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建人：</div>
                        <div class="cell-content">{{ itemData.createByTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核人：</div>
                        <div class="cell-content">{{ itemData.examineByTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">消息内容：</div>
                        <div class="cell-content">{{ itemData.messageContent }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建时间：</div>
                        <div class="cell-content">{{ timestampFormat(itemData.createDatetime) }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核时间：</div>
                        <div class="cell-content">{{ timestampFormat(itemData.examineDatetime) }}</div>
                    </div>
                </div>
                <div class="item">
                    <div class="item-name">备注规则：</div>
                    <div class="item-content">{{ itemData.remark }}</div>
                </div>
            </div>
        </div>
        <div class="public-modify-record" v-if="modifyData.length">
            <h3 class="table-title">修改记录</h3>
            <div class="collapse">
                <Collapse v-model="value" accordion>
                    <Panel v-for="(item, key) in modifyData" :key="key" :name="key + 1 + ''">
                        <Row v-if="item.propertyList">
                            <Col span="4">
                                时间：{{ timestampFormat(item.propertyList[0].modifyTime) }}
                            </Col>
                            <Col span="6">
                                修改人：{{ item.propertyList[0].modifyByTranslate }}
                            </Col>
                            <Col span="14">修改内容</Col>
                        </Row>
                        <div slot="content">
                            <div class="content" v-for="(list, index) in item.propertyList" :key="index">
                                <ul class="record-list">
                                    <li>
                                        <div class="modify-name">修改{{ list.property }}：</div>
                                        <div class="before-content"><span class="icon">前</span>{{ list.beforeData }}</div>
                                        <div class="after-content"><span class="icon">后</span>{{ list.laterData }}</div>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </div>
    </div>
</template>

<script>
    import { timestampFormat } from '@/libs/utils'
    import { apiDetail } from '@/api/standard-mapper/messageManage'
    export default {
        props: {
            messageCode: ''
        },
        data () {
            return {
                value: '',
                itemData: {},
                modifyData: []
            }
        },
        mounted () {
            this.getData()
        },
        methods: {
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp)
            },
            getData () {
                const data = {
                    messageCode: this.messageCode
                }
                apiDetail ( data ).then(res => {
                    if (res.code == 200) {
                        this.itemData = res.data.obj
                        this.modifyData = res.data.records
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .ivu-col-span-11{
        text-align: right;
        padding-right: 30px;
    }
</style>