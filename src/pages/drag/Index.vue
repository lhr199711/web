<template>
    <div class="drag">
        <div class="lists">
            <div class="list" v-for="(list, index) in lists" :key="list.id" @dragover="dragOver" @drop="drop(index)">
                <div class="name" draggable @dragstart="dragStart(index)">{{ list.name }}</div>
                <div class="dragover-area" @dragover="dragOver" @drop="drop(index)"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { apiClearCache, apiGetLocation } from '@/api/dictionary'
    import { apiGetHhTestData } from '@/api/mock/mock'
    export default {
        data () {
            return {
                lists: [
                    {
                        id: 1,
                        name: 'apple'
                    },
                    {
                        id: 2,
                        name: 'banana'
                    },
                    {
                        id: 3,
                        name: 'strawberry'
                    }
                ],
                fromIndex: ''
            }
        },
        created () {
            apiClearCache().then(res => {
                this.$Message.info(res.message)
            })
            apiGetLocation({ address: '重庆市', ak: 'b2Irh9QNnDQ8hl7eq9qduc8tkQmzIsaA', output: 'json' }).then(res => {
                console.log(res)
            })
            apiGetHhTestData().then(res => {
                console.log(res)
            })
        },
        methods: {
            dragStart (index) {
                this.fromIndex = index
            },
            dragOver () {
                event.preventDefault()
            },
            drop (index) {
                event.preventDefault()
                const temp = this.lists[this.fromIndex]
                this.lists.splice(this.fromIndex, 1, this.lists[index])
                this.lists.splice(index, 1, temp)
            },
        }
    }
</script>

<style lang="scss" scoped>
    .lists {
        background-color: #fff;
        .list {
            margin: 0 20px;
            .dragover-area {
                height: 20px;
            }
        }
    }
</style>
