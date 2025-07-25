<script setup lang="ts">
import { showMoeMessage } from '~/widget/showMoeMessage'

const { showKUNGalgamePageTransparency, showKUNGalgameBackgroundBlur } =
  storeToRefs(usePersistSettingsStore())

const route = useRoute()
useHead({
  htmlAttrs: { lang: 'zh-Hans' },
  meta: [{ name: 'image', content: kungal.images[0].fullUrl }],
  templateParams: {
    schemaOrg: {
      host: kungal.domain.main,
      path: route.path,
      inLanguage: 'zh-Hans'
    }
  },
  link: [
    {
      rel: 'alternative',
      href: `https://www.kungal.com/rss/topic.xml`,
      type: 'application/rss+xml',
      title: () => `${kungal.titleShort}话题订阅`
    },
    {
      rel: 'feed',
      href: `https://www.kungal.com/rss/topic.xml`,
      type: 'application/rss+xml',
      title: `${kungal.titleShort}话题订阅`
    },
    {
      rel: 'alternative',
      href: `https://www.kungal.com/rss/galgame.xml`,
      type: 'application/rss+xml',
      title: () => `${kungal.titleShort} Galgame 订阅`
    },
    {
      rel: 'feed',
      href: `https://www.kungal.com/rss/galgame.xml`,
      type: 'application/rss+xml',
      title: () => `${kungal.titleShort} Galgame 订阅`
    },
    {
      rel: 'me',
      href: `https://mastodon.social/@kungal`,
      type: 'text/html',
      title: 'Mastodon'
    },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: kungal.domain.main }
  ]
})

useSeoMeta({
  titleTemplate: () => kungal.titleTemplate,
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
  formatDetection: 'telephone=no',
  description: kungal.description,
  themeColor: kungal.themeColor,

  ogDescription: kungal.description,
  ogLocale: 'zh_CN',
  ogTitle: kungal.title,
  ogSiteName: kungal.title,
  ogType: 'website',

  // use absolute URLs
  ogImage: kungal.images[0].fullUrl,
  ogImageAlt: kungal.title,

  ogImageWidth: 1920,
  ogImageHeight: 1080,
  ogImageType: 'image/png',
  ogImageUrl: `${kungal.domain.main}/kungalgame.png`,

  twitterCard: 'summary_large_image',
  twitterImage: `${kungal.domain.main}/kungalgame.png`
})

useSchemaOrg([
  defineOrganization({
    name: kungal.titleShort,
    url: kungal.domain.main,
    sameAs: [kungal.github]
  }),
  defineWebSite({ name: kungal.titleShort, description: kungal.description }),
  defineWebPage()
])

onMounted(() => {
  usePersistSettingsStore().setKUNGalgameTransparency(
    showKUNGalgamePageTransparency.value
  )

  usePersistSettingsStore().setKUNGalgameBackgroundBlur(
    showKUNGalgameBackgroundBlur.value
  )

  if (process.env.NODE_ENV === 'development') {
    // Disable pinia console info for dev
    localStorage.setItem(
      '__VUE_DEVTOOLS_NEXT_PLUGIN_SETTINGS__dev.esm.pinia__',
      '{"logStoreChanges":false}'
    )
    // Disable umami for dev
    localStorage.setItem('umami.disabled', '1')
  } else {
    showMoeMessage()
  }
})
</script>

<template>
  <div class="kun">
    <KunAlert />

    <KunCapture />

    <KunFloatingBar />

    <LazyTopicReplyPanel />

    <LazyKunSettingPanel />

    <NuxtPwaManifest />
    <NuxtLoadingIndicator color="var(--color-primary)" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
