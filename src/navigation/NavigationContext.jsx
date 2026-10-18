import { useContext } from 'react'
import PortfolioNavigationContext from './navigation-context.js'

export function usePortfolioNavigation() {
  const context = useContext(PortfolioNavigationContext)
  if (!context) throw new Error('usePortfolioNavigation must be used inside PortfolioNavigationProvider')
  return context
}
