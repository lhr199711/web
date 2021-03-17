<template>
    <div>
        <!--  单据的弹框 -->
        <adt-my-modal
            :showModal="dialogOp.showItemModal"
            :title="dialogOp.itemTitle"
            width="750"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk"
        >
            <div class="ipt">
                <scene-map :List="$attrs.ATlist" @auditStatus="handelValue" />
                <div class="main-box">
                    <component
                        ref="ComponentNameId"
                        :is="ComponentName"
                        :list="list"
                        :dataObj="dataObj"
                    ></component>
                </div>
                <div class="pre" @click="handelpre" />
                <div class="next" @click="handelnext" />
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
import sceneMap from '../scene-map'
import { apiGetBillsData, apiAddBillsData } from '@/api/logisticsCommission'
import goods from '../../receipts/goods'
import device from '../../receipts/device'
import Packing from '../../receipts/Packing'
export default {
    name: '',
    //拿到组件上的值
    inheritAttrs: false,
    components: {
        sceneMap,
        goods,
        device,
        Packing
    },
    props: {
        detailData: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            dialogOp: {
                showItemModal: false,
                itemTitle: '执行单据录入'
            },
            //第几个单据
            activeIndex: 0,
            // 动态组件名字
            ComponentName: '',
            //场景下的单据集合
            nameList: [],
            // 当前场景下的所有单据
            BillsData: [],
            // 当前场景的名字
            activeBills: "",
            //当前单据的数据项
            list: [],
            // 当前单据的其他数据
            dataObj: {}
        }
    },
    computed: {},
    created () {
    },
    mounted () { },
    methods: {
        // 单据切换 数据切换
        initComponentName (Index) {
            try {
                this.ComponentName = this.nameList[Index]
                this.list = this.BillsData[Index].dataStructure
                this.dataObj = {
                    orderCode: this.detailData.orderCode,
                    sceneName: this.activeBills,
                    billsCode: this.BillsData[Index].billsCode,
                    // billsTemplate: this.BillsData[Index].billsTemplate
                }
            } catch (error) {
                console.log('严重错误：后端没有返回数据')
            }
        },
        //上一个单据
        handelpre () {
            if (this.activeIndex === 0) {
                return
            }
            this.activeIndex = this.activeIndex - 1
            this.initComponentName(this.activeIndex)
        },
        // 下一个单据
        handelnext () {
            if (this.activeIndex === this.nameList.length - 1) {
                return
            }
            this.activeIndex = this.activeIndex + 1
            this.initComponentName(this.activeIndex)
        },
        // 点击场景的事件
        async handelValue (key) {
            this.activeBills = key.label
            let data = {
                orderCode: this.detailData.orderCode,
                sceneName: key.label
            }
            await this.getBillsData(data)
            this.initComponentName(this.activeIndex)
        },
        // 弹框里面的取消按钮
        visibleChange (data) {
            this.dialogOp.showItemModal = data
        },
        // 弹框里面的确认按钮
        handleItemModalOk () {
            // this.dialogOp.showItemModal = false
            this.$refs.ComponentNameId.save()
        },
        // 打开弹框
        openDialog () {
            this.dialogOp.showItemModal = true
        },
        // 查询单据信息
        getBillsData (obj) {
            let data = {
                ...obj
            }
            return new Promise((resolve, reject) => {
                apiGetBillsData({ data }).then(({ data = [] }) => {
                    this.nameList = data.map((item) => {
                        return item.billsName
                    })
                    this.BillsData = data
                    resolve()
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
.ipt {
    position: relative;
    .pre,
    .next {
        position: absolute;
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .pre {
        background: url('../../../../assets/images/pre.png') no-repeat;
        top: 50%;
        left: -30px;
    }
    .next {
        background: url('../../../../assets/images/next.png') no-repeat;
        top: 50%;
        right: -30px;
    }
}
</style>
