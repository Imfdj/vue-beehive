/** * @Title: $ * @Package $ * @Description: TODO * @author Imfdj * @date $ $ */

<template>
  <span class="btn-icon">
    <i :class="iconClass"></i>
    <span class="name">
      <slot></slot>
    </span>
  </span>
</template>

<script>
  export default {
    name: 'BtnIcon',
    props: {
      iconClass: {
        type: String,
        required: true,
      },
    },
    data() {
      return {};
    },
  };
</script>

<style lang="scss" scoped>
  .btn-icon {
    font-size: 14px;
    color: rgb(24, 144, 255);
    cursor: pointer;
    .iconfont {
      font-size: 14px;
    }
    .name {
      padding-left: 4px;
    }
  }
  .btn-icon:hover {
    color: #40a9ff;
  }
</style>
