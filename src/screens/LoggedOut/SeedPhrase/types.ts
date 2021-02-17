import { Dispatch, SetStateAction } from 'react'

export interface IDndProps {
  tags: string[]
  updateTags: Dispatch<SetStateAction<string[] | null>>
}
