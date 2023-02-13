import { type NextApiRequest, type NextApiResponse } from 'next'
import { prisma } from "../../server/db";


export default async function handler(req: NextApiRequest , res:NextApiResponse) {
    const { url, slug } = req.body as { url: string, slug: string };

    if (!req.body || !url || !slug ) {
      res.status(400).json({ error: "Bad Request" });
      return;
    }

    await prisma.url.create({
        data: {
            slug: slug,
            url: url
        },
    });

    res.status(200).json({ url: url, slug: slug });

  }