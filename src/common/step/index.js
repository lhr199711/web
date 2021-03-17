/*
* 地址选择器
* @props包括两个参数，value {number/string} 地区code, width {number} 组件宽度
* @emit getFullData事件，获取选中地区的详细信息
* @example: <address-selector v-model="addressCode" width="220" @getFullData="getAddressData"/>
*/

// 异步加载组件
// const Step = () => import('./src/main')
import Step from './src/main'
export default Step
