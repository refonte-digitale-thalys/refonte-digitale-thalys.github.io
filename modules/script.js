function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'modules': false,
			'notes': false,
			'modal': false
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]

					if (state['modules'] && state['notes']) {

						// once both modules and notes have been fetched, we match them
						var modules = state['modules']
						var notes = state['notes']

						for (i in modules) {
							let module = modules[i]
							for (i in module.Notes) {

								// for each module note, replace the note ID by the full note data
								module.Notes[i] = notes.filter(obj => obj.airTableId  == module.Notes[i] )[0]
								if (module.Notes[i].hasOwnProperty('Note')) {
									module.Notes[i].Note = marked(module.Notes[i].Note)
								}
			
							}
						}

						// Ordonne les modules
						state.modules.sort(function(a, b){
							a = parseInt(a.Ordre)
							b = parseInt(b.Ordre)
							return ((a < b) ? -1 : ((a > b) ? 1 : 0));
						})

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

	Vue.http.get(airTable.ListEndpoint('Modules')).then((response) => {
		var modules = airTable.Clean(response.body.records)
		store.commit('updateData', {'modules': modules})
	})

	Vue.http.get(airTable.ListEndpoint('Notes')).then((response) => {
		var notes = airTable.Clean(response.body.records)
		store.commit('updateData', {'notes': notes})
	})
	
	// App
	var app = new Vue({
		el: '.modules',
		store,
//		components: { 'newsletter': Newsletter },
		template: `

			<div class="modules" lang="fr">

				<div class="module" v-for="module in modules">
					<div class="module__container">
						<h2>{{ module.Name }}
							<span class="light" v-if="module.Composant">[Composant]</span>
							<span class="light" v-if="module.Assemblage">[Assemblage]</span>
							</h2>
						<div v-if="module.Composant" class="light-text">Ce module est un composant. Il n'existe pas seul et n'est affiché qu'en tant qu'élément d'un module.</div>
						<div v-if="module.Assemblage" class="light-text">Ce n'est qu'un assemblage de plusieurs composants. Il ne devrait pas nécessiter d'intégration spécifique.</div>
						<div class="note" v-for="note in module.Notes" v-html="note.Note"></div>
						<div v-if="module.IlluDesktop" class="illustrations">
							<span
								class="illustration"
								v-for="illustration in module.IlluDesktop"
								>
								<img
									class="illustration__image"
									:src="illustration.thumbnails.small.url"
									v-on:click="openModal({'image': illustration.url })"
									/>
								<a :href="illustration.url" hidden>Voir</a>
							</span>
						</div>
						<div v-else class="light-text">
							<p>Ce module ne dispose pas encore d'une illustration.</p>
						</div>
					</div>
				</div>

				<div class="modal__wrapper" v-bind:class="{ deployed: modal }">
					<div v-if="modal" class="modal" v-on:click="closeModal()">
						<img class="modal__image" v-if="modal.image" :src="modal.image" />
					</div>
				</div>

			</div>
		
		`,

		computed: {
			modules () {
				return this.$store.state.modules
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
