import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { projects } from './data/portfolio.js'
import {
  getPortfolioPageMetadata,
  portfolioCompatibilityRoutePaths,
  portfolioRoutePaths,
  resolvePortfolioRoute,
} from './navigation/routes.js'

export function render(route = resolvePortfolioRoute('/')) {
  return renderToString(<React.StrictMode><App route={route} /></React.StrictMode>)
}

export const prerenderPages = portfolioRoutePaths.map((path) => {
  const route = resolvePortfolioRoute(path)
  const project = projects.find((entry) => entry.id === route.projectId)
  return {
    route,
    project,
    metadata: getPortfolioPageMetadata(route, project),
  }
})

export const compatibilityPages = portfolioCompatibilityRoutePaths.map((outputPath) => {
  const route = resolvePortfolioRoute(outputPath)
  const project = projects.find((entry) => entry.id === route.projectId)
  return {
    route: { ...route, outputPath },
    project,
    metadata: getPortfolioPageMetadata(route, project),
  }
})
