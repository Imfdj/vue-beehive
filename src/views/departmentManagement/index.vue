<template>
  <div class="departmentManagement-container">
    <div class="wrap-nav">
      <div class="wrap-search">
        <el-input
          v-model="memberKeyword"
          prefix-icon="el-icon-search"
          placeholder="搜索"
          size="medium"
          style="width: 228px;"
        ></el-input>
      </div>
      <span class="title-box">成员</span>
      <div class="warp-member">
        <div
          v-for="(item, index) in memberBtns"
          :key="index"
          class="item-member"
          :class="[{ 'item-member-active': memberSelectIndex === index }]"
          @click="memberSelectClick(index)"
          ><i class="iconfont item-member-icon" :class="item.icon"></i><span class="title">{{ item.title }}</span>
        </div>
      </div>
      <span class="title-box">部门</span>
      <div class="warp-menu">
        <div class="warp-member">
          <div
            v-for="(item, index) in departmentList"
            :key="index"
            class="item-member"
            :class="[{ 'item-member-active': memberSelectIndex === index + memberBtns.length }]"
            @click="memberSelectClick(index + memberBtns.length)"
            ><i class="iconfont item-member-icon icon-bumen"></i><span class="title">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="wrap-content">
      <UserContent
        ref="UserContent"
        :isDepartment="memberSelectIndex > 3"
        :departmentData="departmentList[memberSelectIndex - memberBtns.length]"
        :memberData="memberBtns[memberSelectIndex]"
        @doCreateDepartmentSuccess="fetchData"
        @doDeleteDepartmentSuccess="fetchData"
      ></UserContent>
    </div>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/departmentManagement';

  import UserContent from './components/UserContent';

  export default {
    name: 'DepartmentManagement',
    components: {
      UserContent,
    },
    data() {
      return {
        memberKeyword: '',
        departmentList: [],
        memberBtns: [
          { id: 0, icon: 'icon-duoren', title: '所有成员' },
          { id: 1, icon: 'icon-renshu', title: '新加入的成员' },
          { id: 2, icon: 'icon-ren', title: '未分配部门的成员' },
          { id: 3, icon: 'icon-heimingdan', title: '停用的成员' },
        ],
        queryForm: {},
        memberSelectIndex: 0,
      };
    },
    created() {
      this.fetchData();
      this.addNewStyle('.app-main-container {width: 1100px !important;margin: 0 auto;}');
    },
    beforeDestroy() {
      this.addNewStyle('.app-main-container {width: 100% !important;}');
    },
    methods: {
      async fetchData() {
        const {
          data: { rows },
          totalCount,
        } = await getList(this.queryForm);
        this.departmentList = rows;
      },
      addNewStyle(newStyle) {
        let styleElement = document.getElementById('styles_js');
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.type = 'text/css';
          styleElement.id = 'styles_js';
          document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
      },
      memberSelectClick(index) {
        this.memberSelectIndex = index;
        this.$nextTick(() => {
          this.$refs.UserContent.getUserList();
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .departmentManagement-container {
    display: flex;

    .wrap-nav {
      width: 247px;
      border-right: 1px solid #e8e8e8;
      .title-box {
        display: block;
        padding: 20px 0px 10px 0px;
        color: rgba(0, 0, 0, 0.45);
      }
      .warp-member {
        height: 175px;

        .item-member {
          height: 40px;
          margin-top: 4px;
          overflow: hidden;
          padding-left: 10px;
          font-size: 14px;
          line-height: 40px;
          color: #333;
          cursor: pointer;

          .item-member-icon {
            font-size: 20px;
          }

          .title {
            padding-left: 12px;
          }
        }
        .item-member:hover {
          color: #1890ff;
        }

        .item-member-active {
          background-color: #e6f7ff;
          border-right: 3px solid #1890ff;
          color: #1890ff;
          .item-member-icon {
          }
        }
      }

      .warp-menu {
        height: calc(100vh - 460px);
        overflow-y: scroll;
      }
    }

    .wrap-content {
      flex: 1;
      padding-left: 24px;
    }
  }
</style>
