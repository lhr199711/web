<template>
    <div id="ContainerInformation">
        <adt-tab-btns :height="24" :width="100" :isUnderlineGray="true" :isUnderline="true" :isSmallBtn="true" :titleNames="titleNames" :btnIndex="changeIndex" @handleBtn="handleBtn">
            <div class="devider-line"></div>
            <div class="public-form-card">
                <Form :model="formItem1" :ref="'containformItem'+(index+1)" :rules="formItemRule" :label-width="100" label-colon  v-for="(formItem1,index) in formItem" :key="index"  v-show="changeIndex === (index+1)" >
                    <Row>
                        <Col span="10">
                            <FormItem label="运输类型" prop="transportType">
                                <Select v-model="formItem1.transportType" clearable>
                                    <Option
                                        v-for="(item, index) in transportTypeList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem label="集装箱尺寸类型" prop="contaSize">
                                <Select v-model="formItem1.contaSize" clearable>
                                    <Option
                                        v-for="(item, index) in contaSizeList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="10">
                            <FormItem label="集装箱数量" prop="suitcaseQty">
                                 <Input v-model="formItem1.suitcaseQty"></Input>
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem label="集装箱来源" prop="containerSource">
                                <Select v-model="formItem1.containerSource" clearable>
                                    <Option
                                        v-for="(item, index) in containerSourceList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="10">
                            <FormItem label="提箱类型" prop="suitcaseType">
                                <Select v-model="formItem1.suitcaseType" clearable>
                                    <Option
                                        v-for="(item, index) in suitcaseTypeList"
                                        :key="index"
                                        :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </adt-tab-btns>
        <div class="public-btns-group">
            <Button type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
        </div>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    export default {
        props: {
            defaultData: {
                type: Array,
                default: () => ([
                    {
                        roadCode: String(Math.random()*10000), //包装信息 路线编码 no have roadCode
                        routeCode: String(Math.random()*10000), //包装信息 路段编码 no have routeCode
                        transportType:'',
                        contaSize:'',
                        suitcaseQty: '',
                        containerSource: '',
                        suitcaseType:'',
                        titleName:"重庆"
                    }, //集装箱1
                    {
                        roadCode: String(Math.random()*10000), //包装信息 路线编码 no have roadCode
                        routeCode: String(Math.random()*10000), //包装信息 路段编码 no have routeCode
                        transportType:'',
                        contaSize:'',
                        suitcaseQty:'',
                        containerSource: '',
                        suitcaseType:'',
                        titleName:"重庆-香港"
                    }, //集装箱2
                    {
                        roadCode: String(Math.random()*10000), //包装信息 路线编码 no have roadCode
                        routeCode: String(Math.random()*10000), //包装信息 路段编码 no have routeCode
                        transportType:'', //运输类型
                        contaSize:'', //集装箱尺寸
                        suitcaseQty:'', //箱量
                        containerSource: '', //来源
                        suitcaseType:'', //提箱类型
                        titleName:"香港"
                    } //集装箱3
                ]) //默认参数 后端需要
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data () {
            let titleNameArr = [];
            this.defaultData.forEach(ele => {
                titleNameArr.push(ele.titleName); //根据集装箱参数 生成 tab参数
            });
            return {
                titleNames: titleNameArr||[], //集装箱标题
                changeIndex: 1,
                formItem: this.defaultData,
                // 规则为空
                formItemRule: {
                    // transportType (运输类型) contaSize (集装箱尺寸类型) suitcaseQty (集装箱数量) containerSource (集装箱来源) suitcaseType (提箱类型)
                    // transportType: [
                    //     validateRules.select('运输类型')[0]
                    // ],
                    // contaSize: [
                    //     validateRules.select('集装箱尺寸类型')[0]
                    // ],
                    // suitcaseQty: [
                    //     validateRules.select('集装箱数量')[0]
                    // ],
                    // containerSource: [
                    //     validateRules.select('集装箱来源')[0]
                    // ],
                    // suitcaseType: [
                    //     validateRules.select('提箱类型')[0]
                    // ]
                },
                transportTypeList: this.$getDictionary('TRANSPORT_TYPE'),
                contaSizeList: this.$getDictionary('CONTAINER_SIZE_TYPE'),
                containerSourceList: this.$getDictionary('CONTAINER_SOURCE'),
                suitcaseTypeList: this.$getDictionary('SUITCASE_TYPE')
            }
        },
        methods: {
            handleBtn(index, titleItem) { //点击显示相应集装箱
                // console.log(index, titleItem,"集装箱")
                this.changeIndex = index + 1
            },
            submitForm () {
                this.$emit('submit-form', this.formItem);
            }
        }
    }
</script>

<style lang="scss" scoped>
#ContainerInformation{
    background: #ffffff;
    // margin-top: 30px;
    padding: 20px;
    .devider-line{
        width: 100%;
        border: 1px dashed #999999;
        margin: 20px auto;
    }
    /deep/ .ivu-col-span-10{
        height: 40px;
        width: 50%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #E5E5E5;
        .ivu-form-item{
            display: flex;
            width: 100%;
            margin: 0;
            .ivu-form-item-label{
                flex: 2;
                display: inline-block;
                background:#F5F6F8;
                color: #666666;
                font-size: 14px;
                border-right: 1px solid #F5F6F8;
            }
            .ivu-form-item-content{
                flex: 5;
                display: flex;
                margin-left: 0 !important;
                align-items: center;
            }
        }
    }
}

</style>
