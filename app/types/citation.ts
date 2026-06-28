export interface MultipleTypeExample {
  type: string
  example: string[]
}

export interface CitationRule {
  code: string
  name?: string
  description?: string | string[]
  format?: string | string[]
  example?: string | string[] | Record<string, string | string[]>
  multipleTypeExample?: MultipleTypeExample[]
  webNote?: string
  rule?: CitationRule[]
}
