<template>
  <div class="project-list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in titles" :key="index" :label="item" :name="(index + 1).toString()">{{
        item
      }}</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import store from '@/store';

  export default {
    name: 'ProjectList',
    data() {
      return {
        activeName: '1',
        titles: [],
      };
    },
    created() {
      const path = this.$route.path;
      this.activeName = path.substring(path.lastIndexOf('/') + 1);
    },
    mounted() {
      const routes = store.getters['routes/routes'];
      const projectRouter = routes && routes.find(item => item.id === 27);
      const projectListRouter = projectRouter && projectRouter.children.find(item => item.id === 32);
      this.titles = projectListRouter && projectListRouter.children.map(item => item.title);
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-list {
    padding: 20px;
  }
</style>
