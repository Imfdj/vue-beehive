<template>
  <div class="project-template-task">
    <div v-loading="loading" class="list">
      <div v-for="item_template in listData" :key="item_template.id" class="item-list">
        <div class="item-info">
          <div class="name">{{ item_template.name }}</div>
          <div class="intro color-light">排序：{{ item_template.sort }}</div>
        </div>
        <div class="item-tasks color-light"> </div>
        <div class="item-control">
          <el-button
            :disabled="!$checkPermission(projectTemplateTaskPermissions.doEdit)"
            icon="el-icon-edit"
            circle
            size="mini"
            @click="handleEdit(item_template)"
          ></el-button>
          <el-button
            :disabled="!$checkPermission(projectTemplateTaskPermissions.doDelete)"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="handleDelete(item_template)"
          ></el-button>
        </div>
      </div>
    </div>
    <el-button
      :disabled="!$checkPermission(projectTemplateTaskPermissions.doCreate)"
      class="create-template"
      type="primary"
      icon="el-icon-plus"
      @click="handleEdit"
      >添加任务
    </el-button>
    <ProjectTemplateEdit ref="edit" :templateId="templateId" @fetchData="getList"></ProjectTemplateEdit>
  </div>
</template>

<script>
  import ProjectTemplateEdit from './components/ProjectTemplateTaskEdit';
  import {
    getList,
    doDelete,
    permissions as projectTemplateTaskPermissions,
  } from '@/api/projectTemplateTaskManagement';

  export default {
    name: 'ProjectTemplateTask',
    components: {
      ProjectTemplateEdit,
    },
    props: {
      templateId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        projectTemplateTaskPermissions,
        loading: false,
        listData: [],
      };
    },
    created() {
      this.getList();
    },
    mounted() {},
    methods: {
      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row);
        } else {
          this.$refs['edit'].showEdit();
        }
      },
      async getList() {
        this.loading = true;
        const {
          data: { rows, count },
        } = await getList({
          project_template_id: this.templateId,
          prop_order: 'sort',
          order: 'desc',
          limit: 1000,
          offset: 0,
        });
        this.loading = false;
        this.listData = rows;
        this.$emit('fetchData');
      },
      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await doDelete({ ids: [row.id] });
          this.$baseMessage('删除成功', 'success');
          this.getList();
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-template-task {
    position: relative;
    min-height: 400px;
    padding: 20px;
    .create-template {
      position: absolute;
      top: -20px;
      right: 20px;
    }
    .list {
      .item-list {
        display: flex;
        height: 50px;
        padding: 12px 0;
        border-bottom: 1px solid #ccc;
        .item-info {
          width: 160px;
          line-height: 25px;
        }
        .item-tasks {
          flex: 1;
          padding-right: 40px;
          line-height: 50px;
          text-align: right;
        }
        .item-control {
          display: flex;
          align-items: center;
          width: 90px;
        }
      }
    }
  }
</style>
