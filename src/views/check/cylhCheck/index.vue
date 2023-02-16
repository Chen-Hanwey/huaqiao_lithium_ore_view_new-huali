<template>
  <div class="app-container">
    <el-row :gutter="7">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
          <div class="con-container">
            <div class="lab-container">
              <!-- <label style="color: #606266;margin-left: 20px;height: 35px;line-height: 35px;font-size: 13px;">选中企业：{{ enterpriseName }}</label> -->
              <label class="condition-item-title">检查时间</label>
              <el-form-item label="" prop="contact" class="custom-el-form-item">
                <el-date-picker
                  v-model="queryParams.submitTimeTmp"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="submitTimeChangeEv">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="btn-container">
              <el-form-item>
                <!-- <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">条件
                 </el-button>-->
                <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle" >高级查询</el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="el-icon-refresh" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="success" icon="el-icon-edit" size="mini" @click="handleStartExam" v-hasPermi="['check:cylh:start']">开始考核</el-button>
<!--                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['check:cylh::add']">新增</el-button>-->
<!--                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['check:cylh::export']">导出</el-button>-->
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['check:cylh::remove']">删除</el-button>
              </el-form-item>
            </div>
          </div>

         <div class="toggle-container" ref="toggle-container" style="display: none;">
           <high-query ref="highQuery"></high-query>
            <div class="condition-item">
              <label class="condition-item-title">整改情况</label>
              <el-form-item label="" prop="rectificationStatus">
                <el-select v-model="queryParams.rectificationStatus" placeholder="--全部--" clearable size="small" class="query-param">
                  <el-option
                    v-for="dict in rectificationStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe
                  :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                  :data="historyList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业名称" min-width="120" align="left" prop="enterpriseName"  :render-header="renderHeader"/>
          <el-table-column label="经营场所名称" min-width="120" align="left" prop="operationName"  :render-header="renderHeader"/>
          <el-table-column label="检查时间" align="left" prop="submitTime" width="150" sortable
                           :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ examTimeFormat(scope.row.submitTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检查扣分" align="left" prop="myPoint" sortable :render-header="renderHeader">
          </el-table-column>
          <el-table-column label="量化等级" align="left" prop="rectificationStatus" sortable :render-header="renderHeader">
            <template slot-scope="scope">
<!--              <span v-if="0<=scope.row.myPoint&&scope.row.myPoint<=6" style="color: green">优秀</span>-->
<!--              <span v-else-if="6<scope.row.myPoint&&scope.row.myPoint<=15" style="color: #e5c105">良好</span>-->
<!--              <span v-else-if="15<scope.row.myPoint&&scope.row.myPoint<=30" style="color: red">合格</span>-->
<!--              <span v-else>无</span>-->
              <el-tooltip class="item table-img" effect="dark" :content="countRank(scope.row.myPoint)" placement="right">
                <el-image style="width: 40px; height: 40px"
                          :src="rankImg(scope.row.myPoint)" >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="整改情况" align="left" prop="rectificationStatus" sortable :render-header="renderHeader">
            <template slot-scope="scope">
              {{rectificationStatusFormat(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleViewResult(scope.row)"
              >详情
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-price-tag"
                v-show="scope.row.rectificationStatus=='3'"
                @click="handleRectification(scope.row)"
                v-hasPermi="['check:cylh:rectification']"
              >整改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-share"
                v-show="scope.row.rectificationStatus=='4'"
                @click="handleAudit(scope.row)"
                v-hasPermi="['check:cylh:audit']"
              >审核
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :page-sizes="pageList"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!--提交检查-->
    <el-dialog :visible.sync="examVisible"  :close-on-click-modal="false" :close-on-press-escape="false"
               class="customForm _baseForm_big" @opened="openDialog" :show-close="false">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> 正在检查</span>
        <button class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close" v-on:click="exitExam"></i></button>
      </div>
      <div class="history-body">
        <!--检查项-->
        <check-questions v-if="examVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="true"
                        check-type="cylh" :showAnswer="false" :enterpriseName="operationName" :showUserAnswer="false"
                        ref="currentExam"></check-questions>
        <!--整改项-->
        <rectification ref="rectification1" v-if="examVisible" @on-change="rectificationChange"></rectification>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCurrentExam">提交检查</el-button>
        <el-button @click="exitExam">取消</el-button>
      </div>
    </el-dialog>
    <!--整改详情-->
    <el-dialog :visible.sync="examResultVisible"  :close-on-click-modal="false" class="customForm _baseForm_big"
               @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="history-body"></div>
      <check-questions v-if="examResultVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                      check-type="cylh" :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification>
      <div v-if="examHistoryDetail.rectificationStatus=='4'">
        <rectification-result ref="rec_res1" v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
      </div>
      <div v-if="examHistoryDetail.rectificationStatus=='5'">
        <rectification-result ref="rec_res2" v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
        <rectification-audit v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-audit>
      </div>
      <processList v-if="examResultVisible" :wfOrderType="4" :wfOrderEntityId="form.id"></processList>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="" @click="examResultVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="rectificationVisible"  :close-on-click-modal="false" class="customForm _baseForm_big"
               @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="history-body"></div>
      <check-questions v-if="rectificationVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                      check-type="cylh" :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification v-if="rectificationVisible" :info="examHistoryDetail" :modeType="2"></rectification>
      <rectification-result v-if="rectificationVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-result>
      <rectification-audit v-if="rectificationVisible" :info="examHistoryDetail" :modeType="2"></rectification-audit>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRectification">提交整改</el-button>
        <el-button @click="rectificationVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="rectificationAuditVisible"  :close-on-click-modal="false" class="customForm _baseForm_big"
               @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="history-body"></div>
      <check-questions v-if="rectificationAuditVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                      check-type="cylh" :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="2"></rectification>
      <rectification-result v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
      <rectification-audit ref="rec_aud" v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-audit>
      <div slot="footer" class="dialog-footer">
<!--        <el-button type="primary" @click="rectificationPass">通过</el-button>-->
<!--        <el-button type="danger" plain  @click="rectificationReject">驳回</el-button>-->
        <el-button type="primary" @click="rectificationPassOrReject">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <OperationDialog :show-enterprise="false" ref="operationDialog" @callBack="confirmEnterprise(arguments)"  :close-on-click-modal="false" append-to-body></OperationDialog>
  </div>
</template>

<script>
import history from "./history";
import RectificationAudit from '../template/rectificationAudit'
import HighQuery from "@/views/components/highQuery/highQuery";
import checkQuestions from "@/views/check/template/checkQuestions";
import Rectification from "@/views/check/template/rectification";
import RectificationResult from "@/views/check/template/rectificationResult";
import OperationDialog from "@/views/components/highQuery/operationDialog";
import processList from "@/views/components/todoComponents/processList";
export default {
  components: {checkQuestions, Rectification, RectificationResult, RectificationAudit,HighQuery,OperationDialog,processList },
  ...history
}
</script>
