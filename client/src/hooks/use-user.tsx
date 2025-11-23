import { useState } from "react";

// Mock user data for now
const mockUser = {
  id: "1",
  username: "testuser",
  isPremium: false,
};

export const useUser = () => {
  const [user, setUser] = useState(mockUser);

  const upgradeUser = () => {
    setUser((prevUser) => ({ ...prevUser, isPremium: true }));
  };

  return { user, upgradeUser };
};
