const express = require ("express")
const router = express.Router();

const {displayWelcome, login, register} = require("../controllers/user.controller")





router.get("/", displayWelcome);
router.post("/register", register);
router.post("/login", login);





module.exports = router;