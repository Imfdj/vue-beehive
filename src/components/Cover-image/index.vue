<template>
  <div class="cover-image">
    <div class="upload-img">
      <div v-if="coverCopy" class="img-cover" @click="uploadCoverClick">
        <BImage :src="coverCopy" :width="290" :height="160"></BImage>
      </div>
      <div v-else class="btn-upload-img" @click="uploadCoverClick"><i class="el-icon-plus"></i>添加封面</div>
    </div>
    <cropper
      ref="Cropper"
      dialogWidth="800px"
      :autoCropWidth="290"
      :autoCropHeight="160"
      @realTime="realTime"
      @getCropBlob="getCropBlob"
    >
      <div class="cover-image-wrap-review-cropper">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </cropper>
  </div>
</template>

<script>
  import Cropper from '@/components/Cropper';
  import BImage from '@/components/B-image';
  import { upload } from '@/api/upload';

  export default {
    name: 'CoverImage',
    components: {
      Cropper,
      BImage,
    },
    props: {
      cover: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        previews: {},
        coverCopy: '',
      };
    },
    watch: {
      cover(newValue, oldValue) {
        this.coverCopy = newValue;
      },
    },
    methods: {
      uploadCoverClick() {
        this.$refs.Cropper.show();
      },
      realTime(data) {
        this.previews = data;
      },
      async getCropBlob(blob) {
        this.$refs.Cropper.hide();
        const formData = new FormData();
        formData.append('file', blob, 'data.jpg');
        const {
          data: { path },
        } = await upload(formData);
        // this.form.cover = `/remote_public${path}`;
        this.coverCopy = `/remote_public${path}`;
        this.$emit('uploaded', this.coverCopy);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cover-image {
    position: relative;
    width: 290px;
    height: 160px;
    .img-cover {
      position: relative;
      object-fit: contain;
      cursor: pointer;
    }
    .img-cover:after {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 160px;
      background-color: rgba(0, 0, 0, 0.3);
      content: '';
      z-index: 333;
      transition: opacity 0.2s;
      opacity: 0;
    }
    .img-cover:hover:after {
      opacity: 1;
    }
    .btn-upload-img {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 160px;
      border: 1px dotted #ccc;
      border-radius: 12px;
      cursor: pointer;
      .el-icon-plus {
        font-size: 30px;
      }
    }
    .btn-upload-img:hover {
      color: #000;
    }
  }
</style>

<style lang="scss">
  .cover-image-wrap-review-cropper {
    width: 290px;
    height: 160px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 0 4px #ccc;
    & img {
      width: 100%;
      height: 100%;
    }
  }
</style>
