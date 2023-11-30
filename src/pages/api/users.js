// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readJsonFile } from "../../utils/common";
import path from "path";

export default function handler(req, res) {
  if (req.method === "GET") {
    const jsonFilePath = path.resolve("src/files/users.json");
    const users = readJsonFile(jsonFilePath);
    res.status(200).json(users);
  }
}
