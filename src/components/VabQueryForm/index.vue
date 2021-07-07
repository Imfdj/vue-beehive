<template>
  <el-row :gutter="0" class="vab-query-form">
    <slot></slot>
  </el-row>
</template>

<script>
  export default {
    name: 'VabQueryForm',
    props: {},
    data() {
      return {};
    },
    created() {},
    mounted() {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  @mixin panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .vab-query-form {
    margin-bottom: 10px;

    ::v-deep {
      .el-col {
        min-height: 1px;
      }

      .top-panel {
        @include panel;
      }

      .bottom-panel {
        @include panel;

        padding-top: 14px;
        border-top: 1px solid #dcdfe6;
      }

      .left-panel {
        @include panel;

        > .el-button,
        .el-form-item {
          margin: 5px;
        }
      }

      .right-panel {
        @include panel;

        justify-content: flex-end;

        .el-form-item {
          margin: 5px;
        }
      }
    }
  }
</style>
