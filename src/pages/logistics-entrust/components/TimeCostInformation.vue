<template>
<div>
    <div id="TimeCostInformation">
        <Form :model="formItem" :rules="ruleValidate" ref="formItemData" :label-width="200" label-colon>
            <div class="public-form-card">
                <p class="title">时间要求</p>
                <Row>
                    <Col span="24">
                        <FormItem label="预计货好时间">
                            <DatePicker v-model="formItem.cargoReadyTime"  type="date" ></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12" class="col-box">
                            <FormItem label="最迟启运时间">
                                <DatePicker v-model="formItem.lastStartTime"  type="date" split-panels></DatePicker>
                            </FormItem>
                            <div class="addnode">
                                <span class="btn-node" @click="chooseSiteType(1)">指定节点</span>
                                <span class="text">{{formItem.lastStartPort}}</span>
                            </div>
                    </Col>
                    <Col span="12"  class="col-box">
                        <FormItem label="最晚运抵时间">
                            <DatePicker v-model="formItem.lastArriveTime" type="date" split-panels></DatePicker>
                        </FormItem>
                        <div class="addnode">
                            <span class="btn-node" @click="chooseSiteType(2)">指定节点</span>
                            <span class="text">{{formItem.lastArrivePort}}</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="最迟交货时间">
                            <DatePicker v-model="formItem.lastDeliveryTime"  type="date" split-panels></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="7">
                        <FormItem  class="no-right-border" label="最低时长要求">
                            <Input type="number" v-model.number="formItem.lowestTimeReq"/>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem :label-width="0">
                            <Select class="time" v-model="formItem.lowestTimeUnit" clearable>
                                <Option v-for="(item, index) in timeUnits" :key="index" :value="item.dictionaryKey">{{ item.dictionaryValue }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <p class="title last-title">费用要求</p>
                <Row>
                    <FormItem label="最高费用要求">
                        <Input type="text" v-model="formItem.highestCostReq"/>
                    </FormItem>
                </Row>
            </div>
        </Form>
    </div>
    <div v-if="!isDetail" class="public-btns-group">
        <Button type="primary" shape="circle" size="large" @click="submitForm">下一步</Button>
    </div>
    <choose-site @submit-form="submitSiteForm" @on-visible-change="chooseSiteChange" :label="chooseObject.Label" :showDrawer="chooseObject.Type>0" :defaultData="chooseObject.Data"></choose-site>
</div>
</template>

<script>
// import validateRules from '@/libs/validateRules'
export default {
    props:{
        // entrustTimeReq
        defaultData: {
            type: Object,
            default: () => ({})
        },
        isDetail: {
            type: Boolean,
            default: false
        }
    },
    components: {
        chooseSite: () => import('../../../components/choose-site/Index')
    },
    data(){
        return{
            timeUnits: this.$getDictionary('TIME_UNIT'), //时间字典
            chooseObject: {
                Type: 0, //显隐开关 0关  开(1 起点类型 2 运抵类型)
                Data: { site: '',date: '', lists: [{name:'重庆',port:'123'},{name:'大阪',port:'234'}] }, //路线 时间 默认参数
                Label: "最迟启运时间" //选择节点 标签参数
            }, //选择对象 (用以选择地点等参数)
            formItem: this.defaultData,
            ruleValidate: {}
        }
    },
    methods:{
        submitForm () {
            this.$refs.formItemData.validate((valid) => {
                if (valid) {
                    if (this.formItem.lowestTimeReq&&this.formItem.lowestTimeUnit=='') {
                        this.$Message.warning({content:'请选择时间单位!'})
                        return
                    }
                    this.$emit('submit-form', this.formItem)
                }
            })
        },
        //监听 时间地点抽屉 提交
        submitSiteForm(info) {
            if (this.chooseObject.Type == 1) { //最迟启运时间地点
                this.formItem.lastStartPort = info.site.split('~')[1] || ''
                // this.formItem.startkey = info.key || ''
                this.formItem.lastStartTime = info.date || 0
            }else{  //最晚运抵时间地点
                this.formItem.lastArrivePort = info.site.split('~')[1] || '' //date
                // this.formItem.endkey = info.key || '' //date
                this.formItem.lastArriveTime = info.date || ''
            }
        },
        chooseSiteType(type){
            this.chooseObject.Label = type===1? "最迟启运时间":"最晚运抵时间"
            this.chooseObject.Type = type //type 1 formItem.lastStartPort 2 formItem.lastArrivePort
            this.chooseObject.Data.site = type===1? this.formItem.lastStartPort:this.formItem.lastArrivePort;
            this.chooseObject.Data.date = type===1? this.formItem.lastStartTime:this.formItem.lastArriveTime;
            // console.log(this.chooseObject.Data.date);
        },
        // 监听抽屉 改变
        chooseSiteChange(value) {
            if (!value) {
                this.chooseObject.Type = 0 //同步隐藏 highestCostReq
            }else{
                // console.log(this.formItem, 'this.formItem');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#TimeCostInformation{
    background: #ffffff;
    // margin-top: 30px;
    padding: 0 20px 20px;
    .title{
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        margin-bottom: 20px;

    }
    .last-title{
        margin-top: 20px;
    }
    .col-box{
        display: flex;
        .addnode{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color:#666666;
            .btn-node{
                display:inline-block;
                width: 79px;
                height: 20px;
                border: 1px solid #999999;
                border-radius: 4px;
                text-align: center;
                line-height: 20px;
                cursor:pointer;
                margin: 0 10px;
                
            }
            .text{
                display:inline-block;
                width: 79px;
                height: 20px;
            }
        }
    }
    .ivu-col-span-5 {
        .ivu-form-item {
            /deep/ .ivu-select {
                margin-left: -10px;
            }
        }
    }
}
</style>