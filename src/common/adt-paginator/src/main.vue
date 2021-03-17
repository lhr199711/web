<template>
    <div class="text-right">
        <span class="font" @click="jumpClick(1)">首页</span>
        <span class="font" @click="jumpClick(2)">上一页</span>
        <span class="font" @click="jumpClick(3)">下一页</span>
        <span class="font" @click="jumpClick(4)">尾页</span>
        <span class="font">
            <span>转到</span>
            <Input v-model="page" class="input" type="text" @on-enter="changePage(page)" @on-change="changeData(page)" />
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
        currentPage: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        path: {
            type: String,
            default: () => {
                const arr  = location.pathname.split('/')
                // 如果后面跟了页码（是Number类型），去除pathname后面的页码
                // Number(arr[arr.length - 1]): 将最后一位转换成Number类型，如果是非数字，则为NaN
                if (!Number.isNaN(Number(arr[arr.length - 1]))) {
                    arr.pop()
                }
                return arr.join('/')
            }
        },
        query: {
            type: Object
        },
        multipleFormJudgment: {
            type: Number,
            required: false
        },
        size: {
            type: Number,
            default: 15
        }
    },
    data () {
        return {
            perpage: this.$parent.perpage,
            page: '',
            pageTotal: ''
        }
    },
    watch: {
        total: {
            handler () {
                this.getData()
            },
            // 进入页面就执行一次
            immediate: true
        }
    },
    methods: {
        getData () {
            this.page = this.currentPage
            this.pageTotal = Math.ceil(this.total / this.size)
        },
        // 点击按钮进行跳转
        jumpClick (num) {
            if (num == 1) {
                this.$router.push({ path: `${this.path}/${num}`, query: { multipleFormJudgment: this.multipleFormJudgment } })
                this.page = 1
            }
            if (num == 2) {
                if (this.page > 1) {
                    this.page = this.page - 1
                    this.$router.push({ path: `${this.path}/${this.page}`, query: { multipleFormJudgment: this.multipleFormJudgment } })
                }
            }
            if (num == 3) {
                if (this.page < this.pageTotal) {
                    this.page = this.page + 1
                    this.$router.push({ path: `${this.path}/${this.page}`, query: { multipleFormJudgment: this.multipleFormJudgment } })
                }
            }
            if (num == 4) {
                this.page = this.pageTotal
                this.$router.push({ path: `${this.path}/${this.pageTotal}`, query: { multipleFormJudgment: this.multipleFormJudgment } })
            }
        },
        // 控制输入数字路由跳转
        changePage (value) {
            value = Number(value)
            if (value <= this.pageTotal) {
                this.page = value
                this.$router.push({ path: `${this.path}/${this.page}`, query: { multipleFormJudgment: this.multipleFormJudgment } })
            }
            if (value < 0) {
                this.page = 1
                this.$router.push({ path: `${this.path}/${1}`, query: { multipleFormJudgment: this.multipleFormJudgment } })
            }
        },
        // 控制输入数字的不小于0,不大于最大页码
        changeData (pages) {
            if (pages > this.pageTotal) {
                this.page = this.pageTotal
            }
            if (pages < this.pageTotal) {
                this.page = pages
            }
            if (pages < 0) {
                this.page = 1
            }
        }
    }
}
</script>

<style scoped>
    .paginator {
        padding: 10px 0;
        border: 1px solid #dcdee2;
        border-top: none;
    }
    .text-right {
        width: 50%;
        margin-right: 30px;
        text-align: right;
    }
    .font {
        margin-left: 10px;
        color: #999999;
        cursor: pointer;
    }
    .input {
        width: 50px;
        margin: 0 5px;
        color: #999999;
    }
</style>
