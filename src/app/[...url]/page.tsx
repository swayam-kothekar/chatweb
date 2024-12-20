// import { ChatWrapper } from "@/components/ChatWrapper"
// import { ragChat } from "@/lib/rag-chat"
// import { redis } from "@/lib/redis"
// import { cookies } from "next/headers"


// // interface PageProps {
// //     params:{
// //         url: string[] 
// //         // url: string | string[] | undefined
// //     }
// // }

// // function reconstructUrl({url}: {url:string[]}) {
// //     const decodedComponents = url.map((component) => decodeURIComponent(component)) 

// //     return decodedComponents.join("/")
// // }

// // const Page = async ({params}: PageProps) =>{
// //     const reconstructedUrl = reconstructUrl({url: params.url})
// //     // const reconstructedUrl = reconstructUrl({url: params.url as string[]})
// //     const sessionCookie = (await cookies()).get("sessionId")?.value
// //     const sessionId = (reconstructedUrl + "-" + sessionCookie).replace(/\//g, "")
    
// //     const initialMessages = await ragChat.history.getMessages({amount: 10, sessionId})

// //     const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl)
    

// //     if(!isAlreadyIndexed){
// //         await ragChat.context.add({
// //             type: "html",
// //             source: reconstructedUrl,
// //             config: {chunkOverlap: 50, chunkSize: 200}
// //         })

// //         await redis.sadd("indexed-urls", reconstructedUrl)
// //     }

// //     return(
// //         <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
// //     )
// // }

// // export default Page;

// // Define the params type based on the [...url] route structure
// type URLParams = {
//     url: string[]
//   }
  
//   // Update the page component to use the proper Next.js types
//   const Page = async ({
//     params,
//   }: {
//     params: URLParams
//   }) => {
//     const reconstructedUrl = reconstructUrl({ url: params.url })
//     const sessionCookie = (await cookies()).get("sessionId")?.value
//     const sessionId = (reconstructedUrl + "-" + sessionCookie).replace(/\//g, "")
//     const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId })
    
//     const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl)
//     if (!isAlreadyIndexed) {
//       await ragChat.context.add({
//         type: "html",
//         source: reconstructedUrl,
//         config: { chunkOverlap: 50, chunkSize: 200 }
//       })
//       await redis.sadd("indexed-urls", reconstructedUrl)
//     }
  
//     return (
//       <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
//     )
//   }
  
//   // Helper function remains the same
//   function reconstructUrl({ url }: { url: string[] }) {
//     const decodedComponents = url.map((component) => decodeURIComponent(component))
//     return decodedComponents.join("/")
//   }
  
//   export default Page

import { ChatWrapper } from "@/components/ChatWrapper"
import { ragChat } from "@/lib/rag-chat"
import { redis } from "@/lib/redis"
import { cookies } from "next/headers"

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) => decodeURIComponent(component))
  return decodedComponents.join("/")
}

// Define the page with proper typing for App Router
export default async function Page({
  params,
}: {
  params: { url: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const reconstructedUrl = reconstructUrl({ url: params.url })
  const sessionCookie = (await cookies()).get("sessionId")?.value
  const sessionId = (reconstructedUrl + "-" + sessionCookie).replace(/\//g, "")
  const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId })
  
  const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl)
  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 200 }
    })
    await redis.sadd("indexed-urls", reconstructedUrl)
  }

  return (
    <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
  )
}