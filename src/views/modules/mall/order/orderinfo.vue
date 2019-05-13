<template>
  <div class="page-container">
    <div class="show-box" v-show="!switchForm">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input v-model="q.orderCode" placeholder="请输入订单号"/>
          </el-form-item>
          <el-form-item label="日期查询">
            <el-date-picker
              v-model="value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="700"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column prop="userName" label="用户姓名" width="180" align="left"/>
          <el-table-column prop="orderCode" label="预订单号" align="left" width="200"/>
          <el-table-column prop="symbolName" label="产品类型" width="180" align="left"/>
          <el-table-column prop="marginUsed" label="预付款金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.marginUsed | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="priceOpen" label="预订单价" align="right"/>
          <el-table-column prop="quantityHold" label="商品数量" align="left"/>
          <el-table-column prop="contractSize" label="商品规格" align="left"/>
          <el-table-column prop="bsCode" label="下单类型" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.bsCode | codeFilter">{{scope.row.bsCode | formatCode}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="openDate"
            label="下单时间"
            align="center"
            width="180"
            :formatter="formatDate"
          />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleDetails(scope.$index, scope.row)"
              >详情</el-button>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <div v-show="switchForm" class="form-section">
      <div class="panel">
        <span>{{panelTitle}}</span>
        <el-button type="warning" @click="reback" size="small">返回</el-button>
      </div>
      <div class="form-container">
        <el-form label-position="right" label-width="120px" :model="d">
          <el-form-item label="用户姓名">
            <el-input v-model="d.userName" disabled></el-input>
          </el-form-item>
          <el-form-item label="预付款金额">
            <el-input v-model="d.marginUsed" disabled></el-input>
          </el-form-item>
          <el-form-item label="预订单价">
            <el-input v-model="d.priceOpen" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="d.quantityHold" disabled></el-input>
          </el-form-item>
          <el-form-item label="预订单号">
            <el-input v-model="d.orderCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品规格">
            <el-input v-model="d.contractSize" disabled></el-input>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-input v-model="d.openDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-input v-model="d.bsCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="退订单号">
            <el-input v-model="d.orderCodeRe" disabled></el-input>
          </el-form-item>
          <el-form-item label="退订时间">
            <el-input v-model="d.closeDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="退订单价">
            <el-input v-model="d.priceClose" disabled></el-input>
          </el-form-item>
          <el-form-item label="退订货值增减">
            <el-input v-model="d.profitClose" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属服务商编号">
            <el-input v-model="d.dealerCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属机构">
            <el-input v-model="d.orgName" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  FormatAllDate,
  getTimeByType,
  formatDateT,
  formatDate
} from "@/utils/timeUtils";
import { formatDateTime } from "@/utils";
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      q: {
        orderCode: "",
        timeType: ""
      },
      d: {},
      queryParams: "",
      tableData: [],
      showDetail: false,
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      value: [formatDate(nextM_start), formatDate(new Date())],
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        },
        shortcuts: [
          {
            text: "当日",
            onClick(picker) {
              const end = getTimeByType("CURRENTDAY").endTime;
              const start = getTimeByType("CURRENTDAY").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上日",
            onClick(picker) {
              const end = getTimeByType("YESTERODAY").endTime;
              const start = getTimeByType("YESTERODAY").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本周",
            onClick(picker) {
              const end = getTimeByType("CURRENTWEEK").endTime;
              const start = getTimeByType("CURRENTWEEK").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上周",
            onClick(picker) {
              const end = getTimeByType("PREWEEK").endTime;
              const start = getTimeByType("PREWEEK").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              const monthStart = new Date(
                start.getFullYear(),
                start.getMonth(),
                1
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [formatDate(monthStart), formatDate(end)]);
            }
          },
          {
            text: "上月",
            onClick(picker) {
              const start = new Date();
              const monthStart = new Date(
                start.getFullYear(),
                start.getMonth(),
                1
              );
              const preMS = new Date(
                start.getFullYear(),
                start.getMonth() - 1,
                1
              );
              const preME = new Date(
                monthStart.getTime() - 60 * 60 * 24 * 1000
              );
              picker.$emit("pick", [formatDate(preMS), formatDate(preME)]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [formatDate(start), formatDate(end)]);
            }
          }
        ]
      },
      switchForm: false,
      panelTitle: "详情信息"
    };
  },
  filters: {
    rounding(value) {
      if (value) {
        return value.toFixed(2);
      } else {
        return "0.00";
      }
    },
    codeFilter(status) {
      const statusMap = {
        b: "success",
        s: "primary"
      };
      return statusMap[status];
    },
    formatCode(status) {
      const statusMap = {
        b: "预定",
        s: "回购"
      };
      return statusMap[status];
    }
  },
  created() {
    this.query();
  },
  methods: {
    selectTime(value){//解决快捷选择与手动选择方法的冲突
      let newValue = value.map(item => {
        if(typeof(item) != 'string'){
          return item = formatDate(item);
        }else{
          return item
        }
      });
      return newValue
    },
    async query() {
      this.value = this.selectTime(this.value);
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      this.queryParams =
        "&orderCode=" +
        this.q.orderCode +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime +
        "&timeType=" +
        this.q.timeType;
      let r = await this._fetch(
        "/dataMonitor/bmTradeHoldBill/list?type=0&limit=50&page=1" +
          this.queryParams,
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
      this.value = [formatDate(nextM_start), formatDate(new Date())];
      this.q = {
        orderCode: "",
        userName: "",
        status: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + " 23:59:59",
        timeType: ""
      };
    },
    handleDetails(index, row) {
      this.switchForm = true;
      let id = row.id;
      this.getInfo(id);
    },
    async getInfo(id) {
      let r = await this._fetch(
        "/dataMonitor/bmTradeHoldBill/info/" + id + "?_=123",
        { method: "GET" }
      );
      if (r.code != 0) {
        this.$message(r.msg);
        return;
      }
      this.d = r.bmTradeHoldBill;
      if (this.d.bsCode == "b") {
        this.d.bsCode = "预定";
      } else if (this.d.bsCode == "s") {
        this.d.bsCode = "回购";
      } else {
        this.d.bsCode = "";
      }
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/dataMonitor/bmTradeHoldBill/list?limit=" +
          val +
          "&page=" +
          this.page.currentPage +
          this.queryParams,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/dataMonitor/bmTradeHoldBill/list?limit=" +
          this.page.pageSize +
          "&page=" +
          val +
          this.queryParams,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    reback() {
      this.switchForm = false;
    },
    formatDate(val) {
      return formatDateT(val.openDate);
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
.query-box {
  .el-form-item {
    margin-bottom: 0;
  }
}
form {
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}
.btn-box {
  padding-top: 15px;
}
.form-container {
  width: 100%;
  form {
    border: none;
    padding-left: 40px;
    overflow: auto;
    .el-form-item.el-form-item--medium {
      padding-right: 40px;
      width: 50%;
      float: left;
    }
  }
}
.panel {
  position: relative;
  .el-button {
    position: absolute;
    right: 40px;
    top: 3px;
  }
}
</style>
