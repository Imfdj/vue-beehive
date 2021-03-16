import dayjs from 'dayjs';
import { remote_public_prefix } from '@/config/settings';

export default {
  methods: {
    dateFormat(date, template) {
      return dayjs(date).format(template);
    },
    remoteResourcePath(path) {
      return `${remote_public_prefix}/${path}`;
    },
  },
};
