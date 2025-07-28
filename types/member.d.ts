type Member = {
  id?: string
  display_name?: string
  description?: string
  theme?: MemberTheme
  created_at?: string
}

type MemberTheme = 'green-400' | 'blue-500' | 'purple-500' | 'pink-500' | 'red-500' | 'orange-500'
