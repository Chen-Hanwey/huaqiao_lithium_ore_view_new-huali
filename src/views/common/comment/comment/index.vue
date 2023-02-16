<template>
  <div class="app-container">
    <el-row :gutter="7">
      <!--辖区数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
          <div class="con-container">
            <div class="lab-container">
              <label class="condition-item-title">联系方式</label>
              <el-form-item label="" prop="contact" class="custom-el-form-item">
                <el-input
                  v-model="queryParams.contact" class="query-param"
                  placeholder="请输入联系方式"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </div>

            <div class="btn-container">
              <el-form-item>
                <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
                </el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="el-icon-refresh" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    <!--            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"-->
    <!--                       v-hasPermi="['common:comment:add']">新增-->
    <!--            </el-button>-->
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                          v-hasPermi="['common:comment:export']">导出
                </el-button>
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                          v-hasPermi="['common:comment:remove']"
                >删除
                </el-button>
              </el-form-item>
            </div>
          </div>

          <div class="toggle-container" ref="toggle-container" style="display: none;">
            <high-query ref="highQuery"></high-query>
            <div class="condition-item">
              <label class="condition-item-title">点评时间</label>
              <el-form-item label="" prop="addAt">
                <el-date-picker clearable size="small" style="width: 240px;"
                                v-model="queryParams.addAtRange"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="['00:00:00','23:59:59']"
                                placeholder="选择发布时间">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="commentList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <!--      <el-table-column label="使用场景" align="left" prop="scene" sortable :render-header="renderHeader"/>-->
          <!--      <el-table-column label="场景ID" align="left" prop="sceneId" sortable :render-header="renderHeader"/>-->
          <!--      <el-table-column label="父级ID" align="left" prop="parentId" sortable :render-header="renderHeader"/>-->
          <!--      <el-table-column label="发布人-系统用户id" align="left" prop="authId" sortable :render-header="renderHeader"/>-->
          <el-table-column label="企业名称" min-width="120" align="left" prop="enterpriseName"  :render-header="renderHeader"/>
          <el-table-column label="经营场所名称" min-width="120" align="left" prop="operationName"  :render-header="renderHeader"/>
          <el-table-column label="联系方式" align="left" prop="contact" sortable :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.contact ? scope.row.contact : '--' }}</span>
            </template>
          </el-table-column>
          <!--      <el-table-column label="联系地址" align="left" prop="address" sortable :render-header="renderHeader"/>-->

          <el-table-column label="环境评分" align="left" prop="score" sortable :render-header="renderHeader"/>
          <el-table-column label="菜品评分" align="left" prop="score1" sortable :render-header="renderHeader"/>
          <el-table-column label="服务评分" align="left" prop="score2" sortable :render-header="renderHeader"/>
          <el-table-column label="平均评分" align="left" prop="score3" sortable :render-header="renderHeader"/>

          <!--<el-table-column label="点评内容" align="left" prop="content" sortable :render-header="renderHeader" width="300px">
            <template slot-scope="scope">
              <div style="width: 100%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.content}}</div>
            </template>
          </el-table-column>

          &lt;!&ndash;      <el-table-column label="图片集" align="left" prop="imgs" sortable :render-header="renderHeader"/>&ndash;&gt;
          &lt;!&ndash;      <el-table-column label="是否推荐/热评/置顶" align="left" prop="isRec" sortable :render-header="renderHeader"/>&ndash;&gt;
          <el-table-column label="点评时间" align="left" prop="addAt" width="150" sortable :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.addAt }}</span>
            </template>
          </el-table-column>-->
          <el-table-column label="操作"  align="left" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
                v-hasPermi="['common:comment:query']"
              >详情
              </el-button>
    <!--          <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['common:comment:edit']"
              >修改
              </el-button>-->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['common:comment:remove']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改评论管理对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="comment-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <base-form :readOnly="readOnly" ref="baseForm"></base-form>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">评论信息</div>
          </div>
          <div class="sub-body">
            <el-row>
<!--              <el-col :span="8">-->
<!--                <el-form-item label="使用场景" prop="scene" v-if="!readOnly">-->
<!--                  <el-input v-model="form.scene" placeholder="请输入使用场景"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="使用场景：" prop="scene" v-if="readOnly" class="custom-form-item">-->
<!--                  {{ form.scene }}-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="8">-->
<!--                <el-form-item label="场景ID" prop="sceneId" v-if="!readOnly">-->
<!--                  <el-input v-model="form.sceneId" placeholder="请输入场景ID"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="场景ID：" prop="sceneId" v-if="readOnly" class="custom-form-item">-->
<!--                  {{ form.sceneId }}-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="8">-->
<!--                <el-form-item label="父级ID" prop="parentId" v-if="!readOnly">-->
<!--                  <el-input v-model="form.parentId" placeholder="请输入父级ID"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="父级ID：" prop="parentId" v-if="readOnly" class="custom-form-item">-->
<!--                  {{ form.parentId }}-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="8">-->
<!--                <el-form-item label="发布人-系统用户id" prop="authId" v-if="!readOnly">-->
<!--                  <el-input v-model="form.authId" placeholder="请输入发布人-系统用户id"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="发布人-系统用户id：" prop="authId" v-if="readOnly" class="custom-form-item">-->
<!--                  {{ form.authId }}-->
<!--                </el-form-item>-->
<!--              </el-col>-->
              <el-col :span="24">
                <el-form-item label="联系方式" prop="contact" v-if="!readOnly">
                  <el-input v-model="form.contact" placeholder="请输入联系方式"/>
                </el-form-item>
                <el-form-item label="联系方式：" prop="contact" v-if="readOnly" class="custom-form-item">
                  {{ form.contact }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="联系地址" prop="address" v-if="!readOnly">
                  <el-input v-model="form.address" placeholder="请输入联系地址"/>
                </el-form-item>
                <el-form-item label="联系地址：" prop="address" v-if="readOnly" class="custom-form-item">
                  {{ form.address }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="评论内容" prop="content" v-if="!readOnly">
                  <el-input v-model="form.content" placeholder="请输入评论内容"/>
                </el-form-item>
                <el-form-item label="评论内容：" prop="content" v-if="readOnly" class="custom-form-item">
                  {{ form.content }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="环境评分" prop="score" v-if="!readOnly">
                  <el-input v-model="form.score" placeholder="请输入环境评分"/>
                </el-form-item>
                <el-form-item label="环境评分：" prop="score" v-if="readOnly" class="custom-form-item">
                  <el-rate
                    v-model="form.score"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}">
                  </el-rate>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="菜品评分" prop="score1" v-if="!readOnly">
                  <el-input v-model="form.score1" placeholder="请输入菜品评分"/>
                </el-form-item>
                <el-form-item label="菜品评分：" prop="score1" v-if="readOnly" class="custom-form-item">
                  <el-rate
                    v-model="form.score1"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}">
                  </el-rate>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="服务评分" prop="score2" v-if="!readOnly">
                  <el-input v-model="form.score2" placeholder="请输入服务评分"/>
                </el-form-item>
                <el-form-item label="服务评分：" prop="score2" v-if="readOnly" class="custom-form-item">
                  <el-rate
                    v-model="form.score2"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}">
                  </el-rate>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="平均评分" prop="score3" v-if="!readOnly">
                  <el-input v-model="form.score3" placeholder="请输入平均评分"/>
                </el-form-item>
                <el-form-item label="平均评分：" prop="score3" v-if="readOnly" class="custom-form-item">
                  <el-rate
                    v-model="form.score3"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}">
                  </el-rate>
                </el-form-item>
              </el-col>
<!--              <el-col :span="8">-->
<!--                <el-form-item label="是否推荐/热评/置顶" prop="isRec" v-if="!readOnly">-->
<!--                  <el-input v-model="form.isRec" placeholder="请输入是否推荐/热评/置顶"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="是否推荐/热评/置顶：" prop="isRec" v-if="readOnly" class="custom-form-item">-->
<!--                  {{ form.isRec }}-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="8">-->
<!--                <el-form-item label="发布时间" prop="addAt" v-if="!readOnly">-->
<!--                  <el-date-picker clearable size="small" class="form-item"-->
<!--                                  v-model="form.addAt"-->
<!--                                  type="datetime"-->
<!--                                  value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                                  placeholder="选择发布时间">-->
<!--                  </el-date-picker>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="发布时间：" prop="addAt" v-if="readOnly" class="custom-form-item">-->
<!--                  {{ form.addAt }}-->
<!--                </el-form-item>-->
<!--              </el-col>-->
            </el-row>
          </div>
        </div>
      </el-form>
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
  </div>
</template>

<script>
import comment from "./comment";

export default {
  ...comment
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
