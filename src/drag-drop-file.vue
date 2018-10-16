/**
 * Area where drag and drop file
 * @return file content?
 */
<template>
 <span class="dragdrop-file">
 <formater-alert-message :msg="JSON.stringify(alert)" :playing="false"></formater-alert-message>
 <div @drop="dropHandler" @dragover="dragOverHandler">
 </div>
 </span>
</template>
<script>
import FormaterAlertMessage from './formater-alert-message.vue'
export default {
  components: {
    FormaterAlertMessage
  },
  name: 'DragdropFile',
  props: {
    lang: {
      type: String,
      default: 'fr'
    },
    ext: {
      type: String,
      default: 'png,jpeg,jpg,gif'
    }
  },

  data () {
    return {
      alert: []
    }
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    isAcceptedFile (filename) {
      
    },
    dropHandler (event) {
      event.preventDefault()
      console.log(event)
      if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            var file = event.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            console.log(file)
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
        }
      } 
  
      // Pass event to removeDragData for cleanup
      // removeDragData(event)
    },
    dragOverHandler (event) {
      event.preventDefault()
     // console.log(event)
    }
  }
}
</script>
<style>
  .dragdrop-file {
      width:100%;
      height:200px;
      display:block;
      background: grey;
  }
  .dragdrop-file > div {
     height: 100%;
  }
</style>
