import React, {
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

import type { AssistantSession, ChatMessage } from "@prisma/client";
import { api } from "~/utils/api";
import { GptService } from "./GptService";
import { Configuration, OpenAIApi } from "openai";

interface sessionListItem {
  id: string;
  ts: Date;
  title: string;
}

export type AssistantSessionInclude = AssistantSession & {
  messageHistory: ChatMessage[];
};

type AppContext = {
  sessions: sessionListItem[];
  curSession: AssistantSessionInclude | undefined;
  curSessionId: string | undefined;
  setCurSessionId: React.Dispatch<React.SetStateAction<string | undefined>>;
  createSession: ReturnType<
    typeof api.chat.createAssistantSession.useMutation
  >["mutate"];
  putMessage: ReturnType<typeof api.chat.putMessage.useMutation>["mutate"];
  //   sendMessage: (msg: string) => void;
};

const AppContext = React.createContext<AppContext | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw Error("No AppContext available");
  }
  return context;
};

export function AppContextProvider({ children }: PropsWithChildren) {
  const [curSession, setCurSession] = useState<AssistantSessionInclude>();
  const [curSessionId, setCurSessionId] = useState<string>();
  const [sessions, setSessions] = useState<sessionListItem[]>([]);

  const gptService = useMemo(() => {
    console.log(process.env.OPENAI_API_KEY);
    return new GptService();
  }, []);

  api.chat.listAssistantSessions.useQuery(undefined, {
    onSuccess: (data) => {
      setSessions(data ? data : []);
    },
  });

  api.chat.getAssistantSession.useQuery(
    { id: curSessionId },
    {
      onSuccess: (data) => {
        setCurSession(data ? data : undefined);
      },
    }
  );

  const util = api.useContext();
  const { mutate: createSession } = api.chat.createAssistantSession.useMutation(
    {
      onSuccess: async () => {
        await util.chat.listAssistantSessions.invalidate();
      },
    }
  );

  const { mutate: putMessage } = api.chat.putMessage.useMutation({
    onSuccess: async () => {
      await util.chat.getAssistantSession.invalidate();
    },
  });

  //   const sendMessage = useCallback(
  //     async (msg: string) => {
  //       if (!curSession) return;
  //       console.log(msg, curSessionId, curSession);
  //       putMessage({
  //         sentByUser: true,
  //         ts: new Date(),
  //         content: msg,
  //         assistantSessionId: curSession.id,
  //       });

  //       const response = await gptService2.generateResponse(
  //         curSession.messageHistory
  //       );
  //       if (!response || !response.content) return;
  //       console.log(response.content);
  //       putMessage({
  //         sentByUser: false,
  //         ts: new Date(),
  //         content: response.content,
  //         assistantSessionId: curSession.id,
  //       });
  //     },
  //     [curSession, gptService]
  //   );

  const providerValue = useMemo(() => {
    return {
      sessions,
      curSession,
      curSessionId,
      setCurSessionId,
      createSession,
      putMessage,
      //   sendMessage,
    };
  }, [
    createSession,
    curSessionId,
    curSession,
    putMessage,
    sessions,
    // sendMessage,
  ]);

  return (
    <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>
  );
}
