<template>
<div class="formater-select" :class="{'formater-multiple': multiple, disable: disable}">
	<!-- associative -->
	<select :id="name" :name="name" v-model="values" :multiple="multiple" :size="computedSize" v-if="cas==0" >
		<option v-for="(item, key) in indexes" :value="key" :selected="values.indexOf(key)>-1" v-html="item"  @mouseup="changeOption"></option>
	</select>
	<select :id="name" :name="name" v-model="value"  v-else-if="cas== 1" >
		<option v-for="(item, key) in indexes" :value="key" :selected="value==key" v-html="item"></option>
	</select>
	<!-- non associative -->
	<select :id="name" :name="name" v-model="values" multiple="true" :size="computedSize" v-else-if="cas==2" >
		<option v-for="item in indexes" :value="item" :selected="values.indexOf(item)>-1" v-html="item" @mouseup="changeOption" ></option>	
	</select>
	<select :id="name" :name="name" v-model="value"  v-else>
		<option v-for="item in indexes" :value="item" :selected="item==value" v-html="item"></option>	
	</select>
</div>
</template>
<script>

export default {
    props:{
        options:{
            type:[String, Array, Object]
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
       defaut:{
           type: String,
           default:null
       },
       multiple:{
           type: Boolean,
           default:false
       },
       size:{
           type: Number,
           default:null
       },
       disable: {
           type: Boolean,
           default: false
       },
       setValue: {
    	     type: String,
    	     default: null
       },
       required: {
           type: Boolean,
           default: false
       },
       depth: {
         type: Number,
         default: 0
       }
    },
    computed:{
      cas () {
        if (this.type == "associative") {
          if (this.multiple) {
            return 0;
          } else {
            return 1;
          }
        } else {
          if (this.multiple) {
            return 2;
          } else {
            return 3;
          }
        }
      }    
    },
    data () {
      return {
        value:'', 
        values:[],
        indexes: [], 
        resetEventListener: null, 
        searchEventListener:null,
      //  aerisThemeListener:null,
        selectMarkerListener:null,
        computedSize: "auto",
        associative: false,
        initialized: false
      }
    },
    watch:{
        setValue (newvalue) {
          this.initDefaultValue(false)
        },
        value (newvalue) {
          if (!this.initialized) {
            this.initialized = true
          } else {
        	 var event = new CustomEvent(
       			  'selectChangeEvent', 
       			  {detail:
       			  	{
       				  name: this.name, 
       				  value: this.value
       				  }
       			  });
       	  	document.dispatchEvent(event);
            this.$emit('input', this.value);
          }
        },
        values (newvalue, old) {
          if (!this.initialized) {
            this.initialized = true
          } else {
        	  var event = new CustomEvent(
        	    'selectChangeEvent', 
        	    {detail:
        	    	{
        	    	  name: this.name, 
        	    	  values: this.values
        	    	}
        	    });
            document.dispatchEvent(event);
            this.$emit( 'input', this.values);
          }
        },
        options (newvalue) {
          this.initIndexes(newvalue)
        },
        defaut (newvalue) {
          if (this.multiple) {
            this.values = [newvalue]
          } else {
            this.value = newvalue
          }
        }
    },
    created () {
      
//         if (typeof this.options === 'object'){
//             var options = this.options
//         }else if( this.options.substr(0,1) == "[" || this.options.substr(0,1) == "{"){
//         	 var options = JSON.parse( this.options.replace(/'/g, '"'));
//         }else{

//             var options = this.options.split(",");
//         }
        
//        // var options = JSON.parse( this.options.replace(/'/g, '"'));
//         this.indexes = options;
//         if (Object.keys(options)[0] !== "0") {
//           this.associative = true
//         }
//         if (!this.required && !this.multiple) {
//           if (this.type === 'associative') {
//             if (!Object.keys(this.indexes).indexOf('---') < 0) {
//             	this.indexes = Object.assign({'---': '---'}, this.indexes)
//             }
//           } else {
//             if (this.indexes[0] != '---') {
//             	this.indexes.splice(0,0, '---')
//             }
//           }
//         }
      this.initIndexes(this.options)
      this.initDefaultValue(); // trigger value change
//         if(this.multiple){
//             this.$emit( 'input', this.values)
//         }else{
//         	this.$emit( 'input', this.value); 
//         }
      this.computeSize();
      this.initListeners();
    },
    mounted () {
      this.initCss();
        
//         var event = new CustomEvent('aerisThemeRequest', {});
//         document.dispatchEvent(event);
    },
    destroyed () {
    	this.removeListeners();
    },
    methods: {
    	changeOption (evt) {
    	  if (!this.required && this.values.length === 1 && this.values[0] === event.target.value) {
    	    this.values = []
    	  }
    	},
    	initIndexes (options) {
    	  if (typeof options === 'object'){
          	var indexes = options
      	  }else if( options.substr(0,1) == "[" || options.substr(0,1) == "{"){
      	 	var indexes = JSON.parse( options.replace(/'/g, '"'));
      	  }else{

          	var indexes = options.split(",");
      	  }
      
     	  // var options = JSON.parse( this.options.replace(/'/g, '"'));
     	  this.indexes = indexes;
	      if (Object.keys(indexes)[0] !== "0") {
	        this.associative = true
	      }
	      if (!this.required && !this.multiple) {
	        if (this.type === 'associative') {
	          if (!Object.keys(this.indexes).indexOf('---') < 0) {
	          	this.indexes = Object.assign({'---': '---'}, this.indexes)
	          }
	        } else {
	          if (this.indexes[0] != '---') {
	          	this.indexes.splice(0,0, '---')
	          }
	        }
	      }
    	},
      handleReset (evt) {
            this.initDefaultValue(true);
      },
      handleSearch (evt) {
  	    if (typeof evt.detail.depth != 'undefined' && evt.detail.depth != this.depth) {
  	      return
  	    }
          if(this.multiple){
            if (this.values.length > 0 ) {
              evt.detail[this.name] = this.values;
            }
          }else{
            if (this.value != '---') {
          	evt.detail[this.name] = this.value;
            }
          }
      },
//       handleTheme (theme) {
//  		      this.theme = theme.detail;
//  		     this.ensureTheme();
// 		  }, 	
// 		  ensureTheme () {
// 		   	if ( !this.color &&  (this.$el) && (this.$el.querySelector)) {
// 		   		var color3 =  this.$shadeColor( this.color, 0.8);
// 		   		this.$el.querySelector("select").style.backgroundColor = color3;
// 		   	}
// 		  },
		  computeSize(){
		      if(this.multiple){
	              if(this.size){
	                  this.computedSize = this.size;
	              }else{
	                  this.computedSize = Object.keys(this.indexes).length;
	              }
		      }
		  },
		  initCss () {
	      if (this.$el && this.$el.querySelector) {
	        this.$el.querySelector("select").style.width = this.width;
	        this.$el.style.width = this.width;
	        if (this.color && this.color !== 'transparent') {
	          // this.$el.querySelector("select").style.backgroundColor = this.color;
	          var color3 =  this.$shadeColor( this.color, 0.8);
	          this.$el.querySelector("select").style.backgroundColor = this.$shadeColor( this.color, 0.8)
	        } else {
	          this.$el.querySelector("select").style.backgroundColor = 'transparent'
	        }
	      }
      },
    	initDefaultValue(reset){
        if(this.setValue && !reset){
           if( this.multiple){
           	 var defaut = this.setValue.split(",");
             if( this.type == "associative"){
             	 var values = Object.keys(this.indexes);
             }else{
             	 var values = this.indexes;
             }
             this.values = values.filter(function (n) {
             	 return defaut.indexOf(n)>-1;
             })
           }else {
           	 if( this.indexes[this.setValue]
               || (this.indexes.indexOf && this.indexes.indexOf( this.setValue )>-1))
           	   this.value = this.setValue;
           }
        } else if (this.defaut) {
          if( this.multiple){
            var defaut = this.defaut.split(",");
              if( this.type == "associative"){
              	var values = Object.keys(this.indexes);
              }else{
              	var values = this.indexes;
              }
              this.values = values.filter(function (n) {
              		return defaut.indexOf(n) > -1;
              })
            } else {
              if( this.indexes[this.defaut]
                  || (this.indexes.indexOf && this.indexes.indexOf( this.defaut )>-1))
                this.value = this.defaut;
            }
        } else {
           if (this.type == "associative") {
               var value = Object.keys(this.indexes)[0];
           }else{
               var value = this.indexes[0];
           }
           if (!this.multiple) {
             this.value = value;
           } else if (this.required) {
             this.values = [value]
           }
        }
    	},
    	selectOption( event ){
    	
    		if (event.detail.component != this.name) {
    			return;
    		}
    		if(this.multiple){
    			if (this.values.indexOf( event.detail.value) < 0) {
    				
    				this.values.push( event.detail.value);
    			} else {
    				this.values.splice( this.values.indexOf( event.detail.value), 1);
    				//this.$emit( 'input', this.values);
    			}
    		} else {
    			this.value = event.detail.value;
    		}
    	},
	    initListeners () {
	      this.resetEventListener = this.handleReset.bind(this) 
	      document.addEventListener('aerisResetEvent', this.resetEventListener);
	      this.searchEventListener = this.handleSearch.bind(this) 
	      document.addEventListener('aerisSearchEvent', this.searchEventListener);
// 	       this.aerisThemeListener = this.handleTheme.bind(this) 
// 	       document.addEventListener('aerisTheme', this.aerisThemeListener);
	       this.selectMarkerListener = this.selectOption.bind(this) 
	       document.addEventListener('selectMarkerEvent', this.selectMarkerListener); 
	    },
	    removeListeners () {
			  document.removeEventListener('aerisResetEvent', this.resetEventListener);
			  this.resetEventListener = null;
			  document.removeEventListener('aerisSearchEvent', this.searchEventListener);
			  this.searchEventListener = null;
// 			document.removeEventListener('aerisTheme', this.aerisThemeListener);
// 	        this.aerisThemeListener = null;
	      document.removeEventListener('selectMarkerEvent', this.selectMarkerListener);
	      this.selectMarkerListener = null;
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
.formater-select.disable {
	pointer-events: none;
	opacity:0.8;
}

.formater-select select {
	font-size: inherit; /* inherit size from .custom-dropdown */
	padding: .5em; /* add some space*/
	margin: 0; /* remove default margins */
}

/*@supports (pointer-events: none ) and
      ((-webkit-appearance: none ) or
      (-moz-appearance: none ) or
      (appearance: none )) { */
      
	.formater-select {
	 	position:relative;
		display: inline-block;
	    vertical-align: top;
	}
	
	.formater-select:not(.formater-multiple) select {
		padding-right: 2.5em;
	}
	.formater-select select {
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
	
	.formater-select:not(.formater-multiple)::after{ /*  Custom dropdown arrow */
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
	.formater-select.formater-multiple select[multiple]{
		overflow-y:auto;

	}
	.formater-select select[disabled] {
		color: rgba(0, 0, 0, .3);
	}
	
	.formater-select select[disabled]::after {
		color: rgba(0, 0, 0, .1);
	}
	
	.formater-select option{

	 	white-space: initial;
	 	-ms-line-break:auto;
	 	line-break: auto;
 		word-wrap: break-word;       /* Internet Explorer 5.5+ */
  		height: auto;
  		padding: .1em 0;
  		
	}

	/* FF only temp fix */
	@-moz-document url-prefix () { .formater-select select{ padding-right:.9em}}
/*}*/
</style>
