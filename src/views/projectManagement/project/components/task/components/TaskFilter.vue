<template>
  <div class="task-filter">
    <el-popover placement="bottom" width="280" trigger="click">
      <div class="task-filter-wrap-content">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.name" placeholder="搜索任务标题"></el-input>
          </el-form-item>
          <el-form-item label="执行者">
            <el-select v-model="form.executor_ids" multiple placeholder="请选择">
              <el-option v-for="item in projectMembers" :key="item.id" :label="item.username" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建者">
            <el-select v-model="form.creator_ids" multiple placeholder="请选择">
              <el-option v-for="item in projectMembers" :key="item.id" :label="item.username" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否完成">
            <el-select v-model="form.is_done" placeholder="请选择">
              <el-option v-for="item in optionsDone" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优先级">
            <el-select v-model="form.task_priority_ids" multiple placeholder="请选择">
              <el-option v-for="item in taskPrioritys" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行状态">
            <el-select v-model="form.task_state_ids" multiple placeholder="请选择">
              <el-option v-for="item in taskStates" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <slot slot="reference"></slot>
    </el-popover>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'TaskFilter',
    data() {
      return {
        form: {
          is_done: -1,
        },
        optionsDone: [
          {
            value: -1,
            label: '全部',
          },
          {
            value: 1,
            label: '是',
          },
          {
            value: 0,
            label: '否',
          },
        ],
      };
    },
    computed: {
      ...mapState('project', ['projectMembers', 'taskPrioritys', 'taskStates']),
    },
    methods: {
      search() {
        this.$emit('search', this.form);
      },
      reset() {
        this.form = this.$options.data().form;
        this.$emit('search', this.form);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .task-filter {
  }
</style>
