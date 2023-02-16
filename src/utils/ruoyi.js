/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */
import defaultSettings from "@/settings.js";

const baseURL = process.env.VUE_APP_BASE_API
//获取最新12月份数组（月份粒度）
export function getLastYearForDay (range) {
  let myDate = new Date(); // 获取今天日期
  const dateArray = [];
  for (let i = 0; i < range; i++) {
    if (i === 0) {
      myDate.setDate(myDate.getDate() - (range - 1));
    }
    let dayData = JSON.stringify(myDate.toLocaleDateString());
    dateArray.push(dayData.substring(6, dayData.length - 1));
    myDate.setDate(myDate.getDate() + 1);
  }
  return dateArray
}
// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 新增日期范围
export function addDateRange(params, dateRange) {
	var search = params;
	search.beginTime = "";
	search.endTime = "";
	if (null != dateRange && '' != dateRange) {
		search.beginTime = this.dateRange[0];
		search.endTime = this.dateRange[1];
	}
	return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).map((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return false;
		}
	})
	return actions.join('');
}

// 回显数据字典数组
export function selectDictLabelMultiArray(datas, value) {
  var actions = [];
  var arr = value.split(",")
  arr.forEach(item => {
    Object.keys(datas).map((key) => {
      if (datas[key].dictValue == ('' + item)) {
        actions.push(datas[key].dictLabel);
        return false;
      }
    })
  })

  return actions.join('，');
}

// 回显部门名称
export function selectDeptName(datas, value, fullShow = true) {
  let actions = []
  if (value && value.length > 0 && datas && datas.length > 0) {
    let tempData = datas
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < tempData.length; j++) {
        if (tempData[j].deptId == ('' + value[i])) {
          actions.push(tempData[j].deptName)
          tempData = tempData[j].children
          break
        }
      }
    }
  }
  if (fullShow) {
    return actions.join('-')
  } else {
    return actions[actions.length - 1] + ''
  }
}

// 回显部门名称
export function selectDeptNameByTree(datas, value, fullShow = true) {
  let actions = []
  if (value && value.length > 0 && datas && datas.length > 0) {
    let tempData = datas
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < tempData.length; j++) {
        if (tempData[j].id == ('' + value[i])) {
          actions.push(tempData[j].label)
          tempData = tempData[j].children
          break
        }
      }
    }
  }
  if (fullShow) {
    return actions.join('--')
  } else {
    return actions[actions.length - 1] + ''
  }
}

// 处理图片路径
export function handlePicturePath(path) {
  let array = [];
  if(path){
    array = [];
    array = path.toString().split(",");
    for(let i = 0; i < array.length; i++){
      array[i] = process.env.VUE_APP_PICTURE_PATH + array[i];
    }
  }
  return array;
}

// 处理照片墙的回显图片路径
export function handleFileList(pathArray) {
  let array = [];
  if(pathArray && pathArray.length > 0){
    for(let i = 0; i < pathArray.length; i++){
      let file = {};
      file['uid'] = guid();
      file['url'] = pathArray[i];
      array.push(file);
    }
  }
  return array;
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

// 处理单图片路径
export function handlePicturePathSingle(path) {
  let res = '';
  if(path&&path!=''){
      res = process.env.VUE_APP_PICTURE_PATH + path;
  }
  // else{
  //   res = require("@/assets/image/nopic.png")
  // }
  return res;
}

// 通用下载方法
export function download(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + false;
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  const treeData =  cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] == child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    if(father.children.length == 0){
      delete father.children;
    }
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != '' ? treeData : data;
}
