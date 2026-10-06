import { portfolioData } from '../data/portfolioData.js'

export const getProjects = async (req, res) => {
  try {
    const githubUsername = portfolioData.contact.github
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`)

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`)
    }

    const repositories = await response.json()
    res.json({
      success: true,
      data: repositories,
    })
  } catch (error) {
    const fallbackProjects = portfolioData.projects.map((proj, idx) => ({
      id: idx + 1,
      name: proj.title,
      description: proj.description,
      html_url: `https://github.com/${portfolioData.contact.github}`,
    }))

    res.json({
      success: true,
      data: fallbackProjects,
      warning: error.message,
    })
  }
}
