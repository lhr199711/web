<template>
    <div class="text-right">
        <span class="font" @click="jumpClick(1)">首页</span>
        <span class="font" @click="jumpClick(2)">上一页</span>
        <span class="font" @click="jumpClick(3)">下一页</span>
        <span class="font" @click="jumpClick(4)">尾页</span>
        <span class="font">
            <span>转到</span>
            <Input
                @on-enter="changePage(cptpage)"
                @on-change="changeData(cptpage)"
                class="input"
                type="text"
                v-model="cptpage"
            />
            <span>页</span>
        </span>
        <span class="font">当前{{ page }}/{{ pageTotal }}</span>
        <span class="font">共{{ total }}条记录</span>
    </div>
</template>

<script>
export default {
    name: 'adt-paginator',
    props: {
        page: {
            type: Number,
            default: 1,
        },
        total: {
            type: Number,
            required: true,
        },
        limit: {
            type: Number,
            default: 15,
        },
    },
    data () {
        return {
            // 因为计算属性不能绑定到v-model 上，所以只能用watch 监听把数据赋值到data上
            cptpage: null,
            pageTotal: null,
        }
    },
    computed: {
    },
    created () { },
    watch: {
        page: {
            handler (newData, oldData) {
                this.getdata()
            },
            // 进入页面就执行一次
            immediate: true,
        },
        total: {
            handler (newData, oldData) {
                this.getdata()
            },
            // 进入页面就执行一次
            immediate: true,
        },
    },
    methods: {
        getdata () {
            this.cptpage = this.page
            this.pageTotal = Math.ceil(this.total / this.limit)
        },
        // 点击按钮进行跳转
        jumpClick (num) {
            if (num == 1) {
                // 首页
                this.$emit('update:page', 2)
            }
            if (num == 2) {
                // 上一页
                if (this.page > 1) {
                    this.$emit('update:page', this.page - 1)
                }
            }
            if (num == 3) {
                // 下一页
                if (this.page < this.pageTotal) {
                    this.$emit('update:page', this.page + 1)
                }
            }
            if (num == 4) {
                // 尾页
                this.$emit('update:page', this.pageTotal)
            }
            this.$emit('changePage')
        },
        // 输入框按下的时候
        changePage (value) {
            this.$emit('update:page', +value)
            this.$emit('changePage')
        },
        // 控制输入数字的不小于0,不大于最大页码
        changeData (pages) {
            if (pages > this.pageTotal) {
                this.cptpage = this.pageTotal
            }
            if (pages < this.pageTotal) {
                this.cptpage = pages
            }
            if (pages < 0) {
                this.cptpage = 1
            }
        },
    },
}
</script>

<style scoped>
.paginator {
    border: 1px solid #dcdee2;
    border-top: none;
    padding: 10px 0;
}
.text-right {
    text-align: right;
    width: 50%;
    margin-right: 30px;
}
.font {
    margin-left: 10px;
    color: #999999;
    cursor: pointer;
}
.input {
    margin: 0 5px;
    width: 50px;
    color: #999999;
}
</style>
