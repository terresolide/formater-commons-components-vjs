/**
 * Display icon file with its name 
 * @event remove with index when click on button remove
 */
<i18n>
{ 
  "en": {
    "remove": "Remove"
  },
  "fr": {
    "remove": "Effacer"
  }
}
</i18n>
<template>
<span class="formater-file">
       <span class="fa fa-close" @click="remove()" :title="$t('remove')"></span>
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
  },
  destroyed () {
  },
  watch : {
    lang (newvalue) {
      this.$i18n.locale = newvalue
    }
  },
  methods: {
    remove () {
      console.log('remove')
      this.$emit('remove', this.filename)
    }
  }
}
</script>
<style scoped>
.formater-file{
  display:inline-block;
  vertical-align:middle;
  position:relative;
}
 .formater-file .file-container{
   line-height: 1;
   color:grey;
   position: relative;
   border: 1px dotted grey;
   padding: 10px 5px 5px 5px;
   display: block;
   background: lightgrey;
   border-radius: 4px;
   margin: auto 10px;
   text-align:center;
   width:110px;
   min-width:110px;
   max-width:110px;
   height:120px;
 }
 .formater-file .file-container i{
   font-size:60px;
   color:grey;
 }
 .formater-file .file-container div {
    font-size: 12px;
    margin: 10px 0 0 0;
    word-wrap: break-word;
 }
 .formater-file span.fa-close {
    position:absolute;
    top:0;
    right:12px;
    z-index:1;
    color: #cc0000;
    cursor:pointer;
 }
 .formater-file span.fa-close:hover {
    color:red;
 }
</style>
