<template>
  <div class="task-tag">
    <div v-show="!showEdit" class="wrap-bean">
      <div class="wrap-header">
        <el-input v-model="name" style="width: 205px;" placeholder="搜索标签"></el-input>
        <i class="el-icon-circle-plus-outline" @click="showEditClick"></i>
      </div>
      <div class="wrap-list">
        <div v-for="tag in taskTagsFilter" :key="tag.id" class="item" @click="tagClick(tag)">
          <div class="wrap-name">
            <span class="color-point" :style="`background-color: ${tag.color};`"></span>
            {{ tag.name }}
          </div>
          <i class="el-icon-edit" @click.stop="EditClick(tag)"></i>
          <i v-if="task_tag_ids_selected.includes(tag.id)" class="el-icon-check"></i>
        </div>
      </div>
    </div>
    <div v-if="showEdit" class="wrap-create">
      <div class="header">
        <i class="el-icon-arrow-left" @click="closeEdit"></i>
        {{ form.id ? '编辑' : '新建' }}标签
        <div style="width: 20px;"></div>
      </div>
      <div class="content">
        <el-input v-model="form.name" placeholder="标签名称"></el-input>
        <div class="color-list">
          <div
            v-for="item in colors"
            :key="item"
            class="item"
            :style="`background-color: ${item};`"
            @click="colorClick(item)"
          >
            <i v-if="form.color === item" class="el-icon-check"></i
          ></div>
        </div>
        <div v-if="form.id" class="wrap-btn">
          <el-popconfirm title="确定删除此标签吗？" @onConfirm="DeleteTaskTag">
            <el-button slot="reference" type="danger" style="width: 110px;" plain>删除</el-button>
          </el-popconfirm>
          <el-button type="primary" style="width: 110px;" :disabled="!form.name" @click="EditTaskTag">完成 </el-button>
        </div>
        <el-button v-else type="primary" style="width: 100%;" :disabled="!form.name" @click="CreateTaskTag"
          >创建
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store';
  import { doChange } from '@/api/taskTaskTagManagement';
  import {
    doCreate as doCreateTaskTag,
    doDelete as doDeleteTaskTag,
    doEdit as doEditTaskTag,
  } from '@/api/taskTagManagement';
  import { mapState } from 'vuex';

  export default {
    name: 'TaskTag',
    props: {
      taskInfo: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        showEdit: false,
        name: '',
        form: {
          id: '',
          name: '',
          color: '#1B9AEE',
        },
        project_id: null,
        task_tag_ids_selected: [],
        colors: ['#1B9AEE', '#15AD31', '#009C95', '#6A70B8', '#FA8C15', '#E62412'],
      };
    },
    computed: {
      ...mapState('project', ['taskTags']),
      taskTagsFilter() {
        return this.taskTags.filter(item => {
          return item.name.includes(this.name);
        });
      },
      task_tags_selected() {
        return this.taskTags.filter(item => {
          return this.task_tag_ids_selected.includes(item.id);
        });
      },
    },
    watch: {
      'taskInfo.task_tags'(newValue, oldValue) {
        this.task_tag_ids_selected = newValue.map(item => item.id) || [];
      },
      task_tags_selected(newValue, oldValue) {
        this.$emit('change', newValue);
      },
    },
    created() {
      this.project_id = parseInt(this.$route.params.id);
    },
    methods: {
      tagClick(tag) {
        this.doChangeExec({
          task_id: this.taskInfo.id,
          task_tag_id: tag.id,
        });
        if (this.task_tag_ids_selected.includes(tag.id)) {
          this.task_tag_ids_selected.splice(this.task_tag_ids_selected.indexOf(tag.id), 1);
        } else {
          this.task_tag_ids_selected.push(tag.id);
        }
      },
      async doChangeExec(payload) {
        await doChange(payload);
      },
      async CreateTaskTag() {
        const { msg } = await doCreateTaskTag({
          ...this.form,
          project_id: this.project_id,
        });
        this.$baseMessage(msg, 'success');
        store.dispatch('project/setTaskTags', this.project_id);
        this.closeEdit();
      },
      async EditTaskTag() {
        const { msg } = await doEditTaskTag({
          ...this.form,
          project_id: this.project_id,
        });
        this.$baseMessage(msg, 'success');
        store.dispatch('project/setTaskTags', this.project_id);
        this.closeEdit();
      },
      async DeleteTaskTag() {
        const { msg } = await doDeleteTaskTag({
          ids: [this.form.id],
        });
        this.$baseMessage(msg, 'success');
        store.dispatch('project/setTaskTags', this.project_id);
        this.closeEdit();
      },
      colorClick(item) {
        this.form.color = item;
      },
      showEditClick() {
        this.showEdit = true;
      },
      closeEdit() {
        this.showEdit = false;
        this.form = this.$options.data().form;
      },
      EditClick(tag) {
        console.log(tag);
        this.form = Object.assign({}, tag);
        this.showEditClick();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .task-tag {
    .wrap-bean {
      .wrap-header {
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;

        ::v-deep .el-input__inner {
          border: none;
        }

        .el-icon-circle-plus-outline {
          font-size: 18px;
          color: #32a4f0;
          cursor: pointer;
        }

        .el-icon-circle-plus-outline:hover {
          color: #129cf8;
        }
      }

      .wrap-list {
        .item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          padding: 0px 10px;
          cursor: pointer;

          .wrap-name {
            max-width: 163px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .color-point {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background-color: red;
            margin-right: 3px;
          }

          .el-icon-edit {
            position: absolute;
            top: 50%;
            right: 40px;
            transform: translateY(-50%);
            visibility: hidden;
          }

          & i {
            font-size: 20px;
          }
        }

        .item:hover {
          background-color: #f7f7f7;

          .el-icon-edit {
            visibility: visible;
          }
        }

        .el-icon-edit:hover {
          color: #1b9aee;
        }
      }
    }

    .wrap-create {
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 30px;
        font-weight: 600;
        font-size: 15px;
        border-bottom: 1px solid #dedede;
        margin-bottom: 15px;

        & i {
          font-size: 20px;
        }
      }

      .content {
        .color-list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;

          .item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 30px;
            background-color: #3da8f5;
            cursor: pointer;

            & i {
              color: #fff;
            }
          }
        }

        .wrap-btn {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>
