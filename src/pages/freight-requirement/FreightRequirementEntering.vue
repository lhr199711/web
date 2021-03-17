<template>
    <div :class="['freight-requirement-entering', { 'is-detail': isDetail }]">
        <div v-if="isDetail" class="freight-info">
            <div class="item">货运要求编号：64645</div>
            <div class="item">录入时间：64645</div>
            <div class="item">录入人：64645</div>
        </div>
        <!-- 销售查看详情 -->
        <div v-if="isDetail && roleType === 'SALE'" class="main-tab">
            <div :class="['tab', { active: mainTabActiveIndex === 0 }]" @click="clickMainTa(0)">客户录入</div>
            <span>/</span>
            <div :class="['tab', { active: mainTabActiveIndex === 1 }]" @click="clickMainTa(1)">销售分析</div>
        </div>
        <!-- 调度查看详情 -->
        <div v-if="isDetail && roleType === 'DIS'" class="main-tab">
            <div :class="['tab', { active: mainTabActiveIndex === 0 }]" @click="clickMainTa(0)">销售分析</div>
            <span>/</span>
            <div :class="['tab', { active: mainTabActiveIndex === 1 }]" @click="clickMainTa(1)">调度分析</div>
        </div>
        <adt-progress-tab :tabs="tabs" :activeIndex="activeIndex" :allowClick="true" class="progress-tabs" @click-tab="clickTab"></adt-progress-tab>
        <cargo-info v-show="activeIndex === 0" ref="childForm" :defaultData="cargoInfo" :isDetail="isDetail" @submit-form="submitCargoInfo"></cargo-info>
        <route-info v-show="activeIndex === 1" :defaultData="routeInfo" :isDetail="isDetail" @submit-form="submitRouteInfo"></route-info>
        <remarks v-show="activeIndex === 2" :defaultData="remarks" :isDetail="isDetail" @submit-form="submitRemarks" @on-send="handleSend"></remarks>
        <Button v-if="isDetail" class="detail-btn" type="primary" shape="circle" size="large" style="margin: 30px 0;">查看物流方案</Button>
    </div>
</template>

<script>
    import CargoInfo from './components/CargoInfo'
    import RouteInfo from './components/RouteInfo'
    import Remarks from './components/Remarks'
    import { apiQueryFreightInfo } from '@/api/mock/mock'
    import { deepClone } from '@/libs/utils'
    import { apiEnterOperationFreight } from '@/api/freightRequirement'
    export default {
        components: {
            CargoInfo,
            RouteInfo,
            Remarks,
        },
        data () {
            return {
                roleType: this.$getUserInfo().roleType,
                isDetail: this.$route.query.isDetail && true, // 查看详情
                tabs: ['货物信息', '路线信息', '备注'],
                mainTabActiveIndex: 0,
                activeIndex: 0,
                formDataList: [],
                formData: {},
                cargoInfo: {},
                routeInfo: {},
                remarks: {},
            }
        },
        created () {
            // apiQueryFreightInfo().then(({ data }) => {
                // this.formDataList = data
                this.distributeData()
            // })
        },
        methods: {
            // 数据分发
            distributeData () {
                this.formData = this.formDataList[this.mainTabActiveIndex]
                // 给开发数据容錯
                if (!this.formData) {
                    return
                }
                // 提取联系人信息
                let peopleInfo = {
                    senderName: this.formData.senderName,
                    senderTel: this.formData.senderTel,
                    consigneeName: this.formData.consigneeName,
                    consigneeTel: this.formData.consigneeTel,
                    noticerName: this.formData.noticerName,
                    noticerTel: this.formData.noticerTel
                }
                this.cargoInfo = deepClone({
                    cargoList: this.formData.cargoList,
                    peopleInfo
                })
                this.routeInfo = {
                    routeList: deepClone(this.formData.routeList),
                    baseInfo: {
                        // code
                        startPlaceCode: this.formData.custStartPlace,
                        endPlaceCode: this.formData.custEndPlace,
                        ctransitPlaceCode: this.formData.custTransitePlace,
                        // 翻译
                        startPlace: this.formData.custStartPlaceTranslate,
                        endPlace: this.formData.custEndPlaceTranslate,
                        ctransitPlace: this.formData.custTransitePlaceTranslate
                    }
                }
                this.remarks = deepClone({ remark: this.formData.remark })
            },
            clickMainTa (index) {
                this.mainTabActiveIndex = index
                this.distributeData()
            },
            clickTab (index) {
                this.activeIndex = index
            },
            // 保存货物信息
            submitCargoInfo (peopleInfo, cargoList) {
                this.formData = { ...this.formData, ...peopleInfo }
                this.formData.cargoList = cargoList
                this.activeIndex++
                console.log(this.formData)
            },
            // 保存路线信息
            submitRouteInfo (routeList, placeData) {
                this.formData.routeList = routeList
                this.formData.custStartPlace = placeData.startPlace
                this.formData.custEndPlace = placeData.endPlace
                this.formData.custTransitePlace = placeData.ctransitPlace
                this.activeIndex++
            },
            // 保存备注信息
            submitRemarks (remark) {
                this.formData.remark = remark
                console.log(this.formData)
                console.log(JSON.parse(JSON.stringify(this.formData)))
                // 发送请求保存货运要求
                apiEnterOperationFreight({ data: JSON.parse(JSON.stringify(this.formData)) }).then(res =>{
                    console.log(res)
                })
            },
            // 发送要求
            handleSend () {

            },
            submitForm () {
                this.$refs['childForm'].submitForm()
            },
            addCargoInfo () {
                this.$refs['childForm'].addCargoInfo()
            },
            delCargoInfo () {
                this.$refs['childForm'].delCargoInfo()
            },
        }
    }
</script>

<style lang="scss" scoped>
    .freight-info {
        display: flex;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #c8c8c8;
        .item {
            margin-right: 120px;
        }
    }
    .progress-tabs {
        margin-bottom: 30px;
    }
    .main-tab {
        display: flex;
        align-items: center;
        margin: 50px 0;
        font-size: 24px;
        color: #999;
        .tab {
            cursor: pointer;
            &.active {
                color: #333;
            }
        }
        span {
            margin: 0 16px;
        }
    }
</style>
