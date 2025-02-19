/// <reference path="emoji.ts" />
/// <reference path="note.ts" />

namespace MisskeyEntity {
  export type UserDetail = {
    id: string
    name: string
    username: string
    host: string | null
    avatarUrl: string
    avatarColor: string
    isAdmin: boolean
    isModerator: boolean
    isBot: boolean
    isCat: boolean
    emojis: Array<Emoji> | { [key: string]: string }
    createdAt: string
    bannerUrl: string
    uri: string
    bannerColor: string
    isLocked: boolean
    isSilenced: boolean
    isSuspended: boolean
    description: string
    followersCount: number
    followingCount: number
    notesCount: number
    avatarId: string
    bannerId: string
    pinnedNoteIds?: Array<string>
    pinnedNotes?: Array<Note>
  }
}
