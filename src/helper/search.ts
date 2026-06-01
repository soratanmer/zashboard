export type SearchMatcher = {
  test: (value: string) => boolean
  testAny: (values: string[]) => boolean
}

export const toSearchRegex = (filter: string): SearchMatcher | null => {
  const normalizedFilter = filter.trim()

  if (!normalizedFilter) {
    return null
  }

  const tokens = normalizedFilter.split(/\s+/).filter(Boolean)
  const regexes: RegExp[] = []

  for (const token of tokens) {
    try {
      regexes.push(new RegExp(token, 'i'))
    } catch {
      return null
    }
  }

  if (!regexes.length) {
    return null
  }

  return {
    test: (value) => regexes.every((r) => r.test(value)),
    testAny: (values) => regexes.every((r) => values.some((v) => r.test(v))),
  }
}
