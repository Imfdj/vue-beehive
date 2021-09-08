<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" top="15px" @close="close">
    <div v-loading="loading">
      <div class="buttons">
        <el-button @click="setAllChecked">全选</el-button>
        <el-button @click="resetChecked">清空</el-button>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="" prop="permissions">
          <el-tree
            ref="tree"
            :data="menuListData"
            show-checkbox
            default-expand-all
            check-on-click-node
            node-key="id"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        :disabled="
          !$checkPermission(roleMenuPermissions.doBulkMenuCreate) || !$checkPermission(roleMenuPermissions.doDelete)
        "
        @click="save"
        >确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getList as getMenuList } from '@/api/menuManagement';
  import {
    getList as getRoleMenuList,
    doBulkMenuCreate,
    doDelete,
    permissions as roleMenuPermissions,
  } from '@/api/roleMenuManagement';

  export default {
    name: 'RoleMenuManagementEdit',
    data() {
      return {
        roleMenuPermissions,
        loading: false,
        menuListOrigin: [],
        menuListData: [],
        menuIdsOrigin: [], // 存储原所有的id
        menuChildrenIdsOrigin: [], // 存储原所有的孩子id，解决menuListData有父级id，则为选中所有子节点问题。并在确认修改时，再一起传过去
        userRoleListData: [],
        allMenuChildrenIds: [], // 所有菜单的子id
        form: {
          permissions: [],
        },
        rules: {},
        title: '菜单管理',
        dialogFormVisible: false,
        rowEdit: {},
        defaultProps: {
          children: 'children',
          label: 'label',
        },
      };
    },
    created() {},
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
      async doGetRoleList() {
        const {
          data: { rows, count },
        } = await getMenuList({ limit: 1000, offset: 0 });
        this.menuListOrigin = rows;
        const data = rows.map(e => {
          e.label = e.title;
          return e;
        });
        const childrenNav = [];
        // 后端数据, 根级树数组,  根级 PID
        this.listToTree(data, childrenNav, 0);
        this.menuListData = childrenNav;
      },
      /**
       * 获取当前角色的所有菜单
       * @param row
       * @returns {Promise<void>}
       */
      async doGetRoleMenuList(row) {
        const {
          data: { rows, count },
        } = await getRoleMenuList({ role_id: row.id, limit: 1000, offset: 0 });
        this.userRoleListData = rows;
        // 获取所有菜单的父节点
        let parentIds = [];
        this.menuListOrigin.map(e => {
          parentIds.push(e.parent_id);
        });
        parentIds = this.$baseLodash.uniq(parentIds);
        // 获取所有菜单的子节点
        let childrenIds = [];
        this.menuListOrigin.map(e => {
          childrenIds.push(e.id);
        });
        this.allMenuChildrenIds = this.$baseLodash.difference(this.$baseLodash.uniq(childrenIds), parentIds);
        // 原当前角色菜单所有的子节点id
        this.menuIdsOrigin = rows.map(e => {
          return e.menu_id;
        });
        this.menuChildrenIdsOrigin = this.$baseLodash.difference(this.menuIdsOrigin, parentIds);
        this.$refs.tree.setCheckedKeys(this.menuChildrenIdsOrigin);
      },
      async showEdit(row) {
        this.rowEdit = row;
        this.dialogFormVisible = true;
        this.loading = true;
        await this.doGetRoleList();
        await this.doGetRoleMenuList(row);
        this.loading = false;
      },
      close() {
        this.$refs['form'].resetFields();
        this.form = this.$options.data().form;
        this.resetChecked();
        this.dialogFormVisible = false;
      },
      /**
       * 为单个角色批量添加菜单
       * @param menuIdsCurrent
       * @returns {Promise<void>}
       * @constructor
       */
      async BulkRoleCreate(menuIdsCurrent) {
        const diff_create = this.$baseLodash.difference(menuIdsCurrent, this.menuIdsOrigin);
        if (diff_create.length) {
          const { msg } = await doBulkMenuCreate({
            role_id: this.rowEdit.id,
            menu_ids: diff_create,
          });
          this.$baseMessage(msg, 'success');
        }
      },
      /**
       * 删除角色菜单关系
       * @param menuIdsCurrent
       * @returns {Promise<void>}
       * @constructor
       */
      async Delete(menuIdsCurrent) {
        const diff_delete = this.$baseLodash.difference(this.menuIdsOrigin, menuIdsCurrent);
        // 根据menu_id提取相应的userRole表id，用于删除
        const data = [];
        for (let i = 0; i < diff_delete.length; i++) {
          for (let j = 0; j < this.userRoleListData.length; j++) {
            if (this.userRoleListData[j].menu_id === diff_delete[i]) {
              data.push(this.userRoleListData[j].id);
              break;
            }
          }
        }
        if (data.length) {
          const { msg } = await doDelete({ ids: data });
          this.$baseMessage(msg, 'success');
        }
      },
      async save() {
        this.$refs['form'].validate(async valid => {
          if (valid) {
            const menuIdsCurrent = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()];
            await this.BulkRoleCreate(menuIdsCurrent);
            await this.Delete(menuIdsCurrent);
            this.close();
          } else {
            return false;
          }
        });
      },
      setAllChecked() {
        this.$refs.tree.setCheckedKeys(this.allMenuChildrenIds);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
    },
  };
</script>
