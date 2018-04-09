<style scoped>
</style>
<template>
    <div>
        <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="edit"></Icon>
                写信
            </BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
          <Wangeditor v-model="content" ref="editor" @load="uploadImgSuccess" @change="contentChange" :id="editor.id" :menus="editor.menus" :mapKey="editor.mapKey" :uploadImgUrl="editor.uploadImgUrl" :width="editor.width"></Wangeditor>
         </Content>
    </div>
</template>
<script>

  import Wangeditor from 'vue-wangeditor';
  export default{
     components: {
       Wangeditor
     },
     data(){
         return {
             content:'',
             editor: {
               id:'editor',
               width: '100%',
               uploadImgUrl: '/home/api/annex/upload',
               mapKey:'lZTlo8NYjPT8scz0DATj2sGC7eK86VAH',
               menus: [
                 //'source',	// 源码模式
                 //'|',
                 'bold',	// 粗体
                 'underline',	// 下划线
                 'italic',	// 斜体
                 'strikethrough',	// 中线
                 'eraser',	// 清空格式
                 'forecolor',	// 文字颜色
                 'bgcolor',	// 背景颜色
                 '|',
                 'quote',	// 引用
                 'fontfamily',	// 字体
                 'fontsize',	// 字号
                 'head',	// 标题
                 'unorderlist',	// 无序列表
                 'orderlist',	// 有序列表
                 'alignleft',	// 左对齐
                 'aligncenter',	// 居中
                 'alignright',	// 右对齐
                 '|',
                 'link',	// 链接
                 'unlink',	// 取消链接
                 'table',	// 表格
                 'emotion',	// 表情
                 '|',
                 'img',	// 图片
                 'video',	// 视频
                 //'location',	// 位置
                 'insertcode',	// 插入代码
                 '|',
                'undo',	// 撤销
                'redo',	// 重做
                'fullscreen'	// 全屏
              ]
             }
         }
     },
     methods:{
       uploadImgSuccess(originalName, resultTxt) {
         let result = eval('('+resultTxt+')');
         if(result.success) {
           this.$refs['editor'].insertImg('/home/api/annex/download/' + result.data.path)
         }
       },
       contentChange() {
         this.content = this.$refs['editor'].getHtml();
       }
     }
 }
</script>
