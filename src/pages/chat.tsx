import type { NextPage } from "next";
import { Button } from "~/components/Button";
import { useAppContext } from "~/containers/AppContext";
import { ChatBox } from "~/containers/ChatBox";

const ChatPage: NextPage = () => {
  const {
    sessions,
    curSession,
    curSessionId,
    setCurSessionId,
    createSession,
    putMessage,
  } = useAppContext();

  const addNewSession = () => {
    createSession({
      title: (sessions.length + 1).toString(),
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
          <div className="h-full w-[300px] overflow-scroll border-r-2 border-black bg-slate-600 p-1">
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
                    className={`${
                      sess.id === curSessionId ? "bg-slate-500" : ""
                    } p-2`}
                    onClick={() => setCurSessionId(sess.id)}
                  >
                    <div>{sess.title}</div>
                    <div>{sess.ts.toISOString()}</div>
                  </div>
                );
              })}
          </div>
          {curSession ? (
            <ChatBox assistantSession={curSession} sendMessage={sendMessage} />
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
