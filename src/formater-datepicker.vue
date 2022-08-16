<i18n>
{
  "en": {
    "january": "January",
    "february": "February",
    "march": "March",
    "april": "April",
    "may": "May",
    "june": "June",
    "july": "July",
    "august": "August",
    "september": "September",
    "october": "October",
    "november": "November",
    "december": "December",
    "today": "Today",
    "mon": "Mon",
    "tue": "Tue",
    "wed": "Wed",
    "thu": "Thu",
    "fri": "Fri",
    "sat": "Sat",
    "sun": "Sun"
  },
  "fr": {
  	"january": "Janvier",
    "february": "Février",
    "march": "Mars",
    "april": "Avril",
    "may": "Mai",
    "june": "Juin",
    "july": "Juillet",
    "august": "Août",
    "september": "Septembre",
    "october": "Octobre",
    "november": "Novembre",
    "december": "Decembre",
    "today": "Aujourdhui",
    "mon": "Lun",
    "tue": "Mar",
    "wed": "Mer",
    "thu": "Jeu",
    "fri": "Ven",
    "sat": "Sam",
    "sun": "Dim"
  }
}
</i18n>
<template>
<span class="aeris-datepicker-host" v-show="visible">

<div class="dp-container unselectable">

<header class="dp-header" :style="{background: color}">
			<div class="dp-header-left dp-header-button" @click="prevMonth" :class="firstMonth?'disable':''">
				<i class="fa fa-chevron-left"></i>
			</div>
			<div class="dp-header-central">
				<div class="dp-current-date">
					<h5>{{currentSelectedYear}}</h5>
					<h2>{{currentSelectedMonth}}</h2>
				</div>
			</div>
			<div class="dp-header-right dp-header-button" @click="nextMonth" :class="lastMonth?'disable':''">
				<i class="fa fa-chevron-right"></i>
			</div>
</header>

<main class="dp-main">
<div class="dp-title-line">
  <span class="dp-day" v-for="item in allDays">{{$t(item)}} </span>
</div>
<div class="dp-main-calendar">
   <div class="dp-day" v-for="item in offsetBefore"></div>
	<div class="dp-day " :class="computeDayClass(item)" v-for="item in monthDays" @click="clickDay">{{item.date()}}</div>
</div>
<div class="dp-selectors dp-hours" v-if="hasHour" :style="{color: color}">
<select id="hourSelect" :style="{color: color}" v-model="selectedHour" @change="refreshHour">
	<option :value="id" v-for="id in allHours">{{ id }}</option>
</select> :
<select id="minSelect" :style="{color: color}" v-model="selectedMin" @change="refreshHour">
	<option :value="id" v-for="id in allMins">{{ id }}</option>
</select>
</div>
</main>

<footer class="dp-footer">

<div class="today-button" :style="{color: color}" @click="setToToday" v-if="hasToday">{{$t('today')}}</div>
<div class="dp-selectors" >
<select id="monthSelect" :style="{color: color}" v-model="selectedMonth" @change="refreshMonth">
	<option :value="id" v-for="id in allMonthId">{{$t(allMonths[id])}}</option>
</select>
<select id="yearSelect" :style="{color: color}" v-model="selectedYear" @change="refreshYear">
	<option :value="item" v-for="item in allYears">{{item}}</option>
</select>
</div>
</footer>


</div>

</span>
</template>

<script>
import moment from 'moment'
import { extendMoment } from 'moment-range';
extendMoment(moment);
export default {
  props: {
	
		lang:  {
			type: String,
			default: 'en'
		},	  
		format:  {
			type: String,
			default: 'DD/MM/YYYY'  
		},
	 	for: {
			type: String,
			default:''
  	},
  	after: {
			default: true,
			type: Boolean
  	},
		daymin:{
			type: String,
			default:"1970-01-01",
			
		},
		daymax:{
			type: String,
			default:null,	
		},
		color: {
		  type: String,
		  default: '#39B062'
		}
  },
  data () {
    return {
    	currentDate: moment(),
    	selected: null,
    	allDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        allMonths:  ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        allHours:[ "00", "01"],
        allMins: [ "00"],
        calendarElement: null,
        selectedYear: moment().year(),
        selectedMonth: moment().month(),
        selectedHour: "00",
        selectedMin: "00",
        targetElement: null,
        visible: false,
        clickListener: null,
        closeListener:null,
        aerisThemeListener: null,
        targetChecker : null,
        lastMonth: false,
        firstMonth: false,
        isActualMonth: true
    }
  },
  
  watch: {
	  visible: function(val) {
		  if (val) {
			  this.styleDays();
		  }
	  },
	  lang (value) {
	      this.$i18n.locale = value
	  }
  },
  
  destroyed: function() {
	  document.removeEventListener('mousedown', this.clickListener);
	  this.clickListener = null;
	  document.removeEventListener('keypress', this.closeListener);
	  this.closeListener = null;
// 	  document.removeEventListener('aerisTheme', this.aerisThemeListener);
// 	  this.aerisThemeListener = null;
  },
  
  created: function() {
	  this.$i18n.locale = this.lang
	  this.clickListener = this.closeOnClick.bind(this)
      document.addEventListener('mousedown', this.clickListener);
	  this.closeListener = this.close.bind(this)
      document.addEventListener('keypress', this.closeListener);
// 	  this.aerisThemeListener = this.handleTheme.bind(this) 
// 	  document.addEventListener('aerisTheme', this.aerisThemeListener);
	  this.allHours = this.geneTime( 0, 23);
	  this.allMins = this.geneTime( 0, 59);
  },
  
  mounted: function () {
	  var event = new CustomEvent('aerisThemeRequest', {});
	  	document.dispatchEvent(event);
	    this.$el.addEventListener('mousedown', function(e) {
          e.stopPropagation();
        });
	  
	  this.targetChecker = setInterval(this.lookForTarget.bind(this), 1000);
	  
	  },
  
  computed: {
	  
	  dateMin(){
		  return moment(this.daymin, "YYYY-MM-DD");

	  },
	  dateMax(){
		  if(!this.daymax ){
			  var date = moment( (moment().year()+10)+"-12-31", "YYYY-MM-DD");
		  }else  if( this.daymax.toLowerCase() == "now"){
			  var date = moment();
		  }else{
			  var date = moment( this.daymax, "YYYY-MM-DD");
		  }
		  return date;
	  },
	  hasHour(){
		  if( this.format.toLowerCase().indexOf("h") >=0){
			  return true;
		  }else{
			  return false;
		  }
	  },
	  hasToday(){
		  var nowmoins = moment().subtract(1, "days");
		  var nowplus = moment().add(1, "days");
		  if( nowmoins.isBefore( this.dateMax) && nowplus.isAfter( this.dateMin)){
			  return true;
		  }else{
			  return false;
		  }
	  },
	  allMonthId(){
		  var alls = [0,1,2,3,4,5,6,7,8,9,10,11];
		  if( this.dateMax.year() == this.currentSelectedYear){
			  var endMonth = this.dateMax.month();
			  return alls.slice(0, endMonth+1); 
		  }
		  if( this.dateMin.year() == this.currentSelectedYear){
			  var firstMonth = this.dateMin.month();
			  return alls.slice( firstMonth, 12);
		  }
		  return  alls;
	  },
	  allYears: function() {
	      var maxYear = this.dateMax.year();
	      var minYear = this.dateMin.year();
		  var result = [];
	
	      for(var i = maxYear; i >= minYear; i--) {
	        result.push(i);
	      }
	      return result;
	  },
	  
	  start: function() {return this.currentDate.date(1)},
	  end: function() { return this.currentDate.clone().endOf('month')},
	  monthDays: function() {
		  var range = moment.range(this.start, this.end)
		  var result = []
		  for (let day of range.by('days')) {
			 result.push(day);
		  }
		  return result;
	  },
	  
	  offsetBefore: function() {
		  var weekDay = this.start.day() - 1;
		  if(weekDay === -1) weekDay = 6;
		  var result = []
		  for(var i = 0; i < weekDay; i++) {
			  result.push('blank');
		  }
		  return result 
	  },
	  
	  
	  currentSelectedYear: function() {
		  return this.currentDate.year();
	  },
	  
	  currentSelectedMonth: function() {
		  this.computeMonthsBounds( this.currentDate);
		  var ind = this.currentDate.month();
		  return this.$t(this.allMonths[ind]);
	  }
  },
  methods: {
	  
	  lookForTarget : function() {
		  
		  var el = document.querySelector(this.for);
		  if(el) {
		       this.targetElement = el;
		        console.info("Target trouvée pour "+this.for)
		       // el.addEventListener('mousedown', this.show.bind(this));
		        clearInterval(this.targetChecker);
		      }
		  else {
			  console.info("Target non trouvée pour "+this.for+"...")
		  }
	  },
	  
	  
	  handleTheme: function(theme) {
	  		this.theme = theme.detail
			this.ensureTheme()
	  },
	  	
 	  ensureTheme: function() {
		 	if ((this.$el) && (this.$el.querySelector) && this.theme) {
		 		this.$el.querySelector(".dp-header").style.background=this.theme.emphasis
		 		if( this.hasToday){
		 			this.$el.querySelector(".dp-footer .today-button").style.color=this.theme.emphasis
		 		}
		 		this.$el.querySelector(".dp-selectors #monthSelect").style.color=this.theme.emphasis
		 		this.$el.querySelector(".dp-selectors #yearSelect").style.color=this.theme.emphasis
		 		
		 		if( this.hasHour){
		 			this.$el.querySelector(".dp-selectors #hourSelect").style.color=this.theme.emphasis
		 			this.$el.querySelector(".dp-selectors #minSelect").style.color=this.theme.emphasis
		 			this.$el.querySelector(".dp-main .dp-hours.dp-selectors").style.color = this.theme.emphasis
		 		}
		 	}
 	  },
 	  styleDays(){
	    	this.$el.querySelectorAll(".dp-day").forEach( function( day){
	 			 day.style.color = "";
	 		 })
	 		 if( this.$el.querySelector(".dp-day.day-selected")){
		 			this.$el.querySelector(".dp-day.day-selected").style.borderColor=this.color;
		 	 }
	 		 
	 		if(  this.$el.querySelector(".dp-day.is-today")){
	 			this.$el.querySelector(".dp-day.is-today").style.color=this.color;
	 	 	}
 	  },
	  geneTime: function(begin, end){
		    var times = new Array();
			for(var i=begin; i <= end; i++){
				var num = i < 10 ? ("0"+i) : (""+i);
				times.push( num);
			}
			return times;
	  },
	  isDescendant: function(parent, child) {
		     var node = child.parentNode;
		     while (node != null) {
		         if (node == parent) {
		             return true;
		         }
		         node = node.parentNode;
		     }
		     return false;
	  },
	  close: function(e){
		  var aux = e.target
		  if( aux == this.targetElement){
			  this.visible = false;
			
		  }
	  },
	  closeOnClick: function(e) {
		  var aux = e.target
		  if( aux == this.targetElement){
			  this.show();
			  return;
		  }
		  if (!(this.isDescendant(this.$el, aux))) {
	        	this.visible=false;
	        }
	      },
	  
	  show: function( ) {
		  this.visible = !this.visible;
		  if( this.visible){
			  var date = moment( this.targetElement.value, this.format);
			  this.setDefaultDate( date);
			 
		  }
	  },

	  setDefaultDate( date){
		  if( !date.isValid()){
			 date = moment();
		  }
		  if(date.isBefore(this.dateMin)){
			  this.setCurrentDate( this.dateMin);
		  }else if( date.isAfter( this.dateMax)){
			  this.setCurrentDate(this.dateMax);
		  }else{
			  this.setCurrentDate( date);
		  }
		  this.selected = moment( this.currentDate);
	  },
	  refreshYear(){
		  var date = this.currentDate.clone();
		  date.month(this.selectedMonth);
		  date.year(this.selectedYear);
		  if( date.isBefore( this.dateMin)){
			  date.month( this.dateMin.month());
		  }
		  if( date.isAfter(this.dateMax)){
			  date.month( this.dateMax.month());
		  }
		  this.slideTo(date);

	  },
	  
	  refreshMonth() {
		  var date = this.currentDate.clone();
	      date.month(this.selectedMonth);
		  date.year(this.selectedYear);
		  this.refreshHour(date);
		  this.slideTo( date);
	  },
	  refreshHour( ){
		  var date = this.currentDate.clone();
	
		  if( this.hasHour){
			  date.hour( this.selectedHour );
			  date.minutes(  this.selectedMin );
		  }
		  this.setCurrentDate(date);
	  },
	  
	  computeDayClass: function(day) {
			var classes = (day.isBefore( this.dateMin) || day.isAfter(this.dateMax)) ? 'disabled' : 'clickable';
			
			if( this.isActualMonth)
				classes += moment().isSame( day, 'days') ? ' is-today' : '';
			classes += day.isSame(this.selected, 'days') ? ' day-selected' : '';
			return classes;
	  	},    
	  computeMonthsBounds: function(date){
		  if(date.year()== this.dateMax.year() && date.month()== this.dateMax.month()){
		    	this.lastMonth = true;
		    }else{
		    	this.lastMonth = false;
		    }
		  if(date.year() == this.dateMin.year() && date.month() == this.dateMin.month()){
			  this.firstMonth = true;
		  }else{
			  this.firstMonth = false;
		  }
	  },
	  setCurrentDate: function(date) {
		    
	        if(date && date.isValid()) {
	          this.currentDate = moment(date);
	          
	        } else {
	          this.currentDate = moment();
	        }

	        this.isActualMonth = moment().isSame( this.currentDate, 'month');
	        this.selectedMonth = this.currentDate.month();
	        this.selectedYear = this.currentDate.year();
	        if( this.hasHour){
	        	this.selectedHour = this.currentDate.format("HH");
	        	this.selectedMin = this.currentDate.format("mm");
	        }
	        //wait all displayed for style
	        window.setTimeout( this.styleDays, 0);
	  },

	      
      setToToday: function() {
          this.selected = moment();
          this.setCurrentDate(this.selected);
          this.setTarget();
        },
        
        setTarget : function() {
        	this.targetElement.value = this.selected.format(this.format);
        	this.visible=false;
        	var event = new InputEvent('input');
        	this.targetElement.dispatchEvent(event);
        },
        
        clickDay: function(e) {
        	var isClickable = [].slice.call(e.target.classList).indexOf('clickable') >= 0 ? true : false;
			if(isClickable) {
				var ele = e.currentTarget || e.srcElement;
				var day = ele.innerText;
				var date = moment({
					year :this.currentDate.year(),
					month :this.currentDate.month(),
					day :parseInt(day),
					hour: this.currentDate.hour(),
					minutes: this.currentDate.minutes()})
				
				this.selected = moment(date);
				this.setCurrentDate(date);
				this.setTarget();
			}
        },
	  slideTo( date){
        	if( date.isBefore( this.currentDate)){
        		this.slideLeftTo( date );
        	}else{
        		this.slideRightTo( date);
        	}
        	
        },
      slideLeftTo( date){
        	var titleEl = this.$el.querySelector('.dp-current-date');
	        var calendarEl = this.$el.querySelector('.dp-main-calendar');

	        titleEl.classList.add('slideOutRight');
	        calendarEl.classList.add('slideOutTop');

	        window.setTimeout(function() {
	          titleEl.classList.remove('slideOutRight');
	          calendarEl.classList.remove('slideOutTop');
	          this.setCurrentDate(date);
	          titleEl.classList.add('slideInLeft');
	          calendarEl.classList.add('slideInBottom');
	        }.bind(this), 200);

	        window.setTimeout(function() {
	          titleEl.classList.remove('slideInLeft');
	          calendarEl.classList.remove('slideInBottom');
	        }.bind(this), 600);
      },
      slideRightTo(date){
    	  
	        var titleEl = this.$el.querySelector('.dp-current-date');
	        var calendarEl = this.$el.querySelector('.dp-main-calendar');

	        titleEl.classList.add('slideOutLeft');
	        calendarEl.classList.add('slideOutBottom');

	        window.setTimeout(function() {
	          titleEl.classList.remove('slideOutLeft');
	          calendarEl.classList.remove('slideOutBottom');
	         
	          this.setCurrentDate(date);
	          titleEl.classList.add('slideInRight');
	          calendarEl.classList.add('slideInTop');
	        }.bind(this), 200);

	        window.setTimeout(function() {
	          titleEl.classList.remove('slideInRight');
	          calendarEl.classList.remove('slideInTop');
	        }.bind(this), 600);
    	  
      },
	  prevMonth: function() {
		    var date = moment( this.currentDate).subtract(1, 'months');
		    this.slideTo( date );
	  },

	  nextMonth: function() {
		    var date = moment( this.currentDate).add(1, 'months');
		    this.slideTo( date );
	        
	  },  
  }
}
</script>

<style>
.aeris-datepicker-host {
	display: block;
	position: absolute;
	z-index: 999;
	font-family: 'Open Sans', sans-serif;
	transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	transform: scale(1);
	opacity: 1;
	transform-origin: top left;
}

.aeris-datepicker-host div {
	box-sizing: border-box;
}

.aeris-datepicker-host.hidden {
	transform: scale(0);
	opacity: 0;
}

.unselectable {
	-moz-user-select: -moz-none;
	-khtml-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.dp-container {
	display: flex;
	flex-flow: column nowrap;
	min-width: 17em;
	border: #4765A0;
	box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.1);
}

.dp-header {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	background-color: #4765A0;
	color: #fff;
}

.dp-header .dp-header-button {
	cursor: pointer;
	pointer-events:auto;
}

.dp-header .dp-header-button.disable{
	cursor: none;
	opacity: 0;
	pointer-events:none;
}
.dp-header .dp-header-button:hover {
	opacity: 0.6;
}

.dp-header .dp-current-date {
	padding: 0 10px;
	transition: 0.3s;
}

.dp-header .dp-current-date h2,
.dp-header .dp-current-date h5 {
	margin: 5px 0;
	font-weight: normal;
}

.dp-header .dp-current-date h2 {
	font-size: 30px;
	opacity: 1;
}

.dp-header .dp-current-date h5 {
	opacity: 0.7;
}

.dp-main {
	padding: 10px;
	background-color: #FFF;
}

.dp-main .dp-title-line,
.dp-main .dp-main-calendar {
	display: flex;
	justify-content: flex-start;
	flex-flow: row nowrap;
	width: 210px;
	margin: 0 auto;
}

.dp-main .dp-title-line {
	font-size: 12px;
}

.dp-main .dp-main-calendar {
	flex-wrap: wrap;
	align-items: flex-start;
	font-size: 14px;
}

.dp-main .dp-day {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
}

.dp-main .disabled {
	color: #bbb;
}

.dp-main .clickable {
	position: relative;
}

.dp-main .clickable:hover {
	cursor: pointer;
}

.dp-main .clickable:hover:after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: #4765A0;
	border-radius: 50%;
	opacity: 0.1;
}

.dp-main .is-today {
	color: #4765A0;
	font-weight: 700;
}

.dp-main .day-selected {
	border: 2px solid #4765A0;
	border-radius: 50%;
}
.dp-main .dp-hours.dp-selectors{
	line-height:24px;
	color: #4765A0;
	margin-top:5px;
	font-size:12px;
}
.dp-main .dp-hours.dp-selectors select{
	font-size:12px;
	margin: 0 4px;
	padding: 1px 8px;
	border: 1px solid;
	
	color: #4765A0;
	outline: none;
}
.dp-footer {
	padding: 10px;
	background-color: #FFF;
}

.dp-footer .today-button {
	padding: 5px 10px;
	border: 1px solid;
	text-align: center;
	color: #4765A0;
}

.dp-footer .today-button:hover {
	cursor: pointer;
}

.dp-selectors {
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	text-align: center;
	margin-top: 10px;
}

.dp-selectors select {
	display: block;
	margin: 2px;
	padding: 5px 10px;
	font-size: 14px;
	background-color: transparent;
	border: 1px solid;
	color: #4765A0;
	outline: none;
}

.dp-selectors select option {
	color: #333;
}

.slideInRight {
	animation-name: slideInRight;
	animation-duration: 0.3s;
}

@keyframes slideInRight {
	from {
		transform: translate(50px);
		opacity: 0;
	}

	to {
		transform: translate(0);
		opacity: 1;
	}
}

.slideOutRight {
	animation-name: slideOutRight;
	animation-duration: 0.3s;
}

@keyframes slideOutRight {
	from {
		transform: translate(0);
		opacity: 1;
	}

	to {
		transform: translate(50px);
		opacity: 0;
	}
}

.slideInLeft {
	animation-name: slideInLeft;
	animation-duration: 0.3s;
}

@keyframes slideInLeft {
	from {
		transform: translate(-50px);
		opacity: 0;
	}

	to {
		transform: translate(0);
		opacity: 1;
	}
}

.slideOutLeft {
	animation-name: slideOutLeft;
	animation-duration: 0.3s;
}

@keyframes slideOutLeft {
	from {
		transform: translate(0);
		opacity: 1;
	}

	to {
		transform: translate(-50px);
		opacity: 0;
	}
}

.slideInBottom {
	animation-name: slideInBottom;
	animation-duration: 0.6s;
}

@keyframes slideInBottom {
	from {
		transform: translateY(10px);
		opacity: 0;
	}

	to {
		transform: translateY(0);
		opacity: 1;
	}
}

.slideOutBottom {
	animation-name: slideOutBottom;
	animation-duration: 0.6s;
}

@keyframes slideOutBottom {
	from {
		transform: translateY(0);
		opacity: 1;
	}

	to {
		transform: translateY(10px);
		opacity: 0;
	}
}

.slideInTop {
	animation-name: slideInTop;
	animation-duration: 0.6s;
}

@keyframes slideInTop {
	from {
		transform: translateY(-10px);
		opacity: 0;
	}

	to {
		transform: translateY(0);
		opacity: 1;
	}
}

.slideOutTop {
	animation-name: slideOutTop;
	animation-duration: 0.6s;
}

@keyframes slideOutTop {
	from {
		transform: translateY(0);
		opacity: 1;
	}

	to {
		transform: translateY(-10px);
		opacity: 0;
	}
}
</style>