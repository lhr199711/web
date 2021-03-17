<template>
    <div class="basics-details">
        <div class="public-detail">
            <div class="important-info">
                <Row>
                    <Col span="6">
                        <div class="name">场景名称：</div>
                        <div class="content">{{ sceneData.sceneName }}</div>
                    </Col>
                    <Col span="6">
                        <div class="name">场景编号：</div>
                        <div class="content">{{ sceneData.sceneCode }}</div>
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
                    <div class="cell">
                        <div class="cell-name">服务类型：</div>
                        <div class="cell-content">{{ sceneData.serverTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建人：</div>
                        <div class="cell-content">{{ sceneData.createByTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核人：</div>
                        <div class="cell-content">{{ sceneData.examineByTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">运输类型：</div>
                        <div class="cell-content">{{ sceneData.trspTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">创建时间：</div>
                        <div class="cell-content">{{ timestampFormat(sceneData.createDatetime) }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">审核时间：</div>
                        <div class="cell-content">{{ timestampFormat(sceneData.examineDatetime) }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name">物流类型：</div>
                        <div class="cell-content">{{ sceneData.logisticsTypeTranslate }}</div>
                    </div>
                    <div class="cell">
                        <div class="cell-name"></div>
                        <div class="cell-content"></div>
                    </div>
                    <div class="cell">
                        <div class="cell-name"></div>
                        <div class="cell-content"></div>
                    </div>
                    <div class="cell" style="width: 100%">
                        <div class="cell-name" style="width: 11.65%">共生场景：</div>
                        <div class="cell-content" style="width: 88.35%">
                            <div class="cell-scene" v-for="(scene, id) in sceneData.symbiosisScenesTranslate" :key="id">
                                {{ scene }}
                            </div>
                        </div>
                    </div>
                    <div class="cell" style="width: 100%">
                        <div class="cell-name" style="width: 11.65%">互斥场景：</div>
                        <div class="cell-content" style="width: 88.35%">
                            <div class="cell-scene" v-for="(scene, id) in sceneData.mutexScenes" :key="id">
                                {{ scene }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template>
            <div class="data-item">
                <adt-btns :titleNames="titleNames" :btnIndex="btnIndex" @handleBtn="handleBtn">
                    <div class="public-table-data">
                        <!-- 基础任务 -->
                        <Table :columns="basisColumns" :data="sceneData.taskBases" v-show="btnIndex == 1" height="500" stripe></Table>
                        <!-- 附加任务 -->
                        <Table :columns="attachColumns" :data="sceneData.taskAffixs" v-show="btnIndex == 2" height="500" stripe></Table>
                        <!-- 单据 -->
                        <Table :columns="documentsColumns" :data="sceneData.bills" v-show="btnIndex == 3" height="500" stripe></Table>
                    </div>
                </adt-btns>
            </div>
            <!-- <div class="spacing"></div> -->
            <!-- <div class="public-modify-record data-item">
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
            </div> -->
        </template>
    </div>
</template>

<script>
import { timestampFormat } from '@/libs/utils'
import { basisColumns, attachColumns, documentsColumns } from './data'
import { apiQueryEnableData } from '@/api/standard-mapper/sceneManage'
export default {
    name: 'BasicsDetails',
    props: {
        sceneCode: ''
    },
    data() {
        return {
            titleNames: ['基础任务', '附加任务', '单据'],
            btnIndex: 1,
            value: '1',
            basisColumns,
            attachColumns,
            documentsColumns,
            data1: [],
            sceneData: {},
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
                sceneCode: this.sceneCode
            }
            // const data = String(this.sceneData)
            apiQueryEnableData( data ).then(res => {
                if (res.code == 200) {
                    this.sceneData = res.data
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    // 修改tabs的样式
    /deep/.tabTitle {
        // margin-top: -5px;
        justify-content: center;
    }
    // 修改cell的场景样式
    .cell-scene {
        width: 110px;
        background-color: $filling-color;
        margin: 5px;
        text-align: center;
    }
    .data-item {
        display: inline-block;
        vertical-align: top;
        // width: 49%;
        width: 100%;
    }
    .spacing {
        width: 2%;
        display: inline-block;
    }
</style>
