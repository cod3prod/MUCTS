import { io } from "socket.io-client";
const createSocket = (URL: string, accessToken: string) => {
  const socket = io(URL, {
    auth: {
      token: accessToken,
    },
  });

  return socket;
};

export { createSocket };
