<template>
  <div class="group-box_left">
    <div class="group-box-title">
        矿区基础数据
    </div>
    <div class="group-box-content_bg"></div>
    <div class="group-box-content">
      <div class="left1-1">
        <div class="left1-1-1">{{area}}</div>
        <div class="left1-1-2">总面积(平方米)</div>
        <div class="clear"></div>
      </div>
      <div class="left1-2">
        <div class="left1-2-1">
          <div class="left1-2-content1">
            <div class="left1-2-content-t">
              <div class="font1">{{ car }}</div>
              <!-- <div class="font2">15%</div> -->
              <div class="clear"></div>
            </div>
            <div class="left1-2-content-b1">
              存量的矿
            </div>
          </div>
        </div>
        <div class="left1-2-1">
          <div class="left1-2-content1">
            <div class="left1-2-content-t">
              <div class="font1">{{ car }}</div>
              <!-- <div class="font2">15%</div> -->
              <div class="clear"></div>
            </div>
            <div class="left1-2-content-b1">
              实时产量
            </div>
          </div>
        </div>
        <div class="left1-2-1">
          <div class="left1-2-content1">
            <div class="left1-2-content-t">
              <div class="font1">{{ car }}</div>
              <!-- <div class="font2">15%</div> -->
              <div class="clear"></div>
            </div>
            <div class="left1-2-content-b1">
              剩余矿量
            </div>
          </div>
        </div>
        <div class="left1-2-1">
          <div class="left1-2-content1">
            <div class="left1-2-content-t">
              <div class="font1">{{ people }}</div>
              <!-- <div class="font3">10%</div> -->
              <div class="clear"></div>
            </div>
            <div class="left1-2-content-b1">
              车辆总数
            </div>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { listIntroduction } from "@/api/project/Introduction/Introduction";
import { countCarBase } from "@/api/project/car/carBase";
import { countPeopleBase } from "@/api/project/people/peopleBase";
export default {
  name: "leftGroupOne",
  data(){
    return {
      area: '',
      stock: '',//存量
      yield: '',//产量
      surplus: '',//剩余量
      car: '',//车辆数量
      people: '',//人员数量
    }
  },
  mounted() {
    this.getArea();
    this.getCar();
    this.getPeople();
  },
  methods:{
    /**获取面积  */
    getArea () {
      listIntroduction({ pageNum: 1, pageSize: 1 }).then(res => {
        let arr = res.rows;
        var retult;
        for (var i = 0; i < arr.length; i++) {
          retult = arr[i]
          this.area = arr[0].area
        }
      })
    },
    //获取车辆数量
    getCar () {
      countCarBase({ pageNum: 1, pageSize: 20 }).then(res => {
        this.car = res.data
      })
    },
    //获取人员数量
    getPeople () {
      countPeopleBase({ pageNum: 1, pageSize: 20 }).then(res => {
        this.people = res.data
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styles/index";
.clear{
  clear:both;
}
.left1-1{
  background: url("~@/views/dataV/assets/images/left1_1.png") no-repeat;
  width: 407px;
  height: 84px;
  margin: 15px auto 0;
  .left1-1-1{
    line-height: 84px;
    color: #FFBA36;
    font-size: 36px;
    font-weight: bold;
    float:left;
    padding-left: 92px;
  }
  .left1-1-2{
    color: #87C8FB;
    font-size: 18px;
    float:left;
    padding-left: 23px;
    padding-top: 39px;
  }
}
.left1-2{
  // width: 407px;
  margin: 15px auto 0;
  .left1-2-1{
    background: url("~@/views/dataV/assets/images/left1_car.png") no-repeat;
    width: 230px;
    height: 75px;
    float:left;
    padding-left: 74px;
  }
  .left1-2-2{
    background: url("~@/views/dataV/assets/images/left1_people.png") no-repeat;
    width:176px;
    height: 75px;
    float:right;
    padding-left: 74px;
  }
  .left1-2-content1{
    background: url("~@/views/dataV/assets/images/left1_2.png") left center no-repeat;
    width:138px;
    height:75px;
  }
  .left1-2-content2{
    background: url("~@/views/dataV/assets/images/left1_2.png") left center no-repeat;
    width:102px;
    height:75px;
  }
  .left1-2-content-t{
    width:100%;
    height:40px;
    .font1{
      padding-top:9px;
      float:left;
      color: #2CCEFF;
      font-size: 24px;
      width: 52px;
      text-align: center;
    }
    .font2{
      padding-top:19px;
      float:left;
      color: #FF3632;
      font-size: 14px;
      width: 36px;
      text-align: right;
      background: url("~@/views/dataV/assets/images/left1_2_font1.png") left 23px no-repeat;
    }
    .font3{
      padding-top:19px;
      float:left;
      color: #39F4A9;
      font-size: 14px;
      width: 36px;
      text-align: right;
      background: url("~@/views/dataV/assets/images/left1_2_font2.png") left 23px no-repeat;
    }
  }
  .left1-2-content-b1{
    color:#DBF1FF;
    font-size: 14px;
    margin-top:6px;
    width:100%;
  }
  .left1-2-content-b2{
    color:#DBF1FF;
    font-size: 14px;
    margin-top:6px;
    width:100%;
    text-align: center;
  }
}
</style>
