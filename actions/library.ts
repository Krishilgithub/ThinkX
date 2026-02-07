// This file is deprecated - Resource model no longer exists in the new schema
// The platform focuses on video course generation, not file/resource management

export async function getResources() {
  return [];
}

export async function createResource(_data?: any) {
  throw new Error("Resource model deprecated - feature not available");
}

export async function deleteResource(_id?: string) {
  throw new Error("Resource model deprecated - feature not available");
}
