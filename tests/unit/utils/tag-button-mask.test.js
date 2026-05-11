import { describe, test, expect } from 'vite-plus/test'
import { buildTagButtonMask, outsetSideFor } from '@/utils/tag-button/mask'

const BASE = {
  notchDepth: 10,
  outsetDepth: 12,
  apexRadius: 3,
  cornerRadius: 4
}

describe('outsetSideFor', () => {
  test('returns the opposite side from the notch', () => {
    expect(outsetSideFor('right')).toBe('left')
    expect(outsetSideFor('left')).toBe('right')
  })
})

describe('buildTagButtonMask', () => {
  test('returns three composed layers (middle + notch + outset)', () => {
    const mask = buildTagButtonMask({ ...BASE, notchSide: 'right' })
    const layers = mask.split(/,\s+(?=linear-gradient|url\()/)
    expect(layers).toHaveLength(3)
  })

  test('positions middle gradient flush against the outset side', () => {
    const right = buildTagButtonMask({ ...BASE, notchSide: 'right' })
    expect(right).toContain('linear-gradient(#fff, #fff) 12px 0 / calc(100% - 22px) 100%')

    const left = buildTagButtonMask({ ...BASE, notchSide: 'left' })
    expect(left).toContain('linear-gradient(#fff, #fff) 10px 0 / calc(100% - 22px) 100%')
  })

  test('anchors notch strip to the notch side', () => {
    const right = buildTagButtonMask({ ...BASE, notchSide: 'right' })
    expect(right).toMatch(/url\("data:image\/svg\+xml;utf8,[^"]+"\) right 0 \/ 10px 100%/)

    const left = buildTagButtonMask({ ...BASE, notchSide: 'left' })
    expect(left).toMatch(/url\("data:image\/svg\+xml;utf8,[^"]+"\) left 0 \/ 10px 100%/)
  })

  test('anchors outset strip to the opposite side', () => {
    const right = buildTagButtonMask({ ...BASE, notchSide: 'right' })
    expect(right).toMatch(/url\("data:image\/svg\+xml;utf8,[^"]+"\) left 0 \/ 12px 100%/)

    const left = buildTagButtonMask({ ...BASE, notchSide: 'left' })
    expect(left).toMatch(/url\("data:image\/svg\+xml;utf8,[^"]+"\) right 0 \/ 12px 100%/)
  })

  test('embeds SVG paths in both strip URLs', () => {
    const mask = buildTagButtonMask({ ...BASE, notchSide: 'right' })
    const urls = [...mask.matchAll(/url\("data:image\/svg\+xml;utf8,([^"]+)"\)/g)].map((m) => m[1])
    expect(urls).toHaveLength(2)
    urls.forEach((svg) => {
      expect(svg).toContain("<path d='M")
      expect(svg).toContain("fill='white'")
    })
  })
})
