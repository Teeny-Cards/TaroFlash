type PlanConfig = {
  deckLimit: number | null
}

export const PLANS: Record<MemberPlan, PlanConfig> = {
  free: { deckLimit: 5 },
  paid: { deckLimit: null }
}
