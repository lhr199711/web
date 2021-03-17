<template>
    <div class="search-pannel">
        <div class="title-name" v-if="isTitle">
            <h3 class="title">查询条件</h3>
        </div>
        <Card shadow class="card">
            <Row>
                <slot name="status"></slot>
                <slot name="always-show"></slot>
            </Row>
            <div class="line"></div>
            <div class="button-font div-before">
                <Button class="searchButton" shape="circle" @click="search">{{$t('common.searchBtn')}}<Icon type="ios-search" /></Button>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'adt-search-folder',
    props: {
        isTitle: {
            type: Boolean,
            default: true
        },
        isStatus: {
            type: Boolean,
            default: false
        },
        searchRouter: {
            type: Object,
            default: () => {
                return {}
            },
            required: true
        },
        needCompatityStyle: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            // isTitleShow: true,
            isFoldShow: false
        }
    },
    mounted() {
        this.btnGroupCol()
    },
    methods: {
        btnGroupCol () {
            if (this.title == '') {
                this.isTitleShow = false
            }
        },
        search () {
            const arr  = location.pathname.split('/')
            // 如果后面跟了页码（是Number类型），去除pathname后面的页码
            if (typeof Number(arr[arr.length - 1]) === 'number') {
                arr.pop()
            }
            const path = arr.join('/') + '/1'
            this.$router.push({ path, ...this.searchRouter })
            // 将路由和筛选条件保存在sessionStorage里，为了再次打开页面还能保留筛选条件
            let routerQuery = JSON.parse(window.sessionStorage.getItem('routerQuery')) || {}
            routerQuery[path] = this.searchRouter
            window.sessionStorage.setItem('routerQuery', JSON.stringify(routerQuery))
            // this.$router.push( {path: `${window.location.pathname}${window.location.search}`})
        }
    }
}
</script>

<style lang="scss" scoped>
    .line{
        // border: 1px dashed $border-color;
        border-bottom: 1px solid $border-color;
        // margin: 20px 0;
        margin-bottom: 20px;
    }
    .card{
        margin-bottom: 10px;
        padding-bottom: 0px;
        padding-top: 0px;
    }
    .title-name{
        margin-bottom: 4px;
        // margin-top: 30px;
    }
    .title{
        margin-left: 46px;
        line-height: 30px;
        font-size: 16px;
        font-family: $base-font-family;
    }
    .compatity {
        padding-top: 18px;
    }
    .searchWrap{
        padding: 0 5px;
    }
    .search-pannel .searchButton {
        margin: 0 auto;
        background-color: #fff;
        height: 30px;
        width: 90px;
        font-size: 14px;
        // border-color: #999999;
    }
    .div-before {
        // text-align: right;
        text-align: center;
    }
    .div-rear {
        text-align: left;
    }
    .img-before {
        transition: all 0.1s;
        vertical-align: middle;
    }
    .img-rear{
        transform:rotate(-180deg);
        transition: all 0.1s;
        vertical-align: middle;
    }
    .img {
        margin-top: 5px;
    }
    .button-font .ivu-btn>span {
        vertical-align: top;
        text-align: center;
    }
    // 审核状态、启用状态
    /deep/.status{
        display: flex;
        // border-bottom: 1px dashed $border-color;
        border-bottom: 1px solid $border-color;
        margin-bottom: 20px;
        padding-bottom: 20px;
        line-height: 26px;
        .status-left{
            width: 100%;
            margin-right: 20px;
        }
        .click-status{
            background-color: #f2f2f2;
        }
        .name, p {
            display: inline-block;
            font-size: $font-size-base;
            font-weight: bold;
            margin-right: 20px;
        }
        span {
            padding: 5px 10px;
            margin: 5px 10px;
            color: $conventional-font-color;
            line-height: 1.5;
            cursor: pointer;
            &:hover{
                // background-color: $background-color;
                background-color: #f2f2f2;
            }
            &:active{
                background-color: #f2f2f2;
            }
        }
    }
    /deep/ .form-item, /deep/ .search-condition {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        & > span {
            // width: 100px;
            margin-right: 10px;
            text-align: right;
        }
        .ivu-input-wrapper, .ivu-select, .ivu-cascader {
            width: 60%;
            // width: 180px;
        }
        .ivu-cascader-rel .ivu-input-wrapper {
            width: 100%;
        }
        .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
            padding-right: 0;
        }
    }
    .search-pannel {
        /deep/ .ivu-card-body {
            padding:  20px 46px;
            border: none;
            box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
        }
    }
</style>
