<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="530px"
    custom-class="editor-working-hour-dialog"
    append-to-body
    @close="close"
  >
    <el-form v-if="task" ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="工时执行者">
        <ExecutorSelect
          ref="ExecutorSelect"
          :executorId="form.executor_id"
          :showAddUser="false"
          @select="executorSelect"
        ></ExecutorSelect>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="form.start_date"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          :clearable="false"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实际工时数" prop="work_time">
        <el-input-number
          v-model="form.work_time"
          controls-position="right"
          :min="0"
          :max="10000"
          placeholder="请输入实际工时(小时)"
          style="width: 100%;"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="工作进展" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 4 }"
          placeholder="请输入工作进展"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ExecutorSelect from '@/components/ExecutorSelect';
  import { doCreate, doEdit } from '@/api/taskWorkingHourManagement';
  import { mapState } from 'vuex';

  export default {
    name: 'EditorWorkingHourDialog',
    components: {
      ExecutorSelect,
    },
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        dialogVisible: false,
        title: '',
        form: {
          id: null,
          work_time: 1,
          task_id: 0,
          project_id: 0,
          executor_id: '',
          start_date: new Date(),
          description: '',
        },
        rules: {
          work_time: [{ required: true, message: '请输入实际工时', trigger: 'blur' }],
        },
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
      ...mapState('project', ['currentProjectId']),
    },
    methods: {
      show(row) {
        if (!row) {
          this.title = '实际工时录入';
          this.form.executor_id = this.userInfo.id;
          this.form.task_id = this.task.id;
          this.form.project_id = this.currentProjectId;
        } else {
          this.title = '实际工时';
          this.form = Object.assign({}, row);
        }
        this.dialogVisible = true;
      },
      close() {
        this.$refs['form'].resetFields();
        this.form = this.$options.data().form;
        this.dialogVisible = false;
      },
      executorSelect(user) {
        this.form.executor_id = user.id;
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.form.id) {
              this.doEdit();
            } else {
              this.doCreate();
            }
            this.close();
          } else {
            return false;
          }
        });
      },
      async doCreate() {
        const { msg } = await doCreate(this.form);
        this.$baseMessage(msg, 'success');
      },
      async doEdit() {
        const { msg } = await doEdit(this.form);
        this.$baseMessage(msg, 'success');
      },
    },
  };
</script>

<style>
  .editor-working-hour-dialog .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
