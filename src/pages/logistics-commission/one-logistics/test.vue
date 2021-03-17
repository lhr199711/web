<template>
    <div>
        <div @click="hh">huhai</div>
        <adt-reconfirm-modal
            :showModal="isShow"
            @on-visible-change="deleteVisibleChange"
        />
    </div>
</template>

<script>
    export default {
        name: "",
        data () {
            return {
                isShow: false
            };
        },
        created () {

        },
        mounted () {

        },
        methods: {
            hh () {
                this.isShow = true
            },
            // 退出
            deleteVisibleChange (data) {
                this.isShow = data
            },

        }
    };
</script>

<style scoped lang="scss">
</style>
