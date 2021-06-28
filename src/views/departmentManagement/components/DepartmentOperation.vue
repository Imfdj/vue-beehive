<template>
  <div class="department-operation">
    <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" @close="close">
      <div class="wrap-content">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-form">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="
                !this.$checkPermission(departmentPermissions.doCreate) ||
                !this.$checkPermission(departmentPermissions.doEdit)
              "
              @click="submitForm('form')"
              >{{ buttonName }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { doCreate, doEdit, permissions as departmentPermissions } from '@/api/departmentManagement';

  export default {
    name: 'DepartmentOperation',
    props: {
      isCreateDepartment: {
        type: Boolean,
        default: false,
        required: false,
      },
      departmentData: {
        type: Object,
        required: false,
        default: () => {
          return {};
        },
      },
    },
    data() {
      return {
        departmentPermissions,
        dialogVisible: false,
        form: {
          name: '',
          sort: '',
          parent_id: 0,
        },
        rules: {
          name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            { min: 2, max: 60, message: '长度在 2 到 60 个字符', trigger: 'blur' },
          ],
        },
      };
    },
    computed: {
      title() {
        return this.isCreateDepartment ? '创建部门' : '编辑部门';
      },
      buttonName() {
        return this.isCreateDepartment ? '创建' : '编辑';
      },
    },
    watch: {
      dialogVisible(newValue, oldValue) {
        if (newValue && !this.isCreateDepartment) {
          this.form = { ...this.departmentData };
        }
      },
    },
    methods: {
      close() {
        this.$refs['form'].resetFields();
        this.form = this.$options.data().form;
        this.dialogVisible = false;
      },
      async doCreate() {
        await doCreate(this.form);
        this.$emit('doCreateDepartmentSuccess');
        this.$message.success('创建成功');
        this.close();
      },
      async doEdit() {
        await doEdit(this.form);
        this.$emit('doCreateDepartmentSuccess');
        this.$message.success('编辑成功');
        this.close();
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.isCreateDepartment) {
              this.doCreate();
            } else {
              this.doEdit();
            }
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .department-operation {
  }
</style>
