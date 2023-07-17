import type { NextPage } from "next";
import { generate } from "random-words";
import { Button } from "~/components/Button";
import { TrashCan } from "~/components/TrashCan";
import { useAppContext } from "~/containers/AppContext";
import { ChatBox } from "~/containers/ChatBox";

const ChatPage: NextPage = () => {
  const {
    sessions,
    curSession,
    curSessionId,
    setCurSessionId,
    createSession,
    deleteSession,
    putMessage,
  } = useAppContext();

  const addNewSession = () => {
    createSession({
      title: generate({ exactly: 2, join: " " }),
    });
  };

  const sendMessage = (msg: string) => {
    putMessage({
      sentByUser: true,
      ts: new Date(),
      content: msg,
      assistantSessionId: curSessionId!,
    });
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="flex h-[100vh] w-[100vw] flex-col border border-black">
        <div className="bg-slate-400 p-2">
          <h3>ChatGPT Test Environment</h3>
        </div>
        <div className="flex flex-grow overflow-hidden border-b-2 border-t-2 border-black">
          <div className="h-full w-[400px] overflow-scroll border-r-2 border-black bg-slate-600 p-1">
            <div className="flex justify-between p-2">
              <h3 className="my-1 py-2 text-xl">Conversation History</h3>
              <Button onClick={addNewSession} label={"New"} />
            </div>
            {sessions
              .slice(0)
              .reverse()
              .map((sess) => {
                return (
                  <div
                    key={`session-${sess.title}`}
                    className={`flex flex-row items-center justify-between rounded ${
                      sess.id === curSessionId ? "bg-slate-500" : ""
                    } p-2`}
                  >
                    <div
                      className="flex flex-col"
                      onClick={() => setCurSessionId(sess.id)}
                    >
                      <div className="font-bold">{sess.title}</div>
                      <div className="text-xs">{sess.id}</div>
                      <div className="text-xs">
                        {dateToDateTimeString(sess.ts)}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSession({ id: sess.id })}
                      className="rounded bg-gray-300 p-1"
                    >
                      <TrashCan />
                    </button>
                  </div>
                );
              })}
          </div>
          <div className="w-full">
            {curSession ? (
              <ChatBox
                assistantSession={curSession}
                sendMessage={sendMessage}
              />
            ) : (
              <div className="flex h-full flex-grow items-center justify-center">
                Select a session to start
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

const dateToDateTimeString = (d: Date): string => {
  const h = d
    .getHours()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  const m = d
    .getMinutes()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  const s = d
    .getSeconds()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  return `${d.toDateString()} - ${h}:${m}:${s}`;
};
