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
      default: '400px'
    },
    chartData: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.initChart();
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
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log(this.chartData)
      let option = {
        series: [
          {
            roam:true,
            itemStyle: {
              color: 'rgba(0, 149, 255, 1)',
            },
            type: 'tree',
            name: '',
            data: this.chartData,
            top: 5,
            right: '10%',
            left: '10%',
            symbolSize: 8,
            bottom: 5,
            // symbol:'roundRect',
            initialTreeDepth: 10,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'left',
              backgroundColor: '#fafafa',
              padding: [2,2,2,10],
              borderRadius: 50,
              width: 80,
              height: 30,
              distance:96,
              lineOverflow: 'truncate',
              overflow: 'truncate',
              formatter: ['{b}'].join('\n'),
            },
            expandAndCollapse: false,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      }
      this.chart.setOption(
        option
      );

    }
  }
}
</script>
