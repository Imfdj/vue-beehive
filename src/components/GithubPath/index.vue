<template>
  <div class="github-path">
    <el-tooltip class="item" effect="dark" content="项目github地址，前后端源码技术" placement="top">
      <a href="https://github.com/Imfdj/vue-beehive" target="_blank" style="text-decoration: none; color: inherit"
        ><i class="iconfont icon-github-fill"></i> Github</a
      >
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'GithubPath',
    data() {
      return {};
    },
    created() {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .github-path {
    cursor: pointer;
    .iconfont {
      margin-right: 3px;
    }
    & a {
      display: flex;
      align-items: center;
      line-height: 14px;
    }
  }
</style>
