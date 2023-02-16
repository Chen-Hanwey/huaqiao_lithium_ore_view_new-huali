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
                 <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle" >高级查询</el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="el-icon-refresh" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="success" icon="el-icon-edit" size="mini" @click="handleStartExam" v-hasPermi="['check:xypd:start']">开始考核</el-button>
<!--                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['check:xypd::add']">新增</el-button>-->
<!--                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['check:xypd::export']">导出</el-button>-->
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['check:xypd::remove']">删除</el-button>
              </el-form-item>
            </div>
          </div>

          <div class="toggle-container" ref="toggle-container" style="display: none;">
            <high-query ref="highQuery" :show-operation="false"></high-query>
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
          <el-table-column label="企业名称" width="220" header-align="center" align="center" prop="enterpriseName"  :render-header="renderHeader"/>
          <el-table-column label="检查时间" header-align="center" align="center" prop="submitTime"
                           :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ examTimeFormat(scope.row.submitTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检查得分" header-align="center" align="center" prop="myPoint"  :render-header="renderHeader"/>
          <el-table-column label="整改情况" align="center" prop="rectificationStatus"  :render-header="renderHeader">
            <template slot-scope="scope">
              {{rectificationStatusFormat(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column label="信用等级" align="center" prop="rectificationStatus"  :render-header="renderHeader">
            <template slot-scope="scope">
              {{ (!scope.row.myPoint || scope.row.myPoint < 55) ? '--' : scope.row.myPoint < 61 ? 'C' : scope.row.myPoint < 66 ? 'CC' : scope.row.myPoint < 71 ? 'CCC' :
              scope.row.myPoint < 76 ? 'B' : scope.row.myPoint < 81 ? 'BB' : scope.row.myPoint < 86 ? 'BBB' : scope.row.myPoint < 91 ? 'A' : scope.row.myPoint < 96 ? 'AA' : 'AAA' }}
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
                v-hasPermi="['check:xypd:rectification']"
              >整改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-share"
                v-show="scope.row.rectificationStatus=='4'"
                @click="handleAudit(scope.row)"
                v-hasPermi="['check:xypd:audit']"
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

  <!--  &lt;!&ndash; 新增或修改考试历史对话框 &ndash;&gt;
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" :close-on-press-escape="false"
               class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="history-body"></div>
      <div slot="footer" class="dialog-footer">
        <div v-if="operationType != 3">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
        <div v-if="operationType == 3">
          <el-button type="primary" @click="cancel">关 闭</el-button>
        </div>
      </div>
    </el-dialog>-->

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
                        :showAnswer="false" :enterpriseName="enterpriseName"   :showUserAnswer="false"
                        ref="currentExam"></check-questions>
        <rectification v-if="examVisible" @on-change="rectificationChange" ref="rectification1"></rectification>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCurrentExam">提交检查</el-button>
        <el-button @click="exitExam">取消</el-button>
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
      <rectification v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification>
      <div v-if="examHistoryDetail.rectificationStatus=='4'">
        <rectification-result v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
      </div>
      <div v-if="examHistoryDetail.rectificationStatus=='5'">
        <rectification-result v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
        <rectification-audit v-if="examResultVisible" :info="examHistoryDetail" :modeType="2"></rectification-audit>
      </div>
      <processList v-if="examResultVisible" :wfOrderType="5" :wfOrderEntityId="form.id"></processList>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="" @click="examResultVisible = false">关 闭</el-button>
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
                      :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification v-if="rectificationVisible" :info="examHistoryDetail" :modeType="2"></rectification>
      <rectification-result ref="recRes" v-if="rectificationVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-result>
      <rectification-audit ref="recAud" v-if="rectificationVisible" :info="examHistoryDetail" :modeType="2"></rectification-audit>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRectification()">提交整改</el-button>
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
                      :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
      <rectification v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="2"></rectification>
      <rectification-result v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="2"></rectification-result>
      <rectification-audit ref="recAud2" v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-audit>
      <div slot="footer" class="dialog-footer">
<!--        <el-button type="primary"   @click="rectificationPass">通过</el-button>-->
<!--        <el-button type="danger" plain @click="rectificationReject">驳回</el-button>-->
        <el-button type="primary" @click="rectificationPassOrReject">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <enterprise-dialog  ref="enterpriseDialog" :show-district="false" @callBack="confirmEnterprise(arguments)"  :close-on-click-modal="false" append-to-body></enterprise-dialog>
  </div>
</template>

<script>
import history from "./history";
import checkQuestions from "@/views/check/template/checkQuestions";
import Rectification from "@/views/check/template/rectification";
import RectificationResult from "@/views/check/template/rectificationResult";
import RectificationAudit from "@/views/check/template/rectificationAudit";
import HighQuery from "@/views/components/highQuery/highQuery";
import EnterpriseDialog from "@/views/components/highQuery/operationDialog";
import processList from "@/views/components/todoComponents/processList";
export default {
  components: {EnterpriseDialog, checkQuestions, Rectification, RectificationResult, RectificationAudit,HighQuery,processList},
  ...history
}
</script>
