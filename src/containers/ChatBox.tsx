import type { ChatMessage } from "~/pages/chat";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "~/components/Button";

interface ChatBoxProps {
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
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

export const ChatBox = ({ chatHistory, setChatHistory }: ChatBoxProps) => {
  const [message, setMessage] = useState<string>("");

  const handleChatInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessage(event.target.value);
  };

  const submitMessage = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newChatHistory = [...chatHistory];
    newChatHistory.push({
      ts: new Date(),
      content: message,
      user: "user",
    });
    setChatHistory(newChatHistory);
    setMessage("");
  };

  return (
    <div className="bg-slate-10 m-1 flex h-full flex-grow flex-col-reverse overflow-scroll pb-1">
      <form className="flex flex-row px-2">
        <input
          id="chatInput"
          type="text"
          className="m-1 h-10 flex-grow rounded border border-black p-2"
          onChange={handleChatInputChange}
          value={message}
        />
        <Button onClick={submitMessage} label={"Send"} />
      </form>
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
  );
};
