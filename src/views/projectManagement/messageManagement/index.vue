<template>
  <div class="message-management-container wrap-content-main">
    <vab-query-form>
      <vab-query-form-left-panel :span="12"> </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="queryForm.keyword"
              placeholder="内容"
              clearable
              style="width: 250px"
              @keyup.enter.native="queryData"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
      @sort-change="sortChang"
    >
      <el-table-column prop="operator_username" label="内容">
        <template slot-scope="scope">
          <div class="wrap-content">
            <BImage
              class="user-avatar"
              :src="(scope.row.actor && scope.row.actor.avatar) || ''"
              :width="32"
              :height="32"
              :borderRadius="32"
            ></BImage>
            <span class="username">{{ scope.row.actor && scope.row.actor.username }} </span>
            <span class="content" v-html="scope.row.content"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="时间" align="center" width="200"></el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" label="操作" width="200">
        <template v-slot="scope">
          <el-button
            :disabled="!scope.row.url || !$checkPermission(messagePermissions.doEdit)"
            type="text"
            @click="handleCheck(scope.row)"
            >查看
          </el-button>
          <el-button
            :disabled="scope.row.is_read === 1 || !$checkPermission(messagePermissions.doEdit)"
            type="text"
            @click="doRead(scope.row)"
            >{{ scope.row.is_read === 1 ? '已读' : '标记为已读' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import { getList, doEdit, permissions as messagePermissions } from '@/api/messageManagement';
  import { mapState } from 'vuex';

  export default {
    name: 'MessageManagement',
    components: {
      BImage,
    },
    data() {
      return {
        messagePermissions,
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          prop_order: '',
          order: '',
          pageNo: 1,
          pageSize: 10,
          keyword: '',
          type: '',
        },
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
    },
    created() {},
    beforeRouteEnter(to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建
      next(vm => {
        vm.queryForm.type = vm.$route.name;
        vm.fetchData();
        // 通过 `vm` 访问组件实例
      });
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val;
      },
      sortChang(val) {
        this.queryForm.prop_order = val.prop;
        this.queryForm.order = (val.order && val.order.replace('ending', '')) || '';
        this.queryForm.pageNo = 1;
        this.fetchData();
      },
      handleCheck(item) {
        if (item.url) {
          this.$router.push(item.url);
        }
        this.doRead(item);
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.fetchData();
      },
      queryData() {
        this.queryForm.pageNo = 1;
        this.fetchData();
      },
      async fetchData() {
        this.listLoading = true;
        const { pageSize, pageNo } = this.queryForm;
        const {
          data: { rows, count },
        } = await getList({
          ...this.queryForm,
          receiver_id: this.userInfo.id,
          prop_order: 'id',
          order: 'desc',
          limit: pageSize,
          offset: (pageNo - 1) * pageSize,
        });
        this.list = rows;
        this.total = count;
        this.listLoading = false;
      },
      async doRead(item) {
        await doEdit({
          ...item,
          is_read: 1,
        });
        this.fetchData();
      },
    },
  };
</script>

<style lang="scss">
  .message-management-container {
    .wrap-content {
      display: flex;
      align-items: center;
      min-height: 40px;
      .user-avatar {
        margin-right: 5px;
      }
      .username {
        margin-right: 10px;
        width: fit-content;
      }
      .content {
        flex: 1;
        .project-name,
        .task-name {
          color: $colorBlue;
        }
        .state {
          padding: 0 5px;
        }
        .redo {
          color: $base-font-color;
        }
        .done {
          color: $base-color-green;
        }
      }
    }
  }
</style>
