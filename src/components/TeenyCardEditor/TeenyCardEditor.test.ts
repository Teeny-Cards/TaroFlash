import { mount } from '@vue/test-utils'
import TeenyCardEditor from './TeenyCardEditor.vue'
import { expect, test } from 'vitest'

test('It renders a front and back card with passed in values', async () => {
  const card: Card = {
    order: 0,
    frontText: 'test',
    backText: 'back test',
    id: ''
  }

  const wrapper = mount(TeenyCardEditor, {
    props: { index: 0, card }
  })

  const frontTextInput = wrapper.find('[data-test-teeny-card-editor-input="frontText"]')
    .element as HTMLInputElement
  const backTextInput = wrapper.find('[data-test-teeny-card-editor-input="backText"]')
    .element as HTMLInputElement

  expect(frontTextInput.value).toEqual(card.frontText)
  expect(backTextInput.value).toEqual(card.backText)
})

test('It emits a frontInput event when the front text is changed', async () => {
  const card: Card = {
    order: 0,
    frontText: 'test',
    backText: 'back test',
    id: ''
  }

  const wrapper = mount(TeenyCardEditor, {
    props: { index: 0, card }
  })

  const frontTextInput = wrapper.find('[data-test-teeny-card-editor-input="frontText"]')
  await frontTextInput.setValue('new front text')

  expect(wrapper.emitted('frontInput')?.[0]).toEqual([0, 'new front text'])
})

test('It emits a backInput event when the back text is changed', async () => {
  const card: Card = {
    order: 0,
    frontText: 'test',
    backText: 'back test',
    id: ''
  }

  const wrapper = mount(TeenyCardEditor, {
    props: { index: 0, card }
  })

  const backTextInput = wrapper.find('[data-test-teeny-card-editor-input="backText"]')
  await backTextInput.setValue('new back text')

  expect(wrapper.emitted('backInput')?.[0]).toEqual([0, 'new back text'])
})

test('It emits a delete event when the delete button is clicked', async () => {
  const card: Card = {
    order: 0,
    frontText: 'test',
    backText: 'back test',
    id: ''
  }

  const wrapper = mount(TeenyCardEditor, {
    props: { index: 0, card }
  })

  const deleteButton = wrapper.find('[data-test-teeny-card-editor-button="delete"]')
  await deleteButton.trigger('click')

  expect(wrapper.emitted('delete')?.[0]).toEqual([0])
})
