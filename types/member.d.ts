type Member = {
  id?: string
  display_name?: string
  description?: string
  theme?: MemberTheme
  created_at?: string
}

type MemberTheme = 'blue-500' | 'blue-800' | 'grey-400' | 'brown-100'
// | 'green-500'
// | 'green-400'
// | 'blue-400'
// | 'purple-500'
// | 'purple-400'
// | 'pink-500'
// | 'pink-400'
// | 'red-500'
// | 'red-400'
// | 'orange-500'
// | 'orange-400'
// | 'brown-800'
// | 'brown-300'
// | 'grey-900'
// | 'white'

declare type MemberType = 'free' | 'paid'
