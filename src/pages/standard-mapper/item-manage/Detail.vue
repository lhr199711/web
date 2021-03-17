<template>
    <div>
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="6">
                        <div class="name">数据项名称：</div>
                        <div class="content">{{ itemData.label }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">数据项编号：</div>
                        <div class="content">{{ itemData.name }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">审核状态：</div>
                        <div class="content">{{ itemData.examineStatusTranslate }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">启用状态：</div>
                        <div class="content">{{ itemData.useStatusTranslate }}</div>
                    </Col>
                </Row>
            </div>
            <div class="normal-info-table">
                <div class="table">
                    <div class="cell">
                        <div class="cell-name">数据最大长度：</div>
                        <div class="cell-content">{{ itemData.maxLength }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">数据项分类：</div>
                        <div class="cell-content">{{ itemData.itemTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">控件类型：</div>
                        <div class="cell-content">{{ itemData.controlTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">数据来源：</div>
                        <div class="cell-content">{{ itemData.sourceTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">数据来源值：</div>
                        <div class="cell-content">{{ itemData.sourceValue }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">数据类型：</div>
                        <div class="cell-content">{{ itemData.dataTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">数据精度：</div>
                        <div class="cell-content">{{ itemData.accuracy }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建人：</div>
                        <div class="cell-content">{{ itemData.createByTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建时间：</div>
                        <div class="cell-content">{{ timestampFormat(itemData.createDatetime) }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核人：</div>
                        <div class="cell-content">{{ itemData.examineBy }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核时间：</div>
                        <div class="cell-content">{{ timestampFormat(itemData.examineDatetime) }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name"></div>
                        <div class="cell-content"></div>
                    </div>
                </div>
                <div class="item">
                    <div class="item-name">备注规则：</div>
                    <div class="item-content">{{ itemData.note }}</div>
                </div>
            </div>
        </div>
        <div class="public-modify-record">
            <h3 class="table-title">修改记录</h3>
            <div class="collapse">
                <Collapse v-model="value" accordion>
                    <Panel v-for="(item, index) in itemData.modifyPropertyRes" :key="index" :name="index + ''">
                        <Row>
                            <Col span="4">
                                时间：{{ timestampFormat(item.propertyList[0].modifyTime, true, '/') }}
                            </Col>
                            <Col span="6">
                                修改人：{{ item.propertyList[0].modifyByTranslate }}
                            </Col>
                            <Col span="14">修改内容</Col>
                        </Row>
                        <div slot="content">
                            <div class="content">
                                <ul class="record-list">
                                    <li v-for="(property, index) in item.propertyList" :key="index">
                                        <div class="modify-name">修改{{ property.property }}：</div>
                                        <div class="before-content"><span class="icon">前</span>{{ property.beforeData }}</div>
                                        <div class="after-content"><span class="icon">后</span>{{ property.laterData }}</div>
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
    import { apiTemplateDataQueryDetail } from '@/api/standard-mapper/dataItemManage'
    import { timestampFormat } from '@/libs/utils'
    export default {
        name: 'item-details',
        props: {
            name: ''
        },
        data () {
            return {
                value: '',
                itemData: {}
            }
        },
        created () {
            this.getData()
        },
        methods: {
            // 格式化时间
            timestampFormat (timeStamp) {
                return timestampFormat(timeStamp)
            },
            // 获取详情数据
            getData () {
                apiTemplateDataQueryDetail({ name: this.name }).then(({ data }) => {
                    this.itemData = data
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .public-modify-record {
        .collapse {
            max-height: 480px;
            min-height: calc(100vh - 455px);
        }
    }
</style>
