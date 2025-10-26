import { CRUD_FUNCTIONS_REGISTRY } from "./crudFunctionsRegistry.js";

export async function executeCrudFunction({ functionName, params }, userId) {
  if (!functionName || typeof functionName !== "string") {
    throw new Error("functionName must be provided and must be a string.");
  }

  const crudFunction = CRUD_FUNCTIONS_REGISTRY[functionName];
  if (!crudFunction) {
    throw new Error(`CRUD function not found: ${functionName}`);
  }

  if (!userId) throw new Error("userId is required to execute CRUD functions.");

  try {
    const result = await crudFunction(params, userId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
