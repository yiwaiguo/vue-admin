<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="title" name="1">
            <div class="query-item">
              <el-form :label-position="labelPosition" :model="q" label-width="80px">
                <el-form-item label="登录账号">
                  <el-input v-model="q.loginCode" placeholder="请输入登录账号"/>
                </el-form-item>
                <el-form-item label="源机构">
                  <el-input v-model="q.srcOrgCode" placeholder="请输入源机构编号"/>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" :model="q" label-width="80px">
                <el-form-item label="处理结果">
                  <el-select v-model="q.status" placeholder="请选择状态">
                    <el-option
                      v-for="item in statusList"
                      :label="item.name"
                      :value="item.value"
                      :key="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="目标机构">
                  <el-input v-model="q.tarOrgCode" placeholder="请输入目标机构编号"/>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="80px" :model="q">
                <el-form-item label="提交日期">
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
        <el-button v-if="hasPermission('shiftorgrecord:list')" type="primary" @click="query">查询</el-button>
        <el-button v-if="hasPermission('shiftorgrecord:list')" type="primary" @click="reset">重置</el-button>
        <el-button v-if="hasPermission('shiftorgrecord:downRecord')" type="primary" icon="el-icon-download" @click="download">导出</el-button>
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
          <el-table-column prop="id" label="编号" align="left" width="100"/>
          <el-table-column
            prop="loginCode"
            label="登录账号"
            align="left"
            width="250"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="userName" label="用户姓名" align="left"/>
          <el-table-column prop="srcOrgCode" label="源机构编号" align="left"/>
          <el-table-column prop="tarOrgCode" label="目标机构编号" align="left"/>
          <el-table-column prop="createTime" label="提交时间" align="center"/>
          <el-table-column prop="shiftTime" label="处理时间" align="center"/>
          <el-table-column prop="status" label="处理状态" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" align="left"/>
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
import { hasPermission } from "@/utils";
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      title: "查询窗口（点击收起）",
      labelPosition: "right",
      q: {
        loginCode: "",
        srcOrgCode: "",
        status: "",
        tarOrgCode: "",
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
      statusList: [
        { name: "成功", value: "1" },
        { name: "待处理", value: "0" },
        { name: "失败", value: "-1" },
        { name: "处理中", value: "2" }
      ]
    };
  },
  filters: {
    statusFilter(value) {
      switch (value) {
        case -1:
          return "danger";
        case 0:
          return "primary";
        case 1:
          return "success";
        case 2:
          return "warning";
        default:
          return "";
      }
    },
    formatStatus(value) {
      switch (value) {
        case -1:
          return "失败";
        case 0:
          return "待处理";
        case 1:
          return "成功";
        case 2:
          return "处理中";
        default:
          return "";
      }
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
      let queryParams =
        "&srcOrgCode=" +
        this.q.srcOrgCode +
        "&loginCode=" +
        this.q.loginCode +
        "&status=" +
        this.q.status +
        "&tarOrgCode=" +
        this.q.tarOrgCode +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime;
      let r = await this._fetch(
        "/org/shiftOrg/list?type=0&limit=50&page=1" + queryParams,
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
        loginCode: "",
        srcOrgCode: "",
        status: "",
        tarOrgCode: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + " 23:59:59"
      };
    },
    download() {
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      this.url =
        "/org/shiftOrg/downRecord?token=" +
        token +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime +
        "&status=" +
        this.q.status;
      fetch(this.baseURL + this.url, {
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          token: token
        }
      }).then(res =>
        res.blob().then(blob => {
          var filename = `转移机构查询.xls`;
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
        "/org/shiftOrg/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/org/shiftOrg/list?limit=" + this.page.pageSize + "&page=" + val,
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
</style>

