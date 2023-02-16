import { listWeighBridge, weighBridgedeltail, fileShowImg,exportMessage } from '@/api/project/analysis/analysis'
import { handleFileList, handlePicturePath } from "@/utils/ruoyi";
import { getToken } from "@/utils/auth";
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
            ids:'',//定义某项id
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
            urlone:'',
            urltwo:'',
            srcListtwo:[],
            srcListone:[],
            // fit: ['fill', 'contain', 'cover', 'none', 'scale-down'],
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
            uploadPic: {
                uploadFile: process.env.VUE_APP_PICTURE_FILE_PATH,
                uploadImgUrl: process.env.VUE_APP_PICTURE_UPLOAD_PATH,
                uploadHeader: { Authorization: 'Bearer ' + getToken() },
                picDialogVisible: false,
                picDialogImageUrl: undefined,
                pictureList1: [],
                pictureFileList1: [],
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
    methods: {
        async getweighBridgeList() {
            this.loading = true;

            // this.queryParams.params.beginBuyDate = this.queryParams.buyDateRange && this.queryParams.buyDateRange.length > 0 ? this.queryParams.buyDateRange[0] : undefined;
            // this.queryParams.params.endBuyDate = this.queryParams.buyDateRange && this.queryParams.buyDateRange.length > 0 ? this.queryParams.buyDateRange[1] : undefined;
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
       async  handleView(row) {
        this.ids=row.weighBridgeId
        this.srcListtwo = []
        this.srcListone = []
            console.log(row);
            // this.reset();
            // const id = row.id || this.ids
            // weighBridgedeltail(id).then(response => {
            //     this.formData = response.data;
            const id = row.weighBridgeId
            const res =await  weighBridgedeltail(id)
            console.log(res);
            // weighBridgedeltail(id).then(response => {
            this.formData = res.data;
            // const res2 =  fileShowImg({ imgPath: this.formData.grossPlateName })
            // this.uploadPic.pictureList1 = handlePicturePath(res2);
            // this.formData.grossPlateName=res2
            this.urlone=`http://36.134.81.185:8888/huaqiao_lithium_ore_service/weighBridge/file/showImg?imgPath=${this.formData.grossLicenseName}`
            this.srcListone.push(this.urlone)
            this.urltwo=`http://36.134.81.185:8888/huaqiao_lithium_ore_service/weighBridge/file/showImg?imgPath=${this.formData.grossPlateName}`
            this.srcListtwo.push(this.urltwo)
            // this.uploadPic.pictureList1 = handlePicturePath(this.formData.grossPlateName);
            // console.log(res2,'res2');
            // this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
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
        // 图片栏目
        /** 记录图片上传成功 **/
        businessLicensePictureUpSuccess(response, file, fileList) {
            if (response.code === 200) {
                if (this.form.businessLicensePicture && this.form.businessLicensePicture !== '') {
                    this.form.businessLicensePicture += ',' + response.url
                } else {
                    this.form.businessLicensePicture = response.url
                }
                this.uploadPic.pictureFileList1 = fileList
            } else {
                this.msgError(response.msg)
            }
        },
        /** 事件图片删除 **/
        businessLicensePictureRemove(file, fileList) {
            let fileUrl = file.response ? file.response.url : file.url.replace(process.env.VUE_APP_PICTURE_PATH, '')
            this.form.businessLicensePicture = this.form.businessLicensePicture.replace(fileUrl + ",", '')
            this.form.businessLicensePicture = this.form.businessLicensePicture.replace("," + fileUrl, '')
            this.form.businessLicensePicture = this.form.businessLicensePicture.replace(fileUrl, '')
            this.uploadPic.pictureFileList1 = fileList
        },
        /** 图片大图查看 **/
        handlePictureCardPreview(file) {
            this.uploadPic.picDialogImageUrl = file.url
            this.uploadPic.picDialogVisible = true
        },
        /** 图片上传失败 **/
        picUploadErr(err) {

        },
        /** 图片上传过程中的钩子 **/
        picUpProcess(event, file, fileList) {

        },
        beforePicUpload(file) {
            let isLt2M = file.size / 1024 / 1024 < 20
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 20MB!')
            }
            return isLt2M
        },
    }
}