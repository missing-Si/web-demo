const express = require("express");
const app = express();
const path = require("path");
const fs = require("node:fs/promises");
//配置静态资源路径
app.use(express.static(path.resolve(__dirname, "public")));
//配置请求体解析
app.use(express.urlencoded({ extended: true }));

let LAOPO_ARR = require("./date/laopolist.json");

let name = "时崎狂三";

//将ejs设置为默认的模板引擎
app.set("view engine", "ejs");
//配置模板的路径
app.set("views", path.resolve(__dirname, "views"));

app.get("/hello", (req, res) => {
    res.send("<h1>get路由</h1>")
});

app.get("/hougong", (req, res) => {
    res.render("laopo", { laopos: LAOPO_ARR })
});
app.get("/set_name", (req, res) => {
    name = req.query.name
    res.send("修改成功")
})

//添加一个创建老婆信息的路由
app.post("/add_laopo", (req, res) => {
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

    //将新的数据写到json文件里
    fs.writeFile(path.resolve(__dirname, "./date/laopolist.json"), JSON.stringify(LAOPO_ARR))
        .then(() => {
            //发起请求的重定向
            res.redirect("/hougong")
        }).catch(() => { });

    //添加结束后返回响应
    //直接在提交的表单中渲染ejs，会面临表单重复提交的问题
    // res.render("laopo", { laopos: LAOPO_ARR })

});
//删除人员
app.get("/delete", (req, res) => {
    //获取要删除的学生的id
    const id = +req.query.id;
    //根据id删除学生
    LAOPO_ARR = LAOPO_ARR.filter((laopo) => laopo.id !== id);
    //将新的数据写入到JSON文件中
    fs.writeFile(path.resolve(__dirname, "./date/laopolist.json"), JSON.stringify(LAOPO_ARR))
        .then(() => {
            //发起请求的重定向
            res.redirect("/hougong")
        }).catch(() => { });
});
//修改信息
app.get("/to_update", (req, res) => {
    const id = +req.query.id;
    //获取要修改的后宫人员的信息
    const wife = LAOPO_ARR.find(item => item.id === id)
    res.render("update", {wife})
    console.log(wife);
});
//提交表单
app.post("/update_laopo", (req, res) => {
    const id = req.query.id;
    const {name, age, sex, voice, angel} = req.body;
    const wifes = LAOPO_ARR.find(item => item.id == id);
    wifes.name = name;
    wifes.age = +age;
    wifes.sex = sex;
    wifes.voice = voice;
    wifes.angel = angel;
    //将新的数据写入到JSON文件中
    fs.writeFile(path.resolve(__dirname, "./date/laopolist.json"), JSON.stringify(LAOPO_ARR))
        .then(() => {
            //发起请求的重定向
            res.redirect("/hougong")
        }).catch(() => { });
})

//可以在所有路由的后面配置错误路由
app.use((req, res) => {
    //只要该中间件一执行，说明以上所有地址都没匹配
    res.status(404);
    res.send("<h1>外星人劫持了该网页，请稍后再来</h1>")
});

app.listen(3000, () => {
    console.log("服务器已启动！");
});