(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-c9cf"],{RJRc:function(e,t,a){"use strict";a.r(t);var n=a("14Xm"),r=a.n(n),i=a("D3Ub"),l=a.n(i),o=a("mav0"),s=a("7Qib"),c=new Date(new Date((new Date).toLocaleDateString()).setMonth((new Date).getMonth()-1)),u={data:function(){return{title:"查询窗口（点击收起）",labelPosition:"right",q:{phone:"",logincode:""},activeNames:["1"],tableData:[],page:{pageSize:50,total:0,currentPage:1},value:[Object(o.b)(c),Object(o.b)(new Date)],pickerOptions2:{disabledDate:function(e){return e.getTime()>Date.now()-864e4},shortcuts:[{text:"当日",onClick:function(e){var t=Object(o.d)("CURRENTDAY").endTime,a=Object(o.d)("CURRENTDAY").startTime;e.$emit("pick",[a,t])}},{text:"上日",onClick:function(e){var t=Object(o.d)("YESTERODAY").endTime,a=Object(o.d)("YESTERODAY").startTime;e.$emit("pick",[a,t])}},{text:"本周",onClick:function(e){var t=Object(o.d)("CURRENTWEEK").endTime,a=Object(o.d)("CURRENTWEEK").startTime;e.$emit("pick",[a,t])}},{text:"上周",onClick:function(e){var t=Object(o.d)("PREWEEK").endTime,a=Object(o.d)("PREWEEK").startTime;e.$emit("pick",[a,t])}},{text:"本月",onClick:function(e){var t=new Date,a=new Date,n=new Date(a.getFullYear(),a.getMonth(),1);a.setTime(a.getTime()-2592e6),e.$emit("pick",[Object(o.b)(n),Object(o.b)(t)])}},{text:"上月",onClick:function(e){var t=new Date,a=new Date(t.getFullYear(),t.getMonth(),1),n=new Date(t.getFullYear(),t.getMonth()-1,1),r=new Date(a.getTime()-864e5);e.$emit("pick",[Object(o.b)(n),Object(o.b)(r)])}},{text:"最近三个月",onClick:function(e){var t=new Date,a=new Date;a.setTime(a.getTime()-7776e6),e.$emit("pick",[Object(o.b)(a),Object(o.b)(t)])}}]},queryParams:""}},filters:{formatTime:function(e){return Object(s.c)(parseInt(e))}},methods:{hasPermission:function(e){return Object(s.f)(e)},handleChange:function(){this.activeNames.length>0?this.title="查询窗口（收起）":this.title="查询窗口（点击展开）"},selectTime:function(e){return e.map(function(e){return"string"!=typeof e?Object(o.b)(e):e})},query:function(){var e=this;return l()(r.a.mark(function t(){var a;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.value=e.selectTime(e.value),e.q.startTime=e.value[0]+" 00:00:00",e.q.endTime=e.value[1]+" 23:59:59",e.queryParams="&phone="+e.q.phone+"&logincode="+e.q.logincode+"&startTime="+e.q.startTime+"&endTime="+e.q.endTime,t.next=6,e._fetch("/userParamChangeRecord/list?type=0&limit=50&page=1"+e.queryParams,{method:"GET"});case 6:0===(a=t.sent).code?(e.tableData=a.page.list,e.page.total=a.page.totalCount,e.page.pageSize=a.page.pageSize):e.$message(a.msg);case 8:case"end":return t.stop()}},t,e)}))()},reset:function(){this.value=[Object(o.b)(c),Object(o.b)(new Date)],this.q={phone:"",logincode:"",startTime:this.value[0]+" 00:00:00",endTime:this.value[1]+" 23:59:59"}},download:function(){var e=window.localStorage.getItem("token");this.q.startTime=this.value[0]+" 00:00:00",this.q.endTime=this.value[1]+" 23:59:59",this.url="/userParamChangeRecord/download?token="+e+"&phone="+this.q.phone+"&logincode="+this.q.logincode+"&startTime="+this.q.startTime+"&endTime="+this.q.endTime+"&page="+this.page.currentPage+"&limit="+this.page.pageSize,fetch(this.baseURL+this.url,{headers:{"Content-type":"application/json;charset=UTF-8",token:e}}).then(function(e){return e.blob().then(function(e){var t=document.createElement("a"),a=window.URL.createObjectURL(e);t.href=a,t.download="风险参数修改记录.xls",t.click(),window.URL.revokeObjectURL(a)})})},handleSizeChange:function(e){var t=this;return l()(r.a.mark(function a(){var n;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return t.page.pageSize=e,a.next=3,t._fetch("/userParamChangeRecord/list?type=0&limit="+e+"&page="+t.page.currentPage+t.queryParams,{method:"GET"});case 3:n=a.sent,t.tableData=n.page.list;case 5:case"end":return a.stop()}},a,t)}))()},handleCurrentChange:function(e){var t=this;return l()(r.a.mark(function a(){var n;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return t.page.currentPage=e,a.next=3,t._fetch("/userParamChangeRecord/list?type=0&limit="+t.page.pageSize+"&page="+e+t.queryParams,{method:"GET"});case 3:n=a.sent,t.tableData=n.page.list;case 5:case"end":return a.stop()}},a,t)}))()},rowClass:function(){return"text-align:center"}}},p=(a("bsJ0"),a("KHd+")),m=Object(p.a)(u,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"page-container"},[a("div",{staticClass:"show-box"},[a("div",{staticClass:"query-box"},[a("el-collapse",{on:{change:e.handleChange},model:{value:e.activeNames,callback:function(t){e.activeNames=t},expression:"activeNames"}},[a("el-collapse-item",{attrs:{title:e.title,name:"1"}},[a("div",{staticClass:"query-item"},[a("el-form",{attrs:{"label-position":e.labelPosition,model:e.q,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"联系电话"}},[a("el-input",{attrs:{placeholder:"请输入联系电话"},model:{value:e.q.phone,callback:function(t){e.$set(e.q,"phone",t)},expression:"q.phone"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"登录账号"}},[a("el-input",{attrs:{placeholder:"请输入登录账号"},model:{value:e.q.logincode,callback:function(t){e.$set(e.q,"logincode",t)},expression:"q.logincode"}})],1)],1)],1),e._v(" "),a("div",{staticClass:"query-item"},[a("el-form",{attrs:{"label-position":e.labelPosition,"label-width":"80px",model:e.q}},[a("el-form-item",{attrs:{label:"日期查询"}},[a("el-date-picker",{attrs:{type:"daterange",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":e.pickerOptions2},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)],1)],1)])],1)],1),e._v(" "),a("div",{staticClass:"btn-box"},[e.hasPermission("userParamChangeRecord:list")?a("el-button",{attrs:{type:"primary"},on:{click:e.query}},[e._v("查询")]):e._e(),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.reset}},[e._v("重置")]),e._v(" "),e.hasPermission("userParamChangeRecord:download")?a("el-button",{attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.download}},[e._v("导出")]):e._e()],1),e._v(" "),a("div",{staticClass:"tb-box"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"header-cell-style":e.rowClass,border:"","max-height":"500"}},[a("el-table-column",{attrs:{type:"index",width:"40",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"id",label:"编号",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"username",label:"客户姓名",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"logincode",label:"登录账号",align:"left","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"phone",label:"联系电话",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"paramTp",label:"止盈比例",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"paramCl",label:"止损比例",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"paramTs",label:"偏离点位",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"amounts",label:"免密金额",align:"right"}}),e._v(" "),a("el-table-column",{attrs:{prop:"createTime",label:"提交时间",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("formatTime")(t.row.createTime)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"updateTime",label:"修改时间",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("formatTime")(t.row.updateTime)))])]}}])})],1)],1),e._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{attrs:{"current-page":e.page.currentPage,"page-sizes":[10,30,50],"page-size":e.page.pageSize,total:e.page.total,layout:"total, sizes, prev, pager, next, jumper",background:""},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)])])},[],!1,null,"2db7f252",null);m.options.__file="index.vue";t.default=m.exports},bsJ0:function(e,t,a){"use strict";var n=a("vrrx");a.n(n).a},mav0:function(e,t,a){"use strict";a.d(t,"b",function(){return p}),a.d(t,"d",function(){return D}),a.d(t,"a",function(){return k}),a.d(t,"c",function(){return C}),a.d(t,"e",function(){return _});var n=new Date,r=0===n.getDay()?6:n.getDay()-1,i=n.getDate(),l=n.getMonth(),o=n.getYear();o+=o<2e3?1900:0;var s=new Date;s.setDate(1),s.setMonth(s.getMonth()-1);var c=s.getYear();c+=c<2e3?1900:0;var u=s.getMonth();function p(e){var t=e.getFullYear(),a=e.getMonth()+1,n=e.getDate();return a<10&&(a="0"+a),n<10&&(n="0"+n),t+"-"+a+"-"+n}function m(e){var t=new Date(o,e,1);return(new Date(o,e+1,1)-t)/864e5}var g=p(g=new Date(o,l,i)),d=p(d=new Date(o,l,i-1)),h=p(h=new Date(o,l,i-r)),b=(p(new Date(o,l,i+(6-r))),p(b=new Date(o,l,i-r-7))),v=p(v=new Date(o,l,i+(6-r-7))),f=p(f=new Date(o,l,1)),T=(p(new Date(o,l,m(l))),p(T=new Date(c,u,1))),w=p(w=new Date(c,u,m(u)));function D(e){var t={startTime:"",endTime:""};switch(e){case"CURRENTDAY":return t.startTime=g,t.endTime=g,t;case"YESTERODAY":return t.startTime=d,t.endTime=d,t;case"CURRENTWEEK":return t.startTime=h,t.endTime=g,t;case"PREWEEK":return t.startTime=b,t.endTime=v,t;case"CURRENTMONTH":return t.startTime=f,t.endTime=g,t;case"PREMONTH":return t.startTime=T,t.endTime=w,t;default:return t}}function k(e){var t=new Date(e),a=t.getMonth()+1,n=t.getDate(),r=t.getHours(),i=t.getMinutes(),l=t.getSeconds();return a>=1&&a<=9&&(a="0"+a),n>=0&&n<=9&&(n="0"+n),r>=0&&r<=9&&(r="0"+r),i>=0&&i<=9&&(i="0"+i),l>=0&&l<=9&&(l="0"+l),t.getFullYear()+"-"+a+"-"+n+" "+r+":"+i+":"+l}function C(e){e.split("");return e.substring(0,4)+"-"+e.substring(4,6)+"-"+e.substring(6,8)+" "+e.substring(9,11)+":"+e.substring(11,13)+":"+e.substring(13,15)}function _(e,t){if(""!=e&&""!=t){e=new Date(e.replace(/-/g,"/"));var a=(t=new Date(t.replace(/-/g,"/"))).getTime()-e.getTime();return parseInt(a/864e5)>60||void 0}this.$message("时间不能为空")}},vrrx:function(e,t,a){}}]);