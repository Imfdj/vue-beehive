<template>
  <el-dialog
    :visible.sync="dialogVisible"
    custom-class="user-info-dialog"
    append-to-body
    width="460px"
    :before-close="handleClose"
  >
    <template slot="title">
      <div class="title-dialog">{{ user.username }}详细信息</div>
    </template>
    <div v-loading="loading" class="content">
      <div class="wrap-user">
        <BImage class="user-avatar" :src="user.avatar || ''" :width="64" :height="64" :borderRadius="64"></BImage>
        <div class="username">{{ user.username }}</div>
      </div>
      <div class="wrap-info">
        <div class="tip">
          <i class="el-icon-suitcase"></i> 工作信息
          <div class="line"></div>
        </div>
        <div class="item-info">
          <div class="title">昵称</div>
          <div class="value">{{ user.nickname || '-' }}</div>
        </div>
        <div class="item-info">
          <div class="title">职位</div>
          <div class="value">{{ user.position || '-' }}</div>
        </div>
        <div class="item-info">
          <div class="title">邮箱</div>
          <div class="value">{{ user.email || '-' }}</div>
        </div>
        <div class="item-info">
          <div class="title">手机</div>
          <div class="value">{{ user.phone || '-' }}</div>
        </div>
        <div class="item-info">
          <div class="title">部门</div>
          <div class="value">{{ (user.department && user.department.name) || '-' }}</div>
        </div>
        <div class="item-info">
          <div class="title">城市</div>
          <div class="value">{{ user.city || '-' }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import BImage from '@/components/B-image';
  import { getOne } from '@/api/user';

  export default {
    name: 'UserInfoDialog',
    components: {
      BImage,
    },
    data() {
      return {
        dialogVisible: false,
        loading: false,
        user: {},
      };
    },
    methods: {
      handleClose(done) {
        this.user = this.$options.data().user;
        done();
      },
      show(userId) {
        this.getOne(userId);
        this.dialogVisible = true;
      },
      async getOne(id) {
        this.loading = true;
        const { data } = await getOne({ id });
        this.user = data;
        this.loading = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .user-info-dialog {
    .title-dialog {
      text-align: center;
      font-size: 16px;
      font-weight: 600;
    }
    .content {
      font-size: 14px;
      color: $colorLight;
      .wrap-user {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .user-avatar {
          margin-top: 10px;
        }
        .username {
          line-height: 80px;
          font-size: 16px;
          color: $colorLight3;
        }
      }
      .wrap-info {
        .tip {
          display: flex;
          align-items: center;
          height: 20px;
          margin-bottom: 20px;
          .el-icon-suitcase {
            margin-right: 10px;
            font-size: 16px;
          }
          .line {
            flex: 1;
            height: 1px;
            background-color: $colorE8;
            margin-left: 10px;
          }
        }
        .item-info {
          display: flex;
          line-height: 50px;
          .title {
            width: 80px;
          }
          .value {
            color: $colorLight3;
          }
        }
      }
    }
  }
</style>
