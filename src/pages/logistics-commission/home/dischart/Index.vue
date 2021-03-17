<template>
    <div class="eachr-box">
        <div class="yue">
            <div class="tit">月接收委托</div>
            <div class="legend-box">
                <span class="c_g">
                    <span class="su">
                        <Icon type="md-radio-button-off" />
                    </span>
                    <span class="text">{{ mouthObj.echartName[0].name }}</span>
                </span>
                <span class="unsu">
                    <Icon type="md-radio-button-off" />
                </span>
                <span class="text">{{ mouthObj.echartName[1].name }}</span>
            </div>
            <div id="lineChart" style="height: 240px" ref="echartLine"></div>
        </div>
        <div class="chart-bottom">
            <div class="zhou">
                <div class="tit">周接收委托</div>
                <div class="legend-box">
                    <span class="c_g">
                        <span class="su">
                            <Icon type="md-radio-button-off" />
                        </span>
                        <span class="text">本周</span>
                    </span>
                    <span class="unsu">
                        <Icon type="md-radio-button-off" />
                    </span>
                    <span class="text">上周</span>
                </div>
                <ve-line
                    :data="chartData"
                    height="280px"
                    :settings="chartSettings"
                    :extend="chartExtend"
                ></ve-line>
            </div>
            <div class="ji_du">
                <div class="tit">季度接收委托</div>
                <div class="legend-box">
                    <span class="c_g">
                        <span class="su">
                            <Icon type="md-radio-button-off" />
                        </span>
                        <span class="text">{{ jiduObj.echartName[0].name }}年</span>
                    </span>
                    <span class="unsu">
                        <Icon type="md-radio-button-off" />
                    </span>
                    <span class="text">{{ jiduObj.echartName[1].name }}年</span>
                </div>
                <div id="barChart" style="height: 240px" ref="echartBar"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    apiGetMonthlyData,
    apiGetQuarterEntrustData,
    apiGetWeekData
} from '@/api/logisticsCommission'
import utilMixin from '../../mixins/utilMixin'
export default {
    name: "",
    mixins: [utilMixin],
    data () {
        this.chartSettings = {
            stack: { '用户': ['2020/03', '2020/04'] },
        }
        return {
            // 月图的配置
            mouthObj: {
                echartName: [
                    { name: '今年' },
                    { name: '去年' },
                ],
                xAxisData: [],
                echartData: [
                    [7, 16, 18, 14, 9, 29, 26, 25, 23, 24, 19, 8],
                    [26, 10, 16, 24, 8, 14, 25, 12, 7, 13, 15, 19],
                ],
                echartColor: ['#02adb5', '#999999'],
            },
            //季度的配置
            jiduObj: {
                echartName: [
                    { name: '今年' },
                    { name: '去年' },
                ],
                xAxisData: ['1季度','2季度','3季度','4季度'],
                echartData: [
                    [7, 16, 18, 14, 9, 29, 26, 25, 23, 24, 19, 8],
                    [26, 10, 16, 24, 8, 14, 25, 12, 7, 13, 15, 19],
                ],
                echartColor: ['#02adb5', '#999999'],
            },
            // v-v
            chartExtend: {
                legend: {
                    show: false
                },
                yAxis: {
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#f5f5f5'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                },
                color: ['#02adb5', '#999999']
            },
            chartData: {
                columns: ['日期', '本周', '上周'],
                rows: [
                    { '日期': '周一' },
                    { '日期': '周二' },
                    { '日期': '周三' },
                    { '日期': '周四' },
                    { '日期': '周五' },
                    { '日期': '周六' },
                    { '日期': '周日' },
                ]
            }
        };
    },
    created () {
        this.getChartData()
    },
    mounted () {
    },
    methods: {
        getChartData () {
            apiGetMonthlyData().then(({ data }) => {
                this.mouthObj.echartName[0].name = this.moment_xie_Y_M_m(data.thisYearMonth)
                this.mouthObj.echartName[1].name = this.moment_xie_Y_M_m(data.lastYearMonth)
                let list = []
                for (let i = 1; i <= data.dayNumber; i++) {
                    list.push(i)
                }
                this.xAxisData = list
                this.mouthObj.echartData[0] = data.nowMonthData
                this.mouthObj.echartData[1] = data.lastYearMonthData

                this.lineChart()
            })
            apiGetQuarterEntrustData().then(({ data }) => {
                this.jiduObj.echartName[0].name = data.nowYear
                this.jiduObj.echartName[1].name = data.lastYear
                this.jiduObj.echartData[0] = data.nowYearQuarterData
                this.jiduObj.echartData[1] = data.lastYearQuarterData
                this.lineChart_jidu()
            })
            apiGetWeekData().then(({ data }) => {
                this.chartData.rows = this.chartData.rows.map((item, index) => {
                    return {
                        ...item,
                        '本周': data.nowWeekData[index],
                        '上周': data.lastWeekData[index],
                    }
                })
            })
        },
        // 月
        lineChart () {
            let t = this
            let echarts = this.$echarts.init(document.getElementById("lineChart"))
            let dataList = []
            echarts.resize()
            for (let i = 0; i < 2; i++) {
                dataList.push({
                    name: this.mouthObj.echartName[i].name,
                    type: 'line',
                    smooth: false,// 是直线  还是曲线
                    symbolSize: 2, // 拐点图形大小,
                    itemStyle: {
                        normal: {
                            color: this.mouthObj.echartColor[i],//折线点的颜色
                            lineStyle: {
                                color: this.mouthObj.echartColor[i]//折线的颜色
                            }
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new t.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: this.mouthObj.echartColor[i] + '1a'
                                },

                                {
                                    offset: 1,
                                    color: this.mouthObj.echartColor[i] + '00'
                                }
                            ])
                        }
                    },
                    data: this.mouthObj.echartData[i]
                })
            }
            echarts.setOption({
                // 设置鼠标移上去显示数据
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                // 图列的配置
                legend: {
                    show: false
                },
                xAxis: {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        // x轴的颜色和宽度
                        lineStyle: {
                            color: '#f5f5f5'
                        }
                    },
                    axisLabel: {
                        color: '#333',
                        // fontSize: '16'
                    },
                    data: this.xAxisData
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        // color: '#5483e3',
                        // fontSize: '16'
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            // color: '#3594FF'
                        }
                    },
                    // 控制网格线是否显示
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#f5f5f5']
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    min: 0,
                    splitNumber: 5,
                    boundaryGap: [0.2, 0.2],
                    data: [0, 50, 100, 150]
                },
                // 直角坐标系内绘图网格
                grid: {
                    top: '5%',
                    left: '5%',
                    right: '5%',
                    bottom: '20%',
                    containLabel: true
                },
                series: dataList
            });
            // 使用刚指定的配置项和数据显示图表。
            // echarts.setOption(option);
        },
        // 季度
        lineChart_jidu () {
            let t = this
            let echarts = this.$echarts.init(document.getElementById("barChart"))
            let dataList = []
            echarts.resize()
            for (let i = 0; i < 2; i++) {
                dataList.push({
                    name: this.jiduObj.echartName[i].name,
                    type: 'line',
                    smooth: true,// 是直线  还是曲线
                    symbolSize: 2, // 拐点图形大小,
                    itemStyle: {
                        normal: {
                            color: this.jiduObj.echartColor[i],//折线点的颜色
                            lineStyle: {
                                color: this.jiduObj.echartColor[i]//折线的颜色
                            }
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new t.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: this.jiduObj.echartColor[i] + '1a'
                                },

                                {
                                    offset: 1,
                                    color: this.jiduObj.echartColor[i] + '00'
                                }
                            ])
                        }
                    },
                    data: this.jiduObj.echartData[i]
                })
            }
            echarts.setOption({
                // 设置鼠标移上去显示数据
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                // 图列的配置
                legend: {
                    show: false
                },
                xAxis: {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        // x轴的颜色和宽度
                        lineStyle: {
                            color: '#f5f5f5'
                        }
                    },
                    axisLabel: {
                        color: '#333',
                        // fontSize: '16'
                    },
                    data: this.jiduObj.xAxisData
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        // color: '#5483e3',
                        // fontSize: '16'
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            // color: '#3594FF'
                        }
                    },
                    // 控制网格线是否显示
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#f5f5f5']
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    min: 0,
                    splitNumber: 5,
                    boundaryGap: [0.2, 0.2],
                    data: [0, 50, 100, 150]
                },
                // 直角坐标系内绘图网格
                grid: {
                    top: '5%',
                    left: '5%',
                    right: '5%',
                    bottom: '20%',
                    containLabel: true
                },
                series: dataList
            });
            // 使用刚指定的配置项和数据显示图表。
            // echarts.setOption(option);
        },
    }
};
</script>

<style scoped lang="scss">
.eachr-box {
    flex: 1;
    height: 591px;
    .yue {
        width: 100%;
        height: 288px;
        position: relative;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
        padding: 69px 0 20px 0;
        margin-bottom: 10px;
        .tit {
            position: absolute;
            top: 20px;
            padding-left: 25px;
            border-left: 3px solid $light-color;
            height: 30px;
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 30px;
        }
        .legend-box {
            position: absolute;
            top: 24px;
            left: 157px;
            font-size: 12px;
            .c_g {
                margin-right: 60px;
            }
            .su {
                color: $light-color;
                padding-right: 6px;
            }
            .unsu {
                color: #333333;
                padding-right: 6px;
            }
            .text {
                vertical-align: text-top;
            }
        }
    }
    //zhou ji
    .chart-bottom {
        display: flex;
        .zhou {
            width: 575px;
            height: 293px;
            background: #ffffff;
            box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
            position: relative;
            padding: 28px 40px 20px 40px;
            margin-right: 10px;
            .tit {
                position: absolute;
                top: 20px;
                left: 0;
                padding-left: 25px;
                border-left: 3px solid $light-color;
                height: 30px;
                font-size: 16px;
                font-weight: 400;
                color: #333333;
                line-height: 30px;
            }
            .legend-box {
                position: absolute;
                bottom: 10px;
                left: 222px;
                font-size: 12px;
                .c_g {
                    margin-right: 60px;
                }
                .su {
                    color: $light-color;
                    padding-right: 6px;
                }
                .unsu {
                    color: #333333;
                    padding-right: 6px;
                }
                .text {
                    vertical-align: text-top;
                }
            }
        }
        .ji_du {
            flex: 1;
            height: 293px;
            background: #ffffff;
            box-shadow: 0px 2px 4px 0px rgba(51, 51, 51, 0.1);
            position: relative;
            padding: 58px 40px 20px 40px;
            .tit {
                position: absolute;
                top: 20px;
                left: 0;
                padding-left: 25px;
                border-left: 3px solid $light-color;
                height: 30px;
                font-size: 16px;
                font-weight: 400;
                color: #333333;
                line-height: 30px;
            }
            .legend-box {
                position: absolute;
                bottom: 10px;
                left: 218px;
                font-size: 12px;
                .c_g {
                    margin-right: 60px;
                }
                .su {
                    color: $light-color;
                    padding-right: 6px;
                }
                .unsu {
                    color: #333333;
                    padding-right: 6px;
                }
                .text {
                    vertical-align: text-top;
                }
            }
        }
    }
}
</style>
