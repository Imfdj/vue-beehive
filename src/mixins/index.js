import dayjs from 'dayjs';
import { remote_public_prefix } from '@/config/settings';
import { doDelete as doDeleteTask, doEdit as doEditTask } from '@/api/taskManagement';

export default {
  methods: {
    dateFormat(date, template) {
      return dayjs(date).format(template);
    },
    remoteResourcePath(path) {
      return `${remote_public_prefix}/${path}`;
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
  },
};
