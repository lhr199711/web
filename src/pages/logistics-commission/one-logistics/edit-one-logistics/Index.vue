<template>
    <div class="edit-one-logistics">
        <header-btn title="方案信息">
            <div slot="btn">
                <Button type="primary" @click="saveHandel()">保存委托</Button>
            </div>
        </header-btn>
        <!-- 头部路线箭头 -->
        <line-header :lineHeaderData="cptlineHeaderData"></line-header>
        <div class="public-tasjz-box">
            <span>单次物流委托编号：</span>
            <span>{{cptRouteExecutoryEntrustCode_m}}</span>
        </div>
        <!-- 表单 -->
        <form-box ref="formId">
            
        </form-box>
    </div>
</template>

<script>
import headerBtn from '../../order/header-btn/index'
import lineHeader from '../../line-header/index'
import formBox from '../../form-box/index'
import publicDataMixin from '../../mixins/publicDataMixin'
export default {
    name: "edit-one-logistics",
    mixins:[publicDataMixin],
    components: {
        headerBtn,
        lineHeader,
        formBox
    },
    data () {
        return {

        };
    },
    computed: {
        cptlineHeaderData () {
            return []
        }
    },
    created () {

    },
    mounted () {

    },
    methods: {
        //保存委托
        saveHandel(){
            this.$refs.formId.oksubmite()
        },
    }
};
</script>

<style scoped lang="scss">
.edit-one-logistics {
}
</style>
