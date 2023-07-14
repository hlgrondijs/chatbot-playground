import type { NextPage } from "next";
import { useState } from "react";
import { Button } from "~/components/Button";
import { ChatBox } from "~/containers/ChatBox";

export interface ChatMessage {
  ts: Date;
  content: string;
  user: string;
}

interface AssistantSession {
  messageHistory: ChatMessage[];
  title: string;
  ts: Date;
}

const ChatPage: NextPage = () => {
  const [sessions, setSessions] = useState<AssistantSession[]>([
    {
      messageHistory: [],
      title: "1",
      ts: new Date("2020-01-01"),
    },
    {
      messageHistory: [],
      title: "2",
      ts: new Date("2020-02-02"),
    },
  ]);
  const [curSessionIdx, setCurSessionIdx] = useState<number>();
  const [selectedSession, setSelectedSession] = useState<AssistantSession>();

  const updateCurrentSession = (newChatHistory: ChatMessage[]) => {
    if (selectedSession === undefined || curSessionIdx == undefined) return;

    const newS = [...sessions];
    selectedSession.messageHistory = newChatHistory;
    newS[curSessionIdx] = selectedSession;
    setSessions(newS);
  };

  const selectSession = (idx: number) => {
    const sess = sessions[idx];
    if (sess !== undefined) {
      setSelectedSession(sess);
      setCurSessionIdx(idx);
    }
  };

  const addNewSession = () => {
    const newSession: AssistantSession = {
      messageHistory: [],
      title: (sessions.length + 1).toString(),
      ts: new Date(),
    };
    setSessions([...sessions, newSession]);
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="flex h-[100vh] w-[100vw] flex-col border border-black">
        <div className="bg-slate-400 p-2">
          <h3>ChatGPT Test Environment</h3>
        </div>
        <div className="flex flex-grow overflow-hidden border-b-2 border-t-2 border-black">
          <div className="h-full w-[300px] overflow-scroll border-r-2 border-black bg-slate-600 p-1">
            <div className="flex justify-between p-2">
              <h3 className="my-1 py-2 text-xl">Conversation History</h3>
              <Button onClick={addNewSession} label={"New"} />
            </div>
            {sessions
              .slice(0)
              .reverse()
              .map((sess, idx) => {
                return (
                  <div
                    key={`session-${sess.title}`}
                    className={`${
                      idx === curSessionIdx ? "bg-slate-500" : ""
                    } p-2`}
                    onClick={() => selectSession(idx)}
                  >
                    <div>{sess.title}</div>
                    <div>{sess.ts.toISOString()}</div>
                  </div>
                );
              })}
          </div>
          {selectedSession ? (
            <ChatBox
              chatHistory={selectedSession.messageHistory}
              setChatHistory={updateCurrentSession}
            />
          ) : (
            <div className="flex h-full flex-grow items-center justify-center">
              Select a session to start
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
