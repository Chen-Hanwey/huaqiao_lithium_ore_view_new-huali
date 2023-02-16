<template>
  <div class="app-container">
    <el-row :gutter="7">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
          <div class="con-container">
            <div class="lab-container">
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
                <el-button type="success" icon="el-icon-edit" size="mini" @click="handleStartExam" v-hasPermi="['check:sazc:start']">开始检查</el-button>
                <el-button type="el-icon-refresh" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
<!--               <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['check:sazc::export']">导出</el-button>-->
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['check:sazc::remove']">删除</el-button>
              </el-form-item>
            </div>
          </div>

          <div class="toggle-container" ref="toggle-container" style="display: none;">
            <high-query ref="highQuery"></high-query>
            <div class="condition-item" v-if="false">
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
          <el-table-column label="企业名称" min-width="120" width="220" align="left" prop="enterpriseName"  :render-header="renderHeader"/>
          <el-table-column label="经营场所名称" min-width="120" align="left" prop="operationName"  :render-header="renderHeader"/>
          <el-table-column label="检查时间" align="left" prop="submitTime" width="150" sortable
                           :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ examTimeFormat(scope.row.submitTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检查得分" align="left" prop="myPoint" sortable :render-header="renderHeader"/>
          <el-table-column label="检查状态" align="left" prop="rectificationStatus" sortable :render-header="renderHeader">
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
              >查看
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-price-tag"
                v-show="scope.row.rectificationStatus=='3'"
                @click="handleRectification(scope.row)"
                v-hasPermi="['check:sazc:rectification']"
              >整改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-c-scale-to-original"
                v-show="scope.row.rectificationStatus=='1'"
                @click="handleReview(scope.row)"
                v-hasPermi="['check:sazc:review']"
              >巡检
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-share"
                v-show="scope.row.rectificationStatus=='4'"
                @click="handleAudit(scope.row)"
                v-hasPermi="['check:sazc:audit']"
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

    <el-dialog :visible.sync="examVisible"  :close-on-click-modal="false" :close-on-press-escape="false"
               class="customForm _baseForm_big" @opened="openDialog" :show-close="false">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
        <button class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"
                                                v-on:click="exitExam"></i></button>
      </div>
      <div class="history-body">
        <check-questions v-if="examVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="true"
                        :showAnswer="false" :enterpriseName="operationName" :showUserAnswer="false"
                        ref="currentExam"></check-questions>
<!--        <rectification ref="rec" v-if="examVisible" @on-change="rectificationChange"></rectification>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <!--        <exam-timer v-if="examVisible" :remain="examHistoryDetail.exam.timeLimit"
                            @timeFinished="timeFinished"></exam-timer>-->
        <el-button type="primary" @click="submitCurrentExam">提交检查</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="examResultVisible"  :close-on-click-modal="false" class="customForm _baseForm_big"
               @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="history-body"></div>
      <check-questions v-if="examResultVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                      :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification v-if="examResultVisible && this.examHistoryDetail.rectificationRadio" :info="examHistoryDetail" :modeType="2"></rectification>
      <div v-if="examHistoryDetail.rectificationStatus=='4'">
        <rectification-result v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
      </div>
      <div v-if="examHistoryDetail.rectificationStatus=='5'">
        <rectification-result v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
        <rectification-audit v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-audit>
      </div>
      <processList :wfOrderType="getWorkOrderTypeByExamId(examId)" v-if="examHistoryDetail.rectificationStatus > 2" :wfOrderEntityId="form.id"></processList>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="cancelExam">关 闭</el-button>
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
                      :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification v-if="rectificationVisible" :info="examHistoryDetail" :modeType="2"></rectification>
      <rectification-result v-if="rectificationVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-result>
      <rectification-audit v-if="rectificationVisible" :info="examHistoryDetail" :modeType="2" @on-change="rectificationChange"></rectification-audit>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRectification">提交整改</el-button>
      </div>
    </el-dialog>

<!--    审核模态框-->
    <el-dialog :visible.sync="rectificationAuditVisible"  :close-on-click-modal="false" class="customForm _baseForm_big"
               @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="history-body"></div>
      <check-questions v-if="rectificationAuditVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                      :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="2"></rectification>
      <rectification-result v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
      <rectification-audit ref="audit1" v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-audit>
      <div slot="footer" class="dialog-footer">
<!--        <el-button type="primary" @click="rectificationReject">驳回</el-button>-->
<!--        <el-button type="primary" @click="rectificationPass">通过</el-button>-->
        <el-button type="primary" @click="rectificationPassOrReject">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

<!--    巡检 模态框-->
    <el-dialog :visible.sync="reviewVisible"  :close-on-click-modal="false" class="customForm _baseForm_big"
               @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="history-body"></div>
      <check-questions v-if="reviewVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                      :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification ref="review_rec" v-if="reviewVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification>
<!--      <rectification-result v-if="reviewVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-result>-->
<!--      <rectification-audit v-if="reviewVisible" :info="examHistoryDetail" :modeType="2"></rectification-audit>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReview">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import history from "./history";
import checkQuestions from "@/views/check/template/checkQuestions";
import Rectification from "@/views/check/template/rectification";
import RectificationResult from "@/views/check/template/rectificationResult";
import RectificationAudit from "@/views/check/template/rectificationAudit";
import HighQuery from "@/views/components/highQuery/highQuery";
import processList from "@/views/components/todoComponents/processList";

export default {
  components: {checkQuestions, Rectification, RectificationResult, RectificationAudit,HighQuery,processList},
  ...history
}
</script>
