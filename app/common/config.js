'use strict'

const config={
    api:{
        base:"http://rap.taobao.org/mockjs/11759/",
        list:"api/list",
        comments:"api/comments",
        comment:"api/comment",
        verifycode:"api/verifycode",
        signin:"api/signin",
    },
    fetchMap:{
        method:"POST",
        headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
        },
        follow:20,
        timeout:8000,
        size:0
    }
}
module.exports = config;