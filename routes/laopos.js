const express = require("express")
const router = express.Router()
let LAOPO_ARR = require("../date/laopolist.json")
const fs = require("node:fs/promises")
const path = require("path")
const uuid = require("uuid").v4

router.use((req, res, next) => {
    //获取一个请求头referer
    const referer = req.get("referer")
    // console.log("请求来自：", referer);
    if (!referer || !referer.startsWith("http://localhost:3001/")) {
        res.status(403).send("你没有此权限访问")
        return
    }
    if (req.session.loginUser) {
        next()
    } else {
        res.redirect("/")
    }
})

//老婆列表路由
router.get("/list", (req, res,) => {
    const csrfToken = uuid()
    req.session.csrfToken = csrfToken
    req.session.save(() => {
        res.render("laopo", {
            laopos: LAOPO_ARR,
            username: req.session.loginUser,
            csrfToken
        })
    })
    // if (req.session.loginUser) {
    // res.render("laopo", { laopos: LAOPO_ARR, username: req.session.loginUser })
    // } else {
    //     res.redirect("/")
    // }
})
//娶妻路由
router.post("/add", (req, res, next) => {
    //客户端发送的token
    const csrfToken = req.body._csrf
    const sessionToken = req.session.csrfToken
    // console.log(csrfToken);
    // console.log(sessionToken);
    req.session.csrfToken = null
    // console.log(csrfToken === sessionToken);
    if (csrfToken === sessionToken) {
        //生成一个id
        const id = LAOPO_ARR.at(-1) ? LAOPO_ARR.at(-1).id + 1 : 1;
        //获取用户填写的信息
        const newLaopo = {
            id,
            name: req.body.name,
            age: +req.body.age,
            sex: req.body.sex,
            voice: req.body.voice,
            angel: req.body.angel
        }
        //验证用户信息（先不写）

        //将用户信息添加到数组中
        LAOPO_ARR.push(newLaopo);

        //添加结束后返回响应
        //直接在提交的表单中渲染ejs，会面临表单重复提交的问题
        // res.render("laopo", { laopos: LAOPO_ARR })
        //调用next交给后续路由处理
        req.session.save(() => {
            next()
        })
    } else {
        res.status(403).send("<h2>token错误！</h2>")
    }

})

//休妻路由
router.get("/delete", (req, res, next) => {
    //获取要删除的学生的id
    const id = +req.query.id;
    //根据id删除学生
    LAOPO_ARR = LAOPO_ARR.filter((laopo) => laopo.id !== id);
    //将新的数据写入到JSON文件中
    next()
});

//修改个人信息
router.get("/to_update", (req, res) => {
    const id = +req.query.id;
    //获取要修改的后宫人员的信息
    const wife = LAOPO_ARR.find(item => item.id === id)
    res.render("update", { wife })
});
//提交表单
router.post("/update_laopo", (req, res, next) => {
    const id = req.query.id;
    const { name, age, sex, voice, angel } = req.body;
    const wifes = LAOPO_ARR.find(item => item.id == id);
    wifes.name = name;
    wifes.age = +age;
    wifes.sex = sex;
    wifes.voice = voice;
    wifes.angel = angel;
    next()
})

//处理储存文件的中间件
router.use((req, res) => {
    //将新的数据写到json文件里
    fs.writeFile(path.resolve(__dirname, "../date/laopolist.json"), JSON.stringify(LAOPO_ARR))
        .then(() => {
            //发起请求的重定向
            res.redirect("/laopos/list")
        }).catch(() => {
            console.log("操作失败！");
        });
})


module.exports = router