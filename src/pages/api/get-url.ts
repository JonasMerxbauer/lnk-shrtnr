import { type NextApiRequest, type NextApiResponse } from 'next'
import { prisma } from "../../server/db";

export default async function handler(req: NextApiRequest , res:NextApiResponse) {
    const { slug } = req.query

    if (!req.query || !slug || typeof slug !== "string") {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    const result = await prisma.url.findFirst({
        where: {
            slug: slug
        }
    });

    if (!result) {
        res.status(404).json({ error: "Not Found" });
        return;
    }
    
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
    "Cache-Control",
    "s-maxage=1000000000, stale-while-revalidate"
    );


    res.status(200).json({ url: result.url });
}