const express = require("express");
const app = express();
const path = require("path");
const fs = require("node:fs/promises");
const cookieParser = require("cookie-parser");
const session = require("express-session");
//配置静态资源路径
app.use(express.static(path.resolve(__dirname, "public")));
//配置请求体解析
app.use(express.urlencoded({ extended: true }));
//将ejs设置为默认的模板引擎
app.set("view engine", "ejs");
//配置模板的路径
app.set("views", path.resolve(__dirname, "views"));
//设置cookie-parser
app.use(cookieParser());
app.use(session({
    secret: "yiting"
}));

const userRouter = require("./routes/users");
const goodsRouter = require("./routes/goods");

//使路由生效
app.use("/users", userRouter);
app.use("/goods", goodsRouter);
app.use("/laopos", require("./routes/laopos"));

app.get("/", (req, res) => {
    res.render("login")
});
app.post("/login", (req, res) => {
    const { username, pwd } = req.body
    if (username === "admin" && pwd === "123123") {
        //将username放到cookie里
        res.cookie("username", username)
        // res.send("<h1>登录成功！</h1>")
        res.redirect("/laopos/list")
    } else {
        res.send("<h1>登录失败，用户名或密码错误，请重新输入！</h1>")
    }
});


app.get("/set", (req, res) => {
    //给客户端发送一个cooki
    req.session.username = "何依婷"
    res.send("查看session")
});
app.get("/get", (req, res) => {
    console.log(req.session.username);
    res.send("读取session")
});


//可以在所有路由的后面配置错误路由
app.use((req, res) => {
    //只要该中间件一执行，说明以上所有地址都没匹配
    res.status(404);
    res.send("<h1>外星人劫持了该网页，请稍后再来</h1>")
});

app.listen(3000, () => {
    console.log("服务器已启动！");
});