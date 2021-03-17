<template>
    <div class="contract-entrust-search">
        <div class="public-search">
            <div class="search-content">
                <h6>单次委托查询条件</h6>
                <div class="row">
                    <adt-city-selector :defaultData="searchContent.departurePort" @on-change="changeDispatchCity" style="width: 710px; margin-right: 20px;" />
                    <!-- <Input v-model="searchContent.departurePort" placeholder="启运地" style="margin-right: 0;">
                        <svg class="iconfont" slot="prefix">
                            <use xlink:href="#icon-caidan" />
                        </svg>
                        <div slot="suffix">
                            <span class="city-content">城市</span>
                        </div>
                    </Input> -->
                    <adt-city-selector :defaultData="searchContent.destinationPort" @on-change="changeDestinationCity"  style="width: 710px;" />
                    <!-- <Input v-model="searchContent.destinationPort" placeholder="目的地" style="margin-left: 20px; margin-right: 0;">
                        <svg class="iconfont" slot="prefix">
                            <use xlink:href="#icon-caidan" />
                        </svg>
                        <div slot="suffix">
                            <span class="city-content">场所</span>
                        </div>
                    </Input> -->
                </div>
                <div class="row">
                    <div class="tabs">
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
                    <Select
                        v-model="searchContent.entrustStatus"
                        placeholder="委托状态"
                        clearable
                        @on-select="selcectChick"
                        style="width: 320px; margin-left: 20px;"
                    >
                        <svg class="iconfont" slot="prefix">
                            <use xlink:href="#icon-caidan" />
                        </svg>
                        <Option
                            v-for="(selectData, id) in dictionaryEntrustStatus"
                            :key="id"
                            :value="selectData.dictionaryKey"
                        >
                            {{ selectData.dictionaryValue }}
                        </Option>
                    </Select>
                    <Input v-model="searchContent.contractCode" clearable placeholder="合同号" style="width: 540px; margin-left: 20px;">
                        <svg class="iconfont" slot="prefix">
                            <use xlink:href="#icon-caidan" />
                        </svg>
                    </Input>
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
                // 货物类型
                dictionaryGoodsType: this.$getDictionary('GOODS_TYPE') || [],
                // 委托状态
                dictionaryEntrustStatus: this.$getDictionary('ENTRUST_STATUS') || []
            }
        },
        methods: {
            chooseCargoType (key) {
                if (this.searchContent.cargoType === key) {
                    this.searchContent.cargoType = ''
                } else {
                    this.searchContent.cargoType = key
                }
            },
            // 将选中的委托状态val传过去
            selcectChick (val) {
                this.searchContent.entrustStatusTranslate = val.label
            },
            // 查询
            handleSearch () {
                // 起期不能大于止期
                if (+new Date(this.searchContent.startPeriod) > +new Date(this.searchContent.untilPeriod)) {
                    this.$Message.warning('委托起期不能大于委托止期')
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
