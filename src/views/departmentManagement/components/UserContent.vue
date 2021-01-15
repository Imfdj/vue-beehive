<template>
  <div class="user-content">
    <div class="wrap-content-head">
      <div class="title-content"
        >{{ isDepartment ? departmentData.name : memberData.title }}.
        {{ userData.rows && userData.rows.length }}
      </div>
      <div v-if="isDepartment" class="wrap-ctrl">
        <btn-icon
          v-for="(item, index) in departmentOperationBtns"
          :key="index"
          :iconClass="`iconfont ${item.icon}`"
          @click.native="departmentOperationBtnClick(index)"
        >
          {{ item.label }}
        </btn-icon>
      </div>
    </div>
    <div class="wrap-list">
      <div v-for="(item, index) in userData.rows" :key="index" class="wrap-list-item">
        <img class="user-avatar" :src="item.avatar" alt="" />
        <div class="user-info">
          <div class="user-name">{{ item.username }}</div>
          <div class="foot color-light">
            <div class="user-emial">{{ item.email }}</div>
            <div class="user-deportment">综合部</div>
          </div>
        </div>
        <div v-if="isDepartment" class="wrap-ctrl color-light">
          <el-popconfirm v-if="item.state === 1" title="确定禁用此用户吗？" @onConfirm="forbiddenUser(item)">
            <i slot="reference" class="iconfont icon-icon-test"></i>
          </el-popconfirm>
          <el-popconfirm v-else title="确定启用此用户吗？" @onConfirm="enableUser(item)">
            <i slot="reference" class="iconfont icon-qiyong1" style="color: #409eff;"></i>
          </el-popconfirm>

          <span class="line"></span>
          <i class="iconfont icon-ren-jianshao" @click="removeUserFromDepartment(item)"></i>
        </div>
      </div>
    </div>
    <AddMemberToDepartmentDialog
      ref="AddMemberToDepartmentDialog"
      :departmentData="departmentData"
      @addUserToDepartmentSuccess="getUserList"
    ></AddMemberToDepartmentDialog>
    <DepartmentOperation
      ref="DepartmentOperation"
      :isCreateDepartment="isCreateDepartment"
      :departmentData="departmentData"
      @doCreateDepartmentSuccess="doCreateDepartmentSuccess"
    ></DepartmentOperation>
  </div>
</template>

<script>
  import BtnIcon from '@/components/Btn-icon';
  import AddMemberToDepartmentDialog from './AddMemberToDepartmentDialog';
  import DepartmentOperation from './DepartmentOperation';
  import { getList } from '@/api/userManagement';
  import { updateUserDepartment, doDelete } from '@/api/departmentManagement';
  import { doEdit } from '@/api/userManagement';

  export default {
    name: 'UserContent',
    components: {
      BtnIcon,
      AddMemberToDepartmentDialog,
      DepartmentOperation,
    },
    props: {
      isDepartment: {
        type: Boolean,
        default: false,
      },
      departmentData: {
        type: Object,
        required: false,
        default: () => {
          return {};
        },
      },
      memberData: {
        type: Object,
        required: false,
        default: () => {
          return {};
        },
      },
    },
    data() {
      return {
        userData: {},
        isCreateDepartment: false,
        departmentOperationBtns: [
          {
            icon: 'icon-jiaren',
            label: '添加成员',
          },
          {
            icon: 'icon-jia',
            label: '创建部门',
          },
          {
            icon: 'icon-bianji',
            label: '编辑部门',
          },
          {
            icon: 'icon-dustbin_icon',
            label: '删除部门',
          },
        ],
      };
    },
    computed: {
      department_id() {
        if (this.memberData.id === 2) {
          return 0;
        }
        return this.departmentData.id;
      },
    },
    created() {
      this.getUserList();
    },
    methods: {
      async getUserList() {
        const { data } = await getList({
          department_id: this.department_id,
          state: this.memberData.id === 3 ? 0 : null,
        });
        this.userData = data;
        console.log(data);
      },
      departmentOperationBtnClick(index) {
        switch (index) {
          case 0:
            this.$refs.AddMemberToDepartmentDialog.dialogVisible = true;
            break;
          case 1:
            this.isCreateDepartment = true;
            this.$refs.DepartmentOperation.dialogVisible = true;
            break;
          case 2:
            this.isCreateDepartment = false;
            this.$refs.DepartmentOperation.dialogVisible = true;
            break;
          case 3:
            break;
          default:
            break;
        }
      },
      async removeUserFromDepartment(user) {
        const { data } = await updateUserDepartment({
          id: user.id,
          department_id: 0,
        });
        this.getUserList();
        this.$message.success('移除成功');
      },
      async forbiddenUser(user) {
        console.log(123412);
        console.log(123412);
        console.log(123412);
        const { data } = await doEdit({
          id: user.id,
          state: 0,
        });
        this.getUserList();
        this.$message.success('禁用成功');
      },
      async enableUser(user) {
        const { data } = await doEdit({
          id: user.id,
          state: 1,
        });
        this.getUserList();
        this.$message.success('启用成功');
      },
      doCreateDepartmentSuccess() {
        this.$emit('doCreateDepartmentSuccess');
      },
      async doDelete() {
        await doDelete({ ids: [this.departmentData.id] });
        this.$emit('doDeleteDepartmentSuccess');
        this.$message.success('删除成功');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .user-content {
    .wrap-content-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
      line-height: 30px;
      .title-content {
        font-size: 18px;
        color: rgb(51, 51, 51);
      }
      .wrap-ctrl {
        .btn-icon {
          margin-left: 10px;
        }
        ::v-deep .el-button--small {
          font-size: 14px;
        }
      }
    }
    .wrap-list {
      .wrap-list-item {
        display: flex;
        padding: 12px 0px;
        border-top: 1px solid #e8e8e8;
        .user-avatar {
          width: 32px;
          height: 32px;
          margin-right: 15px;
          border-radius: 50%;
        }
        .user-info {
          flex: 1;
          line-height: 22px;
          .foot {
            display: flex;
            .user-emial {
              margin-right: 10px;
            }
          }
        }
        .wrap-ctrl {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 54px;
          .line {
            width: 1px;
            height: 14px;
            background-color: #ccc;
          }
          & i {
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
