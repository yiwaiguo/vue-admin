<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar @settTraPwd="settTraPwd" @updatePassword="updatePassword"/>
      <tags-view/>
      <app-main/>
    </div>

    <el-dialog title="审批密码设置" :visible.sync="dialogFormVisible" width="30%" top="30vh">
      <el-form :model="p">
        <el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input
            v-model="p.traPwd"
            placeholder="请输入原密码"
            onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input
            v-model="p.newTraPwd"
            placeholder="请输入6-20位密码"
            onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth">
          <el-input v-model="p.smsCode" placeholder="请输入短信验证码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提 交</el-button>
        <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendCode">发送验证码</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="20%" top="30vh">
      <span>确定提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="dialogUodatePsw" width="30%" top="30vh">
      <el-form :model="p">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-tag>{{role}}</el-tag>
        </el-form-item>
        <el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input v-model="password" placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="newPassword" placeholder="新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePsw">修改</el-button>
        <el-button type="info" @click="dialogUodatePsw = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapMutations } from "vuex";
import { isBlank } from "@/utils";
var role = localStorage.getItem("role");
export default {
  name: "Layout",
  data() {
    return {
      dialogFormVisible: false,
      p: {},
      formLabelWidth: "80px",
      tflag: false, //有无审批密码标识
      user: {},
      dialogVisible: false,
      dialogUodatePsw: false,
      password: "",
      newPassword: "",
      role:role
    };
  },
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    },
  },
  mounted() {
    this.getMenuList();
    this.getPerms();
  },
  methods: {
    ...mapMutations(["SET_ROUTERS"]),
    handleClickOutside() {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    },
    async getMenuList() {
      let r = await this._fetch("/sys/menu/nav", { method: "GET" });
      if(r.code === 0){
        let menuList = r.data.router;
        this.SET_ROUTERS(menuList);
      }else{
        let menuList = [];
        this.SET_ROUTERS(menuList);
      }
    },
    async getPerms() {
      let r = await this._fetch("/sys/menu/perms", { method: "GET" });
      if(r.code === 0){
        localStorage.setItem("permissions", r.permissions);
      }else{
        console.log(r.msg)
      }
    },
    submit() {
      if (this.tflag) {
        if (isBlank(this.p.traPwd)) {
          this.$message("原密码不能为空");
          return;
        }
        if (isBlank(this.p.newTraPwd)) {
          this.$message("新密码不能为空");
          return;
        }
      } else {
        if (isBlank(this.p.newTraPwd)) {
          this.$message("密码不能为空");
          return;
        }
      }

      if (!(this.p.newTraPwd.length > 5 && this.p.newTraPwd.length < 21)) {
        this.$message("请输入6-20位密码");
        return;
      }

      if (isBlank(this.p.smsCode)) {
        this.$message("验证码不能为空");
        return;
      }
      this.dialogVisible = true;
    },
    async submitConfirm() {
      let r = await this._fetch("/sys/user/sendOrAckSms", {
        method: "POST",
        body: this.p
      });
      if (r.code === 0) {
        this.$message("操作成功");
      } else {
        this.$message(r.msg);
      }
      this.dialogVisible = false;
      this.dialogFormVisible = false;
    },
    async sendCode() {
      let r = await this._fetch("/sys/user/sendOrAckSms", {
        method: "POST",
        body: this.p
      });
      if (r.code === 0) {
        this.$message("验证码发送成功");
      } else {
        this.$message(r.msg);
      }
    },
    async settTraPwd() {
      let r = await this._fetch("/sys/user/info", { method: "GET" });
      this.user = r.user === undefined ? {} : r.user;

      if (isBlank(this.user.traPwd)) {
        //无审批密码，添加
        this.tflag = false;
      } else {
        //有审批密码，修改
        this.tflag = true;
      }
      // if (isBlank(this.user.mobile)) {
      //   this.$message("该用户还未绑定手机号");
      //   return;
      // }
      this.p.smsCode = "";
      this.p.traPwd = "";
      this.p.newTraPwd = "";
      this.dialogFormVisible = true;
    },
    updatePassword() {
      this.password = "";
      this.newPassword = "";
      this.dialogUodatePsw = true;
    },
    async updatePsw() {
      let data = { password: this.password, newPassword: this.newPassword };
      let r = await this._fetch("/sys/user/password", {
        method: "POST",
        body: data
      });
      if (r.code === 0) {
        this.$message("修改成功");
      } else {
        this.$message(r.msg);
      }
      this.dialogUodatePsw = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.el-form {
  width: 85%;
  margin: 0 auto;
}
</style>
