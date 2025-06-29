export function hasAdminPermissions(role: string): boolean {
  return role === "ADMIN" || role === "CREATOR";
}

export function hasDebatePermissions(role: string): boolean {
  return role === "ADMIN" || role === "CREATOR" || role === "DEBATER";
}

export function getTimeAgo(date: Date) {
  let diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) {
    return `${diff}s Ago`;
  }
  diff = Math.floor(diff / 60);
  if (diff < 60) {
    return `${diff}min Ago`;
  }
  diff = Math.floor(diff / 60);
  if (diff < 24) {
    return `${diff}h Ago`;
  }
  diff = Math.floor(diff / 24);
  if (diff < 7) {
    return `${diff}d Ago`;
  }
  diff = Math.floor(diff / 7);
  if (diff < 20) {
    return `${diff}w Ago`;
  }
  diff = Math.floor(diff / 4);
  if (diff < 12) {
    return `${diff}mon Ago`;
  }
  diff = Math.floor(diff / 12);
  return `${diff}y Ago`;
}
