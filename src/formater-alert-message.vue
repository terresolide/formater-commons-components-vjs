/**
 * pour afficher des messages
 */
<template>
 <span class="formater-alert" v-show="message.length > 0">
  <div>
          <div>
            <span class="close" @click="close()" v-show="!isPlaying">&#x2716;</span>
            <div v-html="html"></div>
          </div>
  </div>
 </span>
</template>
<script>

export default {
  name: 'FormaterAlertMessage',
  props: {
    msg: {
      type: String,
      default: ''
    },
    playing: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    msg (newvalue) {
      this.createHTML(newvalue)
    },
    playing (newvalue) {
      if (newvalue) {
        this.start()
      } else {
        this.stop()
      }
    }
  },
  data () {
    return {
      html: '',
      message: [],
      count: 0,
      timer: null,
      isPlaying: false
    }
  },
  mounted () {
   
    if (this.msg.length > 0) {
      this.createHTML(this.msg)
       this.initSize()
    }
    if (this.playing) {
      this.start()
    }
  },
  destroyed () {
    this.stop()
  },
  methods: {
    initSize () {
      var h = window.innerHeight
      this.$el.style.lineHeight = h + 'px'
    },
    createHTML (newvalue) {
      this.message = JSON.parse(newvalue.replace(/'/g, '"'))
      this.html = this.message.join('<br />')
    },
    play () {
      if (this.message.length === 0) {
        this.stop()
      } else {
        this.count = this.count + 1
        this.html = this.message.join('<br />') + ' ' + '.'.repeat(this.count % 4)
      }
    },
    start () {
      if (!this.timer) {
        var _this = this
        this.isPlaying = true
        this.count = 0
        this.timer = setInterval(_this.play, 800)
      }
    },
    stop () {
      clearInterval(this.timer)
      this.count = 0
      this.isPlaying = false
    },
    close () {
      this.message = []
    }
  }
}
</script>
<style>
  .formater-alert {
      position: fixed;
      display:inline-block;
      top:0;
      left: 0;
      height:100%;
      width:100%;
      line-height:100%;
      text-align:center;
      z-index:2001;
      background: rgba(0,0,0,0.7);
  }

  .formater-alert > div {
    margin: auto;
    display:inline-block;
    vertical-align:middle;
    width: 450px;
    position:relative;
    background:white;
    border-radius:5px;
    color: darkred;
    line-height:1.2;
    font-size: 1.2rem;
    padding:20px 15px;
  }
  .formater-alert > div .close {
     position: absolute;
     right: 3px;
     top: 0px;
     cursor: pointer;
  }
  .formater-alert > div {
      text-align: left;
  }
</style>
