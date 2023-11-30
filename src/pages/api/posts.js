// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readJsonFile, writeJsonFile } from "../../utils/common";
import path from "path";

export default function handler(req, res) {
  const jsonFilePath = path.resolve("src/files/posts.json");
  const posts = readJsonFile(jsonFilePath);
  if (req.method === "GET") {
    res.status(200).json(posts);
  }
  if (req.method === "PUT") {
    posts.unshift(req.body);
    writeJsonFile(jsonFilePath, posts);
    res.status(200).json(posts);
  }
}
