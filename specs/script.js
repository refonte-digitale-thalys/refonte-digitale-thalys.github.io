function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'themes': false,
			'epics': false,
			'stories': false,
			'comments': false
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]

					if (state['stories'] && state['comments']) {
						var stories = state['stories']
						var comments = state['comments']
						for (i in stories) {
							var story = stories[i]

							// Give a fake title to untitled stories
							if (!story.Titre) story.Titre = "(Sans Titre)"

							// 
							for (i in story['Commentaires']) {
								// for each story note, replace the note ID by the full note data
								console.log('reading comments for a story')
								story['Commentaires'][i] = comments.filter(obj => obj.airTableId  == story['Commentaires'][i] )[0]
								if (story['Commentaires'][i].hasOwnProperty('Commentaire')) {
									story['Commentaires'][i]['Commentaire'] = marked(story['Commentaires'][i]['Commentaire'])
								}
							}

						}
					}
				}
			}
		}
	})

	var airTable = new getAirTable(apiKey='keyiXWAznJ80FXmtW', appKey='appguOHxX26IPEDZ9')

	Vue.http.get(airTable.ListEndpoint('User Stories')).then((response) => {
		var stories = airTable.Clean(response.body.records)
		store.commit('updateData', {'stories': stories})
	})

	Vue.http.get(airTable.ListEndpoint('Commentaires Backlog')).then((response) => {
		var comments = airTable.Clean(response.body.records)
		store.commit('updateData', {'comments': comments})
	})
	
	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div id="app" class="stories" lang="fr">

				<div class="story" v-for="story in stories" v-if="!story.Hide">
					<div class="story__container">
						<h4>{{ story['Titre'] }}</h4>
						<blockquote>
							En tant qu'{{ story['En tant que'] }}, je veux {{ story['Je veux'] }}<span v-if="story['Pourquoi']">, </span>{{ story['Pourquoi'] }}.
						</blockquote>
						<div v-for="comment in story['Commentaires']">
							<div v-html="comment.Commentaire"></div>
							<div v-if="comment.Illustrations" class="illustrations">
								<a
									class="illustration"
									v-for="illustration in comment.Illustrations"
									:href="illustration.url" target='_story'
									>
									<img class="illustration__image" :src="illustration.thumbnails.small.url" />
								</a>
							</div>
						</div>
					</div>
				</div>

			</div>
		
		`,
		computed: {
			stories () {
				return this.$store.state.stories
			}
		}
	})

}