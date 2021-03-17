/*
* 模态框
* @props包括四个参数，width{string} 宽度，showModal {boolean} 是否显示modal, title {string} 标题，ok-text {string}确定按钮文字, cancel-text{string}取消按钮文字
* @emit visibleChange事件，模态框显示隐藏状态发生改变 onOk点击确定按钮发生事件  okCancel点击取消按钮发生事件
* @example: <adt-my-modal :title="title" :okText="okText" :cancelText="cancelText" :showModal="showModal" @on-visible-change="visibleChange" @on-ok="handleConfirm" @on-cancel="handleCancel"></adt-my-modal>
*/

// const AdtMyModal = () => import('./src/main')
import AdtMyModal from './src/main'

export default AdtMyModal
