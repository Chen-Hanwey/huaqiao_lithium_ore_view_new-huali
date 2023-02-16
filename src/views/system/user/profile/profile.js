import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";
import {listDistrict, listDistrictByPCode, getDistrict} from "@/api/system/district";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      open: false,
      activeName: 'first',
      cardHeight: '200px',
      contentHeightV: 0,
      contentHeight: '200px',
      user: {},
      roleGroup: {},
      postGroup: {},
      perPmBase: {},
      activeTab: "userinfo",
      // 性别字典
      sexOptions: [],
      // 人员类别字典
      politicalStatusOptions: [],
      // 健康状况字典
      healthConditionOptions: [],
      // 婚姻状况字典
      maritalStatusOptions: [],
      // 民族字典
      nationOptions: [],
      // 学历字典
      fullTimeEducationOptions: [],
      //工作岗位字典
      workingPostOptions: [],
      //党籍状态
      pmStatusOptions: [],
      //人员状态
      personStatusOptions: [],
      // 职称
      workingTitleOptions: [],
      // 现任职务字典
      postOptions: [],
      formProvinceList: [],
      formCityList: [],
      formDistrictList: [],
      formPofProvinceList: [],
      formPofCityList: [],
      formPofDistrictList: [],
      pmRewardList: [],
      reward_loading: true,
      // 是否为奖励，1为奖励，2为惩罚字典
      rewardOrNotOptions: [],
      publicityOrNotOptions: [],
    };
  },
  created() {
    this.getUser();
    this.getProviceList();
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("political_status").then(response => {
      this.politicalStatusOptions = response.data;
    });
    this.getDicts("pm_jkzk").then(response => {
      this.healthConditionOptions = response.data;
    });
    this.getDicts("pm_hyzk").then(response => {
      this.maritalStatusOptions = response.data;
    });
    this.getDicts("nation").then(response => {
      this.nationOptions = response.data;
    });
    this.getDicts("pm_dtxl").then(response => {
      this.fullTimeEducationOptions = response.data;
    });
    this.getDicts("pm_dnzw").then(response => {
      this.postOptions = response.data;
    });
    this.getDicts("pm_gzgw").then(response => {
      this.workingPostOptions = response.data;
    });
    this.getDicts("pm_status").then(response => {
      this.pmStatusOptions = response.data;
    });
    this.getDicts("person_status").then(response => {
      this.personStatusOptions = response.data;
    });
    this.getDicts("working_title").then(response => {
      this.workingTitleOptions = response.data;
    });
    this.getDicts("reward_type").then(response => {
      this.rewardOrNotOptions = response.data;
    });
    this.getDicts("reward_publicity").then(response => {
      this.publicityOrNotOptions = response.data;
    });
  },
  watch:{
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      this.$refs.profileInfo.style.height = window.innerHeight - 75 + 'px';
      this.cardHeight = window.innerHeight - 100 + 'px';
      this.contentHeight = window.innerHeight - 190 + 'px';
      this.contentHeightV = window.innerHeight - 190;
    }
  },
  methods: {
    // 是否为奖励，1为奖励，2为惩罚字典翻译
    rewardOrNotFormat(row, column) {
      return this.selectDictLabel(this.rewardOrNotOptions, row.rewardOrNot);
    },
    // 是否公示，1为公示，2为不公示字典翻译

    publicityOrNotFormat(row, column) {
      return this.selectDictLabel(this.publicityOrNotOptions, row.publicityOrNot);
    },
    cancel(){
      this.open = false;
      this.getUser();
    },
    updateUser(){
      this.open = true;
    },
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.user.isSecret = '0';//设置手机号默认保密

        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    },

    handleClick(tab, event) {
      // console.log(tab, event);
    },
    /** 查询省份列表 **/
    getProviceList() {
      let params = {};
      params.level = 1;
      listDistrict(params).then(response => {
        if (response.rows) {
          this.formProvinceList = response.rows;
          this.formPofProvinceList = response.rows;
        }
      })
    },
    /** 根据省份获取城市列表，type为1时表示查询条件的列表，type为2时表示form内的列表，type为3时表示点击查看和修改时第一次从数据库加载数据 **/
    getCityList(province, type) {
      let params = {};
      params.pcode = province;
      if (province === null || province === '') {
        console.log("未获取到province");
        return;
      }
      listDistrict(params).then(response => {
        if (1 == type) {
          this.queryCityList = response.rows;
        } else if (2 == type) {
          this.formCityList = response.rows;
          this.form.nowCity = undefined;
          if (this.formCityList && this.formCityList.length > 0) {
            this.form.nowCity = this.formCityList[0].code;
            this.formCityChange(this.form.nowCity);
          } else {
            this.form.nowCounty = undefined;
          }
        } else if (3 == type) {
          this.formCityList = response.rows;
        }
      })
    },
    /** 根据省份获取城市列表，type为1时表示查询条件的列表，type为2时表示form内的列表，type为3时表示点击查看和修改时第一次从数据库加载数据 **/
    getPofCityList(province, type) {
      let params = {};
      params.pcode = province;
      if (province === null || province === '') {
        console.log("未获取到province");
        return;
      }
      listDistrict(params).then(response => {
        if (1 == type) {
          this.queryCityList = response.rows;
        } else if (2 == type) {
          this.formPofCityList = response.rows;
          this.form.pofCity = undefined;
          if (this.formPofCityList && this.formPofCityList.length > 0) {
            this.form.pofCity = this.formPofCityList[0].code;
            this.formPofCityChange(this.form.pofCity);
          } else {
            this.form.pofCity = undefined;
          }
        } else if (3 == type) {
          this.formPofCityList = response.rows;
        }
      })
    },
    /** 根据地市获取区县列表，type为1时表示查询条件的列表，type为2时表示form内的列表，type为3时表示点击查看和修改时第一次从数据库加载数据 **/
    getDistrictList(city, type) {
      let params = {};
      params.pcode = city;
      if (city === null || city === '') {
        console.log("未获取到city");
        return;
      }
      listDistrict(params).then(response => {
        if (1 == type) {
          this.queryDistrictList = response.rows;
        } else if (2 == type) {
          this.formDistrictList = response.rows;
          this.form.nowCounty = undefined;
          if (this.formDistrictList && this.formDistrictList.length > 0) {
            this.form.nowCounty = this.formDistrictList[0].code;
            // this.formDistrictChange(this.form.district);
          } else {
            // this.form.street = undefined;
            // this.form.committee = undefined;
          }
        } else if (3 == type) {
          this.formDistrictList = response.rows;
        }
      })
    },
    /** 根据地市获取区县列表，type为1时表示查询条件的列表，type为2时表示form内的列表，type为3时表示点击查看和修改时第一次从数据库加载数据 **/
    getPofDistrictList(city, type) {
      let params = {};
      params.pcode = city;
      if (city === null || city === '') {
        console.log("未获取到city");
        return;
      }
      listDistrict(params).then(response => {
        if (1 == type) {
          this.queryDistrictList = response.rows;
        } else if (2 == type) {
          this.formPofDistrictList = response.rows;
          this.form.pofCounty = undefined;
          if (this.formPofDistrictList && this.formPofDistrictList.length > 0) {
            this.form.pofCounty = this.formPofDistrictList[0].code;
            // this.formDistrictChange(this.form.district);
          } else {
            // this.form.street = undefined;
            // this.form.committee = undefined;
          }
        } else if (3 == type) {
          this.formPofDistrictList = response.rows;
        }
      })
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.$refs.profileInfo.style.height = window.innerHeight - 75 + 'px';
      this.cardHeight = window.innerHeight - 100 + 'px';
      this.contentHeight = window.innerHeight - 190 + 'px';
      this.contentHeightV = window.innerHeight - 190;
    });
  }
};
