/**
 * Area where drag and drop file
 * @return file content?
 */
<i18n>
{ 
  "en": {
    "drop_files_here": "Drop your files here",
    "select": "Select",
    "remove": "Remove all"
  },
  "fr": {
    "drop_files_here": "Déposez vos fichiers ici",
    "select": "Sélectionner",
    "remove": "Effacer"
  }
}
</i18n>
<template>
<span>
	<formater-alert-message :msg="JSON.stringify(alert)" :playing="false"></formater-alert-message>
	<div class="upload-buttons-wrapper">
	    <div id="pick-files" role="button" style="z-index: 1;" @click="$refs.file.click()">
	      <i class="fa fa-folder-open"></i>
	      <span class="ui-button-text">{{$t('select')}}</span>
	    </div>
	    <div id="reset-all" role="button" @click="removeAll()">
	       <span class="fa fa-close"></span>
	       <span class="ui-button-text">{{$t('remove')}}</span>
	    </div>
 	    <div class="select-file">
 	      <input id="input-file" ref="file" type="file" class="hidden-input" @change="readUrl"/>
 	    </div>
 	</div>
	<span class="dragdrop-file">
	  <div @drop="dropHandler" @dragover="dragOverHandler">
	  <div class="files-container">
	     <formater-file v-for="(file,index) in files" :key="index" :filename="file.name"></formater-file>
	  </div>
      <span v-show="this.files.length === 0">{{$t('drop_files_here')}}</span>
	</div>
	 </span>
 </span>
</template>
<script>
import FormaterAlertMessage from './formater-alert-message.vue'
import FormaterFile from './formater-file.vue'
export default {
  components: {
    FormaterAlertMessage,
    FormaterFile
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
      alert: [],
      extension: [],
      files: [{name:'machin.png'}]
    }
  },
  created () {
    this.$i18n.locale = this.lang
  },
  mounted () { 
    this.extension = this.ext.split(',')
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
            this.receiveFile(file)
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
          this.receiveFile(file)
        }
      } 
  
      // Pass event to removeDragData for cleanup
      // removeDragData(event)
    },
    readUrl (event) {
      event.preventDefault()
      var file = event.target.files[0]
      this.receiveFile(file)
    },
    receiveFile (file) {
      console.log(ftTools.getExtension(file.name))
      console.log(this.extension.indexOf(ftTools.getExtension(file.name)) )
      if (this.extension.indexOf(ftTools.getExtension(file.name)) >= 0) {
        console.log('fichier valide')
      }

    },
    dragOverHandler (event) {
      event.preventDefault()
     // console.log(event)
    },
    removeAll () {
      console.log('remove all files')
    }
  }
}
</script>
<style>
  
  .dragdrop-file {
      position:relative;
      display:inline-block;
      width:100%;
      height:150px;
      background: #eaf4f4;  
  }
  .dragdrop-file > div {
     height: 100%;
     display:block;
     line-height:150px;
     text-align:center;
  }
  .dragdrop-file > div > span {
    vertical-align:middle;
    color:grey;
    font-size:20px;
    width:100%;
  }
  .dragdrop-file .files-container {
    position:absolute;
    top:0;
    left:0;
    height:150px;
  }
  div.upload-buttons-wrapper{
    width: 310px;
    margin: 0 auto 10px auto;
    height: 33px;
    position: relative;
  }
  div[id="pick-files"],
  div[id="reset-all"]{
    font-size: 13px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    position: absolute;
    top: 0;
    width: 145px;
    background-color: #47A4A5;
    border-color: #47A4A5;
    color: #FFFFFF;
    cursor: pointer;
    display: inline-block;
    padding: 2px 7px 3px;
    margin-bottom: 0;
    line-height: 1.428571429;
    text-align: center;
	white-space: nowrap;
	vertical-align: middle;
	cursor: pointer;
	border: 1px solid #ccc;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	border-radius: 4px;
  }
  div[id="reset-all"]{
    left:180px;
  }
  div.select-file {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 145px;
    height: 33px;
    overflow: hidden;
    z-index: 0;
  }
  div.select-file input.hidden-input{
    font-size: 999px;
    opacity: 0;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
</style>
