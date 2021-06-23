import { json, RequestHandler } from "express";
import { OptionsJson } from "body-parser";

const DEFAULTS: OptionsJson = { limit: "1MB", strict: true, type: "json" };

export function bodyParserMiddleware(options: OptionsJson = DEFAULTS): RequestHandler {
    return (req, res, next): void => {
        req.headers["content-type"] = "application/json";

        json(options)(req, res, (err) => {
            if (!err) return next();
            res.status(400).json({ message: "Invalid JSON" });
        });
    };
}
