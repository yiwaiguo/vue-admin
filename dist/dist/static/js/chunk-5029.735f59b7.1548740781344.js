(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-5029"],{HRvC:function(e,t,a){"use strict";var n=a("yWkc");a.n(n).a},VVQV:function(e,t,a){"use strict";a.r(t);var n=a("14Xm"),r=a.n(n),o=a("D3Ub"),i=a.n(o),l=a("mav0"),s=a("7Qib"),c=window.localStorage.getItem("keyword"),u=new Date(new Date((new Date).toLocaleDateString()).setMonth((new Date).getMonth()-1)),p={data:function(){return{title:"查询窗口（点击收起）",labelPosition:"right",keyword:c,q:{dealerCode:"",loginCode:"",orderNo:""},activeNames:["1"],tableData:[],page:{pageSize:50,total:0,currentPage:1},value:[Object(l.b)(u),Object(l.b)(new Date)],pickerOptions2:{disabledDate:function(e){return e.getTime()>Date.now()-864e4},shortcuts:[{text:"当日",onClick:function(e){var t=Object(l.d)("CURRENTDAY").endTime,a=Object(l.d)("CURRENTDAY").startTime;e.$emit("pick",[a,t])}},{text:"上日",onClick:function(e){var t=Object(l.d)("YESTERODAY").endTime,a=Object(l.d)("YESTERODAY").startTime;e.$emit("pick",[a,t])}},{text:"本周",onClick:function(e){var t=Object(l.d)("CURRENTWEEK").endTime,a=Object(l.d)("CURRENTWEEK").startTime;e.$emit("pick",[a,t])}},{text:"上周",onClick:function(e){var t=Object(l.d)("PREWEEK").endTime,a=Object(l.d)("PREWEEK").startTime;e.$emit("pick",[a,t])}},{text:"本月",onClick:function(e){var t=new Date,a=new Date,n=new Date(a.getFullYear(),a.getMonth(),1);a.setTime(a.getTime()-2592e6),e.$emit("pick",[Object(l.b)(n),Object(l.b)(t)])}},{text:"上月",onClick:function(e){var t=new Date,a=new Date(t.getFullYear(),t.getMonth(),1),n=new Date(t.getFullYear(),t.getMonth()-1,1),r=new Date(a.getTime()-864e5);e.$emit("pick",[Object(l.b)(n),Object(l.b)(r)])}}]},maxHeight:"550"}},filters:{rounding:function(e){return e?e.toFixed(2):"0.00"},formatType:function(e){switch(e){case"0":return"全额预付款券";case"1":return"服务费券";case"2":return"预付款券";default:return""}}},methods:{hasPermission:function(e){return Object(s.f)(e)},handleChange:function(){this.activeNames.length>0?(this.title="查询窗口（收起）",this.maxHeight="550"):(this.title="查询窗口（点击展开）",this.maxHeight="700")},selectTime:function(e){return e.map(function(e){return"string"!=typeof e?Object(l.b)(e):e})},query:function(){var e=this;return i()(r.a.mark(function t(){var a,n;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e.value=e.selectTime(e.value),e.q.startTime=e.value[0]+" 00:00:00",e.q.endTime=e.value[1]+" 23:59:59",!Object(l.e)(e.q.startTime,e.q.endTime)){t.next=6;break}return e.$message("查询不能超过60天"),t.abrupt("return");case 6:return a="&dealerCode="+e.q.dealerCode+"&loginCode="+e.q.loginCode+"&orderNo="+e.q.orderNo+"&startTime="+e.q.startTime+"&endTime="+e.q.endTime+"&page="+e.page.currentPage+"&limit="+e.page.pageSize,t.next=9,e._fetch("/couponsReport/couponOrder/list?limit=10&page=1"+a,{method:"GET"});case 9:0===(n=t.sent).code?(e.tableData=n.page.list,e.page.total=n.page.totalCount,e.page.pageSize=n.page.pageSize):e.$message(n.msg);case 11:case"end":return t.stop()}},t,e)}))()},reset:function(){this.value=[Object(l.b)(u),Object(l.b)(new Date)],this.q={dealerCode:"",loginCode:"",orderNo:"",startTime:this.value[0]+" 00:00:00",endTime:this.value[1]+" 23:59:59"}},download:function(){if(this.validator())this.$message("导出不能超过60天");else{var e=window.localStorage.getItem("token");this.q.startTime=this.value[0],this.q.endTime=this.value[1],this.url="/refundapply/download?token="+e+"&startTime="+this.q.startTime+"&endTime="+this.q.endTime+"&page="+this.page.currentPage+"&limit="+this.page.pageSize,fetch(this.baseURL+this.url,{headers:{"Content-type":"application/json;charset=UTF-8",token:e}}).then(function(e){return e.blob().then(function(e){var t=document.createElement("a"),a=window.URL.createObjectURL(e);t.href=a,t.download="券订单查询.xls",t.click(),window.URL.revokeObjectURL(a)})})}},getSummaries:function(e){var t=e.columns,a=e.data,n=[],r=["orderMoney","realUseMoney","backMoney","profitClose","profitCloseSub","overDueMoney","chargeOpen","extraCharge"];return t.forEach(function(e,t){if(0!==t){var o=a.map(function(t){return Number(t[e.property])});Object(s.a)(r,e.property)?n[t]=o.reduce(function(e,t){var a=Number(t);return isNaN(a)?e:e+t},0).toFixed(2):n[t]=""}else n[t]="合计"}),n},handleSizeChange:function(e){var t=this;return i()(r.a.mark(function a(){var n;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,t._fetch("/couponsReport/couponOrder/list?limit="+e+"&page="+t.page.currentPage,{method:"GET"});case 2:n=a.sent,t.tableData=n.page.list,t.page.pageSize=e;case 5:case"end":return a.stop()}},a,t)}))()},handleCurrentChange:function(e){var t=this;return i()(r.a.mark(function a(){var n;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,t._fetch("/couponsReport/couponOrder/list?limit="+t.page.pageSize+"&page="+e,{method:"GET"});case 2:n=a.sent,t.tableData=n.page.list,t.page.currentPage=e;case 5:case"end":return a.stop()}},a,t)}))()},validator:function(){this.q.startTime=this.value[0]+" 00:00:00",this.q.endTime=this.value[1]+" 23:59:59";var e=this.q.startTime,t=this.q.endTime;if(""!=e&&""!=t){e=new Date(e.replace(/-/g,"/"));var a=(t=new Date(t.replace(/-/g,"/"))).getTime()-e.getTime();return parseInt(a/864e5)>60||void 0}this.$message("时间不能为空")},rowClass:function(){return"text-align:center"}}},d=(a("HRvC"),a("KHd+")),g=Object(d.a)(p,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"page-container"},[a("div",{staticClass:"show-box"},[a("div",{staticClass:"query-box"},[a("el-collapse",{on:{change:e.handleChange},model:{value:e.activeNames,callback:function(t){e.activeNames=t},expression:"activeNames"}},[a("el-collapse-item",{attrs:{title:e.title,name:"1"}},[a("div",{staticClass:"query-item"},[a("el-form",{attrs:{"label-position":e.labelPosition,"label-width":"100px",model:e.q}},[a("el-form-item",{attrs:{label:"服务商编号"}},[a("el-input",{attrs:{placeholder:"请输入服务商编号"},model:{value:e.q.dealerCode,callback:function(t){e.$set(e.q,"dealerCode","string"==typeof t?t.trim():t)},expression:"q.dealerCode"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"登录账号"}},[a("el-input",{attrs:{placeholder:"请输入登录账号"},model:{value:e.q.loginCode,callback:function(t){e.$set(e.q,"loginCode","string"==typeof t?t.trim():t)},expression:"q.loginCode"}})],1)],1)],1),e._v(" "),a("div",{staticClass:"query-item"},[a("el-form",{attrs:{"label-position":e.labelPosition,"label-width":"100px",model:e.q}},[a("el-form-item",{attrs:{label:"订单号"}},[a("el-input",{attrs:{placeholder:"请输入订单号"},model:{value:e.q.orderNo,callback:function(t){e.$set(e.q,"orderNo","string"==typeof t?t.trim():t)},expression:"q.orderNo"}})],1)],1)],1),e._v(" "),a("div",{staticClass:"query-item"},[a("el-form",{attrs:{"label-position":e.labelPosition,"label-width":"80px",model:e.q}},[a("el-form-item",{attrs:{label:"日期查询"}},[a("el-date-picker",{attrs:{type:"daterange",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":e.pickerOptions2},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)],1)],1)])],1)],1),e._v(" "),a("div",{staticClass:"btn-box"},[e.hasPermission("couponsReport:couponOrder:list")?a("el-button",{attrs:{type:"primary"},on:{click:e.query}},[e._v("查询")]):e._e(),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.reset}},[e._v("重置")]),e._v(" "),e.hasPermission("couponsReport:couponOrder:download")?a("el-button",{attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.download}},[e._v("导出")]):e._e()],1),e._v(" "),a("div",{staticClass:"tb-box"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"header-cell-style":e.rowClass,border:"","max-height":e.maxHeight,"summary-method":e.getSummaries,"show-summary":""}},[a("el-table-column",{attrs:{type:"index",width:"50",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"dealerCode",label:"服务商编号",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"loginCode",label:"券批次号",align:"left",width:"250","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"couponSn",label:"券序列号",align:"left",width:"220"}}),e._v(" "),a("el-table-column",{attrs:{prop:"orderNo",label:"订单号",align:"left",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{prop:"orderCloseNo",label:"退订单号",align:"left",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{prop:"couponType",label:"券类型",align:"left",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("formatType")(t.row.couponType)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"orderMoney",label:"订单金额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.orderMoney)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"realUseMoney",label:"券实际抵扣金额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.realUseMoney)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"backMoney",label:"券退订退还金额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.backMoney)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"orderMoney",label:"券下单剩余金额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.orderMoney)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"profitClose",label:"货值增加",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.profitClose)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"profitCloseSub",label:"货值减少",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.profitCloseSub)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"overDueMoney",label:"失效劵总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.overDueMoney)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"chargeOpen",label:"服务费",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.chargeOpen)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"extraCharge",label:"keyword",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("rounding")(t.row.extraCharge)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"creDate",label:"创建时间",align:"center",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{prop:"transferCount",label:"划转次数",align:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"transferDate",label:"划转时间",align:"center",width:"200"}})],1)],1),e._v(" "),a("div",{staticClass:"block"},[a("el-pagination",{attrs:{"current-page":e.page.currentPage,"page-sizes":[10,30,50],"page-size":e.page.pageSize,total:e.page.total,layout:"total, sizes, prev, pager, next, jumper",background:""},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)])])},[],!1,null,"cd6caafc",null);g.options.__file="couponorder.vue";t.default=g.exports},mav0:function(e,t,a){"use strict";a.d(t,"b",function(){return p}),a.d(t,"d",function(){return T}),a.d(t,"a",function(){return C}),a.d(t,"c",function(){return y}),a.d(t,"e",function(){return D});var n=new Date,r=0===n.getDay()?6:n.getDay()-1,o=n.getDate(),i=n.getMonth(),l=n.getYear();l+=l<2e3?1900:0;var s=new Date;s.setDate(1),s.setMonth(s.getMonth()-1);var c=s.getYear();c+=c<2e3?1900:0;var u=s.getMonth();function p(e){var t=e.getFullYear(),a=e.getMonth()+1,n=e.getDate();return a<10&&(a="0"+a),n<10&&(n="0"+n),t+"-"+a+"-"+n}function d(e){var t=new Date(l,e,1);return(new Date(l,e+1,1)-t)/864e5}var g=p(g=new Date(l,i,o)),m=p(m=new Date(l,i,o-1)),f=p(f=new Date(l,i,o-r)),b=(p(new Date(l,i,o+(6-r))),p(b=new Date(l,i,o-r-7))),h=p(h=new Date(l,i,o+(6-r-7))),v=p(v=new Date(l,i,1)),w=(p(new Date(l,i,d(i))),p(w=new Date(c,u,1))),_=p(_=new Date(c,u,d(u)));function T(e){var t={startTime:"",endTime:""};switch(e){case"CURRENTDAY":return t.startTime=g,t.endTime=g,t;case"YESTERODAY":return t.startTime=m,t.endTime=m,t;case"CURRENTWEEK":return t.startTime=f,t.endTime=g,t;case"PREWEEK":return t.startTime=b,t.endTime=h,t;case"CURRENTMONTH":return t.startTime=v,t.endTime=g,t;case"PREMONTH":return t.startTime=w,t.endTime=_,t;default:return t}}function C(e){var t=new Date(e),a=t.getMonth()+1,n=t.getDate(),r=t.getHours(),o=t.getMinutes(),i=t.getSeconds();return a>=1&&a<=9&&(a="0"+a),n>=0&&n<=9&&(n="0"+n),r>=0&&r<=9&&(r="0"+r),o>=0&&o<=9&&(o="0"+o),i>=0&&i<=9&&(i="0"+i),t.getFullYear()+"-"+a+"-"+n+" "+r+":"+o+":"+i}function y(e){e.split("");return e.substring(0,4)+"-"+e.substring(4,6)+"-"+e.substring(6,8)+" "+e.substring(9,11)+":"+e.substring(11,13)+":"+e.substring(13,15)}function D(e,t){if(""!=e&&""!=t){e=new Date(e.replace(/-/g,"/"));var a=(t=new Date(t.replace(/-/g,"/"))).getTime()-e.getTime();return parseInt(a/864e5)>60||void 0}this.$message("时间不能为空")}},yWkc:function(e,t,a){}}]);