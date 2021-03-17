<template>
    <div class="receipt-box">
        <div class="dashed-line"></div>
        <div class="name">
            货物进/出库单
            Stock IN/OUT List
        </div>
        <div class="main-box">
            <div class="row">
                <Row>
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">
                                制单时间
                                <br />（Date）：
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">制单时间（Date）：</div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div class="row node">订单双方信息（Details of Parties）</div>
            <div class="row">
                <Row>
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">
                                制单时间
                                <br />（Date）：
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">制单时间（Date）：</div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div class="row node">订单双方信息（Details of Parties）</div>

            <div class="row">
                <div class="op-box">
                    <div class="table-c" v-for="row in 7">
                        制单时间
                        <br />（Date）：
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="op-box">
                    <div class="table-c" v-for="row in 7">
                        <Input></Input>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="op-box">
                    <div class="table-c" v-for="row in 7">
                        <Input></Input>
                    </div>
                </div>
            </div>
            <div class="row">
                <Row>
                    <Col :span="24">
                        <div class="op-box">
                            <div class="l">
                                制单时间
                                <br />（Date）：
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div class="row">
                <Row>
                    <Col :span="8">
                        <div class="op-box">
                            <div class="l">
                                制单时间
                                <br />（Date）：
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                    <Col :span="8">
                        <div class="op-box">
                            <div class="l">
                                制单时间
                                <br />（Date）：
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                    <Col :span="8">
                        <div class="op-box">
                            <div class="l">
                                制单时间
                                <br />（Date）：
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    data () {
        return {

        };
    },
    created () {

    },
    mounted () {

    },
    methods: {

    }
};
</script>

<style scoped lang="scss">
.receipt-box {
    width: 700px;
    /deep/ .ivu-input {
        padding: 0;
        height: 27px;
        border: none;
    }
    /deep/ .ivu-input-wrapper {
        top: -2px;
    }
    /deep/ .ivu-input:focus {
        border-color: #fff;
        box-shadow: 0 0 0 0 #f9f9f973;
    }
    font-size: 12px;
    font-weight: bold;
    .dashed-line {
        width: 100%;
        padding-top: 10px;
        border-bottom: 1px dashed #c8c8c8;
    }
    .name {
        margin: 0 auto;
        width: 110px;
        text-align: center;
        word-break: break-word;
        padding: 10px 0;
    }
    .main-box {
        .node {
            background: #ebebeb;
            height: 34px;
            line-height: 34px;
            text-align: center;
        }
        .table-c {
            flex-grow: 1;
            box-sizing: border-box;
            height: 34px;
            line-height: 34px;
            text-align: center;
            border-right: 1px solid #cccccc;
        }
        .row {
            border: 1px solid #cccccc;
            border-bottom: none;
            height: 34px;
            box-sizing: border-box;
            width: 100%;
            &:last-child {
                border-bottom: 1px solid #cccccc;
            }
            .op-box {
                box-sizing: border-box;
                display: flex;
            }
            .l,
            .r {
                box-sizing: border-box;
                height: 34px;
                line-height: 34px;
                display: inline-block;
                border-right: 1px solid #cccccc;
            }
            .l {
                width: 100px;
                line-height: 16px;
                word-break: break-word;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .r {
                padding-left: 10px;
                flex: 1;
            }
        }
    }
}
</style>
