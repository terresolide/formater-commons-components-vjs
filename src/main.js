require("exports-loader?!./l.min.js")

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

const formaterPlugin = {
        install(Vue, options) {
            Vue.prototype.$shadeColor= function(color, percent) {  
                     var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
                     // return "red";
                     return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
            }
            
        }
};

Vue.use( formaterPlugin);

//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);



import FormaterSelect from './formater-select.vue';
import FormaterSearchBox from './formater-search-box.vue';
import FormaterTemporalSearch from './formater-temporal-search.vue';
import FormaterLayout from './formater-layout.vue';
//import Test from './test-component.vue';

ljs.addAliases({
	dep: [//'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
	   // 'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
	//    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js',
	//    'https://cdnjs.cloudflare.com/ajax/libs/moment-range/3.0.3/moment-range.min.js',
	  //  'https://rawgit.com/FremyCompany/css-grid-polyfill/master/bin/css-polyfills.min.js',
	    'https://cdn.rawgit.com/aeris-data/aeris-commons-components-vjs/0.1.23/dist/aeris-commons-components-vjs_0.1.23.js'
	    ]
})
ljs.load('dep', function() {
	
//	window.moment = moment
//	window['moment-range'].extendMoment(moment);
	
	// le tableau des composants Aeris
	if (!window.registredAerisElements) {
		window.registredAerisElements = [];
	}
	function registerElement(name, component) {
	       
        if (window.registredAerisElements.indexOf(name) < 0) {
            Vue.customElement(name, component);
            window.registredAerisElements.push(name)
        }
    }
	
	var componentUsed = new Array('aeris-datepicker');
	var loaded = setInterval(function() {
        var result = componentUsed.filter( function( cpt){
            return window.registredAerisElements.indexOf(cpt)>-1;
        })
        if ( result.length == componentUsed.length) {
           console.log("Formater : aeris components loaded");
           load();
           clearInterval(loaded);
        }
     }, 100);
     function load(){
    	 registerElement('formater-layout', FormaterLayout);
         registerElement('formater-select', FormaterSelect);
         registerElement('formater-temporal-search', FormaterTemporalSearch);
         registerElement('formater-search-box', FormaterSearchBox);
        
       //  registerElement('test-component', Test);
        
    
    }


})

