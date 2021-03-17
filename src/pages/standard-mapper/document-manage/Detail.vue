<template>
    <div class="basics-details">
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="6">
                        <div class="name">单据名称：</div>
                        <div class="content">{{ sceneData.billsName }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">单据编号：</div>
                        <div class="content">{{ sceneData.billsCode }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">审核状态：</div>
                        <div class="content">{{ sceneData.examineStatusTranslate }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">启用状态：</div>
                        <div class="content">{{ sceneData.useStatusTranslate }}</div>
                    </Col>
                </Row>
            </div>
            <div class="normal-info-table">
                <div class="table">
                    <div class="cell" style="width: 50%">
                        <div class="cell-name" style="width: 20%">创建人：</div>
                        <div class="cell-content">{{ sceneData.createByTranslate }}</div>
                    </div>
                    <div class="cell" style="width: 50%">
                        <div class="cell-name" style="width: 20%">审核人：</div>
                        <div class="cell-content">{{ sceneData.examineByTranslate }}</div>
                    </div>
                    <div class="cell" style="width: 50%">
                        <div class="cell-name" style="width: 20%">创建时间：</div>
                        <div class="cell-content">{{ timestampFormat(sceneData.createDatetime) }}</div>
                    </div>
                    <div class="cell" style="width: 50%">
                        <div class="cell-name" style="width: 20%">审核时间：</div>
                        <div class="cell-content">{{ timestampFormat(sceneData.examineDatetime) }}</div>
                    </div>
                </div>
                <div class="remark">
                    <span class="remark-title">备注规则:</span>
                    <div class="remark-content">{{ sceneData.remark }}</div>
                </div>
            </div>
        </div>
        <template>
            <div class="data-item">
                <h3 class="data-item-title">数据项</h3>
                <div class="public-table-data">
                    <!-- 数据项 -->
                    <Table :columns="basisColumns" :data="dataItem" height="460" stripe />
                </div>
            </div>
            <div class="spacing"></div>
            <div class="public-modify-record record">
                <h3 class="table-title">修改记录</h3>
                <div class="collapse" style="min-height: 500px">
                    <Collapse v-model="value" accordion>
                        <Panel name="1">
                            <Row>
                                <Col span="10">
                                    修改人：刘笑笑  时间：2020/06/16
                                </Col>
                                <Col span="10">
                                    审核人：刘笑笑   时间：2020/06/16
                                </Col>
                                <Col span="4">修改内容</Col>
                            </Row>
                            <div slot="content">
                                <div class="content">
                                    <p class="list">
                                        <span class="content-tit">修改异常名称：</span>
                                        <ul>
                                            <li><i class="ico"></i>运输任务</li>
                                        </ul>
                                        <span><i class="ico ico-blue"></i>物流运输任务</span>
                                    </p>
                                    <hr class="line">
                                    <p class="list del-item">
                                        <span class="content-tit">修改异常名称：</span>
                                        <ul>
                                            <li>开始时间</li>
                                            <li>结束时间</li>
                                            <li>运输任务</li>
                                        </ul>
                                    </p>
                                    <hr class="line">
                                    <p class="list">
                                        <span class="content-tit">新增数据项：</span>
                                        <ul>
                                            <li>通知企业</li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </Panel>
                        <Panel name="2">
                            <Row>
                                <Col span="10">
                                    修改人：刘笑笑  时间：2020/06/16
                                </Col>
                                <Col span="10">
                                    审核人：刘笑笑   时间：2020/06/16
                                </Col>
                                <Col span="4">修改内容</Col>
                            </Row>
                            <div slot="content">
                                <div class="content">
                                    <p class="list">
                                        <span class="content-tit">修改异常名称：</span>
                                        <ul>
                                            <li><i class="ico"></i>运输任务</li>
                                        </ul>
                                        <span><i class="ico ico-blue"></i>物流运输任务</span>
                                    </p>
                                    <hr class="line">
                                    <p class="list del-item">
                                        <span class="content-tit">修改异常名称：</span>
                                        <ul>
                                            <li>开始时间</li>
                                            <li>结束时间</li>
                                            <li>运输任务</li>
                                        </ul>
                                    </p>
                                    <hr class="line">
                                    <p class="list">
                                        <span class="content-tit">新增数据项：</span>
                                        <ul>
                                            <li>通知企业</li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { timestampFormat } from '@/libs/utils'
import { apiQueryDetail } from '@/api/standard-mapper/documentManage'
import { basisColumns } from './data'
export default {
    name: 'BasicsDetails',
    props: {
        billsCode: ''
    },
    data() {
        return {
            titleNames: ['基础任务', '附加任务', '单据'],
            btnIndex: 1,
            value: '1',
            basisColumns,
            data1: [],
            sceneData: {},
            dataItem: []
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        handleBtn (index) {
            this.btnIndex = index + 1
        },
        // 格式化时间
        timestampFormat (timeStamp) {
            return timestampFormat (timeStamp)
        },
        getData () {
            const data = {
                billsCode: this.billsCode
            }
            apiQueryDetail( data ).then(res => {
                if (res.code == 200) {
                    this.sceneData = res.data.bills
                    this.dataItem = res.data.templateData
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    // 修改tabs的样式
    /deep/.tabTitle {
        margin-top: -5px;
    }
    // 修改cell的场景样式
    .cell-scene {
        width: 110px;
        background-color: $filling-color;
        margin: 5px;
        text-align: center;
    }
    // 备注规则
    .remark {
        display: flex;
        margin-top: 20px;
        height: 70px;
        line-height: 70px;
        .remark-title {
            width: 95px;
            margin-left: 25px;
            font-size: 16px;
        }
        .remark-content {
            width: 93%;
            padding-left: 10px;
            background-color:#F5F5F7;
        }
    }
    .data-item {
        display: inline-block;
        vertical-align: top;
        width: 30%;
        .data-item-title {
            margin: 0 0 5px 40px;
            font-weight: normal;
            font-size: 16px;
        }
    }
    .record {
        display: inline-block;
        vertical-align: top;
        width: 68%;
    }
    .spacing {
        width: 2%;
        display: inline-block;
    }
</style>