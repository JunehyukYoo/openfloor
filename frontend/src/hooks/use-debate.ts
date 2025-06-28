import { useParams, useSearchParams } from "react-router-dom";

export function useDebateParams() {
  const { debateId } = useParams();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");

  return { debateId, inviteToken };
}
