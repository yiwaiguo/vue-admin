(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-0036"],{"+dQM":function(e,t,a){},CMGj:function(e,t,a){"use strict";var n=a("Q3z9");a.n(n).a},Q3z9:function(e,t,a){},mav0:function(e,t,a){"use strict";a.d(t,"b",function(){return d}),a.d(t,"d",function(){return k}),a.d(t,"a",function(){return D}),a.d(t,"c",function(){return _}),a.d(t,"e",function(){return y});var n=new Date,i=0===n.getDay()?6:n.getDay()-1,r=n.getDate(),o=n.getMonth(),s=n.getYear();s+=s<2e3?1900:0;var l=new Date;l.setDate(1),l.setMonth(l.getMonth()-1);var c=l.getYear();c+=c<2e3?1900:0;var u=l.getMonth();function d(e){var t=e.getFullYear(),a=e.getMonth()+1,n=e.getDate();return a<10&&(a="0"+a),n<10&&(n="0"+n),t+"-"+a+"-"+n}function g(e){var t=new Date(s,e,1);return(new Date(s,e+1,1)-t)/864e5}var m=d(m=new Date(s,o,r)),p=d(p=new Date(s,o,r-1)),h=d(h=new Date(s,o,r-i)),b=(d(new Date(s,o,r+(6-i))),d(b=new Date(s,o,r-i-7))),f=d(f=new Date(s,o,r+(6-i-7))),v=d(v=new Date(s,o,1)),w=(d(new Date(s,o,g(o))),d(w=new Date(c,u,1))),T=d(T=new Date(c,u,g(u)));function k(e){var t={startTime:"",endTime:""};switch(e){case"CURRENTDAY":return t.startTime=m,t.endTime=m,t;case"YESTERODAY":return t.startTime=p,t.endTime=p,t;case"CURRENTWEEK":return t.startTime=h,t.endTime=m,t;case"PREWEEK":return t.startTime=b,t.endTime=f,t;case"CURRENTMONTH":return t.startTime=v,t.endTime=m,t;case"PREMONTH":return t.startTime=w,t.endTime=T,t;default:return t}}function D(e){var t=new Date(e),a=t.getMonth()+1,n=t.getDate(),i=t.getHours(),r=t.getMinutes(),o=t.getSeconds();return a>=1&&a<=9&&(a="0"+a),n>=0&&n<=9&&(n="0"+n),i>=0&&i<=9&&(i="0"+i),r>=0&&r<=9&&(r="0"+r),o>=0&&o<=9&&(o="0"+o),t.getFullYear()+"-"+a+"-"+n+" "+i+":"+r+":"+o}function _(e){e.split("");return e.substring(0,4)+"-"+e.substring(4,6)+"-"+e.substring(6,8)+" "+e.substring(9,11)+":"+e.substring(11,13)+":"+e.substring(13,15)}function y(e,t){if(""!=e&&""!=t){e=new Date(e.replace(/-/g,"/"));var a=(t=new Date(t.replace(/-/g,"/"))).getTime()-e.getTime();return parseInt(a/864e5)>60||void 0}this.$message("时间不能为空")}},sGAC:function(e,t,a){"use strict";a.r(t);var n=a("14Xm"),i=a.n(n),r=a("D3Ub"),o=a.n(r),s=a("mav0"),l=(a("7Qib"),window.localStorage.getItem("keyword")),c=new Date(new Date((new Date).toLocaleDateString()).setMonth((new Date).getMonth()-1)),u={props:["queryTime","id"],data:function(){return{panelTitle:"机构"+l+"日结明细",tableData:[],q:{startTime:"",endTime:""},switchStatus:"",page:{pageSize:10,total:0,currentPage:1},value:this.queryTime,pickerOptions2:{disabledDate:function(e){return e.getTime()>Date.now()-864e4},shortcuts:[{text:"当日",onClick:function(e){var t=Object(s.d)("CURRENTDAY").endTime,a=Object(s.d)("CURRENTDAY").startTime;e.$emit("pick",[a,t])}},{text:"上日",onClick:function(e){var t=Object(s.d)("YESTERODAY").endTime,a=Object(s.d)("YESTERODAY").startTime;e.$emit("pick",[a,t])}},{text:"本周",onClick:function(e){var t=Object(s.d)("CURRENTWEEK").endTime,a=Object(s.d)("CURRENTWEEK").startTime;e.$emit("pick",[a,t])}},{text:"上周",onClick:function(e){var t=Object(s.d)("PREWEEK").endTime,a=Object(s.d)("PREWEEK").startTime;e.$emit("pick",[a,t])}},{text:"本月",onClick:function(e){var t=new Date,a=new Date,n=new Date(a.getFullYear(),a.getMonth(),1);a.setTime(a.getTime()-2592e6),e.$emit("pick",[Object(s.b)(n),Object(s.b)(t)])}},{text:"上月",onClick:function(e){var t=new Date,a=new Date(t.getFullYear(),t.getMonth(),1),n=new Date(t.getFullYear(),t.getMonth()-1,1),i=new Date(a.getTime()-864e5);e.$emit("pick",[Object(s.b)(n),Object(s.b)(i)])}}]}}},filters:{rounding:function(e){return e.toFixed(2)}},created:function(){this.query()},methods:{selectTime:function(e){return e.map(function(e){return"string"!=typeof e?Object(s.b)(e):e})},query:function(){var e=this;return o()(i.a.mark(function t(){var a,n;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.value=e.selectTime(e.value),e.q.startTime=e.value[0]+" 00:00:00",e.q.endTime=e.value[1]+" 23:59:59",a="&startTime="+e.q.startTime+"&endTime="+e.q.endTime,t.next=6,e._fetch("/bountyDailySettlement/orgList/"+e.id+"?limit=10&page=1"+a,{method:"GET"});case 6:0===(n=t.sent).code?(e.tableData=n.page.list,e.page.total=n.page.totalCount,e.page.pageSize=n.page.pageSize):e.$message(n.msg);case 8:case"end":return t.stop()}},t,e)}))()},clearHandle:function(){this.value=[Object(s.b)(c),Object(s.b)(new Date)],this.q={startTime:this.value[0]+" 00:00:00",endTime:this.value[1]+" 23:59:59"}},download:function(){var e=window.localStorage.getItem("token");this.q.startTime=this.value[0],this.q.endTime=this.value[1],this.url="/bountyDailySettlement/download/orgList/"+this.id+"?token="+e+"&startTime="+this.q.startTime+"&endTime="+this.q.endTime+"&page="+this.page.currentPage+"&limit="+this.page.pageSize,fetch(this.baseURL+this.url,{headers:{"Content-type":"application/json;charset=UTF-8",token:e}}).then(function(e){return e.blob().then(function(e){var t="机构"+l+"日结明细表.xls",a=document.createElement("a"),n=window.URL.createObjectURL(e);a.href=n,a.download=t,a.click(),window.URL.revokeObjectURL(n)})})},goback:function(){this.switchStatus=!1,this.$emit("goback",this.switchStatus)},handleSizeChange:function(e){var t=this;return o()(i.a.mark(function a(){var n;return i.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,t._fetch("/bountyDailySettlement/orgList?limit="+e+"&page="+t.page.currentPage,{method:"GET"});case 2:n=a.sent,t.tableData=n.page.list,t.page.pageSize=e;case 5:case"end":return a.stop()}},a,t)}))()},handleCurrentChange:function(e){var t=this;return o()(i.a.mark(function a(){var n;return i.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,t._fetch("/bountyDailySettlement/orgList?limit="+t.page.pageSize+"&page="+e,{method:"GET"});case 2:n=a.sent,t.tableData=n.page.list,t.page.currentPage=e;case 5:case"end":return a.stop()}},a,t)}))()},rowClass:function(){return"text-align:center"}}},d=(a("vvkJ"),a("KHd+")),g=Object(d.a)(u,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"form-section"},[a("div",{staticClass:"panel",domProps:{innerHTML:e._s(e.panelTitle)}}),e._v(" "),a("div",{staticClass:"form-container"},[a("div",{staticClass:"query-box"},[a("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:e.q}},[a("el-form-item",{attrs:{label:"日期查询"}},[a("el-date-picker",{attrs:{type:"daterange",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":e.pickerOptions2},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)],1)],1),e._v(" "),a("div",{staticClass:"btn-box"},[a("el-button",{attrs:{type:"info"},on:{click:e.query}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"info"},on:{click:e.clearHandle}},[e._v("重置")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.download}},[e._v("导出")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.goback}},[e._v("返回")])],1),e._v(" "),a("div",{staticClass:"tb-box"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"header-cell-style":e.rowClass,border:"","max-height":"700"}},[a("el-table-column",{attrs:{type:"index",width:"40",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"tradingDay",label:"预订日",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"income",label:"收入总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.income)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"consume",label:"支出总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.consume)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"invalid",label:"失效总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.invalid)))])]}}])})],1)],1),e._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{attrs:{"current-page":e.page.currentPage,"page-sizes":[10,30,50],"page-size":e.page.pageSize,total:e.page.total,layout:"total, sizes, prev, pager, next, jumper",background:""},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)])])},[],!1,null,"033161f0",null);g.options.__file="orgdetail.vue";var m=g.exports,p=window.localStorage.getItem("keyword"),h=new Date(new Date((new Date).toLocaleDateString()).setMonth((new Date).getMonth()-1)),b={data:function(){return{title:"查询窗口（点击收起）",labelPosition:"right",switchForm:!1,keyword:p,q:{orgName:"",orgCode:"",startTime:"",endTime:""},activeNames:["1"],tableData:[],page:{pageSize:50,total:0,currentPage:1},value:[Object(s.b)(new Date),Object(s.b)(new Date)],pickerOptions2:{disabledDate:function(e){return e.getTime()>Date.now()-864e4},shortcuts:[{text:"当日",onClick:function(e){var t=Object(s.d)("CURRENTDAY").endTime,a=Object(s.d)("CURRENTDAY").startTime;e.$emit("pick",[a,t])}},{text:"上日",onClick:function(e){var t=Object(s.d)("YESTERODAY").endTime,a=Object(s.d)("YESTERODAY").startTime;e.$emit("pick",[a,t])}},{text:"本周",onClick:function(e){var t=Object(s.d)("CURRENTWEEK").endTime,a=Object(s.d)("CURRENTWEEK").startTime;e.$emit("pick",[a,t])}},{text:"上周",onClick:function(e){var t=Object(s.d)("PREWEEK").endTime,a=Object(s.d)("PREWEEK").startTime;e.$emit("pick",[a,t])}},{text:"本月",onClick:function(e){var t=new Date,a=new Date,n=new Date(a.getFullYear(),a.getMonth(),1);a.setTime(a.getTime()-2592e6),e.$emit("pick",[Object(s.b)(n),Object(s.b)(t)])}},{text:"上月",onClick:function(e){var t=new Date,a=new Date(t.getFullYear(),t.getMonth(),1),n=new Date(t.getFullYear(),t.getMonth()-1,1),i=new Date(a.getTime()-864e5);e.$emit("pick",[Object(s.b)(n),Object(s.b)(i)])}}]},showDetails:!1,detailId:""}},components:{orgdetail:m},filters:{rounding:function(e){return e?e.toFixed(2):"0.00"}},methods:{handleChange:function(){this.activeNames.length>0?this.title="查询窗口（收起）":this.title="查询窗口（点击展开）"},selectTime:function(e){return e.map(function(e){return"string"!=typeof e?Object(s.b)(e):e})},query:function(){var e=this;return o()(i.a.mark(function t(){var a,n;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.value=e.selectTime(e.value),e.q.startTime=e.value[0]+" 00:00:00",e.q.endTime=e.value[1]+" 23:59:59",a="&orgName="+e.q.orgName+"&orgCode="+e.q.orgCode+"&startTime="+e.q.startTime+"&endTime="+e.q.endTime,t.next=6,e._fetch("/hxbounty/orgCount?limit=50&page=1"+a,{method:"GET"});case 6:0===(n=t.sent).code?(e.tableData=n.page.list,e.page.total=n.page.totalCount,e.page.pageSize=n.page.pageSize):e.$message(n.msg);case 8:case"end":return t.stop()}},t,e)}))()},reset:function(){this.value=[Object(s.b)(h),Object(s.b)(new Date)],this.q={orgName:"",orgCode:"",startTime:this.value[0]+" 00:00:00",endTime:this.value[1]+" 23:59:59"}},download:function(){var e=window.localStorage.getItem("token");this.q.startTime=this.value[0]+" 00:00:00",this.q.endTime=this.value[1]+" 23:59:59",this.url="/hxbounty/download?type=org&token="+e+"&orgName="+this.q.orgName+"&orgCode="+this.q.orgCode+"&startTime="+this.q.startTime+"&endTime="+this.q.endTime+"&page="+this.page.currentPage+"&limit="+this.page.pageSize,fetch(this.baseURL+this.url,{headers:{"Content-type":"application/json;charset=UTF-8",token:e}}).then(function(e){return e.blob().then(function(e){var t="机构"+p+"管理.xls",a=document.createElement("a"),n=window.URL.createObjectURL(e);a.href=n,a.download=t,a.click(),window.URL.revokeObjectURL(n)})})},getSummaries:function(e){var t=e.columns,a=e.data,n=[];return t.forEach(function(e,t){if(0!==t){var i=a.map(function(t){return Number(t[e.property])});i.every(function(e){return isNaN(e)})?n[t]="":n[t]=i.reduce(function(e,t){var a=Number(t);return isNaN(a)?e:e+t},0).toFixed(2)}else n[t]="合计"}),n},forDetails:function(e,t){this.switchForm=!0,this.showDetails=!0,this.detailId=t.orgId},goback:function(){this.showDetails=!1,this.switchForm=!1},handleSizeChange:function(e){var t=this;return o()(i.a.mark(function a(){var n;return i.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,t._fetch("/hxbounty/orgCount?limit="+e+"&page="+t.page.currentPage,{method:"GET"});case 2:n=a.sent,t.tableData=n.page.list,t.page.pageSize=e;case 5:case"end":return a.stop()}},a,t)}))()},handleCurrentChange:function(e){var t=this;return o()(i.a.mark(function a(){var n;return i.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,t._fetch("/hxbounty/dealerCount?limit="+t.page.pageSize+"&page="+e,{method:"GET"});case 2:n=a.sent,t.tableData=n.page.list,t.page.currentPage=e;case 5:case"end":return a.stop()}},a,t)}))()},rowClass:function(){return"text-align:center"}}},f=(a("CMGj"),Object(d.a)(b,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"page-container"},[a("div",{directives:[{name:"show",rawName:"v-show",value:!e.switchForm,expression:"!switchForm"}],staticClass:"show-box"},[a("div",{staticClass:"query-box"},[a("el-collapse",{on:{change:e.handleChange},model:{value:e.activeNames,callback:function(t){e.activeNames=t},expression:"activeNames"}},[a("el-collapse-item",{attrs:{title:e.title,name:"1"}},[a("div",{staticClass:"query-item"},[a("el-form",{attrs:{"label-position":e.labelPosition,model:e.q,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"机构名称"}},[a("el-input",{attrs:{placeholder:"请输入机构名称"},model:{value:e.q.orgName,callback:function(t){e.$set(e.q,"orgName","string"==typeof t?t.trim():t)},expression:"q.orgName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"机构编码"}},[a("el-input",{attrs:{placeholder:"请输入机构编码"},model:{value:e.q.orgCode,callback:function(t){e.$set(e.q,"orgCode","string"==typeof t?t.trim():t)},expression:"q.orgCode"}})],1)],1)],1),e._v(" "),a("div",{staticClass:"query-item"},[a("el-form",{attrs:{"label-position":e.labelPosition,"label-width":"80px",model:e.q}},[a("el-form-item",{attrs:{label:"日期查询"}},[a("el-date-picker",{attrs:{type:"daterange",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":e.pickerOptions2},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)],1)],1)])],1)],1),e._v(" "),a("div",{staticClass:"btn-box"},[a("el-button",{attrs:{type:"primary"},on:{click:e.query}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.reset}},[e._v("重置")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.download}},[e._v("导出")])],1),e._v(" "),a("div",{staticClass:"tb-box"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"header-cell-style":e.rowClass,border:"","max-height":"500","summary-method":e.getSummaries,"show-summary":""}},[a("el-table-column",{attrs:{type:"index",width:"50",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"orgCode",label:"机构编号",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"orgName",label:"机构名称",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"total",label:"收入"+e.keyword+"总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.total)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"consume",label:"支出"+e.keyword+"总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.consume)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"invalid",label:"失效"+e.keyword+"总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.invalid)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"usable",label:"当前可用"+e.keyword+"总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.usable)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"morrow",label:"15日内即将过期"+e.keyword,align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.morrow)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(a){e.forDetails(t.$index,t.row)}}},[e._v("日结明细")])]}}])})],1)],1),e._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{attrs:{"current-page":e.page.currentPage,"page-sizes":[10,30,50],"page-size":e.page.pageSize,total:e.page.total,layout:"total, sizes, prev, pager, next, jumper",background:""},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)]),e._v(" "),e.showDetails?a("div",{staticClass:"child-page"},[a("orgdetail",{attrs:{queryTime:e.value,id:e.detailId},on:{goback:function(t){e.goback(e.value)}}})],1):e._e()])},[],!1,null,"2f29bf04",null));f.options.__file="orgcount.vue";t.default=f.exports},vvkJ:function(e,t,a){"use strict";var n=a("+dQM");a.n(n).a}}]);