<template>
  <div :class="className" :style="{height:height,width:width}" />
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
      type: Array,
      default: () => []
    },
    axisLabelFontSize: {
      default: 12
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
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
    initChart (datas) {
      this.chart = echarts.init(this.$el, 'macarons')
      let xAxis = [];
      let value1 = [];
      let value2 = [];
      const color = ['#1fd0ad', '#a65cef']
      const legend = ['总数', '异常']
        if(datas !==null){
          datas.forEach(function (item) {
            xAxis.push(item.month);
            value1.push(item.sumNum);
            value2.push(item.errorNum);
          })
        } else {
           xAxis = ['一月', '二月', '三月', '四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
           value1 = [12, 25, 39, 33,12, 25, 39, 33,12, 25, 39, 33]
           value2 = [23, 35, 37, 26, 23, 35, 37, 26,23, 35, 37, 26]
        }
      let option = {
        color: color,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(20,50,125,.8)',
          axisPointer: {
            type: 'shadow', // 可选为：'line' | 'shadow'
          },
        },
        grid: {
          left:25,
          right: 25,
          bottom:30,
          top: 60,
        },
        legend: {
          left: 'right',
          top: 0,
          icon: 'rect',
          textStyle: {
            color: '#81b0d6',
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
            formatter:function (value){
              let staff=value.substring(0,value.length-1);
              return staff+'\n月'
            },
            textStyle: {
              color: '#fff',
              fontSize: this.axisLabelFontSize
            },
          },
        },
        yAxis: [{
          name:'总数/批次',
          nameTextStyle:{
            color: 'rgba(255,255,255,0.5)',
            fontSize:12
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
          name:'异常/批次',
          nameTextStyle:{
            color: 'rgba(255,255,255,0.5)',
            fontSize:12
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
