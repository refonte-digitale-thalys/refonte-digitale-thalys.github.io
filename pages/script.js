function vueSetup() {

	// Recursive page tree
	Vue.component('page-tree', {
		props: ['pages'],
		template: `
			<div class="pages">
				<div class="page" v-for="page in pages">
					<span class="page__name" v-html="page.name"></span>
					<page-tree v-if="page.pages" :pages="page.pages"></page-tree>
				</div>
			</div>
		`
	})


	// App
	var app = new Vue({
		el: '.pages',
		template: `
			<div class="app" lang="fr">
				<page-tree :pages="pages"></page-tree>
			</div>
		`,
		computed: {
			pages () {
				for (i in pages) {
					pages[i] = pages[i].split('/')
				}
				pages = treefy(pages)
				return pages
			}
		}
	})

}

function onlyUnique(value, index, self) { 
	return self.indexOf(value) === index;
}

function branchify(pages) {

	console.log('branchifying : ', pages)

	var nodes = []

	for (i in pages) { // get all different possible pages
		var page = pages[i]
		nodes.push(page[0])
	}

	nodes = nodes.filter( onlyUnique ) // get the unique page names

	new_pages = []

	console.log(nodes)

	for (i in nodes) {
		var nodeName = nodes[i]
		var nodePages = pages.filter(obj => obj[0] == nodeName)
		for (i in nodePages) {
			nodePages[i].splice(0,1)
		}
		if (!nodeName) { nodeName = '/'}
		new_pages.push({'name': nodeName, 'pages': nodePages})
	}
	return new_pages

}

function treefy(pages) {
	pages = branchify(pages)
	for (i in pages) {
		if (pages[i].hasOwnProperty('pages')) {
			pages[i].pages = branchify(pages[i].pages)
			for (i in pages[i].pages) {
				if (pages[i].pages[i].hasOwnProperty('pages')) {
					pages[i].pages[i].pages = branchify(pages[i].pages[i].pages)
				}
			}
		}
	}
	return pages
}