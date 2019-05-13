<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="title" name="1">
            <div class="query-item">
              <el-form :label-position="labelPosition" :model="q" label-width="80px">
                <el-form-item label="联系电话">
                  <el-input v-model="q.phone" placeholder="请输入联系电话"/>
                </el-form-item>
                <el-form-item label="登录账号">
                  <el-input v-model="q.logincode" placeholder="请输入登录账号"/>
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
        <el-button v-if="hasPermission('userParamChangeRecord:list')" type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button v-if="hasPermission('userParamChangeRecord:download')" type="primary" icon="el-icon-download" @click="download">导出</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="500"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column prop="id" label="编号" align="left"/>
          <el-table-column prop="username" label="客户姓名" align="left"/>
          <el-table-column prop="logincode" label="登录账号" align="left" :show-overflow-tooltip="true"/>
          <el-table-column prop="phone" label="联系电话" align="left"/>
          <el-table-column prop="paramTp" label="止盈比例" align="left"/>
          <el-table-column prop="paramCl" label="止损比例" align="left"/>
          <el-table-column prop="paramTs" label="偏离点位" align="left"/>
          <el-table-column prop="amounts" label="免密金额" align="right"/>
          <el-table-column prop="createTime" label="提交时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.updateTime | formatTime}}</span>
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
  </div>
</template>
<script>
import { FormatAllDate, getTimeByType, formatDate } from "@/utils/timeUtils";
import { formatDateTime,hasPermission } from '@/utils';
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
//获取下一个月的开始时间
export default {
  data() {
    return {
      title: "查询窗口（点击收起）",
      labelPosition: "right",
      q: {
        phone: "",
        logincode: ""
      },
      activeNames: ['1'],
      tableData: [],
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
      queryParams:''
    };
  },
  filters:{
    formatTime(value){
      return formatDateTime(parseInt(value))
    }
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    handleChange() {
      if (this.activeNames.length > 0) {
        this.title = "查询窗口（收起）";
      } else {
        this.title = "查询窗口（点击展开）";
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
      this.value = this.selectTime(this.value);
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      this.queryParams =
        "&phone=" +
        this.q.phone +
        "&logincode=" +
        this.q.logincode +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime;
      let r = await this._fetch(
        "/userParamChangeRecord/list?type=0&limit=50&page=1" + this.queryParams,
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
        phone: "",
        logincode: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + " 23:59:59"
      };
    },
    download() {
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      this.url =
        "/userParamChangeRecord/download?token=" +
        token +
        "&phone=" +
        this.q.phone +
        "&logincode=" +
        this.q.logincode +
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
          var filename = `风险参数修改记录.xls`;
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
      this.page.pageSize = val;
      let r = await this._fetch(
        "/userParamChangeRecord/list?type=0&limit=" +
          val +
          "&page=" +
          this.page.currentPage + this.queryParams,
        { method: "GET" }
      );
      this.tableData = r.page.list;
    },
    async handleCurrentChange(val) {
      this.page.currentPage = val;
      let r = await this._fetch(
        "/userParamChangeRecord/list?type=0&limit=" +
          this.page.pageSize +
          "&page=" +
          val + this.queryParams,
        { method: "GET" }
      );
      this.tableData = r.page.list;
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
</style>

