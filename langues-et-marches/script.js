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

				<results-dashboard
					:results="state.results"
					></results-dashboard>

				<hr class="large"/>

				<form>

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

					<hr/>

					<h4>Navigateur</h4>
					<language-selector
						:input="state.browserLanguage"
						></language-selector>

					<hr/>

					<h4>IP</h4>
					<country-selector
						:input="state.ipCountry"
						></country-selector>

				</form>

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

function justPickSomethingAlready(language, market) {
	var country = countryNameByLanguage(market, language)
	switch (language) {
		case 'fr': return 'Cette page est affichée en français pour un départ ' + country + '. [Changer](#)'
		case 'en': return 'This page is displayed in english for ' + country + '. [Change](#)'
		case 'nl': return 'Deze pagina wordt in het Nederlands voor ' + country + ' weergegeven. [Wijziger](#)'
		case 'de': return 'Diese Seite wird in deutscher Sprache für ' + country + 'angezeigt. [Wechsler](#)'
	}
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

function countryNameByLanguage(country, language) {
	switch (language) {
		case 'fr': switch (country) {
			case 'FR': return 'de France'
			case 'BE': return 'de Belgique'
			case 'NL': return 'des Pays-Bas'
			case 'DE': return 'd\'Allemagne'
		}
		case 'en': switch (country) {
			case 'FR': return 'France'
			case 'BE': return 'Belgium'
			case 'NL': return 'the Netherlands'
			case 'DE': return 'Germany'
		}
		case 'nl': switch (country) {
			case 'FR': return 'Frankrijk'
			case 'BE': return 'België'
			case 'NL': return 'Nederland'
			case 'DE': return 'Duitsland'
		}
		case 'de': switch (country) {
			case 'FR': return 'Frankreich'
			case 'BE': return 'Belgien'
			case 'NL': return 'Niederlande'
			case 'DE': return 'Deutschland'
		}
	// If that didn't work, there is something wrong with the input
	console.error("Error in function countryNameByLanguage with input " + country + " and " + language + ".")
	return '[error]'
	}
}

function yell(market, cause) {
	return 'Market set to ' + market + ' by ' + cause
}

function isInArray(country, markets) {
	return markets.indexOf(country) > -1
}

function evaluateResults(state) {
	var c = state
	var language = 'default'
	var market = 'DEFAULT'
	console.log(yell(market, 'default'))
	var message = false
	if (c.url.value) {
		language = c.urlLanguage.value
		if (c.account.value) {
			if (c.accountLanguage.value != language) {
				message = alternatePageLanguageMessage(language, c.accountLanguage.value)
			}
		} else if (c.cookie.value) {
			if (c.cookieLanguage.value != language) {
				message = alternatePageLanguageMessage(language, c.cookieLanguage.value)
			}
		} else if (c.browserLanguage.value) {
			if (c.browserLanguage.value != language) {
				message = alternatePageLanguageMessage(language, c.browserLanguage.value)
			}
		}
	} else if (c.account.value) {
		language = c.accountLanguage.value
		if (c.cookie.value) {
			if (c.cookieLanguage.value != language) {
				message = changeAccountLanguageMessage(language, c.cookieLanguage.value)
			}
		} else if (c.browserLanguage) {
			if (c.browserLanguage.value != language) {
				message = changeAccountLanguageMessage(language, c.browserLanguage.value)
			}
		}
	} else if (c.cookie.value) {
		language = c.cookieLanguage.value
	} else if (c.browserLanguage.value) {
		language = c.browserLanguage.value
	}

	// Select Market based on language and other parameters
	console.log('language to be switched is ' + language)

	var frMarkets = ['FR', 'BE']
	var nlMarkets = ['NL', 'BE']
	var deMarkets = ['DE']
	var enMarkets = ['FR', 'BE', 'NL', 'DE']

	console.log('Testing german in frMarkets : ' + isInArray('DE', frMarkets))

	switch (language) {

		case 'fr' :
			// If a parameter hints to france or belgium, let's use that
			if (c.url.value && isInArray(c.urlCountry.value, frMarkets)) {
				market = c.urlCountry.value
				console.log(yell(market, 'language and url'))
			} else if (c.account.value && isInArray(c.accountCountry.value, frMarkets)) {
				market = c.accountCountry.value
				console.log(yell(market, 'language and account'))
			} else if (c.cookie.value && isInArray(c.cookieCountry.value, frMarkets)) {
				market = c.cookieCountry.value
				console.log(yell(market, 'language and cookie'))	
			} else if (isInArray(c.ipCountry.value, frMarkets)) {
				market = c.ipCountry.value
				console.log(yell(market, 'language and IP address'))
			} else {
				market = 'FR'
				console.log(yell(market, 'language and default market'))
				message = justPickSomethingAlready(language, market)
			}
			break

		case 'en' :
			// There is no native market for that language, so use whatever hints we have
			if (c.url.value && c.urlCountry.value) {
				market = c.urlCountry.value
				console.log(yell(market, 'language and url'))
			} else if (c.account.value && c.accountCountry.value) {
				market = c.accountCountry.value
				console.log(yell(market, 'language and account'))
			} else if (c.cookie.value && c.cookieCountry.value) {
				market = c.cookieCountry.value
				console.log(yell(market, 'language and cookie'))
			} else {
				market = c.ipCountry.value
				console.log(yell(market, 'language and IP address'))
			}
			break

		case 'de' :
			// only compatible with one market, so it's easier
			market = 'DE'
			console.log(yell(market, 'language'))
			var test = (c.url.value && c.urlCountry.value != 'DE') ||
				(c.account.value && c.accountCountry.value != 'DE')||
				(c.cookie.value && c.cookieCountry.value != 'DE') ||
				(c.ipCountry.value != 'DE')
			console.log('Test result is ' + test)
			if (test) {
				// if no parameters hint to the DE market, let's ask the question anyway
				message = justPickSomethingAlready(language, market)
			} 
			break

		case 'nl' :
			// same as french but with netherlands and belgium instead of france and belgium
			if (c.url.value && isInArray(c.cookieCountry.value, nlMarkets)) {
				market = c.urlCountry.value
				console.log(yell(market, 'language and url'))
			} else if (c.account.value && isInArray(c.accountCountry.value, nlMarkets)) {
				market = c.accountCountry.value
				console.log(yell(market, 'language and account'))
			} else if (c.cookie.value && isInArray(c.cookieCountry.value, nlMarkets)) {
				market = c.cookieCountry.value
				console.log(yell(market, 'language and cookie'))
			} else if (isInArray(c.ipCountry.value, nlMarkets)) {
				market = c.ipCountry.value
				console.log(yell(market, 'language and IP address'))
			} else {
				market = 'NL'
				console.log(yell(market, 'language and default market'))
				message = justPickSomethingAlready(language, market)
			}
			break

		}

//	if (c.cookie != c.account) {} ==> Mettre à jour le compte

	if (c.url.value && c.urlCountry.value != market ||
		c.account.value && c.accountCountry.value != market ||
		c.cookie.value && c.cookieCountry.value != market ||
		c.ipCountry.value != market && !(c.cookie || c.account)
		) {
		message = justPickSomethingAlready(language, market)
	}


	return { 'language': language, 'market': market, 'message': message }
}