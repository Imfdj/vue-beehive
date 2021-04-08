<template>
  <div class="task-file">
    <div class="title"><i class="iconfont icon-fujian1"></i>关联文件</div>
    <div class="btn-create-task-file" @click="uploadClick"><i class="el-icon-plus"></i>上传文件</div>
    <div v-if="fileListFilter.length" class="wrap-file-list">
      <div class="title-list">关联文件列表</div>
      <div class="file-list">
        <div v-for="item in fileListFilter" :key="item.id" class="item">
          <BImage class="user-avatar" :src="item.path || ''" :width="24" :height="24" :borderRadius="24"></BImage>
          <div class="title-file ellipsis">
            <span class="name">
              <a :href="item.path" target="_blank">{{ item.title }}</a>
            </span>
          </div>
          <span v-if="item.project" class="project-name ellipsis">{{ item.project.name }}</span>
          <el-popover placement="right" width="200" trigger="click" popper-class="btn-operation-list-popover">
            <div class="btn-operation-list">
              <div
                v-for="itemOperation in fileOperations"
                :key="itemOperation.id"
                class="btn-item"
                @click="fileOperationClick(item, itemOperation)"
              >
                <i class="btn-item-icon" :class="itemOperation.icon"></i>{{ itemOperation.name }}
              </div>
            </div>
            <i slot="reference" class="el-icon-arrow-down"></i>
          </el-popover>
        </div>
      </div>
    </div>
    <Upload ref="Upload" @success="uploadSuccess"></Upload>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import Upload from '@/components/Upload';
  import mixin from '@/mixins';
  import { getList, doCreate, doDelete } from '@/api/projectFileManagement';
  import { mapState } from 'vuex';
  import { isExternal } from '@/utils/validate';

  export default {
    name: 'TaskFile',
    components: {
      BImage,
      Upload,
    },
    mixins: [mixin],
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        fileList: [],
        fileOperations: [
          { id: 1, name: '复制链接', icon: 'iconfont icon-lianjie' },
          { id: 2, name: '下载', icon: 'iconfont icon-xiazai' },
          { id: 3, name: '取消关联', icon: 'iconfont icon-quxiaolianjie' },
        ],
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
      ...mapState('project', ['projectList']),
      fileListFilter() {
        return this.fileList.map(file => {
          this.projectList.forEach(project => {
            if (file.project_id === project.id) file.project = project;
          });
          return file;
        });
      },
    },
    watch: {
      'task.id'(newValue, oldValue) {
        this.getList();
      },
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'create:project_file': {
            const taskExisting = this.fileList.find(item => item.id === params.id);
            // 如果不存在，则添加
            if (!taskExisting) {
              this.fileList?.push(params);
              this.fileList = this.$baseLodash.sortBy(this.fileList, item => item.id);
            }
            break;
          }
          case 'delete:project_file':
            this.fileList = this.fileList.filter(item => item.id !== params.id);
            break;
          default:
            break;
        }
      },
    },
    methods: {
      async getList() {
        const {
          data: { rows },
        } = await getList({
          task_id: this.task.id,
        });
        this.fileList = rows;
      },
      async doCreate(fileData) {
        await doCreate({
          title: fileData.filename?.replace(fileData.extension, ''),
          project_id: this.task.project_id,
          task_id: this.task.id,
          creator_id: this.userInfo.id,
          ...fileData,
        });
        this.$baseNotify('', '上传成功');
      },
      async doDelete(ids) {
        await doDelete({ ids });
      },
      uploadClick() {
        this.$refs.Upload.uploadStart();
      },
      fileOperationClick(item, itemOperation) {
        switch (itemOperation.id) {
          case 1:
            this.doCopy(isExternal(item.path) ? item.path : `${window.location.origin}${item.path}`);
            this.$baseNotify('粘贴到其他对象评论框里即可进行快速关联', '复制链接成功');
            break;
          case 2:
            this.multiDownload(item);
            break;
          case 3:
            this.$baseConfirm('你确定要删除吗', null, async () => {
              this.doDelete([item.id]);
              this.$baseNotify('', '删除成功');
            });
            break;
          default:
            break;
        }
      },
      async uploadSuccess(data) {
        await this.doCreate(data);
      },
    },
  };
</script>

<style lang="scss">
  @import 'src/styles/custom.scss';
  .btn-operation-list-popover {
    .btn-operation-list {
      .btn-item {
        line-height: 34px;
        margin-bottom: 2px;
        cursor: pointer;
        border-radius: 6px;
        .btn-item-icon {
          padding: 0 10px;
        }
      }
      .btn-item:hover {
        background-color: $colorF7;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import 'src/styles/custom.scss';
  .task-file {
    .title {
      margin-bottom: 20px;
      line-height: 28px;
    }
    .btn-create-task-file {
      padding: 10px;
      color: #1890ff;
      border: 1px solid $colorE5;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 10px;
      .el-icon-plus {
        margin-right: 10px;
      }
    }
    .btn-create-task-file:hover {
      color: #1890ff;
    }
    .wrap-file-list {
      border: 1px solid $colorE5;
      border-radius: 6px;
      padding: 0px 10px 10px 10px;
      margin-bottom: 20px;
      .title-list {
        line-height: 40px;
      }
      .file-list {
        .item {
          display: flex;
          align-items: center;
          height: 30px;
          padding: 5px;
          border-radius: 6px;
          margin-bottom: 5px;
          .user-avatar {
            margin-right: 10px;
          }
          .title-file {
            flex: 1;
            .name {
              cursor: pointer;
            }
            & a {
              color: $colorLight;
            }
            & a:hover {
              color: #1b9aee;
            }
          }
          .project-name {
            width: 160px;
            text-align: right;
            padding-right: 10px;
            border-right: 1px solid $colorE5;
            margin-right: 5px;
          }
          .el-icon-arrow-down {
            padding: 4px;
            cursor: pointer;
          }
          .el-icon-arrow-down:hover {
            color: #1b9aee;
          }
        }
        .item:hover {
          background-color: $colorF5;
        }
      }
    }
  }
</style>
