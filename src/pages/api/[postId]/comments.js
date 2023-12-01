// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readJsonFile, writeJsonFile } from "../../../utils/common";
import path from "path";

export default function handler(req, res) {
  const { postId } = req.query;
  const jsonFilePath = path.resolve("src/files/comments.json");
  const comments = readJsonFile(jsonFilePath);
  if (req.method === "GET") {
    res.status(200).json(comments[postId]);
  }
  if (req.method === "POST") {
    if (comments[postId]) {
      const newComments = { ...comments };
      newComments[postId].unshift(req.body);
      writeJsonFile(jsonFilePath, newComments);
      res.status(200).json({ message: "success" });
    }
    comments[postId] = [req.body];
    writeJsonFile(jsonFilePath, comments);
    res.status(200).json({ message: "success" });
  }
  if (req.method === "PUT") {
    comments.unshift(req.body);
    writeJsonFile(jsonFilePath, comments);
    res.status(200).json(comments);
  }
}
