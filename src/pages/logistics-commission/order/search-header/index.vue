<template>
    <div class="search-pannel">
        <Card shadow class="card">
            <Row>
                <slot name="status"></slot>
                <slot name="always-show"></slot>
            </Row>
            <Divider />
            <div class="button-font div-before">
                <Button class="searchButton" shape="circle" @click="search">
                    {{ $t('common.searchBtn') }}
                    <Icon type="ios-search" />
                </Button>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'search-folder',
    props: {
    },
    data () {
        return {
        }
    },
    mounted () {
    },
    methods: {
        search () {
        }
    }
}
</script>

<style lang="scss" scoped>
.line {
    border: 1px dashed $border-color;
    margin: 20px 0;
}
.card {
    margin-bottom: 10px;
    padding-bottom: 0px;
    padding-top: 0px;
}
.title-name {
    margin-bottom: 6px;
}
.title {
    margin-left: 16px;
    line-height: 30px;
    font-size: 16px;
    font-family: $base-font-family;
    font-weight: normal;
}
.compatity {
    padding-top: 18px;
}
.searchWrap {
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
.img-rear {
    transform: rotate(-180deg);
    transition: all 0.1s;
    vertical-align: middle;
}
.img {
    margin-top: 5px;
}
.button-font .ivu-btn > span {
    vertical-align: top;
    text-align: center;
}
// 审核状态、启用状态
/deep/.status {
    display: flex;
    border-bottom: 1px dashed $border-color;
    margin-bottom: 20px;
    padding-bottom: 20px;
    .status-left {
        width: 100%;
        margin-right: 20px;
    }
    .click-status {
        background-color: $filling-color;
    }
    .name,
    p {
        display: inline-block;
        font-size: $font-size-base;
    }
    span {
        padding: 5px 10px;
        margin: 5px 10px;
        cursor: pointer;
        color: $conventional-font-color;
        &:hover {
            background-color: $background-color;
        }
        &:active {
            background-color: $filling-color;
        }
    }
}
/deep/ .form-item {
    display: flex;
    align-items: center;
    span {
        width: 100px;
    }
    .ivu-input-wrapper,
    .ivu-select,
    .ivu-cascader {
        width: 60%;
    }
    .ivu-cascader-rel .ivu-input-wrapper {
        width: 100%;
    }
    .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
    .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
        padding-right: 0;
    }
}
</style>
