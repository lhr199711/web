<template>
    <div class="flod-box">
        <div class="btns">
            <slot name="btns-start"></slot>
            <slot name="btns-end"></slot>
        </div>
        <Row v-for="(item,index) in list" :key="index">
            <Col span="24">
                <div class="item-box">
                    <div class="header">
                        <span>{{item.cargoName}}</span>
                        <div>
                            <span class="btn">
                                <span v-if="!item.isContentShow" @click.de="onOpen(item,index)">展开</span>
                                <span v-if="item.isContentShow" @click="onClose(item,index)">收起</span>
                            </span>
                            <span class="icon">
                                <Icon v-if="item.isContentShow" type="ios-arrow-down" />
                                <Icon v-else type="ios-arrow-up" />
                            </span>
                        </div>
                    </div>
                    <!--这里的可以使用动画-->
                    <div class="main-box" v-show="item.isContentShow">
                        <div class="public-form-content">
                            <Col span="8">
                                <p class="item-form-title">货物信息</p>
                                <div class="table-boxjz">
                                    <div class="table-rowjz">
                                        <div>货物名称：</div>
                                        <div>{{item.cargoName}}</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>唛头：</div>
                                        <div>{{item.markNo}}</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>HS编码：</div>
                                        <div>{{item.hsCode}}</div>
                                    </div>
                                    <div v-if="isOne" class="table-rowjz">
                                        <div>毛重：</div>
                                        <div>{{item.grossWeight}}</div>
                                    </div>
                                    <div v-if="isOne" class="table-rowjz">
                                        <div>净重：</div>
                                        <div>{{item.netWeight}}</div>
                                    </div>
                                    <div v-if="isOne" class="table-rowjz">
                                        <div>货物件数：</div>
                                        <div>{{item.cargoQty}}</div>
                                    </div>
                                    <div v-if="isOne" class="table-rowjz">
                                        <div>货物体积：</div>
                                        <div>{{item.cargoVol}}</div>
                                    </div>
                                    <div
                                        v-if="!isOne"
                                        class="table-rowjz"
                                        v-for="(item,index) in 4"
                                        :key="index"
                                    >
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </Col>
                            <Col span="8">
                                <p class="item-form-title">一级包装</p>
                                <div class="table-boxjz">
                                    <div class="table-rowjz">
                                        <div>包装类型：</div>
                                        <div>{{item.one.packTypeTranslate}}</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>包装毛重：</div>
                                        <div>{{item.one.grossWeight}} kg</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>包装净重：</div>
                                        <div>{{item.one.netWeight}} kg</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>包装件数：</div>
                                        <div>{{item.one.packQty}}</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>包装体积：</div>
                                        <div>{{item.one.packVol}} m³</div>
                                    </div>
                                    <div class="table-rowjz" v-for="(item,index) in 2" :key="index">
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </Col>
                            <Col span="8">
                                <p class="item-form-title">二级包装</p>
                                <div class="table-boxjz">
                                    <div class="table-rowjz">
                                        <div>包装类型：</div>
                                        <div>{{item.two.packTypeTranslate}}</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>包装毛重：</div>
                                        <div>{{item.two.grossWeight}} kg</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>包装净重：</div>
                                        <div>{{item.two.netWeight}} kg</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>包装件数：</div>
                                        <div>{{item.two.packQty}}</div>
                                    </div>
                                    <div class="table-rowjz">
                                        <div>包装体积：</div>
                                        <div>{{item.two.packVol}} m³</div>
                                    </div>
                                    <div class="table-rowjz" v-for="(item,index) in 2" :key="index">
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </Col>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        arr: {
            type: Array,
            default: [],
        },
        isOne: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            list: [], // 得到的数据
        }
    },
    watch: {},
    computed: {
        cptList () {
            return this.arr
        },
    },
    created () {
        this.initList()
    },
    mounted () { },
    methods: {
        initList () {
            // 这个地方有bug 后端的数据机构不确定
            let arr = this.cptList.map((item) => {
                if (item.entrustPackagingRes == null) {
                    item.entrustPackagingRes = [{}, {}]
                }
                return {
                    ...item,
                    one:
                        item.entrustPackagingRes.find(
                            (item) => item.packPcode == '0'
                        ) || {},
                    two:
                        item.entrustPackagingRes.find(
                            (item) => item.packPcode !== '0'
                        ) || {},
                    isContentShow: false,
                }
            })
            this.list = arr
        },
        onOpen (item, index) {
            //打开
            this.list[index].isContentShow = true
        },
        onClose (item, index) {
            // 收起
            this.list[index].isContentShow = false
        },
    },
}
</script>

<style lang="scss" scoped>
/deep/.ivu-row {
    margin-bottom: 10px;
}
/deep/.ivu-col-span-24 {
    display: flex;
}
/deep/.ivu-checkbox + span {
    display: none;
}
/deep/.ivu-checkbox {
    padding: 4px 6px;
}
.btns {
    padding: 8px 0;
    /deep/.ivu-btn {
        margin-right: 12px;
    }
}
.item-form-title {
    height: 35px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 35px;
}
.table-boxjz {
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    .table-rowjz {
        height: 30px;
        line-height: 30px;
        display: flex;
        border-bottom: 1px solid #e6e6e6;
        div {
            font-size: 14px;
            height: 100%;
            font-weight: bold;
            color: rgba(102, 102, 102, 1);

            &:first-child {
                width: 120px;
                text-align: right;
                background: #f5f6f8;
                border-right: 1px solid #e6e6e6;
            }
            &:last-child {
                flex: 1;
                background: #fff;
                padding-left: 8px;
            }
        }
    }
}
.flod-box {
    .item-box {
        width: 100%;
    }
    .header {
        width: 100%;
        height: 40px;
        padding: 0 20px;
        background: #fff6e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn > span {
            border: 1px solid #ccc;
            background: #fff;
            height: 27px;
            line-height: 27px;
            padding: 4px 8px;
            border-radius: 4px;
            margin: 0 10px;
            cursor: pointer;
        }
    }
    .main-box {
        width: 100%;
        padding: 5px;
        background: #f9f9f9;
    }
}
</style>