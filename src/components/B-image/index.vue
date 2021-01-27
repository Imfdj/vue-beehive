<template>
  <el-image
    :src="src"
    class="b-image"
    :style="`width: ${width}px; height: ${height}px; border-radius: ${borderRadius}px;`"
  >
    <div slot="placeholder" class="image-slot-custom">
      <i class="el-icon-loading"></i>
    </div>
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script>
  export default {
    name: 'BImage',
    props: {
      src: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
        required: false,
        default: 50,
      },
      height: {
        type: Number,
        required: false,
        default: 50,
      },
      borderRadius: {
        type: Number,
        required: false,
        default: 3,
      },
    },
  };
</script>

<style scoped>
  .b-image {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #f1f1f1;
  }
</style>
