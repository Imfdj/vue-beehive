<template>
  <div class="file-type-icon">
    <BImage
      v-if="file.file_type.includes('image')"
      class="user-avatar"
      :src="file.path || ''"
      :width="size"
      :height="size"
      :borderRadius="borderRadius"
    ></BImage>
    <i v-if="file.file_type.includes('audio')" class="iconfont icon-yinle" :style="`font-size: ${size}px`"></i>
    <i v-if="file.file_type.includes('video')" class="iconfont icon-shipin" :style="`font-size: ${size}px`"></i>
    <i
      v-if="!/image|audio|video\//.test(file.file_type)"
      class="iconfont icon-wenjian"
      :style="`font-size: ${size}px`"
    ></i>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';

  export default {
    name: 'FileTypeIcon',
    components: {
      BImage,
    },
    props: {
      file: {
        type: Object,
        required: true,
      },
      size: {
        type: Number,
        required: false,
        default: 32,
      },
      borderRadius: {
        type: Number,
        required: false,
        default: 8,
      },
    },
    data() {
      return {};
    },
    created() {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .file-type-icon {
    display: inline-block;
    .iconfont {
      margin-right: 10px;
    }
    .icon-yinle {
      color: #ffa115;
    }
    .icon-shipin {
      color: #3598dc;
    }
    .user-avatar {
      margin-right: 10px;
    }
  }
</style>
