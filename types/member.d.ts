type Member = {
  id?: string
  display_name?: string
  description?: string
  theme?: MemberTheme
  created_at?: string
}

type MemberTheme =
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'brown'
  | 'white'
  | 'grey'

declare type MemberType = 'free' | 'paid'
