import { Dispatch, SetStateAction } from 'react'

export interface IDndProps {
  tags: string[]
  updateTags: (tags: string[]) => void
}
