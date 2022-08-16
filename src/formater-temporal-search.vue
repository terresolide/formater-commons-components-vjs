<i18n>
{
  "en": {
      "from": "from",
      "to": "to",
      "inconsistent_dates":    "inconsistent dates",
      "equal_dates": "The end date should be greater than the start date"
  },
  "fr": {
      "from": "de",
      "to": "à",
      "inconsistent_dates":    "dates incohérentes",
       "equal_dates": "la date finale doit être supérieure à la date initiale"
  }
}
</i18n>

<template>
<span class="formater-temporal-search" :class="{disable: disable}">
    <div class="formater-input-group" :style="{background: background}">
       <span class="right">{{$t('from')}}</span>
      <input :id="name+'from'" autocomplete="off" v-model="from" @click="errorMessage = null" @input="input"  :placeholder="date2str(daymin)" :pattern="pattern"/>
    </div>
    <formater-datepicker :for="'input#' + name + 'from'" :format="format" :lang="lang" :color="color" :daymin="daymin" :daymax="daymax"></formater-datepicker>
    <div class="formater-input-group" :style="{background: background}">
        <span class="right">{{$t('to')}}</span>
        <input :id="name + 'to'" autocomplete="off" v-model="to" @click="errorMessage = null" @input="input" :placeholder="date2str(daymax)" :pattern="pattern">
    </div>
    <formater-datepicker :for="'input#' + name + 'to'" :format="format" :lang="lang" :color="color" :daymin="daymin" :daymax="daymax" ></formater-datepicker> 
    <span class="error-message" v-if="errorMessage">{{errorMessage}}</span>
</span>
</template>

<script>
import FormaterDatepicker from './formater-datepicker.vue';
import moment from 'moment';
 // (!window.momentCst) {
//  import { extendMoment } from 'moment-range';
 // var extendMoment = (extendMoment)  => import('moment-range')
 // window.momentCst = extendMoment(moment);
//}
export default {
  components: {
    FormaterDatepicker
  },
  props: {
      lang:  {
      type: String,
      default: 'fr'
    },
    format:{
        type: String,
        default:'DD/MM/YYYY'
    },
    pattern:{
        type: String,
        default:'(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/[0-9]{4}'
    },
    daymin:{
        type: String,
        default:'1970-01-01'
    },
    daymax:{
        type:String,
        default: 'now'
    },
    disable: {
        type: Boolean,
        default: false
    },
    name: {
      type: String,
      default: ''
    },
    defaultTo: {
      type: String,
      default: null
    },
    defaultFrom: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: '#39B062'
    }
  },
  computed: {
    background () {
      return  this.$shadeColor( this.color, 0.8)
    }
  },
  destroyed: function() {
        document.removeEventListener('aerisResetEvent', this.resetEventListener);
        this.resetEventListener = null;
        document.removeEventListener('aerisSearchEvent', this.searchEventListener);
        this.searchEventListener = null;
//         document.removeEventListener('aerisTheme', this.aerisThemeListener);
//         this.aerisThemeListener = null;
  },
  watch: {
    defaultFrom (newvalue) {
      this.from = this.filterDate(newvalue)
    },
    defaultTo (newvalue) {
      this.to = this.filterDate(newvalue)
    }
  },
  created: function () {
        this.$i18n.locale = this.lang;
        this.resetEventListener = this.handleReset.bind(this) 
        document.addEventListener('aerisResetEvent', this.resetEventListener);
        this.searchEventListener = this.handleSearch.bind(this) 
        document.addEventListener('aerisSearchEvent', this.searchEventListener);
//         this.aerisThemeListener = this.handleTheme.bind(this) 
//         document.addEventListener('aerisTheme', this.aerisThemeListener);
        this.from = this.filterDate(this.defaultFrom)
        this.to = this.filterDate(this.defaultTo)
  },

  mounted: function(){
      var event = new CustomEvent('aerisThemeRequest', {});
      document.dispatchEvent(event);

  },

   data () {
    return {
        searchEventListener: null,
        resetEventListener: null,
      //     aerisThemeListener:null,
      //    theme:null,
        from:null,
        to:null,
        old:{ from:null, to: null},
        errorMessage: null,
        hasChanged:false
    }
  },
  methods: {
      input: function(e){
          //Impossible de déclencher un événement avec this.$emit sur le composant??
          // Apparemment c'est une question de profondeur.
           this.$emit('change',  {
                      name:e.target.id , 
                      value:moment(e.target.value, this.format).format("YYYY-MM-DD")
                     });
          var event = new CustomEvent(
                  'temporalChangeEvent', 
                  {detail:
                      {
                      name: e.target.id , 
                      value:moment(e.target.value, this.format).format("YYYY-MM-DD")
                     }
                  });
          document.dispatchEvent(event);
         
      },
      filterDate (date) {
        if (date) {
          return this.date2str(this.str2date(date.substr(0, 10), 'YYYY-MM-DD'), this.format)
        } else {
          return ''
        }
      },
      date2str( date){
          if (date === 'now') {
            return moment().format(this.format)
          } else {
            return moment(date).format(this.format)
          }
      },
      str2date( str, format){
          if( str == "now"){
              return moment();
          }else{
              return moment( str, format);
          }
      },
      now(){
          return this.date2str( moment());
      },
    handleReset: function() {
         this.from = ""
         this.$el.querySelector('#' + this.name +'from').value = ""
         this.to = ""
         this.$el.querySelector('#' + this.name + 'to').value = ""
    },
    
    handleSearch: function(e) {
        if( this.last ){
            this.from = "";
            this.to = "";
            return;
        }
        //v-model not working??
         
        this.from =  this.$el.querySelector('#' + this.name + 'from').value
        this.to =  this.$el.querySelector('#' + this.name + 'to').value
        var fromDefault = false;
        var toDefault = false

        if( this.from == "" ){
            var from = this.str2date( this.daymin, "YYYY-MM-DD");
            var fromDefault = true
        }else{
            var from = moment(this.from, this.format);
        }
        if( this.to == ""){
            var to = this.str2date( this.daymax, "YYYY-MM-DD");
            var toDefault = true
        }else{
            var to = moment(this.to, this.format);
        }
        
        
    
        if(!from.isValid() || !to.isValid() || from > to ){
            this.errorMessage = this.$i18n.t('inconsistent_dates');
               e.detail.error = true;
        }else{
        
            var str_from = from.format('YYYY-MM-DD');
            var str_to = to.format('YYYY-MM-DD');
            
            if(str_from ){
                e.detail.start = str_from;
            }
            if(str_to){
            
                e.detail.end = str_to;
            }
            e.detail.startDefault = fromDefault
            e.detail.endDefault = toDefault
        }
      }   
//       handleTheme: function(theme) {
//               this.theme = theme.detail;
//             this.ensureTheme();
//       },
          
//      ensureTheme: function() {
//           if ((this.$el) && (this.$el.querySelector)) {
//               var color3 =  this.$shadeColor( this.theme.emphasis, 0.8);
//               var nodes= this.$el.querySelectorAll(".formater-input-group");
//               [].forEach.call(nodes, function(node){
//                   node.style.backgroundColor = color3;
//               })
              
//           }
//      }
  }
}
 

</script>

<style>

.formater-temporal-search {
    display: block
}
.formater-temporal-search.disable{
   opacity: 0.8;
   pointer-events: none;
   
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
    width:70%;
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