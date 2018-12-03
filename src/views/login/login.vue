<template>
  <div class="login-wrapper">
    <div class="login">
      <div class="login-title">
        <h2>管理员登录</h2>
        <!-- <p>SSMall管理后台登录</p> -->
        <!-- <img src="../../assets/images/logo.png"> -->
      </div>
      <div class="login-box">
        <div class="form-item">
          <label for class="login-icon">
            <i class="fa fa-user-circle-o fa-lg"></i>
          </label>
          <input type="text" v-model="formData.user" placeholder="用户名">
        </div>
        <div class="form-item">
          <label for class="login-icon">
            <i class="fa fa-lock fa-lg"></i>
          </label>
          <input type="password" v-model="formData.password" placeholder="密码">
        </div>
        <div class="form-item captcha-box">
          <label for class="login-icon">
            <i class="fa fa-shield fa-lg"></i>
          </label>
          <input type="password" v-model="formData.captcha" placeholder="验证码">
          <img alt="点击刷新" :src="src" @click="refreshCode" class="refresh">
        </div>
        <div class="form-item">
          <Button type="primary" @click="handleSubmit">立即登录</Button>
        </div>
      </div>
    </div>
    <footer>©Copyright Power By SSMALL All Rights Reserved.</footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "admin",
        password: "",
        captcha: ""
      },
      src: ""
    };
  },
  methods: {
    refreshCode() {
    //   this.src = "/admin/captcha.jpg?t=" + new Date();
    },
    handleSubmit() {
      this.$store
        .dispatch("LoginByUsername", this.formData)
        .then(() => {
          this.$router.push({ path: this.redirect || "/" });
        })
        .catch(() => {

        });
    //   fetch(baseURL + "sys/login", {
    //     method: "POST",
    //     credentials: "include",
    //     headers: new Headers({
    //       "Content-Type": "application/x-www-form-urlencoded" // 指定提交方式为表单提交
    //     }),
    //     body: new URLSearchParams([
    //       ["username", this.formData.user],
    //       ["password", this.formData.password],
    //       ["captcha", this.formData.captcha]
    //     ]).toString()
    //   })
    //     .then(res => {
    //       return res.text();
    //     })
    //     .then(res => {
    //       console.log(res);
    //       var r = JSON.parse(res);
    //       if (r.code == 0) {
    //         localStorage.setItem("token", r.token);
    //         localStorage.setItem("adminEd", r.adminEd);
    //         this.$router.push({
    //           name: "home"
    //         });
    //       } else {
    //         this.$Message.error(r.msg);
    //         this.refreshCode();
    //       }
    //     });
    }
  },
  created() {
    // this.getCaptchaCode();
  }
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/login_bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
}
.login {
  width: 400px;
  margin: 0 auto;
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  text-align: center;
  position: relative;
  height: 375px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  /*设置padding-bottom值大于等于footer的height值，以保证main的内容能够全部显示出来而不被footer遮盖；*/
  padding-bottom: 100px;
  box-sizing: border-box;
  .login-title {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #fff;
    // img{
    //   display:block;
    //   width:80px;
    //   height: 80px;
    //   border-radius:50%;
    //   margin:0 auto;
    // }
    h2 {
      font-size: 20px;
      font-weight: 300;
      color: #fff;
    }
    // p {
    //   font-size: 16px;
    //   font-weight: 300;
    //   color: #999;
    // }
  }

  .login-box {
    padding: 30px 40px 20px;
    .form-item {
      margin-bottom: 20px;
      position: relative;
      border-radius: 4px;
      .login-icon {
        position: absolute;
        width: 38px;
        line-height: 38px;
        text-align: center;
        color: #d2d2d2;
        background: rgba(45, 140, 240, 0.7);
      }
      input {
        padding-left: 45px;
        width: 100%;
        height: 38px;
        font-size: 14px;
        border: 1px solid #e6e6e6;
        background-color: #fff;
        border-radius: 2px;
      }
      button {
        width: 100%;
        height: 38px;
        font-size: 14px;
        color: #fff;
        background: #2d8cf0;
        margin-top: 10px;
      }
    }
    .captcha-box {
      border: 1px solid #e6d9d9;
      background: #fff;
      height: 50px;
      line-height: 50px;
      height: 50px;
      position: relative;
      .login-icon {
        line-height: 50px;
        position: absolute;
        top: -1px;
        left: -1px;
      }
      input {
        width: 159px;
        height: 48px;
        line-height: 46px;
        border: none;
        position: absolute;
        left: 45px;
        padding-left: 0;
      }
      .refresh {
        position: absolute;
        right: 0;
        width: 138px;
        color: #888;
        height: 48px;
        border-left: 1px solid #e6d9d9;
        text-align: center;
      }
    }
  }
}
footer {
  height: 50px; /* footer的高度一定要是固定值*/
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
}
</style>
