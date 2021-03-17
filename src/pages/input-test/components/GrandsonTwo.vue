<template>
    <div class="order">
        <div v-for="(item, index) in currentChildren.length" :key="index">
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
        name: 'grandsonTwo',
        mixins: [distributeDataMixin],
        methods: {
            asyncComponents(templateName) {
                this.currentChildren.push(require(`./${templateName}`).default)
                this.componentsName.push(templateName)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ivu-btn {
        color: $light-color;
    }
</style>
