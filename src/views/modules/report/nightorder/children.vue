<template>
  <div class="show-box1">
    <div class="query-box1">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item :title="title" name="1">
          <div class="query-item1">
            <el-form label-width="80px" label-position="right">
              <el-form-item label="年周数">
                <el-input v-model.trim="q.weeks" placeholder="请输入查询年周数" @blur="weekSelected"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="query-item2">
            <el-form label-width="100px" label-position="right">
              <el-form-item label="日期查询">
                <el-date-picker
                  v-model="value"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @blur="dateSelected"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="query-item1">
            <el-form label-width="30px" label-position="right">
              <el-form-item>
                <el-checkbox v-model="checked"></el-checkbox>
                <span class="check-label">服务商分组</span>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="query-box2">
      <el-button v-if="hasPermission('nightOrder:list')" type="info" @click="query">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button v-if="hasPermission('nightOrder:download')" type="primary" @click="download">导出</el-button>
    </div>
    <div class="tb-box1">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="500"
        :header-cell-style="rowClass"
      >
        <el-table-column type="index" width="40"/>
        <el-table-column prop="weeks" label="年周数" align="center" width="250"></el-table-column>
        <el-table-column prop="serviceNum" label="服务商编号" align="left" width="300"></el-table-column>
        <el-table-column prop="dim" label="数值" align="right" width="250">
          <template slot-scope="scope">
            <span>{{scope.row.dim | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="beginDate" label="开始日期" align="center"></el-table-column>
        <el-table-column prop="endDate" label="结束日期" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { isBlank, hasPermission } from "@/utils";
import { FormatAllDate, getTimeByType, formatDate } from "@/utils/timeUtils";
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      activeNames: ["1"],
      title: "查询窗口（点击收起）",
      q: {
        weeks: "",
        orderFlag: ""
      },
      checked:false,
      tableData: [],
      page: {
        total: 0,
        pageSize: 50,
        currentPage: 1
      },
      queryParams: "",
      value: [formatDate(nextM_start), formatDate(new Date())],
      pickerOptions: {
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
          }
        ]
      }
    };
  },
  filters: {
    rounding(value) {
      if (value) {
        return value.toFixed(3);
      } else {
        return "0.000";
      }
    }
  },
  created() {},
  methods: {
    hasPermission(val) {
      return hasPermission(val);
    },
    handleChange() {
      if (this.activeNames.length > 0) {
        this.title = "查询窗口（收起）";
        this.maxHeight = "550";
      } else {
        this.title = "查询窗口（点击展开）";
        this.maxHeight = "700";
      }
    },
    weekSelected() {
      if (this.q.weeks) {
        this.value = [];
      }
    },
    dateSelected() {
      if (this.value) {
        this.q.weeks = "";
      }
    },
    selectTime(value) {
      //解决快捷选择与手动选择方法的冲突
      let newValue = value.map(item => {
        if (typeof item != "string") {
          return (item = formatDate(item));
        } else {
          return item;
        }
      });
      return newValue;
    },
    async query() {
      if (this.q.weeks) {
        this.q.startTime = "";
        this.q.endTime = "";
      } else {
        this.value = this.selectTime(this.value);
        this.q.startTime = this.value[0];
        this.q.endTime = this.value[1];
      }
      //   if (this.validator()) {
      //     this.$message("查询不能超过60天");
      //     return;
      //   }
      this.queryParams =
        "&orderFlag=" +
        this.checked.toString() +
        "&weeks=" +
        this.q.weeks +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime;
      let queryData = {
        startTime: this.q.startTime,
        endTime: this.q.endTime,
        weeks: this.q.weeks,
        orderFlag: this.checked.toString(),
        page: this.page.currentPage,
        limit: this.page.pageSize
      };
      let r = await this._fetch("/nightOrder/list", {
        method: "POST",
        body: queryData
      });
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
        orderFlag: "",
        weeks: "",
        startTime: this.value[0],
        endTime: this.value[1]
      };
    },
    download() {
      const token = window.localStorage.getItem("token");
      let url =
        "/nightOrder/download?token=" +
        token +
        this.queryParams +
        "&page=" +
        this.page.currentPage +
        "&limit=" +
        this.page.pageSize;
      fetch(this.baseURL + url, {
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          token: token
        }
      }).then(res =>
        res.blob().then(blob => {
          var filename = `过夜单统计查询.xls`;
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/sysUser/list?limit=" +
          val +
          "&page=" +
          this.page.currentPage +
          this.queryParams,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
      } else {
        console.log(r.msg);
      }
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/sysUser/list?limit=" +
          this.page.pageSize +
          "&page=" +
          val +
          this.queryParams,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
      } else {
        console.log(r.msg);
      }
    },
    rowClass() {
      return "text-align:center";
    }
  }
};
</script>

<style lang="scss" scoped>
.show-box1 {
  padding-left: 30px;
  .query-box1 {
    border-bottom: 1px solid #ddd;
    border-top: none;
  }
  .query-box2 {
    padding: 15px 0;
  }
}
.el-collapse {
  border: none;
}
.query-item1 {
  width: 16.667%;
}
.check-label {
  padding-left:5px;
  font-weight: bold;
  color: #606266;
  font-size: 14px;
}
</style>

