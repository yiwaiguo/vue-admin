<template>
  <div class="page-container">
    <div class="show-box" v-show="!switchForm">
      <div class="query-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="参数名">
            <el-input v-model="formInline.user" placeholder="请输入参数名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="clearHandle">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="primary" icon="el-icon-edit-outline" @click="update">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="del">删除</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          :current-row-key="CurrentRowKey"
          max-height="500"
        >
          <el-table-column type="index" width="35" align="center"></el-table-column>
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column prop="pValue" label="上级参数值" align="center"></el-table-column>
          <el-table-column prop="key" label="参数名" align="center"></el-table-column>
          <el-table-column prop="value" label="参数值" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          background
        ></el-pagination>
      </div>
    </div>

    <div class="form-section" v-show="switchForm">
      <div class="panel" v-html="panelTitle"></div>
      <div class="form-container">
        <el-form ref="config" :model="config" label-width="100px">
          <el-form-item label="参数名">
            <el-input v-model="config.key" placeholder="参数名"></el-input>
          </el-form-item>
          <el-form-item label="参数值">
            <el-input v-model="config.value" placeholder="参数值"></el-input>
          </el-form-item>
          <el-form-item label="父级">
            <el-select v-model="config.pid" placeholder="请选择...">
              <el-option
                v-for="item in selectedList"
                :label="item.value"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="config.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      tableData: [],
      CurrentRowKey: "",
      currentPage: 1,
      switchForm: false,
      config: {},
      panelTitle: "新增参数",
      selectedList: []
    };
  },
  methods: {
    query() {
      let queryData = { user: this.formInline.user };
      this._fetch("/query", {
        method: "POST",
        body: queryData
      });
    },
    clearHandle() {
      this.formInline.user = "";
    },
    add() {
      this.switchForm = true;
      this.panelTitle = '新增参数';
    },
    update() {
      if (!this.CurrentRowKey) {
        this.$message("请选择一条记录");
      }
      this.panelTitle = '参数信息更改';
    },
    del() {
      if (!this.CurrentRowKey) {
        this.$message("请选择一条记录");
      }
    },
    onSubmit() {},
    reback() {
      this.switchForm = false;
    },
    getAdminList() {
      //   this._fetch("/admin", { method: "GET" });
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  },
  created() {
    this.getAdminList();
  }
};
</script>
<style>
.input {
  display: inline-block;
  width: 200px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}
.input:hover {
  border-color: #c0c4cc;
}
.input:focus {
  border-color: #409eff;
}
.input::-webkit-input-placeholder {
  padding-left: 14px;
  color: #bbb;
}
</style>

