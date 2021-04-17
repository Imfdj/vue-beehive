<template>
  <div class="index-container wrap-content-main" @click="doNotify"> index </div>
</template>

<script>
  import Notify from '@wcjiang/notify';

  export default {
    name: 'Index',
    components: {},
    data() {
      return {
        notify: null,
      };
    },
    created() {},
    mounted() {
      this.notify = new Notify({
        message: 'There is message.', // page title.
        effect: 'flash', // flash | scroll, Flashing or scrolling
        openurl: 'https://github.com/jaywcjlove/iNotify', // Click on the pop-up window to open the connection address
        onclick: () => {
          // Click on the pop-up window trip event
          // Programmatically closes a notification.
          this.notify.close();
          console.log('---');
        },
        // Optional playback sound
        audio: {
          // You can use arrays to pass sound files in multiple formats.
          file: ['msg.mp4', 'msg.mp3', 'msg.wav'],
          // The following is also work.
          // file: 'msg.mp4'
        },
        // Title flashing, or scrolling speed
        interval: 1000,
        // Optional, default green background white text. Favicon
        updateFavicon: {
          // favicon font color
          textColor: '#fff',
          // Background color, set the background color to be transparent, set the value to "transparent"
          backgroundColor: '#2F9A00',
        },
        // Optional chrome browser notifications，
        // The default is not to fill in the following content
        notification: {
          title: 'Notification!', // Set notification title
          icon: '', // Set notification icon, The default is Favicon
          body: 'You have a new message!', // Set message content
        },
      });
    },
    beforeDestroy() {},
    methods: {
      doNotify() {
        console.log(this.notify);
        this.notify.player();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .index-container {
  }
</style>
