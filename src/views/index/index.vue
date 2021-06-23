<template>
  <div class="index-container wrap-content-main">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <MyProject></MyProject>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <MyTask></MyTask>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import MyProject from './components/MyProject';
  import MyTask from './components/MyTask';

  export default {
    name: 'Index',
    components: {
      MyProject,
      MyTask,
    },
    data() {
      return {};
    },
    created() {},
    mounted() {},
    beforeDestroy() {},
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0;
    background-color: transparent;
  }
</style>
