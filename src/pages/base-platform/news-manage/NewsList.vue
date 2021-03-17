<template>
    <div class="newsList">
        <div class="public-search-headjz">
            <search-status
                :status-list="statusList"
                @auditStatus="auditStatus"
            ></search-status>
            <Divider style="margin: 20px 0" />
            <div class="search-btn">
                <Button
                    class="searchButton"
                    shape="circle"
                    @click="handleFilter_m"
                >
                    查询
                    <Icon type="ios-search" />
                </Button>
            </div>
        </div>
        <div class="public-btn-pagina">
            <div></div>
            <pagination
                :total="total"
                :page.sync="searchForm.page"
                :limit="searchForm.size"
                @changePage="changePage_m"
            ></pagination>
        </div>
        <div class="public-table-data">
            <Table :columns="tableColumns" :data="tableData" stripe>
                <!-- 操作 -->
                <template slot-scope="{ row, index }" slot="action">
                    <span v-show="row.messageStatus == 0">
                        <Button
                            size="small"
                            shape="circle"
                            @click="readHandel(row)"
                            >标记已读</Button
                        >
                    </span>
                </template>
            </Table>
        </div>
    </div>
</template>

<script>
    import searchStatus from '@/pages/logistics-commission/order/search-status'
    import pagination from '@/pages/logistics-commission/order/pagination/index'
    import {
        apiMessageRecordList,
        apiMessageRecordStatus
    } from '@/api/base-platform/signalCommunication'
    import tableMixin from '@/mixins/tableMixin'
    import utilMixin from '@/pages/logistics-commission/mixins/utilMixin'
    export default {
        name: "newsList",
        mixins: [tableMixin, utilMixin],
        components: {
            searchStatus,
            pagination,
        },
        data () {
            return {
                // 消息状态你
                // statusList: this.$getDictionary('MSG_STATUS'),
                statusList: [
                    {
                        label: '已读',
                        value: '1'
                    },
                    {
                        label: '未读',
                        value: '0'
                    },
                ],
                // 分页的搜索条件
                searchForm: {
                    page: 1,
                    size: 10,
                },
                total: 0,
                tableColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        // type: 'index',
                        width: '80px',
                        render: (h, params) => {
                            return h('span', params.index + (this.searchForm.page - 1) * this.searchForm.size + 1)
                        }
                    },
                    {
                        title: '发送时间',
                        align: 'center',
                        key: 'sendDatetime'
                    },
                    {
                        title: '发送人',
                        align: 'center',
                        key: 'sender'
                    },
                    {
                        title: '消息内容',
                        align: 'center',
                        key: 'messageContent'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'messageStatusTranslate'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'operating',
                        slot: 'action'
                    }
                ],
                tableData: [],
            };
        },
        computed: {
            cptauditStatusList () {
                let arr = this.statusList.map((item) => {
                    return {
                        label: item.dictionaryValue,
                        value: item.dictionaryKey,
                    }
                })
                return arr
            },
        },
        created () {
            this.getTableList()
        },
        mounted () {

        },
        methods: {
            // 标记为已读
            readHandel (row) {
                this._statusEdit(row.messageId)
            },
            // 直接接口
            getTableList () {
                const data = {
                    ...this.searchForm
                }
                apiMessageRecordList({ data }).then(res => {
                    if (res.code == 200) {
                        let { content = [] } = res.data
                        this.tableData = content.map(item => {
                            return {
                                ...item,
                                sendDatetime: this.moment_xie_Y_M_D_m(item.sendDatetime)
                            }
                        })
                        this.total = +res.data.totalElements
                    }
                })
            },
            // 控制状态切换传值
            auditStatus (code) {
                this.searchForm.messageStatus = code
            },
            // 修改状态接口
            _statusEdit (messageId) {
                const data = {
                    messageId
                }
                apiMessageRecordStatus({ ...data }).then((res) => {
                    if (res.code == 200) {
                        this.changePage_m()
                        this.$Message.success('操作成功')
                    }
                })
            },
        }
    };
</script>

<style scoped lang="scss">
    /deep/.number input::-webkit-outer-spin-button,
    /deep/.number input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    /deep/.number input[type='number'] {
        -moz-appearance: textfield;
    }
</style>
