export enum PropertyMimeType {
  text_plain = 'text/plain',
  image_png = 'image/png',
}

export interface DocumentProperty {
  label?: string
  key: string
  value: string
  preview: boolean
  mime_type: PropertyMimeType
}

export interface DocumentIssuer {
  did: string
  name?: string
  icon?: string
}

export interface DocumentStyle {
  backgroundColor?: string
  backgroundImage?: string
  contextIcons?: string[]
}

export enum DocumentsSortingType {
  issuanceDate = 'issuanceDate',
}

export interface Document {
  id: string
  type: string[]
  name: string
  subject: string
  expires: Date
  issued: Date
  properties: DocumentProperty[]
  previewKeys: string[]
  issuer: DocumentIssuer
  style: DocumentStyle
}
