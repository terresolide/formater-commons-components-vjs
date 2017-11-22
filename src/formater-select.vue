<template>
<div class="formater-select">
	<select :id="name" :name="name" v-model="value" v-if="type=='associative'">
		<option v-for="(item, key) in indexes" :value="key" :selected="key==value">{{ item}}</option>
	</select>
	<select :id="name" :name="name" v-model="value" v-else>
		<option v-for="item in indexes" :value="item" :selected="item==value">{{ item}}</option>	
	</select>
</div>
</template>
<script>
export default {
    props:{
        options:{
            type:[ String, Array, Object]
        },
        name:{
            type:String,
            default:"select"
        },
       width:{
           type:String,
           default:"auto"
       },
      color:{
           type: String,
           default:null
       },
       type:{
           type: String,
           default: "simple"
       },
       default:{
           type: String,
           default:null
       }
    },
  
    data(){
        return {
            value:'', 
            indexes: [], 
            resetEventListener: null, 
            searchEventListener:null,
            aerisThemeListener:null
            
        }
    },
    watch:{
        value:function(ev){
            this.$emit( 'input', this.value);
        }
    },
    
    created: function(){
        var options = JSON.parse( this.options.replace(/'/g, '"'));
        this.indexes = options;
        
        this.$emit( 'input', this.value);   
        this.initListeners();
    },
    mounted: function(){
        this.initCss();
        this.initDefaultValue();
        var event = new CustomEvent('aerisThemeRequest', {});
        document.dispatchEvent(event);
  
    },
    destroyed: function() {
    	this.removeListeners();
      },
      
    methods:{
        handleReset: function(evt){
            this.value = indexes[0];
    	},
        handleSearch: function(evt){
            evt.detail[this.name] = this.value;
        },
        handleTheme: function(theme) {
	  		this.theme = theme.detail;
			this.ensureTheme();
		},
		  	
		ensureTheme: function() {
		 	if ( !this.color &&  (this.$el) && (this.$el.querySelector)) {
		 		var color3 =  this.$shadeColor( this.theme.primary, 0.8);
		 		this.$el.querySelector("select").style.backgroundColor = color3;
		 	}
		},
		initCss: function(){
	        if ((this.$el) && (this.$el.querySelector)) {
	            this.$el.querySelector("select").style.width = this.width;
	            this.$el.style.width = this.width;
	            if(this.color){
	                this.$el.querySelector("select").style.backgroundColor = this.color;
	            }
	        }
    	},
    	
    	initDefaultValue(){
    	    if(this.type == 'associative'){
                if(this.default && this.indexes[this.default]){
                    this.value = this.default;
                }else{
                	this.value = Object.keys(this.indexes)[0];
            	}
            }else{
                if( this.default && this.indexes.indexOf( this.default )>-1){
                    this.value = this.default;
                }else{
            		this.value = this.indexes[0]; 
            	}
        	}
    	},
	    initListeners: function(){
	       this.resetEventListener = this.handleReset.bind(this) 
	       document.addEventListener('aerisResetEvent', this.resetEventListener);
	       this.searchEventListener = this.handleSearch.bind(this) 
	       document.addEventListener('aerisSearchEvent', this.searchEventListener);
	        this.aerisThemeListener = this.handleTheme.bind(this) 
	        document.addEventListener('aerisTheme', this.aerisThemeListener);
	     
	       
	    },
	    removeListeners: function(){
			document.removeEventListener('aerisResetEvent', this.resetEventListener);
			this.resetEventListener = null;
			document.removeEventListener('aerisSearchEvent', this.searchEventListener);
			this.searchEventListener = null;
			document.removeEventListener('aerisTheme', this.aerisThemeListener);
	        this.aerisThemeListener = null;
	    }
	}

}

</script>
<style>
.formater-select {
	position: relative;
	display: inline-block;
	vertical-align: middle;
}

.formater-select select {
	font-size: inherit; /* inherit size from .custom-dropdown */
	padding: .5em; /* add some space*/
	margin: 0; /* remove default margins */
}

@supports (pointer-events: none ) and
      ((-webkit-appearance: none ) or
      (-moz-appearance: none ) or
      (appearance: none )) { 
      
	.formater-select { position:relative;
		display: inline-block;
		vertical-align: middle;
	}
	
	.formater-select select {
		padding-right: 2.5em;
		/* accommodate with the pseudo elements for the dropdown arrow */
		border: 0;
		border-radius: 1px;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		/* Default color from aeris */
		background-color: rgba(172, 220, 238, 0.3);
	}
	
	.formater-select::before, .formater-select::after {
		content: "";
		position: absolute;
		pointer-events: none;
		box-sizing: border-box;
	}
	
	.formater-select::after { /*  Custom dropdown arrow */
		content: "\25BC";
		height: 1em;
		font-size: .625em;
		line-height: 1;
		right: 1.2em;
		top: 50%;
		margin-top: -.5em;
	}
	
	.formater-select::before { /*  Custom dropdown arrow cover */
		width: 2em;
		right: 0;
		top: 0;
		bottom: 0;
		border-radius: 0 3px 3px 0;
	}
	
	.formater-select select[disabled] {
		color: rgba(0, 0, 0, .3);
	}
	
	.isgi-select select[disabled]::after {
		color: rgba(0, 0, 0, .1);
	}
	
	/* FF only temp fix */
	@-moz-document url-prefix () { .isgi-select select{ padding-right:.9em}}
}
</style>