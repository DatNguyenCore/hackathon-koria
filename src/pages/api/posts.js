// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";

// Function to read JSON file
const readJsonFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
};

// Function to write JSON file
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Data has been written to the JSON file.");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
};

export default function handler(req, res) {
  if (req.method === "GET") {
    const jsonFilePath = path.resolve("src/files/posts.json");
    const posts = readJsonFile(jsonFilePath);
    res.status(200).json(posts);
  }
}
