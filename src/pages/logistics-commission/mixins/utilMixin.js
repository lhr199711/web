import moment from 'moment'
const toString = Object.prototype.toString
export default {
    data () {
        return {}
    },
    watch: {},
    methods: {
        // 是否一个空数组
        isArrVal_m (val) {
            return toString.call(val) === '[object Array]' && val.length !== 0
        },
        // 是否一个字符串
        isStr_m (val) {
            return toString.call(val) === '[object String]'
        },
        // 处理时间取值头尾
        datetimerange_m (timeArr, startTime, endTime) {
            if (this.isArrVal_m(timeArr)) {
                const obj = {}
                obj[startTime] = moment(timeArr[0]).valueOf()
                obj[endTime] = moment(timeArr[1]).valueOf()
                return obj
            }
            return {}
        },
        // 处理时间年月点
        momentd_Y_M_m (time) {
            if (!time) {
                return '后端无数据'
            }
            return moment(time).format('YYYY.MM')
        },
        // 处理时间年月斜线
        moment_xie_Y_M_m (time) {
            if (!time) {
                return '后端无数据'
            }
            return moment(time).format('YYYY/MM')
        },
        // 处理时间年月日斜线
        moment_xie_Y_M_D_m (time) {
            if (!time) {
                return '后端无数据'
            }
            return moment(time).format('YYYY/MM/DD')
        },
        // 处理时间年月日斜线
        moment_xie_m (time) {
            if (!time) {
                return '后端无数据'
            }
            return moment(time).format('YYYY/MM/DD hh:mm')
        }
    }
}
