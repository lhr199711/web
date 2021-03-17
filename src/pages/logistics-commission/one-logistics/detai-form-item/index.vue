<template>
    <div>
        <p class="item-form-title">{{tit}}</p>
        <div class="table-boxjz">
            <div class="table-rowjz" v-for="(item,index) in titleList" :key="index">
                <div>{{item.title}}</div>
                <div :title="valueObj[item.name]">{{valueObj[item.name]}}{{item.unit}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'detail-form-item',
    props: {
        titleList: {
            type: Array,
            default() {
                return []
            },
        },
        valueObj: {
            type: Object,
            default() {
                return {}
            },
        },
        tit: {
            type: String,
            default: '',
        },
    },
    data() {
        return {}
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>

<style scoped lang="scss">
.item-form-title {
    height: 35px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 35px;
}
.table-boxjz {
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    .table-rowjz {
        height: 30px;
        line-height: 30px;
        display: flex;
        border-bottom: 1px solid #e6e6e6;
        div {
            font-size: 14px;
            height: 100%;
            font-weight: bold;
            color: rgba(102, 102, 102, 1);

            &:first-child {
                width: 120px;
                text-align: right;
                background: #f5f6f8;
                border-right: 1px solid #e6e6e6;
            }
            &:last-child {
                flex: 1;
                background: #fff;
                padding-left: 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
