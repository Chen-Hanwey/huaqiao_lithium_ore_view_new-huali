import request from "@/utils/request";

export function getTodoList(body){
  return request({
    url: '/myWork/todoWork/list',
    method: 'post',
    data: body
  })
}
