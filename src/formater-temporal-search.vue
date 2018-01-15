<i18n>
{
  "en": {
	  "from": "from",
	  "to": "to",
	  "inconsistent_dates":	"inconsistent dates",
	  "equal_dates": "The end date should be greater than the start date"
  },
  "fr": {
	  "from": "de",
	  "to": "à",
	  "inconsistent_dates":	"dates incohérentes",
	   "equal_dates": "la date finale doit être supérieure à la date initiale"
  }
}
</i18n>

<template>
<span class="formater-temporal-search">
	<div class="formater-input-group" >
	   <span class="right">{{$t('from')}}</span>
	  <input id="from" v-model="from" @click="errorMessage = null" @change="test" />
	</div>
	<aeris-datepicker for="input#from" :format="format" :lang="lang" ></aeris-datepicker>
	<div class="formater-input-group">
		<span class="right">{{$t('to')}}</span>
		<input id="to" v-model="to" @click="errorMessage = null">
	</div>
	<aeris-datepicker for="input#to" :format="format" :lang="lang"></aeris-datepicker> 
	<span class="error-message" v-if="errorMessage">{{errorMessage}}</span>
</span>
</template>

<script>
export default {
	 
  props: {
  	lang:  {
      type: String,
      default: 'fr'
    },
    format:{
        type: String,
        default:'DD/MM/YYYY'
    }
  }, 
  destroyed: function() {
		document.removeEventListener('aerisResetEvent', this.resetEventListener);
		this.resetEventListener = null;
		document.removeEventListener('aerisSearchEvent', this.searchEventListener);
		this.searchEventListener = null;
		 document.removeEventListener('aerisTheme', this.aerisThemeListener);
         this.aerisThemeListener = null;
  },
  
  created: function () {
		this.$i18n.locale = this.lang;
		this.resetEventListener = this.handleReset.bind(this) 
		document.addEventListener('aerisResetEvent', this.resetEventListener);
		this.searchEventListener = this.handleSearch.bind(this) 
		document.addEventListener('aerisSearchEvent', this.searchEventListener);
		this.aerisThemeListener = this.handleTheme.bind(this) 
	    document.addEventListener('aerisTheme', this.aerisThemeListener);
  },

  mounted: function(){
      var event = new CustomEvent('aerisThemeRequest', {});
      document.dispatchEvent(event);

  },

   data () {
    return {
        searchEventListener: null,
   		resetEventListener: null,
   		aerisThemeListener:null,
   		theme:null,
    	from:null,
    	to:null,
    	errorMessage: null,
    }
  },
 
  updated: function() {
  },

  
  methods: {
      test: function(){
      },
	handleReset: function() {
		 this.from=""
		 this.to=""
		  
	},
	

	  
	handleSearch: function(e) {
		if( this.last ){
		    return;
		}
		//v-model not working??
		 
		this.from =  this.$el.querySelector('#from').value
		this.to =  this.$el.querySelector('#to').value
		
		var from = moment(this.from, this.format);
		var to = moment(this.to, this.format);
		if( from > to ){
		    this.errorMessage = this.$i18n.t('inconsistent_dates');
		   	e.detail.error = true;
	    }
		
		
		   
	
		var str_from = from.isValid() ? from.format('YYYY-MM-DD') : '';
		var str_to = to.isValid() ? to.format('YYYY-MM-DD') : '';
		
		if(str_from ){
			e.detail.start = str_from;
		}
		if(str_to){
		
			e.detail.end = str_to;
		}
	  },
	 
      handleTheme: function(theme) {
	  		this.theme = theme.detail;
			this.ensureTheme();
	  },
	  	
	 ensureTheme: function() {
	  	if ((this.$el) && (this.$el.querySelector)) {
	  		var color3 =  this.$shadeColor( this.theme.primary, 0.8);
	  		var nodes= this.$el.querySelectorAll(".formater-input-group");
	  		[].forEach.call(nodes, function(node){
	  		    node.style.backgroundColor = color3;
	  		})
	  		
	  	}
	 }
  }
}
 

</script>

<style>

.formater-temporal-search {
    display: block
}

.formater-temporal-search .right {
	min-width: 40px;
	border-right: 1px solid #fff;
	box-sizing: border-box;
    display: block;
    height: 100%;
    text-align: center;
}

.formater-temporal-search .error-message {
    font-size: 12px;
    color: red
}
.formater-temporal-search .error-message::first-letter{
	text-transform:uppercase;
}
.formater-temporal-search .formater-input-group {
    border: none;
    display:inline-block;
     /* Default color from aeris */
    background-color: rgba(172,220,238,0.3); 
}

.formater-temporal-search .formater-input-group input {
	border: none;
	background-color: transparent;
	padding: 0 5px;
	outline: none;
}
	
.formater-temporal-search .formater-input-group span:first-letter {
   text-transform: uppercase;
}
.formater-temporal-search .formater-input-group{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 5px 0;
    width: 100%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
}



</style>