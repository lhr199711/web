/*  图片上传组件（支持单张或多张上传，由参数single控制）
* @params: v-model绑定图片数组，格式如下：[{url: 'xxx'}, {url: 'xx'}]
* @params: url: 上传图片的地址
* @example: <image-uploader v-model="imgUrls" url="//test.com"/>
*/
// const imageUploader = () => import('./src/main')
import imageUploader from './src/main'
export default imageUploader
