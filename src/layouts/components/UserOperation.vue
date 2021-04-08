<template>
  <el-popover placement="top-start" title="" width="150" trigger="hover" popper-class="user-popover" :open-delay="200">
    <div class="options">
      <div class="item" @click="goToUserSetting"><i class="iconfont icon-ren"></i>个人设置</div>
      <div class="item" @click="quit"><i class="el-icon-switch-button"></i>退出登录</div>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>

<script>
  import { recordRoute } from '@/config/settings';

  export default {
    name: 'UserOperation',
    methods: {
      goToUserSetting() {
        this.$router.push({
          name: 'PersonalCenter',
        });
      },
      quit() {
        this.$baseConfirm('您确定要退出' + this.$baseTitle + '吗?', null, async () => {
          await this.$store.dispatch('user/logout');
          if (recordRoute) {
            const fullPath = this.$route.fullPath;
            this.$router.push(`/login?redirect=${fullPath}`);
          } else {
            this.$router.push('/login');
          }
        });
      },
    },
  };
</script>

<style lang="scss">
  @import 'src/styles/custom';
  .user-popover {
    padding: 4px 0 !important;
    .options {
      .item {
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: 36px;
        cursor: pointer;
        & i {
          margin-right: 5px;
          font-size: 14px;
          font-weight: 600;
        }
        .el-icon-switch-button {
          color: $colorDanger;
        }
        &:hover {
          background-color: #e6f7ff;
        }
      }
    }
  }
</style>
