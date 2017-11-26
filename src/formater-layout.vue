
<template>	
	<span class="formater-layout">
	<header>
	<div class="formater-header">
		BCMT
	</div>
	</header>
	
	<div class="formater-wrapper">
		<aside>
		<div class="formater-sidebar">
			<bcmt-form></bcmt-form>
		</div>
		</aside>
		<main>
		<div class="formater-content">
			<bcmt-map></bcmt-map>
		</div>
		</main>
	</div>
	<footer>
	<div class="formater-footer">
		pied de page
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