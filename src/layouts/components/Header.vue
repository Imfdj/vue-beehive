<template>
  <div class="header-vue-beehive">
    <div class="wrap-logo" :class="[{ 'menu-collapse': isMenuCollapse }]" @click="logoClick">
      <img class="logo-img" src="../../assets/logo.png" alt="" />
      <span v-if="!isMenuCollapse" class="logo-title">
        {{ logoTitle }}
      </span>
    </div>
    <div class="wrap-nav-ctrl">
      <div class="nav-list">
        <div
          v-for="(item, index) in accessRoutesTreeNoHidden"
          :key="item.id"
          class="nav-item"
          :class="[{ 'nav-item-active': navIndex === index }]"
          @click="navClick(index)"
        >
          <i v-if="item.icon" :class="item.icon"></i><span>{{ item.title }}</span>
        </div>
      </div>
      <div class="wrap-ctrl">
        <GithubPath style="margin-right: 10px"></GithubPath>
        <div class="wrap-online-user">
          <el-badge :hidden="!onlineUserIds.length" :value="onlineUserIds.length" type="primary" class="item">
            <i class="iconfont icon-duoren1"></i>
          </el-badge>
        </div>
        <MessageBox @getCount="getMessageCount">
          <div class="wrap-message-icon">
            <el-badge :hidden="!messageCount" :value="messageCount" class="item">
              <i class="iconfont icon-lingdang-xianxing"></i>
            </el-badge>
          </div>
        </MessageBox>
        <UserOperation>
          <div class="user">
            <BImage
              class="user-avatar"
              :src="userInfo.avatar || ''"
              :width="32"
              :height="32"
              :borderRadius="32"
            ></BImage>
            <div class="username">{{ userInfo.username }}</div>
          </div>
        </UserOperation>
      </div>
    </div>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import GithubPath from '@/components/GithubPath';
  import { mapGetters, mapMutations, mapState } from 'vuex';
  import UserOperation from './UserOperation';
  import MessageBox from './MessageBox';
  import { title } from '@/config/settings';
  import router from '@/router';

  export default {
    name: 'Header',
    components: {
      BImage,
      GithubPath,
      UserOperation,
      MessageBox,
    },
    props: {
      isMenuCollapse: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        messageCount: 0,
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
      ...mapGetters('user', ['onlineUserIds']),
      ...mapGetters('routes', ['accessRoutesTreeNoHidden', 'navIndex']),
      logoTitle() {
        return title.charAt(0).toUpperCase() + title.slice(1);
      },
    },
    created() {
      // 监听路由变动，设置顶部导航栏选中状态
      router.afterEach((to, from) => {
        this.accessRoutesTreeNoHidden?.forEach((item, index) => {
          if (item.path === to.matched[0].path || (item.path === '/' && to.matched[0].path === '')) {
            this.setNavIndex(index);
          }
        });
      });
      this.accessRoutesTreeNoHidden?.forEach((item, index) => {
        if (item.path === this.$route.matched[0].path || (item.path === '/' && this.$route.matched[0].path === '')) {
          this.setNavIndex(index);
        }
      });
    },
    methods: {
      ...mapMutations('routes', ['setNavIndex']),
      navClick(index) {
        this.$router.push(this.accessRoutesTreeNoHidden[index].path);
      },
      logoClick() {
        if (this.navIndex !== 0) {
          this.navClick(0);
        }
      },
      getMessageCount(count) {
        this.messageCount = count;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .header-vue-beehive {
    height: 65px;
    background-color: #fff;
    display: flex;
    .wrap-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 256px;
      height: 100%;
      background-color: #002140;
      color: #fff;
      box-shadow: 0 0 10px #ccc;
      transition: width 300ms ease-in-out;
      cursor: pointer;
      .logo-img {
        height: 30px;
      }
      .logo-title {
        font-size: 26px;
        margin-left: 6px;
      }
    }
    .menu-collapse {
      width: 66px;
    }
    .wrap-nav-ctrl {
      display: flex;
      height: 100%;
      flex: 1;
      .nav-list {
        display: flex;
        align-items: center;
        user-select: none;
        flex: 1;
        @mixin active($color: #1890ff) {
          color: $color;
          border-bottom: 2px solid $color;
        }
        .nav-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          height: 63px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 300ms;
          font-size: 14px;
          line-height: 14px;
          i {
            margin-right: 8px;
            font-size: 16px;
          }
          &:hover {
            @extend .nav-item-active;
          }
        }
        .nav-item-active {
          @include active;
        }
      }
      .wrap-ctrl {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        height: 100%;
        .user {
          display: flex;
          align-items: center;
          height: 65px;
          padding: 0 40px 0 20px;
          cursor: pointer;
          .user-avatar {
            margin-right: 10px;
          }
          &:hover {
            background-color: #f9f9f9;
          }
        }
        .wrap-message-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 65px;
          cursor: pointer;
          & i {
            font-size: 20px;
          }
          &:hover {
            background-color: #f9f9f9;
          }
        }
        .wrap-online-user {
          @extend .wrap-message-icon;
        }
      }
    }
  }
</style>
