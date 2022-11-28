const express = require("express")
const router = express.Router()
router.get("/list", (req, res) => {
    res.send("<h1>这是商品路由</h1>")
})
module.exports = router