const http = require("http");
const fs = require("fs");
const url = require("url");

const createServer = (configFilePath) => {
  const config = require(configFilePath);

  const hostname = config.hostname || "localhost";
  const port = config.port || 3000;
  const endpoints = config.endpoints || [];

  const handleGet = (req, res, file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Internal Server Error");
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(data);
    });
  };

  const handlePost = (req, res, file) => {
    let newItem = "";

    req.on("data", (chunk) => {
      newItem += chunk.toString();
    });

    req.on("end", () => {
      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end("Internal Server Error");
          return;
        }

        const items = JSON.parse(data);
        items.push(JSON.parse(newItem));

        fs.writeFile(file, JSON.stringify(items), "utf8", (err) => {
          if (err) {
            res.statusCode = 500;
            res.end("Internal Server Error");
            return;
          }
          res.statusCode = 201;
          res.end();
        });
      });
    });
  };

  const handleDelete = (req, res, file, id) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Internal Server Error");
        return;
      }

      let items = JSON.parse(data);
      items = items.filter((item) => item.id !== id);

      fs.writeFile(file, JSON.stringify(items), "utf8", (err) => {
        if (err) {
          res.statusCode = 500;
          res.end("Internal Server Error");
          return;
        }
        res.statusCode = 200;
        res.end();
      });
    });
  };

  const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const path = reqUrl.pathname;
    const query = reqUrl.query;
    const method = req.method;

    const endpoint = endpoints.find((ep) => ep.path === path);

    if (!endpoint) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    const { file } = endpoint;

    switch (method) {
      case "GET":
        handleGet(req, res, file);
        break;
      case "POST":
        handlePost(req, res, file);
        break;
      case "DELETE":
        const id = path.substring(path.lastIndexOf("/") + 1);
        handleDelete(req, res, file, id);
        break;
      default:
        res.statusCode = 405;
        res.end("Method Not Allowed");
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

module.exports = createServer;
