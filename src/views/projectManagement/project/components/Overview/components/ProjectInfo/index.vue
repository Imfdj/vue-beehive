<template>
  <div class="project-info">
    <div class="wrap-info">
      <BImage class="project-cover" :src="project.cover || ''" :width="50" :height="50" :borderRadius="4"></BImage>
      <div class="info">
        <div class="name ellipsis">{{ project.name }}</div>
        <div class="creator-created color-light">
          {{ project.creator && project.creator.username }} 于 {{ createdAt }} 创建
        </div>
      </div>
    </div>
    <div class="wrap-intro">
      <el-tooltip class="item" effect="dark" content="点击即可编辑" :open-delay="200" placement="top">
        <div v-show="!enableEditIntro" class="text-intro" @click="editIntro">
          {{ project.intro || '点击添加项目简介' }}
        </div>
      </el-tooltip>
      <div v-if="enableEditIntro" class="wrap-edit-intro">
        <el-input v-model="project.intro" type="textarea" autosize placeholder="点击添加项目简介"></el-input>
        <div class="ctrl">
          <el-button @click="cancelEditIntro">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </div>
      </div>
    </div>
    <div class="wrap-statistics">
      <div class="title">项目统计</div>
      <div class="list-status">
        <div v-for="(item, index) in statusList" :key="index" class="item">
          <div class="tip">{{ item.tip }}</div>
          <div class="num">{{ item.num }}</div>
          <div class="wrap-el-progress">
            <el-progress
              :percentage="item.percentage"
              :show-text="false"
              :color="item.percentageColor"
              :stroke-width="4"
            ></el-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import { mapState } from 'vuex';
  import dayjs from 'dayjs';
  import { doEdit } from '@/api/projectManagement';

  export default {
    name: 'index',
    components: {
      BImage,
    },
    data() {
      return {
        enableEditIntro: false,
        statusList: [
          {
            tip: '已完成',
            num: 5,
            percentage: 5,
            percentageColor: '#9ED979',
          },
          {
            tip: '未完成',
            num: 5,
            percentage: 5,
            percentageColor: '#FF8478',
          },
          {
            tip: '已逾期',
            num: 5,
            percentage: 5,
            percentageColor: '#FF8478',
          },
          {
            tip: '待认领',
            num: 5,
            percentage: 5,
            percentageColor: '#A1A4D9',
          },
          {
            tip: '今日到期',
            num: 5,
            percentage: 5,
            percentageColor: '#ccc',
          },
          {
            tip: '逾期完成',
            num: 5,
            percentage: 5,
            percentageColor: '#FF8478',
          },
        ],
        project: {},
      };
    },
    computed: {
      ...mapState('project', ['projectList', 'currentProjectId']),
      createdAt() {
        return dayjs(this.project.created_at).format('YYYY年M月D日');
      },
    },
    created() {
      this.project = this.projectList.find(item => {
        return item.id === this.currentProjectId;
      });
      this.project.introBase = this.project.intro;
    },
    methods: {
      editIntro() {
        this.enableEditIntro = true;
      },
      cancelEditIntro() {
        this.enableEditIntro = false;
        this.project.introBase = this.project.intro;
      },
      async doEdit() {
        await doEdit(this.project);
      },
      saveEdit() {
        this.project.intro = this.project.introBase;
        this.doEdit();
        this.enableEditIntro = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/custom';
  .project-info {
    width: 289px;
    padding: 6px 18px 18px 18px;
    margin-left: 20px;
    background-color: #fff;
    border-radius: 8px;
    .wrap-info {
      display: flex;
      padding: 12px 0;
      margin-bottom: 10px;
      .project-cover {
        margin-right: 16px;
      }
      .info {
        width: 289px - 50px - 20px;
        line-height: 22px;
        .name {
          margin-bottom: 4px;
        }
      }
    }

    .wrap-intro {
      margin-bottom: 20px;
      .text-intro {
        padding: 4px 10px;
        cursor: pointer;
        white-space: normal;
        &:hover {
          background-color: $colorF7;
        }
      }
      .wrap-edit-intro {
        .ctrl {
          margin-top: 10px;
          text-align: right;
        }
      }
    }

    .wrap-statistics {
      .title {
        line-height: 20px;
        padding: 20px 0;
        margin-bottom: 10px;
      }
      .list-status {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 54px;
          height: 74px;
          margin-bottom: 60px;
          padding-right: 30px;
          .tip {
            font-size: 12px;
          }
          .num {
            font-size: 32px;
            line-height: 60px;
          }
          .wrap-el-progress {
          }
        }
      }
    }
  }
</style>
