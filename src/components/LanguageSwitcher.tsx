'use client'

import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/hooks/use-i18n'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  const currentLanguage = languages.find(lang => lang.code === language)

  const handleLanguageChange = (langCode: 'en' | 'bn') => {
    setLanguage(langCode)
    // Dispatch custom event for voice recognition to update
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: langCode } }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 gap-2 h-9 px-3"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
          <span className="hidden md:inline">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-sm border-cyan-500/20">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as 'en' | 'bn')}
            className={`flex items-center gap-3 cursor-pointer transition-colors duration-200 ${
              language === lang.code
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-cyan-400">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}