import React, {
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

import type { AssistantSession, ChatMessage } from "@prisma/client";
import { api } from "~/utils/api";

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

  const providerValue = useMemo(() => {
    return {
      sessions,
      curSession,
      curSessionId,
      setCurSessionId,
      createSession,
      putMessage,
    };
  }, [createSession, curSessionId, curSession, putMessage, sessions]);

  return (
    <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>
  );
}
