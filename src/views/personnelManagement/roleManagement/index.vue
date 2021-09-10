<template>
  <div class="roleManagement-container wrap-content-main">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button
          :disabled="!$checkPermission(rolePermissions.doCreate)"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit"
          >添加
        </el-button>
        <el-button
          :disabled="!$checkPermission(rolePermissions.doDelete)"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
          >批量删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.keyword"
              placeholder="请输入角色名"
              clearable
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
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column show-overflow-tooltip prop="id" label="id" :sortable="'custom'"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="角色名" :sortable="'custom'"></el-table-column>
      <el-table-column show-overflow-tooltip prop="is_default" label="是否为默认角色">
        <template slot-scope="scope">
          <i
            :class="scope.row.is_default === 1 ? 'el-icon-check' : ''"
            :style="`color: ${scope.row.is_default === 1 ? '#67C23A' : '#F56C6C'};font-size: 24px;`"
          ></i>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" label="操作" width="270">
        <template v-slot="scope">
          <el-button
            :disabled="!$checkPermission(rolePermissionPermissions.getList)"
            type="text"
            @click="handlePermissionEdit(scope.row)"
            >资源管理
          </el-button>
          <el-button
            :disabled="!$checkPermission(roleMenuPermissions.getList)"
            type="text"
            @click="handleMenuEdit(scope.row)"
            >菜单管理
          </el-button>
          <el-button :disabled="!$checkPermission(rolePermissions.doEdit)" type="text" @click="handleEdit(scope.row)"
            >编辑
          </el-button>
          <el-button
            :disabled="!$checkPermission(rolePermissions.doDelete)"
            type="text"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
          <el-button
            v-if="scope.row.is_default === 0"
            :disabled="!$checkPermission(rolePermissions.doSetDefault)"
            type="text"
            @click="handleSetDefault(scope.row)"
            >设为默认
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

    <edit ref="edit" @fetchData="fetchData"></edit>
    <RoleMenuManagementEdit ref="RoleMenuManagementEdit"></RoleMenuManagementEdit>
    <RolePermissionManagementEdit ref="RolePermissionManagementEdit"></RolePermissionManagementEdit>
  </div>
</template>

<script>
  import { getList, doDelete, doSetDefault, permissions as rolePermissions } from '@/api/roleManagement';
  import { permissions as roleMenuPermissions } from '@/api/roleMenuManagement';
  import { permissions as rolePermissionPermissions } from '@/api/rolePermissionManagement';
  import Edit from './components/RoleManagementEdit';
  import RoleMenuManagementEdit from './components/RoleMenuManagementEdit';
  import RolePermissionManagementEdit from './components/RolePermissionManagementEdit';

  export default {
    name: 'RoleManagement',
    components: { Edit, RoleMenuManagementEdit, RolePermissionManagementEdit },
    data() {
      return {
        rolePermissions,
        roleMenuPermissions,
        rolePermissionPermissions,
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
      /**
       * 菜单管理
       * @param row
       */
      handleMenuEdit(row) {
        if (row.id) {
          this.$refs['RoleMenuManagementEdit'].showEdit(row);
        } else {
          this.$refs['RoleMenuManagementEdit'].showEdit();
        }
      },
      /**
       * 资源管理
       * @param row
       */
      handlePermissionEdit(row) {
        if (row.id) {
          this.$refs['RolePermissionManagementEdit'].showEdit(row);
        } else {
          this.$refs['RolePermissionManagementEdit'].showEdit();
        }
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
      handleSetDefault(row) {
        this.$baseConfirm(`你确定要设置 “${row.name}” 为默认角色吗`, null, async () => {
          await doSetDefault({ id: row.id });
          this.$baseMessage('设置成功', 'success');
          this.fetchData();
        });
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
