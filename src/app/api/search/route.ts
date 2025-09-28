import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'

interface SearchFunctionResultItem {
  url: string
  name: string
  snippet: string
  host_name: string
  rank: number
  date: string
  favicon: string
}

// Configuration loader
function loadConfig() {
  try {
    const configPath = path.join(process.cwd(), '.z-ai-config')
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(configData)
    }
  } catch (error) {
    console.error('Error loading config:', error)
  }
  return null
}

// Web search using SerpApi
async function performWebSearch(query: string, num: number = 10, config: any) {
  try {
    if (config.search_engine === 'serpapi' && config.search_api_key) {
      const response = await axios.get(config.search_api_url, {
        params: {
          api_key: config.search_api_key,
          q: query,
          num: num
        }
      })
      
      if (response.data && response.data.organic_results) {
        return response.data.organic_results.map((item: any, index: number) => ({
          url: item.link,
          name: item.title,
          snippet: item.snippet,
          host_name: new URL(item.link).hostname,
          rank: index + 1,
          date: new Date().toISOString().split('T')[0],
          favicon: `https://www.google.com/s2/favicons?domain=${new URL(item.link).hostname}`
        }))
      }
    }
    
    // Fallback to mock data if no search API is configured
    return generateMockSearchResults(query, num)
  } catch (error) {
    console.error('Web search error:', error)
    return generateMockSearchResults(query, num)
  }
}

// Generate mock search results for development/fallback
function generateMockSearchResults(query: string, num: number = 10) {
  const mockResults = [
    {
      url: `https://example.com/search?q=${encodeURIComponent(query)}`,
      name: `Search results for: ${query}`,
      snippet: `This is a mock search result for "${query}". In a real implementation, this would be replaced with actual search results from a search API.`,
      host_name: 'example.com',
      rank: 1,
      date: new Date().toISOString().split('T')[0],
      favicon: '🔍'
    }
  ]
  
  return Array.from({ length: Math.min(num, 10) }, (_, i) => ({
    ...mockResults[0],
    url: `https://example.com/search/${i + 1}?q=${encodeURIComponent(query)}`,
    name: `${mockResults[0].name} - Result ${i + 1}`,
    rank: i + 1
  }))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const mode = searchParams.get('mode') || 'web'
    
    if (!query || query.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Search query is required'
      }, { status: 400 })
    }

    // Load configuration
    const config = loadConfig()
    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'Configuration not found. Please check .z-ai-config file.',
        details: 'Make sure you have configured your OpenAI and search API keys.'
      }, { status: 503 })
    }
    
    let searchResults: SearchFunctionResultItem[] = []
    
    // Handle different search modes
    switch (mode) {
      case 'web':
        // Perform web search
        searchResults = await performWebSearch(query.trim(), 10, config)
        break
        
      case 'images':
        // Simulate image search results
        const imageQuery = `${query.trim()} images photos pictures`
        searchResults = await performWebSearch(imageQuery, 10, config)
        searchResults = searchResults.map((result, index) => ({
          ...result,
          name: `${result.name} [Image]`,
          snippet: `Image result: ${result.snippet}`
        }))
        break
        
      case 'news':
        // Simulate news search results
        const newsQuery = `${query.trim()} news latest updates`
        searchResults = await performWebSearch(newsQuery, 10, config)
        searchResults = searchResults.map((result, index) => ({
          ...result,
          name: `${result.name} [News]`,
          snippet: `News article: ${result.snippet}`
        }))
        break
        
      case 'videos':
        // Simulate video search results
        const videoQuery = `${query.trim()} video youtube vimeo`
        searchResults = await performWebSearch(videoQuery, 10, config)
        searchResults = searchResults.map((result, index) => ({
          ...result,
          name: `${result.name} [Video]`,
          snippet: `Video content: ${result.snippet}`
        }))
        break
        
      case 'dark-web':
        // Simulate dark web search with different styling
        searchResults = await performWebSearch(query.trim(), 10, config)
        searchResults = searchResults.map((result, index) => ({
          ...result,
          name: `[ACCESS RESTRICTED] ${result.name}`,
          snippet: `Encrypted data: ${result.snippet.substring(0, 100)}...`,
          url: result.url.replace(/^https?:\/\//, 'http://'),
          host_name: `${result.host_name}.onion`
        }))
        break
        
      default:
        // Default to web search
        searchResults = await performWebSearch(query.trim(), 10, config)
    }
    
    return NextResponse.json({
      success: true,
      results: searchResults,
      query: query.trim(),
      mode: mode
    })

  } catch (error: any) {
    console.error('Search API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}