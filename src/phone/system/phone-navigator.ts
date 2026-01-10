import { ref } from 'vue'

export type TransitionPreset = 'slide-left' | 'slide-right' | 'pop-up' | 'pop-down' | 'none'

export type PhoneRoute = { id: string; params?: any; transition?: TransitionPreset }

export type NavigateEvent = {
  reason: 'push' | 'pop' | 'reset' | 'replace'
  from: PhoneRoute | null
  to: PhoneRoute | null
}

export type PhoneNavigator = ReturnType<typeof usePhoneNavigator>

const DEFAULT_TRANSITION = 'slide-left'

const reverse_transition: { [key in TransitionPreset]: TransitionPreset } = {
  'slide-left': 'slide-right',
  'slide-right': 'slide-left',
  'pop-up': 'pop-down',
  'pop-down': 'pop-up',
  none: 'none'
}

export function usePhoneNavigator() {
  const stack = ref<PhoneRoute[]>([])
  const transition = ref<TransitionPreset>(DEFAULT_TRANSITION)

  function top() {
    return stack.value.at(-1) ?? null
  }

  function push(r: PhoneRoute): NavigateEvent {
    const from = top()
    const route = {
      ...r,
      transition: r.transition ?? DEFAULT_TRANSITION
    }

    transition.value = route.transition
    stack.value.push(route)
    return { reason: 'push', from, to: route }
  }

  function pop(): NavigateEvent {
    const from = top()
    stack.value.pop()
    const to = top()

    transition.value = from?.transition ? reverse_transition[from.transition] : DEFAULT_TRANSITION
    return { reason: 'pop', from, to }
  }

  function reset(): NavigateEvent {
    const from = top()
    const first = stack.value[0]
    stack.value = []
    transition.value = first?.transition ? reverse_transition[first.transition] : DEFAULT_TRANSITION

    return { reason: 'reset', from, to: null }
  }

  function replace(r: PhoneRoute): NavigateEvent {
    const from = top()
    if (stack.value.length) stack.value.pop()

    const route = {
      ...r,
      transition: r.transition ?? DEFAULT_TRANSITION
    }

    stack.value.push(route)
    return { reason: 'replace', from, to: route }
  }

  return {
    stack,
    transition,
    top,
    push,
    pop,
    reset,
    replace
  }
}
