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
<span class="drag-drop-file" :style="getWidth()">
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
	<span class="files-container" :style="{height: height +'px'}">
	  <div @drop="handleDrop" @dragover="handleDragOver">
	  <span class="fa fa-chevron-left"></span>
	  <span class="files">
	     <formater-file v-for="(file,index) in files" :key="index" :filename="file.name" :lang="lang"></formater-file>
	  </span>
	  <span class="fa fa-chevron-right"></span>
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
    },
    width: {
      type: Number,
      default:null
    },
    height: {
      type: Number,
      default: 150
    }
  },
  data () {
    return {
      extension: [],
      aerisThemeListener: null,
      files: [{name:'machin.png'}],
      theme: null
    }
  },
  watch : {
    lang (newvalue) {
      this.$i18n.locale = newvalue
    }
  },
  created () {
    this.$i18n.locale = this.lang
    this.aerisThemeListener = this.handleTheme.bind(this) 
    document.addEventListener('aerisTheme', this.aerisThemeListener)
  },
  mounted () { 
    this.extension = this.ext.split(',')
    var event = new CustomEvent('aerisThemeRequest', {})
  	document.dispatchEvent(event)
  },
  destroyed () {
    document.removeEventListener('aerisTheme', this.aerisThemeListener)
  	this.aerisThemeListener = null
  },
  methods: {
    isAcceptedFile (filename) {
      
    },
    getWidth () {
      if (this.width) {
        return 'width: ' + this.width + 'px;'
      } else {
        return ''
      }
      
    },
    handleDrop(event) {
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
    handleDragOver(event) {
      event.preventDefault()
     // console.log(event)
    },
  	handleTheme: function(theme) {
  		this.theme = theme.detail
		this.ensureTheme()
  	},
  	ensureTheme: function() {
	  	if (this.theme) {
	  		if (this.$el) { 
	  			this.$el.querySelector(".files-container").style.background = this.$shadeColor( this.theme.primary, 0.8)
	  			var color = this.theme.primary;
		  		var color1 = this.$shadeColor( this.theme.primary, 0.1); //lightcolor
		  		var color2 = this.$shadeColor( this.theme.primary, -.1); //dark color
		  		var color3 = this.$shadeColor( this.theme.primary, 0.2);
		  		this.$el.querySelectorAll("[role='button']").forEach(function (button) {
		  		    button.style.background = color
			  		button.style.borderColor= color1 + ' '+ color2 + ' ' + color2;
			  		button.style. textShadow=" 0 -1px 1px "+color3+" , 1px 0 1px "+color2+", 0 1px 1px "+color2+", -1px 0 1px "+color3;
			  		button.addEventListener("mouseover", function(e){
	
			  			this.style.backgroundColor = color1;
			  		});
			  		button.addEventListener("mouseout", function(e){
		
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
      console.log(this.$getExtension(file.name))
      console.log(this.extension.indexOf(this.$getExtension(file.name)) )
      if (this.extension.indexOf(this.$getExtension(file.name)) >= 0) {
        console.log('fichier valide')
      }

    },
    removeAll () {
      console.log('remove all files')
    }
  }
}
</script>
<style>
  .drag-drop-file{
    display:block;
  }
  .files-container {
      position:relative;
      display:block;
      height:150px;
      background: #eaf4f4;  
  }
  .files-container > div {
     height: 100%;
     display:block;
     line-height:150px;
     text-align:left;
  }
  .files-container > div > span {
    vertical-align:middle;
    color:grey;
    font-size:20px;
    margin: auto 20px;
  }
  .files-container > span{
    height:150px;
    width:100%;
    
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
</style>
