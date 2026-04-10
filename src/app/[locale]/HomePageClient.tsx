'use client'

import { useEffect, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Gift,
  Sparkles,
  Star,
  Trophy,
  Users,
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
                'mystery-gift-codes', 'beginner-guide', 'starter-teams', 'tier-list'
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
