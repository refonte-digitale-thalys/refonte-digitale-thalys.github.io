function vueSetup() {

	// Recursive page tree
	Vue.component('page-tree', {
		props: ['pages'],
		template: `
			<div class="pages">
				<div class="page" v-for="page in pages">
					<input id="{{ _uid }}" class="page__checkbox" type="checkbox" />
					<label for="{{ _uid }}" class="page__name" v-html="page.name"></label>
					<page-tree v-if="page.pages" :pages="page.pages"></page-tree>
				</div>
			</div>
		`
	})


	// App
	var app = new Vue({
		el: '.pages',
		template: `
			<div id="tree" class="app" lang="fr">
				<page-tree :pages="tree"></page-tree>
			</div>
		`
	})

}