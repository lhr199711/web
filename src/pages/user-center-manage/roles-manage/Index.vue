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
                            <span>角色名称:</span>
                            <Input
                                v-model="searchForm.roleName"
                                clearable
                            ></Input>
                        </Col>
                    </Col>
                    <Col span="8">
                        <Col span="12">
                            <span>角色类型:</span>
                            <Select v-model="searchForm.roleType" clearable>
                                <Option
                                    v-for="item in roleTypeList"
                                    :key="item.dictionaryKey"
                                    :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option
                                >
                            </Select>
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
                    新增角色
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
                    <span v-if="row.roleStatus === 'disable'" title="编辑">
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
                    <span v-if="row.roleStatus === 'disable'" title="删除">
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
                        v-if="row.roleStatus === 'disable'"
                        class="icon-action icon-action-word"
                        title="启用"
                        @click="startUsing(row)"
                        >启</span
                    >
                    <span
                        v-if="row.roleStatus === 'enable'"
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
                            >配置菜单</Button
                        >
                    </span>
                </template>
            </Table>
        </div>
        <!-- 新增角色 -->
        <adt-my-modal
            :showModal="modalOption.isShowModal"
            :title="modalOption.modalTitle"
            :width="modalOption.width"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk"
        >
            <Form
                ref="addFormName"
                :model="addForm"
                :rules="addFormruleValidate"
                :label-width="120"
            >
                <Row>
                    <Col span="12">
                        <FormItem label="角色名称:" prop="roleName">
                            <Input
                                v-model="addForm.roleName"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="是否打开新窗口:" prop="newWindow">
                            <Select v-model="addForm.newWindow">
                                <!-- <Option value="Y">是</Option>
                                <Option value="N">否</Option> -->
                                <Option
                                    v-for="item in dictionaryNewWindow"
                                    :key="item.dictionaryKey"
                                    :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option
                                >
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="角色类型:" prop="roleType">
                            <Select v-model="addForm.roleType" clearable>
                                <Option
                                    v-for="item in roleTypeList"
                                    :key="item.dictionaryKey"
                                    :value="item.dictionaryKey"
                                    >{{ item.dictionaryValue }}</Option
                                >
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="状态:" prop="roleStatus">
                            <Select v-model="addForm.roleStatus">
                                <Option value="enable">可用</Option>
                                <Option value="disable">不可用</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="角色描述:" prop="roleDescribe">
                            <Input
                                v-model="addForm.roleDescribe"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 5 }"
                                placeholder="请输入..."
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <div>
                    <div class="icon-title">选择图标</div>
                    <div class="icon-container">
                        <div
                            :class="[
                                'icon',
                                { active: addForm.iconCode === icon },
                            ]"
                            v-for="(icon, index) of iconGather"
                            :key="index"
                            @click="chooseIcon(icon)"
                        >
                            <svg class="iconfont" aria-hidden="true">
                                <use :xlink:href="`#${icon}`"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </Form>
        </adt-my-modal>
        <!-- 二次删除 -->
        <adt-reconfirm-modal
            :showModal="isreconfirm"
            @on-visible-change="deleteVisibleChange"
            @on-ok="deleteOk"
        />
        <!-- 配置菜单 -->
        <menu-tree ref="menuTreeName"></menu-tree>
    </div>
</template>

<script>
    import searchStatus from '@/pages/logistics-commission/order/search-status'
    import pagination from '@/pages/logistics-commission/order/pagination/index'
    import menuTree from './MenuTree.vue'
    import {
        apiRoleAdd,
        apiRoleList,
        apiRoleEdit,
        apiRoleDelete,
        apiRoleStatus
    } from '@/api/user-center-manage/roleManage'
    import tableMixin from '@/mixins/tableMixin'
    import utilMixin from '@/pages/logistics-commission/mixins/utilMixin'
    export default {
        name: "application",
        mixins: [tableMixin, utilMixin],
        components: {
            searchStatus,
            pagination,
            menuTree
        },
        data () {
            return {
                isreconfirm: false,
                // 启用禁用状态
                statusList: this.$getDictionary('ENABLE_STATUS'),
                // 角色类型
                roleTypeList: this.$getDictionary('ROLE_TYPE'),
                // 是否打开新窗口
                dictionaryNewWindow: this.$getDictionary('Y_N'),
                // 分页的搜索条件
                searchForm: {
                    page: 1,
                    size: 15,
                },
                total: 0,
                trspModeList: [],
                // 图标集合
                iconGather: [
                    'icondian', 'iconADTcaidanICON_fanganbianjiqi', 'iconADTcaidanICON_chanpinguanli', 'iconADTcaidanICON_fanganchaxun', 'iconADTcaidanICON_chanpinzhongxin', 'iconADTcaidanICON_caidanguanli', 'iconADTcaidanICON_chanpinbianjiqi', 'iconADTcaidanICON_fuwuqudongqi', 'iconADTcaidanICON_gerenzhongxin',
                    'iconADTcaidanICON_wuliufanganguanli', 'iconADTcaidanICON_kehufankuizhongxin', 'iconADTcaidanICON_dingdanzhongxin', 'iconADTcaidanICON_huoyunyaoqiuguanli', 'iconADTcaidanICON_fanganshoucangjia', 'iconADTcaidanICON_shouye', 'iconADTcaidanICON_shijianchakanqi', 'iconADTcaidanICON_kehuguanli',
                    'iconADTcaidanICON_wuliuquanchengjihua', 'iconADTcaidanICON_gongyingshangguanli', 'iconADTcaidanICON_gangweijiaoseguanli', 'iconADTcaidanICON_xiaoxiguanli', 'iconADTcaidanICON_yingyongkongzhitai', 'iconADTcaidanICON_yonghuguanli', 'iconADTcaidanICON_mobanguanli', 'iconADTcaidanICON_xuqiubianjiqi',
                    'iconADTcaidanICON_zhangdanguanli', 'iconADTcaidanICON_xietongxiezuochakan', 'iconADTcaidanICON_wuliuweituoguanli', 'iconADTcaidanICON_wuliuwenjianjia', 'iconADTcaidanICON_zhihangkanban', 'iconADTcaidanICON_zhihangchakanqi', 'iconADTcaidanICON_zidianguanli', 'iconADTcaidanICON_zuzhijigouguanli',
                    'iconADTcaidanICON_zuzhiquanxianguanli', 'iconADTcaidanICON_biaozhunyingsheqi'
                ],
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
                        title: '角色名称',
                        align: 'center',
                        key: 'roleName'
                    },
                    {
                        title: '是否打开新窗口',
                        align: 'center',
                        key: 'newWindowTranslate'
                    },
                    {
                        title: '角色类型',
                        align: 'center',
                        key: 'roleTypeTranslate'
                    },
                    {
                        title: '角色状态',
                        align: 'center',
                        key: 'roleStatusTranslate'
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
                    modalTitle: '',
                    width:"800px"
                },
                addForm: {
                },
                addFormruleValidate: {
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
                this._apiRoleDelete()

            },
            // 选择icon
            chooseIcon (icon) {
                this.$set(this.addForm, 'iconCode', icon)
            },
            // 配置菜单
            menuHandel (row) {
                this.$refs.menuTreeName.openDialog(row.roleId)
            },
            // 直接接口
            getTableList () {
                const data = {
                    ...this.searchForm
                }
                apiRoleList({ data }).then(res => {
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
                this.searchForm.roleStatus = code
            },
            // 修改
            edit (row) {
                this.addForm = row
                this.modalOption.isShowModal = true
                this.modalOption.modalTitle = '修改角色'
            },
            // 修改/新增接口
            _addEditApp (api) {
                const data = {
                    ...this.addForm,
                    // status: 'disable'//enable
                }
                api({ data }).then((res) => {
                    if (res.code == 200) {
                        this.$refs.addFormName.resetFields();
                        this.changePage_m()
                        this.$Message.success('操作成功')
                        return
                    }
                    this.$Message.error(`${res.message}`)
                })
            },
            // 修改状态接口
            _statusApp (roleId, roleStatus) {
                const data = {
                    roleId,
                    roleStatus
                }
                apiRoleStatus({ data }).then((res) => {
                    if (res.code == 200) {
                        this.changePage_m()
                        this.$Message.success('操作成功')
                        return
                    }
                    this.$Message.error(`${res.message}`)
                })
            },
            // 删除
            remove (row) {
                this.isreconfirm = true
                this.row = row
            },
            // 删除接口
            _apiRoleDelete (row) {
                const data = {
                    roleId: this.row.roleId
                }
                apiRoleDelete({ ...data }).then((res) => {
                    if (res.code == 200) {
                        this.changePage_m()
                        this.$Message.success('删除成功')
                    }
                })
            },
            startUsing (row) {
                this._statusApp(row.roleId, 'enable')
            },
            stopUsing (row) {
                this._statusApp(row.roleId, 'disable')
            },
            add () {
                this.addForm = {}
                this.modalOption.isShowModal = true
                this.modalOption.modalTitle = '新增角色'
            },
            // 弹框里面的取消按钮
            visibleChange (data) {
                this.modalOption.isShowModal = data
            },
            // 弹框里面的确认按钮
            handleItemModalOk () {
                this.modalOption.isShowModal = false
                if (this.addForm.roleId) {
                    this._addEditApp(apiRoleEdit)
                    return
                }
                this._addEditApp(apiRoleAdd)
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
    // 选择图标的样式
    .icon-title {
        padding: 20px 0 12px 0;
        border-top: 1px solid $border-color;
        &:before {
            content: '*';
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 14px;
            color: #ff001b;
        }
    }
    .icon-container {
        display: flex;
        flex-wrap: wrap;
        max-height: 190px;
        margin-bottom: 30px;
        padding: 30px 0 0 10px;
        overflow-x: auto;
        background-color: $background-color;
        border-radius: 4px;
        // @extend %scrollbar-crosswise;
        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            margin: 0 0 30px 30px;
            cursor: pointer;
            &.active {
                color: $light-color;
                background-color: #fff;
                border-radius: 100%;
            }
        }
        .iconfont {
            font-size: 36px;
        }
    }
</style>
