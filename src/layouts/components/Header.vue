<template>
  <div class="header-vue-admin-scaffold">
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
        <UserOperation>
          <div class="user">
            <BImage class="user-avatar" :src="userInfo.avatar" :width="32" :height="32" :borderRadius="32"></BImage>
            <div class="username">{{ userInfo.username }}</div>
          </div>
        </UserOperation>
      </div>
    </div>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import { mapGetters, mapMutations, mapState } from 'vuex';
  import UserOperation from './UserOperation';
  import { title } from '@/config/settings';

  export default {
    name: 'Header',
    components: {
      BImage,
      UserOperation,
    },
    props: {
      isMenuCollapse: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {};
    },
    computed: {
      ...mapState('user', ['userInfo']),
      ...mapGetters('routes', ['accessRoutesTreeNoHidden', 'navIndex']),
      logoTitle() {
        return title.charAt(0).toUpperCase() + title.slice(1);
      },
    },
    created() {
      this.accessRoutesTreeNoHidden?.forEach((item, index) => {
        if (item.path === this.$route.matched[0].path) {
          this.setNavIndex(index);
        }
      });
    },
    methods: {
      ...mapMutations('routes', ['setNavIndex']),
      navClick(index) {
        this.$router.push(this.accessRoutesTreeNoHidden[index].path);
        this.setNavIndex(index);
      },
      logoClick() {
        if (this.navIndex !== 0) {
          this.navClick(0);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .header-vue-admin-scaffold {
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
        margin-right: 6px;
      }
      .logo-title {
        font-size: 26px;
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
          padding: 0 20px;
          cursor: pointer;
          .user-avatar {
            margin-right: 10px;
          }
          &:hover {
            background-color: #f9f9f9;
          }
        }
      }
    }
  }
</style>
