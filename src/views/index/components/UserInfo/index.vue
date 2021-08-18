<template>
  <div class="user-info">
    <div class="wrap-user">
      <BImage class="user-avatar" :src="userInfo.avatar || ''" :width="64" :height="64" :borderRadius="64"></BImage>
      <div class="info">
        <div class="tip">{{ `${tip} ${userInfo.username}，祝你开心每一天！` }}</div>
        <div class="role">{{ userInfo.roles && userInfo.roles[0].name }}</div>
      </div>
    </div>
    <div class="wrap-project">
      项目总数
      <div class="count">{{ projectCount }}</div>
    </div>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import { mapState } from 'vuex';

  export default {
    name: 'UserInfo',
    components: {
      BImage,
    },
    props: {
      projectCount: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        tip: '',
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
    },
    created() {
      this.getTip();
    },
    methods: {
      getTip() {
        const time = new Date().getHours();
        if (time >= 0 && time < 5) {
          this.tip = '深夜了，注意身体哦，';
        } else if (time < 7) {
          this.tip = '清晨好，早起的鸟儿有虫吃，';
        } else if (time < 12) {
          this.tip = '上午好，';
        } else if (time < 19) {
          this.tip = '下午好，';
        } else if (time < 22) {
          this.tip = '晚上好，';
        } else if (time <= 23) {
          this.tip = '还在加班吗？辛苦了，';
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 120px;
    padding: 0 30px;
    background-color: #fff;
    margin-bottom: 20px;

    .wrap-user {
      display: flex;
      justify-content: space-between;

      .user-avatar {
        margin-right: 20px;
      }

      .info {
        color: $colorLight;
        line-height: 33px;

        .tip {
          font-size: 20px;
          color: $colorLight3;
        }

        .role {
        }
      }
    }

    .wrap-project {
      color: $colorLight;
      text-align: center;

      .count {
        font-size: 30px;
        color: $colorLight3;
        margin-top: 10px;
      }
    }
  }
</style>
