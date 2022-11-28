const express = require("express");
//创建router对象
const router = express.Router();

router.get("/list", (req, res) => {
    res.send("<h1>用户路由</h1>")
});
//将router暴露到模块外
module.exports = router;