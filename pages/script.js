function vueSetup() {

	// App
	var app = new Vue({
		el: '.pages',
		template: `
			<div class="pages" lang="fr">
				<div class="page" v-for="page in pages">
					<span v-html="page.name"></span>
					<div class="page" v-for="page in page.pages">
						<span v-html="page.name"></span>
						<div class="page" v-for="page in page.pages">
							<span v-html="page.name"></span>
							<div class="page" v-for="page in page.pages">
								<span v-html="page.name"></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		`,
		computed: {
			pages () {
				pages = pages.slice(0,100)
				for (i in pages) {
					pages[i] = pages[i].split('/')
				}
				pages = buildTree(pages)
				superTree(pages)
				return pages
			}
		}
	})

}

function onlyUnique(value, index, self) { 
	return self.indexOf(value) === index;
}

function buildTree(pages) {

	var nodes = []

	for (i in pages) { // get all different possible pages
		var page = pages[i]
		nodes.push(page[0])
	}

	nodes = nodes.filter( onlyUnique ) // get the unique page names

	new_pages = []

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

function superTree(pages) {
	for (i in pages) {
		pages[i].pages = buildTree(pages[i].pages)
	}
}