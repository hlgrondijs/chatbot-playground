import { useState } from "react";
import { Button } from "~/components/Button";
import type { AssistantSessionInclude } from "./AppContext";

interface ChatBoxProps {
  assistantSession: AssistantSessionInclude;
  sendMessage: (msg: string) => void;
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

export const ChatBox = ({ assistantSession, sendMessage }: ChatBoxProps) => {
  const [message, setMessage] = useState<string>("");

  const handleChatInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessage(event.target.value);
  };

  const submitMessage = (event: React.SyntheticEvent) => {
    event.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-slate-300">{`ID: ${assistantSession.id} Title: ${assistantSession.title}`}</div>
      <div className="m-1 flex  flex-grow flex-col-reverse overflow-scroll pb-1">
        <form className="flex flex-row px-1">
          <input
            id="chatInput"
            type="text"
            className="m-1 h-10 flex-grow rounded border border-black p-2"
            onChange={handleChatInputChange}
            value={message}
          />
          <Button onClick={submitMessage} label={"Send"} />
        </form>
        <div className="px-2">
          {assistantSession.messageHistory
            .slice(0)
            .reverse()
            .map((msg, idx) => {
              return (
                <div key={`msg-${idx}`}>
                  <span className="font-mono font-bold">{`[${dateToTimestamp(
                    msg.ts
                  )}] ${msg.sentByUser ? "user" : "assistant"}: `}</span>

                  <span>{msg.content}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
