<template>
  <div class="group-box">
    <div class="group-title">
      <a class="title">人员培训排名</a>
      <div class="right-text">
        <a :class="{active:rankType=='before'}" @click="changeRankType('before')">培训学习积分</a> / <a :class="{active:rankType=='after'}"  @click="changeRankType('after')">人员考核积分</a>
      </div>
    </div>
    <dv-scroll-board ref="scrollBoard1" v-if="rankType==='before'" :config="config" style="width:100%;height:190px;margin-top: 10px" />
    <dv-scroll-board ref="scrollBoard2" v-if="rankType==='after'" :config="config1"
                     style="height:190px;margin-top: 10px"/>

  </div>
</template>

<script>
import {trainPersonRank,exam} from "@/api/bigScreen/bigScreen";

export default {
  name: "leftGroupTwo",
  data(){
    return{
      rankType:'before',
      config:{
        header: ['名称', '时长(h)', '环比'],
        headerBGC:'#266e93',
        oddRowBGC:'#003b51',
        evenRowBGC:'#0A2732',
        data: [
          // ['第一中学', '97', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第二中学', '95', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
          // ['第三中学', '92', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第四中学', '95', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
          // ['第五中学', '92', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第六中学', '94', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
          // ['第七中学', '95', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第八中学', '97', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
          // ['第九中学', '98', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第十中学', '93', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
        ],
        // data: [],
        indexHeader:'排名',
        index: true,
        columnWidth: [50,160, 70, 80],
        align: ['center','left', 'center', 'center']
      },
      config1: {
        header: ['名称', '分数', '环比'],
        headerBGC: '#266e93',
        oddRowBGC: '#003b51',
        evenRowBGC: '#0A2732',
        data: [
          // ['第一中学', '97', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第二中学', '95', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
          // ['第三中学', '92', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第四中学', '95', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
          // ['第五中学', '92', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第六中学', '94', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
          // ['第七中学', '95', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第八中学', '97', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
          // ['第九中学', '98', '<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>12</span>'],
          // ['第十中学', '93', '<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>4</span>'],
        ],
        // data: [],
        indexHeader: '排名',
        index: true,
        columnWidth: [50, 160, 70, 80],
        align: ['center', 'left', 'center', 'center']
      },
    }
  },
  methods:{
    changeRankType(type){
      this.rankType=type
    },
    getPersonRank(){
      let that = this
      // that.config.data = []
      trainPersonRank().then(res => {
        // if (res.code != 200){
        //   return '0';
        // }
        let all = []
        res.data.forEach(function(item, i) {
          let arr = []
          arr.push(item.name)
          arr.push(item.learnDuration)
          if (item.mom == '-') {
            arr.push('<span style="color:#37a2da;">' + item.mom + '</span>')
          } else {
            if (item.mom >= 0) {
              arr.push('<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>' + item.mom + '</span>')
            } else {
              arr.push('<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>' + Number( Math.abs(item.mom)).toFixed(2) + '</span>')
            }
          }
          all.push(arr)
          // all.push(arr)
        })
        that.config.data = all
        // this.config.data = all
        // console.log(that.config.data)
        // console.log(31232321)
        // console.log(this.config.data)
        that.$refs.scrollBoard1.updateRows(that.config.data)
      })
      exam().then(res => {
        // if (res.code != 200){
        //   return '0';
        // }
        let all = []
        res.data.forEach(function(item, i) {
          let arr = []
          if(item.name!=null) {
            arr.push(item.name)
            arr.push(item.myPoint)
          } else
            return
          if (item.mom == '-') {
            arr.push('<span style="color:#37a2da;">' + item.mom + '</span>')
          } else {
            if (item.mom >= 0) {
              arr.push('<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>' + item.mom + '</span>')
            } else {
              arr.push('<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>' + Number(Math.abs(item.mom)).toFixed(2) + '</span>')
            }
          }
          all.push(arr)
          // all.push(arr)
        })
        that.config1.data = all
        // this.config1.data = all
        // console.log(that.config.data)
        // console.log(31232321)
        // console.log(this.config.data)
        // that.$refs.scrollBoard1.updateRows(that.config1.data)
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getPersonRank()
    })
  }
}
</script>

<style scoped lang="scss">
.group-box{
  width: 100%;
  padding: 15px 20px;
  margin-top: 15px;
  height: 260px;
  background-image: url("../../../assets/images/bigscreen/group-2.svg");

  .group-title{
    height: 30px;
    border-bottom: 1px dashed #30747b;
    color: rgba(186, 184, 184, 0.7);
    line-height: 30px;
    background-color: transparent;
    font-size: 14px;
    .title{
      color: #04E7FE;
    }
    .right-text{
      float: right;
    }
    .active{
      color: #04E7FE;
    }
  }
  .group-title::before{
    display: inline-block;
    content: "";
    width: 0px;
    height: 0px;
    border: 6px solid transparent;
    border-left-color: #04E7FE;
    position: relative;
    top: 0px;

  }
}
</style>
