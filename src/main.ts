import "@/index.css"
import { coreModule, definePlugin, requireDepend, Utils } from "delta-comic-core"
import { pluginName } from "./symbol"
import { inRange, times } from 'es-toolkit/compat'
import axios from 'axios'
import Card from "./components/card.vue"
import { FakeComicPage, FakeVideoPage, getRandom, keywordStream } from "./api/api"
import { Faker, zh_CN, base, en } from '@faker-js/faker'
import { AbcFilled, BabyChangingStationFilled, CabinFilled } from '@vicons/material'
import type { Component } from "vue"
import CommentRow from "./components/commentRow.vue"

const faker = new Faker({
  locale: [zh_CN, en, base]
})
const testAxios = axios.create({
  timeout: 10000,
  method: 'GET',
  validateStatus(status) {
    return inRange(status, 199, 499)
  },
})
const { layout } = requireDepend(coreModule)
testAxios.interceptors.response.use(undefined, Utils.request.utilInterceptors.createAutoRetry(testAxios, 2))
definePlugin({
  name: pluginName,
  onBooted: () => {
    Utils.eventBus.SharedFunction.define(() => getRandom(), pluginName, 'getRandomProvide')
  },
  content: {
    contentPage: {
      [FakeComicPage.contentType]: FakeComicPage,
      [FakeVideoPage.contentType]: FakeVideoPage,
    },
    itemCard: {
      [FakeComicPage.contentType]: Card,
      [FakeVideoPage.contentType]: Card,
    },
    layout: {
      [FakeComicPage.contentType]: layout.Default,
      [FakeVideoPage.contentType]: layout.Default,
    },
    commentRow: {
      [FakeComicPage.contentType]: CommentRow,
      [FakeVideoPage.contentType]: CommentRow,
    }
  },
  search: {
    methods: {
      keyword: {
        name: '关键词',
        getStream() {
          return keywordStream()
        },
        sorts: times(3, i => ({
          text: `排序${i}`,
          value: i.toString()
        })),
        defaultSort: '',
        async getAutoComplete() {
          return times(10, () => ({
            text: faker.lorem.word(),
            value: faker.lorem.word()
          }))
        },
      }
    },
    hotPage: {
      levelBoard: times(3, i => ({
        content() {
          return getRandom()
        },
        name: `排行${i}`
      })),
      mainListCard: times(faker.number.int({ min: 3, max: 9 }), i => ({
        content() {
          return getRandom()
        },
        name: `热门${i}`
      })),
      topButton: times(faker.number.int({ min: 3, max: 9 }), i => ({
        icon: faker.helpers.arrayElement(Object.values<Component>([AbcFilled, BabyChangingStationFilled, CabinFilled])),
        name: `按钮${i}`,
        bgColor: faker.color.rgb()
      })),
    }
  },
})