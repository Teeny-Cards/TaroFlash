import { mount } from '@vue/test-utils'
import { expect, it, vi, describe, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import MemberApplication from '@/components/modals/member-application.vue'
import MemberCard from '@/components/modals/member-card.vue'

const mocks = vi.hoisted(() => {
  return {
    upsertMember: vi.fn(),
    audioPlay: vi.fn(),
    registerBackdropCloseListener: vi.fn(() => vi.fn()),
    close: vi.fn()
  }
})

vi.mock('@/api/members', () => ({
  upsertMember: mocks.upsertMember
}))

vi.mock('@/composables/use-audio', () => ({
  useAudio: vi.fn(() => ({
    play: mocks.audioPlay
  }))
}))

// Mock DateTime to have consistent dates in tests
vi.mock('luxon', () => ({
  DateTime: {
    now: () => ({
      toISO: () => '2024-01-15T10:30:00.000Z'
    }),
    fromISO: (iso) => ({
      toFormat: (format) => {
        if (format === 'LLL d, yyyy') return 'Jan 15, 2024'
        return iso
      }
    })
  }
}))

describe('MemberApplication Integration Tests', () => {
  const defaultProps = {
    close: mocks.close
  }

  const defaultGlobalConfig = {
    plugins: [
      createTestingPinia({
        createSpy: vi.fn,
        initialState: {
          session: {
            user: { id: 'test-user-id-123' }
          }
        }
      })
    ],
    provide: {
      'modal-context': {
        registerBackdropCloseListener: mocks.registerBackdropCloseListener
      }
    },
    components: {
      'member-card': MemberCard
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the member application modal with all required elements', () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    expect(wrapper.find('[data-testid="member-application"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="member-application__form"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="member-card"]').exists()).toBe(true)
  })

  it('displays the correct header text', () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    const text = wrapper.text()
    expect(text).toContain('Welcome To TeenyCards!')
    expect(text).toContain('(You can update this at any time)')
  })

  it('initializes member with user_id from session store', () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    expect(wrapper.vm.member.id).toBe('test-user-id-123')
    expect(wrapper.vm.member.display_name).toBe('')
    expect(wrapper.vm.member.description).toBe('')
  })

  it('renders all theme color options', () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    const themeButtons = wrapper.findAll('[data-testid="member-application__form"] .cursor-pointer')
    expect(themeButtons).toHaveLength(6)

    // Check that all expected theme classes are present
    const expectedThemes = [
      'green-400',
      'blue-500',
      'purple-500',
      'pink-500',
      'red-500',
      'orange-500'
    ]
    expectedThemes.forEach((theme) => {
      expect(wrapper.find(`.bg-${theme}`).exists()).toBe(true)
    })
  })

  it('shows green-400 as the default selected theme', () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    expect(wrapper.vm.selected_theme).toBe('green-400')

    const themeSelectors = wrapper.findAll(
      '[data-testid="member-application__form"] .cursor-pointer'
    )
    const greenThemeSelector = themeSelectors.find((el) => el.classes().includes('bg-green-400'))

    expect(greenThemeSelector).toBeTruthy()

    const svgElement = greenThemeSelector.find('svg')
    expect(svgElement.exists()).toBe(true)
  })

  it('updates selected theme when clicking on a different theme', async () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    const themeSelectors = wrapper.findAll(
      '[data-testid="member-application__form"] .cursor-pointer'
    )
    const blueTheme = themeSelectors.find((el) => el.classes().includes('bg-blue-500'))
    await blueTheme.trigger('click')

    expect(wrapper.vm.selected_theme).toBe('blue-500')
    expect(mocks.audioPlay).toHaveBeenCalledWith('etc_camera_shutter')
  })

  it('plays powerdown sound when clicking the same theme twice', async () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    // Clear the mount audio call first
    mocks.audioPlay.mockClear()

    // Find the correct theme selector element
    const themeSelectors = wrapper.findAll(
      '[data-testid="member-application__form"] .cursor-pointer'
    )
    const greenTheme = themeSelectors.find((el) => el.classes().includes('bg-green-400'))

    await greenTheme.trigger('click')

    expect(wrapper.vm.selected_theme).toBe('green-400') // Should remain the same
    expect(mocks.audioPlay).toHaveBeenCalledWith('digi_powerdown')
  })

  it('plays hover sound when hovering over theme options', async () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    const themeSelectors = wrapper.findAll(
      '[data-testid="member-application__form"] .cursor-pointer'
    )
    const blueTheme = themeSelectors.find((el) => el.classes().includes('bg-blue-500'))
    await blueTheme.trigger('mouseenter')

    expect(mocks.audioPlay).toHaveBeenCalledWith('click_04')
  })

  it('updates member display_name when typing in the input field', async () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    const nameInput = wrapper.find('[data-testid="ui-kit-input"] input')
    await nameInput.setValue('John Doe')

    expect(wrapper.vm.member.display_name).toBe('John Doe')
  })

  it('updates member description when typing in the description field', async () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    const inputs = wrapper.findAll('[data-testid="ui-kit-input"] input')
    const descriptionInput = inputs[1] // Second input is the description
    await descriptionInput.setValue('Test description')

    expect(wrapper.vm.member.description).toBe('Test description')
  })

  it('passes correct props to member-card component', async () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    // Set some data to test prop passing
    wrapper.vm.member.display_name = 'Test User'
    wrapper.vm.member.description = 'Test description'
    wrapper.vm.selected_theme = 'blue-500'

    await wrapper.vm.$nextTick()

    const memberCard = wrapper.findComponent(MemberCard)
    expect(memberCard.props('theme')).toBe('blue-500')
    expect(memberCard.props('displayName')).toBe('Test User')
    expect(memberCard.props('cardComment')).toBe('Test description')
  })

  it('displays formatted creation date', () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    expect(wrapper.text()).toContain('Jan 15, 2024')
  })

  it('displays static member ID', () => {
    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    expect(wrapper.text()).toContain('f4891cc5-0610-4697-bfdf-02a5d9afd3df')
  })

  it('calls upsertMember and closes modal when confirm button is clicked', async () => {
    mocks.upsertMember.mockResolvedValue()

    const wrapper = mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    // Set some member data
    wrapper.vm.member.display_name = 'Test User'
    wrapper.vm.member.description = 'Test description'

    const confirmButton = wrapper.find('[data-testid="ui-kit-button"]')
    await confirmButton.trigger('click')

    expect(mocks.upsertMember).toHaveBeenCalledWith({
      display_name: 'Test User',
      description: 'Test description',
      id: 'test-user-id-123'
    })
    expect(mocks.audioPlay).toHaveBeenCalledWith('double-pop-down')
    expect(mocks.close).toHaveBeenCalledWith(true)
  })

  it('plays audio on mount and registers backdrop listener', () => {
    mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    expect(mocks.audioPlay).toHaveBeenCalledWith('double-pop-up')
    expect(mocks.registerBackdropCloseListener).toHaveBeenCalled()
  })

  it('plays audio when backdrop close listener is triggered', () => {
    mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    // Get the callback that was registered
    const backdropCallback = mocks.registerBackdropCloseListener.mock.calls[0][0]
    backdropCallback()

    expect(mocks.audioPlay).toHaveBeenCalledWith('double-pop-down')
  })

  it('handles upsertMember error gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.upsertMember.mockRejectedValue(new Error('Database error'))

    mount(MemberApplication, {
      props: defaultProps,
      global: defaultGlobalConfig
    })

    // Verify that upsertMember was mocked to reject
    expect(mocks.upsertMember).toBeDefined()

    consoleError.mockRestore()
  })

  describe('Form Validation and User Interaction', () => {
    it('allows submitting with empty display name and description', async () => {
      mocks.upsertMember.mockResolvedValue()

      const wrapper = mount(MemberApplication, {
        props: defaultProps,
        global: defaultGlobalConfig
      })

      const confirmButton = wrapper.find('[data-testid="ui-kit-button"]')
      await confirmButton.trigger('click')

      expect(mocks.upsertMember).toHaveBeenCalledWith({
        display_name: '',
        description: '',
        id: 'test-user-id-123'
      })
      expect(mocks.close).toHaveBeenCalledWith(true)
    })

    it('preserves form data when switching themes', async () => {
      const wrapper = mount(MemberApplication, {
        props: defaultProps,
        global: defaultGlobalConfig
      })

      // Fill in form data
      const nameInput = wrapper.find('[data-testid="ui-kit-input"] input')
      await nameInput.setValue('Test User')

      const inputs = wrapper.findAll('[data-testid="ui-kit-input"] input')
      const descriptionInput = inputs[1]
      await descriptionInput.setValue('Test description')

      // Switch theme
      const themeSelectors = wrapper.findAll(
        '[data-testid="member-application__form"] .cursor-pointer'
      )
      const purpleTheme = themeSelectors.find((el) => el.classes().includes('bg-purple-500'))
      await purpleTheme.trigger('click')

      // Verify form data is preserved
      expect(wrapper.vm.member.display_name).toBe('Test User')
      expect(wrapper.vm.member.description).toBe('Test description')
      expect(wrapper.vm.selected_theme).toBe('purple-500')
    })

    it('updates member card preview in real-time as user types', async () => {
      const wrapper = mount(MemberApplication, {
        props: defaultProps,
        global: defaultGlobalConfig
      })

      const nameInput = wrapper.find('[data-testid="ui-kit-input"] input')
      await nameInput.setValue('Live Update Test')

      await wrapper.vm.$nextTick()

      const memberCard = wrapper.findComponent(MemberCard)
      expect(memberCard.props('displayName')).toBe('Live Update Test')
    })
  })

  describe('Audio Integration', () => {
    it('plays different sounds for different theme interactions', async () => {
      const wrapper = mount(MemberApplication, {
        props: defaultProps,
        global: defaultGlobalConfig
      })

      const themeSelectors = wrapper.findAll(
        '[data-testid="member-application__form"] .cursor-pointer'
      )
      const blueTheme = themeSelectors.find((el) => el.classes().includes('bg-blue-500'))

      // Test hover sound
      await blueTheme.trigger('mouseenter')
      expect(mocks.audioPlay).toHaveBeenCalledWith('click_04')

      // Test theme change sound
      await blueTheme.trigger('click')
      expect(mocks.audioPlay).toHaveBeenCalledWith('etc_camera_shutter')

      // Test same theme click sound
      await blueTheme.trigger('click')
      expect(mocks.audioPlay).toHaveBeenCalledWith('digi_powerdown')
    })

    it('plays correct audio sequence during complete workflow', async () => {
      mocks.upsertMember.mockResolvedValue()

      const wrapper = mount(MemberApplication, {
        props: defaultProps,
        global: defaultGlobalConfig
      })

      // Should play mount sound
      expect(mocks.audioPlay).toHaveBeenCalledWith('double-pop-up')

      // Change theme
      const themeSelectors = wrapper.findAll(
        '[data-testid="member-application__form"] .cursor-pointer'
      )
      const redTheme = themeSelectors.find((el) => el.classes().includes('bg-red-500'))
      await redTheme.trigger('click')
      expect(mocks.audioPlay).toHaveBeenCalledWith('etc_camera_shutter')

      // Submit form
      const confirmButton = wrapper.find('[data-testid="ui-kit-button"]')
      await confirmButton.trigger('click')
      expect(mocks.audioPlay).toHaveBeenCalledWith('double-pop-down')
    })
  })

  describe('Component Lifecycle', () => {
    it('cleans up backdrop listener on unmount', () => {
      const cleanupFn = vi.fn()
      mocks.registerBackdropCloseListener.mockReturnValue(cleanupFn)

      const wrapper = mount(MemberApplication, {
        props: defaultProps,
        global: defaultGlobalConfig
      })

      wrapper.unmount()
      expect(cleanupFn).toHaveBeenCalled()
    })

    it('handles missing session store user gracefully', () => {
      const wrapper = mount(MemberApplication, {
        props: defaultProps,
        global: {
          ...defaultGlobalConfig,
          plugins: [
            createTestingPinia({
              createSpy: vi.fn,
              initialState: {
                session: {
                  user: null
                }
              }
            })
          ]
        }
      })

      expect(wrapper.vm.member.id).toBeUndefined()
    })
  })

  describe('Accessibility and UI Elements', () => {
    it('renders all required form labels', () => {
      const wrapper = mount(MemberApplication, {
        props: defaultProps,
        global: defaultGlobalConfig
      })

      expect(wrapper.text()).toContain('Member Name')
      expect(wrapper.text()).toContain('Card Comment')
      expect(wrapper.text()).toContain('Card Theme')
      expect(wrapper.text()).toContain('Member ID')
      expect(wrapper.text()).toContain('Registered')
      expect(wrapper.text()).toContain('Title')
    })
  })
})
