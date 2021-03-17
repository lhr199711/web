<template>
    <div class="tabTwo">
        <span
            class="tabItem"
            v-for="(tab,index) in tabs"
            :key="index"
            @click.stop="toggle(index ,tab.path)"
            :class="{'active':activeIndex === index}"
        >
            {{tab.label}}
            <span class="line">/</span>
        </span>
    </div>
</template>

<script>
export default {
    name: '',
    props:{
        activeIndex:{
            type:Number,
            default:0
        }
    },
    data() {
        return {
            tabs: [
                {
                    label: '单次委托',
                    path: '/logisstics-commission/one-logistics/1'
                },
                {
                    label: '合同委托',
                    path: '/logisstics-commission/two-logistics/1'
                }
            ],
        }
    },
    computed: {
    },
    created() {},
    mounted() {},
    methods: {
        toggle(index, path) {
            this.$emit('handelTab', path)
        }
    }
}
</script>

<style scoped lang="scss">
.tabTwo {
    // 没有60px
    // padding-bottom: 10px;
    // line-height: 19px;
    margin-bottom: 4px;
    line-height: 30px;
    .tabItem {
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 16px;
        cursor: pointer;
        .line {
            color: rgba(51, 51, 51, 1);
            padding: 0 80px;
        }
        &:last-child {
            .line {
                display: none;
            }
        }
    }
    .active {
        color: #0fb0b8;
    }
}
</style>
