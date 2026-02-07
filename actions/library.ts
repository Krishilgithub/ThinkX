// This file is deprecated - Resource model no longer exists in the new schema
// The platform focuses on video course generation, not file/resource management

export async function getResources() {
  return [];
}

export async function createResource() {
  throw new Error("Resource model deprecated - feature not available");
}

export async function deleteResource() {
  throw new Error("Resource model deprecated - feature not available");
}
