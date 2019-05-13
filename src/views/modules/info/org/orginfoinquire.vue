<template>
  <div class="wrapper-box">
    <div class="show-box1">
      <div class="panel" v-html="panelTitle"/>
      <div class="tb-box1">
        <div class="query-section">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item :title="title" name="1">
              <div class="query-item1">
                <el-form :model="q" class="demo-form-inline" label-width="100px">
                  <el-form-item label="所属服务商">
                    <el-select v-model="q.dealerCode" placeholder="请选择所属服务商">
                      <el-option label="请选择所属服务商" value></el-option>
                      <el-option
                        v-for="item in serviveList"
                        :label="item.dealerName"
                        :value="item.dealerId"
                        :key="item.dealerId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="机构级别">
                    <el-select v-model="q.level" placeholder="请选择机构级别">
                      <el-option label="请选择机构级别" value></el-option>
                      <el-option
                        v-for="item in organizationLevel"
                        :label="item.name"
                        :value="item.value"
                        :key="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div class="query-item1">
                <el-form :model="q" class="demo-form-inline" label-width="100px">
                  <el-form-item label="所属机构">
                    <el-select v-model="q.orgName" placeholder="请选择所属机构">
                      <el-option label="请选择所属机构" value></el-option>
                      <el-option
                        v-for="item in belongItem"
                        :label="item.dealerName"
                        :value="item.dealerId"
                        :key="item.dealerId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="机构编号">
                    <el-input v-model="q.phone" placeholder="请输入机构编号"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="query-item1">
                <el-form label-position="right" label-width="80px" :model="q">
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
          <el-form>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
              <el-button type="primary" @click="reset">重置</el-button>
              <el-button type="primary" @click="download">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="tb-section">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            :max-height="maxHeight"
            :header-cell-style="rowClass"
          >
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column prop="orgName" label="机构名称"></el-table-column>
            <el-table-column prop="orgCode" label="机构编号"></el-table-column>
            <el-table-column prop="intoTime" label="开通时间"></el-table-column>
            <el-table-column prop="parent.orgCode" label="上级机构"></el-table-column>
            <el-table-column prop="subOrgCount" label="隶属机构数"></el-table-column>
            <el-table-column prop="userCount" label="隶属用户"></el-table-column>
            <el-table-column prop="remark" label="详情"></el-table-column>
            <el-table-column prop label="状态"></el-table-column>
          </el-table>
        </div>
        <div class="block1">
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
    </div>
  </div>
</template>
<script>
import { FormatAllDate, getTimeByType, formatDate } from "@/utils/timeUtils";
var nextM_start = new Date(
  new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth() - 1)
);
export default {
  data() {
    return {
      title: "查询窗口（点击收起）",
      activeNames: ["1"],
      maxHeight: "550",
      switchForm: false,
      panelTitle: "机构信息管理",
      q: {
        orgName: "",
        dealerCode: "",
        phone: "",
        level: ""
      },
      serviveList: [],
      organizationLevel: [
        { value: "1", name: "一级机构" },
        { value: "2", name: "二级机构" },
        { value: "3", name: "三级机构" },
        { value: "4", name: "四级机构" },
        { value: "5", name: "五级机构" }
      ],
      belongItem: [],
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 50,
        total: 0
      },
      queryParams: "",
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
      }
    };
  },
  created() {
    this._getServive();
    this._getBmOrgNum();
  },
  methods: {
    handleChange() {
      if (this.activeNames.length > 0) {
        this.title = "查询窗口（收起）";
        this.maxHeight = "550";
      } else {
        this.title = "查询窗口（点击展开）";
        this.maxHeight = "700";
      }
    },
    async _getServive() {
      let r = await this._fetch("/org/dealer/facilitatorList?limit=10&page=1", {
        method: "GET"
      });
      if (r.code === 0) {
        r.page.list.forEach(v => {
          this.serviceList.push(v.dealerCode);
        });
      }
    },
    async _getBmOrgNum() {
      let r = await this._fetch("/org/bmorganization/orgs?limit=10&page=1", {
        method: "GET"
      });
      if (r.code === 0) {
        r.page.list.forEach(v => {
          this.belongItem.push({
            name: v.orgCode,
            value: v.orgCode
          });
        });
      }
    },
    async query() {
      this.queryParams =
        "&orgName=" +
        this.q.orgName +
        "&dealerCode=" +
        this.q.dealerCode +
        "&level=" +
        this.q.level +
        "&phone=" +
        this.q.phone +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime;
      let r = await this._fetch(
        "/org/bmorganization/orgs/info?limit=50&page=1" + this.queryParams,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.currentPage = r.page.currPage;
      } else {
        this.$message(r.msg);
      }
    },
    reset() {
      this.value = [formatDate(nextM_start), formatDate(new Date())];
      this.q = {
        orgName: "",
        dealerCode: "",
        phone: "",
        level: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + " 23:59:59"
      };
    },
    // download() {
    //   const token = window.localStorage.getItem("token");
    //   this.q.startTime = this.value[0] + " 00:00:00";
    //   this.q.endTime = this.value[1] + " 23:59:59";
    //   this.url =
    //     "/refundapply/download?token=" +
    //     token +
    //     "&startTime=" +
    //     this.q.startTime +
    //     "&endTime=" +
    //     this.q.endTime +
    //     "&page=" +
    //     this.page.currentPage +
    //     "&limit=" +
    //     this.page.pageSize;
    //   fetch(this.baseURL + this.url, {
    //     headers: {
    //       "Content-type": "application/json;charset=UTF-8",
    //       token: token
    //     }
    //   }).then(res =>
    //     res.blob().then(blob => {
    //       var filename = `机构信息管理.xls`;
    //       var a = document.createElement("a");
    //       var url = window.URL.createObjectURL(blob);
    //       a.href = url;
    //       a.download = filename;
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //     })
    //   );
    // },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/org/bmorganization/orgs/info?limit=" +
          val +
          "&page=" +
          this.page.currentPage +
          this.queryParams,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = val;
      } else {
        console.log(r.msg);
      }
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/org/bmorganization/orgs/info?limit=" +
          this.page.pageSize +
          "&page=" +
          val +
          this.queryParams,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.currentPage = val;
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
.wrapper-box {
  padding: 10px 30px;
  .show-box1 {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding-bottom: 15px;
    .panel {
      height: 40px;
      line-height: 40px;
      background-color: #f5f5f5;
      font-size: 14px;
      padding-left: 10px;
      border-bottom: 1px solid #ddd;
    }
    .btn-box {
      padding-top: 15px;
    }
    .tb-box1 {
      padding: 0 20px;
      .query-section {
        padding-top: 15px;
      }
      .tb-section {
        margin-bottom: 15px;
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
    .form-section {
      width: 50%;
      margin: 30px auto;
      border: none;
    }
  }
}
</style>
