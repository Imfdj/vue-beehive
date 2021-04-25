import dayjs from 'dayjs';
import { doDelete as doDeleteTask, doEdit as doEditTask } from '@/api/taskManagement';
import multiDownload from 'multi-download';
import store from '@/store';
import axios from 'axios';

export default {
  methods: {
    dateFormat(date, template) {
      return dayjs(date).format(template);
    },
    recoverTask(task) {
      return new Promise((resolve, reject) => {
        try {
          this.$confirm('恢复后可在任务列表中查看', '确定恢复内容？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            await doEditTask({
              ...task,
              is_recycle: 0,
            });
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    deleteTask(task) {
      return new Promise((resolve, reject) => {
        try {
          this.$confirm('彻底删除任务后，该任务将会被永久被删除。', '确定彻底删除任务？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            await doDeleteTask({ ids: [task.id] });
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      });
    },

    // 下载文件
    multiDownload(item) {
      multiDownload([item.path], {
        rename: () => `${item.title}${item.extension}`,
      });
    },

    /**
     * 复制文本
     * @param text
     */
    doCopy(text) {
      const input = document.createElement('input');
      const div = document.createElement('div');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', text);
      input.setAttribute('style', 'position: absolute;left: 100000px;');
      div.setAttribute('style', 'position: absolute;width: 0px;height: 0px;overflow: hidden;');
      div.appendChild(input);
      document.body.appendChild(div);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(div);
    },

    /**
     * 验证资源权限
     * @param string
     * @return Boolean
     */
    checkPermission(permission) {
      const permissions = (store.getters['user/userInfo'] && store.getters['user/userInfo'].permissions) || [];
      return permissions.includes(permission);
    },

    /**
     * 获取picsum随机图片路径
     * @param string
     * @return string
     */
    async getRandomPicsumPicturePath(path = 'https://picsum.photos/100') {
      const {
        request: { responseURL },
      } = await axios({
        url: path,
        method: 'get',
      });
      return responseURL;
    },

    /**
     * 从localstorage中获取picsum随机图片路径
     * @param string
     * @return string
     */
    async getRandomImgPath(path = 'https://picsum.photos/290/160') {
      let data = localStorage.getItem(path);
      // 异步重新设置新的写入localStorage
      this.getRandomPicsumPicturePath(path).then(data => {
        localStorage.setItem(path, data);
      });
      // 存在则返回
      if (data) {
        return data;
      }
      // 不存在，则同步获取
      return await this.getRandomPicsumPicturePath(path);
    },
  },
};
