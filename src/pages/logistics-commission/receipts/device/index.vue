<template>
    <div class="receipt-box">
        <div class="dashed-line"></div>
        <div class="name">
            设备交接单
            Stock IN/OUT List
        </div>
        <div class="main-box">
            <div class="row flex">
                <div class="text w110">
                    制单时间
                    <br />(Date)
                </div>
                <div class="input">
                    <Input :maxlength="verifyValidate.date" v-model="formValidate.date"></Input>
                </div>
                <div class="text w110">
                    单据号
                    <br />（No.）
                </div>
                <div class="input">
                    <Input :maxlength="verifyValidate.no" v-model="formValidate.no"></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text flex1">用箱人/运箱人（container user/Haulier）</div>
                <div class="text flex1">提箱地点（Place of Delivery）</div>
            </div>
            <div class="row flex">
                <div class="input">
                    <Input
                        :maxlength="verifyValidate.container_use"
                        v-model="formValidate.container_use"
                    ></Input>
                </div>
                <div class="input">
                    <Input
                        :maxlength="verifyValidate.place_of_delivery"
                        v-model="formValidate.place_of_delivery"
                    ></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text flex1">来自地点（Delivered to）</div>
                <div class="text flex1">返回/收箱地点（Place of Return）</div>
            </div>
            <div class="row flex">
                <div class="input">
                    <Input
                        :maxlength="verifyValidate.delivered_to"
                        v-model="formValidate.delivered_to"
                    ></Input>
                </div>
                <div class="input">
                    <Input
                        :maxlength="verifyValidate.place_of_return"
                        v-model="formValidate.place_of_return"
                    ></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text flex1">
                    船名/航次
                    <br />(Vessel/Voyage No.)
                </div>
                <div class="text flex1">
                    集装箱号
                    <br />(Container#）
                </div>
                <div class="text flex1">
                    尺寸/类型
                    <br />(Size/Type）
                </div>
                <div class="text flex1">
                    营运人
                    <br />(CNTR.ORTR）
                </div>
            </div>
            <div class="row flex">
                <div class="input">
                    <Input :maxlength="verifyValidate.voyage_no" v-model="formValidate.voyage_no"></Input>
                </div>
                <div class="input">
                    <Input :maxlength="verifyValidate.container" v-model="formValidate.container"></Input>
                </div>
                <div class="input">
                    <Input :maxlength="verifyValidate.size" v-model="formValidate.size"></Input>
                </div>
                <div class="input">
                    <Input :maxlength="verifyValidate.cntr_ortr" v-model="formValidate.cntr_ortr"></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text flex1">
                    提单号
                    <br />（B/L No.）
                </div>
                <div class="text flex1">
                    铅封号
                    <br />（Seal#）
                </div>
                <div class="text flex1">
                    免费期限
                    <br />(Free Time Period）
                </div>
                <div class="text flex1">
                    运载工具牌号
                    <br />(Truck Wagon.berg No.）
                </div>
            </div>
            <div class="row flex">
                <div class="input">
                    <Input :maxlength="verifyValidate.b_l_no" v-model="formValidate.b_l_no"></Input>
                </div>
                <div class="input">
                    <Input :maxlength="verifyValidate.seal" v-model="formValidate.seal"></Input>
                </div>
                <div class="input">
                    <Input
                        :maxlength="verifyValidate.free_time_period"
                        v-model="formValidate.free_time_period"
                    ></Input>
                </div>
                <div class="input">
                    <Input
                        :maxlength="verifyValidate.truck_wagon_berg_no"
                        v-model="formValidate.truck_wagon_berg_no"
                    ></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text flex1">
                    出场目的/状态
                    <br />(PPS of Gate-Out/Status）
                </div>
                <div class="text flex1">
                    出场日期
                    <br />（Time-Out）
                </div>
                <div class="text flex1">
                    进场目的/状态
                    <br />(PPS of Gate-In/Status）
                </div>
                <div class="text flex1">
                    进场日期
                    <br />（Time-In）
                </div>
            </div>
            <div class="row flex">
                <div class="input">
                    <Input
                        :maxlength="verifyValidate.pps_of_gate_out"
                        v-model="formValidate.pps_of_gate_out"
                    ></Input>
                </div>
                <div class="input">
                    <Input :maxlength="verifyValidate.time_out" v-model="formValidate.time_out"></Input>
                </div>
                <div class="input">
                    <Input
                        :maxlength="verifyValidate.pps_of_gate_in"
                        v-model="formValidate.pps_of_gate_in"
                    ></Input>
                </div>
                <div class="input">
                    <Input :maxlength="verifyValidate.time_in" v-model="formValidate.time_in"></Input>
                </div>
            </div>
            <div class="row node">出场检查记录（Inspection at the time of Interchange）</div>
            <div class="row">
                <div class="op-box">
                    <div class="table-c">普通集装箱（GP）</div>
                    <div class="table-c">冷藏集装箱（RF）</div>
                    <div class="table-c">特种集装箱（Special）</div>
                    <div class="table-c">发电机（Gen Set）</div>
                </div>
            </div>
            <div class="row">
                <div class="op-box">
                    <div class="table-c">
                        <RadioGroup v-model="formValidate.gp">
                            <Radio label="正常"></Radio>
                            <Radio label="异常"></Radio>
                        </RadioGroup>
                    </div>
                    <div class="table-c">
                        <RadioGroup v-model="formValidate.rf">
                            <Radio label="正常"></Radio>
                            <Radio label="异常"></Radio>
                        </RadioGroup>
                    </div>
                    <div class="table-c">
                        <RadioGroup v-model="formValidate.special">
                            <Radio label="正常"></Radio>
                            <Radio label="异常"></Radio>
                        </RadioGroup>
                    </div>
                    <div class="table-c">
                        <RadioGroup v-model="formValidate.gen_set">
                            <Radio label="正常"></Radio>
                            <Radio label="异常"></Radio>
                        </RadioGroup>
                    </div>
                </div>
            </div>
            <div class="row img-box">
                <div class="img-bg"></div>
            </div>
            <div class="row shuo-ming">
                <Row>
                    <Col :span="24">
                        <div class="op-box">
                            除列明者外，集装箱及集装箱设备交换时完好无损，铅封完整无误
                            <br />（The container/associated equipme nt interchanged in sound conition and seal aintact unless otherwise stated.）
                        </div>
                    </Col>
                </Row>
            </div>
            <div class="row">
                <Row>
                    <Col :span="24">
                        <div class="op-box">
                            <div
                                class="l"
                                style="width:352px"
                            >用箱人/运箱人签署（Container user/Hauliers Signature）</div>
                            <div class="r">
                                <Input
                                    :maxlength="verifyValidate.container_user"
                                    v-model="formValidate.container_user"
                                ></Input>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div class="row">
                <Row>
                    <Col :span="24">
                        <div class="op-box">
                            <div
                                class="l"
                                style="width:352px"
                            >码头堆场值班员签署（Terminal/Depot Clerks Signature）</div>
                            <div class="r">
                                <Input
                                    :maxlength="verifyValidate.terminal"
                                    v-model="formValidate.terminal"
                                ></Input>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
import utilMixin from '../../mixins/utilMixin'
import receipt from '../receipt'
export default {
    name: "device",
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
.img-bg {
    width: 346px;
    height: 98px;
    background: url('../../../../assets/images/device.png') no-repeat;
}
</style>
