const VueToolsPlugin = {
		install(Vue, options) {
//		    Vue.prototype.$myAddedProperty = 'Example Property'
//		    Vue.prototype.$myAddedMethod = function() {
//		   	  return Vue.myAddedProperty
//		    }
		  function hexToRgb(hex) {
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? {
		      r: parseInt(result[1], 16),
		      g: parseInt(result[2], 16),
		      b: parseInt(result[3], 16)
		    } : null;
		  }
		   Vue.prototype.$shadeColor = function (color, percent) {  
		     var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		     // return "red";
		     return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
		   }
		   
		   Vue.prototype.$whiteOrBlack = function (color) {
		     var rgb = hexToRgb(color)
		     if (rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114 > 186 ) {
		       return '#000000'
		     } else {
		       return '#ffffff'
		     }
		   }
		   Vue.prototype.$buttonStyle = function (color) {
  	     return {
  	      background: color,
  	      borderColor: this.$shadeColor(color, 0.2),
  	      color: 'white'
  	     }
		   }
		   Vue.prototype.$hypens2camel = function (myString) {
		     return myString.replace(/(_|-)([a-z])/g, function (g) { return g[1].toUpperCase(); });
		   }
		   Vue.prototype.$getExtension = function (path) {
         var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
         // (supports `\\` and `/` separators)
         pos = basename.lastIndexOf(".")      // get last position of `.`
         
         if (basename === '' || pos < 1) {
         return ''
         }
         return basename.slice(pos + 1)
		   }
		}
};

export default VueToolsPlugin;