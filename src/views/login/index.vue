<template>
  <div class="login-container">
    <ShapeShifter ref="ShapeShifter"></ShapeShifter>
    <div class="content">
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
          <div style="color: transparent">占位符</div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" @click.stop="">
          <LoginForm v-show="status === 'login'" @changeStatus="changeStatus"></LoginForm>
          <RegisterForm v-show="status === 'register'" @changeStatus="changeStatus"></RegisterForm>
          <RetrievePasswordForm
            v-show="status === 'retrievePassword'"
            @changeStatus="changeStatus"
          ></RetrievePasswordForm>
        </el-col>
      </el-row>
    </div>
    <div class="info-footer">
      <GithubPath></GithubPath>
      <div class="info-beian"> <i class="iconfont icon-copyright2"></i> 2021 Beehive | 粤ICP备19028126号-1 </div>
    </div>
  </div>
</template>

<script>
  import { title } from '@/config/settings';
  import ShapeShifter from '@/components/ShapeShifter';
  import GithubPath from '@/components/GithubPath';
  import LoginForm from './components/LoginForm';
  import RegisterForm from './components/RegisterForm';
  import RetrievePasswordForm from './components/RetrievePasswordForm';
  import qs from 'qs';

  export default {
    name: 'Login',
    components: {
      ShapeShifter,
      GithubPath,
      LoginForm,
      RegisterForm,
      RetrievePasswordForm,
    },
    data() {
      return {
        simulateArr: [],
        simulateIndex: 0,
        status: 'login',
        timerInter: null,
      };
    },
    computed: {
      logoTitle() {
        return title.charAt(0).toUpperCase() + title.slice(1);
      },
    },
    created() {
      this.simulateArr = ['#icon logo', this.logoTitle, ''];
    },
    mounted() {
      // 如果路由中带有code参数则认为是github登录中，显示github Icon
      let { code } = qs.parse(window.location.search?.replace(/^\?/, ''));
      if (code) {
        this.$refs.ShapeShifter.simulate('#icon github');
      } else {
        this.$refs.ShapeShifter.simulate(this.simulateArr[this.simulateIndex]);
        this.simulateIndex = (this.simulateIndex + 1) % 3;
      }
      this.initTimer();
      // 当页面不可见时，清空定时器
      document.addEventListener('visibilitychange', () => {
        // 页面变为不可见时触发
        if (document.visibilityState == 'hidden') {
          this.clearTimer();
        }
        // 页面变为可见时触发
        if (document.visibilityState == 'visible') {
          this.initTimer();
        }
      });
    },
    methods: {
      clickHandler() {
        this.$refs.ShapeShifter.simulate(this.simulateArr[this.simulateIndex]);
        this.simulateIndex = (this.simulateIndex + 1) % 3;
      },
      changeStatus(status) {
        this.status = status;
      },
      initTimer() {
        this.clearTimer();
        this.timerInter = setInterval(() => {
          this.clickHandler();
        }, 1000 * 10);
      },
      clearTimer() {
        if (this.timerInter) {
          clearInterval(this.timerInter);
        }
      },
    },
    destroyed() {
      this.clearTimer();
    },
  };
</script>

<style lang="scss" scoped>
  .login-container {
    position: relative;
    height: 100vh;
    background: -webkit-linear-gradient(top, #fff6f2 0, #fbdd9f 120%);

    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
    }
    .info-footer {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      line-height: 14px;
      height: 60px;
      .iconfont {
        margin-right: 3px;
      }
      .info-beian {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
