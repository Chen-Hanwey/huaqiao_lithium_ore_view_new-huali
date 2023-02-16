<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">检查名称</label>
          <el-form-item label="" prop="name" class="custom-el-form-item">
            <el-input
              v-model="queryParams.name" class="query-param"
              placeholder="请输入检查名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
<!--        <div class="lab-container">
          <label class="condition-item-title">开始时间</label>
          <el-form-item label="" prop="startTime" class="custom-el-form-item">
            <el-date-picker clearable size="small" style="width: 240px;"
                            v-model="queryParams.examStartTimeRange"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            placeholder="选择检查开始时间">
            </el-date-picker>
          </el-form-item>
        </div>-->

        <div class="btn-container">
          <el-form-item>
            <!--<el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">条件
            </el-button>-->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       >新增
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"

            >删除
            </el-button>
          </el-form-item>
        </div>
      </div>

      <!--<div class="toggle-container" ref="toggle-container" style="display: inline-block;">
        <div class="condition-item" v-if="false">
          <label class="condition-item-title">发布组织</label>
          <el-form-item label="" prop="publishOrgCode">
            <el-input
              v-model="queryParams.publishOrgCode" class="query-param"
              placeholder="请输入发布党组织编码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">开始时间</label>
          <el-form-item label="" prop="startTime">
            <el-date-picker clearable size="small" style="width: 240px;"
                            v-model="queryParams.examStartTimeRange"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            placeholder="选择检查开始时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </div>-->
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="examList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查名称" align="left" prop="name" sortable :render-header="renderHeader"/>
<!--      <el-table-column label="开始日期" align="left" prop="examStartTime" width="100" sortable
                       :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ examTimeFormat(scope.row.examStartTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止日期" align="left" prop="examEndTime" width="100" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ examTimeFormat(scope.row.examEndTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长(分钟)" align="left" prop="timeLimit" width="120" sortable :render-header="renderHeader"/>-->
      <el-table-column label="总分" align="left" prop="totalPoint" width="80" sortable :render-header="renderHeader"/>
<!--      <el-table-column label="通过分" align="left" prop="passPoint" width="100" sortable :render-header="renderHeader"/>-->
<!--      <el-table-column label="状态" align="left" prop="examPaperStatus" width="100" sortable :render-header="renderHeader"
                       :formatter="examPaperStatusFormat"/>-->
      <el-table-column label="检查说明" align="left" prop="remark" sortable :render-header="renderHeader"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="240">
        <template slot-scope="scope">
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >预览
          </el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-pie-chart"
            @click="handleStatistics(scope.row)"
          >统计
          </el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
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

    <!-- 新增或修改检查管理对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="exam-body">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="检查名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入检查名称" :readonly="readOnly"/>
          </el-form-item>
<!--          <el-row>
            <el-col :span="8">
              <el-form-item label="题目顺序" prop="quesSortType">
                <el-select v-model="form.quesSortType" placeholder="" :disabled="readOnly" style="width: 100%;"
                           class="customSelect">
                  <el-option v-for="(dic,index) in examQuestionSortTypeDicList"
                             :key="index"
                             :label="dic.dictLabel"
                             :value="dic.dictValue"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="组卷方式" prop="buildPaper">
                <el-select v-model="form.buildPaper" placeholder="" :disabled="readOnly" style="width: 100%;"
                           class="customSelect">
                  <el-option v-for="(dic,index) in examBuildPaperDicList"
                             :key="index"
                             :label="dic.dictLabel"
                             :value="dic.dictValue"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row v-if="form.buildPaper == '1'">
            <el-col :span="24">
              <el-form-item label="选择检查库" prop="quesBanks">
                <el-select v-model="form.quesBankIds" placeholder="" :disabled="readOnly" style="width: 100%;"
                           class="customSelect" multiple clearable :multiple-limit="quesBankMultiLimit" filterable>
                  <el-option v-for="(dic,index) in questionBankList"
                             :key="index"
                             :label="dic.quesBankName"
                             :value="dic.id" :disabled="dic.typeStatus == '2'"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
<!--          <el-form-item label="发布组织" prop="publishOrgCode" v-if="false">
            <el-input v-model="form.publishOrgCode" placeholder="请输入发布组织" :readonly="readOnly"/>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="起止时间" prop="examStartTime">
                <el-date-picker clearable size="small" style="width: 100%;" :readonly="readOnly"
                                v-model="examTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检查时长" prop="timeLimit">
                <el-input v-model="form.timeLimit" placeholder="" :readonly="readOnly" :min="10" type="number">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>-->

          <el-row>
            <el-col :span="8">
              <el-form-item label="总分" prop="totalPoint">
                <el-input v-model="form.totalPoint" placeholder="由所选题目分数自动计算" readonly type="number" min="0"/>
              </el-form-item>
            </el-col>
<!--            <el-col :span="8">
              <el-form-item label="及格分" prop="passPoint">
                <el-input v-model="form.passPoint" placeholder="请输入及格分" :readonly="readOnly" type="number" min="0"/>
              </el-form-item>
            </el-col>-->
          </el-row>
          <el-row v-if="form.id != undefined && form.buildPaper === '1'">
            <el-form-item label="重组试卷" prop="reAutoBuild">
              <el-radio-group v-model="form.reAutoBuild">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检查说明" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入检查说明" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.buildPaper == '2'">
            <el-form-item label="" prop="questionButton">
              <el-button type="primary" @click="addQuestions">添加题目</el-button>
<!--              <el-button type="primary" @click="addQuestionsChapter">添加分类</el-button>-->
            </el-form-item>
          </el-row>
          <el-row v-if="form.buildPaper == '2' && selectedJudgementQuestions.length > 0">
            <div class="sub-body" style="padding: 0px;">
              <div class="quetion-list-with-type" v-if="selectedJudgementQuestions.length > 0">
                <div class="con-container" style="padding: 10px;margin-top:5px;margin-bottom: 5px">
                  <span>共{{ selectedJudgementQuestions.length }}项</span>
                </div>
                <el-table ref="single-question-table" stripe
                          :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="selectedJudgementQuestions">
                  <el-table-column label="序号" type="index" width="60" align="left">
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="检查项" align="center" prop="quesDetail" :render-header="renderHeader"/>
                  <el-table-column label="分数" align="center" prop="quesPoint" :render-header="renderHeader">
                    <template slot-scope="scope">
                      <el-input-number @change="calTotalPointForSelected" :step="1" controls-position="right" :min="1"  step-strictly v-model="scope.row.quesPoint"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="加分选项" align="center" prop="quesPoint" :render-header="renderHeader">
                    <template slot-scope="scope">
                      <el-select multiple v-model="scope.row.answerArray" placeholder="请选择加分项">
                        <el-option
                          v-for="item in questionOptionFormat(scope.row.options)"
                          :key="item.option"
                          :label="item.optionDescribe"
                          :value="item.optionDescribe"
                          >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleQuestionView(scope.row,'3')"
                      >查看
                      </el-button>
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleQuestionMoveUp(scope.$index,'3')"
                      >上移
                      </el-button>
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleQuestionMoveDown(scope.$index,'3')"
                      >下移
                      </el-button>
                      <el-button
                        size="mini"
                        type="text"
                        @click="handleQuestionDelete(scope.$index,'3')"
                      >删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="operationType != 3">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
        <div v-if="operationType == 3">
          <el-button type="" @click="cancel">关 闭</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="viewOpen" fullscreen :close-on-click-modal="false" class="customForm"
               @opened="openDialogView">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="exam-body"></div>
      <exam-questions v-if="viewOpen" :examId="form.id" :showItems="false" :showAnswer="true"
                      :showUserAnswer="false"></exam-questions>
    </el-dialog>
    <el-dialog :visible.sync="showAddQuestionDialog" fullscreen :close-on-click-modal="false" class="customForm"
               @opened="openQuestionDialog">
      <div slot="title">
        <span><i class="el-icon-plus"></i></span>
        <span>添加检查项</span>
      </div>
      <div id="question-list"></div>
      <el-form :model="questionQueryParams" ref="questionQueryForm" :inline="true" label-width="68px"
               style="margin-bottom: 5px">
        <div class="con-container">
          <div class="lab-container">
            <label class="condition-item-title">检查库</label>
            <el-form-item label="" prop="quesBankId" class="custom-el-form-item">
              <el-select v-model="questionQueryParams.quesBankId" placeholder="--全部--" clearable size="small"
                         class="query-param"
                         filterable @change="handleQuestionQuery">
                <el-option v-for="(dic,index) in questionBankList"
                           :key="index"
                           :label="dic.quesBankName"
                           :value="dic.id" :disabled="dic.typeStatus == '2'" />
              </el-select>
            </el-form-item>
          </div>
          <div class="lab-container">
            <label class="condition-item-title">类型</label>
            <el-form-item label="" prop="quesType" class="custom-el-form-item">
              <el-select v-model="questionQueryParams.quesType" placeholder="--全部--" clearable size="small"
                         class="query-param" @change="handleQuestionQuery">
                <el-option v-for="(dic,index) in questionTypeDicList"
                           :key="index"
                           :label="dic.dictLabel"
                           :value="dic.dictValue"/>
              </el-select>
            </el-form-item>
          </div>
          <div class="lab-container">
            <label class="condition-item-title">关键字</label>
            <el-form-item label="" prop="keywords" class="custom-el-form-item">
              <el-input
                v-model="questionQueryParams.keywords" class="query-param"
                placeholder="请输入关键字"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </div>

          <div class="btn-container">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuestionQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuestionQuery">重置</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <el-table ref="questionTable" v-loading="questionListLoading" stripe
                :height="questionTableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                :data="questionList" @selection-change="handleQuestionSelectionChange">
        <el-table-column type="selection" width="55" align="center" :selectable="checkQuestionSelectable"/>
        <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
            <span>{{(questionQueryParams.pageNum - 1) * questionQueryParams.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="检查项" align="left" prop="quesDetail" :render-header="renderHeader"/>
        <el-table-column label="检查库" align="left" prop="quesBankId" width="250" :render-header="renderHeader"
                         :formatter="quesBankFormat"/>
        <el-table-column label="关键字" align="left" prop="keywords" width="180" :render-header="renderHeader"/>
<!--        <el-table-column label="类型" align="left" prop="quesType" width="80" :formatter="quesTypeFormatForTable"
                         :render-header="renderHeader"/>-->
      </el-table>
      <pagination
        :page-sizes="pageList"
        :total="questionTotal"
        :page.sync="questionQueryParams.pageNum"
        :limit.sync="questionQueryParams.pageSize"
        @pagination="getQuestionList"
      />

      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" @click="addQuestionOk">确 定</el-button>
          <el-button @click="addQuestionCancel">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="examQuestionView" :close-on-click-modal="false" width="600px"
               @opened="openDialogView">
      <div slot="title">
        <span><i class="el-icon-view"></i></span>
        <span>查看</span>
      </div>
      <question-item v-if="examQuestionView" :questionDetail="selectedQuestionForView"
                     :questionTypeDicList="questionTypeDicList">
      </question-item>
    </el-dialog>

    <el-dialog
      title="添加分类"
      :visible.sync="chapterDialogVisible"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="chapterDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="chapterAdd">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import exam from "./exam";

  export default {
    ...exam
  }
</script>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .question-list-container .el-dialog__body {
    padding: 10px 10px;
  }
</style>
<style scoped>
  .exam-header {
    padding: 0 10px 10px;
    border: 1px solid #dedede;
    background-color: #fcfcfc;
    position: relative;
  }

  .exam-title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    padding: 20px 0 10px;
    margin-bottom:10px;
  }

  .exam-module {
    margin-top: 10px;
    border: 1px solid #dedede;
    background-color: #fcfcfc;
  }

  .exam-module-list {
    margin-top: 20px;
    border: 1px solid #dedede;
    background-color: #ffffff;
  }

  .exam-module-title {
    font-size: 16px;
    padding: 10px;
    font-weight: 600;
    background-color: #e2e2e2;
  }
</style>
