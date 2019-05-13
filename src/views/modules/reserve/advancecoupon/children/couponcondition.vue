<template>
  <div>
    <div class="form-section" v-show="!switchForm">
      <div class="panel" v-html="panelTitle"/>
      <div class="form-container">
        <div class="btn-box">
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="del">删除</el-button>
          <el-button type="info" @click="query">查询</el-button>
          <el-button type="info" @click="goback">返回</el-button>
        </div>
        <div class="tb-box">
          <el-table
            :data="tableData"
            :header-cell-style="rowClass"
            style="width: 100%"
            border
            max-height="700"
            @row-click="getRowData"
            ref="dataTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="index" width="40" align="center"/>
            <el-table-column type="selection" width="45" align="center"/>
            <el-table-column prop="id" label="id" align="left" width="60px"/>
            <el-table-column prop="couponNo" label="券批次号" align="left" width="180"/>
            <el-table-column prop="type" label="类型" align="left">
              <template slot-scope="scope">
                <span>{{scope.row.type | typeFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="conditionType" label="条件类型" align="left" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.conditionType | limitFliter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="conditionValue" label="条件值" align="left">
              <template slot-scope="scope">
                <span>{{scope.row.conditionValue | valueFliter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否启用该限制条件" align="left" width="180">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" width="180"/>
            <el-table-column prop="createUser" label="创建人" align="left"/>
            <el-table-column prop="updateTime" label="最后修改时间" align="center" width="180"/>
            <el-table-column prop="updateUser" label="修改人" align="left" width="180"/>
            <el-table-column prop label="操作" align="center" width="120">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="update(scope.$index, scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog title="提示" :visible.sync="delTip" width="20%" top="30vh" :modal-append-to-body='false'>
        <span>确定要删除选中的记录？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delTip = false">取 消</el-button>
          <el-button type="primary" @click="delConfirm">确 定</el-button>
        </span>
      </el-dialog>
      </div>
    </div>

    <div v-show="switchForm" class="form-section form-edit">
      <div class="panel" v-html="panelTitle"/>
      <div class="form-container">
        <el-form ref="limit" :model="limit" label-width="100px">
          <el-form-item label="券批次号">
            <el-input v-model="limit.couponNo" placeholder="券批次号" :disabled="tflag"/>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="limit.type" placeholder="选择类型" @change="mainTypeChange()">
              <el-option label="发放" value="SEND" v-show="flag"/>
              <el-option label="使用" value="USE"/>
            </el-select>
          </el-form-item>
          <el-form-item label="条件类型">
            <el-select v-model="limit.conditionType" placeholder="选择条件类型">
              <el-option label="用户等级条件" value="LEVEL" v-if="limit.type=='SEND'"/>
              <el-option label="黄金" value="AU" v-if="limit.type=='USE'"/>
              <el-option label="白银" value="AG" v-if="limit.type=='USE'"/>
            </el-select>
          </el-form-item>
          <el-form-item label="条件值">
            <el-select v-model="limit.conditionValue" placeholder="请选择等级" v-if="limit.type=='SEND'">
              <el-option
                v-for="item in levelList"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
            <el-select v-else v-model="limit.conditionValue" placeholder="请选择条件值">
              <el-option v-if="limit.conditionType == 'AU'" value="100" >100g</el-option>
							<el-option v-if="limit.conditionType == 'AU'" value="200" >200g</el-option>
							<el-option v-if="limit.conditionType == 'AU'" value="500" >500g</el-option>
							<el-option v-if="limit.conditionType == 'AU'" value="1000" >1000g</el-option>
							<el-option v-if="limit.conditionType == 'AU'" value="3000" >3000g</el-option>
							<el-option v-if="limit.conditionType == 'AU'" value="5000" >5000g</el-option>

							<el-option v-if="limit.conditionType == 'AG'" value="5000" >5000g</el-option>
							<el-option v-if="limit.conditionType == 'AG'" value="10000" >10000g</el-option>
							<el-option v-if="limit.conditionType == 'AG'" value="25000" >25000g</el-option>
							<el-option v-if="limit.conditionType == 'AG'" value="50000" >50000g</el-option>
							<el-option v-if="limit.conditionType == 'AG'" value="150000" >150000g</el-option>
							<el-option v-if="limit.conditionType == 'AG'" value="250000" >250000g</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-select v-model="limit.status" placeholder="请选择...">
              <el-option label="是" value="1"/>
              <el-option label="否" value="0"/>
            </el-select>
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
import { isBlank } from "@/utils";
export default {
  data() {
    return {
      panelTitle: "券限制条件查询",
      tableData: [],
      switchStatus: "", //子组件传给父组件的值
      switchForm: false,
      limit: {},
      selectedList: [],
      tflag: true,
      flag: true, //是否为手动券标识
      levelList: [
        { name: "1级用户", value: "10002" },
        { name: "2级用户", value: "10003" },
        { name: "3级用户", value: "10004" },
        { name: "体验用户", value: "10005" },
        { name: "券用户等级", value: "10006" }
      ],
      multipleSelection:[],
      rowData:{},
      delTip:false,
    };
  },
  filters: {
    rounding(value) {
      return value.toFixed(2);
    },
    typeFilter(value) {
      switch (value) {
        case "SEND":
          return "发放";
        case "USE":
          return "使用";
        default:
          return "-";
      }
    },
    limitFliter(value) {
      switch (value) {
        case "LEVEL":
          return "用户等级条件";
        case "AU":
          return "黄金";
        case "AG":
          return "白银";
        default:
          return "-";
      }
    },
    valueFliter(value) {
      switch (value) {
        case "10001":
          return "普通用户";
        case "10002":
          return "1级用户";
        case "10003":
          return "2级用户";
        case "10004":
          return "3级用户";
        case "10005":
          return "体验用户";
        case "10006":
          return "券用户等级";
        default:
          return "-";
      }
    },
    statusFilter(status) {
      switch (status) {
        case "1":
          return "success";
        default:
          return "danger";
      }
    },
    formatStatus(status) {
      switch (status) {
        case "1":
          return "是";
        default:
          return "否";
      }
    }
  },
  created() {
    this.query();
  },
  computed: {
    couponNo() {
      return this.$store.state.app.couponNo;
    },
    status() {
      return this.$store.state.app.couponStatus;
    },
    sendType() {
      return this.$store.state.app.sendType;
    }
  },
  methods: {
    add() {
      this.switchForm = true;
      this.panelTitle = "新增";
      this.limit.couponNo = this.couponNo;
      if (this.sendType == 2 || this.sendType == 4) this.flag = false; //手动券、实名券 隐藏'发放'选择
      this.limit = {
        type: "",
        conditionType: "",
        status: "1",
        couponNo: this.couponNo,
        conditionValue: ""
      };
    },
    mainTypeChange() {
      this.limit.conditionType = "";
      this.limit.conditionValue = "";
    },
    update(index, row) {
      this.switchForm = true;
      this.panelTitle = "修改";
      this.limit.id = row.id;
      this.getInfo(row.id);
    },
    async getInfo(id) {
      let r = await this._fetch("/couponcondition/info/" + id + "?_=123", {
        method: "GET"
      });
      this.limit = r.couponCondition;
    },
    del() {
      if (this.multipleSelection.length < 1) {
        this.$message("请选择一条记录");
        return;
      }
      this.delTip = true;
    },
    async delConfirm() {
      let r = await this._fetch("/couponcondition/delete", {
        method: "POST",
        body: this.limit.Ids
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.delTip = false;
      } else {
        this.$message(r.msg);
      }
    },
    async query() {
      let queryParams = "&couponNo=" + this.couponNo;
      let r = await this._fetch(
        "/couponcondition/list?limit=10&page=0" + queryParams,
        {
          method: "GET"
        }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
      } else {
        this.$message(r.msg);
      }
    },
    clearHandle() {
      this.q = {
        price: "",
        useStatus: ""
      };
    },
    goback() {
      this.switchStatus = false;
      this.$emit("goback", this.switchStatus);
    },
    onSubmit() {
      if (this.validator()) {
        return;
      }
      var url =
        this.limit.id == null
          ? "/couponcondition/save"
          : "/couponcondition/update";
      this.addLimit(url);
    },
    async addLimit(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.limit
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
      this.limit.id = row.id;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.limit.Ids = [];
      this.multipleSelection.forEach(item => {
        this.limit.Ids.push(item.id);
      });
      this.rowData = this.multipleSelection[0];
      if (this.rowData) {
        this.limit.id = this.rowData.id;
      }
    },
    validator: function() {
      if (isBlank(this.limit.couponNo)) {
        this.$message("券批次号不能为空");
        return true;
      }
      if (isBlank(this.limit.type)) {
        this.$message("类型不能为空");
        return true;
      }
      if (isBlank(this.limit.conditionType)) {
        this.$message("条件类型不能为空");
        return true;
      }

      if (isBlank(this.limit.conditionValue)) {
        this.$message("条件值不能为空");
        return true;
      }

      if (isBlank(this.limit.status)) {
        this.$message("是否启用该限制条件不能为空");
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
.form-section {
  margin: 30px;
  .form-container {
    width: 100%;
    padding-top: 5px;
    .query-box {
      padding-left: 20px;
      border-bottom: 1px solid #ddd;
    }
    .btn-box {
      padding: 10px 0 0 20px;
    }
  }
}
.form-edit {
  .form-container {
    padding-top: 20px;
    width: 80%;
  }
}
</style>
