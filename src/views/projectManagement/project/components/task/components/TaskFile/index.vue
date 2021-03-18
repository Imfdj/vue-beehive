<template>
  <div class="task-file">
    <div class="title"><i class="iconfont icon-fujian1"></i>关联文件</div>
    <div class="btn-create-task-file" @click="uploadClick">
      <i class="el-icon-plus"></i>上传文件
      <input v-show="false" ref="inputFile" type="file" @change="inputChange" />
    </div>
    <div v-if="fileListFilter.length" class="wrap-file-list">
      <div class="title-list">关联文件列表</div>
      <div class="file-list">
        <div v-for="item in fileListFilter" :key="item.id" class="item">
          <BImage
            class="user-avatar"
            :src="`/${remote_public_prefix}${item.path}` || ''"
            :width="24"
            :height="24"
            :borderRadius="24"
          ></BImage>
          <div class="title-file ellipsis">
            <span class="name">
              <a :href="`/${remote_public_prefix}${item.path}`" target="_blank">{{ item.title }}</a>
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
    <div id="copyBox" class="copy"></div>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import { getList, doCreate, doDelete } from '@/api/projectFileManagement';
  import { upload } from '@/api/upload';
  import { mapState } from 'vuex';
  import { remote_public_prefix } from '@/config/settings';
  import multiDownload from 'multi-download';

  export default {
    name: 'TaskFile',
    components: {
      BImage,
    },
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        remote_public_prefix,
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
          case 'create:project_file':
            const taskExisting = this.fileList.find(task => task.id === params.id);
            // 如果不存在，则添加
            if (!taskExisting) {
              this.fileList?.push(params);
              this.fileList = this.$baseLodash.sortBy(this.fileList, task => task.id);
            }
            break;
          case 'delete:project_file':
            this.fileList = this.fileList.filter(task => task.id !== params.id);
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
      async upload(blob) {
        const formData = new FormData();
        formData.append('file', blob, 'data.jpg');
        const { data } = await upload(formData);
        await this.doCreate(data);
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
        this.$refs.inputFile.click();
      },
      inputChange(event) {
        const input = event.target;
        const files = event.target.files;
        if (files && files[0]) {
          this.upload(files[0]);
        }
        input.value = '';
      },
      fileOperationClick(item, itemOperation) {
        switch (itemOperation.id) {
          case 1:
            this.initCopy(`${window.location.origin}/${remote_public_prefix}${item.path}`);
            this.$baseNotify('粘贴到其他对象评论框里即可进行快速关联', '复制链接成功');
            break;
          case 2:
            multiDownload([`/${remote_public_prefix}${item.path}`], {
              rename: () => `${item.title}${item.extension}`,
            });
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
      /**
       * 复制
       * @param text
       */
      initCopy(text) {
        const input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', text);
        input.setAttribute('style', 'position: absolute;left: 100000px;');
        document.getElementById('copyBox')?.appendChild(input);
        input.select();
        document.execCommand('copy');
      },
    },
  };
</script>

<style lang="scss">
  @import '@/styles/custom.scss';
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
  @import '@/styles/custom.scss';
  .task-file {
    .copy {
      position: absolute;
      width: 0px;
      height: 0px;
      overflow: hidden;
    }
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
      margin-bottom: 20px;
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
