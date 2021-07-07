<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="" prop="permissions">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <div style="margin: 15px 0"></div>
        <el-checkbox-group ref="checkbox_group" v-model="form.permissions" @change="groupChange">
          <el-checkbox v-for="(item, index) in roleListData" :key="index" :label="item.name"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getList as getRoleList } from '@/api/roleManagement';
  import { getList as getUserRoleList, doBulkRoleCreate, doDelete } from '@/api/userRoleManagement';

  export default {
    name: 'UserRoleManagementEdit',
    data() {
      return {
        roleListData: [],
        userRoleListData: [],
        permissionsOrigin: [],
        form: {
          permissions: [],
        },
        rules: {
          permissions: [{ required: false, trigger: 'blur', message: '请选择权限' }],
        },
        title: '角色管理',
        dialogFormVisible: false,
        rowEdit: {},
        checkAll: false,
        isIndeterminate: true,
      };
    },
    created() {},
    methods: {
      handleCheckAllChange(val) {
        this.form.permissions = val ? this.roleListData.map(e => e.name) : [];
        this.isIndeterminate = false;
      },
      async doGetRoleList() {
        const {
          data: { rows, count },
        } = await getRoleList({ limit: 1000, offset: 0 });
        this.roleListData = rows;
      },
      async doGetUserRoleList(row) {
        const {
          data: { rows, count },
        } = await getUserRoleList({ user_id: row.id, limit: 1000, offset: 0 });
        this.userRoleListData = rows;
        console.log(this.userRoleListData);
        this.form.permissions = this.userRoleListData.map(e => {
          return e.role.name;
        });
        console.log(this.form.permissions);
        this.permissionsOrigin = this.$baseLodash.cloneDeep(this.form.permissions);
        console.log(this.permissionsOrigin);
      },
      groupChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.roleListData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleListData.length;
      },
      showEdit(row) {
        this.rowEdit = row;
        this.dialogFormVisible = true;
        Promise.all([this.doGetRoleList(), this.doGetUserRoleList(row)]).then(res => {
          this.groupChange(this.form.permissions);
        });
        // 重置全选状态
      },
      close() {
        this.$refs['form'].resetFields();
        this.form = this.$options.data().form;
        this.dialogFormVisible = false;
      },
      async BulkRoleCreate() {
        const diff_create = this.$baseLodash.difference(this.form.permissions, this.permissionsOrigin);
        const data = [];
        for (let i = 0; i < diff_create.length; i++) {
          for (let j = 0; j < this.roleListData.length; j++) {
            if (this.roleListData[j].name === diff_create[i]) {
              data.push(this.roleListData[j].id);
              break;
            }
          }
        }
        if (data.length) {
          const { msg } = await doBulkRoleCreate({ user_id: this.rowEdit.id, role_ids: data });
          this.$baseMessage(msg, 'success');
        }
      },
      async Delete() {
        const diff_delete = this.$baseLodash.difference(this.permissionsOrigin, this.form.permissions);
        const data2 = [];
        for (let i = 0; i < diff_delete.length; i++) {
          for (let j = 0; j < this.userRoleListData.length; j++) {
            if (this.userRoleListData[j].role.name === diff_delete[i]) {
              data2.push(this.userRoleListData[j].id);
              break;
            }
          }
        }
        if (data2.length) {
          const { msg } = await doDelete({ ids: data2 });
          this.$baseMessage(msg, 'success');
        }
      },
      async save() {
        this.$refs['form'].validate(async valid => {
          if (valid) {
            await this.BulkRoleCreate();
            await this.Delete();
            this.$emit('edited');
            this.close();
          } else {
            return false;
          }
        });
      },
    },
  };
</script>
