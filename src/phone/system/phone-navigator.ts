import { ref, computed, type Component, reactive } from 'vue'
import { type PhoneAppDisplay, type PhoneApp } from './types'

export type TransitionPreset = 'slide-left' | 'slide-right' | 'pop-up' | 'pop-down' | 'none'

type NavAction = 'push' | 'pop' | 'replace'

export type NavigationEntry = {
  key: number
  display?: PhoneAppDisplay
  component?: any
  forwardPreset: TransitionPreset
  id: string
}

export type PhoneNavigator = ReturnType<typeof usePhoneNavigator>

export type PhoneNavigatorOptions = {
  default_preset?: TransitionPreset
}

type NavigationOptions = {
  transition?: TransitionPreset
}

const reverse_preset: { [key in TransitionPreset]: TransitionPreset } = {
  'slide-left': 'slide-right',
  'slide-right': 'slide-left',
  'pop-up': 'pop-down',
  'pop-down': 'pop-up',
  none: 'none'
}

export function usePhoneNavigator(opts: PhoneNavigatorOptions = {}) {
  const default_preset = opts.default_preset ?? 'slide-left'

  const stack = ref<NavigationEntry[]>([])
  const transitionName = ref<TransitionPreset>(default_preset)
  const lastAction = ref<NavAction>('push')
  const _key = ref(0)

  const meta = reactive({
    active_app_index: -1
  })

  const top = computed(() => stack.value[stack.value.length - 1] ?? null)
  const can_go_back = computed(() => stack.value.length > 0)

  function _makeEntry(app: PhoneApp, opts: NavigationOptions = {}): NavigationEntry {
    const component = app.kind === 'view' ? app.component : undefined
    const display = app.kind === 'view' ? app.display : undefined

    return {
      key: ++_key.value,
      component,
      display,
      forwardPreset: opts.transition ?? default_preset,
      id: app.id
    }
  }

  function resetTo(app: PhoneApp, opts?: NavigationOptions) {
    transitionName.value = opts?.transition ?? default_preset
    lastAction.value = 'push'
    stack.value.splice(0, stack.value.length, _makeEntry(app, opts))
  }

  function push(app: PhoneApp, opts?: NavigationOptions) {
    transitionName.value = opts?.transition ?? default_preset
    lastAction.value = 'push'
    stack.value.push(_makeEntry(app, opts))
  }

  function replace(app: PhoneApp, opts?: NavigationOptions) {
    transitionName.value = opts?.transition ?? reverse_preset[top.value?.forwardPreset]
    lastAction.value = 'replace'

    if (stack.value.length) stack.value.pop()
    stack.value.push(_makeEntry(app, opts))
  }

  function pop(transition_preset?: TransitionPreset) {
    if (stack.value.length <= 0) return

    lastAction.value = 'pop'
    transitionName.value = transition_preset ?? reverse_preset[top.value?.forwardPreset]
    stack.value.pop()
  }

  function reset() {
    meta.active_app_index = -1
    _key.value = 0
    stack.value = []
    transitionName.value = default_preset
    lastAction.value = 'push'
  }

  return {
    stack,
    transitionName,
    lastAction,
    top,
    can_go_back,
    meta,
    resetTo,
    push,
    replace,
    pop,
    reset
  }
}
