"use client"

import { Message, useChat } from "ai/react"
import { Messages } from "./Messages"
import { ChatInput } from "./ChatInput"

export const ChatWrapper = ({sessionId, initialMessages}: {sessionId: string, initialMessages: Message[]}) => {
    const {messages, handleInputChange, handleSubmit, input, setInput} = useChat({
        api: "/api/chat-stream",
        body: {sessionId},
        initialMessages,
    })

    return (
        <div className="relative min-h-full bg-gray-950 flex flex-col justify-between gap-2">
            <div className="flex-1 bg-gray-900 justify-between flex flex-col">
                <Messages messages={messages} />
            </div>

            <div className="border-t border-gray-800 bg-gray-900 p-4">
                <ChatInput 
                    input={input} 
                    handleInputChange={handleInputChange} 
                    handleSubmit={handleSubmit}
                    setInput={setInput} 
                />
            </div>
        </div>
    )
}