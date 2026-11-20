import openNextWorker, {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./.open-next/worker.js";
import { handleEdgeFetch, handleEdgeScheduled } from "./lib/cloudflare/edge-worker";

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge };

const worker = {
  async fetch(request, env, ctx) {
    return handleEdgeFetch(request, env, ctx, (req, e, c) => openNextWorker.fetch(req, e, c));
  },
  async scheduled(controller, env, ctx) {
    return handleEdgeScheduled(controller, env, ctx);
  },
};

export default worker;
