export function hasAdminPermissions(role: string): boolean {
  return role === "ADMIN" || role === "CREATOR";
}
