<template>
  <div class="project-invite">
    <div class="wrap-content">
      <div class="app-name">beehive</div>
      <img class="new-message" src="../../assets/imgs/invite/new-message.png" alt="" />
      <div class="wrap-ctrl">
        <BImage
          class="user-avatar"
          :src="(data.actor && data.actor.avatar) || ''"
          :width="64"
          :height="64"
          :borderRadius="64"
        ></BImage>
        <div class="text">{{ data.actor && data.actor.username }} <span class="color-light">邀请你加入项目</span></div>
        <div v-loading="!project.name" class="project-name">{{ project.name }}</div>
        <div class="wrap-btn">
          <el-button
            v-if="data.valid && data.is_accept === 0 && !joined"
            type="primary"
            size="medium"
            style="width: 100%; border-radius: 12px"
            @click="doAcceptInvite"
            >立刻加入
          </el-button>
          <el-button
            v-if="joined"
            type="success"
            :disabled="true"
            size="medium"
            style="width: 100%; border-radius: 12px"
            >已加入
          </el-button>
          <el-button
            v-if="!data.valid && !joined"
            type="danger"
            size="medium"
            :disabled="true"
            style="width: 100%; border-radius: 12px"
            >邀请已过期
          </el-button>
          <el-button
            v-if="data.is_accept === 1 && data.valid && !joined"
            type="warning"
            size="medium"
            :disabled="true"
            style="width: 100%; border-radius: 12px"
            >邀请已接受
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins';
  import { getInfoByUUID, doAcceptInvite } from '@/api/inviteManagement';
  import { getList } from '@/api/userProjectManagement';
  import { getInfo as getInfoProject } from '@/api/projectManagement';
  import { mapState } from 'vuex';
  import BImage from '@/components/B-image';

  export default {
    name: 'ProjectInvite',
    components: {
      BImage,
    },
    mixins: [mixin],
    data() {
      return {
        data: {
          valid: true,
        },
        joined: false,
        project: {},
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
    },
    created() {
      this.getInfoByUUID();
    },
    methods: {
      async getInfoByUUID() {
        const { data } = await getInfoByUUID({ uuid: this.$route.params.id });
        // 获取项目名称
        this.getInfoProject(data.group_id);
        // 判断是已经加入
        await this.getList(data);
        this.data = data;
        // 如果存在指定邀请接受者，并且不是当前登录者，则认为是一次错误打开的邀请链接， 则403
        if (this.data.receiver_id && this.data.receiver_id !== this.userInfo.id) {
          this.$router.push('/403');
        }
      },
      async getInfoProject(project_id) {
        const { data } = await getInfoProject({ id: project_id });
        this.project = data;
      },
      async getList(invite) {
        const {
          data: { count },
        } = await getList({
          user_id: invite.receiver_id || this.userInfo.id,
          project_id: invite.group_id,
        });
        if (count) {
          this.joined = true;
        } else {
          this.joined = false;
        }
      },
      async doAcceptInvite() {
        await doAcceptInvite({ uuid: this.$route.params.id });
        this.$router.push(`${this.$configSettings.project_path}/${this.data.group_id}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-invite {
    position: relative;
    display: flex;
    justify-content: center;
    .wrap-content {
      width: 476px;
      padding: 25px;
      margin-top: 30px;
      height: calc(100vh - 210px);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(38, 38, 38, 0.12);
      background-color: #fff;
      text-align: center;
      .app-name {
        font-size: 26px;
        text-align: center;
        color: #939393;
      }
      .new-message {
        margin-top: 60px;
        height: 43%;
      }
      .wrap-ctrl {
        position: absolute;
        bottom: 28px;
        width: 476px;
        .user-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
        }
        .text {
          line-height: 30px;
        }
        .project-name {
          color: #262626;
          height: 32px;
          line-height: 32px;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 15px;
          width: 100%;
        }
        .wrap-btn {
          height: 36px;
        }
      }
    }
  }
</style>
