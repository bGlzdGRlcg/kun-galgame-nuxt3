import prisma from '~/prisma/prisma'
import type { GalgameSeries, GalgameSample } from '~/types/api/galgame-series'

export default defineEventHandler(async (event) => {
  const nsfw = getNSFWCookie(event)
  const isSFW = nsfw === 'sfw'

  const data = await prisma.galgame_series.findMany({
    where: isSFW
      ? {
          galgame: {
            some: {
              content_limit: 'sfw'
            }
          }
        }
      : {},
    include: {
      _count: {
        select: {
          galgame: true
        }
      },
      galgame: {
        where: isSFW
          ? {
              content_limit: 'sfw'
            }
          : {},
        select: {
          content_limit: true,
          name_en_us: true,
          name_ja_jp: true,
          name_zh_cn: true,
          name_zh_tw: true,
          banner: true
        },
        take: 5,
        orderBy: {
          created: 'asc'
        }
      }
    },
    orderBy: {
      galgame: {
        _count: 'desc'
      }
    }
  })

  const series: GalgameSeries[] = data.map((s) => {
    const isNSFW = s.galgame.some((g) => g.content_limit === 'nsfw')

    const sampleGalgame: GalgameSample[] = s.galgame.map((g) => ({
      banner: g.banner,
      name: {
        'en-us': g.name_en_us,
        'ja-jp': g.name_ja_jp,
        'zh-cn': g.name_zh_cn,
        'zh-tw': g.name_zh_tw
      }
    }))

    return {
      id: s.id,
      name: s.name,
      description: s.description,
      isNSFW,
      sampleGalgame,
      galgameCount: s._count.galgame,
      created: s.created,
      updated: s.updated
    }
  })

  return series
})
