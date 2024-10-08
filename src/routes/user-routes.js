import { Router } from "express";
import { createUser } from "../middleware/user-middleware.js";
import { users } from "../data/users.js";
import bcrypt from "bcrypt";

const userRoutes = Router();

userRoutes.get("/", (req, res) => {
    res.json(users);
    res.end();
})

userRoutes
    .route("/signup")
    .get((req, res) => {
        if (req.session.user?.login)
            res.redirect("/");
        else
            res.render("form_register");
    })
    .post(createUser, (req, res) => {
        //TODO: перевiрка iснування body
        //валiдацiя даних console.log(validator.isEmail(req.body.email));
        // Хешуемо пароль console.log(bcrypt.hashSync(req.body.password, 10));
        //bcrypt.compareSync()
        // res.cookie("user", req.body.login, {
        //     httpOnly: true,
        //     maxAge: 1000 * 60 * 60,
        // });
        req.session.user = {
            login: req.body.login,
            email: req.body.email,
        }
        res.redirect("/");
    });

userRoutes
    .route("/signin")
    .get((req, res) => {
        if (req.session.user?.login)
            res.redirect("/");
        else
            res.render("form_auth");
    })
    .post((req, res) => {
        const { login, password } = req.body;
        const user = users.find(el => el.login === login || el.email === login);
        if (!user) {
            return res.status(400).send("Login or pass incorrect");
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Login or pass incorect");
        }
        req.session.user = {
            login: user.login,
            email: user.email,
        };
        res.redirect("/");
    });

userRoutes.get("/logout", (req, res) => {
    if (req.session.user?.login) {
        res.redirect("/");
        req.session.destroy();
    }
    else
        res.redirect("/");
})
export default userRoutes;