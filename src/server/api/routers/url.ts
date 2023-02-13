import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const urlRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

    setUrl: publicProcedure.input(z.object({ slug: z.string(), url: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.url.create({
        data: {
            slug: input.slug,
            url: input.url
        },
    });
  }),

  getUrl: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.url.findUnique({
        where: {
            slug: input.slug
        }
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
