<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="路由名" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="路由title" prop="title">
        <el-input v-model="form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父ID" prop="parent_id">
        <el-input v-model="form.parent_id" disabled="disabled" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图标url" prop="icon">
        <el-input v-model="form.icon" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="路由路径" prop="path">
        <el-input v-model="form.path" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否隐藏此路由" prop="hidden">
        <el-radio v-model="form.hidden" :label="1">是</el-radio>
        <el-radio v-model="form.hidden" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="是否总是显示此路由" prop="always_show">
        <el-radio v-model="form.always_show" :label="1">是</el-radio>
        <el-radio v-model="form.always_show" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="是否缓存此路由" prop="keep_alive">
        <el-radio v-model="form.keep_alive" :label="1">是</el-radio>
        <el-radio v-model="form.keep_alive" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="打开新路由的方式" prop="target">
        <el-input v-model="form.target" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="路由对应的组件" prop="component">
        <el-input v-model="form.component" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="路由重定向路径" prop="redirect">
        <el-input v-model="form.redirect" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="redirect">
        <el-input v-model="form.sort" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doCreate, doEdit } from '@/api/menuManagement';

  export default {
    name: 'MenuManagementEdit',
    data() {
      return {
        form: {
          id: '',
          hidden: 0,
          always_show: 0,
          keep_alive: 0,
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入路由名' },
            { max: 60, trigger: 'blur', message: '长度不超过 60 个字符' },
          ],
          component: [
            { required: true, trigger: 'blur', message: '请输入路由对应的组件' },
            { max: 100, trigger: 'blur', message: '长度不超过 100 个字符' },
          ],
          title: [{ max: 60, trigger: 'blur', message: '长度不超过 60 个字符' }],
          target: [{ max: 254, trigger: 'blur', message: '长度不超过 254 个字符' }],
          icon: [{ max: 254, trigger: 'blur', message: '长度不超过 254 个字符' }],
          redirect: [{ max: 254, trigger: 'blur', message: '长度不超过 254 个字符' }],
          path: [{ max: 100, trigger: 'blur', message: '长度不超过 100 个字符' }],
        },
        title: '',
        dialogFormVisible: false,
      };
    },
    created() {},
    methods: {
      showEdit(row, createChildren) {
        if (!row || createChildren) {
          this.title = '添加';
          if (createChildren) {
            this.form.parent_id = row.id;
          } else {
            this.form.parent_id = 0;
          }
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
              console.log(this.form);
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
