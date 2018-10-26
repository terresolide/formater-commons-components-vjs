/**
 * Display icon file with its name  and its index
 * @property {String} lang code of language ('fr' or 'en')
 * @property {String} filename
 * @property {Integer} index  
 * @event remove trigger  when click on button remove, with detail= {index: index, filename: filename}
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
       <span class="fmt fmt-close" @click="remove()" :title="$t('remove')"></span>
	   <div class="file-container">
	      <i class="fmt fmt-file"></i>
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
    },
    index: {
      type: Number,
      default:-1
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
      this.$emit('remove', {filename: this.filename, index: this.index})
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
 .formater-file span.fmt-close {
    position:absolute;
    top:0;
    right:12px;
    z-index:1;
    color: #cc0000;
    cursor:pointer;
 }
 .formater-file span.fmt-close:hover {
    color:red;
 }
</style>
