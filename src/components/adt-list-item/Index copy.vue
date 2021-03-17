<template>
    <div>
        <Checkbox v-if="isFreight" class="card-check" v-model="isCheck" @on-change="checkChange(logistics, isCheck)"></Checkbox>
        <Card :class="{'card-margin': isFreight == true}">
            <p class="card-title" slot="title">
                <span v-if="isFreight">货运要求编号:{{ logistics.logisticsPlanNumber }}</span>
                <span v-if="!isFreight">物流方案编号:{{ logistics.logisticsPlanNumber }}</span>
                <span v-if="isFreight">
                    <span :class="{'card-status-success': logistics.statusCode == 'disagree', 'card-status-error': logistics.statusCode == 'refuse', 'card-status': logistics.statusCode == 'agree' }">{{ logistics.status }}</span>
                    <slot name="operat"></slot>
                </span>
                <span v-if="isServicePlanStatus">
                    <span :class="{'card-status-success': logistics.statusCode == 'disagree', 'card-status-error': logistics.statusCode == 'refuse', 'card-status': logistics.statusCode == 'agree' }">{{ logistics.status }}</span>
                    <slot name="operat"></slot>
                </span>
                <span v-if="isServicePlanNoStatus">
                    <slot name="operat"></slot>
                </span>
            </p>
            <div class="card-route">
                <div class="card-content" v-for="(location, index) in logistics.location">
                    <span class="card-outset">{{ location.city }}</span>
                    <div class="card-transit">
                        <span v-show="!isFreight" class="card-way"><Icon type="md-bicycle" /></span>
                        <span><Icon type="ios-arrow-round-forward" /><Icon type="ios-arrow-round-forward" /><Icon type="ios-arrow-round-forward" /><Icon type="ios-arrow-round-forward" /><Icon type="ios-arrow-round-forward" /></span>
                        <span v-show="!isFreight" class="card-genre">{{ location.type }}</span>
                    </div>
                </div>
            </div>
            <div v-if="!isFreight" class="card-bottom">
                <span>时效: {{ logistics.time }}</span>
                <span></span>
                <span class="card-right">价格: {{ logistics.price }}</span>
            </div>
            <div v-if="isFreight" class="card-bottom">
                <span>运输方式: {{ logistics.time }}</span>
                <span class="card-center">货物类型: {{ logistics.time }}</span>
                <span class="card-right">录入时间: {{ logistics.price }}</span>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'AdtSolutionRoute',
    props: {
        logistics: {
            type: Object,
            default: function () {
                return {}
            }
        },
        checkDataList: {
            type: Object,
            default: function () {
                return {}
            }
        },
        // 货运要求页面--有状态有复选框
        isFreight: {
            type: Boolean,
            default: false
        },
        // 服务方案页面--有状态
        isServicePlanStatus: {
            type: Boolean,
            default: false
        },
        // 服务方案列表--没有状态
        isServicePlanNoStatus: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showModal: false,
            isCheck: false
        }
    },
    methods: {
        checkChange (data, status) {
            this.$emit('checkData', data, status)
        },
    },
}
</script>

<style lang="scss" scoped>
// 占位
</style>