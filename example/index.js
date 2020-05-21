import Blossa from "blossa";

const app = new Blossa();


app.get('/hello',(req, res) => {
    return res.send("world");
});

app.get('/hello/(?<year>[0-9]{4}).(?<month>[0-9]{2})',(req, res) => {
  return res.send("Params are " + JSON.stringify(req.params));
});
