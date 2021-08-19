<template>
  <div class="base-setting">
    <div class="wrap-form">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="ruleForm.username" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model.trim="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="ruleForm.email" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model.trim="ruleForm.company"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model.trim="ruleForm.city"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="!$checkPermission(userPermissions.doEdit)"
            type="primary"
            @click="submitForm('ruleForm')"
            >保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="wrap-photo" @click="showCropper">
      <img :src="ruleForm.avatar" alt="" />
      <i class="el-icon-plus wrap-photo-plus"></i>
    </div>
    <cropper ref="Cropper" dialogTitle="修改头像" @getCropBlob="getCropBlob"></cropper>
  </div>
</template>

<script>
  import Cropper from '@/components/Cropper';
  import { mapState } from 'vuex';
  import { upload } from '@/api/upload';
  import { doEdit, permissions as userPermissions } from '@/api/user';
  import { validatePhone } from '@/utils/validate-rule-el-form';

  export default {
    name: 'BaseSetting',
    components: {
      Cropper,
    },
    data() {
      return {
        userPermissions,
        ruleForm: {},
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          ],
          phone: [
            { required: false, trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' },
          ],
        },
        previews: '',
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
    },
    created() {
      this.ruleForm = Object.assign({}, this.userInfo);
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            const { msg } = await doEdit(this.ruleForm);
            this.$baseMessage(msg, 'success');
            this.$store.dispatch('user/getInfo');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      showCropper() {
        this.$refs.Cropper.show();
      },
      async getCropBlob(blob) {
        this.$refs.Cropper.hide();
        const formData = new FormData();
        formData.append('file', blob, 'data.jpg');
        const {
          data: { path },
        } = await upload(formData);
        this.ruleForm.avatar = path;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .base-setting {
    position: relative;
    height: 360px;

    .wrap-form {
      width: 60%;
    }

    .wrap-photo {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 180px;
      height: 180px;
      overflow: hidden;
      cursor: pointer;
      border-radius: 50%;
      box-shadow: 0 0 10px #ccc;

      & img {
        width: 100%;
        height: 100%;
      }

      .wrap-photo-plus {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 46px;
        color: #fff;
        opacity: 0;
        transition: 500ms;
        transform: translate(-50%, -50%);
      }
    }

    .wrap-photo:hover {
      .wrap-photo-plus {
        opacity: 1;
      }
    }
  }
</style>
