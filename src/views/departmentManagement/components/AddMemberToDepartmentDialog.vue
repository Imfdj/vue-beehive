<template>
  <div class="add-member-to-department-dialog">
    <el-dialog title="添加成员至部门" :visible.sync="dialogVisible" width="400px">
      <div class="wrap-content">
        <el-input
          v-model="keyword"
          placeholder="请输入用户名或邮箱查找"
          prefix-icon="el-icon-search"
          @keyup.native="keywordChange"
        ></el-input>
        <div class="user-list">
          <div v-for="(item, index) in userData.rows" :key="index" class="wrap-list-item">
            <BImage class="user-avatar" :src="item.avatar || ''" :width="32" :height="32" :borderRadius="32"></BImage>
            <div class="user-info">
              <div class="user-name">{{ item.username }}</div>
              <div class="foot color-light">
                <div class="user-emial">{{ item.email }}</div>
              </div>
            </div>
            <div class="wrap-ctrl color-light">
              <el-button
                v-if="departmentData.id !== item.department_id"
                size="mini"
                plain
                :disabled="!$checkPermission(userPermissions.updateUserDepartment)"
                @click="addDepartment(item)"
              >
                <i class="iconfont icon-jiaren"></i> 添加
              </el-button>
              <span v-else><i class="iconfont icon-ren" style="margin-right: 5px"></i>已添加</span>
            </div>
          </div>
        </div>
        <div v-if="userData.count > pageSize" class="wrap-pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="userData.count"
            :current-page="pageNo"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList, updateUserDepartment, permissions as userPermissions } from '@/api/user';
  import { permissions as departmentPermissions } from '@/api/departmentManagement';
  import { waitTimeout } from '@/utils';
  import BImage from '@/components/B-image';

  export default {
    name: 'AddMemberToDepartmentDialog',
    components: {
      BImage,
    },
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
        userPermissions,
        departmentPermissions,
        dialogVisible: false,
        keyword: '',
        userData: [],
        pageNo: 1,
        pageSize: 6,
      };
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
      show() {
        this.dialogVisible = true;
      },
      keywordChange() {
        this.pageNo = 1;
        waitTimeout(300, this.getUserList);
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getUserList();
      },
      async getUserList() {
        // 检查资源权限
        if (!this.$checkPermission(this.userPermissions.getList)) {
          return;
        }
        const { data } = await getList({
          keyword: this.keyword,
          limit: this.pageSize,
          department_id: 0,
          offset: (this.pageNo - 1) * this.pageSize,
        });
        this.userData = data;
      },
      async addUserToDepartment(body) {
        const { data } = await updateUserDepartment(body);
        this.$message.success('添加成功');
        this.pageNo = 1;
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
    ::v-deep .el-dialog__body {
      padding: 10px 20px;
    }
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
