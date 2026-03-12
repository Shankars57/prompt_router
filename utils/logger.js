import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, "..", "logs", "route_log.jsonl");

export async function logRoute(entry) {
  try {
    await mkdir(path.dirname(logFilePath), { recursive: true });
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...entry
    };
    await appendFile(logFilePath, `${JSON.stringify(logEntry)}\n`, "utf8");
  } catch (error) {
    // Logging should never crash the request flow.
    console.error("Failed to write route log:", error.message);
  }
}

export { logFilePath };
