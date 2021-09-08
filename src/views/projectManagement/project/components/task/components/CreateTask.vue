<template>
  <div class="create-task">
    <el-dropdown trigger="click" placement="bottom-start" @command="commandTaskType">
      <span class="el-dropdown-link">
        <i :class="[taskTypeSelect.icon]" :style="`color: ${taskTypeSelect.color};`"></i>
        {{ taskTypeSelect.name }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" style="width: 200px">
        <el-dropdown-item v-for="item in taskTypes" :key="item.id" :command="item">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span><i :class="item.icon" :style="`color: ${item.color};`"></i> {{ item.name }}</span>
            <i v-if="taskTypeSelect.id === item.id" class="el-icon-check"></i>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="wrap-item">
      <el-input v-model="name" type="textarea" :autosize="{ minRows: 3 }" placeholder="输入标题"></el-input>
    </div>
    <div class="wrap-item executor">
      <ExecutorSelect
        ref="ExecutorSelect"
        :executorId="executor.id"
        :showNoOne="true"
        @select="executorSelect"
      ></ExecutorSelect>
    </div>
    <div v-if="false" class="wrap-item btn-more"><i class="el-icon-more"></i> 更多</div>
    <div class="wrap-item btn-ctrl">
      <el-button style="width: 49%" @click="cancelClick">取消</el-button>
      <el-button type="primary" style="width: 49%" @click="commitClick">创建</el-button>
    </div>
  </div>
</template>

<script>
  import { doCreate } from '@/api/taskManagement';
  import { mapState } from 'vuex';
  import ExecutorSelect from '@/components/ExecutorSelect';

  export default {
    name: 'CreateTask',
    components: {
      ExecutorSelect,
    },
    props: {
      itemListCreate: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        name: '',
        taskTypeSelect: {},
        executor: {
          id: 0,
        },
      };
    },
    computed: {
      ...mapState('project', ['taskTypes', 'taskStates', 'taskPrioritys', 'currentProjectId']),
    },
    created() {
      this.taskTypeSelect = this.taskTypes[0];
    },
    methods: {
      cancelClick() {
        this.$emit('cancelClick');
      },
      async commitClick() {
        const { msg } = await doCreate({
          name: this.name,
          task_list_id: this.itemListCreate.id,
          task_type_id: this.taskTypeSelect.id,
          task_state_id: this.taskStates[0].id,
          task_priority_id: this.taskPrioritys[0].id,
          executor_id: this.executor.id,
          project_id: this.currentProjectId,
        });
        this.$baseMessage(msg, 'success');
        this.$emit('createSuccess');
      },
      commandTaskType(taskType) {
        this.taskTypeSelect = taskType;
      },
      executorSelect(user) {
        this.executor = user;
        this.$refs.ExecutorSelect.setHide();
        console.log(123412);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .create-task {
    width: 249px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
    padding: 10px;

    .el-dropdown-link {
      cursor: pointer;
    }

    .wrap-item {
      display: flex;
      align-items: center;
      padding: 5px 0px;
    }

    .btn-more {
      cursor: pointer;
    }

    .btn-more:hover {
      color: #3da8f5;
    }

    .btn-ctrl {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
