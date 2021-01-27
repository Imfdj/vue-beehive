<template>
  <div class="project-template-task-edit">
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="330px" append-to-body @close="close">
      <el-form ref="form" :model="form" :rules="rules" label-width="0px">
        <el-form-item prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="模板任务名称（必须）"></el-input>
        </el-form-item>
        <el-form-item prop="sort">
          <el-input v-model="form.sort" autocomplete="off" placeholder="排序"></el-input>
          <div>排序，值越大越靠前，默认0</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { doEdit, doCreate } from '@/api/projectTemplateTaskManagement';

  export default {
    name: 'ProjectTemplateTaskEdit',
    props: {
      templateId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        form: {
          id: '',
          name: '',
          project_template_id: '',
          sort: 0,
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入任务名称' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      };
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加模板任务';
          this.form.project_template_id = this.templateId;
        } else {
          this.title = '编辑模板任务';
          this.form = Object.assign({}, row);
        }
        this.dialogFormVisible = true;
      },
      close() {
        this.$refs['form'].resetFields();
        this.form = this.$options.data().form;
        this.dialogFormVisible = false;
      },
      save() {
        this.$refs['form'].validate(async valid => {
          if (valid) {
            if (this.title === '添加模板任务') {
              const { msg } = await doCreate(this.form);
              this.$baseMessage(msg, 'success');
            } else {
              const { msg } = await doEdit(this.form);
              this.$baseMessage(msg, 'success');
            }
            this.$emit('fetchData');
            this.close();
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-template-task-edit {
    ::v-deep .el-form {
      padding-right: 0 !important;
    }
  }
</style>
