<template>
<span class="formater-draggable-block" v-show="visible">
<span class="close fa fa-close" @click="close" v-if="closeEnabled" :style="{color: textColor}"></span>
<h4  @mousedown="movestart" :style="{color: textColor, background: color}">{{title}}</h4>
<div><slot></slot></div>
</span>
</template>

<script>

export default {
  props:{
    title: {
      type: String,
      default: 'title'
    },
    id: {
      type: String,
      default: 'draggable-block'
    },
    show: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object,
      default: () => {return {x: 0, y: 20}}
    },
    color: {
      type: String,
      default: '#39B062'
    }
  },
  data () {
    return {
    //  aerisThemeListener: null,
      blockContentListener: null,
      mousemoveListener: null,
      mouseupListener: null,
      openBlockListener: null,
      closeBlockListenr: null,
      width: 300,
      selected: false,
      delta: {x: 0, y:0},
      pos: {x:0, y:0},
      top: 50,
      left: 50,
      right: null,
      closeEnabled: true,
      layerId: null,
      visible: false,
      parent: null
	  }
  },
  computed: {
    textColor () {
      return this.$whiteOrBlack(this.color)
    }
  },
  watch: {
    left (newval) {
      this.$el.style.left = newval + 'px'
    },
    top (newval) {
      this.$el.style.top = newval + 'px'
    },
    show (newval) {
      console.log('show change' + newval)
      this.visible = newval
    }
  },
  methods: {
  
    handleTheme (theme) {
     // this.color = theme.detail.primary
      if (this.$el) {
        this.$el.style.width = this.width + 'px'
      }
    },
    hide () {
      this.layerId = null
      this.visible = false
    },
    close () {
      var event = new CustomEvent('closeBlockEvent', {detail: {blockId: this.id, layerId: this.layerId}})
      document.dispatchEvent(event)
    },
    enableClose (evt) {
      // receive content
      if (this.$el.style.display === 'none' && 
          (evt.detail.layerId !== this.layerId && evt.detail.open))  {
        //open
        this.open(evt)
      }
      // enableClose if content corresponds to the layer
      if (evt.detail.layerId === this.layerId) {
        this.closeEnabled = true
      }
    },
    open (evt) {
      console.log(evt)
      if (evt.detail.blockId !== this.id){
        return
      }
      this.layerId = evt.detail.layerId
      this.visible = true
      this.top = evt.detail.top + 12
      this.left = evt.detail.left + 2
      this.closeEnabled = evt.detail.closeEnabled
    },
    movestart (evt) {
      this.selected = true
      this.delta = {
          x: this.pos.x - this.$el.offsetLeft,
          y: this.pos.y - this.$el.offsetTop
      }
    },
    move (evt) {
      // console.log(evt)
      this.pos.x = evt.clientX
      this.pos.y = evt.clientY
      if (this.selected) {
      	this.left = this.pos.x - this.delta.x
      	this.top = this.pos.y - this.delta.y
      }
    },
    moveEnd () {
      this.selected = false
    }
  },
  created () {
 	  this.blockContentListener = this.enableClose.bind(this) 
    document.addEventListener('blockContentEvent', this.blockContentListener)
	
	  this.openBlockListener = this.open.bind(this) 
    document.addEventListener('openBlockEvent', this.openBlockListener)
	
	  this.closeBlockListener = this.hide.bind(this) 
    document.addEventListener('closeBlockEvent', this.closeBlockListener)

	  this.mousemoveListener = this.move.bind(this)
    document.addEventListener('mousemove', this.mousemoveListener)
    this.mouseupListener = this.moveEnd.bind(this)
    document.addEventListener('mouseup', this.mouseupListener)
    
//     this.aerisThemeListener = this.handleTheme.bind(this) 
//     document.addEventListener('aerisTheme', this.aerisThemeListener)
    
//     var event = new CustomEvent('aerisThemeRequest', {})
//     document.dispatchEvent(event);
  
  },
  mounted () {
    this.visible = this.show
    if (this.position.left) {
      this.left = this.position.left
    }
    if (this.position.top) {
      this.top = this.position.top
    }
    this.handleTheme()
  },
  destroyed () {
    document.removeEventListener('blockContentEvent', this.blockContentListener)
    this.blockContentListener = null 
    document.removeEventListener('openBlockEvent', this.openBlockListener)
    this.openBlockListener = null
    document.removeEventListener('closeBlockEvent', this.closeBlockListener)
    this.closeBlockListener = null
    
    document.removeEventListener('mousemove', this.mousemoveListener)
    this.mousemoveListener = null
    document.removeEventListener('mouseup', this.mouseupListener)
    this.mouseupListener = null
    
//     document.removeEventListener('aerisTheme', this.aerisThemeListener)
//     this.aerisThemeListener = null
 
  }
}

</script>

<style>
.formater-draggable-block{
	position:absolute;
	top:50px;
	left:50px;
	z-index:2000;
	background:white;
	min-width:300px;
	min-height:100px;
	display:block;
	border-radius:5px;
	box-shadow: 0 1px 5px #888;
}
.formater-draggable-block h4{
   margin: 0;
   padding: 5px 5px 5px 10px;
   border-top-left-radius: 5px;
   border-top-right-radius: 5px;
   cursor: move;
}
.formater-draggable-block > div {
  padding: 10px;
}
.formater-draggable-block span.close{
	position:absolute;
	top:2px;
	right:3px;
	cursor: pointer;
}
</style>