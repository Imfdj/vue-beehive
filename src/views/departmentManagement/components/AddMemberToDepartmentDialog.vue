<template>
  <div class="add-member-to-department-dialog">
    <el-dialog title="添加成员至部门" :visible.sync="dialogVisible" width="400px">
      <div class="wrap-content">
        <el-input
          v-model="keyword"
          placeholder="请输入用户名或邮箱查找"
          prefix-icon="el-icon-search"
          @keyup.enter.native="getUserList"
        ></el-input>
        <div class="user-list">
          <div v-for="(item, index) in userList" :key="index" class="wrap-list-item">
            <img class="user-avatar" :src="item.avatar" alt="" />
            <div class="user-info">
              <div class="user-name">{{ item.username }}</div>
              <div class="foot color-light">
                <div class="user-emial">{{ item.email }}</div>
              </div>
            </div>
            <div class="wrap-ctrl color-light">
              <el-button v-if="departmentData.id !== item.department_id" size="mini" plain @click="addDepartment(item)">
                <i class="iconfont icon-jiaren"></i> 添加
              </el-button>
              <span v-else><i class="iconfont icon-ren" style="margin-right: 5px;"></i>已添加</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList } from '@/api/userManagement';
  import { updateUserDepartment } from '@/api/departmentManagement';

  export default {
    name: 'AddMemberToDepartmentDialog',
    props: {
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
        keyword: '',
        userData: [],
      };
    },
    computed: {
      userList() {
        return (
          this.userData.rows &&
          this.userData.rows.filter(e => {
            return e.department_id === 0;
          })
        );
      },
    },
    watch: {
      dialogVisible(newValue, oldValue) {
        if (newValue) {
          this.getUserList();
        }
      },
    },
    created() {
      this.getUserList();
    },
    methods: {
      async getUserList() {
        const { data } = await getList({
          keyword: this.keyword,
        });
        this.userData = data;
        console.log(data);
      },
      async addUserToDepartment(body) {
        const { data } = await updateUserDepartment(body);
        this.$message.success('添加成功');
        this.getUserList();
        this.$emit('addUserToDepartmentSuccess');
      },
      addDepartment(user) {
        this.addUserToDepartment({
          id: user.id,
          department_id: this.departmentData.id,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .add-member-to-department-dialog {
    .wrap-content {
      .user-list {
        min-height: 300px;
        padding-top: 10px;
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
            width: 64px;
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
  }
</style>
