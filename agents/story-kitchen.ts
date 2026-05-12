export type StoryKitchenStatus = {
  phase: "story-engine";
  workflowsEnabled: true;
  message: string;
};

export function getStoryKitchenStatus(): StoryKitchenStatus {
  return {
    phase: "story-engine",
    workflowsEnabled: true,
    message: "The bake-story workflow can generate 20-page story JSON and anchored page imagery for each LivingProfile.",
  };
}
