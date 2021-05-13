<template>
  <div class="project-edit">
    <el-dialog title="项目设置" :visible.sync="dialogVisible" width="660px" top="5vh" @close="close">
      <div class="wrap">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-s-data"></i> 概览</span>
            <div class="wrap-pane">
              <el-form ref="form" label-position="top" label-width="80px" :model="form" size="mini">
                <el-form-item label="项目封面">
                  <CoverImage :cover="form.cover" @uploaded="CoverUploaded"></CoverImage>
                </el-form-item>
                <div class="special">
                  <el-form-item label="项目名称">
                    <el-input v-model="form.name" style="width: 220px"></el-input>
                  </el-form-item>
                  <el-form-item label="项目进度 (%)">
                    <el-input v-model="form.progress" style="width: 220px"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="项目简介">
                  <el-input
                    v-model="form.intro"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    placeholder="介绍一下这个项目"
                  ></el-input>
                </el-form-item>
                <el-form-item label="项目公开性">
                  <el-select v-model="form.is_private" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in optionsPrivet" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="项目拥有者">
                  <div class="user-info">
                    <BImage
                      v-if="form.creator"
                      :src="form.creator.avatar"
                      :width="40"
                      :height="40"
                      :borderRadius="20"
                    ></BImage>
                    <span style="margin-left: 10px">{{ form.creator && form.creator.username }}</span>
                  </div>
                </el-form-item>
              </el-form>
              <div class="foot">
                <el-button type="primary" :disabled="!isManager" @click="save">确 定</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="el-icon-view"></i> 项目偏好</span>
            <div class="wrap-pane preference">
              <div class="top">
                <span>自动更新项目进度</span>
                <el-switch
                  v-model="switchValue"
                  active-color="#409EFF"
                  inactive-color="#909399"
                  :disabled="!isManager"
                  @change="switchChange"
                >
                </el-switch>
              </div>
              <div class="bottom"> 根据当前任务的完成情况自动计算项目进度。</div>
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="el-icon-more"></i> 更多</span>
            <div class="wrap-pane more">
              <div class="title">项目操作</div>
              <div class="tip color-light">您可以执行以下操作</div>
              <div class="wrap-btn">
                <el-button type="danger" plain :disabled="!isManager" @click="doPigeonhole">归档项目</el-button>
                <el-button type="danger" plain :disabled="isManager" @click="doQuit">退出</el-button>
                <el-button type="danger" :disabled="!isManager" @click="doRecycle">移至回收站</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { doDelete, doEdit } from '@/api/projectManagement';
  import { doQuit } from '@/api/userProjectManagement';
  import CoverImage from '@/components/Cover-image';
  import BImage from '@/components/B-image';
  import { mapState } from 'vuex';

  export default {
    name: 'ProjectEdit',
    components: {
      CoverImage,
      BImage,
    },
    props: {
      closeBehindSave: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        activeName: '0',
        switchValue: false,
        dialogVisible: false,
        form: {
          id: '',
          name: '',
          intro: '',
          progress: '',
          cover: '',
          is_private: '',
          manager_id: '',
          is_auto_progress: false,
        },
        optionsPrivet: [
          {
            value: 1,
            label: '私有项目（仅项目成员可查看和编辑）',
          },
          {
            value: 0,
            label: '公开项目（所有人都可通过链接访问，仅项目成员可编辑）',
          },
        ],
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
      isManager() {
        return this.userInfo.id === this.form.manager_id;
      },
    },
    methods: {
      showEdit(item) {
        this.form = Object.assign({}, item);
        this.activeName = '0';
        this.switchValue = this.form.is_auto_progress === 0 ? false : true;
        this.$nextTick(() => {
          this.dialogVisible = true;
        });
      },
      async save() {
        const { msg } = await doEdit(this.form);
        this.$baseMessage(msg, 'success');
        this.$emit('fetchData');
        if (this.closeBehindSave) {
          this.close();
        }
      },
      close() {
        this.$refs['form'].resetFields();
        this.form = this.$options.data().form;
        this.dialogVisible = false;
      },
      CoverUploaded(url) {
        this.form.cover = url;
      },
      switchChange() {
        this.form.is_auto_progress = this.switchValue ? 1 : 0;
        this.save();
      },
      async doPigeonhole() {
        this.$baseConfirm('你确定要归档此项目吗', null, async () => {
          this.form.is_archived = 1;
          await this.save();
          this.close();
        });
      },
      doQuit() {
        this.$baseConfirm('你确定要退出此项目吗', null, async () => {
          await doQuit({
            user_id: this.userInfo.id,
            project_id: this.form.id,
          });
          this.$baseNotify('', `已成功退出项目 ${this.form.name}`);
          this.close();
          this.$router.replace(this.$configSettings.project_list_path);
        });
      },
      async doRecycle() {
        this.$baseConfirm('你确定要将此项目移至回收站吗', null, async () => {
          this.form.is_recycle = 1;
          await this.save();
          this.close();
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-edit {
    .wrap-pane {
      height: 600px;
      padding: 0 10px;
      .special {
        display: flex;
        justify-content: space-between;
      }
      ::v-deep .el-form-item__label {
        padding-bottom: 0px;
      }
      .foot {
        text-align: right;
      }
      .user-info {
        display: flex;
        align-items: center;
      }
    }
    .preference {
      .top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
    }
    .more {
      .title {
        font-size: 16px;
        font-weight: 600;
        line-height: 30px;
      }
      .tip {
        line-height: 30px;
      }
      .wrap-btn {
        display: flex;
        justify-content: space-between;
        width: 260px;
        margin-top: 20px;
      }
    }
    ::v-deep .el-form {
      padding-right: 0 !important;
    }
  }
</style>
