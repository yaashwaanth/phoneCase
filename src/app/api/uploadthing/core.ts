import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {date, z} from 'zod'
import sharp from "sharp"
import { db } from "@/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
  .input(z.object({configId:z.string().optional()}))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      return {input}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
     
      const {configId} = metadata.input
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback

      // storing image in db
      const res = await fetch(file.url)
      const butter = await res.arrayBuffer()
      const imgMetadata = await sharp(butter).metadata()
      const {width,height} = imgMetadata

      if(!configId){
        const configuration = await db.configuration.create({
         data:{
          imageUrl: file.url,
          height: height || 500,
          width: width || 500
         }

        })
        return {configId: configuration.id}
      }else{
        const updatedConfiguration = await db.configuration.update({
          where: {
            id:configId
          },
          data:{
            croppedImageUrl: file.url
          }
        })

        return {configId:updatedConfiguration.id}
      }
      // return {configId}
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
