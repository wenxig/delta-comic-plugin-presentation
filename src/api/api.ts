import { pluginName } from "@/symbol"
import { coreModule, requireDepend, uni, Utils } from "delta-comic-core"
const { view: { Images, Videos } } = requireDepend(coreModule)
import { Faker, zh_CN, base, en } from '@faker-js/faker'
import { times } from "es-toolkit/compat"
const faker = new Faker({
  locale: [zh_CN, en, base]
})
export class FakeComicPage extends uni.content.ContentImagePage {
  static contentType = uni.content.ContentPage.toContentTypeString({
    name: 'images',
    plugin: pluginName
  })
  override contentType = uni.content.ContentPage.toContentType(FakeComicPage.contentType)
  override comments = Utils.data.Stream.create<uni.comment.Comment>(function* () {
    while (true) {
      const v = new Array<FakeComment>()
      times(20, () => {
        v.push(new FakeComment())
      })
      yield v
    }
  })
  override loadAll(_signal?: AbortSignal): Promise<any> {
    this.detail.resolve(this.preload.value ?? new FakeComic)
    this.recommends.resolve(times(10, () => new FakeComic))
    this.eps.resolve(times(faker.number.int({ max: 10 }), () => new uni.ep.Ep(createEp())))
    this.images.resolve(times(faker.number.int({ max: 50 }), () =>
      uni.image.Image.create(createBigImage())
    ))
    return Promise.resolve()
  }
  override reloadAll(_signal?: AbortSignal): Promise<any> {
    return Promise.resolve()
  }
  override plugin = pluginName
  override loadAllOffline(): Promise<any> {
    return Promise.resolve()
  }
  override exportOffline(_save: any): Promise<any> {
    return Promise.resolve()
  }
  override ViewComp = Images
  constructor() {
    const item = new FakeComic
    super(item, item.id, item.thisEp.index)
  }
}
export class FakeVideoPage extends uni.content.ContentVideoPage {
  static contentType = uni.content.ContentPage.toContentTypeString({
    name: 'videos',
    plugin: pluginName
  })
  override contentType = uni.content.ContentPage.toContentType(FakeVideoPage.contentType)
  override comments = Utils.data.Stream.create<uni.comment.Comment>(function* () {
    while (true) {
      const v = new Array<FakeComment>()
      times(20, () => {
        v.push(new FakeComment())
      })
      yield v
    }
  })
  override loadAll(_signal?: AbortSignal): Promise<any> {
    this.detail.resolve(this.preload.value ?? new FakeVideo)
    this.recommends.resolve(times(10, () => new FakeVideo))
    this.eps.resolve(times(faker.number.int({ max: 10 }), () => new uni.ep.Ep(createEp())))
    this.videos.resolve([{
      src: 'https://files.vidstack.io/sprite-fight/hls/stream.m3u8',
      type: 'application/mpegurl'
    }])
    return Promise.resolve()
  }
  override reloadAll(_signal?: AbortSignal): Promise<any> {
    return Promise.resolve()
  }
  override plugin = pluginName
  override loadAllOffline(): Promise<any> {
    return Promise.resolve()
  }
  override exportOffline(_save: any): Promise<any> {
    return Promise.resolve()
  }
  override ViewComp = Videos
  constructor() {
    const item = new FakeComic
    super(item, item.id, item.thisEp.index)
  }
}

// https://files.vidstack.io/sprite-fight/hls/stream.m3u8

export class FakeComment extends uni.comment.Comment {
  override sender = new FakeUser
  override like(_signal?: AbortSignal): PromiseLike<boolean> {
    return Promise.resolve(true)
  }
  override report(_signal?: AbortSignal): PromiseLike<any> {
    return Promise.resolve()
  }
  override sendComment(_text: string, _signal?: AbortSignal): PromiseLike<any> {
    return Promise.resolve()
  }
  override children: Utils.data.RStream<uni.comment.Comment> = Utils.data.Stream.create<uni.comment.Comment>(function* () {
    while (true) {
      const v = new Array<FakeComment>()
      times(20, () => {
        v.push(new FakeComment())
      })
      yield v
    }
  })
  constructor() {
    super({
      $$plugin: pluginName,
      childrenCount: faker.number.int({ min: 0, max: 100 }),
      content: {
        text: faker.lorem.sentences({ min: 1, max: 3 }),
        type: 'string'
      },
      id: faker.string.uuid(),
      isLiked: Boolean(faker.number.int({ min: 0, max: 1 })),
      isTop: Boolean(faker.number.int({ min: 0, max: 1 })),
      likeCount: faker.number.int({ min: 0, max: 100 }),
      reported: !Boolean(faker.number.int({ min: 0, max: 4 })),
      sender: new FakeUser(),
      time: faker.date.recent().getTime()
    })
  }
}

export class FakeUser extends uni.user.User {
  override customUser = {}
  constructor() {
    super({
      $$plugin: pluginName,
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: createAvatar()
    })
  }
}

export class FakeComic extends uni.item.Item {
  override like(_signal?: AbortSignal): PromiseLike<boolean> {
    return Promise.resolve(true)
  }
  override report(_signal?: AbortSignal): PromiseLike<any> {
    return Promise.resolve()
  }
  override sendComment(_text: string, _signal?: AbortSignal): PromiseLike<any> {
    return Promise.resolve()
  }
  constructor(_kw?: string) {
    super({
      author: times(faker.number.int({ min: 1, max: 3 }), () => ({
        description: faker.helpers.arrayElement(['作者', '参演', '企划']),
        icon: createAvatar(),
        label: faker.internet.displayName()
      })),
      $$plugin: pluginName,
      $$meta: {},
      categories: times(faker.number.int({ min: 0, max: 15 }), () => ({
        name: faker.lorem.word(),
        search: {
          keyword: faker.lorem.word(),
          sort: '',
          source: 'keyword'
        },
        group: faker.helpers.arrayElement(times(3, i => `分类${i}`))
      })),
      commentSendable: true,
      contentType: FakeComicPage.contentType,
      cover: createBigImage(),
      epLength: faker.number.int({ min: 0, max: 100 }).toString(),
      id: faker.string.uuid(),
      length: faker.number.int({ min: 0, max: 100 }).toString(),
      title: faker.book.title(),
      thisEp: createEp(),
      commentNumber: faker.number.int({ min: 0, max: 100 }),
      customIsSafe: true,
      description: faker.lorem.words({ min: 2, max: 6 }),
      isLiked: Boolean(faker.number.int({ min: 0, max: 1 })),
      viewNumber: faker.number.int({ min: 3000, max: 1000000 }),
      likeNumber: faker.number.int({ min: 0, max: 100 }),
      updateTime: faker.date.recent().getTime()
    })
  }
}


export class FakeVideo extends uni.item.Item {
  override like(_signal?: AbortSignal): PromiseLike<boolean> {
    return Promise.resolve(true)
  }
  override report(_signal?: AbortSignal): PromiseLike<any> {
    return Promise.resolve()
  }
  override sendComment(_text: string, _signal?: AbortSignal): PromiseLike<any> {
    return Promise.resolve()
  }
  constructor(_kw?: string) {
    super({
      author: times(faker.number.int({ min: 1, max: 3 }), () => ({
        description: faker.helpers.arrayElement(['作者', '参演', '企划']),
        icon: createAvatar(),
        label: faker.internet.displayName()
      })),
      $$plugin: pluginName,
      $$meta: {},
      categories: times(faker.number.int({ min: 0, max: 15 }), () => ({
        name: faker.lorem.word(),
        search: {
          keyword: faker.lorem.word(),
          sort: '',
          source: 'keyword'
        },
        group: faker.helpers.arrayElement(times(3, i => `分类${i}`))
      })),
      commentSendable: true,
      contentType: FakeVideoPage.contentType,
      cover: createBigImage(),
      epLength: faker.number.int({ min: 0, max: 100 }).toString(),
      id: faker.string.uuid(),
      length: faker.number.int({ min: 0, max: 100 }).toString(),
      title: faker.book.title(),
      thisEp: createEp(),
      commentNumber: faker.number.int({ min: 0, max: 100 }),
      customIsSafe: true,
      description: faker.lorem.words({ min: 2, max: 6 }),
      isLiked: Boolean(faker.number.int({ min: 0, max: 1 })),
      viewNumber: faker.number.int({ min: 3000, max: 1000000 }),
      likeNumber: faker.number.int({ min: 0, max: 100 }),
      updateTime: faker.date.recent().getTime()
    })
  }
}

export const createAvatar = (): uni.image.RawImage => ({
  $$plugin: pluginName,
  forkNamespace: '',
  path: faker.image.avatar()
})
export const createBigImage = (): uni.image.RawImage => ({
  $$plugin: pluginName,
  forkNamespace: '',
  path: faker.image.urlPicsumPhotos({
    width: faker.number.int({ min: 100, max: 300 }),
    height: faker.number.int({ min: 100, max: 300 }),
    blur: 0,
    grayscale: false
  })
})
export const createEp = (): uni.ep.RawEp => ({
  $$plugin: pluginName,
  index: faker.number.int({ min: 0, max: 10 }).toString(),
  name: faker.book.title(),
})



export const getRandom = Utils.data.PromiseContent.fromAsyncFunction(async (kw?: string) => times(20, () => new (faker.helpers.arrayElement([FakeComic, FakeVideo]))(kw)))


export const keywordStream = (kw?: string) => Utils.data.Stream.create<uni.item.Item>(async function* () {
  while (true) {
    yield await getRandom(kw)
  }
})