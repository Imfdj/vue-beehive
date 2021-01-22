<template>
  <div class="project-template-edit">
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="400px" @close="close">
      <el-form ref="form" :model="form" :rules="rules" label-width="0px">
        <el-form-item prop="id">
          <el-input v-model="form.id" autocomplete="off" placeholder="模板名称（必须）"></el-input>
        </el-form-item>
        <el-form-item prop="id">
          <el-input v-model="form.id" type="textarea" rows="2" autocomplete="off" placeholder="模板简介"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { doEdit } from '@/api/projectTemplateManagement';

  export default {
    name: 'ProjectTemplateEdit',
    data() {
      return {
        form: {
          id: '',
        },
        rules: {
          id: [{ required: true, trigger: 'blur', message: '请输入id' }],
        },
        title: '',
        dialogFormVisible: false,
      };
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加模板';
        } else {
          this.title = '编辑模板';
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
            const { msg } = await doEdit(this.form);
            this.$baseMessage(msg, 'success');
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
  .project-template-edit {
    ::v-deep .el-form {
      padding-right: 0 !important;
    }
  }
</style>
