import { describe, test, expect } from 'vite-plus/test'
import { ref } from 'vue'
import { card } from '@tests/fixtures/card'
import {
  loadedSelectedCards,
  collectCards,
  resolveDeleteArgs
} from '@/utils/card-editor/selection-payload'

function makeCard(overrides = {}) {
  return card.one({ overrides })
}

// Minimal stand-ins — just enough to satisfy the helpers' Pick<> shapes.
function makeSelection({ selected_ids = [], select_all = false, deselected = [] } = {}) {
  return {
    select_all_mode: ref(select_all),
    selected_count: ref(select_all ? 9999 : selected_ids.length),
    deselected_ids: ref(deselected),
    isCardSelected: (id) => (select_all ? !deselected.includes(id) : selected_ids.includes(id)),
    filterSelected: (cards) =>
      cards.filter((c) => {
        if (c.id === undefined) return false
        return select_all ? !deselected.includes(c.id) : selected_ids.includes(c.id)
      })
  }
}

function makeList({ persisted = [], extra = [] } = {}) {
  return {
    persisted_cards: ref(persisted),
    findCard: (id) => persisted.find((c) => c.id === id) ?? extra.find((c) => c.id === id)
  }
}

describe('loadedSelectedCards', () => {
  test('returns the selected persisted cards', () => {
    const persisted = [makeCard({ id: 1 }), makeCard({ id: 2 }), makeCard({ id: 3 })]
    const out = loadedSelectedCards(
      makeSelection({ selected_ids: [1, 3] }),
      makeList({ persisted })
    )
    expect(out.map((c) => c.id)).toEqual([1, 3])
  })

  test('strips review off every returned card', () => {
    const persisted = [makeCard({ id: 1, review: { due: new Date() } })]
    const out = loadedSelectedCards(makeSelection({ selected_ids: [1] }), makeList({ persisted }))
    expect('review' in out[0]).toBe(false)
  })

  test('returns an empty array when nothing is selected', () => {
    const persisted = [makeCard({ id: 1 })]
    const out = loadedSelectedCards(makeSelection(), makeList({ persisted }))
    expect(out).toEqual([])
  })
})

describe('collectCards', () => {
  test('returns just the selected set when no additional id is passed', () => {
    const persisted = [makeCard({ id: 1 }), makeCard({ id: 2 })]
    const out = collectCards(
      makeSelection({ selected_ids: [1] }),
      makeList({ persisted }),
      undefined
    )
    expect(out.map((c) => c.id)).toEqual([1])
  })

  test('does not duplicate when the additional id is already in the selection', () => {
    const persisted = [makeCard({ id: 1 })]
    const out = collectCards(makeSelection({ selected_ids: [1] }), makeList({ persisted }), 1)
    expect(out.map((c) => c.id)).toEqual([1])
  })

  test('appends an unselected additional card to the selection', () => {
    const persisted = [makeCard({ id: 1 }), makeCard({ id: 2 })]
    const out = collectCards(makeSelection({ selected_ids: [1] }), makeList({ persisted }), 2)
    expect(out.map((c) => c.id)).toEqual([1, 2])
  })

  test('strips review from the appended card', () => {
    const persisted = [makeCard({ id: 1, review: { due: new Date() } })]
    const out = collectCards(makeSelection(), makeList({ persisted }), 1)
    expect('review' in out[0]).toBe(false)
  })

  test('returns just the selection when the additional id is unknown to the list', () => {
    const persisted = [makeCard({ id: 1 })]
    const out = collectCards(makeSelection({ selected_ids: [1] }), makeList({ persisted }), 999)
    expect(out.map((c) => c.id)).toEqual([1])
  })

  test('falls back to selection when the list cannot resolve the id and selection is empty', () => {
    const out = collectCards(makeSelection(), makeList({ persisted: [] }), 999)
    expect(out).toEqual([])
  })
})

describe('resolveDeleteArgs', () => {
  test('returns null when nothing is selected and no additional id is passed', () => {
    const out = resolveDeleteArgs(makeSelection(), makeList({ persisted: [] }), undefined)
    expect(out).toBeNull()
  })

  test('returns { cards } with the selected set in positive mode', () => {
    const persisted = [makeCard({ id: 1 }), makeCard({ id: 2 })]
    const out = resolveDeleteArgs(makeSelection({ selected_ids: [1, 2] }), makeList({ persisted }))
    expect(out).not.toBeNull()
    expect(out.count).toBe(2)
    expect('cards' in out.args).toBe(true)
    expect(out.args.cards.map((c) => c.id)).toEqual([1, 2])
  })

  test('returns { except_ids } in select-all mode', () => {
    const out = resolveDeleteArgs(
      makeSelection({ select_all: true, deselected: [5, 7] }),
      makeList({ persisted: [] })
    )
    expect(out).not.toBeNull()
    expect('except_ids' in out.args).toBe(true)
    expect(out.args.except_ids).toEqual([5, 7])
  })

  test('select-all returns a fresh except_ids array (not the live ref)', () => {
    const selection = makeSelection({ select_all: true, deselected: [1] })
    const out = resolveDeleteArgs(selection, makeList({ persisted: [] }))
    selection.deselected_ids.value.push(2)
    expect(out.args.except_ids).toEqual([1])
  })

  test('positive-mode count reflects the selected card list', () => {
    const persisted = [makeCard({ id: 1 }), makeCard({ id: 2 }), makeCard({ id: 3 })]
    const out = resolveDeleteArgs(makeSelection({ selected_ids: [1, 3] }), makeList({ persisted }))
    expect(out.count).toBe(2)
  })

  test('positive-mode plus additional id increases count by one when novel', () => {
    const persisted = [makeCard({ id: 1 }), makeCard({ id: 2 })]
    const out = resolveDeleteArgs(makeSelection({ selected_ids: [1] }), makeList({ persisted }), 2)
    expect(out.count).toBe(2)
  })
})
