import test from '@/pages/test/language'
import readLanguage from './readLanguage'
// iview国际化
import zh from 'view-design/dist/locale/zh-CN'

export default {
    ...{
        rules: {
            telephoneRule: '请输入正确的电话号码',
            phoneRule: '请输入正确的手机号码',
            emailRule: '请输入正确的邮箱号',
            chineseRule: '请输入中文',
            englishRule: '请输入英文字母',
            numberRule: '请输入数字',
            positiveIntegerRule: '请输入正整数',
            englishNumberRule: '请输入英文或者数字',
            decimalRule: '请保留两位有效数字',
            selectRule: '请选择',
            enterRule: '请输入',
            tickRule: '请勾选',
            mostTickRule: '最多勾选',
            idCardRule: '请输入正确的身份证号码'
        },
        common: {
            logout: '注销',
            noData: '暂无数据',
            addBtn: '新增',
            operate: '操作',
            valid: '有效',
            invalid: '无效',
            view: '查看',
            detail: '详情',
            edit: '编辑',
            status: '状态',
            detailBtn: '详细描述',
            searchBtn: '查询',
            reset: '重置',
            save: '保存',
            del: '删除',
            deleteConfirm: '确认删除',
            cancel: '取消',
            ok: '确定',
            modalTile: '请填写',
            cannotEmpty: '信息不能为空',
            cannotUse: '信息无效',
            systemHint: '系统提示',
            saveFailed: '保存失败 ...',
            saveSuccess: '保存成功',
            serail: '序号',
            choose: '选择',
            moreThanOne: '至少选择一项',
            tooLength: '长度过长',
            mustNum: '不能为空或字符串',
            checkForm: '请检查信息是否完整且有效',
            tipsImageFormat: '请上传文件后缀名为.jpeg,.jpg,.png的图片文件',
            tipsImageSize: '文件大小不能超过2M',
            yes: '是',
            no: '否',
            more: '更多'
        },
        test: readLanguage(test, 0)
    },
    ...zh
}
