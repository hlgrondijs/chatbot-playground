import type { NextPage } from "next";
import { useEffect, useState } from "react";

interface ChatMessage {
  ts: Date;
  content: string;
  user: string;
}

const dateToTimestamp = (date: Date) => {
  const h = date
    .getHours()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  const m = date
    .getMinutes()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  const s = date
    .getSeconds()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  return `${h}:${m}:${s}`;
};

const ChatPage: NextPage = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const submitMessage = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log("?", message);
    const newChatHistory = [...chatHistory];
    newChatHistory.push({
      ts: new Date(),
      content: message,
      user: "user",
    });
    setChatHistory(newChatHistory);
    setMessage("");
  };

  const handleChatInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessage(event.target.value);
  };

  // useEffect(() => {
  //   const chatInput = document.getElementById("chatInput");
  //   chatInput?.addEventListener("keypress", function (event) {
  //     if (event.key == "Enter") {
  //       event.preventDefault();
  //       submitMessage();
  //     }
  //   });
  // }, []);

  console.log(message);

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="flex h-[90vh] w-[90vw] flex-col border border-black">
        <div className="bg-slate-400 p-2">
          <h3>ChatGPT Test Environment</h3>
        </div>
        <div className="bg-slate-10 m-1 flex flex-grow flex-col-reverse overflow-scroll">
          {chatHistory
            .slice(0)
            .reverse()
            .map((msg, idx) => {
              return (
                <div key={`msg-${idx}`}>
                  <span className="font-mono font-bold">{`[${dateToTimestamp(
                    msg.ts
                  )}] ${msg.user}: `}</span>

                  <span>{msg.content}</span>
                </div>
              );
            })}
        </div>
        <div>
          <form className="flex flex-row">
            <input
              id="chatInput"
              type="text"
              className="m-1 h-10 flex-grow rounded border border-black p-2"
              onChange={handleChatInputChange}
              value={message}
            />
            <button
              className="m-1 rounded bg-gray-300 p-2"
              onClick={submitMessage}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
