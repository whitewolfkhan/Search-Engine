import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'

interface QuickAnswerResponse {
  type: 'summary' | 'translation' | 'code' | 'general'
  content: string
  confidence: number
  sources?: string[]
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  try {
    if (!query || query.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Query is required'
      }, { status: 400 })
    }

    // Load configuration
    const config = loadConfig()
    if (!config || !config.openai_api_key) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI configuration not found. Please check .z-ai-config file.',
        details: 'Make sure you have configured your OpenAI API key.'
      }, { status: 503 })
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: config.openai_api_key,
      baseURL: config.openai_base_url || 'https://api.openai.com/v1'
    })
    
    const queryLower = query.toLowerCase()
    let answerType: QuickAnswerResponse['type'] = 'general'
    let prompt = query
    let responseContent = ''
    
    // Determine the type of quick answer needed based on query patterns
    if (queryLower.includes('translate') || queryLower.includes('translation') || 
        queryLower.includes('in spanish') || queryLower.includes('in french') || 
        queryLower.includes('in german') || queryLower.includes('in chinese')) {
      answerType = 'translation'
      prompt = `Provide a translation for: "${query}". If it's not a clear translation request, provide a helpful response about the language or translation concept.`
    } else if (queryLower.includes('code') || queryLower.includes('function') || 
               queryLower.includes('programming') || queryLower.includes('how to') ||
               queryLower.includes('javascript') || queryLower.includes('python') ||
               queryLower.includes('react') || queryLower.includes('api')) {
      answerType = 'code'
      prompt = `Provide a helpful code example or explanation for: "${query}". Include code snippets if relevant, formatted clearly.`
    } else if (queryLower.includes('summary') || queryLower.includes('summarize') || 
               queryLower.includes('what is') || queryLower.includes('explain') ||
               queryLower.includes('definition') || queryLower.includes('meaning of')) {
      answerType = 'summary'
      prompt = `Provide a concise summary or definition for: "${query}". Keep it brief but informative.`
    } else {
      prompt = `Provide a quick, helpful answer to: "${query}". Keep it concise and to the point.`
    }

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: config.openai_model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that provides quick, concise answers. Be direct and informative, keeping responses under 150 words unless code examples are needed.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: config.openai_max_tokens || 300,
      temperature: config.openai_temperature || 0.3
    })

    responseContent = completion.choices[0]?.message?.content || 'No response available'
    
    // Calculate confidence based on response quality
    const confidence = Math.min(0.95, Math.max(0.6, responseContent.length / 100))
    
    return NextResponse.json({
      success: true,
      answer: {
        type: answerType,
        content: responseContent,
        confidence: confidence,
        sources: [] // Could be populated with relevant sources in the future
      },
      query: query.trim()
    })

  } catch (error: any) {
    console.error('Quick Answer API Error:', error)
    
    // Fallback response if OpenAI fails
    return NextResponse.json({
      success: true,
      answer: {
        type: 'general',
        content: `I apologize, but I'm currently unable to process your request about "${query}". This might be due to API limitations or temporary service issues. Please try again later.`,
        confidence: 0.5,
        sources: []
      },
      query: query.trim(),
      fallback: true
    })
  }
}