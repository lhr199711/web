<template>
    <div class="contract-entrust-search">
        <div class="public-search">
            <div class="search-content">
                <h6>查询条件</h6>
                <div class="row">
                    <adt-city-selector
                        :defaultData="searchContent.departurePort"
                        @on-change="changeDispatchCity"
                        style="width: 710px; margin-right: 20px;"
                    />
                    <adt-city-selector
                        :defaultData="searchContent.destinationPort"
                        @on-change="changeDestinationCity"
                        style="width: 710px;"
                    />
                </div>
                <div class="row">
                    <!-- 运输类型 -->
                    <div class="tabs">
                        <span
                            v-for="type in dictionaryTransportType"
                            :key="type.dictionaryKey"
                            :class="{ active: searchContent.transportType && searchContent.transportType.split('~')[0] === type.dictionaryKey }"
                            @click="chooseTransportType(type.dictionaryKey + '~' + type.dictionaryValue)"
                        >
                            {{ type.dictionaryValue }}
                        </span>
                    </div>
                    <div class="err-log">*</div>
                    <Select
                        v-model="searchContent.freighterStatus"
                        placeholder="货运要求状态"
                        clearable
                        @on-select="selcectChick"
                        style="width: 540px;"
                    >
                        <svg class="iconfont" slot="prefix">
                            <use xlink:href="#icon-caidan" />
                        </svg>
                        <Option
                            v-for="(selectData, id) in dictionaryFreighterStatus"
                            :key="id"
                            :value="selectData.dictionaryKey"
                        >
                            {{ selectData.dictionaryValue }}
                        </Option>
                    </Select>
                    <div class="tabs" style="margin: 0 20px;">
                        <!-- 危险类型先不做 -->
                        <span
                            v-for="type in dictionaryGoodsType"
                            :key="type.dictionaryKey"
                            v-show="type.dictionaryKey !== 'D'"
                            :class="{ active: searchContent.cargoType && searchContent.cargoType.split('~')[0] === type.dictionaryKey }"
                            @click="chooseCargoType(type.dictionaryKey + '~' + type.dictionaryValue)"
                        >
                            {{ type.dictionaryValue }}
                        </span>
                    </div>
                    <Button type="primary" shape="circle" size="large" @click="handleSearch">查询</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            searchContent: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return  {
                // 运输类型
                dictionaryTransportType: this.$getDictionary('TRANSPORT_TYPE') || [],
                // 货运要求状态
                dictionaryFreighterStatus: this.$getDictionary('FREIGHTREQ_STATUS') || [],
                // 货物类型
                dictionaryGoodsType: this.$getDictionary('GOODS_TYPE') || [],
            }
        },
        methods: {
            // 运输类型
            chooseTransportType (key) {
                if (this.searchContent.transportType === key) {
                    this.searchContent.transportType = ''
                } else {
                    this.searchContent.transportType = key
                }
            },
            // 货物类型
            chooseCargoType (key) {
                if (this.searchContent.cargoType === key) {
                    this.searchContent.cargoType = ''
                } else {
                    this.searchContent.cargoType = key
                }
            },
            // 将选中的委托状态val传过去
            selcectChick (val) {
                console.log(val)
                this.searchContent.freighterStatusTranslate = val.label
            },
            // 查询
            handleSearch () {
                if (!this.searchContent.freighterStatus) {
                    this.$Message.warning('请选择货运要求状态')
                } else {
                    this.$emit('search', this.searchContent)
                }
            },
            // 选择启运地城市
            async changeDispatchCity (value) {
                this.searchContent.departurePortLabel = value.data[value.data.length - 1].label
                this.searchContent.departurePort = value.value.join('~')
                // this.dispatchOptions = await this._handelDir(value.value)
            },
            // 选择目的地城市
            async changeDestinationCity (value) {
                this.searchContent.destinationPortLabel = value.data[value.data.length - 1].label
                this.searchContent.destinationPort = value.value.join('~')
                // this.destinationOptions = await this._handelDir(value.value)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .box-space {
        margin-left: 10px;
    }
    .err-log {
        color: #FF9B00;
        margin: 0 2px 0 15px;
    }
    /deep/ .ivu-icon-ios-arrow-down {
        // top: 40%;
        // line-height: 60px;
        color: #fff;
        &:first-child {
            top: 40%;
        }
    }
    /deep/ .ivu-icon-ios-close-circle {
        line-height: 60px;
        color: #fff;
    }
    /deep/ .ivu-cascader-label {
        line-height: 60px;
        color: #fff;
    }
    // /deep/ .ivu-input-suffix {
    //     width: 40px;
    //     margin-right: 20px;
    // }
</style>
