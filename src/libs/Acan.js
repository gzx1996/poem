var Acan = {
  isInt: function(s) {
    return parseInt(s) === s
  },
  isInts: function(s) {
    return /^[\d]+\.?[\d]+$/.test(s)
  },
  isBool: function(s) {
    return Object.prototype.toString.call(s) === '[object Boolean]'
    return typeof(s) == 'boolean' ? true : false
  },
  isNum: function(s) {
    return Object.prototype.toString.call(s) === '[object Number]'
    return typeof(s) == 'number' ? true : false
  },
  isStr: function(s) {
    return Object.prototype.toString.call(s) === '[object String]'
    return typeof(s) == 'string' ? true : false
  },
  isArr: function(d) {
    return Object.prototype.toString.call(d) === '[object Array]'
    return d instanceof Array
  },
  isObj: function(d) {
    return Object.prototype.toString.call(d) === '[object Object]'
    if (typeof(d) === 'object' && d !== null) return true
    else return false
  },
  isFun: function(d) {
    return Object.prototype.toString.call(d) === '[object Function]'
    return d instanceof Function
  },
  isDate: function(d) {
    return Object.prototype.toString.call(d) === '[object Date]'
    return d instanceof Date
  },
}
//判断对象中属性是否定义过
Acan.isDefined = function(d) {
  //return !(Object.prototype.toString.call(d)==='[object Undefined]');
  return !('undefined' == typeof d)
}
//变量是否为空，可以判断 字符串，对象，数组，bool，数字
Acan.isEmpty = function(a) {
  if (a && Acan.isFun(a.test) && Acan.isFun(a.compile)) {
    return false
  } else if (Acan.isObj(a)) {
    return Acan.count(a) === 0 ? true : false
  } else if (Acan.isStr(a) || Acan.isArr(a)) {
    return a.length === 0 ? true : false
  } else if (Acan.isNum(a)) {
    return false
  } else if (Acan.isBool(a)) {
    return false
  } else if (null === a) {
    return true
  } else if (!Acan.isDefined(a)) {
    return true
  } else {
    return false
  }
}
Acan.isBase64 = function(s) {
  return (this.isStr(s) && s.substr(0, 5) == 'data:' && s.indexOf('base64') !== -1) ? true : false
}
Acan.isJSON = function(s) {
  var pi, p = ['[', '{', '"'],
    e = [']', '}', '"'],
    rs = false
  if (this.isStr(s) && s.length > 1) {
    pi = p.indexOf(s.substr(0, 1))
    if (pi >= 0 && s.substr(-1) == e[pi]) rs = true
  }
  return rs
}
//mongoose ObjectId
Acan.isObjectId = function(s) {
  if (Acan.isObj(s)) s = s.toString()
  if (Acan.isStr(s) && /^[a-f0-9]{24}$/.test(s)) {
    return true
  }
  return false
}
Acan.isIp = function (ip) {
  var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return re.test(ip)
}

Acan.equal = function (s1, s2) {
  if (Acan.isObj(s1) && s1.toString) s1 = s1.toString()
  if (Acan.isObj(s2) && s2.toString) s2 = s2.toString()
  return s1 === s2
}
// mongoose ObjectId parse
Acan.ObjectIdParse = function (oid) {
  var rs = {}
  if (!oid) return rs
  if (Acan.isObj(oid) && oid.toString) oid = oid.toString()
  if (!Acan.isObjectId(oid)) return rs
  rs.time = parseInt(oid.substr(0, 8), 16)
  rs.date = Acan.time('Y-m-d H:i:s', rs.time)
  return rs
}
//对象克隆
Acan.clone = function(obj, p) {
  return JSON.parse(JSON.stringify(obj))
  var tbj = {}
  if (Acan.isArr(obj)) {
    tbj = []
    obj.forEach(function(v) {
      if (Acan.isObj(v)) {
        tbj.push(Acan.clone(v))
      } else {
        tbj.push(v)
      }
    })
    return tbj
  }
  if (!p) {
    //console.log(obj,Object.prototype.toString.call(obj.to))
  }
  for (var i in obj) {
    if (Acan.inArr(i, ['__proto__'])) {} else if (Acan.isObj(obj[i])) {
      tbj[i] = Acan.clone(obj[i], 1)
    } else {
      tbj[i] = obj[i]
    }
  }
  return tbj
}
Acan.sort = function(arr) {
  return arr.sort(Acan.sortNumber)
}
Acan.sortNumber = function(a, b) {
  return a - b
}

// 整型数字的随机函数
Acan.random = function(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min)
}
Acan.extend = function(o, n, override) {
  if (!Acan.isObj(o)) return o = n
  if (!Acan.isObj(n)) return o
  for (var p in n)
    if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) o[p] = n[p]
  return o
}
/**
 *
 * @param n     总任务数（回调）
 * @param call  单次的回调
 * @param rcb   总回调
 * @param ttl   超时时间（毫秒）
 * @returns {Acan.ccall}
 */
Acan.ccb = function(n, call, rcb, ttl) {
  return new Acan.ccall(n, call, rcb, ttl)
}
//多任务并行执行 -> 串行汇总回调
Acan.ccall = function(n, call, rcb, ttl) {
  this.ttl = ttl || 3000 * n //设置返回超时,默认3秒乘以任务数
  if (!rcb) {
    this.call = false
    this.rcb = call
  } else if (Acan.isInt(rcb)) {
    this.call = false
    this.rcb = call
    this.ttl = rcb
  } else {
    this.call = call //并行回调
    this.rcb = rcb //总回调
  }
  this.n = n //设置并行任务数
  this.i = 0 //初始化计数器
  this.t = 0 //初始化任务数
  this.status = 1 //状态 1:初始化,2:执行中,3:完成
  this.cbrs = [] //并行回调结果汇总
  if (n === 0 && Acan.isFun(this.rcb)) this.rcb()
  return this
}
Acan.ccall.prototype = {
  cb: function() {
    this.i++
    this.status = 2
    this.cbrs.push(arguments)
    try {
      if (this.call) this.call.apply(this, arguments) //回调
      if (this.status < 3 && this.n == this.i) {
        this.status = 3
        this.rcb(this.cbrs) //结合theme那里，rcb=function(){res.return({data:d})};怎么能每次都渲染页面呢？？？
      }
    } catch (e) { console.trace('ccall', e.stack) }
    var ni = this.i,
      self = this
    setTimeout(function() {
      self.timeout(ni)
    }, this.ttl)
  },
  at: function(c) { //增加任务 计数
    if (c > 0) {
      this.n += c
      this.t += c
    } else {
      this.n++
      this.t++
    }
  },
  setnum: function(n) { //设置任务数量
    if (!this.t) this.t = n
    if (!this.t) return false
    try {
      if (this.status < 3 && this.t == this.i) {
        this.status = 3
        this.rcb(this.cbrs)
      }
    } catch (e) { console.trace('ccall', e) }
  },
  timeout: function(ni) { //超时检查
    if (ni == this.i && ni < this.n) {
      this.status = 3
      this.rcb(this.cbrs) //为什么还要执行一次呢，之前不是执行了吗？？？
    }
  }
}
Acan.setstr = function(str, err) {
  if (!err) err = ''
  if (str) return str
  else return err
}

//直接获取对象多级属性值 Acan.objGet(obj,'a.0.c') = obj.a.b.c
//df		Mixed		default (默认值)
Acan.objGet = function(obj, str, df, isSet) {
  var rs = '',
    p, o
  if (Acan.isStr(str)) {
    p = str.split('.')
  }
  if (!Acan.isArr(p)) return false
  return Acan.objGet_c(obj, p, df, isSet)
}

//直接赋值对象多级属性值 Acan.objSet(obj,'a.0.c','asdf') = obj.a.b.c
//df		Mixed		default (默认值)
Acan.objSet = function(obj, str, df) {
  var rs = '',
    p, o
  if (Acan.isStr(str)) {
    p = str.split('.')
  }
  if (!Acan.isArr(p)) return false
  if (Acan.isObj(obj) || Acan.isArr(obj)) {
    Acan.objGet_c(obj, p, df, 1)
  }
  return obj
}
//寻找对象中的子元素
Acan.objGet_c = function(o, prr, df, isSet) {
  var f = prr.shift()
  var _o
  if (!isSet) isSet = 0
  if (typeof(o) === 'undefined') {
    if (isSet) {
      o = Acan.objGet_c_df(f, prr, df)
    } else { //获取的时候
      return df
    }
  }
  //父对象未定义的时候直接返回默认值
  if (!isSet) {
    if (!Acan.isDefined(o)) {
      return df
    } else if (o === null) {
      return df
    }
  }
  if (typeof(o[f]) === 'undefined') {
    if (isSet) { //设置的情况下继续
      o[f] = Acan.objGet_c_df(f, prr, df)
    } else { //不存在直接赋值为默认值
      return df
    }
  }
  _o = o[f]
  if (prr.length == 0 || typeof(_o) === 'undefined') {
    if (isSet) { //设置的时候返回设置后的值
      _o = o[f] = df
      return _o
    } else { //获取的时候返回对应的值或者默认值
      return Acan.isDefined(_o) ? _o : df
    }
  } else {
    return Acan.objGet_c(_o, prr, df, isSet)
  }
}
//取默认值
Acan.objGet_df = function(v, df) {
  if (Acan.isDefined(df)) {
    return df
  } else {
    return v
  }
}
//取默认值
Acan.objGet_c_df = function(f, prr, df) {
  var _df
  if (prr.length == 0) {
    _df = df //直接赋值
  } else if (Acan.isInts(prr[0])) {
    _df = []
  } else {
    _df = {}
  }
  return _df
}

Acan.count = function(obj) {
  var i = 0
  if (typeof(obj) == 'object' || typeof(obj) == 'Array')
    for (var x in obj) {
      i++
    }
  return i
}

/*
 * t1,{'t':'t1'} = true
 * t1,['t1'] = true
 * t1,[{'t':'t1'}] = true
 */
Acan.inArr = function(str, arr, f) {
  var r = false
  if (Acan.isArr(arr)) {
    arr.forEach(function(v, i) {
      if (f && Acan.isObj(v) && v[f] && v[f] == str) r = true //子对象的属性比较
      else if (v == str) r = true
    })
  } else if (Acan.isObj(arr)) {
    for (var i in arr) {
      var v = arr[i]
      if (f && Acan.isObj(v) && v[f] && v[f] == str) return true //子对象的属性比较
      else if (v == str) return true
    }
  }
  return r
}

//数组 对象 循环
Acan.each = function(o, cb) {
  if (!cb) return false
  if (Acan.isArr(o)) {
    o.forEach(cb)
  } else if (Acan.isObj(o)) {
    for (var i in o) {
      cb(o[i], i, o)
    }
  }
}
//从数组中查找
/*
	@mult 为真，返回多个结果，数组形式
	* var arr=[{'t':'t1'}];
	Acan.arrFind(arr,t,t1)={'t':'t1'};
	*/
Acan.arrFind = function(arr, k, v, mult) {
  var rs
  if (!Acan.isArr(v)) v = [v]
  if (mult) rs = []
  Acan.each(arr, function(val, key) {
    if (Acan.isObj(val) && Acan.inArr(val[k], v)) {
      if (mult) {
        rs.push(val)
      } else if (!rs) {
        rs = val
      }
    }
  })
  return rs
}


//字符串复制 Acan.str_repeat('ab',3)='ababab';
Acan.str_repeat = function(i, m) {
  for (var o = []; m > 0; o[--m] = i);
  return o.join('')
}
Acan.parseDom = function(arg) {
  var fmt = document.createDocumentFragment()
  var objE = document.createElement('div')
  objE.innerHTML = arg
  if (objE.childNodes.forEach)
    objE.childNodes.forEach(function(ele, i) {
      fmt.appendChild(ele)
    })
  else
    for (var i = 0, length = objE.childNodes.length; i < length; i += 1) {
      // 文档片段加载克隆的节点
      fmt.appendChild(objE.childNodes[0])
    }
  return fmt
}
Acan.int = function(s) {
  if (typeof(s) == 'number') return s
  if (s && s.indexOf('.') != -1) return parseFloat(s)
  else return parseInt(s)
}
Acan.trim = function(str) {
  if (typeof(str) != 'string') return str
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

Acan.regexp = {
  'mail': /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)/,
  'mailOrPhone': /(([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)|1(3|5|8)\d{9}$)/,
  'phone': /^1(3|4|5|7|8)\d{9}$/,
  'tel': /(^\d{3,4}-\d{7,8})$/,
  'qq': /^(\d{5,11}|0)$/,
  'mobile': {
    '86': /^1(3|4|5|7|8)\d{9}$/,
    '64': /^0?2\d{6,9}$/,
  },
  ipv4: /(1\d\d|2[0-4]\d|25[0-5]|\d{1,2})\.(1\d\d|2[0-4]\d|25[0-5]|\d{1,2})\.(1\d\d|2[0-4]\d|25[0-5]|\d{1,2})\.(1\d\d|2[0-4]\d|25[0-5]|\d{1,2})/,
  ipv6: /[a-f\d]/,
  mac: /([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})/,
  eth: /[\d]x[a-f\d]+/,
  isChinaMobile: /^134[0-8]\d{7}$|^(?:13[5-9]|147|15[0-27-9]|178|18[2-478])\d{8}$/, //移动方面最新答复
  isChinaUnion: /^(?:13[0-2]|145|15[56]|176|18[56])\d{8}$/, //向联通微博确认并未回复
  isChinaTelcom: /^(?:133|153|177|18[019])\d{8}$/, //1349号段 电信方面没给出答复，视作不存在
  isOtherTelphone: /^170([059])\d{7}$/, //其他运营商
}

/*
* 时间处理函数
* type 为需要转换的格式,t为指定的时间,默认为当前时间,可以是时间戳/日期格式/ISODate
* Acan.time('Y-m-d')="2013-05-01"
*/
Acan.time = function (type, t, no0, lang) {
  lang = lang || 'zh'
  if (!type) type = 's'
  if (Acan.isStr(t)) {
    t = t.replace('年', '-').replace('月', '-').replace('日', ' ').replace('时', ':').replace('分', ':').replace('秒', ' ')
    if (t.substr(-1, 1) === ':') {
      t += '00'
    }
  }
  var weeks = {
    zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }
  var APs = [{zh: '上午', en: 'AM'}, {zh: '下午', en: 'PM'}]
  var Months = [
    {zh: '1月', en: 'Jan'},
    {zh: '2月', en: 'Feb'},
    {zh: '3月', en: 'Mar'},
    {zh: '4月', en: 'Apr'},
    {zh: '5月', en: 'May'},
    {zh: '6月', en: 'Jun'},
    {zh: '7月', en: 'Jul'},
    {zh: '8月', en: 'Aug'},
    {zh: '9月', en: 'Sep'},
    {zh: '10月', en: 'Oct'},
    {zh: '11月', en: 'Nov'},
    {zh: '12月', en: 'Dec'}
  ]
  var now
  if (!t) now = new Date()
  else if (t > 0 && t < 9000000000) {
    now = new Date(t * 1000)
  } else if (t > 9000000000) {
    now = new Date(t)
  } else if (typeof (type) === 'string') {
    now = new Date(t)
    if (isNaN(now.getTime())) {
      if (t.indexOf(' ')) {
        t = t.replace(' ', 'T')
        now = new Date(t)
        now = new Date(now.getTime() - 3600 * 8000)
      } else if (t.indexOf('T')) {
        t = t.replace('T', ' ')
        now = new Date(t)
        now = new Date(now.getTime() + 3600 * 8000)
      }
    }
  } else if (Acan.isDate(t)) { now = t }
  if (type === 's') return Math.floor(now.getTime() / 1000)
  else if (type === 'ms') return now.getTime()
  else if (type.length > 0) {
    var day = {}
    day.Y = now.getFullYear()
    day.m = now.getMonth() + 1
    if (lang === 'en') day.m = Months[day.m][lang]
    day.d = now.getDate()
    day.H = now.getHours()
    day.h = day.H
    day.A = APs[0][lang]
    if (day.h > 12) {
    	day.A = APs[1][lang]
    	day.h = day.h - 12
    }
    day.i = now.getMinutes()
    day.s = now.getSeconds()
    day.M = now.getMilliseconds()
    day.w = now.getDay()
    day.W = weeks[lang][day.w]
    day.z = '+' + Acan.time.n2s(Math.abs(now.getTimezoneOffset()))
    day.Z = now.getTimezoneOffset() / 60
    var krr = []
    for (var key in day) {
      krr.push(key)
    }
    type = type.replace(new RegExp('(' + krr.join('|') + ')', 'g'), function (e, key) {
      if (day[key] < 10 && key !== 'Z' && key !== 'w' && (!no0 || key === 'i' || key === 's')) day[key] = '0' + day[key]
      return day[key] || ''
    })
    return type
  }
}
// 480 -> 08:00 时区差 分钟转小时
Acan.time.n2s = function (n) {
  var r = ''
  var h = Math.floor(n / 60)
  var s = n % 60
  if (h < 60) { r += (h < 10 ? ('0' + h) : h) + ':' + (s < 10 ? ('0' + s) : s) }
  return r
}

//计算年龄 传入 单个参数 date 或者 三个参数 year,month,day
Acan.age = function(year, month, day) {
  if (arguments.length == 1) {
    var bday = year
    if (!/[\d]{10,12}/.test(year)) bday = Acan.time('s', year)
    month = Acan.time('m', bday)
    day = Acan.time('d', bday)
    year = Acan.time('Y', bday)
  }
  var age = Acan.time('Y') - year
  var nowmonth = Acan.time('m')
  var nowday = Acan.time('d')
  if (nowmonth > month) {
    age++
  } else if (nowmonth == month) {
    if (nowday > day) {
      age++
    }
  }
  return age
}
//找星座
Acan.xingzuo = function(date) {
  var bday = date,
    md, rs = ''
  if (!/[\d]{10,12}/.test(date)) bday = Acan.time('s', date)
  md = Acan.int(Acan.time('md', bday))
  var xingzuo = {
    '白羊座': [321, 419],
    '金牛座': [420, 520],
    '双子座': [521, 621],
    '巨蟹座': [622, 722],
    '狮子座': [723, 822],
    '处女座': [823, 922],
    '天枰座': [923, 1023],
    '天蝎座': [1024, 1122],
    '射手座': [1123, 1221],
    '摩羯座': [1222, 119],
    '水瓶座': [120, 218],
    '双鱼座': [219, 320]
  }
  for (var i in xingzuo) {
    if (md >= xingzuo[i][0] && md <= xingzuo[i][1]) {
      rs = i
    }
  }
  return rs
}

Acan.mkdirs = function(dpath) {
  var fs = require('fs'),
    path = require('path')
  if (!fs.existsSync(path.dirname(dpath))) {
    Acan.mkdirs(path.dirname(dpath))
  }
  if (!fs.existsSync(dpath)) {
    fs.mkdirSync(dpath)
  }
  return true
}

//express req.files parse to obj
Acan.req_files_parse = function(files) {
  for (var name in files) {
    var nrr = name.match(/[^\[\]]+/g)
    if (nrr.length > 1) {
      Acan.files_parse_c(nrr, files, files[name])
      delete files[name]
    }
  }
  return files
}
Acan.files_parse_c = function(nrr, pbj, val) {
  if (nrr.length > 0) {
    var tn = nrr.shift()
  }
  if (nrr.length > 0) {
    if (!pbj[tn]) {
      pbj[tn] = {}
    }
    if (nrr.length > 0)
      Acan.files_parse_c(nrr, pbj[tn], val)
  } else if (nrr.length == 0) {
    if (!pbj[tn]) {
      pbj[tn] = val
    } else {
      if (!Acan.isArr(pbj[tn])) pbj[tn] = [pbj[tn]]
      pbj[tn].push(val)
    }
    return pbj
  }
}
// form parse to obj
Acan.form_parse = function(files) {
  for (var name in files) {
    var nrr = name.match(/[^\[\]]+/g)
    if (nrr.length > 1) {
      Acan.form_parse_c(nrr, files, files[name])
      delete files[name]
    }
  }
  return files
}
Acan.form_parse_c = function(nrr, pbj, val) {
  if (nrr.length > 0) {
    var tn = nrr.shift()
  }
  if (nrr.length > 0) {
    if (!pbj[tn]) {
      pbj[tn] = {}
    }
    if (nrr.length > 0)
      Acan.form_parse_c(nrr, pbj[tn], val)
  } else if (nrr.length == 0) {
    if (!pbj[tn]) {
      pbj[tn] = val
    } else {
      if (!Acan.isArr(pbj[tn])) pbj[tn] = [pbj[tn]]
      pbj[tn].push(val)
    }
    return pbj
  }
}
//交集
Acan.intersection = function() {
  var ir = []
  if (arguments.length < 2) return ir
  var fr = arguments[0]
  if (Acan.isArr(fr)) {
    for (var fi = 0; fi < fr.length; fi++) {
      var p = true
      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i] || arguments[i].indexOf(fr[fi]) === -1) p = false
      }
      if (p) ir.push(fr[fi])
    }
    return ir
  }
}

/*新老对象变化
@o 旧对象
@n 新对象
@pArr (可选) 上级调用的父对象是否是数组
*/
Acan.objModify = function(o, n, pArr) {
  var rs = {},
    old = {},
    m = false,
    isArr = false
  if (Acan.isArr(o)) {
    isArr = true
    rs = [] //记录新值
    old = [] //保存原值
  }
  if (typeof(o) !== 'object' || typeof(n) !== 'object') return
  if (isArr) {
    var n2 = [],
      ni = []
    o.forEach(function(v, i) {
      if (!Acan.isDefined(n[i])) return
      if (typeof(v) == 'object' && typeof(n[i]) == 'object') {
        if (Acan.isEmpty(v) && Acan.isEmpty(n[i])) {
          //delete n[i];
        } else {
          var tmp = Acan.objModify(v, n[i], isArr)
          if (Acan.isArr(tmp)) {
            rs.push(tmp[0])
            m = true //有变化
            if (Acan.isDefined(tmp[1])) {
              old.push(tmp[1])
            }
          } else {
            n2.push(n[i])
          }
        }
      } else if (v != n[i]) {
        m = true //有变化
        rs.push(n[i])
        old.push(v)
      }
    })
    if (Acan.isEmpty(o)) {

    } else {
      n = n2
    }
  } else {
    m = Acan.objModifyObj(o, n, pArr, rs, old, m)
  }
  if (pArr && !Acan.isEmpty(rs) && o._id) { //mongodb 对象专用，数组文档更新的_id
    rs._id = o._id
    old._id = o._id
  }
  Acan.objClean(n) //清除空数据
  Acan.objClean(rs) //清除空数据
  Acan.objClean(old) //清除空数据
  if (!Acan.isEmpty(n)) m = true //新增数据
  Acan.extend(rs, n)
  if (!m) return //无变化
  return [rs, old]
}
//比较新老对象的变化
Acan.objModifyObj = function(o, n, pArr, rs, old, m) {
  for (var i in o) {
    if (!Acan.isDefined(n[i])) continue //新的对象中不存在老的索引 跳过
    if (typeof(o[i]) == 'object' && typeof(n[i]) == 'object') { //存在并且是对象
      if (Acan.isEmpty(o[i])) {
        if (Acan.isEmpty(n[i])) delete n[i] //都是空对象 删除
      } else {
        var tmp = Acan.objModify(o[i], n[i], false)
        if (!Acan.isArr(tmp)) {
          delete n[i]
          continue
        }
        rs[i] = tmp[0]
        old[i] = tmp[1]
        if (!rs[i]) delete rs[i]
        if (!old[i]) delete old[i]
        else m = true //有变化
      }
    } else if (o[i] != n[i]) { //存在并且不一致
      m = true //有变化
      rs[i] = n[i]
      old[i] = o[i]
      delete n[i]
    } else { //存在并且一致
      delete n[i]
    }
  }
  return m
}
//数组移除指定索引值
Acan.arrRm = function(arr, i) {
  if (!Acan.isArr(arr)) return arr
  if (!Acan.isArr(i)) i = [i]
  var nrr = []
  arr.forEach(function(v, k) {
    if (i.indexOf(k) === -1) {
      nrr.push(v)
    }
  })
  return nrr
}
/*
	数组移除指定属性的元素
	@arr 数组
	@key 子属性
	@val String,Array 属性对应的值，可以是数组
	*/
Acan.arrRmc = function(arr, key, val) {
  if (!Acan.isArr(arr)) return arr
  if (!Acan.isArr(val)) val = [val]
  var nrr = []
  arr.forEach(function(v, k) {
    if (v[key] && Acan.inArr(v[key], val)) {} else {
      nrr.push(v)
    }
  })
  return nrr
}
/*
	清除对象中空的信息
	@no 需要处理的对象
	@p 内部参数 判断是否是子调用
	*/
Acan.objClean = function(no, __p) {
  if (Acan.isArr(no)) {
    var trr = []
    no.forEach(function(v, k) {
      if (typeof(v) == 'object') {
        v = Acan.objClean(v, 1)
      }
      if (!Acan.isEmpty(v)) trr.push(v)
    })
    no = trr
    if (__p && Acan.isEmpty(no)) {
      return
    }
    return no
  } else if (Acan.isObj(no)) {
    for (var i in no) {
      if (Acan.isEmpty(no[i])) delete no[i]
      else if (typeof(no[i]) == 'object') {
        no[i] = Acan.objClean(no[i], 1)
        if (!Acan.isDefined(no[i])) delete no[i]
      }
    }
    if (no._id && Acan.isObjectId(no._id) && Acan.count(no) === 1) {
      if (__p) return
      else return {}
    }
  }
  return no
}

/*
浏览器获取位置
@cb(lat,lng)
*/
Acan.geolocation = function(cb) {
  if (navigator.platform.indexOf('iPhone') != -1) {
    navigator.geolocation.getCurrentPosition(function(pt) {
      if (cb) cb(pt.coords.latitude, pt.coords.longitude)
      /*
		{"coords":{"speed":0.6417,"accuracy":200,"altitudeAccuracy":10,"altitude":13.162527,"longitude":"121.58126","heading":null,"latitude":29.874707},"timestamp":13878}
		*/
    })
  } else if (navigator.platform.indexOf('Win32') != -1) {
    if (cb) cb(29.87, 121.58)
  }
}
Acan.Rad = function(d) {
  return d * Math.PI / 180.0 //经纬度转换成三角函数中度分表形式。
}
Acan.deg_dec = function(latlng, d) { //经纬度(度数)转换为十进制
  var arr = latlng
  var dec = arr[0] + arr[1] / 60 + arr[2] / 3600
  if (d == 'S') dec = 0 - dec
  return dec
}
//gps 坐标转换
Acan.gps_chg = function(latlng, tp) {
  if (!tp) tp = 'google'
  var locx = { google: [-0.0026344052208919777, 0.004082322118890147], baidu: [0.0031106456141110073, 0.010663661728884222] }
  var arr = latlng
  if (Acan.isStr(latlng)) arr = latlng.split(',')
  arr[0] = Acan.int(arr[0]) + locx[tp][0]
  arr[1] = Acan.int(arr[1]) + locx[tp][1]
  if (Acan.isStr(latlng)) return arr.join(',')
  return arr
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度 ;unit:距离单位;acc:精度
Acan.GetDistance = function(lat1, lng1, lat2, lng2, unit, acc) {
  if (Acan.isArr(lat1) && Acan.isArr(lng1)) {
    if (lat2) unit = lat2
    if (lat2 && lng2) acc = lng2
    lng2 = lng1[1]
    lat2 = lng1[0]
    lng1 = lat1[1]
    lat1 = lat1[0]
  }
  //console.log(lat1,lng1,lat2,lng2,unit,acc)
  if (!unit) unit = 'm'
  var ac = 1
  if (acc > 0)
    for (var i = 0; i < acc; i++) ac = ac * 10
  var radLat1 = Acan.Rad(lat1)
  var radLat2 = Acan.Rad(lat2)
  var a = radLat1 - radLat2
  var b = Acan.Rad(lng1) - Acan.Rad(lng2)
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
		Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137 // EARTH_RADIUS;
  if (unit == 'km')
    s = Math.round(s * ac) / ac //输出为公里
  if (unit == 'm')
    s = Math.round(s * 1000 * ac) / ac
  //s=s.toFixed(4);
  if (isNaN(s)) s = -1
  return s
}

Acan.obj_json = function(o) {
  try {
    if (JSON) return JSON.stringify(o)
  } catch (e) {
    var r = []
    if (o === null) return 'null'
    if (typeof o == 'string') return '"' + o.replace(/([\'\"\\])/g, '\\$1').replace(/(\n)/g, '\\n').replace(/(\r)/g, '\\r').replace(/(\t)/g, '\\t') + '"'
    if (typeof o == 'undefined') return '""' //未知的变量返回空
    if (typeof o == 'object') {
      if (Acan.count(o) == 0) {
        return ''
      } //空的对象返回空
      if (o === null) return 'null'
      //	else if(!o.sort){
      for (var i in o) {
        if (i == 'length') {
          continue
        }
        r.push('"' + i + '"' + ':' + Acan.obj_json(o[i]))
      }
      r = '{' + r.join() + '}'
      /*		}else{
						for(var i =0;i<o.length;i++)
							r.push(Acan.obj_json(o[i]))
						r="["+r.join()+"]"
					}*/
      return r
    }
    if (typeof o == 'number') {
      return o.toString()
    }
    return o.toString()
  }
}

Acan.json_obj = function(str) { //-- json字符串 -> 对象
  if (typeof str == 'string') {
    if (Acan.inArr(str.substring(0, 1), ['{', '[', '"'])) /*}*/
      return (new Function('return ' + str))()
    if (Acan.inArr(str, ['true', 'false']))
      return JSON.parse(str)
    return str
  } else
    return str
}

//获取对象的属性列表
Acan.obj_key = function(obj) {
  if (Acan.isStr(obj)) return obj
  if (typeof(obj) != 'object') return ''
  var str = []
  for (var i in obj) {
    str.push(i)
  }
  return str
}

//对象 转cookie 字符串
Acan.obj_cookie = function (obj) {
  if (Acan.isStr(obj)) return obj
  if (typeof (obj) !== 'object') return ''
  var str = []
  Acan.each(obj, function (v, k) {
    str.push(k + '=' + v)
  })
  return str.join('; ')
}
//
Acan.obj_form = function(obj) {
  if (Acan.isStr(obj)) return obj
  if (typeof(obj) != 'object') return ''
  var str = ''
  for (var i in obj) {
    str += '&' + i + '=' + encodeURI(obj[i])
  }
  return str
}
//获取对象指定条数，默认是最后几条
Acan.obj_list = function(obj, num, type) {
  if (!type) type = 'end'
  var cl = Acan.count(obj) - num
  if (cl > 0) {
    var li = 0
    for (var i in obj) {
      if (type == 'end') {
        if (li == cl) {
          break
        }
        delete obj[i]
        li++
      } else {
        if (li <= num) {
          continue
        }
        delete obj[i]
        li++
      }
    }
  }
  return obj
}
//对象根据属性排序
Acan.obj_sort = function(arr, prop, desc) {
  if (typeof(arr[0]) !== 'object' && Array.prototype.sort) {
    return arr.sort(function(a, b) {
      if (desc) return b[prop] - a[prop]
      else return a[prop] - b[prop]
    })
  }
  var props = [],
    ret = [],
    i = 0,
    len = Acan.count(arr)
  if (typeof prop == 'string') {
    for (; i < len; i++) {
      var oI = arr[i];
      (props[i] = new String(oI && oI[prop] || ''))._obj = oI
    }
  } else if (typeof prop == 'function') {
    for (; i < len; i++) {
      var oI = arr[i];
      (props[i] = new String(oI && prop(oI) || ''))._obj = oI
    }
  } else {
    throw '参数类型错误'
  }
  props.sort()
  for (i = 0; i < len; i++) {
    ret[i] = props[i]._obj
  }
  if (desc) ret.reverse()
  return ret
}
//对象排序
Acan.objSort = function (obj, desc) {
  if (Acan.isArr(obj)) return Acan.arrSort.apply(Acan.arrSort, arguments)
  var sdic = Object.keys(obj).sort()
  var o = {}
  for (ki in sdic) {
    o[sdic[ki]] = obj[sdic[ki]]
  }
  return obj = o
}
//数组排序
Acan.arrSort = function (array, prop, desc) {
  if(!desc) desc = 'asc'
  if(!prop) throw '没有参数'
  array.sort(getSortFun(desc, prop))
  function getSortFun(order, sortBy) {
    var ordAlpah = (order == 'asc') ? '>' : '<'
    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1')
    return sortFun
  }
}
Acan.unique = function (arr) {
  var h = {}
  var rs = []
  arr.forEach(function (v) {
    if (!h[v]) rs.push(v)
    h[v] = 1
  })
  return rs
}
Acan.groupBy = function(obj, val) {
  var result = {}
  // val将被转换为进行分组的处理器函数, 如果val不是一个Function类型的数据, 则将被作为筛选元素时的key值
  var iterator = Acan.isFun(val) ? val : function(obj) {
    return obj[val]
  }
  // 迭代集合中的元素
  for (var i in obj) {
    // 将处理器的返回值作为key, 并将相同的key元素放到一个新的数组
    var key = iterator(obj[i], i)
    if (Acan.isArr(key)) { //key为数组时，拆分归组
      key.forEach(function(v, k) {
        (result[v] || (result[v] = [])).push(obj[i])
      })
    } else {
      (result[key] || (result[key] = [])).push(obj[i])
    }
  }
  // 返回已分组的数据
  return result
}

// ---------Acan.url 类---------
/*
*/
Acan.url = function () {
}
// url解析
Acan.url.parse = function (url) {
  var o = {}
  var s = ''
  if (url) {
    try {
      s = url.split('?')[1] || ''
    } catch (e) { return {} }
  } else if (location && location.search) {
    s = location.search.substr(1)
  }
  s.split('&').forEach(function (v) {
    if (!v || !Acan.isDefined(v) || v.length < 1) return
    var vr = v.split('=')
    o[vr[0]] = decodeURIComponent(vr[1])
  })
  if (!url) Acan.url.obj = o
  return o
}
// 合并aurl
Acan.url.unite = function (o, p, ec) {
  var url = []
  if (Acan.isObj(o)) {
    for (var i in o) {
      var key = i
      if (p) key = p + '[' + i + ']'
      if (Acan.isObj(o[i])) {
        url.push(Acan.url.unite(o[i], key))
      } else {
        if (ec) {
          url.push(key + '=' + encodeURIComponent(o[i]))
        } else {
          url.push(key + '=' + encodeURI(o[i]))
        }
      }
    }
  }
  return url.join('&')
}

Acan.base64encodechars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
Acan.base64decodechars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1)
Acan.base64encode = function(str) {
  var out, i, len
  var c1, c2, c3
  len = str.length
  i = 0
  out = ''
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff
    if (i == len) {
      out += Acan.base64encodechars.charAt(c1 >> 2)
      out += Acan.base64encodechars.charAt((c1 & 0x3) << 4)
      out += '=='
      break
    }
    c2 = str.charCodeAt(i++)
    if (i == len) {
      out += Acan.base64encodechars.charAt(c1 >> 2)
      out += Acan.base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
      out += Acan.base64encodechars.charAt((c2 & 0xf) << 2)
      out += '='
      break
    }
    c3 = str.charCodeAt(i++)
    out += Acan.base64encodechars.charAt(c1 >> 2)
    out += Acan.base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
    out += Acan.base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6))
    out += Acan.base64encodechars.charAt(c3 & 0x3f)
  }
  return out
}
Acan.base64decode = function(str) {
  var c1, c2, c3, c4
  var i, len, out
  len = str.length
  i = 0
  out = ''
  while (i < len) {
    do {
      c1 = Acan.base64decodechars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c1 == -1)
    if (c1 == -1)
      break
    do {
      c2 = Acan.base64decodechars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c2 == -1)
    if (c2 == -1)
      break
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))
    do {
      c3 = str.charCodeAt(i++) & 0xff
      if (c3 == 61)
        return out
      c3 = Acan.base64decodechars[c3]
    } while (i < len && c3 == -1)
    if (c3 == -1)
      break
    out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2))
    do {
      c4 = str.charCodeAt(i++) & 0xff
      if (c4 == 61)
        return out
      c4 = Acan.base64decodechars[c4]
    } while (i < len && c4 == -1)
    if (c4 == -1)
      break
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
  }
  return out
}

Acan.SHA1 = function(msg) {
  function rotate_left(n, s) {
    var t4 = (n << s) | (n >>> (32 - s))
    return t4
  }

  function lsb_hex(val) {
    var str = '',
      i, vh, vl
    for (i = 0; i <= 6; i += 2) {
      vh = (val >>> (i * 4 + 4)) & 0x0f
      vl = (val >>> (i * 4)) & 0x0f
      str += vh.toString(16) + vl.toString(16)
    }
    return str
  }

  function cvt_hex(val) {
    var str = '',
      i, v
    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f
      str += v.toString(16)
    }
    return str
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, '\n')
    var utftext = ''
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  }
  var blockstart
  var i, j, temp
  var W = new Array(80)
  var H0 = 0x67452301
  var H1 = 0xEFCDAB89
  var H2 = 0x98BADCFE
  var H3 = 0x10325476
  var H4 = 0xC3D2E1F0
  var A, B, C, D, E
  msg = Utf8Encode(msg)
  var msg_len = msg.length
  var word_array = new Array()
  for (i = 0; i < msg_len - 3; i += 4) {
    j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
				msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3)
    word_array.push(j)
  }
  switch (msg_len % 4) {
  case 0:
    i = 0x080000000
    break
  case 1:
    i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000
    break
  case 2:
    i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000
    break
  case 3:
    i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80
    break
  }
  word_array.push(i)
  while ((word_array.length % 16) != 14) word_array.push(0)
  word_array.push(msg_len >>> 29)
  word_array.push((msg_len << 3) & 0x0ffffffff)
  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i]
    for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
    A = H0
    B = H1
    C = H2
    D = H3
    E = H4
    for (i = 0; i <= 19; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
      E = D
      D = C
      C = rotate_left(B, 30)
      B = A
      A = temp
    }
    for (i = 20; i <= 39; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
      E = D
      D = C
      C = rotate_left(B, 30)
      B = A
      A = temp
    }
    for (i = 40; i <= 59; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
      E = D
      D = C
      C = rotate_left(B, 30)
      B = A
      A = temp
    }
    for (i = 60; i <= 79; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
      E = D
      D = C
      C = rotate_left(B, 30)
      B = A
      A = temp
    }
    H0 = (H0 + A) & 0x0ffffffff
    H1 = (H1 + B) & 0x0ffffffff
    H2 = (H2 + C) & 0x0ffffffff
    H3 = (H3 + D) & 0x0ffffffff
    H4 = (H4 + E) & 0x0ffffffff
  }
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4)
  return temp.toLowerCase()

}


Acan.MD5 = (function ($) {
  'use strict'
  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd (x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff (a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg (a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[((len + 64) >>> 9 << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5 (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5c5c5c5c
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5 (s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5 (s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5 (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5 (k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }
  return md5
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return md5
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
})(this)

//将字符串转化为UTF-8
Acan.EncodeUtf8 = function(s1) {
  var s = escape(s1)
  var sa = s.split('%')
  var retV = ''
  if (sa[0] != '') {
    retV = sa[0]
  }
  for (var i = 1; i < sa.length; i++) {
    if (sa[i].substring(0, 1) == 'u') {
      retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)))
    } else retV += '%' + sa[i]
  }
  return retV
}
//html 的转义
Acan.jsstr = function() {
  this.REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g
  this.REGX_HTML_DECODE = /&\w+;|&#(\d+);/g
  this.REGX_TRIM = /(^\s*)|(\s*$)/g
  this.HTML_DECODE = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&nbsp;': ' ',
    '&quot;': '"',
    '&copy;': ''
    // Add more
  }
  this.encodeHtml = function(s) {
    s = (s != undefined) ? s : this.toString()
    return (typeof s != 'string') ? s : s.replace(this.REGX_HTML_ENCODE,
      function($0) {
        var c = $0.charCodeAt(0),
          r = ['&#']
        c = (c == 0x20) ? 0xA0 : c
        r.push(c)
        r.push(';')
        return r.join('')
      })
  }
  this.decodeHtml = function(s) {
    var HTML_DECODE = this.HTML_DECODE
    s = (s != undefined) ? s : this.toString()
    return (typeof s != 'string') ? s : s.replace(this.REGX_HTML_DECODE,
      function($0, $1) {
        var c = HTML_DECODE[$0]
        if (c == undefined) {
          // Maybe is Entity Number
          if (!isNaN($1)) {
            c = String.fromCharCode(($1 == 160) ? 32 : $1)
          } else {
            c = $0
          }
        }
        return c
      })
  }
  this.trim = function(s) {
    s = (s != undefined) ? s : this.toString()
    return (typeof s != 'string') ? s : s.replace(this.REGX_TRIM, '')
  }
  this.hashCode = function() {
    var hash = this.__hash__,
      _char
    if (hash == undefined || hash == 0) {
      hash = 0
      for (var i = 0, len = this.length; i < len; i++) {
        _char = this.charCodeAt(i)
        hash = 31 * hash + _char
        hash = hash & hash // Convert to 32bit integer
      }
      hash = hash & 0x7fffffff
    }
    this.__hash__ = hash
    return this.__hash__
  }
}
Acan.jsstr.call(String.prototype)

function Str2Hex(s) {
  var c = ''
  var n
  var ss = '0123456789ABCDEF'
  var digS = ''
  for (var i = 0; i < s.length; i++) {
    c = s.charAt(i)
    n = ss.indexOf(c)
    digS += Dec2Dig(eval(n))

  }
  //return value;
  return digS
}

function Dec2Dig(n1) {
  var s = ''
  var n2 = 0
  for (var i = 0; i < 4; i++) {
    n2 = Math.pow(2, 3 - i)
    if (n1 >= n2) {
      s += '1'
      n1 = n1 - n2
    } else
      s += '0'
  }
  return s
}

function Dig2Dec(s) {
  var retV = 0
  if (s.length == 4) {
    for (var i = 0; i < 4; i++) {
      retV += eval(s.charAt(i)) * Math.pow(2, 3 - i)
    }
    return retV
  }
  return -1
}

function Hex2Utf8(s) {
  var retS = ''
  var tempS = ''
  var ss = ''
  if (s.length == 16) {
    tempS = '1110' + s.substring(0, 4)
    tempS += '10' + s.substring(4, 10)
    tempS += '10' + s.substring(10, 16)
    var sss = '0123456789ABCDEF'
    for (var i = 0; i < 3; i++) {
      retS += '%'
      ss = tempS.substring(i * 8, (eval(i) + 1) * 8)
      retS += sss.charAt(Dig2Dec(ss.substring(0, 4)))
      retS += sss.charAt(Dig2Dec(ss.substring(4, 8)))
    }
    return retS
  }
  return ''
}
Acan.trace = function() {
  var err = new Error
  err.name = 'Trace'
  Error.captureStackTrace(err, arguments.callee)
  console.error(err.stack)
}


Acan.uaParse = function (ua) {
  var o = {
    version: (ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
    webkit: /webkit/i.test(ua),
    safari: /safari/i.test(ua),
    opera: /opera/i.test(ua),
    msie: /msie/i.test(ua) && !/opera/.test(ua),
    mozilla: /mozilla/i.test(ua) && !/(compatible|webkit)/.test(ua),
    isWp: /windows phone/i.test(ua),
    isIphone: /iphone/i.test(ua),
    isAndroid: /android/i.test(ua),
    isWechat: /micromessenger/i.test(ua),
    isQQ: /\sqq\/\d/i.test(ua),
    appcan: /appcan/i.test(ua),
    btopCordova: /btopcordova/i.test(ua),
    container: /aiyiwebcontainer/i.test(ua),
    theworld: /theworld/i.test(ua),
    apicloud: /apicloud/i.test(ua)
  }
  o.isIos = (o.isIpad || o.isIphone) || false // 是否ios
  o.isSafari = false
  if (o.isIos && !o.isWechat && !o.appcan && !o.btopCordova) {
    o.isSafari = /safari/i.test(ua) // 是否ios下的原生浏览器
  }
  o.isMobile = (o.isIos || o.isAndroid) || false // 是否移动设备
  return o
}

module.exports = Acan
