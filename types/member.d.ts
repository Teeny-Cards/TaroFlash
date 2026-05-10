type Member = {
  id?: string
  display_name?: string
  description?: string
  created_at?: string
  email?: string
  avatar_url?: string
  updated_at?: string
  role?: MemberRole
  plan?: MemberPlan
}

declare type MemberRole = 'user' | 'moderator' | 'admin'
declare type MemberPlan = 'free' | 'paid'

type Theme =
  | 'blue-500'
  | 'blue-800'
  | 'blue-650'
  | 'blue-400'
  | 'green-500'
  | 'green-400'
  | 'purple-700'
  | 'purple-500'
  | 'purple-400'
  | 'pink-500'
  | 'pink-400'
  | 'red-500'
  | 'red-400'
  | 'yellow-600'
  | 'yellow-500'
  | 'yellow-400'
  | 'brown-800'
  | 'brown-300'
  | 'brown-100'
  | 'grey-900'
  | 'grey-400'
  | 'white'
