<template>
  <div class="dropdown">
    <el-dropdown trigger="click" placement="bottom-start" @command="command">
      <slot>
        <span class="el-dropdown-link-state">
          <i :class="selector.icon" :style="`color: ${selector.color};margin-right: 5px;font-size: 16px;`"></i
          >{{ selector.name }}
        </span>
      </slot>
      <el-dropdown-menu slot="dropdown" style="width: 200px">
        <el-dropdown-item v-for="item in selectList" :key="item.id" :disabled="item.disabled" :command="item">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0">
            <div style="display: flex; align-items: center">
              <i :class="item.icon" :style="`color: ${item.color};font-size: 16px;`"></i>{{ item.name }}
            </div>
            <i v-if="selector.id === item.id" class="el-icon-check" style="font-size: 16px"></i>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default {
    name: 'Dropdown',
    props: {
      selector: {
        type: Object,
        required: false,
        default: () => {
          return {};
        },
      },
      selectList: {
        type: Array,
        required: true,
      },
    },
    methods: {
      command(selector) {
        this.$emit('command', selector);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dropdown {
    .el-dropdown-link-state {
      padding: 3px;
      cursor: pointer;
      user-select: none;
      border: 1px solid transparent;
      border-radius: 4px;
    }

    .el-dropdown-link-state:hover {
      border: 1px solid #1b9aee;
    }
  }
</style>
