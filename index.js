const express = require("express");
const app = express();
const path = require("path");
const fs = require("node:fs/promises");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const USERS = require("./date/users.json")
const uuid = require("uuid").v4;
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
    store: new FileStore({
        //指定session本地文件的路径
        path: path.resolve(__dirname, "./sessions"),
        //加密方式
        secret: "何依婷",
        //session的有效时间，单位秒
        ttl: 3600,
        //设置每隔一段时间清除一次session对象单位秒
        reapInterval: 3600
    }),
    secret: "yiting",
    cookie: {
        maxAge: 1000 * 3600
    }
}));

const userRouter = require("./routes/users");
const goodsRouter = require("./routes/goods");

//使路由生效
app.use("/users", userRouter);
app.use("/goods", goodsRouter);
app.use("/laopos", require("./routes/laopos"));

app.get("/", (req, res) => {
    // const token = uuid();
    // console.log(token);
    res.render("login");
});
app.post("/login", (req, res) => {
    const { username, pwd } = req.body
    const userName = USERS.find((items) => {
        return items.username == username && items.password == pwd
    });
    if (userName) {
        //将username放到session里，只在内存中，还没写进文件里，需要手动写进文件里
        req.session.loginUser = username
        // res.send("<h1>登录成功！</h1>")
        req.session.save(() => {
            res.redirect("/laopos/list")
        })
    } else {
        res.send("<h1>登录失败，用户名或密码错误，请重新输入！</h1>")
    }
});
//登出
app.get("/logout", (req, res) => {
    //使session失效
    req.session.destroy(() => {
        res.redirect("/")
    })
})


/* app.get("/set", (req, res) => {
    //给客户端发送一个cooki
    req.session.username = "何依婷"
    res.send("查看session")
});
app.get("/get", (req, res) => {
    console.log(req.session.username);
    res.send("读取session")
}); */


//可以在所有路由的后面配置错误路由
app.use((req, res) => {
    //只要该中间件一执行，说明以上所有地址都没匹配
    res.status(404);
    res.send("<h1>外星人劫持了该网页，请稍后再来</h1>")
});

app.listen(3001, () => {
    console.log("服务器已启动！");
});