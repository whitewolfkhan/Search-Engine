import { NextRequest, NextResponse } from 'next/server'

interface TrendingQuery {
  query: string
  category: string
  volume: number
  trend: 'up' | 'down' | 'stable'
  change: number
  timestamp: number
}

// Mock trending data - in a real implementation, this would come from a real-time data source
const trendingCategories = ['technology', 'ai', 'cybersecurity', 'programming', 'science', 'gaming', 'crypto', 'space']

const trendingQueries: TrendingQuery[] = [
  { query: 'artificial intelligence news', category: 'ai', volume: 15420, trend: 'up', change: 23.5, timestamp: Date.now() },
  { query: 'quantum computing breakthrough', category: 'science', volume: 12300, trend: 'up', change: 18.2, timestamp: Date.now() },
  { query: 'cybersecurity threats 2025', category: 'cybersecurity', volume: 9800, trend: 'up', change: 15.7, timestamp: Date.now() },
  { query: 'react 19 features', category: 'programming', volume: 8900, trend: 'up', change: 12.3, timestamp: Date.now() },
  { query: 'bitcoin price prediction', category: 'crypto', volume: 7600, trend: 'stable', change: 2.1, timestamp: Date.now() },
  { query: 'space exploration missions', category: 'space', volume: 6800, trend: 'up', change: 8.9, timestamp: Date.now() },
  { query: 'gaming industry trends', category: 'gaming', volume: 5400, trend: 'down', change: -3.2, timestamp: Date.now() },
  { query: 'machine learning tutorials', category: 'ai', volume: 4900, trend: 'up', change: 6.7, timestamp: Date.now() },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')
    const category = searchParams.get('category')
    
    // Filter by category if specified
    let filteredTrending = trendingQueries
    if (category && category !== 'all') {
      filteredTrending = trendingQueries.filter(item => item.category === category)
    }
    
    // Sort by volume and limit results
    const sortedTrending = filteredTrending
      .sort((a, b) => b.volume - a.volume)
      .slice(0, limit)
    
    // Simulate real-time updates by slightly randomizing volumes
    const realtimeTrending = sortedTrending.map(item => ({
      ...item,
      volume: item.volume + Math.floor(Math.random() * 100) - 50,
      timestamp: Date.now()
    }))
    
    return NextResponse.json({
      success: true,
      trending: realtimeTrending,
      categories: trendingCategories,
      total: realtimeTrending.length
    })

  } catch (error: any) {
    console.error('Trending API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}