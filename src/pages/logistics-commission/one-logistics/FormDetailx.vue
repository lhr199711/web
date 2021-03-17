<template>
    <div class="FormDetailx">
        <Divider style="margin:0 0 20px 0" />
        <div class="header-box">
            <div class="h-item">
                <span>合同总量：</span>
                <span>{{formModel.cargoTotal}}KG</span>
            </div>
            <div class="h-item">
                <span>已交付总量：</span>
                <span>{{formModel.deliveredWeight}}KG</span>
            </div>
            <div class="h-item">
                <span>未启运总量：</span>
                <span>{{formModel.noPlaceWeight}}KG</span>
            </div>
            <div class="h-item">
                <span>在途重量：</span>
                <span>{{formModel.underwayWeight}}KG</span>
            </div>
        </div>
        <div class="public-form-box">
            <cargo-info v-if="timeShow" :arr="entrustExecutoryInfoResList"></cargo-info>
        </div>
    </div>
</template>

<script>
import { apiGetPeriodEntrustAffiliation } from '@/api/logisticsCommission'
import moment from 'moment'
import formCargoInfo from '@/mixins/formCargoInfo'
import CargoInfo from './CargoInfo5'
export default {
    name: 'FormDetailx',
    mixins: [formCargoInfo],
    components: {
        CargoInfo
    },
    data () {
        return {
            // 数据等待
            timeShow: false,
            // 表单
            formModel: {},
            // 传给子组件的数组
            entrustExecutoryInfoResList: []
        }
    },
    computed: {
        cptId () {
            let str = this.$route.query.entrustCode
            return str
        }
    },
    created () {
        this.getDetail()
    },
    methods: {
        save (name) {
            //我是接受委托
            alert('功能开发中')
        },
        getDetail () {
            // 查询详情
            apiGetPeriodEntrustAffiliation({
                entrustCode: this.cptId
            }).then(({ data }) => {
                let { entrustExecutoryInfoResList, ...obj } = data
                this.entrustExecutoryInfoResList = entrustExecutoryInfoResList
                this.formModel = obj
                this.timeShow = true
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.FormDetailx {
    .public-form-box {
        padding: 4px 0 0 0;
    }
    .header-box {
        display: flex;
        justify-content: flex-end;
        .h-item {
            background: #f9f9f9;
            font-size: 14px;
            font-weight: bold;
            color: rgba(102, 102, 102, 1);
            line-height: 32px;
            padding: 0 20px;
            margin-right: 15px;
            &:nth-child(1) {
                border-left: 2px solid #53acff;
            }
            &:nth-child(2) {
                border-left: 2px solid #02adb5;
            }
            &:nth-child(3) {
                border-left: 2px solid #fcc163;
            }
            &:nth-child(4) {
                border-left: 2px solid #ff0000;
            }
        }
    }
}
</style>    