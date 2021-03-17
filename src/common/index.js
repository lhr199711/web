import Paginator from './adt-paginator'
import ImageUploader from './image-uploader'
import AddressSelector from './address-selector'
import SearchFolder from './adt-search-folder'
import PhoneInput from './phone-input'
import TimeInput from './time-input'
import AdtReconfirmModal from './adt-reconfirm-modal'
import ManayImageUploader from './manay-image-uploader'
import Step from './step'
import AdtMyModal from './adt-my-modal'
import AdtButton from './adt-button'
import AdtbtnGroup from './adt-tabBtns'
import AdttabsGroup from './adt-tabs'
import AdtSvgIcon from './adt-svg-icon'
import AdtCitySelector from './adt-city-selector'
import AdtProgressTab from './adt-progress-tab'

const components = [
    Paginator,
    ImageUploader,
    AddressSelector,
    SearchFolder,
    PhoneInput,
    TimeInput,
    AdtReconfirmModal,
    ManayImageUploader,
    Step,
    AdtMyModal,
    AdtButton,
    AdtbtnGroup,
    AdttabsGroup,
    AdtSvgIcon,
    AdtCitySelector,
    AdtProgressTab
]

const install = (Vue) => {
    if (install.installed) return
    components.map(component => {
        Vue.component(component.name, component)
    })
}

// Vue 是全局变量时，自动 install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install
}
