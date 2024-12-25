"use client"

import { Button, Textarea } from "@nextui-org/react"
import { Send } from "lucide-react"
import { type useChat } from "ai/react"

// // import { Dispatch, SetStateAction } from "react"
// // import { ChatRequestOptions } from "ai"
// // interface ChatInputProps{
// //     input: string
// //     handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
// //     handleSubmit: (event?: {
// //                         preventDefault?: () => void;
// //                     }, 
// //                     chatRequestOptions?: ChatRequestOptions) => void
// //     setInput: Dispatch<SetStateAction<string>>
// // }

// //OR the below method

type HandleInputChange = ReturnType<typeof useChat>["handleInputChange"]
type HandleSubmit = ReturnType<typeof useChat>["handleSubmit"]
type SetInput = ReturnType<typeof useChat>["setInput"]

interface ChatInputProps {
    input: string
    handleInputChange: HandleInputChange
    handleSubmit: HandleSubmit
    setInput: SetInput
}

export const ChatInput = ({handleInputChange, handleSubmit, input, setInput}: ChatInputProps) => {
    return (
        <div className="z-10 bg-gray-950 absolute bottom-0 left-0 w-full">
            <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                    <div className="relative flex flex-col w-full flex-grow p-4">
                        <form onSubmit={handleSubmit} className="relative">
                            <Textarea 
                                minRows={4}
                                autoFocus
                                onChange={handleInputChange}
                                value={input}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter" && !e.shiftKey){
                                        e.preventDefault()
                                        handleSubmit()
                                        setInput("")
                                    }
                                }}
                                placeholder="Enter your question..."
                                classNames={{
                                    input: "text-gray-100 placeholder:text-gray-500",
                                    base: "rounded-xl",
                                    inputWrapper: "bg-gray-800 hover:bg-gray-900 focus-within:bg-gray-900 transition-colors data-[hover=true]:bg-gray-900 group-data-[focus=true]:bg-gray-900 !ring-0 !border-0 !outline-none"
                                }}
                            />
                            <Button
                                size="sm"
                                type="submit"
                                className="absolute z-10 bottom-2 right-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white border-none"
                            >
                                <Send className="size-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}