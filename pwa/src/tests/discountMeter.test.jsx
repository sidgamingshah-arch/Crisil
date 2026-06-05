import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DiscountMeter } from '../components/activities/DiscountMeter.jsx'

// i18n mock — DiscountMeter uses useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, opts) => {
      if (key === 'activities.you_save') return `You save ${opts?.amount}`
      if (key === 'activities.spots_to_discount') return `${opts?.count} more to discount`
      if (key === 'activities.max_discount_unlocked') return 'Max discount!'
      return key
    },
  }),
}))

const makePreview = (overrides = {}) => ({
  originalPrice: 100,
  finalPrice: 100,
  discountPercent: 0,
  savings: 0,
  currencyCode: 'USD',
  currentParticipants: 1,
  spotsToNextDiscount: 4,
  nextTier: { minParticipants: 5, discountPercent: 10 },
  ...overrides,
})

describe('DiscountMeter', () => {
  it('renders original price when no discount', () => {
    render(<DiscountMeter preview={makePreview()} />)
    // Should show USD 100.00
    expect(screen.getByText(/100\.00/)).toBeInTheDocument()
  })

  it('shows discount badge when discount > 0', () => {
    render(
      <DiscountMeter
        preview={makePreview({ discountPercent: 20, finalPrice: 80, savings: 20 })}
      />
    )
    expect(screen.getByText('−20%')).toBeInTheDocument()
    expect(screen.getByText(/You save USD 20\.00/)).toBeInTheDocument()
  })

  it('shows progress label for spots to next discount', () => {
    render(<DiscountMeter preview={makePreview({ spotsToNextDiscount: 3 })} />)
    expect(screen.getByText(/3 more to discount/)).toBeInTheDocument()
  })

  it('shows max discount message when spotsToNextDiscount is null and has discount', () => {
    render(
      <DiscountMeter
        preview={makePreview({
          discountPercent: 35,
          finalPrice: 65,
          savings: 35,
          spotsToNextDiscount: null,
          nextTier: null,
        })}
      />
    )
    expect(screen.getByText('Max discount!')).toBeInTheDocument()
  })

  it('renders loading skeleton when loading=true', () => {
    const { container } = render(<DiscountMeter preview={null} loading />)
    expect(container.querySelector('.skeleton')).toBeTruthy()
  })
})
