<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="form.username" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model.trim="form.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model.trim="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-input v-model.trim="form.company" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input v-model.trim="form.city" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio v-model="form.state" :label="1">正常</el-radio>
        <el-radio v-model="form.state" :label="0">停用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/user';
  import { validateEmail, validatePhone } from '@/utils/validate-rule-el-form';

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          username: '',
          password: '',
          email: '',
        },
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
            { min: 2, max: 60, trigger: 'blur', message: '长度在 2 到 60 个字符' },
          ],
          nickname: [{ min: 2, max: 60, trigger: 'blur', message: '长度在 2 到 60 个字符' }],
          email: [
            { required: true, trigger: 'blur', message: '请输入邮箱' },
            { validator: validateEmail, trigger: 'blur' },
          ],
          phone: [
            { required: false, trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      };
    },
    created() {},
    methods: {
      showEdit(row) {
        this.title = '编辑';
        this.form = Object.assign({}, row);
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
