import { gateway } from "ai";

export const models = (await gateway.getAvailableModels()).models;
export const languageModels = models.filter((model) => model.modelType === "language");
export const languageModelsIds = languageModels.map((model) => model.id);