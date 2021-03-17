<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <div style="color: transparent;">占位符</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-form ref="form" :model="form" :rules="rules" class="login-form" label-position="left">
          <div class="title">
            hello !
          </div>
          <div class="title-tips">欢迎来到{{ title }}！</div>
          <el-form-item style="margin-top: 40px;" prop="username">
            <span class="svg-container svg-container-admin">
              <vab-icon :icon="['fas', 'user']" />
            </span>
            <el-input
              v-model.trim="form.username"
              v-focus
              placeholder="请输入用户名"
              tabindex="1"
              type="text"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <vab-icon :icon="['fas', 'lock']" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :type="passwordType"
              tabindex="2"
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin"
            />
            <span v-if="passwordType === 'password'" class="show-password" @click="handlePassword">
              <vab-icon :icon="['fas', 'eye-slash']"></vab-icon>
            </span>
            <span v-else class="show-password" @click="handlePassword">
              <vab-icon :icon="['fas', 'eye']"></vab-icon>
            </span>
          </el-form-item>
          <div class="wrap-login-btn">
            <el-button :loading="loading" class="login-btn" type="primary" @click="handleLogin">登录</el-button>
            <el-button :loading="loading" class="login-btn" type="primary" @click="handleLoginGithub">
              <span class="github-btn-text"><i class="iconfont icon-github-fill"></i> github授权登录</span>
            </el-button>
          </div>
          <router-link to="/register">
            <div style="margin-top: 20px;">注册</div>
          </router-link>
          <router-link to="/retrieve_password">
            <div style="margin-top: 20px;">找回密码</div>
          </router-link>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { isPassword } from '@/utils/validate';
  import qs from 'qs';
  import { github_auth_authorize_url, github_auth_client_id, github_auth_redirect_uri } from '@/config/settings';

  export default {
    name: 'Login',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus();
        },
      },
    },
    data() {
      const validateusername = (rule, value, callback) => {
        if ('' == value) {
          callback(new Error('用户名不能为空'));
        } else {
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (!isPassword(value)) {
          callback(new Error('密码不能少于6位'));
        } else {
          callback();
        }
      };
      return {
        nodeEnv: process.env.NODE_ENV,
        title: this.$baseTitle,
        form: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateusername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
      };
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/';
        },
        immediate: true,
      },
    },
    created() {
      // 如果存在code，则视为github登录状态
      let { code } = qs.parse(window.location.search?.replace(/^\?/, ''));
      if (code) {
        this.login({ code });
      }
    },
    mounted() {
      if ('production' !== process.env.NODE_ENV) {
        this.form.username = 'Imfdj';
        this.form.password = '123123';
      }
    },
    methods: {
      handlePassword() {
        this.passwordType === 'password' ? (this.passwordType = '') : (this.passwordType = 'password');
        this.$nextTick(() => {
          this.$refs.password.focus();
        });
      },
      async login(params) {
        this.loading = true;
        await this.$store.dispatch('user/login', params).catch(() => {
          this.loading = false;
        });
        const routerPath = this.redirect === '/404' || this.redirect === '/401' ? '/' : this.redirect;
        await this.$router.push(routerPath).catch(() => {});
        this.loading = false;
      },
      handleLogin() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.login(this.form);
          } else {
            return false;
          }
        });
      },
      handleLoginGithub() {
        window.location.href = `${github_auth_authorize_url}?client_id=${github_auth_client_id}&redirect_uri=${github_auth_redirect_uri}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background: url('~@/assets/login_images/background.jpg') center center fixed no-repeat;
    background-size: cover;

    .title {
      font-size: 54px;
      font-weight: 500;
      color: rgba(14, 18, 26, 1);
    }

    .title-tips {
      margin-top: 29px;
      font-size: 26px;
      font-weight: 400;
      color: rgba(14, 18, 26, 1);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .wrap-login-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .login-btn {
        display: inline-block;
        width: 220px;
        height: 60px;
        margin-top: 5px;
        border: 0;
        .github-btn-text {
          display: flex;
          align-items: center;
          justify-content: center;
          .iconfont {
            margin-right: 4px;
          }
        }

        &:hover {
          opacity: 0.9;
        }
      }
    }

    .login-form {
      position: relative;
      max-width: 100%;
      margin: calc((100vh - 425px) / 2) 10% 10%;
      overflow: hidden;

      .forget-password {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-pass {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    .svg-container {
      position: absolute;
      top: 14px;
      left: 15px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .show-password {
      position: absolute;
      top: 14px;
      right: 25px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 58px;
          padding-left: 45px;
          font-size: $base-font-size-default;
          line-height: 58px;
          color: $base-font-color;
          background: #f6f4fc;
          border: 0;
          caret-color: $base-font-color;
        }
      }
    }
  }
</style>
