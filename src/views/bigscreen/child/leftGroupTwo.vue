<template>
  <div class="group-box">
    <div class="group-title">
      <a class="title">本月评分排名</a>
      <div class="right-text">
        <a :class="{active:rankType=='before'}" @click="changeRankType('before')">评分前10名</a> / <a
        :class="{active:rankType=='after'}" @click="changeRankType('after')">评分后10名</a>
      </div>
    </div>
    <dv-scroll-board ref="scrollBoard1" v-if="rankType==='before'" :config="config1"
                     style="height:190px;margin-top: 10px"/>
    <dv-scroll-board ref="scrollBoard2" v-if="rankType==='after'" :config="config2"
                     style="height:190px;margin-top: 10px"/>
  </div>
</template>

<script>
import { queryQualityScoreBefore, queryQualityScoreAfter } from '@/api/bigScreen/bigScreen'

export default {
  name: 'leftGroupTwo',
  data() {
    return {
      rankType: 'before',
      data1: [],
      data2: [],
      config1: {
        header: ['名称', '评分','环比'],
        headerBGC: '#266e93',
        oddRowBGC: '#003b51',
        evenRowBGC: '#0A2732',
        data: [],
        indexHeader: '排名',
        index: true,
        columnWidth: [50, 180, 50, 80],
        align: ['center', 'left', 'center', 'center']
      },
      config2: {
        header: ['名称', '评分', '环比'],
        headerBGC: '#266e93',
        oddRowBGC: '#003b51',
        evenRowBGC: '#0A2732',
        data: [],
        indexHeader: '排名',
        index: true,
        columnWidth: [50, 180, 50, 80],
        align: ['center', 'left', 'center', 'center']
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getQualityScore()
    })
  },
  methods: {
    changeRankType(type) {
      let that = this
      that.rankType = type
    },
    /**
     *本月评分排名 state 1:评分前10名 2:评分后10名
     * @returns {Promise<void>}
     */
    getQualityScore() {
      let that = this
      //前十名
      queryQualityScoreBefore().then(res => {
        res.data.forEach(function(index, i) {
          let item = []
          item.push(index.name)
          item.push(index.score)
          //item.push(index.score1)
          if (index.mom == '-') {
            item.push('<span style="color:#37a2da;">' + index.mom + '</span>')
          } else {
            if (index.mom >= 0) {
              item.push('<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>' + index.mom + '</span>')
            } else {
              item.push('<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>' + Number( Math.abs(index.mom)).toFixed(2) + '</span>')
            }
          }
          that.data1.push(item)
        })
        that.config1.data = that.data1
        that.$refs.scrollBoard1.updateRows(that.config1.data)
      })
      //后十名
      queryQualityScoreAfter().then(res => {
        res.data.forEach(function(index, i) {
          let item = []
          item.push(index.name)
          item.push(index.score)
          if (index.mom == '-') {
            item.push('<span style="color:#37a2da;">' + index.mom + '</span>')
          } else {
            if (index.mom >= 0) {
              item.push('<span style="color:#37a2da;"><a style="position: relative;top: -2px;margin-right: 2px">↑</a>' + index.mom + '</span>')
            } else {
              item.push('<span style="color:red;"><a style="position: relative;top: -2px;margin-right: 2px">↓</a>' + Number(Math.abs(index.mom)).toFixed(2) + '</span>')
            }
          }
          that.data2.push(item)
        })
        that.config2.data = that.data2
        //that.$refs.scrollBoard2.updateRows(that.config2.data)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.group-box {
  width: 100%;
  padding: 15px 20px;
  margin-top: 15px;
  height: 260px;
  background-image: url("../../../assets/images/bigscreen/group-2.svg");

  .group-title {
    height: 30px;
    border-bottom: 1px dashed #30747b;
    color: rgba(186, 184, 184, 0.7);
    line-height: 30px;
    background-color: transparent;
    font-size: 14px;

    .title {
      color: #04E7FE;
    }

    .right-text {
      float: right;
    }

    .active {
      color: #04E7FE;
    }
  }

  .group-title::before {
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
