import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Initialize with proper token
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
}); 