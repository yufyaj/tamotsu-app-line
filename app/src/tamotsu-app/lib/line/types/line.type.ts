export type TextMessage = {
  type: 'text'
  text: string
}

export type ImageMessage = {
  type: 'image'
  originalContentUrl: string
  previewImageUrl: string
}