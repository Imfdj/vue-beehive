<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="权限码" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doCreate, doEdit } from '@/api/roleManagement';

  export default {
    name: 'RoleManagementEdit',
    data() {
      return {
        form: {
          id: '',
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入权限码' },
            { min: 1, max: 50, trigger: 'blur', message: '长度在 1 到 50 个字符' },
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
          this.title = '添加';
        } else {
          this.title = '编辑';
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
            if (this.title === '添加') {
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
