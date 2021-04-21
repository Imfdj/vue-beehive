<template>
  <div class="project-invite">
    <div class="wrap-content">
      <div class="app-name">beehive</div>
      <img class="new-message" src="../../assets/imgs/invite/new-message.png" alt="" />
      <div class="wrap-ctrl">
        <img
          class="user-avatar"
          src="https://beta.vilson.xyz/static/upload//20210121/42fc9179fe612b03cc19dbddd51febd8.jpg"
          alt=""
        />
        <div class="text">Imfdj <span class="color-light">邀请你加入项目</span></div>
        <div class="project-name">项目管理</div>
        <el-button type="primary" size="medium" style="width: 100%; border-radius: 12px">立刻加入</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins';

  export default {
    name: 'ProjectInvite',
    components: {},
    mixins: [mixin],
    data() {
      return {};
    },
    created() {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .project-invite {
    position: relative;
    display: flex;
    justify-content: center;
    .wrap-content {
      width: 476px;
      padding: 25px;
      margin-top: 30px;
      height: calc(100vh - 210px);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(38, 38, 38, 0.12);
      background-color: #fff;
      text-align: center;
      .app-name {
        font-size: 26px;
        text-align: center;
        color: #939393;
      }
      .new-message {
        margin-top: 60px;
        height: 43%;
      }
      .wrap-ctrl {
        position: absolute;
        bottom: 28px;
        width: 476px;
        .user-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
        }
        .text {
          line-height: 30px;
        }
        .project-name {
          color: #262626;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 15px;
          width: 100%;
        }
      }
    }
  }
</style>
