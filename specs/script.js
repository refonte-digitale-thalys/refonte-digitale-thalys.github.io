function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'themes': false,
			'epics': false,
			'stories': false,
			'comments': false,
			'modal': false
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {

					state[param] = payload[param]

					var themes = state['themes']
					var epics = state['epics']
					var stories = state['stories']
					var comments = state['comments']

					if (themes && epics && stories && comments ) {

						// all modules are loaded

						for (i in stories) {
							var story = stories[i]
	
							// Give a fake title to untitled stories
							if (!story.Titre) story.Titre = "(Sans Titre)"
	
							// 
							for (i in story['Commentaires']) {
								// for each story note, replace the note ID by the full note data
								story['Commentaires'][i] = comments.filter(obj => obj.airTableId  == story['Commentaires'][i] )[0]
								if (story['Commentaires'][i].hasOwnProperty('Commentaire')) {
									story['Commentaires'][i]['Commentaire'] = marked(story['Commentaires'][i]['Commentaire'])
								}
							}
						}
	
						for (i in epics) {
							var epic = epics[i]
							for (i in epic.stories) {
								epic.stories[i] = stories.filter(obj => obj.airTableId  == epic.stories[i] )[0]
							}
						}
					}
				}
			},
			openModal(state, payload) {
				state['modal'] = payload
			},
			closeModal(state) {
				state['modal'] = false
			}
		}
	})

	var airTable = new getAirTable(apiKey='keyiXWAznJ80FXmtW', appKey='appguOHxX26IPEDZ9')

	// Network Requests

	Vue.http.get(airTable.ListEndpoint('User Stories')).then((response) => {
		var data = airTable.Clean(response.body.records)
		store.commit('updateData', { 'stories': data })
	}) 

	Vue.http.get(airTable.ListEndpoint('Commentaires Backlog')).then((response) => {
		var data = airTable.Clean(response.body.records)
		store.commit('updateData', { 'comments': data })
	}) 

	Vue.http.get(airTable.ListEndpoint('User Epics')).then((response) => {
		var data = airTable.Clean(response.body.records)
		store.commit('updateData', { 'epics': data })
	}) 

	Vue.http.get(airTable.ListEndpoint('User Themes')).then((response) => {
		var data = airTable.Clean(response.body.records)
		store.commit('updateData', { 'themes': data })
	}) 


	// Components


	Vue.component('user-story', {
		props: ['story'],
		template : `
			<div class="story">
				<div class="story__container">
					<h4>{{ story['Titre'] }}</h4>
					<blockquote>
						«En tant que "{{ story['En tant que'] }}", je veux {{ story['Je veux'] }}<span v-if="story['Pourquoi']">, </span>{{ story['Pourquoi'] }}.»
					</blockquote>
					<div v-for="comment in story['Commentaires']">
						<div v-html="comment.Commentaire"></div>
						<div v-if="comment.Illustrations" class="illustrations">
							<span
								class="illustration"
								v-for="illustration in comment.Illustrations"
								>
								<img
									class="illustration__image"
									:src="illustration.thumbnails.small.url"
									v-on:click="openModal({'image': illustration.url })"
									/>
								<a :href="illustration.url" hidden>Voir</a>
							</span>
						</div>
					</div>
				</div>
			</div>
			`
	})

	Vue.component('user-epic', {
		props: ['epic'],
		template : `
			<div class="epic">
					<h3>{{ epic['Titre'] }}</h3>
					<user-story v-for="story in epic.stories" v-if="!story.Hide" :story="story"></user-story>
				</div>
			</div>
			`
	})



	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div id="app" class="stories" lang="fr">

				<user-epic v-for="epic in epics" v-if="!epic.Hide" :epic="epic"></user-epic>

				<div class="modal__wrapper" v-bind:class="{ deployed: modal }">
					<div v-if="modal" class="modal" v-on:click="closeModal()">
						<img class="modal__image" v-if="modal.image" :src="modal.image" />
					</div>
				</div>

			</div>
		
		`,
		computed: {
			epics () {
				return this.$store.state.epics
			},
			modal () {
				return this.$store.state.modal
			}
		},

		methods: {
			openModal: function(payload) {
				this.$store.commit('openModal', payload)
			},
			closeModal: function() {
				this.$store.commit('closeModal')
			}
		}

	})

}
