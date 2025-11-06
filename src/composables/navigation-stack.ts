import { ref, computed, type Component } from 'vue'

export type TransitionPreset = 'slide-left' | 'slide-right' | 'pop-up' | 'pop-down' | 'none'

type NavAction = 'push' | 'pop' | 'replace'

export type NavigationEntry = {
  key: number
  component: any
  props?: Record<string, unknown>
  forwardPreset: TransitionPreset
}

export type NavigationStackOptions = {
  defaultPreset?: TransitionPreset
}

type NavigationOptions = {
  transition_preset?: TransitionPreset
  props?: { [key: string]: any }
}

const reverse_preset: { [key in TransitionPreset]: TransitionPreset } = {
  'slide-left': 'slide-right',
  'slide-right': 'slide-left',
  'pop-up': 'pop-down',
  'pop-down': 'pop-up',
  none: 'none'
}

export function useNavigationStack(opts: NavigationStackOptions = {}) {
  const defaultPreset = opts.defaultPreset ?? 'none'

  const stack = ref<NavigationEntry[]>([])
  const transitionName = ref<TransitionPreset>(defaultPreset)
  const lastAction = ref<NavAction>('push')
  const _key = ref(0)

  const top = computed(() => stack.value[stack.value.length - 1] ?? null)
  const canGoBack = computed(() => stack.value.length > 1)

  function _makeEntry(component: Component, opts: NavigationOptions = {}): NavigationEntry {
    return {
      key: ++_key.value,
      component,
      props: opts.props,
      forwardPreset: opts.transition_preset ?? 'none'
    }
  }

  function resetTo(component: Component, opts?: NavigationOptions) {
    transitionName.value = opts?.transition_preset ?? 'pop-down'
    lastAction.value = 'push'
    stack.value.splice(0, stack.value.length, _makeEntry(component, opts))
  }

  function push(component: Component, opts?: NavigationOptions) {
    transitionName.value = opts?.transition_preset ?? 'pop-up'
    lastAction.value = 'push'
    stack.value.push(_makeEntry(component, opts))
  }

  function replace(component: Component, opts?: NavigationOptions) {
    transitionName.value = opts?.transition_preset ?? reverse_preset[top.value?.forwardPreset]
    lastAction.value = 'replace'

    if (stack.value.length) stack.value.pop()
    stack.value.push(_makeEntry(component, opts))
  }

  function pop(transition_preset?: TransitionPreset) {
    if (stack.value.length <= 1) return

    lastAction.value = 'pop'
    transitionName.value = transition_preset ?? reverse_preset[top.value?.forwardPreset]
    stack.value.pop()
  }

  return { stack, transitionName, lastAction, top, canGoBack, resetTo, push, replace, pop }
}
