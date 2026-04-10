import { describe, test, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import SessionComplete from '@/components/modals/study-session/session-complete.vue'

function makeSessionComplete(score, total, close = () => {}) {
  return mount(SessionComplete, {
    props: { score, total, close }
  })
}

describe('SessionComplete', () => {
  // ── Heading ──────────────────────────────────────────────────────────────────

  describe('heading', () => {
    test('shows "Perfect!" at 100%', () => {
      const wrapper = makeSessionComplete(5, 5)
      expect(wrapper.find('[data-testid="session-complete__heading"]').text()).toBe('Perfect!')
    })

    test('shows "Great job!" at 80%', () => {
      const wrapper = makeSessionComplete(4, 5)
      expect(wrapper.find('[data-testid="session-complete__heading"]').text()).toBe('Great job!')
    })

    test('shows "Great job!" at exactly 80%', () => {
      const wrapper = makeSessionComplete(8, 10)
      expect(wrapper.find('[data-testid="session-complete__heading"]').text()).toBe('Great job!')
    })

    test('shows "Nice work!" at 60%', () => {
      const wrapper = makeSessionComplete(6, 10)
      expect(wrapper.find('[data-testid="session-complete__heading"]').text()).toBe('Nice work!')
    })

    test('shows "Nice work!" at exactly 60%', () => {
      const wrapper = makeSessionComplete(3, 5)
      expect(wrapper.find('[data-testid="session-complete__heading"]').text()).toBe('Nice work!')
    })

    test('shows "Keep it up!" below 60%', () => {
      const wrapper = makeSessionComplete(2, 5)
      expect(wrapper.find('[data-testid="session-complete__heading"]').text()).toBe('Keep it up!')
    })

    test('shows "Keep it up!" at 0%', () => {
      const wrapper = makeSessionComplete(0, 5)
      expect(wrapper.find('[data-testid="session-complete__heading"]').text()).toBe('Keep it up!')
    })

    test('shows "Keep it up!" when total is 0', () => {
      // total=0 → percentage=0 → "Keep it up!"
      const wrapper = makeSessionComplete(0, 0)
      expect(wrapper.find('[data-testid="session-complete__heading"]').text()).toBe('Keep it up!')
    })
  })

  // ── Score display ─────────────────────────────────────────────────────────────

  test('displays score', () => {
    const wrapper = makeSessionComplete(7, 10)
    expect(wrapper.text()).toContain('7')
  })

  test('displays total', () => {
    const wrapper = makeSessionComplete(7, 10)
    expect(wrapper.text()).toContain('10')
  })

  // ── Done button ───────────────────────────────────────────────────────────────

  test('calls close prop when Done button is clicked', async () => {
    const close = vi.fn()
    const wrapper = makeSessionComplete(3, 5, close)
    await wrapper.find('[data-testid="session-complete__done"]').trigger('click')
    expect(close).toHaveBeenCalledOnce()
  })
})
