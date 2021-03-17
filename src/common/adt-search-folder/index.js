/* 折叠搜索框
* @params: isFoldBtnShow, {Boolean}, 是否有折叠选项， 默认有
* @params: searchRouter, {Object}, 路由对象
* @params: title, {Object}, 标题
* @params: needCompatityStyle, {Boolean}, 是否兼容查询条件文字和输入框分行
* @example:
    <adt-search-folder @clear="clear" :searchRouter="{path: '/', query: query}">
        <template slot="always-show">
            两个始终展示的查询条件
        </template>
        <template slot="table-btn-group">
            列表的相关操作，如新增，修改等
        </template>
    </adt-search-folder>
*/
// const AdtSearchFolder = () => import('./src/main')
import AdtSearchFolder from './src/main'
export default AdtSearchFolder
