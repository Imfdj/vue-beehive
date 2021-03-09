<template>
  <div class="dj-tag">
    <slot></slot>
    <i class="el-icon-close" @click="close"></i>
  </div>
</template>

<script>
  export default {
    name: 'DjTag',
    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dj-tag {
    display: inline-block;
    margin: 0px 8px 8px 0px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 4px 6px 4px 10px;
    line-height: 20px;

    .el-icon-close {
      visibility: hidden;
      cursor: pointer;
    }

    .el-icon-close:hover {
      background-color: #ccc;
    }
  }

  .dj-tag:hover {
    .el-icon-close {
      visibility: visible;
    }
  }
</style>
