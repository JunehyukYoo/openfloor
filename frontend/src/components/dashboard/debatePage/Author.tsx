// components/dashboard/debatePage/Author.tsx

import { Avatar, AvatarImage } from "../../ui/avatar";
const Author = ({
  username,
  profilePicture,
}: {
  username: string;
  profilePicture: string;
}) => {
  return (
    <>
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={profilePicture}
          alt={username}
          className="h-10 w-10 rounded-full object-cover"
        />
      </Avatar>
    </>
  );
};
export default Author;
