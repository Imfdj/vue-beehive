<template>
  <el-tooltip class="btn-tooltip" effect="dark" :content="tooltipContent" placement="top" :open-delay="300">
    <el-button
      :icon="icon"
      :size="size"
      :class="btnClass"
      :circle="circle"
      :disabled="disabled"
      :type="type"
      @click="$emit('click')"
    ></el-button>
  </el-tooltip>
</template>

<script>
  export default {
    name: 'BtnTooltip',
    props: {
      tooltipContent: {
        type: String,
        default: '',
      },
      icon: {
        type: String,
        default: '',
      },
      size: {
        type: String,
        default: 'mini',
      },
      btnClass: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
      circle: {
        type: Boolean,
        default: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .btn-tooltip {
  }
</style>
