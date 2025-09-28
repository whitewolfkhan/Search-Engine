"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Zap, Network, Cpu, Clock, Filter, X, History, Globe, Image, Newspaper, Video, Shield, Brain, TrendingUp, User, Settings, Sparkles, Code, Mic, MicOff, Volume2, Upload, FileImage, Film, Wifi, WifiOff, Database, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useI18n } from "@/hooks/use-i18n"
import { useToast } from "@/hooks/use-toast"

// Custom Butterfly Image Component
function ButterflyImage({ className = "" }: { className?: string }) {
  return (
    <img 
      src="https://z-cdn-media.chatglm.cn/files/c54dc3ea-7898-42cc-bad2-95676263d38a_B-removebg-preview.png?auth_key=1790606254-67c33ff2dc934cb8a25a553e0cabaf52-0-34a5738122f62c406070b748d3345da5"
      alt="Butterfly"
      className={`${className} mix-blend-screen bg-transparent w-8 h-8 sm:w-10 h-10 md:w-12 h-12 lg:w-16 h-16 xl:w-20 h-20`}
      style={{ filter: 'brightness(1.2) contrast(1.1)' }}
    />
  )
}

// Custom Butterfly SVG Component
function Butterfly({ className = "" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2C12 2 8 6 8 10C8 12 9 13 10 13C10.5 13 11 12.5 11 12C11 11.5 10.5 11 10 11C9.5 11 9 11.5 9 12C9 13 10 14 12 14C14 14 15 13 15 12C15 11.5 14.5 11 14 11C13.5 11 13 11.5 13 12C13 12.5 13.5 13 14 13C15 13 16 12 16 10C16 6 12 2 12 2Z" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="0.5"
      />
      <path 
        d="M12 14C12 14 8 18 8 22C8 24 9 25 10 25C10.5 25 11 24.5 11 24C11 23.5 10.5 23 10 23C9.5 23 9 23.5 9 24C9 25 10 26 12 26C14 26 15 25 15 24C15 23.5 14.5 23 14 23C13.5 23 13 23.5 13 24C13 24.5 13.5 25 14 25C15 25 16 24 16 22C16 18 12 14 12 14Z" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="0.5"
        transform="rotate(180 12 20)"
      />
    </svg>
  )
}

interface SearchResult {
  url: string
  name: string
  snippet: string
  host_name: string
  rank: number
  date: string
  favicon: string
}

interface SearchSuggestion {
  text: string
  highlighted: boolean
}

interface SearchHistory {
  id: string
  query: string
  timestamp: number
  searchMode: string
}

interface QuickAnswer {
  type: 'summary' | 'translation' | 'code' | 'general'
  content: string
  confidence: number
  sources?: string[]
}

interface TrendingQuery {
  query: string
  category: string
  volume: number
  trend: 'up' | 'down' | 'stable'
  change: number
  timestamp: number
}

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

type SearchMode = 'web' | 'images' | 'news' | 'videos' | 'dark-web'

export default function Home() {
  const { t } = useI18n()
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchMode, setSearchMode] = useState<SearchMode>('web')
  const [showFilters, setShowFilters] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [safeSearch, setSafeSearch] = useState(true)
  const [dateRange, setDateRange] = useState('any')
  const [language, setLanguage] = useState('all')
  
  // New AI features state
  const [quickAnswer, setQuickAnswer] = useState<QuickAnswer | null>(null)
  const [trendingQueries, setTrendingQueries] = useState<TrendingQuery[]>([])
  const [trendingCategories, setTrendingCategories] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState<string[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const [showTrending, setShowTrending] = useState(true)
  const [userId, setUserId] = useState('default')
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [currentSpeechLang, setCurrentSpeechLang] = useState('en-US')
  
  // New features state
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [processingMessage, setProcessingMessage] = useState<string | null>(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [advancedSearch, setAdvancedSearch] = useState(false)
  const [searchOperators, setSearchOperators] = useState({
    regex: false,
    boolean: false,
    exact: false
  })
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('nexus-search-history')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
    
    // Initialize PWA features
    initializePWA()
    
    // Initialize voice recognition
    initializeVoiceRecognition()
    
    // Load user profile
    loadUserProfile()
    
    // Load trending queries
    loadTrendingQueries()
    
    // Set up trending updates interval
    const trendingInterval = setInterval(loadTrendingQueries, 30000) // Update every 30 seconds
    
    return () => {
      clearInterval(trendingInterval)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Initialize PWA features
  const initializePWA = () => {
    // Check if app is installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running in standalone mode (PWA)')
    }

    // Online/offline detection
    const handleOnline = () => {
      setIsOnline(true)
      setOfflineMode(false)
      console.log('App is online')
    }

    const handleOffline = () => {
      setIsOnline(false)
      console.log('App is offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nexus-search-history', JSON.stringify(searchHistory))
  }, [searchHistory])

  // Listen for language changes and update speech recognition
  useEffect(() => {
    const handleLanguageChange = (event: any) => {
      detectLanguageAndSetSpeech()
    }

    // Listen for storage changes (language changes)
    window.addEventListener('storage', handleLanguageChange)
    
    // Custom event for language changes
    window.addEventListener('languageChange', handleLanguageChange)

    return () => {
      window.removeEventListener('storage', handleLanguageChange)
      window.removeEventListener('languageChange', handleLanguageChange)
    }
  }, [])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        if (data.success) {
          setSuggestions(data.suggestions)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // Fetch quick answer when query changes (with debounce)
  useEffect(() => {
    const fetchQuickAnswer = async () => {
      if (query.trim().length < 3) {
        setQuickAnswer(null)
        return
      }

      try {
        const response = await fetch(`/api/quick-answer?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        if (data.success && data.answer.confidence > 0.7) {
          setQuickAnswer(data.answer)
        }
      } catch (error) {
        console.error('Error fetching quick answer:', error)
      }
    }

    const debounceTimer = setTimeout(fetchQuickAnswer, 800)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setUserProfile(data.profile)
        generatePersonalizedSuggestions(data.profile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const loadTrendingQueries = async () => {
    try {
      const response = await fetch('/api/trending?limit=8')
      const data = await response.json()
      
      if (data.success) {
        setTrendingQueries(data.trending)
        setTrendingCategories(data.categories)
      }
    } catch (error) {
      console.error('Error loading trending queries:', error)
    }
  }

  const generatePersonalizedSuggestions = (profile: UserProfile) => {
    // Generate suggestions based on user preferences and history
    const suggestions: string[] = []
    
    // Based on preferred categories
    const topCategories = Object.entries(profile.preferences.categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)
    
    topCategories.forEach(category => {
      suggestions.push(`latest ${category} trends`)
      suggestions.push(`${category} tutorials`)
    })
    
    // Based on search history
    const recentSearches = profile.searchHistory
      .slice(-5)
      .map(item => item.query)
    
    setPersonalizedSuggestions([...suggestions.slice(0, 4), ...recentSearches.slice(0, 2)])
  }

  const initializeVoiceRecognition = () => {
    try {
      // Check for browser support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported in this browser')
        setVoiceSupported(false)
        toast({
          title: "Voice Search Not Supported",
          description: "Your browser doesn't support voice recognition. Try Chrome, Edge, or Safari.",
          variant: "destructive",
          duration: 5000,
        })
        return
      }

      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      
      if (!SpeechRecognition) {
        console.log('SpeechRecognition constructor not available')
        setVoiceSupported(false)
        return
      }

      recognitionRef.current = new SpeechRecognition()
      
      // Configure recognition settings
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = currentSpeechLang
      recognitionRef.current.maxAlternatives = 1

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Use final transcript if available, otherwise use interim
        const transcript = finalTranscript || interimTranscript
        
        // For Bangla, ensure we get Bangla script rather than transliteration
        if (currentSpeechLang === 'bn-BD') {
          const processedTranscript = ensureBanglaScript(transcript, currentSpeechLang)
          console.log('Processed Bangla transcript:', processedTranscript)
        }

        setQuery(transcript)
        
        // Only stop listening and search if we have a final result
        if (finalTranscript) {
          setIsListening(false)
          handleSearch(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        // Handle specific error types with user-friendly messages
        let errorMessage = "Voice recognition encountered an error."
        let errorDescription = "Please try again."
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No Speech Detected"
            errorDescription = "Please speak clearly and try again."
            break
          case 'audio-capture':
            errorMessage = "Microphone Access Denied"
            errorDescription = "Please allow microphone access and try again."
            break
          case 'not-allowed':
            errorMessage = "Microphone Permission Denied"
            errorDescription = "Please enable microphone permissions in your browser settings."
            break
          case 'network':
            errorMessage = "Network Error"
            errorDescription = "Please check your internet connection and try again."
            break
          case 'service-not-allowed':
            errorMessage = "Voice Service Unavailable"
            errorDescription = "Voice recognition service is temporarily unavailable."
            break
          default:
            errorMessage = "Voice Recognition Error"
            errorDescription = "An unexpected error occurred. Please try again."
        }
        
        toast({
          title: errorMessage,
          description: errorDescription,
          variant: "destructive",
          duration: 4000,
        })
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started')
        setIsListening(true)
      }

      recognitionRef.current.onspeechstart = () => {
        console.log('Speech detected')
      }

      recognitionRef.current.onspeechend = () => {
        console.log('Speech ended')
      }

      setVoiceSupported(true)
      console.log('Voice recognition initialized successfully')
      
    } catch (error) {
      console.error('Error initializing voice recognition:', error)
      setVoiceSupported(false)
      toast({
        title: "Voice Search Initialization Failed",
        description: "Unable to initialize voice recognition. Please check your browser settings.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const detectLanguageAndSetSpeech = () => {
    // Get current language from the i18n context or localStorage
    const currentLang = localStorage.getItem('nexus-language') || 'en'
    
    // Set speech recognition language based on current app language
    if (currentLang === 'bn') {
      setCurrentSpeechLang('bn-BD') // Bengali (Bangladesh)
      // Also try alternative Bengali language codes for better recognition
      if (recognitionRef.current) {
        // Try different Bangla language codes for better recognition
        recognitionRef.current.lang = 'bn-BD'
      }
    } else {
      setCurrentSpeechLang('en-US') // English (US)
      if (recognitionRef.current) {
        recognitionRef.current.lang = 'en-US'
      }
    }
  }

  const tryAlternativeBanglaRecognition = () => {
    // Try different Bangla language codes if the default doesn't work well
    const banglaLanguageCodes = ['bn-BD', 'bn-IN', 'bn']
    
    // Set the first one as default
    if (recognitionRef.current) {
      recognitionRef.current.lang = banglaLanguageCodes[0]
      console.log(`Set Bangla language code: ${banglaLanguageCodes[0]}`)
    }
  }

  // Function to check if text is likely Bangla script
  const isBanglaScript = (text: string): boolean => {
    // Bangla Unicode range: \u0980-\u09FF
    const banglaRegex = /[\u0980-\u09FF]/
    return banglaRegex.test(text)
  }

  // Function to handle Bangla text conversion if needed
  const ensureBanglaScript = (text: string, expectedLang: string): string => {
    if (expectedLang === 'bn-BD' && !isBanglaScript(text)) {
      // If we expected Bangla but got English text, it might be transliteration
      console.log('Expected Bangla script but got:', text)
      
      // Show a toast notification to guide the user
      toast({
        title: "ভয়েস রিকগনিশন সমস্যা",
        description: "আপনার ব্রাউজার বাংলা স্ক্রিপ্ট সঠিকভাবে চিনতে পারছে না। অনুগ্রহ করে Chrome ব্রাউজার ব্যবহার করুন।",
        variant: "destructive",
        duration: 5000,
      })
      
      return text
    }
    return text
  }

  const toggleVoiceRecognition = async () => {
    if (!voiceSupported) {
      toast({
        title: "Voice Search Not Available",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Check if we have a valid recognition instance
    if (!recognitionRef.current) {
      toast({
        title: "Voice Search Error",
        description: "Voice recognition service is not initialized. Please refresh the page.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Detect and set language before starting
    detectLanguageAndSetSpeech()

    try {
      if (isListening) {
        // Stop listening
        recognitionRef.current.stop()
        setIsListening(false)
        toast({
          title: "Voice Search Stopped",
          description: "Voice recognition has been stopped.",
          duration: 2000,
        })
      } else {
        // Check for HTTPS requirement (Chrome requires HTTPS for microphone access)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          toast({
            title: "HTTPS Required",
            description: "Voice search requires HTTPS. Please use a secure connection.",
            variant: "destructive",
            duration: 5000,
          })
          return
        }

        // Request microphone permission first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          // Stop the stream immediately - we just needed to check permission
          stream.getTracks().forEach(track => track.stop())
        } catch (permissionError) {
          console.error('Microphone permission error:', permissionError)
          toast({
            title: "Microphone Access Required",
            description: "Please allow microphone access to use voice search.",
            variant: "destructive",
            duration: 5000,
          })
          return
        }

        // For Bangla, try to optimize for Bangla script recognition
        if (currentSpeechLang === 'bn-BD') {
          tryAlternativeBanglaRecognition()
        }
        
        // Set the language and start recognition
        recognitionRef.current.lang = currentSpeechLang
        recognitionRef.current.start()
        
        // Show feedback that we're starting
        toast({
          title: currentSpeechLang === 'bn-BD' ? "ভয়েস সার্চ শুরু" : "Voice Search Started",
          description: currentSpeechLang === 'bn-BD' ? "অনুগ্রহ করে কথা বলুন..." : "Please speak now...",
          duration: 2000,
        })
        
        setIsListening(true)
      }
    } catch (error) {
      console.error('Error toggling voice recognition:', error)
      setIsListening(false)
      
      toast({
        title: "Voice Search Error",
        description: "An error occurred while starting voice search. Please try again.",
        variant: "destructive",
        duration: 4000,
      })
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return
    
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, profileData: updates })
      })
      
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.profile)
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }

  // File handling functions
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image or video file.",
        variant: "destructive",
      })
      return
    }

    setUploadedFile(file)
    setIsProcessingFile(true)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string)
      setIsProcessingFile(false)
    }
    reader.readAsDataURL(file)

    // Process file for visual search
    processVisualSearch(file)
  }

  const processVisualSearch = async (file: File) => {
    if (!isOnline) {
      toast({
        title: "Offline Mode",
        description: "Visual search requires internet connection.",
        variant: "destructive",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Show initial processing message
      setProcessingMessage("Initializing visual analysis...")
      
      const response = await fetch('/api/visual-search', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Show analysis progress messages
          if (data.analysisProgress && data.analysisProgress.length > 0) {
            for (let i = 0; i < data.analysisProgress.length; i++) {
              setProcessingMessage(data.analysisProgress[i])
              // Add delay to show each progress message
              await new Promise(resolve => setTimeout(resolve, 800))
            }
          }
          
          setResults(data.results)
          setQuery(data.query || `Visual search: ${file.name}`)
          setProcessingMessage(null)
          
          // Show success toast with visual category
          if (data.visualCategory) {
            toast({
              title: "Visual Search Complete",
              description: `Found ${data.results.length} results for ${data.visualCategory} content`,
              variant: "default",
            })
          }
        }
      } else {
        throw new Error('Visual search failed')
      }
    } catch (error) {
      console.error('Visual search error:', error)
      setProcessingMessage(null)
      toast({
        title: "Visual Search Error",
        description: "Failed to process image/video for visual search.",
        variant: "destructive",
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const clearFileUpload = () => {
    setUploadedFile(null)
    setFilePreview(null)
    setProcessingMessage(null)
    setShowImageUpload(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) return
    
    setLoading(true)
    setIsSearching(true)
    setShowSuggestions(false)
    
    // Add to search history
    const historyItem: SearchHistory = {
      id: Date.now().toString(),
      query: finalQuery,
      timestamp: Date.now(),
      searchMode: searchMode
    }
    
    setSearchHistory(prev => [historyItem, ...prev.slice(0, 19)]) // Keep last 20 searches
    
    // Update user profile learning data
    if (userProfile) {
      const category = detectCategory(finalQuery)
      const updatedProfile = {
        ...userProfile,
        searchHistory: [historyItem, ...userProfile.searchHistory.slice(0, 49)],
        preferences: {
          ...userProfile.preferences,
          searchModes: {
            ...userProfile.preferences.searchModes,
            [searchMode]: (userProfile.preferences.searchModes[searchMode] || 0) + 1
          }
        }
      }
      
      if (category) {
        updatedProfile.preferences.categories[category] = (updatedProfile.preferences.categories[category] || 0) + 1
      }
      
      updateUserProfile(updatedProfile)
    }
    
    try {
      // Check if we should use offline mode
      if (offlineMode || !isOnline) {
        // Try to get cached results
        const cachedResults = getCachedResults(finalQuery)
        if (cachedResults) {
          setResults(cachedResults)
          setLoading(false)
          return
        }
      }
      
      // Build search URL with operators
      let searchUrl = `/api/search?q=${encodeURIComponent(finalQuery)}&mode=${searchMode}`
      
      if (searchOperators.regex) {
        searchUrl += '&regex=true'
      }
      if (searchOperators.boolean) {
        searchUrl += '&boolean=true'
      }
      if (searchOperators.exact) {
        searchUrl += '&exact=true'
      }
      
      const response = await fetch(searchUrl)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
        // Cache results for offline use
        cacheResults(finalQuery, data.results)
      } else {
        console.error("Search failed:", data.error)
      }
    } catch (error) {
      console.error("Error searching:", error)
      if (!isOnline) {
        toast({
          title: "Offline Mode",
          description: "You're offline. Some features may not work.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Offline caching functions
  const cacheResults = (query: string, results: SearchResult[]) => {
    const cacheData = {
      query,
      results,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }
    
    localStorage.setItem(`cache_${query}`, JSON.stringify(cacheData))
  }

  const getCachedResults = (query: string): SearchResult[] | null => {
    const cached = localStorage.getItem(`cache_${query}`)
    if (!cached) return null
    
    try {
      const cacheData = JSON.parse(cached)
      if (cacheData.expires > Date.now()) {
        return cacheData.results
      } else {
        // Remove expired cache
        localStorage.removeItem(`cache_${query}`)
        return null
      }
    } catch {
      return null
    }
  }

  const detectCategory = (query: string): string | null => {
    const queryLower = query.toLowerCase()
    
    if (queryLower.includes('ai') || queryLower.includes('artificial intelligence') || queryLower.includes('machine learning')) {
      return 'ai'
    } else if (queryLower.includes('code') || queryLower.includes('programming') || queryLower.includes('javascript') || queryLower.includes('python')) {
      return 'programming'
    } else if (queryLower.includes('security') || queryLower.includes('cyber') || queryLower.includes('hack')) {
      return 'cybersecurity'
    } else if (queryLower.includes('tech') || queryLower.includes('technology') || queryLower.includes('computer')) {
      return 'technology'
    } else if (queryLower.includes('science') || queryLower.includes('research') || queryLower.includes('study')) {
      return 'science'
    }
    
    return null
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    handleSearch(suggestion)
  }

  const handleHistoryClick = (historyItem: SearchHistory) => {
    setQuery(historyItem.query)
    setSearchMode(historyItem.searchMode as SearchMode)
    setShowHistory(false)
    handleSearch(historyItem.query)
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  const getSearchModeIcon = (mode: SearchMode) => {
    switch (mode) {
      case 'web': return <Globe className="w-4 h-4" />
      case 'images': return <Image className="w-4 h-4" alt="" />
      case 'news': return <Newspaper className="w-4 h-4" />
      case 'videos': return <Video className="w-4 h-4" />
      case 'dark-web': return <Shield className="w-4 h-4" />
    }
  }

  const getSearchModeColor = (mode: SearchMode) => {
    switch (mode) {
      case 'web': return 'from-cyan-500 to-blue-500'
      case 'images': return 'from-purple-500 to-pink-500'
      case 'news': return 'from-green-500 to-emerald-500'
      case 'videos': return 'from-red-500 to-orange-500'
      case 'dark-web': return 'from-gray-700 to-red-900'
    }
  }

  const getQuickAnswerIcon = (type: QuickAnswer['type']) => {
    switch (type) {
      case 'summary': return <Brain className="w-4 h-4" />
      case 'translation': return <Globe className="w-4 h-4" />
      case 'code': return <Code className="w-4 h-4" />
      case 'general': return <Sparkles className="w-4 h-4" />
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />
      case 'down': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
      case 'stable': return <div className="w-3 h-3 bg-yellow-400 rounded-full" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-cyan-400 overflow-hidden relative">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDZmZmYxMCIgb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6Ii8+PHBhdGggZD0iTTQwIDBWNDBNMCQ0MCIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Animated neon lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-12 cyber-scan relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 flex items-center gap-2">
              {!isOnline && (
                <div className="flex items-center gap-1 text-orange-400 text-xs">
                  <WifiOff className="w-3 h-3" />
                  <span>Offline</span>
                </div>
              )}
              {offlineMode && isOnline && (
                <div className="flex items-center gap-1 text-blue-400 text-xs">
                  <Database className="w-3 h-3" />
                  <span>Offline Mode</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-3">
              <ButterflyImage className="animate-pulse cyber-glow" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent cyber-glitch">
                {t('app.title')}
              </h1>
              <ButterflyImage className="animate-pulse delay-300 cyber-glow" />
            </div>
            <div className="flex-1 flex justify-end">
              <LanguageSwitcher />
            </div>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-mono tracking-wider cyber-neon">
            {t('app.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Cpu className="w-4 h-4 cyber-neon" />
            <span className="cyber-text">{t('app.status')}</span>
            <Brain className="w-4 h-4 cyber-neon" />
          </div>
        </div>

        {/* Trending Queries Panel */}
        {showTrending && trendingQueries.length > 0 && (
          <Card className="w-full max-w-4xl mb-6 bg-black/60 backdrop-blur-sm border-cyan-500/20 cyber-scan">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-cyan-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="cyber-text">{t('trending.title')}</span>
                  <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                    {t('trending.live')}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTrending(false)}
                  className="text-gray-400 hover:text-gray-300 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trendingQueries.map((trending, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(trending.query)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-cyan-500/10 cursor-pointer transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-cyan-400 font-mono w-6">#{index + 1}</span>
                      <span className="text-cyan-300 group-hover:text-cyan-200 transition-colors cyber-text">
                        {trending.query}
                      </span>
                      <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                        {trending.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(trending.trend)}
                      <span className={`text-xs font-mono ${
                        trending.trend === 'up' ? 'text-green-400' : 
                        trending.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {trending.change > 0 ? '+' : ''}{trending.change}%
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {(trending.volume / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Mode Selector */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {(['web', 'images', 'news', 'videos', 'dark-web'] as SearchMode[]).map((mode) => (
            <Button
              key={mode}
              variant={searchMode === mode ? "default" : "outline"}
              onClick={() => setSearchMode(mode)}
              className={`flex items-center gap-2 cyber-text ${
                searchMode === mode 
                  ? `bg-gradient-to-r ${getSearchModeColor(mode)} text-white border-0 cyber-glow` 
                  : 'border-cyan-500/30 text-cyan-400 hover:border-cyan-400'
              }`}
            >
              {getSearchModeIcon(mode)}
              <span className="uppercase text-xs">{t(`search.modes.${mode}`)}</span>
            </Button>
          ))}
        </div>

        {/* Search Interface */}
        <div className="w-full max-w-4xl mb-4">
          {/* Voice Status Indicator */}
          {isListening && (
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full animate-pulse">
                <MicOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-mono text-sm">
                  {currentSpeechLang === 'bn-BD' ? 'বাংলায় শোনা হচ্ছে...' : 'Listening...'}
                </span>
                <Badge variant="outline" className="text-xs border-red-500 text-red-400">
                  {currentSpeechLang === 'bn-BD' ? 'বাংলা' : 'EN'}
                </Badge>
              </div>
              {currentSpeechLang === 'bn-BD' && (
                <div className="mt-2 text-xs text-yellow-400 font-mono">
                  দয়া করে স্পষ্টভাবে বাংলায় বলুন - Please speak clearly in Bangla
                </div>
              )}
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-1 cyber-glow">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={t('search.placeholder')}
                    className="w-full bg-black/50 border-cyan-500/50 text-cyan-400 placeholder-cyan-500/50 font-mono text-lg focus:border-cyan-400 focus:ring-cyan-400/20 cyber-text pr-20"
                  />
                  {query && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setQuery("")
                        setShowSuggestions(false)
                        setQuickAnswer(null)
                      }}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  {voiceSupported ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleVoiceRecognition}
                      title={
                        isListening 
                          ? (currentSpeechLang === 'bn-BD' ? 'বন্ধ করুন' : 'Stop Voice Search')
                          : (currentSpeechLang === 'bn-BD' ? 'বাংলায় বলুন' : 'Start Voice Search')
                      }
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 transition-all duration-300 ${
                        isListening 
                          ? 'text-red-400 animate-pulse bg-red-500/10 hover:bg-red-500/20' 
                          : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {currentSpeechLang === 'bn-BD' && (
                        <span className="absolute -top-1 -right-1 text-xs bg-purple-500 text-white rounded-full w-3 h-3 flex items-center justify-center font-bold">
                          বা
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      title="Voice search not supported in this browser"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 cursor-not-allowed opacity-50"
                    >
                      <MicOff className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={() => handleSearch()}
                  disabled={loading || !query.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold border-0 px-8 cyber-glow cyber-text"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('results.loading')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      <span>{t('common.search')}</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg cyber-glow z-20"
              >
                {/* Personalized Suggestions */}
                {personalizedSuggestions.length > 0 && (
                  <div className="border-b border-cyan-500/20 p-2">
                    <div className="text-xs text-cyan-400 font-mono mb-2 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {t('search.suggestions.title')}
                    </div>
                    {personalizedSuggestions.slice(0, 3).map((suggestion, index) => (
                      <div
                        key={`personalized-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 cursor-pointer hover:bg-cyan-500/10 transition-colors rounded"
                      >
                        <div className="flex items-center gap-3">
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 cyber-text">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Regular Suggestions */}
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="px-4 py-3 cursor-pointer hover:bg-cyan-500/10 transition-colors border-b border-cyan-500/10 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-cyan-500" />
                      <span className={`cyber-text ${suggestion.highlighted ? 'text-cyan-300 font-bold' : 'text-gray-300'}`}>
                        {suggestion.text}
                      </span>
                      {suggestion.highlighted && (
                        <Badge variant="outline" className="text-xs border-cyan-500 text-cyan-400">
                          MATCH
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Answer Card */}
          {quickAnswer && (
            <Card className="mt-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 backdrop-blur-sm border-purple-500/30 cyber-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-300 flex items-center gap-2">
                  {getQuickAnswerIcon(quickAnswer.type)}
                  <span className="cyber-text">{t('ai.quickAnswer.title')}</span>
                  <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                    {t(`ai.types.${quickAnswer.type}`)}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                    {Math.round(quickAnswer.confidence * 100)}% {t('ai.quickAnswer.confidence')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {quickAnswer.content}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="border-cyan-500/30 text-cyan-400 hover:border-cyan-400 cyber-text flex items-center gap-2 text-sm sm:text-base"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">{t('search.history.title')}</span>
              <span className="sm:hidden">{t('search.history.short') || 'History'}</span>
              {searchHistory.length > 0 && (
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                  {searchHistory.length}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-cyan-500/30 text-cyan-400 hover:border-cyan-400 cyber-text flex items-center gap-2 text-sm sm:text-base"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">{t('search.filters.title')}</span>
              <span className="sm:hidden">{t('search.filters.short') || 'Filters'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowProfile(!showProfile)}
              className="border-cyan-500/30 text-cyan-400 hover:border-cyan-400 cyber-text flex items-center gap-2 text-sm sm:text-base"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t('profile.title')}</span>
              <span className="sm:hidden">{t('profile.short') || 'Profile'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTrending(!showTrending)}
              className="border-cyan-500/30 text-cyan-400 hover:border-cyan-400 cyber-text flex items-center gap-2 text-sm sm:text-base"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">{t('trending.title')}</span>
              <span className="sm:hidden">{t('trending.short') || 'Trending'}</span>
            </Button>
            
            {/* New Features */}
            <Button
              variant="outline"
              onClick={() => setShowImageUpload(!showImageUpload)}
              className={`border-purple-500/30 text-purple-400 hover:border-purple-400 cyber-text flex items-center gap-2 text-sm sm:text-base ${
                showImageUpload ? 'bg-purple-500/20' : ''
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Visual Search</span>
              <span className="sm:hidden">Visual</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setAdvancedSearch(!advancedSearch)}
              className={`border-green-500/30 text-green-400 hover:border-green-400 cyber-text flex items-center gap-2 text-sm sm:text-base ${
                advancedSearch ? 'bg-green-500/20' : ''
              }`}
            >
              <Hash className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
              <span className="sm:hidden">Adv</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setOfflineMode(!offlineMode)}
              className={`border-orange-500/30 text-orange-400 hover:border-orange-400 cyber-text flex items-center gap-2 text-sm sm:text-base ${
                offlineMode ? 'bg-orange-500/20' : ''
              } ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isOnline}
            >
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="hidden sm:inline">{offlineMode ? 'Online Mode' : 'Offline Mode'}</span>
              <span className="sm:hidden">{offlineMode ? 'Online' : 'Offline'}</span>
            </Button>
          </div>
        </div>

        {/* Image Upload Panel */}
        {showImageUpload && (
          <Card className="w-full max-w-4xl mb-6 bg-black/60 backdrop-blur-sm border-purple-500/20 cyber-scan">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-purple-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  <span>Visual Search</span>
                  <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                    AI-Powered
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUpload(false)}
                  className="text-gray-400 hover:text-gray-300 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-purple-500/50 rounded-lg p-8 text-center hover:border-purple-400/50 transition-colors cursor-pointer bg-purple-500/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                {processingMessage ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-purple-300">{processingMessage}</p>
                    <p className="text-purple-400 text-sm">This may take a few moments...</p>
                  </div>
                ) : isProcessingFile ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-purple-300">Processing your file...</p>
                  </div>
                ) : filePreview ? (
                  <div className="flex flex-col items-center gap-4">
                    {uploadedFile?.type.startsWith('image/') ? (
                      <img src={filePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg object-cover" />
                    ) : (
                      <video src={filePreview} className="max-w-xs max-h-48 rounded-lg" controls />
                    )}
                    <p className="text-purple-300">{uploadedFile?.name}</p>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearFileUpload()
                      }}
                      className="border-red-500/30 text-red-400 hover:border-red-400"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <FileImage className="w-12 h-12 text-purple-400" />
                    <div>
                      <p className="text-purple-300 font-medium">Drag & drop your image or video here</p>
                      <p className="text-gray-400 text-sm">or click to browse</p>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>Supported: JPG, PNG, GIF, WebP, MP4, WebM</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advanced Search Panel */}
        {advancedSearch && (
          <Card className="w-full max-w-4xl mb-6 bg-black/60 backdrop-blur-sm border-green-500/20 cyber-scan">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  <span>Advanced Search Operators</span>
                  <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                    Developer Tools
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdvancedSearch(false)}
                  className="text-gray-400 hover:text-gray-300 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="regex"
                    checked={searchOperators.regex}
                    onCheckedChange={(checked) => 
                      setSearchOperators(prev => ({ ...prev, regex: checked }))
                    }
                  />
                  <Label htmlFor="regex" className="text-green-300 flex items-center gap-2">
                    <span>Regex Search</span>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                      /pattern/
                    </Badge>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="boolean"
                    checked={searchOperators.boolean}
                    onCheckedChange={(checked) => 
                      setSearchOperators(prev => ({ ...prev, boolean: checked }))
                    }
                  />
                  <Label htmlFor="boolean" className="text-green-300 flex items-center gap-2">
                    <span>Boolean Search</span>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                      AND/OR/NOT
                    </Badge>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="exact"
                    checked={searchOperators.exact}
                    onCheckedChange={(checked) => 
                      setSearchOperators(prev => ({ ...prev, exact: checked }))
                    }
                  />
                  <Label htmlFor="exact" className="text-green-300 flex items-center gap-2">
                    <span>Exact Match</span>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                      "phrase"
                    </Badge>
                  </Label>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="text-green-300 font-medium mb-2">Examples:</h4>
                <div className="space-y-1 text-sm text-gray-300 font-mono">
                  <div>• Regex: <span className="text-green-400">/react\.(js|jsx)/</span></div>
                  <div>• Boolean: <span className="text-green-400">react AND hooks NOT native</span></div>
                  <div>• Exact: <span className="text-green-400">"useEffect hook"</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Profile Panel */}
        {showProfile && userProfile && (
          <Card className="w-full max-w-4xl mb-6 bg-black/60 backdrop-blur-sm border-cyan-500/20 cyber-scan">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-cyan-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="cyber-text">{t('profile.title')}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfile(false)}
                  className="text-gray-400 hover:text-gray-300 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preferences" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preferences">{t('profile.preferences')}</TabsTrigger>
                  <TabsTrigger value="activity">{t('profile.activity')}</TabsTrigger>
                  <TabsTrigger value="insights">{t('profile.insights')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preferences" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-mono text-cyan-400 mb-2">{t('profile.searchModes')}</h4>
                      <div className="space-y-1">
                        {Object.entries(userProfile.preferences.searchModes)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([mode, count]) => (
                            <div key={mode} className="flex justify-between text-sm">
                              <span className="text-gray-300">{t(`search.modes.${mode}`)}</span>
                              <span className="text-cyan-400">{count} searches</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-mono text-cyan-400 mb-2">{t('profile.categories')}</h4>
                      <div className="space-y-1">
                        {Object.entries(userProfile.preferences.categories)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([category, count]) => (
                            <div key={category} className="flex justify-between text-sm">
                              <span className="text-gray-300">{category}</span>
                              <span className="text-cyan-400">{count} searches</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4">
                  <div>
                    <h4 className="text-sm font-mono text-cyan-400 mb-2">{t('profile.activity')}</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {userProfile.searchHistory.slice(-5).map((search, index) => (
                        <div key={index} className="flex justify-between text-sm p-2 rounded hover:bg-cyan-500/10">
                          <span className="text-gray-300">{search.query}</span>
                          <span className="text-cyan-400 text-xs">{t(`search.modes.${search.searchMode}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="insights" className="space-y-4">
                  <div>
                    <h4 className="text-sm font-mono text-cyan-400 mb-2">{t('profile.insights')}</h4>
                    <div className="text-sm text-gray-300">
                      <p>Based on your activity, you prefer technology and programming content.</p>
                      <p className="mt-2">Most active during: Evening hours</p>
                      <p>Average search session: 3-5 queries</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="w-full max-w-4xl mb-6 bg-black/60 backdrop-blur-sm border-cyan-500/20 cyber-scan">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-cyan-300 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <span className="cyber-text">{t('search.filters.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-cyan-400 cyber-text">{t('search.filters.safeSearch')}</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={safeSearch}
                      onCheckedChange={setSafeSearch}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                    <span className="text-sm text-gray-300 cyber-text">
                      {safeSearch ? t('common.search') : t('common.close')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-cyan-400 cyber-text">{t('search.filters.dateRange')}</Label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-black/50 border border-cyan-500/30 text-cyan-400 rounded px-3 py-2 cyber-text text-sm"
                  >
                    <option value="any">{t('search.filters.any')}</option>
                    <option value="day">{t('search.filters.day')}</option>
                    <option value="week">{t('search.filters.week')}</option>
                    <option value="month">{t('search.filters.month')}</option>
                    <option value="year">{t('search.filters.year')}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-cyan-400 cyber-text">{t('search.filters.language')}</Label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-black/50 border border-cyan-500/30 text-cyan-400 rounded px-3 py-2 cyber-text text-sm"
                  >
                    <option value="all">{t('search.filters.any')}</option>
                    <option value="en">English</option>
                    <option value="bn">বাংলা (Bangla)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search History Panel */}
        {showHistory && (
          <Card className="w-full max-w-4xl mb-6 bg-black/60 backdrop-blur-sm border-cyan-500/20 cyber-scan">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-cyan-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  <span className="cyber-text">{t('search.history.title')}</span>
                </div>
                {searchHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-red-400 hover:text-red-300 h-8 px-3"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('search.history.clear')}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500 cyber-text">
                  {t('search.history.empty')}
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleHistoryClick(item)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-cyan-500/10 cursor-pointer transition-colors border border-cyan-500/10"
                    >
                      <div className="flex items-center gap-3">
                        {getSearchModeIcon(item.searchMode as SearchMode)}
                        <span className="text-cyan-300 cyber-text">{item.query}</span>
                        <Badge variant="outline" className="text-xs border-cyan-500 text-cyan-400">
                          {t(`search.modes.${item.searchMode}`)}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 cyber-text">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {isSearching && (
          <div className="mt-8 space-y-4 w-full max-w-4xl">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-cyan-400">
                  <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xl font-mono cyber-text">{t('results.loading')} {t(`search.modes.${searchMode}`)}...</span>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-400 font-mono cyber-text">
                  <span>{t('results.title')} {results.length}</span>
                  <span>{t('common.search')}: {query} ({t(`search.modes.${searchMode}`)})</span>
                </div>
                {results.map((result, index) => (
                  <Card key={index} className="bg-black/60 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cyber-scan">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-cyan-300 hover:text-cyan-200 transition-colors">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-start gap-3"
                        >
                          <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5 cyber-glow">
                            <span className="text-xs text-cyan-400 cyber-text">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">{result.name}</div>
                            <div className="text-sm text-cyan-500/70 font-mono mt-1 cyber-text">{result.url}</div>
                          </div>
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-300 leading-relaxed">{result.snippet}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="font-mono cyber-text">{result.host_name}</span>
                        <span className="font-mono cyber-text">{result.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-cyan-400 text-xl font-mono cyber-neon">{t('results.noResults')}</div>
                <div className="text-gray-500 mt-2 cyber-text">{t('common.retry')}</div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <div className="text-xs text-gray-600 font-mono cyber-text">
            <div className="flex items-center justify-center gap-4">
              <span className="cyber-neon">{t('app.title')}</span>
              <span>•</span>
              <span className="cyber-neon">{t('app.status')}</span>
              <span>•</span>
              <span className="cyber-neon">ENCRYPTED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}