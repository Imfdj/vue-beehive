<template>
  <div class="operation-log-management-container wrap-content-main">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button
          :disabled="!$checkPermission(operationLogPermissions.doDelete)"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
          >批量删除</el-button
        >
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="queryForm.keyword"
              placeholder="资源名/标识码/标识码名/路径/动作"
              clearable
              style="width: 250px"
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
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column prop="operator_username" label="操作人">
        <template slot-scope="scope">
          {{ scope.row.operator_username }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="日期" align="center"></el-table-column>
      <el-table-column prop="status" label="状态码" show-overflow-tooltip align="center" width="100px">
        <template slot-scope="scope">
          <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="请求IP" width="120px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="method" label="请求方法" width="100px" align="center">
        <template slot-scope="scope">
          <el-tag :type="getMethodTagType(scope.row.method)">{{ scope.row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="请求路径"></el-table-column>
      <el-table-column prop="params" label="请求体" align="center">
        <template slot-scope="scope">
          <el-popover popper-class="operation-log-params-popover" placement="top-start" width="300" trigger="hover">
            <div class="wrap-operation-log-params">
              {{ scope.row.params }}
            </div>
            <el-button slot="reference" type="text" icon="el-icon-view" size="medium"></el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" label="操作" width="200">
        <template v-slot="scope">
          <el-button
            :disabled="!$checkPermission(operationLogPermissions.doDelete)"
            type="text"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
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
  import { getList, doDelete, permissions as operationLogPermissions } from '@/api/operationLogManagement';

  export default {
    name: 'OperationLogManagement',
    data() {
      return {
        operationLogPermissions,
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
        },
      };
    },
    created() {
      this.fetchData();
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
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            await doDelete({ ids: [row.id] });
            this.$baseMessage('删除成功', 'success');
            this.fetchData();
          });
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map(item => item.id);
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              await doDelete({ ids });
              this.$baseMessage('删除成功', 'success');
              this.fetchData();
            });
          } else {
            this.$baseMessage('未选中任何行', 'error');
            return false;
          }
        }
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
          prop_order: 'id',
          order: 'desc',
          limit: pageSize,
          offset: (pageNo - 1) * pageSize,
        });
        this.list = rows;
        this.total = count;
        this.listLoading = false;
      },
      getStatusTagType(status) {
        let type = '';
        switch (true) {
          case /^2.*/.test(status):
            type = 'success';
            break;
          case /^4.*/.test(status):
            type = 'warning';
            break;
          case /^5.*/.test(status):
            type = 'danger';
            break;
          default:
            type = 'warning';
        }
        return type;
      },
      getMethodTagType(method) {
        let type = '';
        switch (method) {
          case 'POST':
            type = 'success';
            break;
          case 'PUT':
            type = '';
            break;
          case 'DELETE':
            type = 'info';
            break;
          default:
            type = 'info';
        }
        return type;
      },
    },
  };
</script>

<style lang="scss">
  .operation-log-params-popover {
    .wrap-operation-log-params {
      max-height: 500px;
      overflow: auto;
    }
  }
</style>
