<template>
  <div class="file">
    <div class="header">
      <div class="title">我的文件</div>
      <el-button icon="el-icon-upload" @click="uploadHandler">上传</el-button>
    </div>
    <div class="warp-table color-light">
      <div class="head-table">
        <el-row>
          <el-col :span="15">
            <div class="title">名称</div>
          </el-col>
          <el-col :span="2">
            <div class="size"> 大小</div>
          </el-col>
          <el-col :span="3">
            <div class="created_at">创建日期</div>
          </el-col>
          <el-col :span="2">
            <div class="creator"> 创建人 </div>
          </el-col>
          <el-col :span="2">
            <div class="operator"></div>
          </el-col>
        </el-row>
      </div>
      <div class="content-table">
        <el-row v-for="item in dataList" v-show="item.is_recycle === 0" :key="item.id">
          <el-col :span="15">
            <div class="title">
              <BImage
                class="user-avatar"
                :src="(item.executor && item.executor.avatar) || ''"
                :width="24"
                :height="24"
                :borderRadius="24"
              ></BImage>
              <a v-if="!item.onEdit" :href="item.path" target="_blank">{{ item.title + item.extension }}</a>
              <el-input
                v-else
                v-model="item._title"
                placeholder="请输入文件名"
                style="width: 90%"
                @blur="onBlur(item)"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="size"> {{ formatSize(item) }}</div>
          </el-col>
          <el-col :span="3">
            <div class="created_at">{{ item.created_date }}</div>
          </el-col>
          <el-col :span="2">
            <div class="creator">
              {{ getUser(item).username }}
            </div>
          </el-col>
          <el-col :span="2">
            <div class="operator">
              <i class="el-icon-download" @click="downloadHandler(item)"></i>
              <i class="el-icon-edit" @click="editHandler(item)"></i>
              <Dropdown
                :selectList="selectList"
                @command="
                  selector => {
                    command(selector, item);
                  }
                "
              >
                <i class="el-icon-arrow-down"></i>
              </Dropdown>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <Upload ref="Upload" @success="uploadSuccess"></Upload>
  </div>
</template>

<script>
  import mixin from '@/mixins';
  import BImage from '@/components/B-image';
  import Dropdown from '@/components/Dropdown';
  import { getList, doEdit, doDelete, doCreate } from '@/api/projectFileManagement';
  import { mapState } from 'vuex';
  import { dateHumanizeFormat } from '@/utils';
  import Upload from '@/components/Upload';
  import { isExternal } from '@/utils/validate';

  export default {
    name: 'File',
    components: {
      BImage,
      Upload,
      Dropdown,
    },
    mixins: [mixin],
    data() {
      return {
        dataList: [],
        selectList: [
          {
            id: 0,
            name: '复制链接',
            icon: 'iconfont icon-lianjie',
          },
          {
            id: 1,
            name: '移到回收站',
            icon: 'el-icon-delete',
          },
        ],
      };
    },
    computed: {
      ...mapState('project', ['projectMembers', 'currentProjectId']),
      ...mapState('user', ['userInfo']),
    },
    created() {
      this.getList();
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'create:project_file': {
            const taskExisting = this.dataList.find(item => item.id === params.id);
            // 如果不存在，则添加
            if (!taskExisting) {
              this.fileItemDeal(params);
              this.dataList?.push(params);
              this.dataList = this.$baseLodash.reverse(this.$baseLodash.sortBy(this.dataList, item => item.id));
            }
            break;
          }
          case 'update:project_file':
            this.dataList.forEach(item => {
              if (item.id === params.id) {
                this.fileItemDeal(params);
                Object.assign(item, params);
              }
            });
            break;
          case 'delete:project_file':
            this.dataList = this.dataList.filter(item => item.id !== params.id);
            break;
          default:
            break;
        }
      },
    },
    methods: {
      fileItemDeal(item) {
        item.created_date = dateHumanizeFormat(item.created_at).value;
        item.onEdit = false;
        item._title = item.title;
        return item;
      },
      async getList() {
        const {
          data: { rows },
        } = await getList({ project_id: 35, prop_order: 'id', order: 'desc' });
        this.dataList = rows.map(item => {
          this.fileItemDeal(item);
          return item;
        });
      },
      getUser(item) {
        return this.projectMembers?.find(user => user.id === item.creator_id) || {};
      },
      formatSize(item) {
        const { size } = item;
        if (size > 1024 * 1024 * 1024) {
          console.log(3333);
          return `${Math.floor((size / 1024 / 1024 / 1024) * 100) / 100} G`;
        }
        if (size > 1024 * 1024) {
          return `${Math.floor((size / 1024 / 1024) * 100) / 100} Mb`;
        }
        return size ? `${Math.floor((size / 1024) * 100) / 100} Kb` : '';
      },
      uploadHandler() {
        this.$refs.Upload.uploadStart();
      },
      downloadHandler(item) {
        this.multiDownload(item);
      },
      editHandler(item) {
        item.onEdit = true;
      },
      async onBlur(item) {
        item.onEdit = false;
        if (item.title !== item._title) {
          await doEdit({
            ...item,
            title: item._title,
          });
        }
      },
      async doCreate(fileData) {
        await doCreate({
          title: fileData.filename?.replace(fileData.extension, ''),
          project_id: this.currentProjectId,
          creator_id: this.userInfo.id,
          ...fileData,
        });
        this.$baseNotify('', '上传成功');
      },
      async uploadSuccess(data) {
        console.log(data);
        await this.doCreate(data);
      },
      async command(selector, item) {
        switch (selector.id) {
          case 0:
            // 复制链接
            this.doCopy(isExternal(item.path) ? item.path : `${window.location.origin}${item.path}`);
            this.$baseNotify('粘贴到其他对象评论框里即可进行快速关联', '复制链接成功');
            break;
          case 1:
            // 移到回收站
            this.$confirm('您确定要把该文件移到回收站吗？', '移到回收站', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(async () => {
              await doEdit({ ...item, is_recycle: 1 });
              this.$baseNotify('可在上方的回收站中查看', '成功移到回收站');
            });
            break;
          default:
            break;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .file {
    width: 1076px;
    min-height: 100%;
    margin: 0 auto;
    background-color: #fff;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px;
      .title {
        font-size: 18px;
      }
    }
    .warp-table {
      .head-table {
        padding: 10px 20px;
        border-bottom: 1px solid $colorE5;
      }
      .content-table {
        .title {
          .user-avatar {
            margin-right: 10px;
          }
          & a {
            color: $color333;
          }
          & a:hover {
            color: $colorBlue;
          }
        }
        .operator {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          & i {
            cursor: pointer;
          }
        }
        ::v-deep {
          & .el-row {
            display: flex;
            align-items: center;
            height: 50px;
            padding: 0 20px;
          }
          & .el-row:hover {
            background-color: $colorF5;
          }
        }
      }
    }
  }
</style>
