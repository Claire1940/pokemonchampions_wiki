'use client'

import { useEffect, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Gift,
  Globe,
  Home,
  Package,
  Scale,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pokemonchampions.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Pokemon Champions Wiki",
        description: "Pokemon Champions hub for battle modes, HOME transfer, Mega Evolution, rewards, regulations, and VGC-ready team guides for Switch and mobile players.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Pokémon Champions - Free-to-Start Competitive Battle Game",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "Pokemon Champions Wiki",
        alternateName: "Pokemon Champions",
        url: siteUrl,
        description: "Pokemon Champions resource hub for battle modes, HOME transfer, Mega Evolution, team building, and VGC regulations",
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Pokemon Champions Wiki - Free-to-Start Competitive Battle Game",
        },
        sameAs: [
          'https://champions.pokemon.com/en-us/',
          'https://community.pokemon.com/en-us/',
          'https://www.reddit.com/r/PokemonChampions/',
          'https://www.youtube.com/watch?v=pOfW-qdsvpU',
          'https://www.nintendo.com/us/store/products/pokemon-champions-switch/',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "Pokémon Champions",
        gamePlatform: ['Nintendo Switch', 'Nintendo Switch 2'],
        applicationCategory: 'Game',
        genre: ['Battle', 'Strategy', 'Competitive', 'RPG'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 2,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: '0',
          availability: 'https://schema.org/InStock',
          url: 'https://www.nintendo.com/us/store/products/pokemon-champions-switch/',
        },
      },
    ],
  }

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('beginner-guide')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://champions.pokemon.com/en-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="pOfW-qdsvpU"
              title="Pokémon Champions – Overview Trailer – Nintendo Switch"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'mystery-gift-codes', 'beginner-guide', 'starter-teams', 'tier-list',
                'pokemon-champions-best-teams', 'pokemon-champions-ranked-battles-guide',
                'pokemon-champions-pokemon-home-guide', 'pokemon-champions-all-pokemon-list',
                'pokemon-champions-training-guide', 'pokemon-champions-movesets-and-best-builds',
                'pokemon-champions-mega-evolution-guide', 'pokemon-champions-held-items-guide',
                'seasons-and-regulations', 'single-battle-vs-double-battle',
                'battle-pass-and-premium-guide', 'private-battles-and-online-competitions'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Pokemon Champions Mystery Gift Codes */}
      <section id="mystery-gift-codes" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Gift className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsMysteryGiftCodes.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsMysteryGiftCodes.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsMysteryGiftCodes.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsMysteryGiftCodes.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.modules.pokemonChampionsMysteryGiftCodes.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">{item.reward}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${item.status === 'Active' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                    {item.status}
                  </span>
                </div>
                {item.code !== 'None' && (
                  <div className="mb-4 p-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Redeem Code</p>
                    <code className="font-mono font-bold text-[hsl(var(--nav-theme-light))] text-base tracking-widest">{item.code}</code>
                  </div>
                )}
                <div className="space-y-3 text-sm flex-1">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">How to Get</p>
                    <p className="text-foreground">{item.howToGet}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                    <span className="text-xs">Until: {item.availableUntil}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">{item.whyItMatters}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Pokemon Champions Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsBeginnerGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsBeginnerGuide.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.pokemonChampionsBeginnerGuide.subtitle}
            </p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.pokemonChampionsBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  <ul className="space-y-1">
                    {step.details.map((detail: string, di: number) => (
                      <li key={di} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 3: Pokemon Champions Starter Teams */}
      <section id="starter-teams" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Users className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsStarterTeams.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsStarterTeams.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsStarterTeams.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsStarterTeams.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pokemonChampionsStarterTeams.items.map((item: any, index: number) => (
              <div
                key={index}
                className={`p-6 bg-white/5 rounded-xl transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] ${
                  index < 3
                    ? 'border-2 border-[hsl(var(--nav-theme)/0.5)]'
                    : 'border border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{item.starter}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${
                    item.formatFit === 'Singles'
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      : item.formatFit === 'Doubles'
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                      : 'bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]'
                  }`}>
                    {item.formatFit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-medium">{item.bestFor}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.team.map((member: string, mi: number) => (
                    <span key={mi} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border text-muted-foreground">
                      {member}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{item.whyPick}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Pokemon Champions Tier List */}
      <section id="tier-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsTierList.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsTierList.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsTierList.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsTierList.intro}
            </p>
          </div>

          {/* S-Tier */}
          <div className="scroll-reveal mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                <span className="font-bold text-yellow-400 text-lg">S</span>
              </div>
              <h3 className="text-xl font-bold text-yellow-400">S-Tier</h3>
              <span className="text-sm text-muted-foreground">Top picks for early ladder</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.modules.pokemonChampionsTierList.sTier.map((entry: any, index: number) => (
                <div key={index} className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl hover:border-yellow-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg">{entry.pokemon}</h4>
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-yellow-400/80 mb-2 font-medium">{entry.bestIn}</p>
                  <p className="text-sm text-muted-foreground mb-3">{entry.whyItWins}</p>
                  <div className="flex items-start gap-1 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>{entry.howToGet}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A-Tier */}
          <div className="scroll-reveal">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center">
                <span className="font-bold text-[hsl(var(--nav-theme-light))] text-lg">A</span>
              </div>
              <h3 className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">A-Tier</h3>
              <span className="text-sm text-muted-foreground">Strong, reliable picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.modules.pokemonChampionsTierList.aTier.map((entry: any, index: number) => (
                <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg">{entry.pokemon}</h4>
                    <ArrowRight className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  </div>
                  <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-2 font-medium opacity-80">{entry.bestIn}</p>
                  <p className="text-sm text-muted-foreground mb-3">{entry.whyItWins}</p>
                  <div className="flex items-start gap-1 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>{entry.howToGet}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Module 5: Pokemon Champions Best Teams */}
      <section id="pokemon-champions-best-teams" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsBestTeams.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsBestTeams.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsBestTeams.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsBestTeams.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.modules.pokemonChampionsBestTeams.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">{item.card_title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground flex-shrink-0">
                    {item.style}
                  </span>
                </div>
                <div className="mb-4 p-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Replica Code</p>
                  <code className="font-mono font-bold text-[hsl(var(--nav-theme-light))] text-base tracking-widest">{item.team_code}</code>
                </div>
                <p className="text-xs text-muted-foreground mb-3">by <span className="text-foreground font-medium">{item.owner}</span></p>
                <div className="flex flex-wrap gap-1 mb-4 flex-1">
                  {item.full_team.map((member: string, mi: number) => (
                    <span key={mi} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border text-muted-foreground">
                      {member}
                    </span>
                  ))}
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">{item.best_for}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 标准横幅 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Module 6: Pokemon Champions Ranked Battles Guide */}
      <section id="pokemon-champions-ranked-battles-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsRankedBattlesGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsRankedBattlesGuide.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsRankedBattlesGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsRankedBattlesGuide.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left px-6 py-4 font-semibold text-[hsl(var(--nav-theme-light))] w-1/4">Topic</th>
                  <th className="text-left px-6 py-4 font-semibold w-1/3">Value</th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.pokemonChampionsRankedBattlesGuide.items.map((item: any, index: number) => (
                  <tr key={index} className={`border-b border-border last:border-0 hover:bg-white/5 transition-colors ${index % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-6 py-4 font-medium text-[hsl(var(--nav-theme-light))]">{item.topic}</td>
                    <td className="px-6 py-4 font-semibold">{item.value}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.pokemonChampionsRankedBattlesGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <p className="text-xs text-[hsl(var(--nav-theme-light))] font-semibold mb-1">{item.topic}</p>
                <p className="font-bold mb-2">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Module 7: Pokemon Champions Pokemon HOME Guide */}
      <section id="pokemon-champions-pokemon-home-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Home className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsPokemonHomeGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsPokemonHomeGuide.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsPokemonHomeGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsPokemonHomeGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pokemonChampionsPokemonHomeGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">{step.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 方形广告 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 8: Pokemon Champions All Pokemon List */}
      <section id="pokemon-champions-all-pokemon-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsAllPokemonList.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsAllPokemonList.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsAllPokemonList.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsAllPokemonList.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left px-5 py-4 font-semibold text-[hsl(var(--nav-theme-light))] w-1/5">Section</th>
                  <th className="text-left px-5 py-4 font-semibold w-1/4">Entry</th>
                  <th className="text-left px-5 py-4 font-semibold w-1/5">Value</th>
                  <th className="text-left px-5 py-4 font-semibold text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.pokemonChampionsAllPokemonList.items.map((item: any, index: number) => (
                  <tr key={index} className={`border-b border-border last:border-0 hover:bg-white/5 transition-colors ${index % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        {item.section}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium">{item.entry}</td>
                    <td className="px-5 py-3 font-bold text-[hsl(var(--nav-theme-light))]">{item.value}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.pokemonChampionsAllPokemonList.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                    {item.section}
                  </span>
                  <span className="font-bold text-[hsl(var(--nav-theme-light))] text-sm">{item.value}</span>
                </div>
                <p className="font-medium text-sm mb-1">{item.entry}</p>
                <p className="text-xs text-muted-foreground">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Module 9: Pokemon Champions Training Guide */}
      <section id="pokemon-champions-training-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Target className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsTrainingGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsTrainingGuide.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsTrainingGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsTrainingGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.pokemonChampionsTrainingGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{step.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 标准横幅 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Module 10: Pokemon Champions Movesets and Best Builds */}
      <section id="pokemon-champions-movesets-and-best-builds" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Swords className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsMovesetsAndBestBuilds.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsMovesetsAndBestBuilds.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsMovesetsAndBestBuilds.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsMovesetsAndBestBuilds.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.modules.pokemonChampionsMovesetsAndBestBuilds.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-xl text-[hsl(var(--nav-theme-light))]">{item.pokemon}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground flex-shrink-0 ml-2">
                    {item.format}
                  </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-4">{item.role}</p>
                <div className="space-y-3 flex-1">
                  <div className="p-3 bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Core Build</p>
                    <p className="text-sm font-mono text-foreground">{item.coreBuild}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Top Items</p>
                    <p className="text-sm text-muted-foreground">{item.topItems}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Common Moves</p>
                    <p className="text-sm text-muted-foreground">{item.commonMoves}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">{item.teamNote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 方形广告 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 11: Pokemon Champions Mega Evolution Guide */}
      <section id="pokemon-champions-mega-evolution-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Zap className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsMegaEvolutionGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsMegaEvolutionGuide.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsMegaEvolutionGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsMegaEvolutionGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.pokemonChampionsMegaEvolutionGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{step.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 移动端横幅 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 12: Pokemon Champions Held Items Guide */}
      <section id="pokemon-champions-held-items-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Package className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsHeldItemsGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsHeldItemsGuide.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsHeldItemsGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsHeldItemsGuide.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left px-5 py-4 font-semibold text-[hsl(var(--nav-theme-light))] w-1/5">Item / Group</th>
                  <th className="text-left px-5 py-4 font-semibold w-1/4">Examples</th>
                  <th className="text-left px-5 py-4 font-semibold w-1/5">Effect</th>
                  <th className="text-left px-5 py-4 font-semibold text-muted-foreground w-1/5">How to Use</th>
                  <th className="text-left px-5 py-4 font-semibold text-muted-foreground">Cost / Source</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.pokemonChampionsHeldItemsGuide.items.map((item: any, index: number) => (
                  <tr key={index} className={`border-b border-border last:border-0 hover:bg-white/5 transition-colors ${index % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-5 py-3 font-semibold text-[hsl(var(--nav-theme-light))]">{item.itemOrGroup}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{item.examples}</td>
                    <td className="px-5 py-3 text-sm">{item.whatItDoes}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{item.howToUseIt}</td>
                    <td className="px-5 py-3 text-xs font-medium text-[hsl(var(--nav-theme-light))]">{item.vpCostOrSource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.pokemonChampionsHeldItemsGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[hsl(var(--nav-theme-light))]">{item.itemOrGroup}</p>
                  <span className="text-xs text-[hsl(var(--nav-theme-light))] font-medium">{item.vpCostOrSource}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{item.examples}</p>
                <p className="text-sm mb-1">{item.whatItDoes}</p>
                <p className="text-xs text-muted-foreground italic">{item.howToUseIt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 标准横幅 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Module 13: Pokemon Champions Seasons and Regulations */}
      <section id="seasons-and-regulations" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Calendar className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsSeasonsAndRegulations.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsSeasonsAndRegulations.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsSeasonsAndRegulations.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsSeasonsAndRegulations.intro}
            </p>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="scroll-reveal hidden md:grid grid-cols-4 gap-4 relative">
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-[hsl(var(--nav-theme)/0.3)]" />
            {t.modules.pokemonChampionsSeasonsAndRegulations.items.map((item: any, index: number) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative z-10 w-16 h-16 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">{item.label}</span>
                <p className="text-xs text-muted-foreground mb-2 font-medium">{item.date}</p>
                <div className="p-4 bg-white/5 border border-border rounded-xl w-full text-left hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{item.details}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag: string, ti: number) => (
                      <span key={ti} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.2)] text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: stacked cards */}
          <div className="scroll-reveal md:hidden space-y-4">
            {t.modules.pokemonChampionsSeasonsAndRegulations.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">{item.label}</span>
                  <p className="text-xs text-muted-foreground mb-1">{item.date}</p>
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.details}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag: string, ti: number) => (
                      <span key={ti} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.2)] text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 方形广告 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 14: Pokemon Champions Single Battle vs Double Battle */}
      <section id="single-battle-vs-double-battle" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Scale className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsSingleBattleVsDoubleBattle.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsSingleBattleVsDoubleBattle.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsSingleBattleVsDoubleBattle.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsSingleBattleVsDoubleBattle.intro}
            </p>
          </div>

          {/* Desktop: 3-column comparison table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left px-5 py-4 font-semibold w-1/3">{t.modules.pokemonChampionsSingleBattleVsDoubleBattle.headers.aspect}</th>
                  <th className="text-left px-5 py-4 font-semibold text-[hsl(var(--nav-theme-light))] w-1/3">{t.modules.pokemonChampionsSingleBattleVsDoubleBattle.headers.single}</th>
                  <th className="text-left px-5 py-4 font-semibold text-[hsl(var(--nav-theme-light))] w-1/3">{t.modules.pokemonChampionsSingleBattleVsDoubleBattle.headers.double}</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.pokemonChampionsSingleBattleVsDoubleBattle.items.map((item: any, index: number) => (
                  <tr key={index} className={`border-b border-border last:border-0 hover:bg-white/5 transition-colors ${index % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{item.aspect}</td>
                    <td className="px-5 py-3 text-sm">{item.single}</td>
                    <td className="px-5 py-3 text-sm">{item.double}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked comparison cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.pokemonChampionsSingleBattleVsDoubleBattle.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{item.aspect}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] font-semibold mb-1">Singles</p>
                    <p className="text-xs text-muted-foreground">{item.single}</p>
                  </div>
                  <div className="p-3 bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)] rounded-lg">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] font-semibold mb-1">Doubles</p>
                    <p className="text-xs text-muted-foreground">{item.double}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 移动端横幅 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 15: Pokemon Champions Battle Pass and Premium Guide */}
      <section id="battle-pass-and-premium-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <CreditCard className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsBattlePassAndPremiumGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsBattlePassAndPremiumGuide.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsBattlePassAndPremiumGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsBattlePassAndPremiumGuide.intro}
            </p>
          </div>

          {/* Desktop: 5-column pricing table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left px-4 py-4 font-semibold text-[hsl(var(--nav-theme-light))]">{t.modules.pokemonChampionsBattlePassAndPremiumGuide.headers.product}</th>
                  <th className="text-left px-4 py-4 font-semibold">{t.modules.pokemonChampionsBattlePassAndPremiumGuide.headers.access}</th>
                  <th className="text-left px-4 py-4 font-semibold">{t.modules.pokemonChampionsBattlePassAndPremiumGuide.headers.value}</th>
                  <th className="text-left px-4 py-4 font-semibold text-muted-foreground">{t.modules.pokemonChampionsBattlePassAndPremiumGuide.headers.examples}</th>
                  <th className="text-left px-4 py-4 font-semibold text-muted-foreground">{t.modules.pokemonChampionsBattlePassAndPremiumGuide.headers.bestFor}</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.pokemonChampionsBattlePassAndPremiumGuide.items.map((item: any, index: number) => (
                  <tr key={index} className={`border-b border-border last:border-0 hover:bg-white/5 transition-colors ${index % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-4 py-3 font-bold text-[hsl(var(--nav-theme-light))]">{item.product}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.access}</td>
                    <td className="px-4 py-3 text-sm">{item.value}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.examples}</td>
                    <td className="px-4 py-3 text-xs font-medium text-[hsl(var(--nav-theme-light))]">{item.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked offer cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.pokemonChampionsBattlePassAndPremiumGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">{item.product}</h3>
                <p className="text-xs text-muted-foreground mb-2">{item.access}</p>
                <p className="text-sm mb-2">{item.value}</p>
                <div className="p-2 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] rounded-lg mb-2">
                  <p className="text-xs text-muted-foreground italic">{item.examples}</p>
                </div>
                <p className="text-xs font-medium text-[hsl(var(--nav-theme-light))]">{item.bestFor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位: 中型横幅 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 16: Pokemon Champions Private Battles and Online Competitions */}
      <section id="private-battles-and-online-competitions" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm mb-4">
              <Globe className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span>{t.modules.pokemonChampionsPrivateBattlesAndOnlineCompetitions.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.pokemonChampionsPrivateBattlesAndOnlineCompetitions.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-2">
              {t.modules.pokemonChampionsPrivateBattlesAndOnlineCompetitions.subtitle}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {t.modules.pokemonChampionsPrivateBattlesAndOnlineCompetitions.intro}
            </p>
          </div>

          {/* 2-column step flow: Private Battles (steps 1-6) and Online Competitions (steps 7-11) */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Private Battles steps 1-6 */}
            <div>
              <h3 className="text-base font-bold mb-4 px-1 text-[hsl(var(--nav-theme-light))] flex items-center gap-2">
                <Globe className="w-4 h-4" /> Private Battles
              </h3>
              <div className="space-y-3">
                {t.modules.pokemonChampionsPrivateBattlesAndOnlineCompetitions.items.slice(0, 6).map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center">
                      <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: Online Competitions steps 7-11 */}
            <div>
              <h3 className="text-base font-bold mb-4 px-1 text-[hsl(var(--nav-theme-light))] flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Online Competitions
              </h3>
              <div className="space-y-3">
                {t.modules.pokemonChampionsPrivateBattlesAndOnlineCompetitions.items.slice(6).map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center">
                      <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://community.pokemon.com/en-us/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/PokemonChampions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=pOfW-qdsvpU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.nintendo.com/us/store/products/pokemon-champions-switch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
