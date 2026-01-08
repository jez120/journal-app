import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
    schema: "./prisma/schema.prisma",
    datasource: {
        url: databaseUrl,
    },
});
