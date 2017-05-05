function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'themes': false,
			'epics': false,
			'stories': false,
			'modal': false
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]
				}
			},
			openModal(state, payload) {
				state['modal'] = payload
			},
			closeModal(state) {
				state['modal'] = false
			},
			toggleStory(state, story) {
				if (story.expanded) state.stories[story.airTableId].expanded = false
				else state.stories[story.airTableId].expanded = true
			}
		}
	})

	var airTable = new getAirTable(apiKey='keyiXWAznJ80FXmtW', appKey='appguOHxX26IPEDZ9')

	// Network Requests

	Vue.http.get(airTable.ListEndpoint('User Stories')).then((response) => {
		var data = airTable.Clean(response.body.records)
		store.commit('updateData', { 'stories': data })
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
			<div v-if="!story.Hide">
				<div v-if="story.expanded" class="story story--expanded">
					<h4 class="story__title">#{{ story['ID']}} {{ story['Titre'] }}</h4>
					<table>
						<tr>
							<th colspan=2>Environnement</th>
							<th colspan=4>Langues</th>
							<th colspan=6>Scope</th>
						</tr>
						<tr>
							<td colspan=2>thalys.com</td>
							<td colspan=1>FR</td>
							<td colspan=1>DE</td>
							<td colspan=1>EN</td>
							<td colspan=1>NL</td>
							<td colspan=2>mobile</td>
							<td colspan=2>tablette</td>
							<td colspan=2>desktop</td>
						</tr>
						<tr>
							<td colspan=12 class="table-separator"></td>
						</tr>
						<tr>
							<th colspan=3>Owner</th>
							<th colspan=3>Statut</th>
							<th colspan=3>Valeur</th>
							<th colspan=3>Complexité</th>
						</tr>
						<tr>
							<td colspan=3>Antonin</td>
							<td colspan=3>{{ story['Statut'] }}</td>
							<td colspan=3>{{ story['Valeur'] }}</td>
							<td colspan=3>{{ story['Complexité'] }}</td>
						</tr>
					</table>
					<blockquote class="story__quote">
						«En tant que "{{ story['En tant que'] }}", je veux {{ story['Je veux'] }}<span v-if="story['Pourquoi']">, </span>{{ story['Pourquoi'] }}.»
					</blockquote>
					<div v-html="marked(story['Présentation'])" class="story__detail__text"></div>
					<div v-if="story.Illustrations" class="story__detail__illustrations illustrations">
						<span
							class="illustration"
							v-for="illustration in story['Illustrations']"
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
				<div v-else class="story story--retracted" v-on:click="toggleStory(story)">
					#{{ story['ID']}} {{ story['Titre'] }}
				</div>
			</div>
			`,
		computed: {
			marked() { return window.marked }
		},
		methods: {
			openModal: function(payload) {
				this.$store.commit('openModal', payload)
			},
			toggleStory: function(story) {
				story = this.$store.state.stories[story.airTableId]
				this.$store.commit('toggleStory', story)
				console.log(story.expanded)
			}
		}
	})

	Vue.component('user-epic', {
		props: ['epic', 'stories'],
		template : `
			<div class="epic" v-if="!epic.Hide">
				<h3 class="epic__title">{{ epic['Titre'] }}</h3>
				<user-story
					v-for="storyId in epic['User Stories']"
					key="storyId"
					v-if="stories.hasOwnProperty(storyId)"
					:story="stories[storyId]"
					></user-story>
			</div>
			`
	})

	Vue.component('user-theme', {
		props: ['theme', 'epics', 'stories'],
		template : `
			<div class="theme" v-if="!theme.Hide">
				<h2 class="theme__title">{{ theme['Titre'] }}</h2>
				<p v-if="theme['Story']">{{ theme['Story']}}</p>
				<user-epic
					v-for="epicId in theme['User Epics']"
					key="epicId"
					v-if="epics.hasOwnProperty(epicId)"
					:epic="epics[epicId]"
					:stories="stories"
					></user-epic>
			</div>
			`
	})

	Vue.component('popin-modal', {
		props: ['modal'],
		template : `
			<div class="modal__wrapper" v-bind:class="{ deployed: modal }">
				<div v-if="modal" class="modal" v-on:click="closeModal()">
					<img class="modal__image" v-if="modal.image" :src="modal.image" />
				</div>
			</div>
			`,
		methods: {
			closeModal: function() {
				this.$store.commit('closeModal')
			}
		}
	})



	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div id="app" lang="fr">

				<h1>Les parcours de la Refonte Digitale</h1>

				<user-theme
					v-for="theme in state.themes"
					key="theme.airTableId"
					:theme="theme"
					:epics="state.epics"
					:stories="state.stories"
					></user-theme>

				<popin-modal
					:modal="state.modal"
					></popin-modal>

			</div>
		
		`,
		computed: {
			state() { return this.$store.state },
			modal () {
				return this.$store.state.modal
			}
		}

	})

}
