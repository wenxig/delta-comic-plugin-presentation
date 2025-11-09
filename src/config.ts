import { Store } from 'delta-comic-core'
import { pluginName } from './symbol'
export const config = new Store.ConfigPointer(pluginName, {
  test1: {
    type: 'switch',
    defaultValue: false,
    info: '开关'
  },
  test2: {
    type: 'number',
    defaultValue: 0,
    info: '数字',
    range: [0, 100]
  },
  test3: {
    type: 'radio',
    comp: 'select',
    info: '选择',
    defaultValue: '1',
    selects: [{
      label: '选项1',
      value: '1'
    },
    {
      label: '选项2',
      value: '2'
    }]
  },
  test4: {
    type: 'string',
    defaultValue: '',
    info: '文本'
  },
  test5: {
    type: 'date',
    defaultValue: Date.now(),
    info: '日期'
  }
})