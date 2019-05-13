<template>
  <div class="page-container">
    <div class="show-box" v-show="!switchForm">
      <div class="query-box">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="title" name="1">
            <div class="query-item">
              <el-form :label-position="labelPosition" :model="q" label-width="80px">
                <el-form-item label="机构名称">
                  <el-input v-model.trim="q.orgName" placeholder="请输入机构名称"/>
                </el-form-item>
                <el-form-item label="机构编码">
                  <el-input v-model.trim="q.orgCode" placeholder="请输入机构编码"/>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="80px" :model="q">
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
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" icon="el-icon-download" @click="download">导出</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="500"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column type="index" width="50" align="center"/>
          <el-table-column prop="orgCode" label="机构编号" align="left"/>
          <el-table-column prop="orgName" label="机构名称" align="left"/>
          <el-table-column prop="total" :label="'收入'+keyword+'总额'" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.total | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consume" :label="'支出'+keyword+'总额'" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.consume | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invalid" :label="'失效'+keyword+'总额'" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.invalid | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="usable" :label="'当前可用'+keyword+'总额'" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.usable | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="morrow" :label="'15日内即将过期'+keyword" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.morrow | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="forDetails(scope.$index, scope.row)"
              >日结明细</el-button>
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
    <div v-if="showDetails" class="child-page">
      <orgdetail @goback="goback(value)" :queryTime="value" :id="detailId"></orgdetail>
    </div>
  </div>
</template>
<script>
import { FormatAllDate, getTimeByType, formatDate } from "@/utils/timeUtils";
import { formatDateTime } from "@/utils";
import orgdetail from "./children/orgdetail";

const keyword = window.localStorage.getItem("keyword");
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      title: "查询窗口（点击收起）",
      labelPosition: "right",
      switchForm: false,
      keyword: keyword,
      q: {
        orgName: "",
        orgCode: "",
        startTime: "",
        endTime: ""
      },
      activeNames: ['1'],
      tableData: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      value: [formatDate(new Date()),formatDate(new Date())],
      pickerOptions2: {
        disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
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
          }
        ]
      },
      showDetails: false,
      detailId: ""
    };
  },
  components: {
    orgdetail
  },
  filters: {
    rounding(value) {
      if (value) {
        return value.toFixed(2);
      } else {
        return "0.00";
      }
    }
  },
  methods: {
    handleChange() {
      if (this.activeNames.length > 0) {
        this.title = "查询窗口（收起）";
      } else {
        this.title = "查询窗口（点击展开）";
      }
    },
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
      this.q.endTime = this.value[1] + ' 23:59:59';
      let queryParams =
        "&orgName=" +
        this.q.orgName +
        "&orgCode=" +
        this.q.orgCode +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime;
      let r = await this._fetch(
        "/hxbounty/orgCount?limit=50&page=1" + queryParams,
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
      this.value = [formatDate(nextM_start),formatDate(new Date())];
      this.q = {
        orgName: "",
        orgCode: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + " 23:59:59"
      };
    },
    download() {
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      this.url =
        "/hxbounty/download?type=org&token=" +
        token +
        "&orgName=" +
        this.q.orgName +
        "&orgCode=" +
        this.q.orgCode +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime +
        "&page=" +
        this.page.currentPage +
        "&limit=" +
        this.page.pageSize;
      fetch(this.baseURL + this.url, {
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          token: token
        }
      }).then(res =>
        res.blob().then(blob => {
          var filename = `机构${keyword}管理.xls`;
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0)
            .toFixed(2);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    forDetails(index, row) {
      this.switchForm = true;
      this.showDetails = true;
      this.detailId = row.orgId;
    },
    goback() {
      this.showDetails = false;
      this.switchForm = false;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/hxbounty/orgCount?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/hxbounty/dealerCount?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    rowClass() {
      return "text-align:center";
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-box {
  padding-top: 15px;
}
.page-container {
  position: relative;
}
.child-page {
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>

