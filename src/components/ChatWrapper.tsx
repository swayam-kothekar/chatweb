"use client"

import { Message, useChat } from "ai/react"
import { Messages } from "./Messages"
import { ChatInput } from "./ChatInput"

export const ChatWrapper = ({sessionId, initialMessages}: {sessionId: string, initialMessages: Message[]}) => {
    const {messages, handleInputChange, handleSubmit, input, setInput} = useChat({
        api: "/api/chat-stream",
        body: {sessionId},
        initialMessages ,
    })

    return (
        <div className="relative min-h-full bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-betwen gap-2">
            <div className="flex-1 text-black bg-zinc-800 justify-between flex flex-col">
                <Messages messages={messages} />
            </div>

            <ChatInput 
                input={input} 
                handleInputChange={handleInputChange} 
                handleSubmit={handleSubmit}
                setInput={setInput} />
            {/* <form onSubmit={handleSubmit}>
                <input value={input} onChange={handleInputChange} type="text" />
                <button type="submit">send</button>
            </form> */}
        </div>
    )
}