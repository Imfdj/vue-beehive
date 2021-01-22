<template>
  <div class="project-template">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in titles" :key="index" :label="item" :name="index.toString()"
        >{{ item }}
      </el-tab-pane>
    </el-tabs>
    <el-button class="create-template" type="primary" icon="el-icon-plus" @click="createTemplate"
      >创建项目模板</el-button
    >
    <ProjectTemplateEdit ref="ProjectTemplateEdit"></ProjectTemplateEdit>
  </div>
</template>

<script>
  import ProjectTemplateEdit from './components/ProjectTemplateEdit';

  export default {
    name: 'ProjectTemplate',
    components: {
      ProjectTemplateEdit,
    },
    data() {
      return {
        activeName: '0',
        titles: ['自定义模板', '公共模板'],
      };
    },
    created() {},
    mounted() {},
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      createTemplate() {
        this.$refs.ProjectTemplateEdit.showEdit();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-template {
    position: relative;
    padding: 20px;
    .create-template {
      position: absolute;
      top: 13px;
      right: 20px;
    }
  }
</style>
