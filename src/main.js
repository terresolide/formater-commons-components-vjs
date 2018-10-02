require("exports-loader?!./l.min.js")

// import Tools from './formater-tools.js';

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);



//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);


import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue';
import FormaterSelect from './formater-select.vue';
import FormaterSearchBox from './formater-search-box.vue';
import FormaterTemporalSearch from './formater-temporal-search.vue';
import FormaterLayout from './formater-layout.vue';
//import Test from './test-component.vue';

ljs.addAliases({
	dep: ['https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
	    'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
	    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js',
	   // 'https://cdnjs.cloudflare.com/ajax/libs/moment-range/3.0.3/moment-range.min.js',
	  //  'https://rawgit.com/FremyCompany/css-grid-polyfill/master/bin/css-polyfills.min.js',
	    //'https://cdn.rawgit.com/aeris-data/aeris-commons-components-vjs/541295cd45aad4102b5fc35f6d1dbf03d644895e/dist/aeris-commons-components-vjs_0.3.0.js'
	//	'https://api.poleterresolide.fr/webcomponents/aeris-commons-components-vjs_0.3.0.js'
		//'http://localhost:8083/dist/build.js'
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
	
	
	 window.ftTools = Tools;
	 var componentUsed = new Array();
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
    	  registerElement('aeris-theme', AerisTheme);
    	  registerElement('formater-layout', FormaterLayout);
         registerElement('formater-select', FormaterSelect);
         registerElement('formater-temporal-search', FormaterTemporalSearch);
         registerElement('formater-search-box', FormaterSearchBox);
    }
})

