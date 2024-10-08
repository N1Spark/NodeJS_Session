import express from "express";
import session from "express-session";
import exphbs from "express-handlebars";
import path from "node:path";
import cookieParser from "cookie-parser";
import "dotenv/config";
import siteRoutes from "./routes/site-routes.js";
import navbar from "./middleware/navbar-middleware.js";
import userRoutes from "./routes/user-routes.js";
import { checkUser } from "./middleware/user-middleware.js"
const PORT = process.env.PORT || 3000;
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
});

const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
}))
app.use(checkUser);
app.use(navbar);
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join("src", "views"));
app.use(express.urlencoded({ extended: true }));
app.use(siteRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}`)
);