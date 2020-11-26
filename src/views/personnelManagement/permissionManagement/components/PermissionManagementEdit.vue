<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标识码" prop="mark">
        <el-input v-model="form.mark" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="标识码名" prop="mark_name">
        <el-input v-model="form.mark_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" autocomplete="off">
          <el-select
            slot="prepend"
            v-model="formName"
            placeholder="请选择"
            style="width: 100px;"
            @change="formNameChange"
          >
            <el-option label="列表" value="列表"></el-option>
            <el-option label="新增" value="新增"></el-option>
            <el-option label="详情" value="详情"></el-option>
            <el-option label="修改" value="修改"></el-option>
            <el-option label="批量删除" value="批量删除"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="路径" prop="url">
        <el-input v-model="form.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="动作" prop="action">
        <el-radio-group v-model="form.action">
          <el-radio label="get">GET</el-radio>
          <el-radio label="post">POST</el-radio>
          <el-radio label="put">PUT</el-radio>
          <el-radio label="delete">DELETE</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="需要认证" prop="authentication">
        <el-radio-group v-model="form.authentication">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="需要授权" prop="authorization">
        <el-radio-group v-model="form.authorization">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doCreate, doEdit } from '@/api/permissionManagement';

  export default {
    name: 'PermissionManagementEdit',
    data() {
      return {
        form: {
          id: '',
          state: 1,
          authentication: 1,
          authorization: 1,
          action: 'get',
          url: '/api/v1/',
        },
        rules: {
          mark: [
            { required: true, trigger: 'blur', message: '请输入标识码' },
            { max: 60, trigger: 'blur', message: '长度不超过 60 个字符' },
          ],
          mark_name: [
            { required: true, trigger: 'blur', message: '请输入标识码名' },
            { max: 60, trigger: 'blur', message: '长度不超过 60 个字符' },
          ],
          name: [
            { required: true, trigger: 'change', message: '请选择名称' },
            { max: 60, trigger: 'blur', message: '长度不超过 60 个字符' },
          ],
          url: [
            { required: true, trigger: 'blur', message: '请输入路径' },
            { max: 254, trigger: 'blur', message: '长度不超过 254 个字符' },
          ],
          description: [{ max: 254, trigger: 'blur', message: '长度不超过 254 个字符' }],
        },
        title: '',
        formName: '',
        dialogFormVisible: false,
      };
    },
    watch: {
      'form.mark'(newValue, oldValue) {
        if (!this.$baseLodash.isUndefined(newValue) && this.form.id === '') {
          this.form.url = this.form.url.replace(/(\/api\/v1\/).*/, '$1' + newValue);
        }
      },
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
        this.formName = '';
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
              this.close();
            }
            this.$emit('fetchData');
          } else {
            return false;
          }
        });
      },
      formNameChange(value) {
        this.form.name = value;
        switch (value) {
          case '列表':
            this.form.action = 'get';
            break;
          case '新增':
            this.form.action = 'post';
            break;
          case '详情':
            this.form.action = 'get';
            break;
          case '修改':
            this.form.action = 'put';
            break;
          case '批量删除':
            this.form.action = 'delete';
            break;
        }
      },
    },
  };
</script>
