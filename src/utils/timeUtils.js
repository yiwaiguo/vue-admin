/*
 * @author 40
 * date 2018/1/31
 * time  14:12
 * decription: 日期工具
 */

var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; //今天本周的第几天,按周1为第1天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastMonthYear = lastMonthDate.getYear();
lastMonthYear += (lastMonthYear < 2000) ? 1900 : 0;
var lastMonth = lastMonthDate.getMonth();

//格式化日期：yyyy-MM-dd
export function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return (myyear + "-" + mymonth + "-" + myweekday);
}

//获得某月的天数
export function getMonthDays(myMonth) {
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}

//获得本季度的开始月份
export function getQuarterStartMonth() {
  var quarterStartMonth = 0;
  if (nowMonth < 3) {
    quarterStartMonth = 0;
  }
  if (2 < 6) {
    quarterStartMonth = 3;
  }
  if (5 < 9) {
    quarterStartMonth = 6;
  }
  if (nowMonth > 8) {
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}

//今天
var getCurrentDate = new Date(nowYear, nowMonth, nowDay);
var getCurrentDate = formatDate(getCurrentDate)

//昨天
var getYesterdayDate = new Date(nowYear, nowMonth, nowDay - 1);
var getYesterdayDate = formatDate(getYesterdayDate);

//获得本周的开始日期
var getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
var getWeekStartDate = formatDate(getWeekStartDate);
//获得本周的结束日期
var getWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
var getWeekEndDate = formatDate(getWeekEndDate);


//获得上周的开始日期
var getUpWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
var getUpWeekStartDate = formatDate(getUpWeekStartDate);

//获得上周的结束日期
var getUpWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek - 7));
var getUpWeekEndDate = formatDate(getUpWeekEndDate);


//获得本月的开始日期
var getMonthStartDate = new Date(nowYear, nowMonth, 1);
var getMonthStartDate = formatDate(getMonthStartDate);

//获得本月的结束日期
var getMonthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
var getMonthEndDate = formatDate(getMonthEndDate);

//获得上月开始时间
var getLastMonthStartDate = new Date(lastMonthYear, lastMonth, 1);
var getLastMonthStartDate = formatDate(getLastMonthStartDate);

//获得上月结束时间
var getLastMonthEndDate = new Date(lastMonthYear, lastMonth, getMonthDays(lastMonth));
var getLastMonthEndDate = formatDate(getLastMonthEndDate);

export function getTimeByType(type) {
  var times = {
    startTime: "",
    endTime: ""
  }
  switch (type) {
    case 'CURRENTDAY':
      times.startTime = getCurrentDate
      times.endTime = getCurrentDate
      return times
    case 'YESTERODAY':
      times.startTime = getYesterdayDate
      times.endTime = getYesterdayDate
      return times
    case 'CURRENTWEEK':
      times.startTime = getWeekStartDate
      times.endTime = getCurrentDate
      return times
    case 'PREWEEK':
      times.startTime = getUpWeekStartDate
      times.endTime = getUpWeekEndDate
      return times
    case 'CURRENTMONTH':
      times.startTime = getMonthStartDate
      times.endTime = getCurrentDate
      return times
    case 'PREMONTH':
      times.startTime = getLastMonthStartDate
      times.endTime = getLastMonthEndDate
      return times
    default:
      return times
  }
}
//十三位时间戳转毫秒级时间格式
function formatDateTime(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

//格式化后日期为：yyyy-MM-dd HH:mm:ss
export function FormatAllDate(sDate) {
  var date = new Date(sDate);
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  //月
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  //日
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  //时
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  //分
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  //秒
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  //格式化后日期为：yyyy-MM-dd HH:mm:ss
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    " " + hours + seperator2 + minutes + seperator2 + seconds;
  return currentdate;
}
//带T的转换
export function formatDateT(date) {
  let dates = date.split("")
  return date.substring(0, 4) + "-" +
      date.substring(4, 6) + "-" +
      date.substring(6, 8) + " " +
      date.substring(9, 11) + ":" +
      date.substring(11, 13) + ":" +
      date.substring(13, 15);
}

export function validator(s1,s2) {
  //查询时间不超过1个月
  if (s1 == "" || s2 == "") {
    this.$message("时间不能为空");
    return;
  }
  s1 = new Date(s1.replace(/-/g, "/"));
  s2 = new Date(s2.replace(/-/g, "/"));
  var days = s2.getTime() - s1.getTime();
  var time = parseInt(days / (1000 * 60 * 60 * 24));
  if (time > 60) {
    return true;
  }
}
