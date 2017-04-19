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
			<div class="story" v-if="!story.Hide">
				<h4 class="story__title">{{ story['Titre'] }}</h4>
				<blockquote>
					«En tant que "{{ story['En tant que'] }}", je veux {{ story['Je veux'] }}<span v-if="story['Pourquoi']">, </span>{{ story['Pourquoi'] }}.»
				</blockquote>
				<div v-for="comment in story['Commentaires']" key="comment.airTableId">
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
			`
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
			`
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
