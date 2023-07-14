import React, {
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

import type { AssistantSession, ChatMessage } from "@prisma/client";
import { api } from "~/utils/api";

type AppContext = {
  sessions: Map<string, AssistantSession> | undefined;
  curSessionId: string | undefined;
  setCurSessionId: React.Dispatch<React.SetStateAction<string | undefined>>;
  chatHistory: ChatMessage[];
  createSession: ReturnType<
    typeof api.chat.createAssistantSession.useMutation
  >["mutate"];
  putMessage: ReturnType<typeof api.chat.putMessage.useMutation>["mutate"];
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
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [curSessionId, setCurSessionId] = useState<string>();

  const { data: sessions } = api.chat.listAssistantSessions.useQuery();

  api.chat.getChatHistory.useQuery(
    { assistantSessionId: curSessionId },
    {
      onSuccess: (data) => {
        setChatHistory(data ? data : []);
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
      await util.chat.getChatHistory.invalidate();
    },
  });

  const providerValue = useMemo(() => {
    return {
      sessions,
      curSessionId,
      setCurSessionId,
      chatHistory,
      createSession,
      putMessage,
    };
  }, [chatHistory, createSession, curSessionId, putMessage, sessions]);

  return (
    <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>
  );
}
