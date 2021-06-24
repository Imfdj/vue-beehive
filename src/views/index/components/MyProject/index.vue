<template>
  <div class="my-project">
    <div class="head">
      <div class="title">进行中的项目</div>
      <el-button type="text" size="medium" @click="goToProjectList">全部项目</el-button>
    </div>
    <div v-loading="loading" class="list-project">
      <div v-for="item in projectListShow" :key="item.id" class="item-project" @click="goToProject(item)">
        <div class="wrap-cover">
          <img v-if="item.cover" :src="item.cover" class="cover" alt="" />
        </div>
        <div class="name ellipsis">{{ item.name }}</div>
        <div class="intro ellipsis">{{ item.intro || '暂无介绍' }}</div>
        <div class="foot">
          <div class="username">{{ item.creator && item.creator.username }}</div>
          <div class="created_at">{{ item.created_at_humanize }}</div>
        </div>
      </div>
      <EmptyImage
        v-if="!projectListShow.length && !loading"
        :height="750"
        :heightImg="230"
        text="空空如也~~"
      ></EmptyImage>
    </div>
    <div class="wrap-pagination">
      <el-pagination
        v-if="projectListShow.length"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getList } from '@/api/projectManagement';
  import { dateHumanizeFormat } from '@/utils';
  import EmptyImage from '@/components/EmptyImage';

  export default {
    name: 'MyProject',
    components: {
      EmptyImage,
    },
    data() {
      return {
        loading: false,
        projectList: [],
        currentPage: 1,
        pageSize: 12,
        total: 0,
      };
    },
    computed: {
      projectListShow() {
        return this.projectList.filter((item, index) => {
          return index >= this.pageSize * (this.currentPage - 1) && index < this.pageSize * this.currentPage;
        });
      },
    },
    created() {
      this.getList();
    },
    methods: {
      async getList() {
        this.loading = true;
        const {
          data: { rows, count },
        } = await getList({});
        this.total = count;
        this.$emit('getProjectCount', count);
        this.projectList = rows.map(item => {
          item.created_at = this.$baseDayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss');
          item.created_at_humanize = dateHumanizeFormat(item.created_at).value;
          return item;
        });
        this.loading = false;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      goToProjectList() {
        this.$router.push(this.$configSettings.project_list_path);
      },
      goToProject(project) {
        this.$router.push(`${this.$configSettings.project_path}/${project.id}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .my-project {
    background-color: #fff;
    margin-bottom: 20px;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px;
      border-bottom: 1px solid $colorE8;

      .title {
        font-size: 16px;
      }
    }

    .list-project {
      display: flex;
      flex-wrap: wrap;
      min-height: 750px;

      .item-project {
        width: calc(25% - 1px - 20px);
        height: 100%;
        line-height: 24px;
        padding: 10px;
        border-right: 1px solid $colorE8;
        border-bottom: 1px solid $colorE8;
        color: $colorLight;

        &:hover {
          box-shadow: 0px 0px 6px #ccc;
          cursor: pointer;
        }

        .wrap-cover {
          width: 100%;
          height: 150px;

          .cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .name {
          color: $colorLight3;
        }

        .intro {
        }

        .foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 20px;
          padding-top: 10px;
          border-top: 1px solid $colorE8;

          .username {
          }

          .created_at {
          }
        }
      }
    }

    .wrap-pagination {
      padding-bottom: 20px;
    }
  }
</style>
