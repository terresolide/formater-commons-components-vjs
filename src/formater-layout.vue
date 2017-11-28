
<template>	
	<span class="formater-layout">
	<slot></slot>
	</span>
</template>
<script>
export default {
data(){
    return {
 		 aerisThemeListener:null,
         theme:null
    }
},
methods: {

	handleTheme: function(theme) {
	    console.log("formater layout handle theme");
	  		this.theme = theme.detail
			this.ensureTheme()
	},
	  	
	 ensureTheme: function() {
	  	if ((this.$el) && (this.$el.querySelector)) {
	  		this.$el.querySelector(".formater-layout > header").style.background= this.theme.primary;
  		}
	 }
 },
created: function(){
   
    this.aerisThemeListener = this.handleTheme.bind(this) 
    document.addEventListener('aerisTheme', this.aerisThemeListener);

},
mounted: function(){
    
    var event = new CustomEvent('aerisThemeRequest', {});
   	document.dispatchEvent(event);
 },
 destroyed: function(){
     document.removeEventListener('aerisTheme', this.aerisThemeListener);
     this.aerisThemeListener = null;
 }
 }
</script>

<style>

.formater-layout{
	display:block;
}
.formater-layout > header{
	color:#fff;
	background: blue;
	padding:  10px;
	margin: 0;
}
.formater-layout > header h1,
.formater-layout > header h2,
.formater-layout > header h3{
	padding:0;
	-webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
}
.formater-layout h1,
.formater-layout h2,
.formater-layout h3,
.formater-layout h4{
 	color:#fff;
}
.formater-layout .formater-wrapper{
	 display: block;
	-webkit-box-flex: 1;
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: horizontal;
	-webkit-box-direction: normal;
	-ms-flex-direction: row;
	flex-direction: row;
}

.formater-layout  > header,
.formater-layout > footer{
    width:100%;

}
	
.formater-layout aside{
    
	display:block;
	
}
.formater-layout main{
	 display: block;
	-webkit-box-flex: 1;
	-ms-flex: 1;
	flex: 1;
}


</style>