<template>
  <div class="department-operation">
    <el-dialog :title="title" :visible.sync="dialogVisible" width="400px">
      <div class="wrap-content">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="ruleForm.sort"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{ buttonName }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { doCreate, doEdit } from '@/api/departmentManagement';

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
        dialogVisible: false,
        ruleForm: {
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
          this.ruleForm = { ...this.departmentData };
        }
      },
    },
    methods: {
      async doCreate() {
        await doCreate(this.ruleForm);
        this.$emit('doCreateDepartmentSuccess');
        this.$message.success('创建成功');
        this.dialogVisible = false;
      },
      async doEdit() {
        await doEdit(this.ruleForm);
        this.$emit('doCreateDepartmentSuccess');
        this.$message.success('编辑成功');
        this.dialogVisible = false;
      },
      submitForm(formName) {
        console.log(this.ruleForm);
        console.log(this.departmentData);
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.isCreateDepartment) {
              this.doCreate();
            } else {
              this.doEdit();
            }
          } else {
            console.log('error submit!!');
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
