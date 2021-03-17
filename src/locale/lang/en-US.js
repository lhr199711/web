import test from '@/pages/test/language'
import readLanguage from './readLanguage'
// iview国际化
import en from 'view-design/dist/locale/en-US'

export default {
    ...{
        rules: {
            telephoneRule: 'Please enter the correct telephone number',
            phoneRule: 'Please enter the correct phone number',
            emailRule: 'Please enter the correct email number',
            chineseRule: 'Please enter Chinese',
            englishRule: 'Please enter the English alphabet',
            numberRule: 'Please enter the number',
            positiveIntegerRule: 'Please enter a positive integer',
            englishNumberRule: 'Please enter English or numbers',
            decimalRule: 'Please keep two valid digits',
            selectRule: 'please select',
            enterRule: 'please enter',
            tickRule: 'Please tick',
            mostTickRule: 'Check at most',
            idCardRule: 'Please enter a valid ID number'
        },
        common: {
            logout: 'Logout',
            noData: 'No Data...',
            addBtn: 'Add',
            operate: 'Operate',
            valid: 'valid',
            invalid: 'invalid',
            view: 'view',
            detail: 'detail',
            edit: 'edit',
            status: 'status',
            detailBtn: 'detail',
            searchBtn: 'search',
            reset: 'reset',
            save: 'save',
            del: 'delete',
            deleteConfirm: 'delete confirm',
            cancel: 'cancel',
            ok: 'OK',
            modalTile: 'Please fill in',
            cannotEmpty: 'item cannot be empty',
            cannotUse: 'item cannot be useless',
            systemHint: 'system hint',
            saveFailed: 'save Failed ...',
            saveSuccess: 'save Success',
            serail: 'serail',
            choose: 'choose',
            moreThanOne: 'at last one',
            tooLength: 'characters have exceeded the limit',
            mustNum: 'Cannot be empty or strings',
            tipsImage:
                'Please upload image files with the suffixes of. jpeg,. jpg,. png',
            tipsImageSize: 'File size should not exceed 2M',
            checkForm: 'please check info',
            yes: 'yes',
            no: 'no',
            more: 'more',
            length: 'length',
            width: 'width',
            height: 'height',
            weight: 'weight'
        },
        test: readLanguage(test, 1)
    },
    ...en
}
