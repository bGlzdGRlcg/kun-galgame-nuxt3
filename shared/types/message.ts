export type MessageType =
  | 'upvoted'
  | 'liked'
  | 'favorite'
  | 'replied'
  | 'solution'
  | 'pin-reply'
  | 'commented'
  | 'expired'
  | 'requested'
  | 'merged'
  | 'declined'
  | 'mentioned'
  | 'admin'

export interface MessageRequestData {
  page: string
  limit: string
  type?: MessageType | ''
  sortField?: 'time'
  sortOrder: KunOrder
}

export interface Message {
  id: number
  sender: KunUser
  receiverUid: number
  link: string
  content: string
  status: 'read' | 'unread'
  type: MessageType
  created: Date | string
}

export interface MessageSystemMessage {
  id: number
  status: MessageStatus
  content: KunNullable<KunLanguage>
  admin: KunUser
  created: Date | string
}
