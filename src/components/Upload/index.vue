<template>
  <input v-show="false" ref="inputFile" type="file" @change="inputChange" />
</template>

<script>
  import { upload } from '@/api/upload';

  export default {
    name: 'Upload',
    props: {
      maxSize: {
        type: Number,
        default: 20,
        required: false,
      },
    },
    methods: {
      uploadStart() {
        this.$refs.inputFile.click();
      },
      inputChange(event) {
        const input = event.target;
        const files = event.target.files;
        if (files && files[0]) {
          if (files[0].size > this.maxSize * 1024 * 1024) {
            this.$baseNotify(`文件的容量不得超过${this.maxSize}Mb`, '上传失败', 'error');
            return;
          }
          this.upload(files[0]);
        }
        input.value = '';
      },
      async upload(blob) {
        const formData = new FormData();
        formData.append('file', blob);
        const { data } = await upload(formData);
        this.$emit('success', data);
      },
    },
  };
</script>
