<template>
  <input v-show="false" ref="inputFile" type="file" @change="inputChange" />
</template>

<script>
  import { upload } from '@/api/upload';

  export default {
    name: 'Upload',
    methods: {
      uploadStart() {
        this.$refs.inputFile.click();
      },
      inputChange(event) {
        const input = event.target;
        const files = event.target.files;
        if (files && files[0]) {
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
