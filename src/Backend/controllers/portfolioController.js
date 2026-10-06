import { portfolioData } from '../data/portfolioData.js'

export const getPortfolio = (req, res) => {
  res.json({
    success: true,
    data: portfolioData,
  })
}
