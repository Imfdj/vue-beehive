<template>
  <div class="roleManagement-container wrap-content-main">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button
          :disabled="!$checkPermission(menuPermissions.doCreate)"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit"
          >添加</el-button
        >
        <el-button
          :disabled="!$checkPermission(menuPermissions.doDelete)"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
          >批量删除</el-button
        >
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyword" placeholder="请输入查询条件" clearable />
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
      row-key="id"
      :element-loading-text="elementLoadingText"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="setSelectRows"
      @sort-change="sortChang"
    >
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="title"
        label="路由title"
        min-width="130px"
        :sortable="'custom'"
      ></el-table-column>
      <el-table-column show-overflow-tooltiprefresh prop="name" label="路由名" :sortable="'custom'"></el-table-column>
      <el-table-column show-overflow-tooltip prop="parent_id" label="父ID" :sortable="'custom'"></el-table-column>
      <el-table-column show-overflow-tooltip prop="icon" label="图标url" :sortable="'custom'"></el-table-column>
      <el-table-column show-overflow-tooltip prop="path" label="路由路径" :sortable="'custom'"></el-table-column>
      <el-table-column show-overflow-tooltip prop="hidden" label="是否隐藏" :sortable="'custom'">
        <template slot-scope="scope">
          <i
            :class="scope.row.hidden === 1 ? 'el-icon-check' : 'el-icon-close'"
            :style="`color: ${scope.row.hidden === 1 ? '#67C23A' : '#F56C6C'};font-size: 24px;`"
          ></i>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="always_show" label="总是显示" :sortable="'custom'">
        <template slot-scope="scope">
          <i
            :class="scope.row.always_show === 1 ? 'el-icon-check' : 'el-icon-close'"
            :style="`color: ${scope.row.always_show === 1 ? '#67C23A' : '#F56C6C'};font-size: 24px;`"
          ></i>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="keep_alive" label="缓存此路由" :sortable="'custom'">
        <template slot-scope="scope">
          <i
            :class="scope.row.keep_alive === 1 ? 'el-icon-check' : 'el-icon-close'"
            :style="`color: ${scope.row.keep_alive === 1 ? '#67C23A' : '#F56C6C'};font-size: 24px;`"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="target"
        label="打开新路由的方式"
        width="160px"
        :sortable="'custom'"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="component"
        label="路由对应组件"
        :sortable="'custom'"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="redirect" label="路由重定向" :sortable="'custom'"></el-table-column>
      <el-table-column show-overflow-tooltip prop="sort" label="排序" :sortable="'sort'"></el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" label="操作" width="200">
        <template v-slot="scope">
          <el-button
            :disabled="!$checkPermission(menuPermissions.doCreate)"
            type="text"
            @click="handleEdit(scope.row, true)"
            >添加下级菜单</el-button
          >
          <el-button :disabled="!$checkPermission(menuPermissions.doEdit)" type="text" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            :disabled="!$checkPermission(menuPermissions.doDelete)"
            type="text"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <edit ref="edit" @fetchData="fetchData"></edit>
  </div>
</template>

<script>
  import { getList, doDelete, permissions as menuPermissions } from '@/api/menuManagement';
  import Edit from './components/MenuManagementEdit';

  export default {
    name: 'MenuManagement',
    components: { Edit },
    data() {
      return {
        menuPermissions,
        list: [],
        listLoading: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          prop_order: '',
          order: '',
          keyword: '',
        },
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      /**
       * 数组转树形结构
       * @param list 源数组
       * @param tree 树
       * @param parentId 父ID
       */
      listToTree(list, tree, parentId) {
        list.forEach(item => {
          // 判断是否为父级菜单
          if (item.parent_id === parentId) {
            const child = {
              ...item,
              key: item.key || item.name,
              children: [],
            };
            // 迭代 list， 找到当前菜单相符合的所有子菜单
            this.listToTree(list, child.children, item.id);
            // 删掉不存在 children 值的属性
            if (child.children.length <= 0) {
              delete child.children;
            }
            // 加入到树中
            tree.push(child);
          }
        });
      },
      setSelectRows(val) {
        this.selectRows = val;
      },
      sortChang(val) {
        this.queryForm.prop_order = val.prop;
        this.queryForm.order = (val.order && val.order.replace('ending', '')) || '';
        this.fetchData();
      },
      handleEdit(row, createChildren) {
        if (row.id) {
          this.$refs['edit'].showEdit(row, createChildren);
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
      queryData() {
        this.fetchData();
      },
      async fetchData() {
        this.listLoading = true;
        const {
          data: { rows },
        } = await getList({ ...this.queryForm, limit: 1000, prop_order: 'sort', order: 'desc' });
        const childrenNav = [];
        // 后端数据, 根级树数组,  根级 PID
        this.listToTree(rows, childrenNav, 0);
        console.log(childrenNav);
        this.list = childrenNav;
        this.listLoading = false;
      },
    },
  };
</script>
