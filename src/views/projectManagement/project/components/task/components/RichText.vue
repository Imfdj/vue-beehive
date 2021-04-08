<template>
  <div class="rich-text">
    <div id="editor"></div>
  </div>
</template>

<script>
  import wangEditor from 'wangeditor';
  import { upload } from '@/api/upload';

  export default {
    name: 'RichText',
    props: {
      value: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        editor: null,
        editorData: '',
      };
    },
    created() {
      this.editorData = this.value;
    },
    mounted() {
      const editor = new wangEditor('#editor');

      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = newHtml => {
        this.editorData = newHtml;
      };
      // 设置编辑区域高度为 500px
      editor.config.height = 'auto';
      // 配置菜单栏，删减菜单，调整顺序
      editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'italic', // 斜体
        'justify', // 居中
        'image', // 图片
        'link', // 链接
        'list', // 无序列表
        'quote', // 引用
        'table', // 表格
        '|',
        'fullscreen', // 全屏
      ];

      // 配置 server 接口地址
      editor.config.uploadImgServer = '/api/v1/uploads';

      editor.config.customUploadImg = async function (resultFiles, insertImgFn) {
        console.log(resultFiles);
        const formData = new FormData();
        formData.append('file', resultFiles[0], 'data.jpg');
        const {
          data: { path },
        } = await upload(formData);
        console.log(path);
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法

        // 上传图片，返回结果，将图片插入到编辑器中
        insertImgFn(path);
      };

      // 创建编辑器
      editor.create();

      this.editor = editor;
      this.setHtml(this.editorData);
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy();
      this.editor = null;
    },
    methods: {
      save() {
        this.$emit('changeValue', this.editorData.trim());
      },
      setHtml(text) {
        this.editor.txt.html(text);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .rich-text {
    overflow-wrap: break-word;

    ::v-deep .w-e-text-container {
      min-height: 300px;
    }
  }
</style>
