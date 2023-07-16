import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const putMessageSchema = z.object({
  ts: z.date(),
  content: z.string(),
  user: z.string(),
  assistantSessionId: z.string(),
});

const createAssistantSessionSchema = z.object({
  title: z.string(),
});

const getChatHistorySchema = z.object({
  assistantSessionId: z.string().nullish(),
});

const getAssistantSessionSchema = z.object({
  id: z.string().nullish(),
});

export const chatRouter = createTRPCRouter({
  putMessage: publicProcedure
    .input(putMessageSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.chatMessage.create({
        data: {
          ts: input.ts,
          content: input.content,
          user: input.user,
          assistantSessionId: input.assistantSessionId,
        },
      });
    }),

  getChatHistory: publicProcedure
    .input(getChatHistorySchema)
    .query(async ({ input, ctx }) => {
      if (input.assistantSessionId === undefined) return;

      return await ctx.prisma.chatMessage.findMany({
        where: {
          assistantSessionId: input.assistantSessionId,
        },
      });
    }),

  listAssistantSessions: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.assistantSession.findMany({
      include: {
        messageHistory: false,
      },
    });
  }),

  getAssistantSession: publicProcedure
    .input(getAssistantSessionSchema)
    .query(async ({ input, ctx }) => {
      if (!input.id) return;
      return await ctx.prisma.assistantSession.findFirst({
        where: {
          id: input.id,
        },
        include: {
          messageHistory: true,
        },
      });
    }),

  createAssistantSession: publicProcedure
    .input(createAssistantSessionSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.assistantSession.create({
        data: {
          title: input.title,
        },
      });
    }),
});
