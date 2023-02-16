<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import { foodInspectionQuantity } from '@/api/bigScreen/bigScreen'

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
      this.initChart1()
    })
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.initChart1(val);
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
    initChart1() {
      let echartData=[];
      foodInspectionQuantity().then(res=>{
        echartData = res.data;
        this.initChart(echartData)

      })
    },


    initChart (echartData) {

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
      let max = Math.max(...echartData.map((item) => item.value));

      let data = [];
      let color = ['#2ca1ff', '#0adbfa', '#febe13', '#65e5dd', '#7b2cff', '#fd5151', '#f071ff', '#85f67a'];
      for (let i = 0; i < echartData.length; i++) {
        if(echartData[i].standard != null){
          data.push(
            {
              value: echartData[i].quantity,
              name: echartData[i].standard,
              itemStyle: {
                normal: {
                  borderWidth: 0,
                  shadowBlur: 10,
                  shadowColor: color[i]
                }
              }
            },
            {
              value: max * 0.05,
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
      }

      let option = {
        color: color,
        tooltip: {
          show: true,
          confine: true,
        },
        legend: {
          show: false,
          top: 'center',
          left: '60%',
          textStyle: {
            color: '#fff',
          },
          itemGap: 20,
          formatter: '{c}',
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
                fontSize: 12,
                color: '#528fc4',
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
