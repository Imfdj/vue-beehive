<template>
  <div v-if="data.length" class="list-inform">
    <div v-for="item in data" :key="item.id" class="item" @click="select(item)">
      <div class="main">
        <span class="username">{{ item.actor && item.actor.username }}</span>
        <span class="content" v-html="item.content"></span>
      </div>
      <div class="created_at">
        {{ item.created_at_humanize }}
      </div>
      <div class="controller" @click.stop="">
        <div class="btn" @click.stop="doRead(item)"> <i class="el-icon-check"></i>标记为已读 </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins';
  import { doEdit } from '@/api/messageManagement';

  export default {
    name: 'InformList',
    components: {},
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
    mixins: [mixin],
    data() {
      return {};
    },
    created() {},
    methods: {
      select(item) {
        if (item.url) {
          this.$router.push(item.url);
        }
        this.doRead(item);
      },
      doRead(item) {
        doEdit({
          ...item,
          is_read: 1,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .list-inform {
    .item {
      position: relative;
      padding: 8px 10px;
      border-bottom: 1px solid $colorE5;
      .main {
        padding: 5px 0;
        .username {
          display: inline-block;
          margin-right: 5px;
        }
        .content {
          ::v-deep {
            .task-name {
              color: $colorLight;
              /*display: inline-flex;*/
              /*flex-wrap: wrap;*/
              /*align-items: center;*/
              /*max-width: 200px;*/
              /*overflow: hidden;*/
              /*text-overflow: ellipsis;*/
              /*white-space: nowrap;*/
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
      .created_at {
        color: $colorLight;
      }
      .controller {
        position: absolute;
        top: 0;
        right: 0;
        display: none;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100%;
        background-image: -webkit-gradient(
          linear,
          left top,
          right top,
          from(hsla(0, 0%, 100%, 0)),
          color-stop(53%, #f7f7f7)
        );
        opacity: 0;
        transition: opacity 1000ms linear;
        cursor: default;
        .btn {
          display: inline-block;
          color: $colorBlue;
          font-size: 12px;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        }
      }
      &:hover {
        background-color: $colorF5;
        cursor: pointer;
        .controller {
          display: flex;
          opacity: 1;
        }
      }
    }
  }
</style>
