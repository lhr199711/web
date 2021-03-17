<template>
    <div>
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="6">
                        <div class="name">场所名称：</div>
                        <div class="content">{{ itemData.sttnName }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">场所编号：</div>
                        <div class="content">{{ itemData.sttnCode }}</div>
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
                        <div class="cell-name">场所简称：</div>
                        <div class="cell-content">{{ itemData.sttnAbbr }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">运输方式：</div>
                        <div class="cell-content" v-if="itemData.trspModeTranslate">
                            <span v-for="(item, key) in itemData.trspModeTranslate.split(';')" :key="key" style="marginLeft: 4px;">{{item}}</span>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建人：</div>
                        <div class="cell-content">{{ itemData.createByTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">国家：</div>
                        <div class="cell-content">{{ itemData.countryTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">海关关区：</div>
                        <div class="cell-content">{{ itemData.customsCodeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建时间：</div>
                        <div class="cell-content">{{ timestampFormat(itemData.createDatetime) }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">省份：</div>
                        <div class="cell-content">{{ itemData.provinceTranslate == 'null' ? '' : itemData.provinceTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">场所类型：</div>
                        <div class="cell-content">{{ itemData.sttnTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核人：</div>
                        <div class="cell-content">{{ itemData.examineByTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">城市：</div>
                        <div class="cell-content">{{ itemData.cityTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">监管场所编码：</div>
                        <div class="cell-content">{{ itemData.supvSttn }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核时间：</div>
                        <div class="cell-content">{{ timestampFormat(itemData.examineDatetime) }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">地址：</div>
                        <div class="cell-content">{{ itemData.sttnAddr }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">企业名称：</div>
                        <div class="cell-content">{{ itemData.etpsName }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name"></div>
                        <div class="cell-content"></div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">业务负责人：</div>
                        <div class="cell-content">{{ itemData.rspderTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">企业代码：</div>
                        <div class="cell-content">{{ itemData.etpsCode }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name"></div>
                        <div class="cell-content"></div>
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
    import { apiDetail } from '@/api/standard-mapper/siteManage'
    export default {
        props: {
            sttnCode: ''
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
                    sttnCode: this.sttnCode
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