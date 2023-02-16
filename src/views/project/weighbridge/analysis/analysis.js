import { listWeighBridge, weighBridgedeltail,exportMessage } from '@/api/project/analysis/analysis'
import { handleFileList, handlePicturePath } from "@/utils/ruoyi";
import $ from "jquery";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import AMap from '@/views/components/Amap/location';
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    name: 'Analysis',
    components: { Treeselect, AMap },
    data() {
        return {
            dialogVisible: false,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 车辆基础信息表格数据
            weighBridgeList: [],
            // 弹出层标题
            title: "",
            //弹出层标题图标
            dialogIcon: '',
            readOnly: false,   //查看按钮默认不能编辑
            operationType: 1,  //操作类型，1=添加，2=编辑，3=详情
            tableHeight: 450,
            pageList: [100, 200, 500, 1000],
            // 是否显示弹出层
            open: false,
            urlone: '',
            urltwo: '',
            // fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            srcListtwo: [],
            srcListone: [],
            ids:'',//定义某项id
            queryParams: {
                pageNum: 1,
                pageSize: 100,
                // sort: undefined,
                // order: undefined,
                grossTime: undefined,
                tareTime: undefined,
                licensePlate: undefined,
                // buyDate: undefined,
                // state: undefined,
                // params: {
                // }
                form: {

                }
            },
            // 表单参数
            formData: {},
            // 表单校验
            rules: {
                grossTime: [
                    { required: true, message: "车牌号不能为空", trigger: "blur" }
                ],
                tareTime: [
                    { required: true, message: "车型不能为空", trigger: "blur" }
                ],
                licensePlate: [
                    { required: true, message: "所属部门不能为空", trigger: "blur" }
                ],
                // carUse: [
                //   { required: true, message: "用途不能为空", trigger: "blur" }
                // ],
                // state: [
                //     { required: true, message: "车辆状态不能为空", trigger: "blur" }
                // ],
            },
            columnLabel: '',
        }
    },
    created() {
        this.getweighBridgeList()

    },
    mounted() {
        this.getEchartData()
        this.getEchartData1()
    },
    methods: {
        async getweighBridgeList() {
            this.loading = true;

            // this.queryParams.grossTime = this.queryParams.buyDateRange && this.queryParams.buyDateRange.length > 0 ? this.queryParams.buyDateRange[0] : undefined;
            // this.queryParams.tareTime = this.queryParams.buyDateRange && this.queryParams.buyDateRange.length > 0 ? this.queryParams.buyDateRange[1] : undefined;
            const res = await listWeighBridge(this.queryParams)
            console.log(res);
            this.weighBridgeList = res.rows;
            this.total = res.total;
            this.loading = false;
            // listWeighBridge(this.queryParams).then(response => {
            //     this.weighBridgeList = response.rows;
            //     this.total = response.total;
            //     this.loading = false;
            // })
        },
        async handleView(row) {
            this.ids=row.weighBridgeId
            this.srcListtwo = []
            this.srcListone = []
            console.log(row, 'rows');
            // this.reset();
            const id = row.weighBridgeId
            const res = await weighBridgedeltail(id)
            console.log(res);
            // weighBridgedeltail(id).then(response => {
            this.formData = res.data;
            this.urlone = `http://36.134.81.185:8888/huaqiao_lithium_ore_service/weighBridge/file/showImg?imgPath=${this.formData.grossLicenseName}`
            this.srcListone.push(this.urlone)
            this.urltwo = `http://36.134.81.185:8888/huaqiao_lithium_ore_service/weighBridge/file/showImg?imgPath=${this.formData.grossPlateName}`
            this.srcListtwo.push(this.urltwo)
            this.open = true;
            //     this.title = "信息详情";
            //     this.dialogIcon = 'el-icon-view';
            //     this.readOnly = true;
            //     this.operationType = 3;
            // });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            const listParams = {
                pageNum: this.queryParams.pageNum,
                pageSize:this.queryParams.pageSize,
                grossTime: ''+this.queryParams.grossTime,
                tareTime: ''+this.queryParams.tareTime,
                licensePlate: ''+this.queryParams.licensePlate
            }
            this.getweighBridgeList(listParams);
        },
        renderHeader(h, { column, $index }, width) {
            let color = '#515a6e';
            let that = this;
            if (that.columnLabel != '' && that.columnLabel == column.label) {
                color = "#ff6600";
            }
            let style = {};
            if (width) {
                // width: 'calc(' + width + '% - 48px)'
                style = { textAlign: 'center', wordBreak: 'break-all', whiteSpace: 'pre-line', display: 'inline-block', lineHeight: 'normal', color: color, width: width + "%" }
            } else {
                style = { textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-line', display: 'inline-block', lineHeight: 'normal', color: color }
            }

            return h(
                'span',
                {
                    style: style,
                },
                column.label)
        },
        //表格排序
        changeTableSort(column) {
            let order = '';
            if (column.order === 'ascending') {
                order = 'asc';
            } else if (column.order === 'descending') {
                order = 'desc';
            }
            if (order !== '') {
                this.queryParams.sort = column.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
                this.queryParams.order = order;
                this.queryParams.pageNum = 1;
                this.columnLabel = column.column.label;
            } else {
                this.queryParams.sort = '';
                this.queryParams.order = '';
                this.queryParams.pageNum = 1;
                this.columnLabel = '';
            }
            this.getweighBridgeList();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },
        handleDoubleClick(row, column, event) {
            this.handleView(row);
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 100,
                // sort: undefined,
                // order: undefined,
                grossTime: undefined,
                tareTime: undefined,
                licensePlate: undefined,
                // buyDate: undefined,
                // state: undefined,
                // params: {
                // }
                form: {

                }
            };
            this.handleQuery();
        },
      async handleExport () {
        // const res=await exportMessage({weighBridgeId:this.ids})
        // console.log(res,'meetfds');
        console.log(this.download);
            const queryParamsMessage ={
                // ...this.queryParams,weighBridgeId
                weighBridgeId:this.ids,
                // licensePlate:this.formData.licensePlate,
                // plateColor:this.formData.plateColor,
                // grossWeight:this.formData.grossWeight,
                // tareWeight:this.formData.tareWeight,
                // netWeight:this.formData.netWeight,
                // tareType:this.formData.tareType,
                // grossTime:this.formData.grossTime,
                // tareTime:this.formData.tareTime,
                // stockType:this.formData.stockType,
                // storehouseType:this.formData.storehouseType,
                // grossWeightOperateType:this.formData.grossWeightOperateType,
                // tareWeightOperateType:this.formData.tareWeightOperateType,
                // driverName:this.formData.driverName,
                // driverMobile:this.formData.driverMobile,
                // goodsName:this.formData.goodsName,
                // goodsModel:this.formData.goodsModel,
                // receiptCompany:this.formData.receiptCompany,
                // shippingCompany:this.formData.shippingCompany,
                // transportCompany:this.formData.transportCompany,
                // transportRoute:this.formData.transportRoute,
                // grossPlateName:this.formData.grossPlateName,
                // grossLicenseName:this.formData.grossLicenseName,

            } ;
            this.$confirm('是否确认导出所有地磅基础信息数据项?', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(function () {
              return exportMessage(queryParamsMessage);
            }).then(response => {
              this.download(response.msg);
            }).catch(function () {
            });
          },
        reset() {
            this.form = {
                id: undefined,
                licenseNo: undefined,
                type: undefined,
                deptId: undefined,
                carUse: undefined,
                buyDate: undefined,
                state: '1',
                remark: undefined,
                createBy: undefined,
                createTime: undefined,
                updateBy: undefined,
                updateTime: undefined
            };
            this.resetForm("form");
        },
        /** 提交按钮 */
        // submitForm: function () {
        //     this.$refs["form"].validate(valid => {
        //       if (valid) {
        //         if (this.form.id != undefined) {
        //           updateCarBase(this.form).then(response => {
        //             if (response.code === 200) {
        //               this.msgSuccess("修改成功");
        //               this.open = false;
        //               this.getList();
        //             } else {
        //               this.msgError(response.msg);
        //             }
        //           });
        //         } else {
        //           addCarBase(this.form).then(response => {
        //             if (response.code === 200) {
        //               this.msgSuccess("新增成功");
        //               this.open = false;
        //               this.getList();
        //             } else {
        //               this.msgError(response.msg);
        //             }
        //           });
        //         }
        //       }
        //     });
        //   },
        getEchartData() {
            const chart = this.$refs.chart
            if (chart) {
                const myChart = this.$echarts.init(chart)
                const option = {
                    title: {
                        text: '周-重量趋势分析'
                    },
                    legend: {},
                    tooltip: {},

                    // dataset: {
                    //     source: [

                    //         ['订单', 43.3],
                    //         ['订单1', 83.1],
                    //         ['订单2', 86.4],
                    //         ['订单3', 72.4],
                    //         ['订单4', 82.4],
                    //         ['订单5', 42.4],
                    //         ['订单6', 72.4],
                    //         ['订单7', 72.4]
                    //     ]
                    // },
                    xAxis: {
                        name: '日期',
                        // type: 'category',
                        // boundaryGap: false,
                        data: ['09-21', '09-22', '09-23', '09-24', '09-25', '09-26', '09-27'],
                        axisLine: {
                            show: true,
                            symbol: ['none', 'arrow'],
                            symbolSize: [5, 10], // 轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）,默认值[10, 15]。
                            symbolOffset: 20, // 轴线两边的箭头的偏移，如果是数组，第一个数字表示起始箭头的偏移，第二个数字表示末端箭头的偏移；如果是数字，表示这两个箭头使用同样的偏移。
                            // 坐标轴轴线样式设置
                            lineStyle: {
                                // color: '#21a6e6',
                                width: 2,
                                // type: 'dashed',
                            }
                        },
                    },
                    yAxis: {
                        name: '重量',
                        type: 'value',
                        data: ['1000', '2000', '3000', '4000', '5000', '6000', '7000'],
                        axisLine: {
                            show: true,
                            symbol: ['none', 'arrow'],
                            symbolSize: [5, 10], // 轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）,默认值[10, 15]。
                            symbolOffset: 20, // 轴线两边的箭头的偏移，如果是数组，第一个数字表示起始箭头的偏移，第二个数字表示末端箭头的偏移；如果是数字，表示这两个箭头使用同样的偏移。
                            // 坐标轴轴线样式设置
                            lineStyle: {
                                // color: '#21a6e6',
                                width: 2,
                                // type: 'dashed',
                            }
                        },
                    },


                    series: [{
                        barWidth: 40,
                        type: 'bar',
                        // stack: 'Total',
                        data: [3000, 4000, 3300, 4200, 4500, 5000, 4700]
                    }]
                }
                myChart.setOption(option)
                window.addEventListener("resize", function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", function () {
                    myChart.resize();
                });
            })
        },
        getEchartData1() {
            const chart1 = this.$refs.chart1
            if (chart1) {
                const myChart = this.$echarts.init(chart1)
                const option = {
                    title: {
                        text: '周-车次趋势分析'
                    },
                    tooltip: {
                        // trigger: 'axis'
                    },
                    // legend: {
                    //     data: ['Email']
                    // },
                    // grid: {
                    //     left: '3%',
                    //     right: '4%',
                    //     bottom: '3%',
                    //     containLabel: true
                    // },
                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },

                    xAxis: {
                        name: '日期',
                        type: 'category',
                        boundaryGap: false,
                        data: ['09-21', '09-22', '09-23', '09-24', '09-25', '09-26', '09-27',],
                        axisLine: {
                            show: true,
                            symbol: ['none', 'arrow'],
                            symbolSize: [5, 10], // 轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）,默认值[10, 15]。
                            symbolOffset: 20, // 轴线两边的箭头的偏移，如果是数组，第一个数字表示起始箭头的偏移，第二个数字表示末端箭头的偏移；如果是数字，表示这两个箭头使用同样的偏移。
                            // 坐标轴轴线样式设置
                            lineStyle: {
                                // color: '#21a6e6',
                                width: 2,
                                // type: 'dashed',
                            }
                        },
                    },
                    yAxis: {
                        name: '车次',
                        type: 'value',
                        data: ['0', '1', '2', '3', '4', '5'],
                        axisLine: {
                            show: true,
                            symbol: ['none', 'arrow'],
                            symbolSize: [5, 10], // 轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）,默认值[10, 15]。
                            symbolOffset: 20, // 轴线两边的箭头的偏移，如果是数组，第一个数字表示起始箭头的偏移，第二个数字表示末端箭头的偏移；如果是数字，表示这两个箭头使用同样的偏移。
                            // 坐标轴轴线样式设置
                            lineStyle: {
                                // color: '#21a6e6',
                                width: 2,
                                // type: 'dashed',
                            }
                        },
                    },
                    series: [
                        {
                            // name: 'Email',
                            type: 'line',
                            stack: 'Total',
                            data: [3, 4, 2, 3, 5, 4, 4]
                        }
                    ]

                }
                myChart.setOption(option)
                window.addEventListener("resize", function () {
                    myChart.resize()
                })
            }

        },
    }
}