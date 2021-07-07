<template>
  <div class="index-container wrap-content-main">
    <UserInfo :projectCount="projectCount"></UserInfo>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <MyProject @getProjectCount="getProjectCount"></MyProject>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <MyTask></MyTask>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import UserInfo from './components/UserInfo';
  import MyProject from './components/MyProject';
  import MyTask from './components/MyTask';

  export default {
    name: 'Index',
    components: {
      UserInfo,
      MyProject,
      MyTask,
    },
    data() {
      return {
        projectCount: 0,
      };
    },
    created() {},
    mounted() {},
    beforeDestroy() {},
    methods: {
      getProjectCount(count) {
        this.projectCount = count;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0;
    background-color: transparent;
  }
</style>
