<template>
    <div class="receipt-box">
        <div class="dashed-line"></div>
        <div class="name">
            装箱单
            <br />（Packing List）
        </div>
        <div class="main-box">
            <div class="row he-bing3">
                <div class="left">出单方（Issuer）</div>
                <div class="right">
                    <div class="op-box">
                        <div class="l">名称（name）</div>
                        <div class="r">
                            <Input></Input>
                        </div>
                    </div>
                    <div class="op-box">
                        <div class="l">地址（address）</div>
                        <div class="r">
                            <Input></Input>
                        </div>
                    </div>
                    <div class="op-box">
                        <div class="l">电话（phone）</div>
                        <div class="r">
                            <Input></Input>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row he-bing3">
                <div class="left">受单方（To）</div>
                <div class="right">
                    <div class="op-box">
                        <div class="l">名称（name）</div>
                        <div class="r">
                            <Input></Input>
                        </div>
                    </div>
                    <div class="op-box">
                        <div class="l">地址（address）</div>
                        <div class="r">
                            <Input></Input>
                        </div>
                    </div>
                    <div class="op-box">
                        <div class="l">电话（phone）</div>
                        <div class="r">
                            <Input></Input>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <Row>
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">
                                装箱单编号
                                (PL No.)
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">
                                合同号
                                (S/C No.)
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
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">
                                发票号
                                (Invoice No.)
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">
                                合同日期
                                (S/C Date)
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
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">
                                发票日期
                                (Invoice Date)
                            </div>
                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                    <Col :span="12">
                        <div class="op-box">
                            <div class="l">
                                订舱号/提单号
                                <br />S/O No.B/L No.
                            </div>

                            <div class="r">
                                <Input></Input>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div class="row ping-fen">
                <div class="ping-fen-item">
                    接货地
                    <br />(POR)
                </div>
                <div class="ping-fen-item">
                    <Input></Input>
                </div>
                <div class="ping-fen-item">
                    装货地
                    <br />(POL)
                </div>
                <div class="ping-fen-item">
                    <Input></Input>
                </div>
                <div class="ping-fen-item">
                    卸货地
                    <br />(POD)
                </div>
                <div class="ping-fen-item">
                    <Input></Input>
                </div>
                <div class="ping-fen-item">
                    送货地
                    <br />(FND)
                </div>
                <div class="ping-fen-item">
                    <Input></Input>
                </div>
                <div class="ping-fen-item">
                    信用证号
                    <br />(L/C No.)
                </div>
                <div class="ping-fen-item">
                    <Input></Input>
                </div>
            </div>
            <div class="row ping-fen-huo-wu">
                <div class="ping-fen-item">
                    包装编号
                    <br />(Case No)
                </div>
                <div class="ping-fen-item">
                    货号
                    <br />(Commodity)
                </div>
                <div class="ping-fen-item">
                    唛头
                    <br />(Ship
                    ping Mark)
                </div>
                <div class="ping-fen-item clo2">
                    货描
                    <br />(Description)
                </div>
                <div class="ping-fen-item">
                    件数
                    <br />(Quantity)
                </div>
                <div class="ping-fen-item">
                    包装
                    <br />(Package)
                </div>
                <div class="ping-fen-item">
                    毛重
                    <br />(Gr.W)
                </div>
                <div class="ping-fen-item">
                    净重
                    <br />(Net.W)
                </div>
                <div class="ping-fen-item">
                    体积
                    <br />(Measu
                    rement)
                </div>
            </div>
            <div class="row ping-fen-huo-wu">
                <div class="ping-fen-item-input">
                    <Input></Input>
                </div>
                <div class="ping-fen-item-input">
                    <Input></Input>
                </div>
                <div class="ping-fen-item-input">
                    <Input></Input>
                </div>
                <div class="ping-fen-item-input clo2">
                    <Input></Input>
                </div>
                <div class="ping-fen-item-input">
                    <Input></Input>
                </div>
                <div class="ping-fen-item-input">
                    <Input></Input>
                </div>
                <div class="ping-fen-item-input">
                    <Input></Input>
                </div>
                <div class="ping-fen-item-input">
                    <Input></Input>
                </div>
                <div class="ping-fen-item-input">
                    <Input></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text" style="width:215px">总数（Total ）</div>
                <div class="input">
                    <Input></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text" style="width:215px">总数大写（Say Total）</div>
                <div class="input">
                    <Input></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text" style="width:144px">
                    签章
                    <br />(Signature)
                </div>
                <div class="input">
                    <Input></Input>
                </div>
                <div class="text" style="width:144px">
                    制单日期
                    <br />(Date)
                </div>
                <div class="input">
                    <Input></Input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import utilMixin from '../../mixins/utilMixin'
import receipt from '../receipt'
export default {
    name: "packing",
    mixins: [utilMixin, receipt],
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
@import '../index.scss';
</style>
