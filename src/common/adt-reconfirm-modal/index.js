/*
* 二次确认模态框
* @props包括两个参数，showModal {boolean} 是否显示modal, message {number} 提示信息
* @emit visibleChange事件，模态框显示隐藏状态发生改变
* @example: <adt-reconfirm-modal :showModal="showModal" @on-visible-change="visibleChange"></adt-reconfirm-modal>
*/

// import AdtReconfirmModal from './src/main'

// 异步组件
// 1、将异步组件和 webpack 的 code-splitting 功能一起配合使用
// const AdtReconfirmModal = resolve => { require(['./src/main'], resolve) }
// 2、在工厂函数中返回一个 Promise，所以把 webpack2 和 ES2015 语法加在一起
// const AdtReconfirmModal = () => import('./src/main')
import AdtReconfirmModal from './src/main'

export default AdtReconfirmModal
