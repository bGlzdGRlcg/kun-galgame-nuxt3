export interface SectionTopic {
  id: number
  title: string
  content: string
  section: string[]
  tag: string[]
  view: number
  like: number
  reply: number
  hasBestAnswer: boolean
  user: KunUser
  created: Date | string
}
