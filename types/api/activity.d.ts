export type ActivityEventType =
  | 'GALGAME_CREATION'
  | 'GALGAME_COMMENT_CREATION'
  | 'GALGAME_PR_CREATION'
  | 'GALGAME_WEBSITE_CREATION'
  | 'GALGAME_WEBSITE_COMMENT_CREATION'
  | 'GALGAME_RESOURCE_CREATION'
  | 'TOPIC_CREATION'
  | 'TOPIC_REPLY_CREATION'
  | 'TOPIC_COMMENT_CREATION'
  | 'TODO_CREATION'
  | 'UPDATE_LOG_CREATION'
  | 'MESSAGE_UPVOTE'
  | 'MESSAGE_SOLUTION'

export interface ActivityItem {
  uniqueId: string
  type: ActivityEventType
  timestamp: Date
  actor: KunUser | null
  link: string
  content: string
}
