import { Request, Response, RequestHandler } from "express";
import { IncomingHttpHeaders } from "http";

function getRealIp(reqIp: string, heads: IncomingHttpHeaders): string {
    const xFor = heads["x-forwarded-for"];
    if (!xFor || !xFor.length) return reqIp;

    const ips = Array.isArray(xFor) ? xFor : xFor.split(",");

    if (ips.length > 1) {
        const realIp = ips.pop() as string;
        heads["x-forwarded-for"] = ips.join(",");
        return realIp;
    } else {
        delete heads["x-forwarded-for"];
        return ips[0];
    }
}

export function realIpMiddleware(reverseProxyIps: Set<string>): RequestHandler {
    return (req: Request, res: Response, next: Function): void => {
        if (!reverseProxyIps.has(req.ip)) {
            res.status(403).end(`${req.ip} is blacklisted`);
            return;
        }

        req.realIp = getRealIp(req.ip, req.headers);

        next();
    };
}
