<template>
    <div class="hh">
        <h1>{{ title }}</h1>
        <ul>
            <li v-for="(item, index) in lists" :key="index">
                {{ `${item.name}: ${item.score}` }}
            </li>
        </ul>
        <a href="#anchor">放松放松</a>
        <div id="anchor">5435345</div>
        <component :is="currentChild" ref="childForm"  @syncData="syncData" :mockData="toChildData"></component>
        <!-- <childForm ref="childForm" @syncData="syncData" :mockData="toChildData"></childForm> -->
        <Button @click="handleSubmit()">submit</Button>
        <Table :columns="tableColumns" :data="tableData">
            <!-- <template slot-scope="{ row }" slot="action">
                {{ row }}
            </template> -->
            <template v-slot:action="{ row }">
                {{ row }}
            </template>
        </Table>
        <div class="container">
            <div class="scroll">
                <div class="box">
                    <img src="@/assets/images/imgUpload_bg.png" alt="">
                    <img src="@/assets/images/imgUpload_bg.png" alt="">
                    <img src="@/assets/images/imgUpload_bg.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mockData from './dictionary'
    // import childForm from './child'
    export default {
        // components: {
        //     childForm
        // },
        data () {
            return {
                currentChild: '',
                toChildData: mockData,
                title: '动态加载数据',
                lists: [],
                formData: {},
                // table
                tableColumns: [],
                tableData: [
                    {
                        phone: '156756456465',
                        name: 'hh'
                    },
                    {
                        phone: '152453454545',
                        name: 'xx'
                    },
                ]
            }
        },
        created () {
            this.asyncComponents('child')
            this.initData()
        },
        // computed: {
        //     currentChild () {
        //         return 'childForm'
        //     }
        // },
        methods: {
            // 动态加载子组件
            asyncComponents(templateName){
                this.currentChild = require(`./${templateName}`).default
            },
            // 子组件数据发生改变，同步到父组件，并对数据进行组装
            syncData (childData) {
                this.formData = { ...this.formData, ...childData }
            },
            // 初始化动态数据
            initData () {
                this.lists = [
                    {
                        name: '小明',
                        score: 100
                    },
                    {
                        name: '韩梅梅',
                        score: 200
                    }
                ]
                for (let data of mockData) {
                    this.tableColumns.push(
                        {
                            title: data.label,
                            key: data.prop
                        }
                    )
                }
                this.tableColumns.push(
                    {
                        title: '操作',
                        slot: 'action'
                    }
                )
            },
            handleSubmit () {
                console.log(this.formData)
                // 提交时，调用子组件的表单校验
                let validStatus = this.$refs['childForm'].validateChildForm()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-item {
        margin-left: 20px;
    }
    .container {
        height: 300px;
        overflow: hidden;
    }
    .scroll {
        width: 100%;
        height: 300px;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 10px;
        /* 解决ios上滑动不流畅 */
        -webkit-overflow-scrolling: touch;
        box-sizing: content-box;
    }
    .box {
        width: 900px;
        height: 300px;
        overflow: hidden;
        display: flex;
    }
    img {
        width: 300px;
        height: 100%;
    }
</style>
