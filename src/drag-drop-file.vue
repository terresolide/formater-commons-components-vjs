/**
 * Area where drag and drop file
 * @return file content?
 */
<i18n>
{ 
  "en": {
    "drop_files_here": "Drop your files here",
    "select": "Select",
    "remove": "Remove all",
    "over_maxfiles": "You can only download 1 file | You can only download {count} files",
    "unsupported_extension": "The supported extensions are :"
  },
  "fr": {
    "drop_files_here": "Déposez vos fichiers ici",
    "select": "Sélectionner",
    "remove": "Effacer",
    "over_maxfiles": "Vous ne pouvez télécharger qu&quote;un fichier | Vous ne pouvez télécharger que {count} fichiers",
    "unsupported_extension": "Les extensions supportées sont:"
  }
}
</i18n>
<template>
<span class="drag-drop-file" :style="getWidth()">
<div>{{$tc('over_maxfiles', 3, {count:3})}}</div>
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
  <div class="files-container"  @drop="handleDrop" @dragover="handleDragOver" @dragexit="handleDragExit">
    <div class="error" v-show="error" @click="error = null"><div  v-html="error"></div></div>
    <div class="fa fa-chevron-left" @click="step = step - 1" :class="step <= 0 ? 'disabled':''"></div>
    <div class="box-files"  v-show="files.length > 0"  >
      <div class="files" :style="{transform:'translateX(-'+ step*142 +'px)'}" >
         <formater-file ref="files" v-for="(file,index) in files" :key="index" :filename="file" :lang="lang" @remove="remove"></formater-file>
      </div>
    </div>
    <div class="fa fa-chevron-right" @click="step = step + 1" :class="step >= files.length -1 ? 'disabled': ''"></div>
      <div v-show="this.files.length === 0" class="drop-text">
         <div>{{$t('drop_files_here')}}</div>
      </div>
   </div>
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
    },
    width: {
      type: Number,
      default:null
    },
    maxFiles: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      extension: [],
      aerisThemeListener: null,
      files: [],
     // files: [{name:'machin.png'},{name: 'chose.jpg'}, {name:'bidule.gif'}],
      theme: null,
      step:0,
      color: null,
      darkColor:  '#eaf4f4',
      fileByPage: null,
      error: null
    }
  },
  watch : {
    lang (newvalue) {
      this.$i18n.locale = newvalue
    }
  },
  created () {
    this.$i18n.locale = this.lang
    this.theme = {primary: this.darkColor }
   // this.color =  this.$shadeColor( this.darkColor, 0.8)
   // this.darkColor = this.$shadeColor( this.darkColor, 0.6)
   
    this.aerisThemeListener = this.handleTheme.bind(this) 
    document.addEventListener('aerisTheme', this.aerisThemeListener)
  },
  mounted () { 
    this.extension = this.ext.split(',')
    this.fileByPage = Math.trunc(this.$el.offsetWidth/142)
    this.$el.style.width = (this.fileByPage * 142 + 62) + 'px'
    // this.showError('test 2 une phrase plutot longue pour faire tenir sur plusieurs lignes???')
    this.ensureTheme()
    var event = new CustomEvent('aerisThemeRequest', {})
    document.dispatchEvent(event)
  },
  destroyed () {
    document.removeEventListener('aerisTheme', this.aerisThemeListener)
    this.aerisThemeListener = null
  },
  methods: {
    getWidth () {
      var width = ''
      if (this.width) {
        width = 'width: ' + this.width + 'px;'
      }
      return width
    },
    handleDrop(event) {
      event.preventDefault()
      this.$el.querySelector('.files-container').style.background = this.color
      if (!this.checkUnderMaxFiles()){
        this.removeDragData(event)
        return
      }
      if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            var file = event.dataTransfer.items[i].getAsFile();
            this.receiveFile(file)
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
          this.receiveFile(+ event.dataTransfer.files[i])
        }
      } 
      // Pass event to removeDragData for cleanup
      this.removeDragData(event)
    },
    checkUnderMaxFiles () {
      if (this.maxFiles && this.files.length >= this.maxFiles) {
        this.showError(this.$i18n.tc('over_maxfiles', this.maxFiles, {count:this.maxFiles}))
        return false
      } else {
        return true
      }
    },
    showError (error) {
      this.error = error
      var _this = this
      setTimeout(function () {
        _this.error = null
      }, 15000)
    },
    handleDragOver (event) {
      event.preventDefault()
     this.checkUnderMaxFiles()
     this.$el.querySelector('.files-container').style.background = this.darkColor
    },
    handleDragExit (event) {
      this.$el.querySelector('.files-container').style.background = this.color
    },
    removeDragData (ev) {
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
      } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
      }
    },
    handleTheme: function(theme) {
      this.theme = theme.detail
      this.ensureTheme()
    },
    ensureTheme: function() {
      if (this.theme) {
        if (this.$el && this.$el.querySelector) { 
          this.color =  this.$shadeColor( this.theme.primary, 0.8)
          this.darkColor = this.$shadeColor( this.theme.primary, 0.6)
          this.$el.querySelector(".files-container").style.background = this.color
          var color = this.theme.primary;  
          var color1 = this.$shadeColor( this.theme.primary, 0.1); //lightcolor
          var color2 = this.$shadeColor( this.theme.primary, -.1); //dark color
          var color3 = this.$shadeColor( this.theme.primary, 0.2);
                
          this.$el.querySelectorAll("[role='button']").forEach(function (button) {
              button.style.background = color
            button.style.borderColor= color1 + ' '+ color2 + ' ' + color2;
            button.style. textShadow=" 0 -1px 1px "+color3+" , 1px 0 1px "+color2+", 0 1px 1px "+color2+", -1px 0 1px "+color3;
            if (button.listeners && button.listeners.mouseover) {
              button.removeEventListener("mouseover", button.listeners.mouseover)
              button.listeners.mouseover = null
            }
            if (button.listeners && button.listeners.mouseout) {
              button.removeEventListener("mouseover", button.listeners.mouseout)
              button.listeners.mouseout = null
            }
            button.listeners = {}
            button.listeners.mouseover = button.addEventListener("mouseover", function(e){
              this.style.backgroundColor = color1;
            })
            
            button.listeners.mouseout = button.addEventListener("mouseout", function(e){
              this.style.backgroundColor = color;
            })
            
          })
        }
      }
    },
    readUrl (event) {
      event.preventDefault()
      var file = event.target.files[0]
      this.receiveFile(file)
    },
    receiveFile (file) {
      if (!this.checkUnderMaxFiles()){
        return false
      }
      if (this.extension.indexOf(this.$getExtension(file.name).toLowerCase()) >= 0) {
        this.files.push(file.name)
        this.step =  Math.trunc((this.files.length - 1) / this.fileByPage) * this.fileByPage
        this.$emit('change', file)
        var event = new CustomEvent('receiveFile', {detail:file})
        document.dispatchEvent(event)
        // this.testPreview(file)
        return true
      } else {
        this.showError(this.$i18n.t('unsupported_extension') + ' ' + this.extension.join(', '))
        return false
      }
    },
    /** function to test with image file type */
    testPreview (file) {
      var reader  = new FileReader();
      var img = document.createElement('img')
      img.setAttribute('width',250)
      document.body.appendChild(img)
      reader.addEventListener("load", function () {
        img.src = reader.result;
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    remove (filename) {
      console.log('filename =' + filename)
      var index = this.files.indexOf(filename)
      if (index !== false) {
        console.log('delete file n°=' + index)
        this.files.splice(index,1)
        this.step = this.step > 0 ? this.step - 1 : 0
      }
      var event = new CustomEvent('removeFile', {detail: filename})
      document.dispatchEvent(event)
    },
    removeAll () {
     // for(var i = this.files.length - 1; i >=0; i--) {
        this.$refs.files.forEach(function (node) {
          node.remove()
        })
        this.files = []
       // this.$refs['file'+i].remove()
        // this.remove(this.files[i])
     // }
      this.step = 0
    }
  }
}
</script>
<style>
  .drag-drop-file{
    display:block;
  }
  .drag-drop-file .files-container {
    position:relative;
    display:block;
    height:150px;
    text-align:center;
    background: #eaf4f4;  
  }
  .drag-drop-file .files-container > div.error {
    position:absolute;
    margin: 0 31px;
    color: darkred;
    text-align:center;
    background: rgba(200,200,200,0.5);
    opacity:1;
    width: -webkit-calc(100% - 62px);
    width:    -moz-calc(100% - 62px);
    width:         calc(100% - 62px);
    z-index:1;
  }

  .drag-drop-file .files-container > div {
     height: 100%;
     line-height:150px;
     text-align:left;
  }

  .drag-drop-file .files-container > div.drop-text {
    line-height:150px;
    text-align:center;
    color:grey;
    margin:0 33px;
    width: -webkit-calc(100% - 62px);
    width:    -moz-calc(100% - 62px);
    width:         calc(100% - 62px);
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=);  
  }
  .drag-drop-file .files-container > div.drop-text > div,
  .drag-drop-file .files-container > div.error > div {
    line-height:1;
    vertical-align:middle;
    display:inline-block;
  }
  .drag-drop-file .files-container > div.error > div {
    border:1px solid darkred;
    background:white;
    border-radius:3px;
    padding:10px;
    cursor: pointer;
  }
 /*  .files-container > span{
    height:150px;
    width:100%;
    
  } */
  div.upload-buttons-wrapper{
    width: 240px;
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
    width: 100px;
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
    left:120px;
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
  .drag-drop-file .files-container > div.fa {
     position:absolute;
     opacity:0.8;
     cursor:pointer;
     padding: 0 10px;
  }
  .drag-drop-file .files-container > div.fa.disabled {
    opacity:0.2;
    pointer-events:none;
  }
  
  .drag-drop-file .files-container > .fa-chevron-left {
    left:0px;
    border-right: 1px dotted grey;
  }
  .drag-drop-file .files-container > .fa-chevron-right {
    right:0px;
    border-left:1px dotted grey;
  }
  .drag-drop-file .box-files {
    position:relative;
    display: inline-block;
    margin: 0 31px;
    overflow:hidden;
    width: -webkit-calc(100% - 62px);
    width:    -moz-calc(100% - 62px);
    width:         calc(100% - 62px);
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=);  
  }
  .drag-drop-file .box-files div.files{
    position:absolute;
    max-height:150px;
    min-width:100%;
    width:1000px;
    transition: transform 1s;
  }
  
</style>
