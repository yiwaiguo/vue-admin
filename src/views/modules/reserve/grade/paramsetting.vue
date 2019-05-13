<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="选择等级" class="form-item">
            <el-select v-model="q.level" placeholder="选择等级">
              <el-option
                v-for="item in levelList"
                :label="item.levelname"
                :value="item.levelcode"
                :key="item.levelcode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否人工审核" class="form-item">
            <el-select v-model="q.applyed" placeholder="是否人工审核">
              <el-option
                v-for="item in applys"
                :label="item.applyName"
                :value="item.applyId"
                :key="item.applyId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用等级" class="form-item">
            <el-select v-model="q.status" placeholder="是否启用等级">
              <el-option
                v-for="item in statusList"
                :label="item.statusName"
                :value="item.statusId"
                :key="item.statusId"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button v-if="hasPermission('syslevelinfo:save')" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button v-if="hasPermission('syslevelinfo:delete')" type="primary" icon="el-icon-delete" @click="del">删除</el-button>
      </div>
      <el-dialog title="提示" :visible.sync="subTip" width="20%" top="30vh">
        <span>确定提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subConfirm">确 定</el-button>
          <el-button @click="subTip = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="delTip" width="20%" top="30vh">
        <span>确定要删除选中的记录？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delTip = false">取 消</el-button>
          <el-button type="primary" @click="delConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <div class="tb-box">
        <el-table
          ref="dataTable"
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="700"
          @row-click="getRowData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="id" label="id" align="left" width="80"/>
          <el-table-column prop="levelcode" label="等级编号" align="left" width="100"/>
          <el-table-column prop="levelname" label="等级名称" align="left" width="120"/>
          <el-table-column prop="applyed" label="该等级是否需要人工审核" align="left" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.applyed | applyFilter">{{scope.row.applyed | formatApply}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="flag" label="是否启用该等级" align="left" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.flag | flagFilter">{{scope.row.flag | formatFlag}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isDefault" label="该等级是否默认" align="left" width="120">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.isDefault | defaultFilter"
              >{{scope.row.isDefault | formatDefault}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="moneyrequire" label="等级资产要求" align="left" width="120"/>
          <el-table-column prop="holdorderrequire" label="同时预订金额最大" align="left" width="150"/>
          <el-table-column prop="maxorderau" label="最大产品规格 ( 金 )" align="left" width="150"/>
          <el-table-column prop="maxorderag" label="最大产品规格 ( 银 )" align="left" width="150"/>
          <el-table-column prop="maxoneau" label="单次预订最多 ( 金 )" align="left" width="150"/>
          <el-table-column prop="maxoneag" label="单次预订最多 ( 银 )" align="left" width="150"/>
          <el-table-column prop="createtime" label="数据增加时间" align="center" width="200"/>
          <el-table-column prop="updatetime" label="数据修改时间" align="center" width="200"/>
          <el-table-column prop="remarks" label="备注" align="left" width="200"/>
          <el-table-column prop label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                v-if="hasPermission('syslevelinfo:update')"
                type="primary"
                size="mini"
                @click="updateHandle(scope.$index, scope.row)"
              >修改</el-button>
              <el-button type="primary" size="mini" @click="forDetails(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          :current-page="page.currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <div v-show="switchForm" class="form-section">
      <div class="panel" v-html="panelTitle"/>
      <div class="form-container">
        <el-form ref="config" :model="s" label-width="140px">
          <el-form-item label="等级编号">
            <el-input v-model="s.levelcode" placeholder="等级编号"/>
          </el-form-item>
          <el-form-item label="等级名称">
            <el-input v-model="s.levelname" placeholder="等级名称"/>
          </el-form-item>
          <el-form-item label="是否需要人工审核">
            <el-radio-group v-model="s.applyed">
              <el-radio label="NO_NEED_VERIFY">否</el-radio>
              <el-radio label="NEED_VERIFY">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否启用该等级">
            <el-radio-group v-model="s.flag">
              <el-radio label="FLAG_NO">否</el-radio>
              <el-radio label="FLAG_YES">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="该等级是否默认">
            <el-radio-group v-model="s.isDefault">
              <el-radio label="N">否</el-radio>
              <el-radio label="Y">是</el-radio>
              <span>(当前默认等级是{{defaultLevel.levelname}})</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="等级资产要求">
            <el-input v-model="s.moneyrequire" placeholder="等级资产要求"/>
          </el-form-item>
          <el-form-item label="同时预订金额最大">
            <el-input v-model="s.holdorderrequire" placeholder="同时预订金额最大"/>
          </el-form-item>
          <el-form-item label="最大产品规格 ( 金 )">
            <el-input v-model="s.maxorderau" placeholder="最大产品规格 ( 金 )"/>
          </el-form-item>
          <el-form-item label="最大产品规格 ( 银 )">
            <el-input v-model="s.maxorderag" placeholder="最大产品规格 ( 银 )"/>
          </el-form-item>
          <el-form-item label="单次预订最多 ( 金 )">
            <el-input v-model="s.maxoneau" placeholder="单次预订最多 ( 金 )"/>
          </el-form-item>
          <el-form-item label="单次预订最多 ( 银 )">
            <el-input v-model="s.maxoneag" placeholder="单次预订最多 ( 银 )"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="s.remarks" placeholder="备注"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="wrap-box" v-if="showDetails">
      <levelinfo class="levelinfo" @goback="goback"></levelinfo>
    </div>
  </div>
</template>
<script>
import { isBlank,hasPermission } from "@/utils";
import levelinfo from './children/levelinfo';
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      q: {
        level: "",
        applyed: "",
        status: ""
      },
      tableData: [],
      multipleSelection: [],
      page: {
        pageSize: 10,
        total: 1,
        currentPage: 1
      },
      switchForm: false,
      subTip: false,
      s: {},
      panelTitle: "",
      applyData: {},
      dialogFormVisible: false,
      formLabelWidth: "80px",
      levelList: [],
      applys: [
        { applyName: "否", applyId: "NO_NEED_VERIFY" },
        { applyName: "是", applyId: "NEED_VERIFY" }
      ],
      statusList: [
        { statusName: "否", statusId: "FLAG_NO" },
        { statusName: "是", statusId: "FLAG_YES" }
      ],
      defaultLevel: {},
      delTip:false,
      rowData: {}, //选中行数据
      multipleSelection: [],
      level:{},
      showDetails:false,
      levelCode:''
    };
  },
  filters: {
    applyFilter(status) {
      switch (status) {
        case "NEED_VERIFY":
          return "success";
        case "NO_NEED_VERIFY":
          return "danger";
        default:
          return "";
      }
    },
    formatApply(status) {
      switch (status) {
        case "NEED_VERIFY":
          return "是";
        case "NO_NEED_VERIFY":
          return "否";
        default:
          return "-";
      }
    },
    flagFilter(status) {
      switch (status) {
        case "FLAG_YES":
          return "success";
        case "FLAG_NO":
          return "danger";
        default:
          return "";
      }
    },
    formatFlag(status) {
      switch (status) {
        case "FLAG_YES":
          return "是";
        case "FLAG_NO":
          return "否";
        default:
          return "-";
      }
    },
    defaultFilter(status) {
      switch (status) {
        case "Y":
          return "success";
        case "N":
          return "danger";
        default:
          return "";
      }
    },
    formatDefault(status) {
      switch (status) {
        case "Y":
          return "是";
        case "N":
          return "否";
        default:
          return "-";
      }
    }
  },
  created() {
    this.getLevelList();
  },
  components:{
    levelinfo
  },
  methods: {
    ...mapMutations(["setLevelCode"]),
    hasPermission(val){
      return hasPermission(val)
    },
    async query() {
      let queryParams =
        "&level=" +
        this.q.level +
        "&applyed=" +
        this.q.applyed +
        "&status=" +
        this.q.status;
      let r = await this._fetch(
        "/syslevelinfo/list?type=0&limit=50&page=1" + queryParams,
        {
          method: "GET"
        }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
      } else {
        this.$message(r.msg);
      }
    },
    reset() {
      this.q = {
        level: "",
        applyed: "",
        status: ""
      };
    },
    add() {
      this.switchForm = true;
      this.panelTitle = "新增等级信息";
      this.s = {};
    },
    del(){
      if (this.multipleSelection.length < 1) {
        this.$message("请选择一条记录");
        return;
      }
      this.delTip = true;
    },
    async delConfirm() {
      let r = await this._fetch("/syslevelinfo/delete", {
        method: "POST",
        body: this.level.Ids
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.delTip = false;
      } else {
        this.$message(r.msg);
      }
    },
    async getLevelList() {
      let r = await this._fetch("/syslevelinfo/getLevels/?_=123", {
        method: "GET"
      });
      this.levelList = r.list;
    },
    updateHandle(index, row) {
      this.s = row;
      this.s.id = row.id;
      this.switchForm = true;
      this.panelTitle = "等级信息更改";
    },
    onSubmit() {
      if (this.validator()) {
        return;
      }
      var url =
        this.s.id == null ? "/syslevelinfo/save" : "/syslevelinfo/update";
      this.addUser(url);
    },
    async addUser(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.s
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
    },
    reback() {
      this.switchForm = false;
    },
    getRowData(row) {
      this.$refs.dataTable.toggleRowSelection(row);
      this.rowData = row;
      this.level.id = this.rowData.id;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.level.Ids = [];
      this.multipleSelection.forEach(item => {
        this.level.Ids.push(item.id);
      });
      this.rowData = this.multipleSelection[0];
      if (this.rowData) {
        this.level.id = this.rowData.id;
      }
    },
    forDetails(index,row) {
      this.switchForm = true;
      this.showDetails = true;
      this.setLevelCode(row.levelcode);
    },
    goback(){
      this.switchForm = false;
      this.showDetails = false;
    },
    withdrawConfirm() {
      if (this.validator2()) {
        return;
      }
      var amtNum = parseFloat(this.applyData.amt) * 100;
      var amtCount = amtNum.toFixed(0);
      this.applyData.withdrawlAmt = amtCount.toString();
      this.subConfirm();
    },
    async subConfirm() {
      let r = await this._fetch("//corporate/withdrawal/preapplication", {
        method: "POST",
        body: this.applyData
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getAdminList();
        this.subTip = false;
      } else {
        this.$message(r.msg);
      }
    },
    validator() {
      if (isBlank(this.s.levelcode)) {
        this.$message("等级编号不能为空");
        return true;
      }
      if (isBlank(this.s.levelname)) {
        this.$message("等级名称不能为空");
        return true;
      }
      if (isBlank(this.s.levelcode)) {
        this.$message("等级编号不能为空");
        return true;
      }
      if (isBlank(this.s.applyed)) {
        this.$message("人工审核 不能为空");
        return true;
      }
      if (isBlank(this.s.flag)) {
        this.$message("等级状态不能为空");
        return true;
      }
      if (isBlank(this.s.isDefault)) {
        this.$message("默认等级不能为空");
        return true;
      }
    },
    validator2() {
      if (isBlank(this.applyData.amt)) {
        this.$message("提现金额不能为空");
        return true;
      }
      if (this.applyData.amt < 5) {
        this.$message("提现金额不能小于5元");
        return true;
      }
      if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(this.applyData.amt.trim())) {
        this.$message("输入金额只允许两位小数");
        this.applyData.amt = "";
        this.this.$messageTip = false;
        this.this.$messageTip = true;
        return true;
      }
      if (!parseFloat(this.applyData.amt)) {
        this.$message("提现金额不能为0");
        return true;
      }
      if (this.applyData.amt > this.applyData.allowWithdrawal) {
        this.$message("提现金额不能大于可出金额");
        return true;
      }
      if (isBlank(this.applyData.remark)) {
        this.$message("备注信息不能为空");
        return true;
      }
    },
    rowClass() {
      return "text-align:center";
    }
  }
};
</script>
<style lang="scss" scoped>
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
.el-form-item {
  padding: 5px 0;
}
.form-item {
  margin-bottom: 0;
}
form {
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}
.btn-box {
  padding-top: 15px;
}
.el-dialog__body {
  form {
    border: none;
  }
}
.page-container {
  position:relative;
}
.wrap-box {
  position:absolute;
    top:0;
    left:0;
    background: #fff;
    width:100%;
    height:9999px;
    z-index:10;
}
.levelinfo {   
    margin:20px;
}
</style>

