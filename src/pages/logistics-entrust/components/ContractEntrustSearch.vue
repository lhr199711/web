<template>
    <div class="contract-entrust-search">
        <div class="public-search">
            <div class="search-content">
                <h6>单次委托查询条件</h6>
                <div class="row">
                    <Input v-model="searchContent.entrustCode" clearable placeholder="合同委托编号">
                        <svg class="iconfont" slot="prefix">
                            <use xlink:href="#icon-caidan" />
                        </svg>
                    </Input>
                    <Input v-model="searchContent.contractCode" clearable placeholder="合同号">
                        <svg class="iconfont" slot="prefix">
                            <use xlink:href="#icon-caidan" />
                        </svg>
                    </Input>
                    <div class="tabs">
                        <!-- 危险类型先不做 -->
                        <span
                            v-for="type in goodsType"
                            :key="type.dictionaryKey"
                            v-show="type.dictionaryKey !== 'D'"
                            :class="{ active: searchContent.cargoType && searchContent.cargoType.split('~')[0] === type.dictionaryKey }"
                            @click="chooseCargoType(type.dictionaryKey + '~' + type.dictionaryValue)"
                        >
                            {{ type.dictionaryValue }}
                        </span>
                    </div>
                </div>
                <div class="row">
                    <DatePicker v-model="searchContent.startPeriod" type="date" placeholder="委托起期" style="width: 600px;" />
                    <DatePicker v-model="searchContent.untilPeriod" type="date" placeholder="委托止期" style="width: 600px;" />
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
                goodsType: this.$getDictionary('GOODS_TYPE')
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
            // 查询
            handleSearch () {
                // 起期不能大于止期
                if (+new Date(this.searchContent.startPeriod) > +new Date(this.searchContent.untilPeriod)) {
                    this.$Message.warning('委托起期不能大于委托止期')
                } else {
                    this.$emit('search', this.searchContent)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
