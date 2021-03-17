<template>
    <div ref="map" id="map" class="map-color"></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/extension/bmap/bmap'
import  { apiQueryRoute } from '@/api/home/mapHome'
// import data from '../../../../../../adt_web/src/common/phone-input/src/data'
export default {
    name: 'channel-map',
    data () {
        return {
            corridorData: [], // 通道数据
            maxLongitude: 0, // 最大经度
            minLongitude: Infinity, // 最小经度
            maxLatitude: 0, // 最大纬度
            minLatitude: Infinity, // 最小纬度
            map: '', // 地图实例
            geoCoordMap: [] // 所有坐标集合
        }
    },
    mounted () {
        this.$nextTick(() => {
            new Promise(function (resolve, reject) {
                let script = document.createElement('script')
                script.type = 'text/javascript'
                script.src = `https://api.map.baidu.com/api?v=2.0&callback=init`
                document.head.appendChild(script)
                // 只会加载一次
                // window.onload = function () {
                    //     resolve(BMap)
                // }
                setTimeout(function() {
                    resolve(BMap)
                }, 800)
            }).then(BMap => {
                this.map = new BMap.Map("map")
                this.initMap()
                window.addEventListener('resize', () => {
                    // 其他页面为null，会一直报错
                    if ((document.getElementById('map')) && echarts.init(document.getElementById('map'))) {
                        echarts.init(document.getElementById('map')).resize()
                    }
                })
            })
      })
    },
    methods: {
        initMap () {
            let vm = this

            // 不需要后台传过来的数据

            let dom = document.getElementById('map')
            let myChart = echarts.init(dom)

            /*
            数组的一个元素代表一个通道，需要前端对数据进行处理（formateData方法）
            */
            // vm.corridorData = [
            //     {
            //         dictionaryAddrCoordinates: [
            //             {
            //                 departurePort: "P001",
            //                 destinationAddr: ['106.653702, -6.127528', '108.190932, 22.613702'],
            //                 departurePortTranslate: "重庆",
            //                 destinationPort: "P003",
            //                 destinationPortTranslate: "成都",
            //                 trspMode: "1",
            //                 trspModeTranslate: "水运",
            //             }
            //         ],
            //         routeCode: "RT00001",
            //         trspMode: "1",
            //         trspModeTranslate: "水运",
            //     },
            //     {
            //         dictionaryAddrCoordinates: [
            //             {
            //                 departurePort: "P002",
            //                 destinationAddr: ['108.190932, 22.613702', '106.645226, 29.723155'],
            //                 departurePortTranslate: "成都",
            //                 destinationPort: "P004",
            //                 destinationPortTranslate: "上海",
            //                 trspMode: "1",
            //                 trspModeTranslate: "水运",
            //             }
            //         ],
            //         routeCode: "RT00002",
            //         trspMode: "1",
            //         trspModeTranslate: "陆运",
            //     },
            //     {
            //         dictionaryAddrCoordinates: [
            //             {
            //                 departurePort: "P002",
            //                 // destinationAddr: [ '106.645226, 29.723155', '118.190932, 20.813002'],
            //                 destinationAddr: [],
            //                 departurePortTranslate: "成都",
            //                 destinationPort: "P004",
            //                 destinationPortTranslate: "上海",
            //                 trspMode: "1",
            //                 trspModeTranslate: "水运",
            //             }
            //         ],
            //         routeCode: "RT00002",
            //         trspMode: "1",
            //         trspModeTranslate: "陆运",
            //     }
            // ]
            let transportIcon = [
                // '海陆ICON'
                'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAByFBMVEX////qWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyToXifpXCbqWyTqWyTkZTHlYy7qWyTqWyTccEDdbj7qWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTiZzPqWyTqWyTjZjPnXynqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTpXSfoXijqWyTkYy/iZzTqWyTqWyTqWyTqWyTqWyTqWyTqWyTebTzhaDXqWyTqWyTlYi3nYCrqWyTqWyTqXCXqWyTqXCXqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTqWyTJjWbQgli6pIV+/fyA+/rBmXepvKZ9//+vtJub0sOezb2P49qR4dfSgFWG8ezqWySA+vh9/v6G8u7Cl3W+nn1//PuD9fKF8/DPhFrNhl6N59/ac0SN596Y1sma1MWmwa28oIHBmXbLimPKi2S5pIaruqKov6mc0MCQ4tiM6OHZdUbUfFGH8OrMiGB//PzFkm6B+feE9PDTfVKI7umS39SX2MugyrmkxLCxsZe9n37DlnP///+glqekAAAAXHRSTlMABZqFARG8rAsj18wcPOvlNVz49lZ9/v5/o/CrsocDivP6ZGL57kM93CgEl5bUwxQPubu2lAch2CWBOOntVPb6aHmRnLiuAv77ZVH08EYw4+neKxnJ4cYWCaeJCPzF30QAAAABYktHRACIBR1IAAAAB3RJTUUH4wwDATQSwhBp6wAAAUZJREFUOMtjYCANMDIxs+CTZ2WLiWXnwC3PyRUXn5DIzYNLnpcvKRkIUvgFsMsLCqUmg0GasAgWaRZRsfRkKMgQl8B0qmRmVjIcZGVKYijIzgFL5UJU5ElhKgBLJOQXFILoIhwKikukZUqLcSsoK5dlkZMvr8CqQKEwuVJRCcRSVqnCpkCqqFpVDcJU50vCpqBGQ5OBQUtbRwsY5Lq1WBTo6TMwGBjW1RuxAmljTAUmpgwMZro18fEN5hYMDHKW2CLDyroR5NcmGzXskWVr1wwJxkp7B2zyjuItsKhobXOSw5B3bu9ARFZRpwumL6CRCYmtrmwsAQWSKEzs7gGrwKGgt9RVsq8ft4LWNnk3Bkf3CbgUTPTwBLG8vCdhVzDZxxfC9POfkoupIGBqYBCMHRwyDVNBaFg4ghMRiakgKhqZxyLBQDUAANfQcWC/fa2sAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTEyLTAyVDE3OjUyOjE4KzA4OjAw7U74nAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0xMi0wMlQxNzo1MjoxOCswODowMJwTQCAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC',
                // '航空ICON'
                'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABblBMVEX///8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8D/fwA//8A//8A//8A//8A//8A//8C/v0A//8A//8A//8A//8A//8A//8A//8G+/oA//8A//8A//8A//8A//8A//8A//8A//8A//8E/PwA//8A//8A//8A//8A//8A//8A//8A//8A//8A//8A//8M9/QW8OpFz78/08R1rZFptp2mi2SSmXbXaTa7fFDqWyQd6uTiYSxNybcl5d2ApohQx7SvhFt5qo7fYy6ijWcn5NvMcEBYwa3pXCWIoIA02s65fVJevafkXymHoIEx3dGwhFphu6TZZzMZ7ujDdkhC0cHoXCYL9/VrtJs71siVl3RqtJu+ek2ckm3kYCrNcD8T8e1Ez791rZKXlXHaZjPLcUHKckK3f1Ssh17////Z9r2uAAAAQHRSTlMAGBpFUHKEn7rM7gED9iUnWlSPgcWu9QTbMAv9ZDaaY8+Q+wq9OupvpNr+EXr4KuVXsd4N/jlmk8DE7fDd2bunWQe6cwAAAAFiS0dEAIgFHUgAAAAHdElNRQfjDAMBNhAeKGpFAAABFUlEQVQ4y83TWUMBYRSA4WFCoyyFpA1tUtp3CS3SnBaytKAoWlVKSj+/MSaX3zmX3uvn9uW4dkqlJkK+gwg1WiLUdRKhoO8iuW5D2EiCpp1dMwn27O33kqAlcmAlQVv0sM9Ogf0iHDkIbmDwGE6GCHD4FCA2QoDOOMCZiwDdCYDk6BgOx1MAkJ7A4eS5BC88qFOFLyV4NYVCPiM5yHpRqMk14PX0DAZ1Nw0IeR6DQkGGtz7E2WfvZBi1IXCuKDsozSNw4b4JHx6RubVPTQjPyNyLLwosI3MvvSrwjT338sq7AivsuVfT8N8Hc+61eAt+mllwPdGCVebcG1+1WuX7RxTrv9VNFvRv6f2BwLYgWIPBENcu/QHE/z/xbm8QPQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMi0wMlQxNzo1NDoxNiswODowMLBv84YAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTItMDJUMTc6NTQ6MTYrMDg6MDDBMks6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg=='
            ]

            let color = ['#ff7e00', '#66deed']

            // function getColor(index) {
            //     return `rgba(244, 34, 43, ${index * 0.3})`
            // }

            // 获取通道信息
            let promise = new Promise((resolve, reject) => {
                apiQueryRoute().then(({ data }) => {
                    vm.corridorData = data
                    resolve()
                })
            })
            // promise.then(() => {

            // })
            async function generateMap() {
                await promise
                drawCorridor()
            }
            generateMap()

            // 绘制路线
            function drawCorridor () {
                let series = []
                // 处理数据
                let formData = []
                for (let index in vm.corridorData) {
                    for (let val of vm.corridorData[index].dictionaryAddrCoordinates) {
                        if (Boolean(val.destinationAddr) ? val.destinationAddr.length === 2 : false) {
                        // if (val.destinationAddr.length === 2) {
                            formData.push(
                                [
                                    {
                                        coords: [
                                            {
                                                coord: val.destinationAddr[0].split(',')
                                            },
                                            {
                                                coord: val.destinationAddr[1].split(',')
                                            }
                                        ],
                                        transportWay: val.trspModeTranslate
                                    }
                                ]
                            )
                        }
                    }
                }
                // console.log(formData)
                // return
                let passData = JSON.parse(JSON.stringify(formData))
                formateData(passData).forEach(function(item) {
                // formateData(vm.corridorData).forEach(function(item) {
                    configSeries(item)
                    // 将一整个通道的所有分站点拆分成独立的路线，可以给每一段运输过程单独配置样式，看具体需求
                    // item.forEach((con) => {
                    //     let arr = []
                    //     arr.push(con)
                    //     configSeries(arr)
                    // })
                })
                function formateData(data) {
                    let firstData = []
                    for (let index in data) {
                        // for (let val of data[index].rows) {
                        for (let val of data[index]) {
                            // let secondData = []
                            let len = val.coords.length
                            // meta: true, 显示该点
                            for (let i = 1; i <= len; i++) {
                                // 找出最大和最小经纬度
                                let tude = val.coords[i-1].coord
                                tude[0] = Number(tude[0])
                                tude[1] = Number(tude[1])
                                if (tude[0] > vm.maxLongitude) {
                                    vm.maxLongitude = tude[0];
                                } else if (tude[0] < vm.minLongitude) {
                                    vm.minLongitude = tude[0]
                                }
                                if (tude[1] > vm.maxLatitude) {
                                    vm.maxLatitude = tude[1];
                                } else if (tude[1] < vm.minLatitude) {
                                    vm.minLatitude = tude[1]
                                }
                                vm.geoCoordMap.push({lng: tude[0], lat: tude[1]})
                                // 最后一个只是用来找出最大和最小经纬度
                                if (i === len) continue

                                if (i === 1) {
                                    val.coords[0].meta = true
                                }
                                if (i === len - 1) {
                                    val.coords[i].meta = true
                                }
                                /* // 中间点显示箭头
                                if (i === ~~(len / 2)) {
                                    val.coords[i].showIcon = true
                                }
                                // 只有两个点，一定显示箭头
                                if (len === 2) {
                                    val.coords[0].showIcon = true
                                } */
                                val.coords[i-1].transportWay = val.coords[i].transportWay = val.transportWay
                                val.coords[i-1].index = val.coords[i].index = index
                                // secondData.push([[val.coords[i-1], val.coords[i]]])
                                // 将一整个通道的所有分站点拆分成独立的路线，可以给每一段运输过程单独配置样式，看具体需求
                                firstData.push([[val.coords[i-1], val.coords[i]]])
                            }
                            // firstData.push(secondData)
                        }
                    }
                    // console.log(firstData)
                    return firstData
                }

                // 绘制线路的数据处理
                function convertData(data) {
                    // console.log(data)
                    let res = [];
                    for (let i = 0; i < data.length; i++) {
                        let dataItem = data[i];
                        for (let j = 0; j < dataItem.length - 1; j++) {
                            let fromCoord = dataItem[j].coord;
                            let toCoord = dataItem[j+1].coord;
                            if (fromCoord && toCoord) {
                                res.push({
                                    coords: [fromCoord, toCoord]
                                });
                            }
                        }
                    }
                    // for (let i = 0; i < data.coords.length - 1; i++) {
                    //     let fromCoord = data.coords[i].coord;
                    //     let toCoord = data.coords[i+1].coord;
                    //     if (fromCoord && toCoord) {
                    //         res.push({
                    //             coords: [fromCoord, toCoord]
                    //         });
                    //     }
                    // }
                    return res;
                }

                // series配置
                function configSeries(item, routeData) {
                    // 获取当前是第几个通道，每个通道对应不同的颜色
                    let index = item[0][0].index
                    // 获取运输方式
                    let type = item[0][0].transportWay
                    type = (type === vm.$getDictionary('TRANSPORT_MODE')[0].dictionaryValue ? 1 : 0)
                    // type = 1
                    series.push(
                        // 起始点
                        {
                            type: 'effectScatter',
                            coordinateSystem: 'bmap',
                            zlevel: 2,
                            show: true,
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            // label: {
                            //     normal: {
                            //         show: true,
                            //         position: 'right',
                            //         formatter: item[0][index].label
                            //         // formatter: '{b}'
                            //     }
                            // },
                            symbolSize: 10,
                            showEffectOn: 'render',
                            itemStyle: {
                                normal: {
                                    color: color[1]
                                    // color: color[type]
                                    // color: color[index],
                                    // color: getColor()
                                }
                            },
                            data: item.map(function(dataItem) {
                                let value = dataItem[0].meta ? dataItem[0].coord : ''
                                return {
                                    value
                                };
                            })

                        },
                        // 路线
                        {
                            type: 'lines',
                            coordinateSystem: 'bmap',
                            zlevel: 2,
                            effect: {
                                // show: item[0][0].showIcon,
                                show: true,
                                period: 6,
                                trailLength: 0,
                                symbol: transportIcon[type],
                                // symbol: 'triangle',
                                symbolSize: 24,
                            },
                            lineStyle: {
                                normal: {
                                    color: color[type],
                                    // color: color[index],
                                    // color: getColor(),
                                    width: 2,
                                    opacity: 0.8,
                                    curveness: 0.1, // 线路曲度
                                    type: type === 1 ? 'solid' : 'dotted'
                                }
                            },
                            data: convertData(item)
                        },
                        // 到达点
                        {
                            type: 'effectScatter',
                            coordinateSystem: 'bmap',
                            zlevel: 2,
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            // label: {
                            //     normal: {
                            //         show: true,
                            //         position: 'left',
                            //         formatter: routeData[0][index].coords[1].label
                            //         // formatter: '{b}'
                            //     }
                            // },
                            symbolSize: 10,
                            showEffectOn: 'render',
                            itemStyle: {
                                normal: {
                                    color: color[1]
                                    // color: color[type]
                                    // color: color[index],
                                    // color: getColor()
                                }
                            },
                            data: item.map(function(dataItem) {
                                    // let value = dataItem[dataItem.length - 1].coord
                                    let value = dataItem[dataItem.length - 1].meta ? dataItem[dataItem.length - 1].coord : ''
                                    return {
                                        value
                                    };
                            })
                            // data: [{
                            //     value: item.coords[item.coords.length - 1].coord
                            // }]
                        }
                    )
                }

                // 获取中心点
                function getCenterPoint() {
                    // let [maxLongitude, minLongitude, maxLatitude, minLatitude] = [0, Infinity, 0, Infinity];
                    // geoCoordMap.map(item => {
                    //     if (item[0] > maxLongitude) {
                    //         maxLongitude = item[0];
                    //     } else if (item[0] < minLongitude) {
                    //         minLongitude = item[0]
                    //     } if (item[1] > maxLatitude) {
                    //         maxLatitude = item[1];
                    //     } else if (item[1] < minLatitude) {
                    //         minLatitude = item[1]
                    //     }
                    // })
                    return [(vm.maxLongitude + vm.minLongitude) / 2, (vm.maxLatitude + vm.minLatitude) / 2]
                }

                // 通过百度api获取中心点和缩放等级
                // 中心点获取不对，用getCenterPoint方法获取
                // 缩放等级也不对，将算出来的缩放等级赋值给zoom
                let points = vm.geoCoordMap
                let view = vm.map.getViewport(eval(points))
                let mapZoom = view.zoom
                // let centerPoint = view.center
                // vm.map.centerAndZoom(centerPoint, mapZoom)

                // 地图自定义样式
                let bmap = {
                    center: getCenterPoint(),
                    zoom: mapZoom,
                    roam: true, // 可缩放
                    mapStyle: { // 地图样式配置
                        styleJson: [
                            {
                                "featureType": "water",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#00082D"
                                }
                            }, {
                                "featureType": "land",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#054A97"
                                }
                            }, {
                                "featureType": "boundary",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#2e79c5"
                                    // "color": "rgba(46, 121, 197)"
                                }
                            }, {
                                "featureType": "highway",
                                "elementType": "geometry",
                                "stylers": {
                                    "color": "#004981",
                                    "visibility": "off"
                                }
                            }, {
                                "featureType": "highway",
                                "elementType": "labels",
                                "stylers": {
                                    "visibility": "off"
                                }
                            }, {
                                "featureType": "arterial",
                                "elementType": "geometry",
                                "stylers": {
                                    "color": "#004981"
                                }
                            }, {
                                "featureType": "arterial",
                                "elementType": "geometry.fill",
                                "stylers": {
                                    "color": "#00508b"
                                }
                            }, {
                                "featureType": "poi",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            }, {
                                "featureType": "subway",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            }, {
                                "featureType": "manmade",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            }, {
                                "featureType": "local",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            }, {
                                "featureType": "arterial",
                                "elementType": "labels",
                                "stylers": {
                                    "visibility": "off"
                                }
                            }, {
                                "featureType": "building",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#1a5787"
                                }
                            }, {
                                "featureType": "label",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            }
                        ]
                    }
                }

                let option = {
                    bmap: bmap,
                    series: series
                }

                myChart.setOption(option)
            }
        }
    }
}
</script>

<style lang="scss">
    #map {
        position: absolute;
        top: 9vh;
        width: 100%;
        height: 90vh;
        .ec-extension-bmap {
            background-color: #054A97 !important;
        }
    }
    /* 隐藏百度地图logo和copyright */
    .BMap_cpyCtrl {
        display: none;
    }

    .anchorBL {
        display: none;
    }
    .map-color {
        background-color: #054A97 !important;
    }
</style>
