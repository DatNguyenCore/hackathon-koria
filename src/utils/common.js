import fs from "fs";
import path from "path";

// Function to read JSON file
export const readJsonFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
};

// Function to write JSON file
export const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Data has been written to the JSON file.");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
};
