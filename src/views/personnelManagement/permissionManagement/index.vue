<template>
  <div class="roleManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyword"
              placeholder="资源名/标识码/标识码名/路径/动作"
              clearable
              style="width: 250px;"
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
      <el-table-column prop="mark" label="标识码" :sortable="'custom'"></el-table-column>
      <el-table-column prop="mark_name" label="标识码名" :sortable="'custom'"></el-table-column>
      <el-table-column prop="name" label="name" :sortable="'custom'" show-overflow-tooltip></el-table-column>
      <el-table-column prop="url" label="路径" :sortable="'custom'" show-overflow-tooltip></el-table-column>
      <el-table-column prop="action" label="动作" :sortable="'custom'" width="100px"></el-table-column>
      <el-table-column prop="state" label="状态" :sortable="'custom'" width="76px" align="center">
        <template slot-scope="scope">
          <i
            :class="scope.row.state === 1 ? 'el-icon-check' : 'el-icon-close'"
            :style="`color: ${scope.row.state === 1 ? '#67C23A' : '#F56C6C'};font-size: 24px;`"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="authentication" label="需要认证" :sortable="'custom'" width="100px" align="center">
        <template slot-scope="scope">
          <i
            :class="scope.row.authentication === 1 ? 'el-icon-check' : 'el-icon-close'"
            :style="`color: ${scope.row.authentication === 1 ? '#67C23A' : '#F56C6C'};font-size: 24px;`"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="authorization" label="需要授权" :sortable="'custom'" width="100px" align="center">
        <template slot-scope="scope">
          <i
            :class="scope.row.authorization === 1 ? 'el-icon-check' : 'el-icon-close'"
            :style="`color: ${scope.row.authorization === 1 ? '#67C23A' : '#F56C6C'};font-size: 24px;`"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" label="操作" width="200">
        <template v-slot="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
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
    <edit ref="edit" @fetchData="fetchData"></edit>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/permissionManagement';
  import Edit from './components/PermissionManagementEdit';

  export default {
    name: 'PermissionManagement',
    components: { Edit },
    data() {
      return {
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
      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row);
        } else {
          this.$refs['edit'].showEdit();
        }
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
        } = await getList({ ...this.queryForm, limit: pageSize, offset: (pageNo - 1) * pageSize });
        this.list = rows;
        this.total = count;
        this.listLoading = false;
      },
    },
  };
</script>
