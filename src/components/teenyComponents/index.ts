import type { App } from 'vue'
import TeenyButton from './TeenyButton/TeenyButton.vue'
import TeenyCard from './TeenyCard/TeenyCard.vue'
import TeenyCardEditor from './TeenyCardEditor/TeenyCardEditor.vue'
import TeenyDeck from './TeenyDeck/TeenyDeck.vue'
import TeenyDropdown from './TeenyDropdown/TeenyDropdown.vue'
import TeenyInput from './TeenyInput/TeenyInput.vue'

const registerTeenyComponents = (app: App): void => {
  app.component('TeenyButton', TeenyButton)
  app.component('TeenyCard', TeenyCard)
  app.component('TeenyCardEditor', TeenyCardEditor)
  app.component('TeenyDeck', TeenyDeck)
  app.component('TeenyDropdown', TeenyDropdown)
  app.component('TeenyInput', TeenyInput)
}

export { registerTeenyComponents }
