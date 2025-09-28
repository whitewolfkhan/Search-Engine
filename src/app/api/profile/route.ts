import { NextRequest, NextResponse } from 'next/server'

interface UserProfile {
  id: string
  name: string
  preferences: {
    searchModes: Record<string, number>
    categories: Record<string, number>
    languages: string[]
    safeSearch: boolean
  }
  searchHistory: Array<{
    query: string
    timestamp: number
    searchMode: string
    category?: string
  }>
  learningData: {
    clickPatterns: Record<string, number>
    timeSpent: Record<string, number>
    preferredResults: string[]
  }
}

// Mock user profiles - in a real implementation, this would be stored in a database
const mockProfiles: Record<string, UserProfile> = {
  'default': {
    id: 'default',
    name: 'Anonymous User',
    preferences: {
      searchModes: { 'web': 10, 'images': 3, 'news': 2, 'videos': 4, 'dark-web': 1 },
      categories: { 'technology': 8, 'ai': 6, 'programming': 7, 'science': 4, 'gaming': 3 },
      languages: ['en'],
      safeSearch: true
    },
    searchHistory: [],
    learningData: {
      clickPatterns: { 'technology': 15, 'programming': 12, 'ai': 10 },
      timeSpent: { 'documentation': 25, 'tutorials': 20, 'news': 15 },
      preferredResults: []
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default'
    
    const profile = mockProfiles[userId] || mockProfiles['default']
    
    return NextResponse.json({
      success: true,
      profile: profile
    })

  } catch (error: any) {
    console.error('Profile API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, profileData } = await request.json()
    
    if (!userId || !profileData) {
      return NextResponse.json({
        success: false,
        error: 'User ID and profile data are required'
      }, { status: 400 })
    }
    
    // Update or create profile
    mockProfiles[userId] = {
      ...mockProfiles['default'],
      ...profileData,
      id: userId
    }
    
    return NextResponse.json({
      success: true,
      profile: mockProfiles[userId]
    })

  } catch (error: any) {
    console.error('Profile Update API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}