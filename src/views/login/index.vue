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
  </div>
</template>

<script>
  import { title } from '@/config/settings';
  import ShapeShifter from '@/components/ShapeShifter';
  import LoginForm from './components/LoginForm';
  import RegisterForm from './components/RegisterForm';
  import RetrievePasswordForm from './components/RetrievePasswordForm';
  import qs from 'qs';

  export default {
    name: 'Login',
    components: {
      ShapeShifter,
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
  }
</style>
