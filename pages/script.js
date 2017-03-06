function vueSetup() {

	window.store = new Vuex.Store({
		state: {
			'pages': pages,
		}
	})

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
				for (i in store.state.pages) {
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
		console.log(page)
		nodes.push(page[0])
	}

	nodes = nodes.filter( onlyUnique ) // get the unique page names

	new_pages = []

	console.log('nodes : ', nodes)

	for (i in nodes) {
		var nodeName = nodes[i]
		var nodePages = pages.filter(obj => obj[0] == nodeName)
		for (i in nodePages) {
			nodePages[i].splice(0,1)
		}
		if (!nodeName) {
			nodeName = '/'
			new_pages.push({'name': nodeName})
		} else {
			new_pages.push({'name': nodeName, 'pages': nodePages})
		}
	}

	console.log('new pages : ')
	for (i in new_pages) {
		console.log('	', new_pages[i].name)
	}
	console.log(new_pages)
	console.log('--------------------------------------------------')

	return new_pages

}

function treefy(pages) {
	var tree = branchify(pages)
	for (i in tree) {
		if (tree[i].hasOwnProperty('pages')) {
			console.log('DEBUGGING')
			console.log('test branchify : ', branchify(tree[i].pages))
			console.log(tree[i])
			tree[i]['pages'] = branchify(tree[i]['pages'])
			console.log(tree[i])
			console.log('--------------------------------------------------')
//		for (i in tree[i].pages) {
//			if (tree[i].pages[i].hasOwnProperty('pages')) {
//				tree[i].pages[i].pages = branchify(tree[i].pages[i].pages)
//			}
//		}
		}
	}
	return tree
}
