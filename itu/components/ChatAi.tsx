"use client";

import OpenAI from "openai";
import { useState, useRef, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useSession } from "next-auth/react";

type Message = {
  id: number;
  role: string;
  content: string;
};

const ChatAi = () => {
  const { data: session, status } = useSession();
  const [isClicked, setClicked] = useState(false);
  const [th, setThread] = useState("");
  const [messages, setMessages] = useState([] as Message[]);
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });
  const [message, setMessage] = useState("");

  const [minWidth, maxWidth, defaultWidth] = [200, 500, 350];
  const [minHeight, maxHeight, defaultHeight] = [200, 500, 350];
  const [windowWidth, setWindowWidth] = useState(defaultWidth);
  const [windowHeight, setWindowHeight] = useState(defaultHeight);

  const messagesEndRef = useRef(null);
  const isResizedWidth = useRef(false);
  const isResizedHeight = useRef(false);

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (isResizedHeight.current) {
        setWindowHeight((previousHeight) => {
          const newHeight = previousHeight - e.movementY / 2;

          const isHeightInRange =
            newHeight >= minHeight && newHeight <= maxHeight;

          return isHeightInRange ? newHeight : previousHeight;
        });
      }

      if (isResizedWidth.current) {
        setWindowWidth((previousWidth) => {
          const newWidth = previousWidth - e.movementX / 2;

          const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;

          return isWidthInRange ? newWidth : previousWidth;
        });
      }
      if (!isResizedWidth.current && !isResizedHeight.current) {
        return;
      }
    });

    window.addEventListener("mouseup", () => {
      isResizedHeight.current = false;
      isResizedWidth.current = false;
    });
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      const getAI = async () => {
        const a = CryptoJS.enc.Hex.stringify(
          CryptoJS.enc.Utf8.parse(session?.user?.email as string),
        );

        const res = await fetch(`/api/profile/${a}/AI`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        let cipher = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(data.key.ciphertext),
          iv: CryptoJS.enc.Hex.parse(data.key.iv),
          salt: CryptoJS.enc.Hex.parse(data.key.salt),
        });

        const apiKey = CryptoJS.AES.decrypt(
          cipher,
          "ITUISSOOOSUPERDUPER",
        ).toString(CryptoJS.enc.Utf8);

        // console.log(apiKey);
        // console.log(data.thread);

        // openai = new OpenAI({apiKey: apiKey, dangerouslyAllowBrowser: true});
        // setThread(data.thread);

        return { apiKey: apiKey, thread: data.thread };
      };

      getAI().then((r) => {
        if (r.thread === null) {
          setThread("");
        } else {
          setThread(r.thread);
        }
      });
    }
  }, [status]);

  const createThread = async () => {
    if (openai === null) {
      return;
    }
    const a = CryptoJS.enc.Hex.stringify(
      CryptoJS.enc.Utf8.parse(session?.user?.email as string),
    );

    const thread = await openai.beta.threads.create();
    const res = await fetch(`/api/profile/${a}/AI`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thread: thread.id,
      }),
    });
    return thread.id;
  };

  const handleDelete = async () => {
    const a = CryptoJS.enc.Hex.stringify(
      CryptoJS.enc.Utf8.parse(session?.user?.email as string),
    );

    const res = await fetch(`/api/profile/${a}/AI`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    setMessages([]);
    setClicked(false);
    setThread("");
  };

  const chatCompletion = async (mes: string) => {
    if (openai === null) {
      return;
    }
    //setMessages([...messages, {role: "user", content: mes, id: messages.length}]);
    messages.push({ role: "user", content: mes, id: messages.length });
    const message = await openai.beta.threads.messages.create(th, {
      role: "user",
      content: mes,
    });

    const ID = "asst_TQNlMZf50AGVZmY7XwcF5WA0";

    const run = await openai.beta.threads.runs.create(th, {
      assistant_id: ID,
    });

    const int = setInterval(async () => {
      if (openai === null) {
        return;
      }
      const res = await openai.beta.threads.runs.retrieve(th, run.id);
      if (res.status === "completed") {
        const text = await openai.beta.threads.messages.list(th);
        // @ts-ignore
        console.log(text.data[0].content[0].text.value);
        // @ts-ignore
        clearInterval(int);
        messages.push({
          role: "ai",
          content: text.data[0].content[0].text.value,
          id: messages.length,
        });
        setMessages([...messages]);
      }
      // console.log(res.status);
    }, 2000);
  };

  const handleClick = async () => {
    if (th === "") {
      // @ts-ignore
      const thread = await createThread();
      if (thread === undefined) {
        return;
      }
      setThread(thread);
    } else {
      const text = await openai.beta.threads.messages.list(th);
      const messages = text.data.reverse().map((message: any) => {
        return {
          role: message.role === "user" ? "user" : "ai",
          content: message.content[0].text.value,
          id: message.id,
        };
      });
      setMessages(messages);
      console.log(messages);
    }
    setClicked(!isClicked);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");
    console.log(th);
    const message = new FormData(e.currentTarget).get("message");
    // @ts-ignore
    setMessages([...messages, { role: "user", content: message }]);
    // @ts-ignore
    await chatCompletion(message);
    // console.log(messages);
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      {isClicked ? (
        <div
          className={`fixed bottom-0 right-5 h-80 rounded-t-3xl shadow-2xl p-1 z-10`}
          style={{
            width: `${windowWidth / 16}rem`,
            height: `${windowHeight / 16}rem`,
          }}
        >
          <div className={"w-full h-full flex flex-col"}>
            <div
              className={"w-full h-1.5 cursor-n-resize"}
              onMouseDown={() => {
                isResizedHeight.current = true;
              }}
            ></div>
            <div className={"w-full h-full flex flex-row"}>
              <div
                className={"h-full w-1.5 cursor-e-resize"}
                onMouseDown={() => {
                  isResizedWidth.current = true;
                }}
              ></div>
              <div className={"w-full h-full"}>
                <button
                  onClick={handleClick}
                  className={
                    "relative top-0 w-full h-[12%] text-black text-2xl font-semibold rounded-t-3xl bg-amber-600"
                  }
                >
                  Chat
                </button>
                <form
                  className={"w-full h-full flex-col justify-center z-20"}
                  onSubmit={handleSubmit}
                >
                  <div
                    className={
                      "bg-amber-100 text-black w-full h-[75%] overflow-y-auto no-scrollbar rounded-b gap-0.5"
                    }
                  >
                    {messages.map((message) =>
                      message.role === "user" ? (
                        <div
                          key={message.id}
                          className={
                            "w-[90%] flex p-2 rounded-xl bg-amber-500 text-black flex-col"
                          }
                        >
                          <span
                            className={
                              "text-gray-800 text-sm border-b border-b-gray-700"
                            }
                          >
                            You
                          </span>
                          <div
                            className={
                              "w-full flex left-0 items-center p-1 rounded-xl bg-amber-500 text-black"
                            }
                          >
                            {message.content}
                          </div>
                        </div>
                      ) : (
                        <div key={message.id} className={"flex flex-row"}>
                          <div
                            className={
                              "w-[10%] flex justify-center items-center"
                            }
                          />
                          <div
                            className={
                              "w-[90%] flex p-2 rounded-xl bg-green-500 text-black flex-col"
                            }
                          >
                            <span
                              className={
                                "text-gray-800 text-sm border-b border-b-gray-700"
                              }
                            >
                              AI
                            </span>
                            <div
                              className={
                                "w-full flex left-0 items-center p-1 rounded-xl text-black"
                              }
                            >
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div
                    className={
                      "w-full flex flex-row justify-center items-center p-1"
                    }
                  >
                    <input
                      name={"message"}
                      className={
                        "text-black justify-center p-0.5 w-full border border-amber-950 rounded-md"
                      }
                      value={message}
                      onInput={handleChange}
                    />
                    <button
                      type={"button"}
                      onClick={handleDelete}
                      className={
                        "bg-red-600 text-black font-semibold p-1 rounded-md"
                      }
                    >
                      DELETE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className={
            "fixed bottom-0 right-5 w-[10%] h-8 bg-white rounded-t-3xl shadow-2xl flex justify-center bg-amber-600"
          }
        >
          <h1 className={"text-black text-2xl font-semibold"}>Chat</h1>
        </button>
      )}
    </div>
  );
};

export default ChatAi;
