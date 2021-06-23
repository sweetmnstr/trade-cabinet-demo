import * as Helmet from "helmet";
import * as Cors from "cors";
import { Express } from "express";
import { INestApplication } from "@nestjs/common";

export function setCorsHelmet(
    app: Express | INestApplication,
    corsOptions?: Cors.CorsOptions,
    helmetOptions?: Parameters<typeof Helmet>[0]
) {
    const cors = Cors(corsOptions);
    const helmet = Helmet(helmetOptions);

    app.use(helmet);
    app.use(cors);

    return { cors, helmet };
}

export * from "./body-parser.middleware";
export * from "./real-ip.middleware";
