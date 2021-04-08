<template>
  <div class="project-template wrap-content-main">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item, index) in titles" :key="index" :label="item" :name="index.toString()">
        <div v-loading="loading" class="list">
          <div v-for="item_template in listData" :key="item_template.id" class="item-list">
            <BImage :src="item_template.cover"></BImage>
            <div class="item-info">
              <div class="name">{{ item_template.name }}</div>
              <div class="intro color-light">{{ item_template.intro }}</div>
            </div>
            <div class="item-tasks color-light">
              <div
                v-for="(item_task, index_task) in item_template.project_template_tasks"
                :key="item_task.id"
                class="task"
              >
                {{ item_task.name }}
                <i v-if="index_task !== item_template.project_template_tasks.length - 1" class="el-icon-right"></i
              ></div>
            </div>
            <div class="item-control">
              <el-button icon="el-icon-s-grid" circle size="mini" @click="handleShowTasks(item_template)"></el-button>
              <el-button icon="el-icon-edit" circle size="mini" @click="handleEdit(item_template)"></el-button>
              <el-button icon="el-icon-delete" circle size="mini" @click="handleDelete(item_template)"></el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-button class="create-template" type="primary" icon="el-icon-plus" @click="handleEdit">创建项目模板 </el-button>
    <ProjectTemplateEdit ref="edit" @fetchData="getList"></ProjectTemplateEdit>
    <el-dialog :title="`「${currentTemplate.name}」任务列表`" :visible.sync="dialogFormVisible">
      <projectTemplateTask
        v-if="dialogFormVisible"
        :templateId="currentTemplate.id"
        @fetchData="getList"
      ></projectTemplateTask>
    </el-dialog>
  </div>
</template>

<script>
  import ProjectTemplateEdit from './components/ProjectTemplateEdit';
  import BImage from '@/components/B-image';
  import projectTemplateTask from '../projectTemplateTask';
  import { getList } from '@/api/projectTemplateManagement';
  import { doDelete } from '@/api/projectTemplateManagement';

  export default {
    name: 'ProjectTemplate',
    components: {
      ProjectTemplateEdit,
      projectTemplateTask,
      BImage,
    },
    data() {
      return {
        dialogFormVisible: false,
        loading: false,
        activeName: '0',
        listData: [],
        titles: ['自定义模板', '公共模板'],
        currentTemplate: {},
        is_custom: 1,
      };
    },
    watch: {
      activeName(newValue, oldValue) {
        this.is_custom = newValue === '0' ? 1 : 0;
        this.getList();
      },
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
      handleShowTasks(row) {
        this.currentTemplate = row;
        this.dialogFormVisible = true;
      },
      async getList() {
        this.loading = true;
        const {
          data: { rows, count },
        } = await getList({ is_custom: this.is_custom, limit: 1000, offset: 0 });
        this.loading = false;
        this.listData = rows;
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
  .project-template {
    position: relative;
    padding: 20px;
    .create-template {
      position: absolute;
      top: 13px;
      right: 20px;
    }
    .list {
      .item-list {
        display: flex;
        height: 50px;
        padding: 12px 0;
        border-bottom: 1px solid #ccc;
        .item-img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background-color: #f1f1f1;
          border-radius: 3px;
        }
        .item-info {
          width: 160px;
          margin-left: 10px;
          line-height: 25px;
        }
        .item-tasks {
          display: flex;
          flex: 1;
          justify-content: flex-end;
          padding-right: 40px;
          line-height: 50px;
          text-align: right;
          .task {
            margin-left: 6px;
          }
        }
        .item-control {
          display: flex;
          align-items: center;
          width: 130px;
        }
      }
    }
  }
</style>
