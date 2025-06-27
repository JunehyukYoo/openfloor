export function hasAdminPermissions(role: string): boolean {
  return role === "ADMIN" || role === "CREATOR";
}

export function hasDebatePermissions(role: string): boolean {
  return role === "ADMIN" || role === "CREATOR" || role === "DEBATER";
}
