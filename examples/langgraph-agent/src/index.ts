import { END, START, StateGraph } from "@langchain/langgraph";
import { supraReadNode } from "./agents/supra-read-agent";
import { managerNode, managerRouter } from "./agents/manager";
import { writerNode, writerTool } from "./agents/tweet-writer-agent";
import { postNode, postOnXTool } from "./agents/x-post-agent";
import { StateAnnotation } from "./state";
import { HumanMessage } from "@langchain/core/messages";

const workflow = new StateGraph(StateAnnotation)
  .addNode("manager", managerNode)
  .addNode("supraRead", supraReadNode)
  .addNode("tweetWriter", writerNode)
  .addNode("postOnTwitter", postNode)
  .addEdge("tweetWriter", "postOnTwitter")
  .addEdge("supraRead", "tweetWriter")
  .addEdge("supraRead", "postOnTwitter")
  .addEdge(START, "manager")
  .addConditionalEdges("manager", managerRouter)
  //.addEdge("supraRead", END)
  //.addEdge("tweetWriter", END)
  // TODO: need to make sure the prompts recognize postOnTwitter tool before uncommenting above 2 lines
  .addEdge("postOnTwitter", END);

export const graph = workflow.compile();

graph
  .invoke({
    messages: [new HumanMessage("what is my address?")],
  })
  .then((x) => console.log(x));
