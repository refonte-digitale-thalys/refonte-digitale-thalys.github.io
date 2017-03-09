function vueSetup() {

	// Recursive page tree
	Vue.component('page-tree', {
		props: ['nodes'],
		template: `
			<div class="pages">
				<page-branch v-for="node in nodes" :node="node"></page-branch>
			</div>
		`
	})

	Vue.component('page-branch', {
		props: ['node'],
		template: `
			<div class="page">
				<input v-if="node.hasOwnProperty('children')" :id="makeId" class="page__checkbox" type="checkbox" checked />
				<label v-if="node.hasOwnProperty('children')" class="page__deploy" :for="makeId"></label>
				<span class="page__name" v-html="node.name"></span>
				<span class="page__count" v-if="node.count" v-html="node.count"></span>
				<span v-if="node.adress"><a class="chevron" :href="'https://' + node.adress" target="_blank">></a></span>
				<page-tree v-if="node.hasOwnProperty('children')" :nodes="node.children"></page-tree>
			</div>
		`,
		computed: {
			makeId: function() {
				return Math.random().toString().slice(2,14)
			},
		}
	})

	// App
	var app = new Vue({
		el: '.pages',
		template: `
			<div id="tree" class="app" lang="fr">
				<page-tree :nodes="[tree]"></page-tree>
			</div>
		`
	})

}