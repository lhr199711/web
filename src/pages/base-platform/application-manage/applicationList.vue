<template>
    <div>
        <div class="public-search-headjz">
            <search-status
                :status-list="cptauditStatusList"
                @auditStatus="auditStatus"
            ></search-status>
            <Divider style="margin: 20px 0" />
            <div class="public-search-input-jz">
                <Row :gutter="20" class="publc-bottom20">
                    <Col span="8">
                        <Col span="12">
                            <span>应用名称:</span>
                            <Input
                                v-model="searchForm.appName"
                                clearable
                            ></Input>
                        </Col>
                    </Col>
                    <Col span="8">
                        <Col span="12">
                            <span>应用编码:</span>
                            <Input
                                v-model="searchForm.appCode"
                                clearable
                            ></Input>
                        </Col>
                    </Col>
                </Row>
            </div>
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
            <div>
                <Button @click="add()">
                    新增应用
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#icon-andaotongV3ICON_tianjia"></use>
                    </svg>
                </Button>
            </div>
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
                    <span v-show="row.status === 'disable'" title="编辑">
                        <svg
                            class="icon-action iconfont"
                            aria-hidden="true"
                            @click="edit(row)"
                        >
                            <use
                                xlink:href="#icon-andaotongV3ICON_caozuo-bianji"
                            />
                        </svg>
                    </span>
                    <span v-show="row.status === 'disable'" title="删除">
                        <svg
                            class="icon-action iconfont"
                            aria-hidden="true"
                            @click="remove(row)"
                        >
                            <use
                                xlink:href="#icon-andaotongV3ICON_caozuo-shanchu"
                            />
                        </svg>
                    </span>

                    <span
                        v-if="row.status === 'disable'"
                        class="icon-action icon-action-word"
                        title="启用"
                        @click="startUsing(row)"
                        >启</span
                    >
                    <span
                        v-if="row.status === 'enable'"
                        class="icon-action icon-action-word"
                        title="停用"
                        @click="stopUsing(row)"
                        >停</span
                    >
                    <span>
                        <Button
                            size="small"
                            shape="circle"
                            @click="menuHandel(row)"
                            >菜单管理</Button
                        >
                    </span>
                </template>
            </Table>
        </div>
        <adt-my-modal
            :showModal="modalOption.isShowModal"
            :title="modalOption.modalTitle"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk"
        >
            <Form
                ref="addFormName"
                :model="addForm"
                :rules="addFormruleValidate"
                :label-width="100"
            >
                <FormItem label="应用编码：" prop="appCode">
                    <Input
                        v-model="addForm.appCode"
                        placeholder="请输入..."
                        :disabled="addForm.appId ? true : false"
                    ></Input>
                </FormItem>
                <FormItem label="应用名称：" prop="appName">
                    <Input
                        v-model="addForm.appName"
                        placeholder="请输入..."
                    ></Input>
                </FormItem>
                <FormItem label="域名：" prop="url">
                    <Input
                        v-model="addForm.url"
                        placeholder="请输入..."
                    ></Input>
                </FormItem>
                <FormItem label="首页链接：" prop="indexUrl">
                    <Input
                        v-model="addForm.indexUrl"
                        placeholder="请输入..."
                    ></Input>
                </FormItem>
                <FormItem label="排序值：" prop="sort">
                    <Input
                        v-model="addForm.sort"
                        type="number"
                        class="number"
                        placeholder="请输入..."
                    ></Input>
                </FormItem>
            </Form>
        </adt-my-modal>
        <!-- 二次删除 -->
        <adt-reconfirm-modal
            :showModal="isreconfirm"
            @on-visible-change="deleteVisibleChange"
            @on-ok="deleteOk"
        />
    </div>
</template>

<script>
    import searchStatus from '@/pages/logistics-commission/order/search-status'
    import pagination from '@/pages/logistics-commission/order/pagination/index'
    import {
        apiAppAdd,
        apiAppList,
        apiAppEdit,
        apiAppDelete,
        apiAppStatus
    } from '@/api/logisticsCommission'
    import tableMixin from '@/mixins/tableMixin'
    import utilMixin from '@/pages/logistics-commission/mixins/utilMixin'
    export default {
        name: "application",
        mixins: [tableMixin, utilMixin],
        components: {
            searchStatus,
            pagination
        },
        data () {
            return {
                isreconfirm: false,
                statusList: this.$getDictionary('ENABLE_STATUS'),
                // 分页的搜索条件http://localhost:8000/applicationList
                searchForm: {
                    page: 1,
                    size: 10,
                },
                total: 0,
                trspModeList: [],
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
                        title: '应用名称',
                        align: 'center',
                        key: 'appName'
                    },
                    {
                        title: '应用编码',
                        align: 'center',
                        key: 'appCode'
                    },
                    {
                        title: '应用状态',
                        align: 'center',
                        key: 'statusTranslate'
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createDatetime'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'operating',
                        slot: 'action'
                    }
                ],
                tableData: [],
                modalOption: {
                    isShowModal: false,
                    modalTitle: ''
                },
                addForm: {
                },
                addFormruleValidate: {
                    remark: [
                        {
                            required: true,
                            message: '拒绝理由必填',
                            trigger: 'blur',
                        },
                        {
                            type: 'string',
                            min: 2,
                            message: '最小输入两个字符',
                            trigger: 'blur',
                        },
                    ],
                },
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

        },
        mounted () {

        },
        methods: {
            // 2删
            deleteVisibleChange (data) {
                this.isreconfirm = data
            },
            // 2 确认
            deleteOk () {
                this.isreconfirm = false
                this._apiAppDelete()

            },
            // 菜单管理
            menuHandel (row) {
                this.$router.push({
                    path: '/menuAdministration',
                    query: {
                        appCode: row.appCode,
                    },
                })
            },
            // 直接接口
            getTableList () {
                const data = {
                    ...this.searchForm
                }
                apiAppList({ data }).then(res => {
                    if (res.code == 200) {
                        let { content = [] } = res.data
                        this.tableData = content.map(item => {
                            return {
                                ...item,
                                createDatetime: this.moment_xie_Y_M_D_m(item.createDatetime)
                            }
                        })
                        this.total = +res.data.totalElements
                    }
                })
            },
            // 控制状态切换传值
            auditStatus (code) {
                this.searchForm.status = code
            },
            edit (row) {
                this.addForm = row
                this.modalOption.isShowModal = true
                this.modalOption.modalTitle = '修改应用'
            },
            _addEditApp (api) {
                const data = {
                    ...this.addForm,
                    status: 'disable'//enable
                }
                api({ data }).then((res) => {
                    if (res.code == 200) {
                        this.$refs.addFormName.resetFields();
                        this.$Message.success('操作成功')
                        this.changePage_m()
                        return
                    }
                })
                .catch(res => {
                    this.changePage_m()
                })
            },
            _statusApp (appId, status,version) {
                const data = {
                    appId,
                    status,
                    version
                }
                apiAppStatus({ data }).then((res) => {
                    if (res.code == 200) {
                        this.changePage_m()
                        this.$Message.success('操作成功')
                        return
                    }
                    this.$Message.error(`${res.message}`)
                })
            },
            remove (row) {
                this.row = row
                this.isreconfirm = true
            },
            _apiAppDelete () {
                const data = {
                    appId: this.row.appId
                }
                apiAppDelete({ ...data }).then((res) => {
                    if (res.code == 200) {
                        this.changePage_m()
                        this.$Message.success('删除成功')
                    }
                })
            },
            startUsing (row) {
                this._statusApp(row.appId, 'enable',row.version)
            },
            stopUsing (row) {
                this._statusApp(row.appId, 'disable',row.version)
            },
            add () {
                this.addForm = {}
                this.modalOption.isShowModal = true
                this.modalOption.modalTitle = '新增应用'
            },
            // 弹框里面的取消按钮
            visibleChange (data) {
                this.modalOption.isShowModal = data
            },
            // 弹框里面的确认按钮
            handleItemModalOk () {
                this.modalOption.isShowModal = false
                if (this.addForm.appId) {
                    this._addEditApp(apiAppEdit)
                    return
                }
                this._addEditApp(apiAppAdd)
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
