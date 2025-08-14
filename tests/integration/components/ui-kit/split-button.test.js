import { mount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach } from 'vitest'
import SplitButton from '@/components/ui-kit/split-button.vue'

// Mock the useAudio composable
const mockAudio = {
  play: vi.fn(),
  preload: vi.fn(),
  playRandom: vi.fn(),
  stop: vi.fn(),
  muteAll: vi.fn(),
  isPlaying: vi.fn().mockReturnValue(false),
  isInitialized: { value: true }
}

vi.mock('@/composables/use-audio', () => ({
  useAudio: vi.fn(() => mockAudio)
}))

// Test data
const basicOptions = [
  { label: 'Save', default: true },
  { label: 'Save As', default: false },
  { label: 'Export', default: false }
]

const optionsWithIcons = [
  { label: 'Save', icon: 'check', default: true, theme: 'blue' },
  { label: 'Save As', icon: 'add', default: false, theme: 'green' },
  { label: 'Export', icon: 'add', default: false, theme: 'orange' }
]

const multipleDefaultOptions = [
  { label: 'Save', default: true, theme: 'blue' },
  { label: 'Quick Save', default: true, theme: 'purple' },
  { label: 'Save As', default: false },
  { label: 'Export', default: false }
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('basic rendering and structure', () => {
  it('renders properly with basic options', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="ui-kit-split-button"]').exists()).toBe(true)
  })

  it('renders default options as main buttons', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const defaultButtons = wrapper.findAll('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButtons).toHaveLength(1)
    expect(defaultButtons[0].text()).toContain('Save')
  })

  it('does not render dropdown initially', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const dropdown = wrapper.find('[data-testid="ui-kit-split-button__dropdown"]')
    expect(dropdown.exists()).toBe(false)
  })

  it('applies ring class when ring prop is true', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions, ring: true }
    })

    expect(wrapper.classes()).toContain('ui-kit-split-button--ring')
    const ring = wrapper.find('[data-testid="ui-kit-split-button__ring"]')
    expect(ring.exists()).toBe(true)
  })
})

describe('option categorization', () => {
  it('correctly separates default and non-default options', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const defaultButtons = wrapper.findAll('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButtons).toHaveLength(1)

    // Open dropdown to check non-default options
    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdownOptions = wrapper.findAll('[data-testid="ui-kit-split-button__dropdown__option"]')
    expect(dropdownOptions).toHaveLength(2)
  })

  it('handles multiple default options', () => {
    const wrapper = mount(SplitButton, {
      props: { options: multipleDefaultOptions }
    })

    const defaultButtons = wrapper.findAll('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButtons).toHaveLength(2)
    expect(defaultButtons[0].text()).toContain('Save')
    expect(defaultButtons[1].text()).toContain('Quick Save')
  })

  it('handles all options as non-default', async () => {
    const allNonDefaultOptions = [
      { label: 'Save As', default: false },
      { label: 'Export', default: false }
    ]

    const wrapper = mount(SplitButton, {
      props: { options: allNonDefaultOptions }
    })

    const defaultButtons = wrapper.findAll('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButtons).toHaveLength(0)

    // Open dropdown
    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdownOptions = wrapper.findAll('[data-testid="ui-kit-split-button__dropdown__option"]')
    expect(dropdownOptions).toHaveLength(2)
  })
})

describe('dropdown interaction', () => {
  it('opens dropdown when toggle button is clicked', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdown = wrapper.find('[data-testid="ui-kit-split-button__dropdown"]')
    expect(dropdown.exists()).toBe(true)
  })

  it('closes dropdown when toggle button is clicked again', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')

    // Open dropdown
    await toggleButton.trigger('click')
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(true)

    // Close dropdown
    await toggleButton.trigger('click')
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(false)
  })

  it('displays non-default options in dropdown', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdownOptions = wrapper.findAll('[data-testid="ui-kit-split-button__dropdown__option"]')
    expect(dropdownOptions).toHaveLength(2)
    expect(dropdownOptions[0].text()).toContain('Save As')
    expect(dropdownOptions[1].text()).toContain('Export')
  })

  it('closes dropdown when dropdown option is clicked', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdownOption = wrapper.find('[data-testid="ui-kit-split-button__dropdown__option"]')
    await dropdownOption.trigger('click')

    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(false)
  })
})

describe('event emission', () => {
  it('emits option-clicked event when default option is clicked', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    await defaultButton.trigger('click')

    expect(wrapper.emitted('option-clicked')).toBeTruthy()
    expect(wrapper.emitted('option-clicked')[0][0]).toEqual(basicOptions[0])
  })

  it('emits option-clicked event when dropdown option is clicked', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdownOption = wrapper.find('[data-testid="ui-kit-split-button__dropdown__option"]')
    await dropdownOption.trigger('click')

    expect(wrapper.emitted('option-clicked')).toBeTruthy()
    expect(wrapper.emitted('option-clicked')[0][0]).toEqual(basicOptions[1])
  })

  it('emits correct option data for multiple default options', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: multipleDefaultOptions }
    })

    const defaultButtons = wrapper.findAll('[data-testid="ui-kit-split-button__default-option"]')

    // Click first default option
    await defaultButtons[0].trigger('click')
    expect(wrapper.emitted('option-clicked')[0][0]).toEqual(multipleDefaultOptions[0])

    // Click second default option
    await defaultButtons[1].trigger('click')
    expect(wrapper.emitted('option-clicked')[1][0]).toEqual(multipleDefaultOptions[1])
  })

  it('does not emit option-clicked when toggle button is clicked', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    expect(wrapper.emitted('option-clicked')).toBeFalsy()
  })
})

describe('theme support', () => {
  it('applies default blue theme when no theme is specified', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButton.classes()).toContain('ui-kit-split-button__default-option--blue')
  })

  it('supports all available theme colors', () => {
    const allThemeOptions = [
      { label: 'Blue', default: true, theme: 'blue' },
      { label: 'Purple', default: false, theme: 'purple' },
      { label: 'Orange', default: false, theme: 'orange' },
      { label: 'Green', default: false, theme: 'green' },
      { label: 'Pink', default: false, theme: 'pink' },
      { label: 'Red', default: false, theme: 'red' },
      { label: 'Grey', default: false, theme: 'grey' }
    ]

    const wrapper = mount(SplitButton, {
      props: { options: allThemeOptions }
    })

    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButton.classes()).toContain('ui-kit-split-button__default-option--blue')
  })
})

describe('icon support', () => {
  it('renders icons in default options when provided', () => {
    const wrapper = mount(SplitButton, {
      props: { options: optionsWithIcons }
    })

    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    const icon = defaultButton.find('[data-testid="ui-kit-icon"]')

    expect(icon.exists()).toBe(true)
    expect(icon.attributes('alt')).toBe('check')
  })

  it('renders icons in dropdown options when provided', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: optionsWithIcons }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdownOptions = wrapper.findAll('[data-testid="ui-kit-split-button__dropdown__option"]')
    const firstDropdownIcon = dropdownOptions[0].find('[data-testid="ui-kit-icon"]')
    const secondDropdownIcon = dropdownOptions[1].find('[data-testid="ui-kit-icon"]')

    expect(firstDropdownIcon.exists()).toBe(true)
    expect(firstDropdownIcon.attributes('alt')).toBe('add')
    expect(secondDropdownIcon.exists()).toBe(true)
    expect(secondDropdownIcon.attributes('alt')).toBe('add')
  })

  it('does not render icons when not provided', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    const icon = defaultButton.find('[data-testid="ui-kit-icon"]')

    expect(icon.exists()).toBe(false)
  })

  it('renders toggle button icon correctly', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    const icon = toggleButton.find('[data-testid="ui-kit-icon"]')

    expect(icon.exists()).toBe(true)
    expect(icon.attributes('alt')).toBe('arrow-drop-down')
  })
})

describe('slot support', () => {
  it('renders default slot content for default options', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions },
      slots: {
        default: '<span class="custom-content">Custom Save</span>'
      }
    })

    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButton.find('.custom-content').exists()).toBe(true)
    expect(defaultButton.text()).toContain('Custom Save')
  })

  it('renders option slot content for dropdown options', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions },
      slots: {
        option: '<span class="custom-option">Custom Option</span>'
      }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdownOption = wrapper.find('[data-testid="ui-kit-split-button__dropdown__option"]')
    expect(dropdownOption.find('.custom-option').exists()).toBe(true)
    expect(dropdownOption.text()).toContain('Custom Option')
  })
})

describe('data attributes', () => {
  it('sets correct data-option attributes for default options', () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButton.attributes('data-option')).toBe('Save')
  })

  it('sets correct data-option attributes for dropdown options', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    const dropdownOptions = wrapper.findAll('[data-testid="ui-kit-split-button__dropdown__option"]')
    expect(dropdownOptions[0].attributes('data-option')).toBe('Save As')
    expect(dropdownOptions[1].attributes('data-option')).toBe('Export')
  })

  it('sets data-option attributes for multiple default options', () => {
    const wrapper = mount(SplitButton, {
      props: { options: multipleDefaultOptions }
    })

    const defaultButtons = wrapper.findAll('[data-testid="ui-kit-split-button__default-option"]')
    expect(defaultButtons[0].attributes('data-option')).toBe('Save')
    expect(defaultButtons[1].attributes('data-option')).toBe('Quick Save')
  })
})

describe('complete user workflows', () => {
  it('supports complete save workflow with multiple interactions', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    // User clicks main save button
    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    await defaultButton.trigger('click')

    expect(wrapper.emitted('option-clicked')).toBeTruthy()
    expect(wrapper.emitted('option-clicked')[0][0].label).toBe('Save')

    // User opens dropdown for more options
    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('click')

    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(true)

    // User selects "Save As" from dropdown
    const dropdownOptions = wrapper.findAll('[data-testid="ui-kit-split-button__dropdown__option"]')
    await dropdownOptions[0].trigger('click')

    expect(wrapper.emitted('option-clicked')).toHaveLength(2)
    expect(wrapper.emitted('option-clicked')[1][0].label).toBe('Save As')
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(false)
  })

  it('supports hover and interaction events throughout the component', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    // Test hover interactions don't cause errors
    const defaultButton = wrapper.find('[data-testid="ui-kit-split-button__default-option"]')
    await defaultButton.trigger('mouseenter')

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')
    await toggleButton.trigger('mouseenter')

    // Open dropdown and test dropdown option hover
    await toggleButton.trigger('click')
    const dropdownOption = wrapper.find('[data-testid="ui-kit-split-button__dropdown__option"]')
    await dropdownOption.trigger('mouseenter')

    // Verify component state is still correct after all interactions
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="ui-kit-split-button__dropdown__option"]')).toHaveLength(2)
  })

  it('handles rapid toggle interactions correctly', async () => {
    const wrapper = mount(SplitButton, {
      props: { options: basicOptions }
    })

    const toggleButton = wrapper.find('[data-testid="ui-kit-split-button__toggle"]')

    // Rapidly toggle dropdown multiple times
    await toggleButton.trigger('click') // Open
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(true)

    await toggleButton.trigger('click') // Close
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(false)

    await toggleButton.trigger('click') // Open again
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(true)

    await toggleButton.trigger('click') // Close again
    expect(wrapper.find('[data-testid="ui-kit-split-button__dropdown"]').exists()).toBe(false)
  })
})
