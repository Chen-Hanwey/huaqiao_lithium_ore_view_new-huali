<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
            <label class="condition-item-title">菜单名称</label>
            <el-form-item label="" prop="menuName" class="custom-el-form-item">
                <el-input
                    v-model="queryParams.menuName" class="query-param"
                    placeholder="请输入菜单名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
        </div>
        <div class="lab-container">
          <label class="condition-item-title">菜单状态</label>
          <el-form-item label="" class="custom-el-form-item" prop="visible">
            <el-select v-model="queryParams.visible" placeholder="菜单状态" clearable size="small" class="query-param">
              <el-option
                v-for="dict in visibleOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="lab-container">
          <label class="condition-item-title" style="width: 14px">&nbsp;</label>
          <el-form-item label="" class="custom-el-form-item" prop="usualTypeChecked" style="vertical-align: middle">
            <el-checkbox v-model="usualTypeChecked" @change="usualTypeQueryChange">
              常用菜单
            </el-checkbox>
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['system:menuMobile:add']">新增
            </el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table
      ref="table"
      v-loading="loading"
      :height="tableHeight"
      :data="menuMobileList"
      row-key="menuId"
      @row-dblclick="handleDoubleClick"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="菜单名称" align="left" prop="menuName" :render-header="renderHeader"/>
      <el-table-column label="图标" align="left" prop="icon" width="80px"  :render-header="renderHeader">
        <template slot-scope="scope">
          <el-image v-if="scope.row.icon" :src="scope.row.icon" style="height: 20px;width: 20px;vertical-align: middle;"></el-image>
        </template>
      </el-table-column>
      <el-table-column v-if="!usualTypeChecked" label="菜单排序" align="left" prop="orderNumAll" width="80px" :render-header="renderHeader"/>
      <el-table-column v-if="usualTypeChecked" label="常用排序" align="left" prop="orderNumUsual" width="80px" :render-header="renderHeader"/>
      <el-table-column label="路径" align="left" prop="path" :render-header="renderHeader"/>
      <el-table-column label="可见" align="left" prop="visible" :formatter="visibleFormat" width="80px" :render-header="renderHeader"/>
      <el-table-column label="常用" align="left" prop="usualType" width="80px" :render-header="renderHeader">
        <template slot-scope="scope" v-if="scope.row.menuType == 'C'">
          <el-switch
            v-model="scope.row.usualType"
            active-value="1"
            inactive-value="2"
            @change="handleUsualChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="left" prop="remark" :render-header="renderHeader"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menuMobile:edit']"
          >修改</el-button>
          <el-button v-if="scope.row.menuType == 'M'"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menuMobile:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menuMobile:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="上级菜单">
                <treeselect
                  v-model="form.parentId"
                  :options="menuOptions"
                  :show-count="true"
                  placeholder="选择上级菜单"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单类型" prop="menuType">
                <el-radio-group v-model="form.menuType">
                  <el-radio label="M">目录</el-radio>
                  <el-radio label="C">菜单</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序" prop="orderNumAll">
                <el-input-number v-model="form.orderNumAll" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否常用" prop="usualType" v-if="form.menuType == 'C'">
                <el-switch
                  v-model="form.usualType"
                  active-value="1"
                  inactive-value="2">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.menuType == 'C' && form.usualType == '1'">
              <el-form-item label="常用排序" prop="orderNumUsual">
                <el-input-number v-model="form.orderNumUsual" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12" v-if="form.menuType == 'C'">
              <el-form-item label="路径" prop="path">
                <el-input v-model="form.path" placeholder="请输入路径" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.menuType == 'C'">
              <el-form-item label="菜单图标" prop="icon">
                <div class="el-upload-container-menu">
                  <el-upload
                    class="avatar-uploader"
                    :action="iconUploadUrl"
                    :headers="uploadHeader"
                    :show-file-list="false"
                    :on-success="handleIconSuccess"
                    :before-upload="beforeIconUpload">

                    <el-image v-if="form.icon" :src="form.icon" class="avatar"></el-image>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单状态">
                <el-radio-group v-model="form.visible">
                  <el-radio
                    v-for="dict in visibleOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" placeholder="请输入备注" maxlength="100" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .el-upload-container-menu .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload-container-menu .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .el-upload-container-menu .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .el-upload-container-menu .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
</style>

<script>
    import menuMobile from "./menuMobile";
    export default {
        ...menuMobile
    }
</script>
