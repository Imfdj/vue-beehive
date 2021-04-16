<template>
  <div class="project-log">
    <div class="title">项目动态</div>
    <div v-loading="loading" class="list-log">
      <div v-for="item in listData.rows" :key="item.id" class="item">
        <BImage
          class="user-avatar"
          :src="(item.operator && item.operator.avatar) || ''"
          :width="32"
          :height="32"
          :borderRadius="32"
        ></BImage>
        <div class="info">
          <div class="remark ellipsis">{{ item.operator && item.operator.username }} {{ remarkFilter(item) }}</div>
          <div v-if="item.is_comment === 1" class="comment">{{ item.content }}</div>
          <div class="task-name color-light ellipsis" @click="goToTask(item)">{{ item.task && item.task.name }}</div>
        </div>
        <div class="created_at color-light">{{ item.created_at_humanize }}</div>
      </div>
    </div>
    <div v-if="listData.count > pageSize" class="wrap-el-pagination">
      <el-pagination
        background
        :total="listData.count"
        :current-page="pageNo"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import { getList } from '@/api/taskLogManagement';
  import { mapMutations, mapState } from 'vuex';
  import { dateHumanizeFormat } from '@/utils';

  export default {
    name: 'ProjectLog',
    components: {
      BImage,
    },
    data() {
      return {
        listData: [],
        pageNo: 1,
        pageSize: 10,
        loading: false,
      };
    },
    computed: {
      ...mapState('project', ['currentProjectId']),
    },
    created() {
      this.getList();
    },
    methods: {
      ...mapMutations('project', ['setIndexTab']),
      async getList() {
        this.loading = true;
        const { data } = await getList({
          project_id: this.currentProjectId,
          limit: this.pageSize,
          offset: this.pageNo - 1,
          prop_order: 'id',
          order: 'desc',
        });
        data.rows = data.rows.map(log => {
          return {
            ...log,
            created_at_humanize: dateHumanizeFormat(log.created_at).value,
          };
        });
        this.loading = false;
        this.listData = data;
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getList();
      },
      remarkFilter(item) {
        if (item.is_comment) {
          return '发表了评论';
        } else {
          let data = '';
          switch (item.type) {
            case 'executor_assign':
              data = `将任务${item.remark}`;
              break;
            default:
              data = item.remark;
              break;
          }
          return data;
        }
      },
      goToTask(item) {
        // 导航栏切换为任务
        this.setIndexTab(0);
        this.$router.replace(`/pojectManagement/Project/${item.project_id}?taskId=${item.task_id}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-log {
    width: 690px;
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 8px;
    .title {
      line-height: 30px;
    }
    .list-log {
      width: 100%;
      .item {
        display: flex;
        min-height: 48px;
        padding: 12px 0;
        border-bottom: 1px solid $colorE8;
        .user-avatar {
          margin-right: 15px;
        }
        .info {
          width: calc(100% - 32px - 15px - 160px);
          line-height: 24px;
          .remark {
          }
          .comment {
            width: 100%;
            white-space: pre-wrap;
          }
          .task-name {
            cursor: pointer;
            &:hover {
              color: $colorBlue;
            }
          }
        }
        .created_at {
          width: 160px;
          text-align: right;
          line-height: 24px;
        }
      }
    }
  }
</style>
