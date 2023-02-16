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
    initChart () {

      this.chart = echarts.init(this.$el, 'macarons')

      let datas = [
        {
          name: '肉类',
          value: 20,
        },
        {
          name: '水产',
          value: 10,
        },
        {
          name: '水果',
          value: 30,
        },
        {
          name: '蔬菜',
          value: 40,
        },
        {
          name: '其他',
          value: 40,
        },
      ];
      let max = Math.max(...datas.map((item) => item.value));

      let data = [];
      let color = ['#2ca1ff', '#0adbfa', '#febe13', '#65e5dd', '#7b2cff', '#fd5151', '#f071ff', '#85f67a'];
      for (let i = 0; i < datas.length; i++) {
        data.push(
          {
            value: datas[i].value,
            name: datas[i].name,
            itemStyle: {
              normal: {
                borderWidth: 0,
                shadowBlur: 10,
                shadowColor: color[i],
              },
            },
          },
          {
            value: max * 0.05,
            name: '',
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0,
              },
            },
            label: {
              show: false,
            },
            tooltip:{
              show:false
            }
          }
        );
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
            fontSize:10
          }
        },
        legend: {
          bottom: 0,
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
            clockWise: false,
            radius: ['40%', '60%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            labelLine:{
              length:5,
              length2:5
            },
            itemStyle: {

            },
            label: {
              show: true,
              formatter: '{b}{c}%',
              textStyle: {
                fontSize: 10,
                color: '#77b0e2',
              },
            },
            data: data,
          },
        ],
      };


      this.chart.setOption(option);

    }
  }
}
</script>
