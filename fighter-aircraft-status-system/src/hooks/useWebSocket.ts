import { useEffect, useState } from 'react';
import useWB from 'react-use-websocket';

const useWebSocket = (url: string) => {
  const { sendMessage, lastMessage, readyState } = useWB(url);

  const [data, setData] = useState<WebSocketEvent | null>(null);

  useEffect(() => {
    if (lastMessage !== null) {
      const parsedData = JSON.parse(lastMessage.data);
      setData(parsedData);
    }
  }, [lastMessage]);

  return { data, sendMessage, readyState };
};

export default useWebSocket;
