<template>
  <div class="project-create">
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="330px" @close="close">
      <el-form ref="form" :model="form" :rules="rules" label-width="0px">
        <el-form-item prop="cover" class="cover-item">
          <div class="upload-img">
            <div v-if="form.cover" class="img-cover" @click="uploadCoverClick">
              <BImage :src="form.cover" :width="290" :height="160"></BImage>
            </div>
            <div v-else class="btn-upload-img" @click="uploadCoverClick"><i class="el-icon-plus"></i>添加封面</div>
          </div>
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
    <cropper
      ref="Cropper"
      dialogWidth="800px"
      :autoCropWidth="290"
      :autoCropHeight="160"
      @realTime="realTime"
      @getCropBlob="getCropBlob"
    >
      <div class="wrap-review-cropper">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </cropper>
  </div>
</template>

<script>
  import { doEdit, doCreate } from '@/api/projectManagement';
  import { getList } from '@/api/projectTemplateManagement';
  import Cropper from '@/components/Cropper';
  import BImage from '@/components/B-image';
  import { upload } from '@/api/upload';
  import store from '@/store';
  import mixins from '@/mixins';

  export default {
    name: 'ProjectCreate',
    components: {
      Cropper,
      BImage,
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
        previews: {},
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
      async getCropBlob(blob) {
        this.$refs.Cropper.hide();
        const formData = new FormData();
        formData.append('file', blob, 'data.jpg');
        const {
          data: { path },
        } = await upload(formData);
        this.form.cover = path;
      },
      realTime(data) {
        this.previews = data;
      },
      uploadCoverClick() {
        this.$refs.Cropper.show();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-create {
    ::v-deep .el-form {
      padding-right: 0 !important;
    }
    .cover-item {
      .upload-img {
        position: relative;
        width: 100%;
        height: 160px;
        .img-cover {
          position: relative;
          object-fit: contain;
          cursor: pointer;
        }
        .img-cover:after {
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          width: 100%;
          height: 160px;
          background-color: rgba(0, 0, 0, 0.3);
          content: '';
          z-index: 333;
          transition: opacity 0.2s;
          opacity: 0;
        }
        .img-cover:hover:after {
          opacity: 1;
        }
        .btn-upload-img {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 160px;
          border: 1px dotted #ccc;
          border-radius: 12px;
          cursor: pointer;
          .el-icon-plus {
            font-size: 30px;
          }
        }
        .btn-upload-img:hover {
          color: #000;
        }
      }
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
