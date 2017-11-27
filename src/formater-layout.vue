
<template>	
	<span class="formater-layout">
	<header>
	<div class="formater-header">
		<slot name="header"></slot>
	</div>
	</header>
	
	<div class="formater-wrapper">
		<aside>
		<div class="formater-sidebar">
			<slot name="sidebar"></slot>
		</div>
		</aside>
		<main>
		<div class="formater-content">
			<slot name="content"></slot>
		</div>
		</main>
	</div>
	<footer>
	<div class="formater-footer">
		<slot name="footer"></slot>
	</div>
	</footer>
	</span>
</template>


<style>
/*.formater-header{
	grid-aera: header;
	}
	.formater-sidebar{
		grid-aera: sidebar;
	}
	.formater-content{
		grid-aera: content;
	}
	.formater-footer{
		grid-aera: footer;
	}
.formater-layout{
	display: grid;
	grid-template-columns: 100%;
	
}*/
.formater-layout{
  width:100%;
  padding:3px;
}

.formater-layout .formater-header,
.formater-layout .formater-sidebar,
.formater-layout .formater-content,
.formater-layout .formater-footer{
	width:100%;
}

@media screen and (min-width:720px){
	/*.formater-layout{
		display: grid;
		grid-template-columns: 300px 0.9fr;
		grid-template-rows: auto auto auto;
		grid-template-areas:
		"header header
		sidebar content
		footer footer";
	}*/
	.formater-layout aside,
	.formater-layout main{
		display:inline-block;
	}
	.formater-layout .formater-header,
	.formater-layout .formater-footer{
		width:100%;
		clear:both;
	}
	.formater-layout .formater-wrapper{
		text-align:center;
	}

	.formater-layout .formater-sidebar{
		display:inline-block;
		text-align:left;
		vertical-align:top;
		width:300px;
	}
	.formater-layout .formater-content{
		display:inline-block;
		text-align:left;
		vertical-align:top;
		width:320px;
	}

}

@media screen and (min-width:1024px){
	.formater-layout .formater-content{
		width:720px;
	}
}
</style>