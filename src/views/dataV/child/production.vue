<template>
  <div :class="className" style="height: 180px;width:400px" />
</template>


<script>
import echarts from 'echarts'
import {getProduction} from "@/api/bigScreen/dataV";


require('echarts/theme/macarons') // echarts theme

const animationDuration = 6000

export default {
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
      default: '100%'
    },
    type:{//此处为接收父类传递的参数，进行点击切换数据，默认值为1
      type: String,
      default:'1',
      required: true,
    }
  },
  data() {
    return {
      chart: null,
      chartData: {
        getname: [],
        getvalue: []
      },
    }
  },
  created() {
  },
  mounted() {

    this.$nextTick(() => {
      this.initChartjs()
    })
  },
  watch: {
    type:{
      handler(newValue,oldValue){
        this.type=newValue;
        this.initChartjs(newValue);
      }
    }
  },
  methods: {
    fontSize(res){
      let docEl = document.documentElement,
        clientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
      if (!clientWidth) return;
      let fontSize = 100 * (clientWidth / 1920);
      return res*fontSize;
    },
    //渲染echarts方法
    initChartjs() {
      let getvalue = [];
      let getname = [];
      // 调用后端接口，获取对应得数据
      getProduction().then(res => {
        if(res.data) {
          let data1 = res.data.productionByDay;
          let data2 = res.data.productionByMonth;
          if (this.type === '1') {
            for(var i = 0;i<data1.length;i++) {
              getvalue.push(data1[i].num)
              getname.push(data1[i].ouo_date.replace(0,''))
            }
          } else {
            for(var i = 0;i<data2.length;i++) {
              getvalue.push(data2[i].sum)
              getname.push(data2[i].timeStamp)
            }
          }
        } else {//此处根据type切换对应得值。根据后端接口来，我这里是将所以得值带过来了取不同得字段
          if (this.type === '1') {
            //假数据
            this.chartData.getvalue = [56, 43, 15, 78, 58, 46];
            this.chartData.getname = ['7.23', '7.24', '7.25', '7.26', '7.27', '7.28'];
          } else {
            this.chartData.getvalue = [100, 55, 50, 53, 34, 100];
            this.chartData.getname = ['7.23', '7.24', '7.25', '7.26', '7.27', '7.28'];
          }
        }
        //关键代码，渲染
        this.chart = echarts.init(this.$el, 'macarons'),
          this.chart.setOption({
            grid: {
              top: '20%',
              right: '1%',
              left: '8%',
              bottom: '16%'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'none'
              },
              formatter: '{b}:{c}吨',
            },

            xAxis: [{
              data: getname,
              axisLabel: {
                margin: 10,
                color: '#fff',
                interval: 0,
                textStyle: {
                  // fontSize: this.fontSize(0.12),
                },
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(255,255,255,0.5)'
                }
              },
              axisTick: {
                show: false
              },
            }],
            yAxis: [{
              name: '(吨)',
              type: 'value',
              splitNumber: 4,
              nameTextStyle: {
                color: '#fff',
                // fontSize: this.fontSize(0.14),
                padding: [0, 0, 0, -20]
              },
              axisLabel: {
                formatter: function (value) {
                  return value;
                },
                color: '#fff',
                textStyle: {
                  // fontSize: this.fontSize(0.14),
                },
              },
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false
              },
              splitArea: {show: false},

              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: 'rgba(255,255,255,0.2)'
                },
              }
            }],
            series: [{
              name: "人",
              type: 'bar',
              data: getvalue,
              barWidth: '15px',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: '#66FFFF'
                  }, {
                    offset: 1,
                    color: '#FFFFFF'
                  }], false),
                  barBorderRadius: [0, 0, 0, 0],
                }
              },
            }]
          });
      })
    },
  }
}
</script>

