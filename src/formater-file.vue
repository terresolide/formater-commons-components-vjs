/**
 * Display icon file with its name 
 * @event remove with index when click on button remove
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
<span class="formater-file">
	   <div class="file-container">
	      <i class="fa fa-file"></i>
	      <div>{{filename}}</div>
	   </div>
 </span>
</template>
<script>

export default {
  name: 'FormaterFile',
  props: {
    lang: {
      type: String,
      default: 'fr'
    },
    filename: {
      type: String,
      default: 'unknown'
    }
  },
  data () {
    return {
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
    remove () {
      console.log('remove')
    }
  }
}
</script>
<style scoped>
.formater-file{
  display:inline;
  vertical-align:middle;
}
 .file-container{
   line-height: 1;
   position: relative;
   border: 1px dotted grey;
   padding: 5px;
   display: block;
   background: lightgrey;
   border-radius: 4px;
 }
 .file-container i{
   font-size:60px;
   color:grey;
 }
 .file-container div {
    font-size: 12px;
    margin: 10px 0 0 0;
 }
</style>
