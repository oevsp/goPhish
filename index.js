import express from "express";
import axios from "axios";
import { config } from "dotenv";
import { urlencoded, static as exppressStatic } from "express";

config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(urlencoded ({ extended: true }));
app.use(exppressStatic("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { content: null, submitted: false });
});

app.post("/check-url", async (req, res) => {
    const userUrl = req.body.url;
    const options = {
        method: "GET",
        url: "https://phishing-url-risk-api.p.rapidapi.com/url/",
        params: {url: userUrl},
        headers: {
            "x-rapidapi-host": process.env.API_HOST,
            "x-rapidapi-key": process.env.API_KEY
        }
    };
    try {
        const response = await axios.request(options);
        const result = response.data;
        res.render("index", { content: result, submitted: true });
    } catch (error) {
        console.error("Error calling rapidAPI: ", error);
        res.render("index", { content: null, submitted: true, error: "Error handling URL" });
    }
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})