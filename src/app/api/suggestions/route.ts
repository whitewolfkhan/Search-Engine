import { NextRequest, NextResponse } from 'next/server'

// Mock search suggestions based on common patterns
const suggestionPatterns = [
  'cyberpunk', 'technology', 'artificial intelligence', 'machine learning',
  'neural networks', 'quantum computing', 'virtual reality', 'augmented reality',
  'blockchain', 'cryptocurrency', 'cybersecurity', 'hacking', 'programming',
  'javascript', 'python', 'react', 'next.js', 'typescript', 'web development',
  'future tech', 'sci-fi', 'dystopian', 'hacker', 'digital privacy', 'encryption'
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.trim() === '') {
      return NextResponse.json({
        success: true,
        suggestions: []
      })
    }

    const queryLower = query.toLowerCase()
    
    // Filter suggestions that start with or contain the query
    const suggestions = suggestionPatterns
      .filter(suggestion => 
        suggestion.toLowerCase().includes(queryLower)
      )
      .slice(0, 8) // Limit to 8 suggestions
      .map(suggestion => ({
        text: suggestion,
        highlighted: suggestion.toLowerCase().startsWith(queryLower)
      }))

    return NextResponse.json({
      success: true,
      suggestions: suggestions,
      query: query.trim()
    })

  } catch (error: any) {
    console.error('Suggestions API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}