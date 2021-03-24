<template>
  <el-dialog
    title="编辑列表"
    :visible.sync="dialogVisible"
    width="360px"
    custom-class="editor-task-list-dialog"
    append-to-body
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="列表名称：" prop="name">
        <el-input v-model="form.name" placeholder="列表名称" style="width: 100%;"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/taskListManagement';

  export default {
    name: 'EditorTaskListDialog',
    data() {
      return {
        dialogVisible: false,
        form: {
          id: null,
          name: 1,
        },
        rules: {
          name: [
            { required: true, message: '请输入列表名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          ],
        },
      };
    },
    methods: {
      show(row) {
        this.form = Object.assign({}, row);
        this.dialogVisible = true;
      },
      close() {
        this.$refs['form'].resetFields();
        this.form = this.$options.data().form;
        this.dialogVisible = false;
      },
      async doEdit() {
        const { msg } = await doEdit(this.form);
        this.$baseNotify('', msg);
      },
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            await this.doEdit();
            this.close();
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style>
  .editor-task-list-dialog .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
