import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface MessageProps {
    content: string
    isUserMessage: boolean
}

export const Message = ({content, isUserMessage} : MessageProps) => {
    return (
        <div className={cn("transition-colors", {
            "bg-gray-800": isUserMessage,
            "bg-gray-900": !isUserMessage
        })}>
            <div className="p-6">
                <div className="max-w-3xl mx-auto flex items-start gap-2.5">
                    <div className={cn("size-10 shrink-0 aspect-square rounded-full border flex justify-center items-center transition-colors", {
                        "bg-blue-900/50 border-blue-700 text-blue-400": isUserMessage,
                        "bg-gray-800 border-gray-700 text-gray-400": !isUserMessage
                    })}>
                        {isUserMessage ? <User className="size-5" /> : <Bot className="size-5" />}
                    </div>
                    <div className="flex flex-col ml-6 w-full">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-white">
                                {isUserMessage ? "You" : "Website"}
                            </span>
                        </div>
                        <p className="text-sm font-normal py-2.5 text-gray-300">
                            {content}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}