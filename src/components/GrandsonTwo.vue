<template>
    <div class="order">
        <div v-for="(item, index) in currentChildren.length" :key="index" v-show="showComponents.includes(componentsName[index])">
            <component
                :is="currentChildren[index]"
                :ref="`childForm${index}`"
                @syncData="syncData"
                :toChildData="formData[componentsName[index]]"
            ></component>
        </div>
    </div>
</template>

<script>
    import distributeDataMixin from '@/mixins/distributeDataMixin'
    export default {
        name: 'GrandsonTwo',
        mixins: [distributeDataMixin]
    }
</script>

<style lang="scss" scoped>
    .ivu-btn {
        color: $light-color;
    }
</style>
