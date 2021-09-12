<template>
  <div class="project-create">
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="330px" @close="close">
      <el-form ref="form" :model="form" :rules="rules" label-width="0px">
        <el-form-item prop="cover">
          <CoverImage :cover="form.cover" @uploaded="CoverUploaded"></CoverImage>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="项目名称（必须）"></el-input>
        </el-form-item>
        <el-form-item prop="project_template_id">
          <el-select
            v-model="form.project_template_id"
            :loading="loading"
            placeholder="请选择项目模板（必选）"
            style="width: 100%"
          >
            <el-option v-for="item in optionsTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="intro">
          <el-input v-model="form.intro" type="textarea" rows="2" autocomplete="off" placeholder="项目简介"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { doEdit, doCreate } from '@/api/projectManagement';
  import { getList } from '@/api/projectTemplateManagement';
  import CoverImage from '@/components/Cover-image';
  import store from '@/store';
  import mixins from '@/mixins';

  export default {
    name: 'ProjectCreate',
    components: {
      CoverImage,
    },
    mixins: [mixins],
    data() {
      return {
        loading: false,
        form: {
          id: '',
          cover: '',
          name: '',
          manager_id: store.getters['user/userInfo'].id,
          project_template_id: '',
          intro: '',
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入项目名称' },
            { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' },
          ],
          project_template_id: [{ required: true, trigger: 'blur', message: '请选择项目模板' }],
        },
        title: '',
        dialogFormVisible: false,
        optionsTemplate: [],
      };
    },
    methods: {
      async getList() {
        this.loading = true;
        const {
          data: { rows, count },
        } = await getList({ limit: 1000, offset: 0 });
        this.loading = false;
        this.optionsTemplate = rows;
      },
      async showCreate(row) {
        if (!row) {
          this.title = '添加项目';
        } else {
          this.title = '编辑项目';
          this.form = Object.assign({}, row);
        }
        this.dialogFormVisible = true;
        this.getList();
      },
      close() {
        this.$refs['form'].resetFields();
        this.form = this.$options.data().form;
        this.dialogFormVisible = false;
      },
      save() {
        this.$refs['form'].validate(async valid => {
          if (valid) {
            if (this.title === '添加项目') {
              // 如果封面为空，则随机一张
              if (this.form.cover === '') {
                this.form.cover = await this.getRandomImgPath();
              }
              const { msg } = await doCreate(this.form);
              this.$baseMessage(msg, 'success');
            } else {
              const { msg } = await doEdit(this.form);
              this.$baseMessage(msg, 'success');
            }
            this.$emit('fetchData');
            this.close();
          } else {
            return false;
          }
        });
      },
      CoverUploaded(url) {
        this.form.cover = url;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-create {
    ::v-deep .el-form {
      padding-right: 0 !important;
    }
    .wrap-review-cropper {
      width: 290px;
      height: 160px;
      overflow: hidden;
      border-radius: 10px;
      box-shadow: 0 0 4px #ccc;

      & img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
