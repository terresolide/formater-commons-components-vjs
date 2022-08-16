require("exports-loader?!./l.min.js")


import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);



//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import VueTools from './formater-tools.js'
Vue.use(VueTools)

// import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue';
import FormaterAlertMessage from './formater-alert-message.vue'
import FormaterDatepicker from './formater-datepicker.vue'
import FormaterAttribution from './formater-attribution.vue'
import FormaterDraggableBlock from './formater-draggable-block.vue'
import FormaterLayout from './formater-layout.vue'
import FormaterSearchBox from './formater-search-box.vue'
import FormaterSelect from './formater-select.vue'
import FormaterTemporalSearch from './formater-temporal-search.vue'
import LanguageSwitcher from './language-switcher.vue'
import DragdropFile from './drag-drop-file.vue'

//import Test from './test-component.vue';


ljs.addAliases({
	dep: [
	    'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
	    'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js' //,
	  //  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js'
	    ]
})
ljs.load('dep', function() {

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
	
	/**
	 * @todo passer les fonctions globales dans vue et non en global window ??
	 */
//	window.ftTools = ftTools;
	var componentUsed = new Array(); // plus de composant dont on attend l'enregistrement
	var loaded = setInterval(function() {
        var result = componentUsed.filter( function( cpt){
            return window.registredAerisElements.indexOf(cpt)>-1;
        })
        if ( result.length == componentUsed.length) {
           // console.log("Formater : aeris components loaded");
           load();
           clearInterval(loaded);
        }
     }, 100);
     function load(){
    	//  registerElement('aeris-theme', AerisTheme);
        registerElement('formater-alert-message', FormaterAlertMessage);
        registerElement('formater-attribution', FormaterAttribution);
        registerElement('formater-draggable-block', FormaterDraggableBlock);
    	  registerElement('formater-layout', FormaterLayout);
        registerElement('formater-select', FormaterSelect);
        registerElement('formater-temporal-search', FormaterTemporalSearch);
        registerElement('formater-search-box', FormaterSearchBox); // register last because it can contains other component
        registerElement('language-switcher', LanguageSwitcher);
        registerElement('formater-datepicker', FormaterDatepicker);
        registerElement('dragdrop-file', DragdropFile);

    }
})

