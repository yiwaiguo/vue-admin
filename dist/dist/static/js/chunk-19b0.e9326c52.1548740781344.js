(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-19b0"],{"/gqE":function(e,t,n){"use strict";n.r(t);var a=n("14Xm"),i=n.n(a),r=n("D3Ub"),o=n.n(r),s=n("mav0"),l=(n("7Qib"),window.localStorage.getItem("keyword")),c=new Date(new Date((new Date).toLocaleDateString()).setMonth((new Date).getMonth()-1)),u={props:["queryTime","id"],data:function(){return{panelTitle:"服务商"+l+"日结明细",tableData:[],q:{startTime:"",endTime:""},switchStatus:"",page:{pageSize:10,total:0,currentPage:1},value:this.queryTime,pickerOptions2:{disabledDate:function(e){return e.getTime()>Date.now()-864e4},shortcuts:[{text:"当日",onClick:function(e){var t=Object(s.d)("CURRENTDAY").endTime,n=Object(s.d)("CURRENTDAY").startTime;e.$emit("pick",[n,t])}},{text:"上日",onClick:function(e){var t=Object(s.d)("YESTERODAY").endTime,n=Object(s.d)("YESTERODAY").startTime;e.$emit("pick",[n,t])}},{text:"本周",onClick:function(e){var t=Object(s.d)("CURRENTWEEK").endTime,n=Object(s.d)("CURRENTWEEK").startTime;e.$emit("pick",[n,t])}},{text:"上周",onClick:function(e){var t=Object(s.d)("PREWEEK").endTime,n=Object(s.d)("PREWEEK").startTime;e.$emit("pick",[n,t])}},{text:"本月",onClick:function(e){var t=new Date,n=new Date,a=new Date(n.getFullYear(),n.getMonth(),1);n.setTime(n.getTime()-2592e6),e.$emit("pick",[Object(s.b)(a),Object(s.b)(t)])}},{text:"上月",onClick:function(e){var t=new Date,n=new Date(t.getFullYear(),t.getMonth(),1),a=new Date(t.getFullYear(),t.getMonth()-1,1),i=new Date(n.getTime()-864e5);e.$emit("pick",[Object(s.b)(a),Object(s.b)(i)])}}]}}},filters:{rounding:function(e){return e.toFixed(2)}},created:function(){this.query()},methods:{selectTime:function(e){return e.map(function(e){return"string"!=typeof e?Object(s.b)(e):e})},query:function(){var e=this;return o()(i.a.mark(function t(){var n,a;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.value=e.selectTime(e.value),e.q.startTime=e.value[0]+" 00:00:00",e.q.endTime=e.value[1]+" 23:59:59",n="&startTime="+e.q.startTime+"&endTime="+e.q.endTime,t.next=6,e._fetch("/bountyDailySettlement/dealerList/"+e.id+"?limit=10&page=1"+n,{method:"GET"});case 6:0===(a=t.sent).code?(e.tableData=a.page.list,e.page.total=a.page.totalCount,e.page.pageSize=a.page.pageSize):e.$message(a.msg);case 8:case"end":return t.stop()}},t,e)}))()},clearHandle:function(){this.value=[Object(s.b)(c),Object(s.b)(new Date)],this.q={startTime:this.value[0]+" 00:00:00",endTime:this.value[1]+" 23:59:59"}},download:function(){var e=window.localStorage.getItem("token");this.q.startTime=this.value[0],this.q.endTime=this.value[1],this.url="/bountyDailySettlement/download/dealerList/"+this.id+"?token="+e+"&startTime="+this.q.startTime+"&endTime="+this.q.endTime+"&page="+this.page.currentPage+"&limit="+this.page.pageSize,fetch(this.baseURL+this.url,{headers:{"Content-type":"application/json;charset=UTF-8",token:e}}).then(function(e){return e.blob().then(function(e){var t="服务商"+l+"日结明细表.xls",n=document.createElement("a"),a=window.URL.createObjectURL(e);n.href=a,n.download=t,n.click(),window.URL.revokeObjectURL(a)})})},goback:function(){this.switchStatus=!1,this.$emit("goback",this.switchStatus)},handleSizeChange:function(e){var t=this;return o()(i.a.mark(function n(){var a;return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t._fetch("/bountyDailySettlement/dealerList?limit="+e+"&page="+t.page.currentPage,{method:"GET"});case 2:a=n.sent,t.tableData=a.page.list,t.page.pageSize=e;case 5:case"end":return n.stop()}},n,t)}))()},handleCurrentChange:function(e){var t=this;return o()(i.a.mark(function n(){var a;return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t._fetch("/bountyDailySettlement/dealerList?limit="+t.page.pageSize+"&page="+e,{method:"GET"});case 2:a=n.sent,t.tableData=a.page.list,t.page.currentPage=e;case 5:case"end":return n.stop()}},n,t)}))()},rowClass:function(){return"text-align:center"}}},d=(n("Pc8t"),n("KHd+")),p=Object(d.a)(u,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"form-section"},[n("div",{staticClass:"panel",domProps:{innerHTML:e._s(e.panelTitle)}}),e._v(" "),n("div",{staticClass:"form-container"},[n("div",{staticClass:"query-box"},[n("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:e.q}},[n("el-form-item",{attrs:{label:"日期查询"}},[n("el-date-picker",{attrs:{type:"daterange",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":e.pickerOptions2},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)],1)],1),e._v(" "),n("div",{staticClass:"btn-box"},[n("el-button",{attrs:{type:"info"},on:{click:e.query}},[e._v("查询")]),e._v(" "),n("el-button",{attrs:{type:"info"},on:{click:e.clearHandle}},[e._v("重置")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:e.download}},[e._v("导出")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:e.goback}},[e._v("返回")])],1),e._v(" "),n("div",{staticClass:"tb-box"},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"header-cell-style":e.rowClass,border:"","max-height":"700"}},[n("el-table-column",{attrs:{type:"index",width:"40",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"tradingDay",label:"预订日",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"income",label:"收入总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("rounding")(t.row.income)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"consume",label:"支出总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("rounding")(t.row.consume)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"invalid",label:"失效总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("rounding")(t.row.invalid)))])]}}])})],1)],1),e._v(" "),n("div",{staticClass:"block"},[n("el-pagination",{attrs:{"current-page":e.page.currentPage,"page-sizes":[10,30,50],"page-size":e.page.pageSize,total:e.page.total,layout:"total, sizes, prev, pager, next, jumper",background:""},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)])])},[],!1,null,"096d7f71",null);p.options.__file="dealerdetail.vue";var g=p.exports,m=window.localStorage.getItem("keyword"),h=new Date(new Date((new Date).toLocaleDateString()).setMonth((new Date).getMonth()-1)),v={data:function(){return{labelPosition:"right",switchForm:!1,keyword:m,q:{startTime:"",endTime:""},activeNames:[],tableData:[],page:{pageSize:50,total:0,currentPage:1},value:[Object(s.b)(h),Object(s.b)(new Date)],pickerOptions2:{disabledDate:function(e){return e.getTime()>Date.now()-864e4},shortcuts:[{text:"当日",onClick:function(e){var t=Object(s.d)("CURRENTDAY").endTime,n=Object(s.d)("CURRENTDAY").startTime;e.$emit("pick",[n,t])}},{text:"上日",onClick:function(e){var t=Object(s.d)("YESTERODAY").endTime,n=Object(s.d)("YESTERODAY").startTime;e.$emit("pick",[n,t])}},{text:"本周",onClick:function(e){var t=Object(s.d)("CURRENTWEEK").endTime,n=Object(s.d)("CURRENTWEEK").startTime;e.$emit("pick",[n,t])}},{text:"上周",onClick:function(e){var t=Object(s.d)("PREWEEK").endTime,n=Object(s.d)("PREWEEK").startTime;e.$emit("pick",[n,t])}},{text:"本月",onClick:function(e){var t=new Date,n=new Date,a=new Date(n.getFullYear(),n.getMonth(),1);n.setTime(n.getTime()-2592e6),e.$emit("pick",[Object(s.b)(a),Object(s.b)(t)])}},{text:"上月",onClick:function(e){var t=new Date,n=new Date(t.getFullYear(),t.getMonth(),1),a=new Date(t.getFullYear(),t.getMonth()-1,1),i=new Date(n.getTime()-864e5);e.$emit("pick",[Object(s.b)(a),Object(s.b)(i)])}}]},showDetails:!1,detailId:"",url:"",count:{}}},components:{dealerdetail:g},filters:{rounding:function(e){return e?e.toFixed(2):"0.00"}},created:function(){this.getCount()},methods:{getCount:function(){var e=this;return o()(i.a.mark(function t(){var n;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e._fetch("//hxbounty/count",{method:"GET"});case 2:0===(n=t.sent).code?e.count=n.data:console.log(n.msg);case 4:case"end":return t.stop()}},t,e)}))()},selectTime:function(e){return e.map(function(e){return"string"!=typeof e?Object(s.b)(e):e})},query:function(){var e=this;return o()(i.a.mark(function t(){var n,a;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.value=e.selectTime(e.value),e.q.startTime=e.value[0]+" 00:00:00",e.q.endTime=e.value[1]+" 23:59:59",n="&startTime="+e.q.startTime+"&endTime="+e.q.endTime,t.next=6,e._fetch("/hxbounty/dealerCount?limit=50&page=1"+n,{method:"GET"});case 6:0===(a=t.sent).code?(e.tableData=a.page.list,e.page.total=a.page.totalCount,e.page.pageSize=a.page.pageSize):e.$message(a.msg);case 8:case"end":return t.stop()}},t,e)}))()},reset:function(){this.value=[Object(s.b)(h),Object(s.b)(new Date)],this.q={startTime:this.value[0]+" 00:00:00",endTime:this.value[1]+" 23:59:59"}},download:function(){var e=window.localStorage.getItem("token");this.q.startTime=this.value[0]+" 00:00:00",this.q.endTime=this.value[1]+" 23:59:59",this.url="/hxbounty/download?type=dealer&token="+e+"&startTime="+this.q.startTime+"&endTime="+this.q.endTime+"&page="+this.page.currentPage+"&limit="+this.page.pageSize,fetch(this.baseURL+this.url,{headers:{"Content-type":"application/json;charset=UTF-8",token:e}}).then(function(e){return e.blob().then(function(e){var t="服务商"+m+"管理.xls",n=document.createElement("a"),a=window.URL.createObjectURL(e);n.href=a,n.download=t,n.click(),window.URL.revokeObjectURL(a)})})},getSummaries:function(e){var t=e.columns,n=e.data,a=[];return t.forEach(function(e,t){if(0!==t){var i=n.map(function(t){return Number(t[e.property])});i.every(function(e){return isNaN(e)})?a[t]="":a[t]=i.reduce(function(e,t){var n=Number(t);return isNaN(n)?e:e+t},0).toFixed(2)}else a[t]="合计"}),a},forDetails:function(e,t){this.switchForm=!0,this.showDetails=!0,this.detailId=t.dealerId},goback:function(){this.switchForm=!1,this.showDetails=!1},handleSizeChange:function(e){var t=this;return o()(i.a.mark(function n(){var a;return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t._fetch("/hxbounty/dealerCount?limit="+e+"&page="+t.page.currentPage,{method:"GET"});case 2:a=n.sent,t.tableData=a.page.list,t.page.pageSize=e;case 5:case"end":return n.stop()}},n,t)}))()},handleCurrentChange:function(e){var t=this;return o()(i.a.mark(function n(){var a;return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t._fetch("/hxbounty/dealerCount?limit="+t.page.pageSize+"&page="+e,{method:"GET"});case 2:a=n.sent,t.tableData=a.page.list,t.page.currentPage=e;case 5:case"end":return n.stop()}},n,t)}))()},rowClass:function(){return"text-align:center"}}},f=(n("sopl"),Object(d.a)(v,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"page-container"},[n("div",{directives:[{name:"show",rawName:"v-show",value:!e.switchForm,expression:"!switchForm"}],staticClass:"show-box"},[n("div",{staticClass:"query-box"},[n("el-form",{attrs:{"label-position":e.labelPosition,"label-width":"80px",model:e.q}},[n("el-form-item",{attrs:{label:"日期查询"}},[n("el-date-picker",{attrs:{type:"daterange",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":e.pickerOptions2},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)],1)],1),e._v(" "),n("div",{staticClass:"btn-box"},[n("el-button",{attrs:{type:"primary"},on:{click:e.query}},[e._v("查询")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:e.reset}},[e._v("重置")]),e._v(" "),n("el-button",{attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.download}},[e._v("导出")])],1),e._v(" "),n("div",{staticClass:"tag-box"},[n("ul",[n("li",[e._v("\n          "+e._s(e.keyword)+"总额：\n          "),n("span",[e._v(e._s(e.count.totalBounty))])]),e._v(" "),n("li",[e._v("\n          可用"+e._s(e.keyword)+"总额：\n          "),n("span",[e._v(e._s(e.count.usableBounty))])]),e._v(" "),n("li",[e._v("\n          已消费"+e._s(e.keyword)+"总额：\n          "),n("span",[e._v(e._s(e.count.consumeBounty))])]),e._v(" "),n("li",[e._v("\n          已过期"+e._s(e.keyword)+"总额：\n          "),n("span",[e._v(e._s(e.count.pastBounty))])]),e._v(" "),n("li",[e._v("\n          15日内即将过期"+e._s(e.keyword)+"：\n          "),n("span",[e._v(e._s(e.count.LastTwoBounty))])])])]),e._v(" "),n("div",{staticClass:"tb-box"},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"header-cell-style":e.rowClass,border:"","max-height":"500","summary-method":e.getSummaries,"show-summary":""}},[n("el-table-column",{attrs:{type:"index",width:"50",align:"center"}}),e._v(" "),n("el-table-column",{attrs:{prop:"dealerCode",label:"服务商编号",align:"left"}}),e._v(" "),n("el-table-column",{attrs:{prop:"total",label:"收入"+e.keyword+"总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("rounding")(t.row.total)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"consume",label:"支出"+e.keyword+"总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("rounding")(t.row.consume)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"invalid",label:"失效"+e.keyword+"总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("rounding")(t.row.invalid)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"usable",label:"当前可用"+e.keyword+"总额",align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("rounding")(t.row.usable)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"morrow",label:"15日内即将过期"+e.keyword,align:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("rounding")(t.row.morrow)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"",label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){e.forDetails(t.$index,t.row)}}},[e._v("日结明细")])]}}])})],1)],1),e._v(" "),n("div",{staticClass:"block"},[n("el-pagination",{attrs:{"current-page":e.page.currentPage,"page-sizes":[10,30,50],"page-size":e.page.pageSize,total:e.page.total,layout:"total, sizes, prev, pager, next, jumper",background:""},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)]),e._v(" "),e.showDetails?n("div",{staticClass:"child-page"},[n("dealerdetail",{attrs:{queryTime:e.value,id:e.detailId},on:{goback:function(t){e.goback(e.value)}}})],1):e._e()])},[],!1,null,"5a41d053",null));f.options.__file="dealercount.vue";t.default=f.exports},APk3:function(e,t,n){},Pc8t:function(e,t,n){"use strict";var a=n("APk3");n.n(a).a},YQPc:function(e,t,n){},mav0:function(e,t,n){"use strict";n.d(t,"b",function(){return d}),n.d(t,"d",function(){return _}),n.d(t,"a",function(){return k}),n.d(t,"c",function(){return y}),n.d(t,"e",function(){return D});var a=new Date,i=0===a.getDay()?6:a.getDay()-1,r=a.getDate(),o=a.getMonth(),s=a.getYear();s+=s<2e3?1900:0;var l=new Date;l.setDate(1),l.setMonth(l.getMonth()-1);var c=l.getYear();c+=c<2e3?1900:0;var u=l.getMonth();function d(e){var t=e.getFullYear(),n=e.getMonth()+1,a=e.getDate();return n<10&&(n="0"+n),a<10&&(a="0"+a),t+"-"+n+"-"+a}function p(e){var t=new Date(s,e,1);return(new Date(s,e+1,1)-t)/864e5}var g=d(g=new Date(s,o,r)),m=d(m=new Date(s,o,r-1)),h=d(h=new Date(s,o,r-i)),v=(d(new Date(s,o,r+(6-i))),d(v=new Date(s,o,r-i-7))),f=d(f=new Date(s,o,r+(6-i-7))),b=d(b=new Date(s,o,1)),w=(d(new Date(s,o,p(o))),d(w=new Date(c,u,1))),T=d(T=new Date(c,u,p(u)));function _(e){var t={startTime:"",endTime:""};switch(e){case"CURRENTDAY":return t.startTime=g,t.endTime=g,t;case"YESTERODAY":return t.startTime=m,t.endTime=m,t;case"CURRENTWEEK":return t.startTime=h,t.endTime=g,t;case"PREWEEK":return t.startTime=v,t.endTime=f,t;case"CURRENTMONTH":return t.startTime=b,t.endTime=g,t;case"PREMONTH":return t.startTime=w,t.endTime=T,t;default:return t}}function k(e){var t=new Date(e),n=t.getMonth()+1,a=t.getDate(),i=t.getHours(),r=t.getMinutes(),o=t.getSeconds();return n>=1&&n<=9&&(n="0"+n),a>=0&&a<=9&&(a="0"+a),i>=0&&i<=9&&(i="0"+i),r>=0&&r<=9&&(r="0"+r),o>=0&&o<=9&&(o="0"+o),t.getFullYear()+"-"+n+"-"+a+" "+i+":"+r+":"+o}function y(e){e.split("");return e.substring(0,4)+"-"+e.substring(4,6)+"-"+e.substring(6,8)+" "+e.substring(9,11)+":"+e.substring(11,13)+":"+e.substring(13,15)}function D(e,t){if(""!=e&&""!=t){e=new Date(e.replace(/-/g,"/"));var n=(t=new Date(t.replace(/-/g,"/"))).getTime()-e.getTime();return parseInt(n/864e5)>60||void 0}this.$message("时间不能为空")}},sopl:function(e,t,n){"use strict";var a=n("YQPc");n.n(a).a}}]);