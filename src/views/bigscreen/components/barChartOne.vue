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
    missTypeList: {
      type: Array,
      default: () => ['仓储环境', '设备类', '质检过程', '消费类', '证件类']
    },
    missDataList: {
      type: Array,
      default: () => [0,0,0,0,0]
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.initChart(val);
      }
    },
    missDataList: {
      handler(){
        this.initChart();
      }
    }
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
      let option = {

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 60,
          right: '4%',
          bottom: '3%',
          top:30
        },
        xAxis: {
          type: 'value',
          position:'top',
          splitLine:{show:false},
          axisLine:{show:false},
          axisTick:{show:false},
          axisLabel: {
            color: '#ffffff',
            fontSize: 12,
          },
        },
        yAxis: {
          type: 'category',
          name:'',
          nameTextStyle:{
            color:'#fff',
            fontSize:12,
            height:40,
            lineHeight:50,
            padding: [50, 60, 0, 0]
          },
          axisTick:{show:false},
          axisLabel: {
            color: '#04E7FE',
            fontSize: 12,
          },
          axisLine:{show:false},
          // data: ['仓储环境', '设备类', '质检过程', '消费类', '证件类'].reverse()
          data: this.missTypeListModify
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: 8, // 柱子宽度

            itemStyle: {
              barBorderRadius: [0, 4, 4, 0], // 圆角（左上、右上、右下、左下）
              color: new echarts.graphic.LinearGradient(
                1,
                0,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: '#5fe30d',
                  },
                  {
                    offset: 0.5,
                    color: '#cecb2d',
                  },
                  {
                    offset: 1,
                    color: '#d28d15',
                  },
                ],
                false
              ), // 渐变
            },
            // data: [53, 39, 38, 34, 32].reverse()
            data: this.missDataList
          },

        ]
      };
      this.chart.setOption(option);

    }
  },
  computed: {
    missTypeListModify(){
     let arr = []
      for (let i = 0; i < this.missTypeList.length; i++) {
        arr[i] = this.missTypeList[i].replace('未报','').replace('留样记录','餐品留样')
      }
      return arr.reverse()
    }
  }
}
</script>
