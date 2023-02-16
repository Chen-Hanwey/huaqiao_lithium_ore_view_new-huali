<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import { grabAlarm } from '@/api/bigScreen/inspectPanel'

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
      default: '107%'
    },
    chartData: {
      type: Array,
      default: () => []
    },
    operationId: {
      default: '1'
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.grabAlarmCount();
  },
  watch: {
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    grabAlarmCount() {
      grabAlarm(this.operationId).then(res => {
        this.initChart(res.data)
      })
    },
    initChart (datas) {
      this.chart = echarts.init(this.$el, 'macarons')
      let xAxis = [];
      let value1 = [];
      let value2 = [];
      const color = [new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgb(0,200,250)' },
        { offset: 0.7, color: 'rgb(1,170,250)' },
        { offset: 1, color: 'rgb(3,110,250)' }
      ]), new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgb(250,200,10)' },
        { offset: 0.7, color: 'rgb(250,170,3)' },
        { offset: 1, color: 'rgb(250,140,20)' }
      ])]
      const legend = ['已处理', '未处理']
      if(datas && process.env.VUE_APP_DEMO_FLAG !== 'Y'){
        datas.forEach(function (item) {
          xAxis.push(item.alertType);
          value1.push(item.processedNum);
          value2.push(item.noProcessedNum);
        })
      } else {
        xAxis = ['口罩佩戴', '厨师工帽', '打手机识别', '抽烟识别']
        value1 = [12, 25, 39, 33]
        value2 = [23, 35, 37, 26]
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
          textStyle:{
            fontSize:'10'
          }
        },
        grid: {
          left:25,
          right: 25,
          bottom:30,
          top: 38,
        },
        legend: {
          left: 'right',
          top: 4,
          icon: 'rect',
          textStyle: {
            color: '#81b0d6',
            fontSize:10
          },
          itemWidth: 15,
          itemHeight:5,
          itemGap: 10, //左右间隔
        },

        xAxis: {
          type: 'category',
          data: xAxis,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#071a4f',
              width: 1,
              type: 'solid',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            interval:0,
            // formatter:function (value){
            //   let staff=value.substring(0,value.length-1);
            //   return staff+'\n月'
            // },
            textStyle: {
              color: '#fff',
              fontSize: 8
            },
          },
        },
        yAxis: [{
          // name:'数量',
          nameTextStyle:{
            color: 'rgba(255,255,255,0.5)',
            fontSize:10
          },
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#81b0d6',
            },
          },
          axisPointer: {
            snap: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.05)',
              type: 'dash',
            },
          },
        },{
          // name:'数量',
          nameTextStyle:{
            color: 'rgba(255,255,255,0.5)',
            fontSize:10,
          },
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            textStyle: {
              color: '#81b0d6',
            },
          },
          axisPointer: {
            snap: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.05)',
              type: 'dash',
            },
          },
        }],
        series: [
          {
            name: legend[0],
            type: 'bar',
            barWidth: '12%',
            itemStyle: {
              normal: {
                barBorderRadius: 30, //圆角度
              },
            },
            data: value1,
          },
          {
            name: legend[1],
            type: 'bar',
            yAxisIndex:1,
            barWidth: '12%',
            itemStyle: {
              normal: {
                barBorderRadius: 30,
              },
            },
            data: value2,
          },

        ],
      };

      this.chart.setOption(option);

    }
  }
}
</script>
