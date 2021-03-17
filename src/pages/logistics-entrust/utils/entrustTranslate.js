/**
 * @param {Object} origin: 需要深拷贝的数据
 * @description 使用循环+递归实现深拷贝
 * @return {Object}
 */
// 回参 转换 res 为 req
export const deepRes = origin => {
    // 基本类型(Boolean Number String Undefined Null Function Symbol) 直接返回
    if (typeof (origin) !== 'object' || origin === null) {
        return origin
    }
    // 复杂类型(Array Object)
    var type = origin.constructor.name
    var target = type === 'Array' ? [] : {}
    for (var key in origin) {
        if (type === 'Array' && !isNaN(Number(key))) { // 去除原型链上的属性 和数组自身属性
            target.push(deepRes(origin[key]))
        }
        if (type === 'Object') { // 去除原型链上的属性
            if (key === 'entrustPackagingListRes') { // 转换 res为req 界面使用
                // eslint-disable-next-line
                target['entrustPackagingListReq'] = deepRes(origin[key])
            } else {
                target[key] = deepRes(origin[key])
            }
        }
    }
    return target
}
// 处理货物信息 入参 type  默认新增 1 修改 2
export const dealCargo = (origin, type = 1) => {
    if (origin.constructor.name !== 'Array') return
    const target = {
        arr: []
    }
    origin.forEach(ele => {
        const cargoitem = {
            cargoType: ele.cargoType || 'G', // 货物类型 G 普通 C 恒温 D 危险
            cargoName: ele.cargoName || '', // 货物名称
            cargoQty: Number(ele.cargoQty) || 0, // 货物件数
            cargoVol: Number(ele.cargoVol) || 0, // 货物体积
            grossWeight: Number(ele.grossWeight) || 0, // 毛重
            weightUnit: 'kg', // no 重量单位 固定写死 kg value KG
            volUnit: 'm³', // no 体积单位 固定写死 M3 value m³
            hsCode: ele.hsCode || '', // HS编码
            markNo: ele.markNo || '', // 唛头
            netWeight: Number(ele.netWeight) || 0, // 净重
            suitableTemperature: ele.suitableTemperature || '', // 货物适宜温度
            assignTemperature: ele.assignTemperature || '', // 指定温度
            entrustPackagingListReq: [
                {
                    grossWeight: Number(ele.firstGrossWeight) || 0, // 包装毛重
                    netWeight: Number(ele.firstNetWeight) || 0, // 包装净重
                    packQty: Number(ele.firstPackQty) || 0, // 包装件数
                    packPcode: '0', // 一级包装编码 写死
                    packType: ele.firstPackageType || 'BG', // 包装类型 BD 板 CH 箱, 柜 CS 箱 PK 包 BG 袋
                    packVol: Number(ele.firstPackVol) || 0 // 包装体积
                },
                {
                    grossWeight: Number(ele.secondGrossWeight) || 0,
                    netWeight: Number(ele.secondNetWeight) || 0,
                    packQty: Number(ele.secondPackQty) || 0,
                    packPcode: '1', // 二级包装编码 写死
                    packType: ele.secondPackageType || 'BG', // 包装类型 BD 板 CH 箱, 柜 CS 箱 PK 包 BG 袋
                    packVol: Number(ele.secondPackVol) || 0
                }
            ]
        }
        target.arr.push(cargoitem)
    })
    return target
}
// 默认 路线编码 一致的不会变
const defaultRoute = String(Math.random() * 10000)
// 处理路线信息 入参 type  默认新增 1 修改 2
export const dealRoute = (origin, type = 1) => {
    if (origin.constructor.name !== 'Array') return
    const target = {
        arr: [],
        lastStartPort: '', // 第一段启运地点 port key
        departurePortName: '', // 第一段启运地点 port name
        lastArrivePort: '', // 最后一段运抵地点 port key
        destinationPortName: '' // 最后一段运抵地点 port name
    }
    origin.forEach((item, idx) => {
        const conItem = {
            roadCode: item.roadCode || String(Math.random() * 10000), // 包装信息 节点 路段编码 no have roadCode
            routeCode: item.routeCode || defaultRoute, // 包装信息 路线编码 区间 no have routeCode
            departurePort: item.departurePort || '', // 启运地 key
            destinationPort: item.destinationPort || '', // 目的地 key
            departurePortTranslate: item.departurePortTranslate || '', // 启运地 value
            destinationPortTranslate: item.destinationPortTranslate || '', // 目的地 value
            logisticsType: item.logisticsType || 'N', // 物流类型 I 国际 N 国内 B 保税
            trspMode: item.trspMode || 'AIRLIFT' // 运输方式 TRANSPORT_MODE // 轮 水 WATERWAY 空 AIRLIFT 公 PUBROAD 铁 RAILWAY
        }
        // 获取第一个 路段
        if (idx === 0) {
            target.lastStartPort = conItem.departurePort
            target.departurePortName = conItem.departurePortTranslate
        }
        // 获取最后一个 路段
        if (idx === (origin.length - 1)) {
            target.lastArrivePort = conItem.destinationPort
            target.destinationPortName = conItem.destinationPortTranslate
        }
        target.arr.push(conItem)
    })
    return target
}
// 处理集装箱信息 入参 type  默认新增 1 修改 2
export const dealContainer = (origin, type = 1) => {
    if (origin.constructor.name !== 'Array') return
    const target = {
        arr: [],
        lastStartLoad: '', // 第一个路段 节点编号
        lastArriveLoad: '', // 最后一个路段 节点编号
        routeCode: ''// 路线编码
    }
    origin.forEach((item, idx) => {
        const conItem = {
            roadCode: item.roadCode || String(Math.random() * 10000), // 包装信息 节点 路段编码 no have roadCode
            routeCode: item.routeCode || defaultRoute, // 包装信息 路线编码 区间 no have routeCode
            trspType: item.transportType || 'C', // 运输类型  C 集装箱 B 件杂货
            contaSize: item.contaSize || '20GP', // 集装箱尺寸 20GP 40GP 45GP 20RF 40RF
            suitcaseQty: Number(item.suitcaseQty) || 1, // 箱量 默认 1
            containerSource: item.containerSource || 'R', // 来源 R 租箱 P 自备箱
            suitcaseType: item.suitcaseType || 'Y' // 提箱类型 Y 场装 P 提装
        }
        // 获取第一个 路段
        if (idx === 0) {
            target.lastStartLoad = conItem.roadCode
            target.routeCode = conItem.routeCode
        }
        // 获取最后一个 路段
        if (idx === (origin.length - 1)) {
            target.lastArriveLoad = conItem.roadCode
        }
        target.arr.push(conItem)
    })
    return target
}
