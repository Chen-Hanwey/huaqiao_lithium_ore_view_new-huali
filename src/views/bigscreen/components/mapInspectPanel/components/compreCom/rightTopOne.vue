<template>
  <div>
    <div style="height:200px">
      <div id="rightBottomOneChart" style="height:100%;width:100%"/>
    </div>
    <div style="height:130px;">
      <div id="rightBottomOneChart2" style="height:100%;width:100%"/>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme

const animationDuration = 2000

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
    },
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null,
      chart2: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.initChart2()
    })
  },
  watch: {
    // chartData: {
    //   deep: true,
    //   handler(val) {
    //     this.initChart(val)
    //     this.initChart2(val)
    //   }
    // }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    if (!this.chart2) {
      return
    }
    this.chart2.dispose()
    this.chart2 = null
  },
  methods: {
    initChart(info) {
      this.chart = echarts.init(document.getElementById('rightBottomOneChart'))
      let datas = [
        {
          name: '女',
          value: 20
        },
        {
          name: '男',
          value: 10
        }
      ]
      let allNum = '30'
      if (info){
        datas = [
          {
            name: '女',
            value: info.girlNum
          },
          {
            name: '男',
            value: info.boyNum
          }
        ]
        allNum = info.girlNum + info.boyNum
      }

      let max = Math.max(...datas.map((item) => item.value))
      let data = []
      let color = ['#FE6903', '#5796FF']
      for (let i = 0; i < datas.length; i++) {
        data.push(
          {
            value: datas[i].value,
            name: datas[i].name
          },
          {
            value: max * 0.01,
            name: '',
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0
              }
            },
            label: {
              show: false
            },
            tooltip: {
              show: false
            }
          }
        )
      }

      let option = {
        color: color,
        tooltip: {
          show: true,
          confine: true,
          backgroundColor: 'rgba(20,50,125,.8)',
          axisPointer: {
            type: 'shadow' // 可选为：'line' | 'shadow'
          },
          textStyle: {
            fontSize: 10
          }
        },
        title: [
          {
            text: '从业总数',
            x: 'center',
            top: '40%',
            textStyle: {
              color: '#fff',
              fontSize: 14,
              fontWeight: '100'
            }
          },
          {
            text: allNum,
            x: 'center',
            top: '52%',
            textStyle: {
              fontSize: 17,
              color: '#00f0ff',
              fontWeight: '600'
            }
          }
        ],
        legend: {
          bottom: 10,
          icon: 'rect',
          textStyle: {
            color: '#81b0d6',
            fontSize: 10
          },
          itemWidth: 10,
          itemHeight: 5,
          itemGap: 5, //左右间隔
          orient: 'vertical'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '60%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            labelLine: {
              length: 10,
              length2: 10
            },
            itemStyle: {},
            label: {
              show: true,
              formatter: '{b}{c}人',
              textStyle: {
                fontSize: 10,
                color: '#77b0e2'
              }
            },
            data: data
          }
        ]
      }
      this.chart.setOption(option)
    },
    initChart2(info) {
      this.chart2 = echarts.init(document.getElementById('rightBottomOneChart2'))
      let colorArray = [
       {
          top: '#F77362', //粉色
          bottom: '#EA6D92'
        } , {
          top: '#63CE6B', //绿
          bottom: '#3A9E58'
      }
      ]

      let data = [9, 21]
      if (info){
        data = [info.unusualNum,info.normalNum]
      }

      let option = {
        title: {
          text: '健康证状态',
          textStyle: {
            color: '#04bed9',
            fontSize: 12
          }
        },
        color: [ '#F77362','#63CE6B'],
        tooltip: {
          show: true,
          confine: true,
          backgroundColor: 'rgba(20,50,125,.8)',
          axisPointer: {
            type: 'shadow' // 可选为：'line' | 'shadow'
          },
          textStyle: {
            fontSize: '10'
          }
        },
        grid: {
          left: '5%',
          top: '20%',
          right: '10%',
          bottom: '12%',
          containLabel: true
        },

        xAxis: {
          type: 'value',
          show: false

        },
        yAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          'splitLine': { //网格线
            'show': false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 10
          },
          data: ['过期', '正常']
        }

        ],
        series: [{
          name: '',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{c}',
              textStyle: {
                color: 'white' //color of value
              }
            }
          },
          itemStyle: {
            normal: {
              show: true,
              color: function(params) {
                let num = colorArray.length
                return {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }, {
                    offset: 0,
                    color: colorArray[params.dataIndex % num].bottom
                  }, {
                    offset: 1,
                    color: colorArray[params.dataIndex % num].top
                  }]
                  //globalCoord: false
                }
              },
              barBorderRadius: 70,
              borderWidth: 0,
              borderColor: '#333'
            }
          },
          barCategoryGap: '70%',
          data: data
        }
        ]
      }
      this.chart2.setOption(option)
    }
  }
}
</script>
