<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import { getQualityScoreGroup } from '@/api/bigScreen/bigScreen'

require('echarts/theme/macarons') // echarts theme

export default {
  // mixins: [resize],
  props: {
    company: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {

  },
  watch: {
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(datas) {
      let value1 = []
      let value2 = []
      console.log(datas);
      let group = datas.group
      let groupBefore = datas.groupBefore
      let groupAfter = datas.groupAfter
      for (let i = 0; i < group.length; i++) {
        for (let m = 0; m < groupBefore.length; m++) {
          if (group[i].name == groupBefore[m].dict_label) {
            value1.push(groupBefore[m].score);
            break;
          }
        }
      }
      for (let i = 0; i < group.length; i++) {
        for (let m = 0; m < groupAfter.length; m++) {
          if (group[i].name == groupAfter[m].dict_label) {
            value2.push(groupAfter[m].score);
            break;
          }
        }
      }
      this.chart = echarts.init(this.$el, 'macarons')
      let splitColor = 'rgba(255,255,255,0.3)'
      let option = {
        color: ['#5ae294', '#CDAF5E'],
        tooltip: {
          show: true // 弹层数据去掉
        },
        legend: {
          left: 'center',
          bottom: 0,
          icon: 'rect',
          textStyle: {
            color: '#04E7FE'
          },
          itemWidth: 15,
          itemHeight: 5,
          itemGap: 10 //左右间隔
        },
        radar: {
          center: ['50%', '50%'], // 外圆的位置
          radius: '50%',
          name: {
            textStyle: {
              color: '#04E7FE',
              fontSize: 12,
              fontWeight: 400,
              fontFamily: 'PingFangSC-Regular,PingFang SC',
              fontStyle: 'normal'
            }
          },
          // TODO:
          indicator: group,
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: false,
            areaStyle: {
              // 分隔区域的样式设置。
              color: ['#1c2330'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          axisLine: {
            // 指向外圈文本的分隔线样式
            lineStyle: {
              color: splitColor
            }
          },
          splitLine: {
            lineStyle: {
              type: 'solid',
              color: splitColor, // 分隔线颜色
              width: 1 // 分隔线线宽
            }
          }
        },
        series: [
          {
            type: 'radar',
            symbolSize: 0,
            lineStyle: {
              normal: {
                width: 1,
                color: 'rgba(66, 242, 185, 1)'
              }
            },
            data: [
              {
                // TODO:
                value: value1,
                name: '本月',
                itemStyle: {
                  borderColor: 'rgba(245, 196, 85, 1)',
                  color: '#5ae294',
                  borderWidth: 0.2
                },
                areaStyle: {
                  normal: {
                    color: {
                      type: 'radial',
                      x: 0.5,
                      y: 0.5,
                      r: 0.5,
                      colorStops: [{
                        offset: 0, color: 'rgba(46,203,255, 0.14)' // 0% 处的颜色
                      },
                        {
                          offset: 0.15, color: 'rgba(46,203,255, 0.14)' // 100% 处的颜色
                        },
                        {
                          offset: 0.75, color: 'rgba(46,203,255, 0.4)' // 100% 处的颜色
                        },
                        {
                          offset: 1, color: 'rgba(46,203,255, 0.5)' // 100% 处的颜色
                        }],
                      global: false // 缺省为 false
                    }
                  }
                }
              },
              {
                // TODO:
                value: value2,
                name: '上月',
                itemStyle: {
                  borderColor: 'rgba(245, 196, 85, 1)',
                  color: '#CDAF5E',
                  borderWidth: 0.2
                },
                lineStyle: {
                  normal: {
                    width: 1,
                    color: 'rgba(245, 196, 85, 1)'
                  }
                },
                areaStyle: {
                  normal: {
                    color: {
                      type: 'radial',
                      x: 0.5,
                      y: 0.5,
                      r: 0.5,
                      colorStops: [{
                        offset: 0, color: 'rgba(255, 127,0, 0.14)' // 0% 处的颜色
                      },
                        {
                          offset: 0.15, color: 'rgba(255, 127,0, 0.14)' // 100% 处的颜色
                        },
                        {
                          offset: 0.75, color: 'rgba(2255, 127,0, 0.4)' // 100% 处的颜色
                        },
                        {
                          offset: 1, color: 'rgba(255, 127,0, 0.5)' // 100% 处的颜色
                        }],
                      global: false // 缺省为 false
                    }
                  }
                }
              }
            ]
          }
        ]
      }
      this.chart.setOption(option)
    },
    /**
     * 云厨房评分组统计
     */
    getQualityScoreGroup() {
      let that = this
      getQualityScoreGroup().then(res => {
        that.initChart(res.data)
      })
    }

  }
}
</script>
