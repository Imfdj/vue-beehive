<template>
  <el-form ref="registerForm" :model="form" class="register-form" :rules="registerRules" size="mini">
    <el-form-item prop="username">
      <el-input
        v-model.trim="form.username"
        v-focus
        style="margin-top: 20px"
        type="text"
        placeholder="请输入用户名"
        auto-complete="off"
      >
        <i slot="prefix" class="iconfont icon-ren"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model.trim="form.email" type="text" placeholder="请输入邮箱" show-word-limit autocomplete="off">
        <i slot="prefix" class="iconfont icon-youxiang"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code" style="position: relative">
      <el-input v-model.trim="form.code" type="text" placeholder="验证码">
        <i slot="prefix" class="iconfont icon-yanzhengma"></i>
      </el-input>
      <el-button type="primary" class="show-pwd phone-code" :disabled="isGetphone" @click="getPhoneCode">
        {{ codeButtonText }}
      </el-button>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model.trim="form.password"
        type="password"
        placeholder="设置密码"
        autocomplete="new-password"
        show-password
      >
        <i slot="prefix" class="iconfont icon-suo"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="passwordConfirm">
      <el-input
        v-model.trim="form.passwordConfirm"
        type="password"
        placeholder="确认密码"
        autocomplete="new-password"
        show-password
      >
        <i slot="prefix" class="iconfont icon-suo"></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" class="btn-special" type="primary" @click.native.prevent="handleReister"
        >注册</el-button
      >
      <div v-show="!loading" class="router-link-box">
        <span @click="changeStatus('login')">登录</span>
      </div>
    </el-form-item>
  </el-form>
</template>
<script>
  import { isPassword, isEmail } from '@/utils/validate';
  import { register, getExistsUserUniqueFields } from '@/api/user';
  import { create as createVerificationCode } from '@/api/verification_code';
  import mixins from '@/mixins';

  export default {
    username: 'RegisterForm',
    mixins: [mixins],
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus();
        },
      },
    },
    data() {
      const validateusername = async (rule, value, callback) => {
        const { code } = await getExistsUserUniqueFields({
          username: value,
        });
        if (code === 0) {
          callback(new Error('用户名已存在'));
        } else {
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (/^(?=.*[a-zA-Z])(?=.*\d)[^]{6,15}$/.test(value)) {
          callback();
        } else {
          callback(new Error('密码必须是字母和数字的组合'));
        }
      };
      const validatePasswordConfirm = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('确认密码与设置密码不同，请重新输入'));
        } else {
          callback();
        }
      };
      const validateEmail = async (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('请输入正确的邮箱'));
        } else {
          const { code } = await getExistsUserUniqueFields({
            email: value,
          });
          if (code === 0) {
            callback(new Error('邮箱已存在'));
          } else {
            callback();
          }
        }
      };
      return {
        isGetphone: false,
        getPhoneIntval: null,
        codeButtonText: '获取验证码',
        showRegister: false,
        nodeEnv: process.env.NODE_ENV,
        title: this.$baseTitle,
        form: {},
        registerRules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
            { min: 2, max: 20, trigger: 'blur', message: '长度在 2 到 20 个字符' },
            { validator: validateusername, trigger: 'blur' },
          ],
          email: [
            { required: true, trigger: 'blur', message: '请输入邮箱' },
            { validator: validateEmail, trigger: 'blur' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
            { min: 6, max: 15, trigger: 'blur', message: '长度在 6 到 15 个字符' },
            { validator: validatePassword, trigger: 'blur' },
          ],
          passwordConfirm: [
            { required: true, trigger: 'blur', message: '请输入确认密码' },
            { validator: validatePasswordConfirm, trigger: 'blur' },
          ],
          code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        },
        loading: false,
        passwordType: 'password',
      };
    },
    created() {},
    mounted() {},
    beforeDestroy() {
      this.getPhoneIntval = null;
      clearInterval(this.getPhoneIntval);
    },
    methods: {
      async getPhoneCode() {
        this.$refs['registerForm'].validateField('username', async errorMessage => {
          if (errorMessage) {
            return;
          }
          this.$refs['registerForm'].validateField('email', async errorMessage => {
            if (!errorMessage) {
              this.isGetphone = true;
              let n = 30;
              this.getPhoneIntval = setInterval(() => {
                if (n > 0) {
                  n--;
                  this.codeButtonText = '重新获取(' + n + 's)';
                } else {
                  this.getPhoneIntval = null;
                  clearInterval(this.getPhoneIntval);
                  this.codeButtonText = '获取验证码';
                  this.isGetphone = false;
                }
              }, 1000);
              const { code } = await createVerificationCode({
                target: this.form.email,
                type: 1,
              });
              if (code === 0) {
                this.$baseNotify('', `验证码发送到${this.form.email}, 请查收！`);
              }
            }
          });
        });
      },
      handleReister() {
        this.$refs['registerForm'].validate(async valid => {
          if (valid) {
            this.loading = true;
            this.form.avatar = await this.getRandomPicsumPicturePath('https://picsum.photos/100');
            await register({ ...this.form, verification_type: 1 });
            this.$baseNotify('', '账号已创建成功');
            // 注册成功后，直接登陆
            await this.$store.dispatch('user/login', {
              username: this.form.username,
              password: this.form.password,
            });
            await this.$router.push('/').catch(() => {});
          }
        });
      },
      changeStatus(status) {
        this.$emit('changeStatus', status);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .register-form {
    position: relative;
    max-width: 100%;
    margin: calc((100vh - 499px) / 2) 10% 10%;
    overflow: hidden;

    .phone-code {
      width: 120px;
      height: 36px;
      font-size: 14px;
      color: #fff;
      border-radius: 3px;
    }

    .router-link-box {
      margin-top: 20px;
      & span {
        cursor: pointer;
        color: #000;
      }
    }

    .btn-special {
      display: inherit;
      width: 220px;
      height: 60px;
      margin-top: 5px;
      border: 0;

      &:hover {
        opacity: 0.9;
      }
    }

    ::v-deep {
      .el-button {
        background-color: $color-lucency-btn-bgc;
        color: #000 !important;
      }
    }

    .show-pwd {
      position: absolute;
      top: 14px;
      right: 25px;
      font-size: 16px;
      color: $base-font-color;
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

        .el-input__count {
          .el-input__count-inner {
            background: transparent;
          }
        }

        .el-input__prefix {
          left: 15px;
          line-height: 56px;

          .svg-inline--fa {
            width: 20px;
          }
        }

        input {
          height: 58px;
          padding-left: 45px;
          font-size: $base-font-size-default;
          line-height: 58px;
          color: $base-font-color;
          background: $color-lucency-input-bgc;
          border: 0;
          caret-color: $base-font-color;
        }
      }
    }
  }
</style>
