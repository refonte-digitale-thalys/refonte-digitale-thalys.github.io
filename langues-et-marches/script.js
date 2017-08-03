function vueSetup() {


	// Store

	window.store = new Vuex.Store({
		state: {
			'url': {'slug': 'url', 'value': false},
				'urlLanguage': {'slug': 'urlLanguage', 'value': 'fr'},
				'urlCountry': {'slug': 'urlCountry', 'value': 'FR'},
			'account': {'slug': 'account', 'value': false},
				'accountLanguage': {'slug': 'accountLanguage', 'value': 'fr'},
				'accountCountry': {'slug': 'accountCountry', 'value': 'FR'},
			'cookie': {'slug': 'cookie', 'value': false},
				'cookieLanguage': {'slug': 'cookieLanguage', 'value': 'fr'},
				'cookieCountry': {'slug': 'cookieCountry', 'value': 'FR'},
			'browserLanguage': {'slug': 'browserLanguage', 'value': 'fr'},
			'ipCountry': {'slug': 'ipCountry', 'value': 'FR'},
			'results': {'language': 'fr', 'market': 'FR', 'message': false}
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]
				}
			},
			updateResults(state) {
				state.results = evaluateResults(state)
			}
		}
	})


	// Components

	Vue.component('results-dashboard', {
		props: ['results'],
		template : `
			<div class="alert alert-info">
				<h4 class="alert-heading">
					Page affichée en langue
					<strong>{{ results.language }}</strong>
					et marché
					<strong>{{ results.market }}</strong>
				</h4>
				<span v-if="results.message" v-html="marked(results.message)"></span>
			</div>
			`,
		computed: { marked() { return marked }, }
	})	

	Vue.component('language-selector', {
		props: ['input'],
		template : `
			<div class="form-group row">
				<label :for="input.slug" class="col-2 col-form-label">Langue</label>
				<select required class="col-10 form-control" v-model="input.value" @change="commit('updateResults')" :id="input.slug" :name="input.slug">
					<option>de</option>
					<option>en</option>
					<option>fr</option>
					<option>nl</option>
				</select>
			</div>
			`,
		methods : {
			commit : window.store.commit
		}
	})

	Vue.component('country-selector', {
		props: ['input'],
		template : `
			<div class="form-group row">
				<label :for="input.slug" class="col-2 col-form-label">Pays</label>
				<select required class="col-10 form-control" v-model="input.value" @change="commit('updateResults')" :id="input.slug" :name="input.slug">
					<option>DE</option>
					<option>BE</option>
					<option>FR</option>
					<option>NL</option>
				</select>
			</div>
			`,
		methods : {
			commit : window.store.commit
		}
	})

	Vue.component('check-box', {
		props: ['input', 'question'],
		template : `
			<div class="form-check">
				<label class="form-check-label">
					<input type="checkbox" v-model="input.value" class="form-check-input" :name="input.slug">
					{{ question }}
				</label>
			</div>
			`
	})

	// App
	var app = new Vue({

		el: '#app',

		store,

		template: `

			<div id="app" lang="fr">

				<p style="margin-top: 2rem;">Testez les combinaisons pour voir le résultat d'affichage :</p>

				<hr class="large"/>

				<form>

					<h4>Navigateur</h4>
					<language-selector
						:input="state.browserLanguage"
						></language-selector>

					<hr/>

					<h4>IP</h4>
					<country-selector
						:input="state.ipCountry"
						></country-selector>

					<hr/>

					<h4>URL</h4>
					<check-box
						:input="state.url"
						:question="'url comportant des données telles que fr/fr'"
						></check-box>
					<language-selector
						v-if="state.url.value"
						:input="state.urlLanguage"
						></language-selector>
					<country-selector
						v-if="state.url.value"
						:input="state.urlCountry"
						></country-selector>

					<hr/>

					<h4>Compte client</h4>
					<check-box
						:input="state.account"
						:question="'client authentifié'"
						></check-box>
					<language-selector
						v-if="state.account.value"
						:input="state.accountLanguage"
						></language-selector>
					<country-selector
						v-if="state.account.value"
						:input="state.accountCountry"
						></country-selector>

					<hr/>

					<h4>Cookie</h4>
					<check-box
						:input="state.cookie"
						:question="'présence de cookie'"
						></check-box>
					<language-selector
						v-if="state.cookie.value"
						:input="state.cookieLanguage"
						></language-selector>
					<country-selector
						v-if="state.cookie.value"
						:input="state.cookieCountry"
						></country-selector>

				</form>

				<hr class="large"/>

				<h3>Résultat</h3>
				<results-dashboard
					:results="state.results"
					></results-dashboard>

			</div>
		
		`,
		computed: {
			state() { return this.$store.state },
			modal () { return this.$store.state.modal }
		},
	})
}

function alternatePageLanguageMessage(displayLanguage, suggestedLanguage) {
	var lniol = languageNameInOtherLanguage(suggestedLanguage, displayLanguage)
	switch (suggestedLanguage) {
		case 'fr': return "Cette page est affichée en " + lniol + ". [Afficher en Français](#)"
		case 'en': return "This page is displayed in " + lniol + ". [Display in English](#)"
		case 'de': return "Diese Seite wird in " + lniol + " angezeigt. [Sehen Sie auf Deutsch](#)"
		case 'nl': return "Deze pagina wordt in het " + lniol + " weergegeven. [Display in nederlands](#)"
	}
}

function changeAccountLanguageMessage(displayLanguage, suggestedLanguage) {
	var lniol = languageNameInOtherLanguage(suggestedLanguage, displayLanguage)
	switch (suggestedLanguage) {
		case 'fr': return "Votre langue d'affichage est le " + lniol + ". [Changer ma langue préférée](#)"
		case 'en': return "Your display language is " + lniol + ". [Edit display language](#)"
		case 'de': return "Ihre Anzeigesprache ist  " + lniol + ". [Anzeigesprache bearbeiten](#)"
		case 'nl': return "Uw weergavetaal is " + lniol + ". [Wijzig de weergavetaal](#)"
	}
}

function viewingFromOtherCountry(language, displayCountry, otherCountry) {
	return 'potato'
}

function justPickSomethingAlready(language, market) {
	return 'potato'
}

function languageNameInOtherLanguage(displayLanguage, otherLanguage) {
	switch (displayLanguage) {
		case 'fr' : switch (otherLanguage) {
			case 'en': return 'anglais'
			case 'de': return 'allemand'
			case 'nl': return 'néerlandais'
		}
		case 'en' : switch (otherLanguage) {
			case 'fr': return 'french'
			case 'de': return 'german'
			case 'nl': return 'dutch'
		}
		case 'de' : switch (otherLanguage) {
			case 'en': return 'englisch'
			case 'fr': return 'französisch'
			case 'nl': return 'niederländer'
		}
		case 'nl' : switch (otherLanguage) {
			case 'en': return 'engels'
			case 'de': return 'duits'
			case 'fr': return 'frans'
		}
	}
	// If that didn't work, there is something wrong with the input
	return "Error in function languageNameInOtherLanguage with input " + displayLanguage + " and " + otherLanguage + "."
}

function evaluateResults(state) {
	var c = state
	var language = 'erreur'
	var market = 'erreur'
	var message = false
	if (c.url) {
		language = c.urlLanguage.value
		if (c.account) {
			if (c.accountLanguage.value != language) {
				message = alternatePageLanguageMessage(language, c.accountLanguage.value)
			}
		} else if (c.cookie) {
			if (c.cookieLanguage.value != language) {
				message = alternatePageLanguageMessage(language, c.cookieLanguage.value)
			}
		} else if (c.browserLanguage) {
			if (c.browserLanguage.value != language) {
				message = alternatePageLanguageMessage(language, c.browserLanguage.value)
			}
		}
	} else if (c.account) {
		language = c.accountLanguage.value
		if (c.cookie) {
			if (c.cookieLanguage.value != language) {
				message = changeAccountLanguageMessage(language, c.cookieLanguage.value)
			}
		} else if (c.browserLanguage) {
			if (c.browserLanguage.value != language) {
				message = changeAccountLanguageMessage(language, c.browserLanguage.value)
			}
		}
	} else if (c.cookie) {
		language = c.cookieLanguage.value
	} else if (c.browserLanguage) {
		language = c.browserLanguage.value
	}

	switch (language) {
		case 'de' :
			market = 'DE'
		case 'fr' :
			if (c.url && c.urlCountry && c.urlCountry.value == ('FR' || 'BE')) {
				market = c.urlCountry.value
				if (market = 'FR') message = viewingFromOtherCountry(language, market, 'BE')
				else message = viewingFromOtherCountry(language, market, 'FR')
			} else if (c.account && c.accountCountry && c.accountCountry.value == ('FR' || 'BE')) {
				// si le pays est déjà définit dans le compte, alors tout va bien
				market = c.accountCountry.value
			} else if (c.cookie && c.cookieCountry && c.cookieCountry.value == ('FR' || 'BE')) {
				market = c.cookieCountry.value
			} else {
				market = c.ipCountry.value
			}
	}

//	if (c.cookie != c.account) {} ==> Mettre à jour le compte

	if (c.url && c.urlCountry.value != market ||
		c.account && c.accountCountry.value != market ||
		c.cookie && c.cookieCountry.value != market ||
		c.ipCountry.value != market && !(c.cookie || c.account)
		) {
		message = justPickSomethingAlready(language, market)
	}


	return { 'language': language, 'market': market, 'message': message }
}