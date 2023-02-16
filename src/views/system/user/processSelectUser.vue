<template>
  <div class="app-container">
      <!--账号数据-->
        <el-form class="search-form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
                 label-width="68px">
<!--          <el-form-item label="选择辖区" prop="deptId">-->
<!--            <treeselect v-model="queryParams.deptId" :options="deptOptions" style="width: 200px;"-->
<!--                        :normalizer="normalizer" placeholder="选择辖区"/>-->
<!--          </el-form-item>-->
          <el-form-item label="账号昵称" prop="nickName">
            <el-input
              v-model="queryParams.nickName"
              placeholder="请输入账号昵称"
              clearable
              style="width: 180px;"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="table" :height="tableHeight" v-loading="loading" :data="userList"
                  @selection-change="handleSelectionChange"  @cell-click="getCurrentRow" :cell-class-name="cellClassName">
          <el-table-column width="30">
            <template slot-scope="scope">
              <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="账号名称" key="userName" prop="userName" v-if="columns[1].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="账号昵称" key="nickName" prop="nickName" v-if="columns[2].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="所属辖区" prop="deptName" align="center" />
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
  </div>
</template>

<script>
    import {
      listUser
    } from '@/api/system/user'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {listDept} from "@/api/system/dept";
    // import Treeselect from "@riophae/vue-treeselect";
    // import SelectGrid from "@/views/gridManage/selectGrid/index";
    export default {
        name: 'processSelectUser',
      components: {},
        data() {
            return {
                radio: '',
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 显示搜索条件
                showSearch: true,
                // 总条数
                total: 0,
                // 账号表格数据
                userList: null,
                // 弹出层标题
                title: '',
                // 辖区树选项
                deptOptions: [],
                // 党组织树选项
                partyOptions: undefined,
                // 是否显示弹出层
                open: false,
                // 辖区名称
                deptName: undefined,
                // 默认密码
                initPassword: undefined,
                // 日期范围
                dateRange: [],
                // 状态数据字典
                statusOptions: [],
                // 性别状态字典
                sexOptions: [],
                // 岗位选项
                postOptions: [],
                // 角色选项
                roleOptions: [],
                // 表单参数
                form: {
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    userName: undefined,
                    nickName: undefined,
                    phonenumber: undefined,
                    status: undefined,
                    deptId: undefined,
                    perms: null,
                },
                // 列信息
                columns: [
                    {key: 0, label: `账号编号`, visible: true},
                    {key: 1, label: `账号名称`, visible: true},
                    {key: 2, label: `账号昵称`, visible: true},
                    {key: 3, label: `辖区`, visible: true},
                    {key: 4, label: `手机号码`, visible: true},
                    {key: 5, label: `状态`, visible: true},
                    {key: 6, label: `创建时间`, visible: true}
                ],
                tableHeight: 375,
                tableOffset: 216,
                treeStyle: {
                    height: '',

                },
                // 设备列表
                devOptions: [],
                // 批量授权设备
                devChooseShow: false,
                batch: {
                    deviceId: undefined,
                    userIds: []
                },
                // 穿梭框
                transferShow: false,
                transferUser: undefined,
                transferDeviceIds: [],
                transferData: [],
                value: '',
            }
        },
      props: {
          perms: {
            type: String,
            default: ''
          },
          variation: {}
      },
        created() {
          this.radio = ''
          this.getList()
          listDept().then(response => {
            this.deptOptions = this.handleTree(response.data, "deptId");
          });
        },
        methods: {
          init(data){
            if(data!=null){
              this.perms = data;
            }
            this.getList()
          },
          /** 转换辖区数据结构 */
          normalizer(node) {
            if (node.children && !node.children.length) {
              delete node.children;
            }
            return {
              id: node.deptId,
              label: node.deptName,
              children: node.children
            };
          },
          cellClassName({row, column, rowIndex, columnIndex}){
            row.index = rowIndex;
            column.index = columnIndex;
          },
          cellClick(row,column) {
            this.value = row
          },
          getCurrentRow(row,column){
            this.$nextTick(()=>{
              this.radio = row.index
            })
            this.$emit("update:selectProcessUser",row)
          },
            /** 查询账号列表 */
            getList() {
              // debugger
              this.loading = true
              this.queryParams.perms = this.perms
              listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                  this.userList = response.rows
                  this.total = response.total
                  this.radio = ''
                  this.loading = false
                }
              )
            },
            // 取消按钮
            cancel() {
                this.open = false
                this.reset()
            },
            // 表单重置
            reset() {
                this.form = {
                    userId: undefined,
                    deptId: undefined,
                    userName: undefined,
                    nickName: undefined,
                    password: undefined,
                    phonenumber: undefined,
                    email: undefined,
                    sex: undefined,
                    status: '0',
                    remark: undefined,
                    postIds: [],
                    roleIds: [],
                    deviceIds: []
                }
                this.resetForm('form')
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.page = 1
                this.getList()
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.dateRange = []
                this.resetForm('queryForm')
                this.handleQuery()
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.userId)
                this.single = selection.length != 1
                this.multiple = !selection.length
            },
            setTreeHeight() {
                this.treeStyle.height = (window.innerHeight - 220) + 'px'
            },
        },
        watch: {
          variation: {
            handler: function (newValue, oldValue) {
              if (newValue) {
                 this.radio = ''
              }
            },
            immediate: true
          },
            '$store.state.app.screenHeight': function () { //监听屏幕高度变化
                this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset
                this.setTreeHeight()
            }
        }
    }
</script>
<style  lang="scss"  scoped>
  .elTree {
    overflow-y: auto;
    overflow-x: scroll;
  }
</style>
