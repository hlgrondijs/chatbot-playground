import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { GptService } from "~/containers/GptService";

const putMessageSchema = z.object({
  ts: z.date(),
  content: z.string(),
  assistantSessionId: z.string(),
  sentByUser: z.boolean(),
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

const gptService = new GptService();

export const chatRouter = createTRPCRouter({
  putMessage: publicProcedure
    .input(putMessageSchema)
    .mutation(async ({ input, ctx }) => {
      const session = await ctx.prisma.assistantSession.findFirst({
        where: {
          id: input.assistantSessionId,
        },
        include: {
          messageHistory: true,
        },
      });

      if (!session) return; // Invalid session id
      console.log(session.messageHistory);
      const response = await gptService.generateResponse(
        session.messageHistory
      );

      await ctx.prisma.chatMessage.create({
        data: {
          ts: input.ts,
          content: input.content,
          sentByUser: input.sentByUser,
          assistantSessionId: input.assistantSessionId,
        },
      });

      await ctx.prisma.chatMessage.create({
        data: {
          ts: input.ts,
          content: response?.content ?? "",
          sentByUser: false,
          assistantSessionId: input.assistantSessionId,
        },
      });
    }),

  getChatHistory: publicProcedure
    .input(getChatHistorySchema)
    .query(async ({ input, ctx }) => {
      if (!input.assistantSessionId) return;

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
