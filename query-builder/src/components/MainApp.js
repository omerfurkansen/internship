import React from 'react';
import Table from './Table';
import { Loader } from '@jotforminc/magnet';
import { IconXmark, LogoJotformColor } from '@jotforminc/svg-icons';
import { getSuggestionsFromBackend } from './AIApiHandler';
import EventEmitter from './EventEmitter';

const helperTexts = [
  "Customers whose payment date is after 2023",
  "Payments that provider is PayPal and the amount must be higher than 15k",
  "Payments that provider is PayPal and the customer name is Jotform",
]

function useDebounce(cb, delay) {
  const [debounceValue, setDebounceValue] = React.useState(cb);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(cb);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [cb, delay]);
  return debounceValue;
}

export default function MainApp() {
  const apiEndPoint = "https://b-karaca.jotform.dev/intern-api/querybuilder";
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 2000);
  const [suggestions, setSuggestions] = React.useState(null);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = React.useState(false);
  const [response, setResponse] = React.useState({
    userPrompt: "",
    responseQuery: "",
    tableData: [],
    chartData: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [promptHistory, setPromptHistory] = React.useState([]);
  const [isShowTable, setIsShowTable] = React.useState(false);
  const [currentResp, setCurrentResp] = React.useState(null);
  const [currentSSID, _setCurrentSSID] = React.useState(null);
  const isFromHistoryRef = React.useRef(false);
  const [isGetLastMsgLoading, setIsGetLastMsgLoading] = React.useState(false);
  const ssidRef = React.useRef(currentSSID);
  const chatRef = React.useRef(null);
  const sendBtnRef = React.useRef(null);
  const errorText = "I am sorry, but I could not generate a response for your query. 😔 I am still learning and I will do my best to improve myself. 🚀";

  const setCurrentSSID = (ssid) => {
    ssidRef.current = ssid;
    _setCurrentSSID(ssid);
  }

  const getFromHistory = async () => {
    isFromHistoryRef.current = true
    try {
      const response = await fetch(`https://b-karaca.jotform.dev/intern-api/querybuilder/${ssidRef.current}`);
      const data = await response.json();
      const arr = data.content.map(item => {
        const parsedQuery = JSON.parse(item.gpt_table_query);
        return {
        userPrompt: item.user_query,
        responseQuery: [
          `SELECT ${parsedQuery.SELECT}`,
          `FROM ${parsedQuery.FROM}`,
          parsedQuery.WHERE ? `WHERE ${parsedQuery.WHERE}` : "",
          parsedQuery.GROUP_BY ? `GROUP BY ${parsedQuery.GROUP_BY};` : "",
        ].join(" ").trim() + ";",
      }});
      setPromptHistory(arr);
      return arr;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const handleSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let finalEndpoint = apiEndPoint;
    if (isFromHistoryRef.current) {
      setIsGetLastMsgLoading(true);
      finalEndpoint = `${apiEndPoint}/last-message`;
    }
    
    const formData = new FormData();
    formData.append("query", query);
    if (ssidRef.current) {
      formData.append("sessionID", ssidRef.current);
    }

    try {
      const response = await fetch(finalEndpoint, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      const parsedQuery = JSON.parse(data.content.gpt_table_query);
      const responseQuery = [
        `SELECT ${parsedQuery.SELECT}`,
        `FROM ${parsedQuery.FROM}`,
        parsedQuery.WHERE ? `WHERE ${parsedQuery.WHERE}` : "",
        parsedQuery.GROUP_BY ? `GROUP BY ${parsedQuery.GROUP_BY}` : "",
      ].join(" ").trim() + ";";

      const tableData = data.content.table_data;
      const chartData = data.content.chart_data;

      setResponse({
        userPrompt: data.content.user_query,
        responseQuery,
        tableData,
        chartData,
      });
      if (!isFromHistoryRef.current) {
        setPromptHistory(prev => [...prev, {
          userPrompt: data.content.user_query,
          responseQuery,
        }]);
      }
      setCurrentSSID(data.content.session_id);
      setQuery("");
      EventEmitter.emit('newChatCreated');
    } catch (error) {
      if (!isFromHistoryRef.current) {
        setPromptHistory(prev => [...prev, {
          userPrompt: query,
          responseQuery: errorText,
        }]);
      }
      console.error(error);
    }

    isFromHistoryRef.current = false;
    setIsLoading(false);
    setIsGetLastMsgLoading(false);
  }

  const handleViewResults = () => {
    setCurrentResp(response);
    setIsShowTable(true);
  }

  const renderChat = () => (
    <div className="flex flex-col gap-4 h-full overflow-x-hidden p-4 bg-navy-10 radius-md bg-opacity-50 border border-purple-300 border-opacity-30" ref={chatRef} style={{
      maskImage: promptHistory.length > 3 ? "linear-gradient(to bottom, transparent, #fff 20%)" : "none",
    }}>
      {promptHistory.length === 0 && (
        <div className="anim anim-700 fade-in p-4 flex flex-col items-center gap-4 justify-self-center">
          <LogoJotformColor className="w-20 h-5" />
          <span className='text-md color-gray-300'>Hello! How can I help you today?</span>
        </div>
      )}
      {promptHistory.map((prompt, index) => (
        <React.Fragment key={index}>
          <div className="anim fade-in bg-blue-100 p-4 radius-md ml-12 w-max self-end shadow-md border border-blue-200 border-opacity-50" style={{ maxWidth: "calc(100% - 3rem)" }}>
            <p>
              {prompt.userPrompt}
            </p>
          </div>
          <div className="anim fade-in bg-orange-100 p-4 radius-md mr-12 w-max flex flex-col gap-4 shadow-md border border-orange-200" style={{ maxWidth: "calc(100% - 3rem)" }}>
            {prompt.responseQuery === errorText ? (
              <p>
                {prompt.responseQuery}
              </p>
            ) : (
              <>
                <p>
                  Here is the query that you requested:
                </p>
                <p className="text-lg tracking-xl color-navy-600" style={{ fontFamily: "monospace" }}>
                  {prompt.responseQuery}
                </p>
                {promptHistory.length - 1 === index && (
                  <p className="hover:underline cursor-pointer text-sm color-blue-500" onClick={handleViewResults}>
                    ⬅️ See the results
                  </p>
                )}
              </>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const renewSession = () => {
    isFromHistoryRef.current = false;
    setQuery("");
    setIsShowTable(false);
    setSuggestions(null);
    setPromptHistory([]);
    setCurrentSSID(null);
    setResponse({
      userPrompt: "",
      responseQuery: "",
      tableData: [],
      chartData: [],
    });
  }

  React.useEffect(() => {
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [promptHistory]);

  React.useEffect(() => {
    if (debouncedQuery) {
      setIsSuggestionsLoading(true);
      getSuggestionsFromBackend(debouncedQuery).then(data => {
        setSuggestions(data);
        setIsSuggestionsLoading(false);
      });
    }
  }, [debouncedQuery]);

  React.useEffect(() => {
    EventEmitter.subscribe('historyItemClick', async ({ detail: item }) => {
      renewSession();
      setCurrentSSID(item.session_id);
      await getFromHistory();
      await handleSend({ preventDefault: () => {} });
    });

    EventEmitter.subscribe('historyItemAdd', () => {
      renewSession();
    });
  }, []);

  React.useEffect(() => {
    if (response.tableData.length > 0) {
      handleViewResults();
    }
  }, [response]);

  return (
    <div className="w-full flex bg-red-100 bg-opacity-50" style={{ height: "calc(100vh - 70px)" }}>
      {isShowTable && (
        <>
          <div className="p-4 h-11/12 m-auto overflow-auto anim fade-in flex flex-col gap-4 bg-white border-blue-100 border-opacity-50 radius-md shadow-md" style={{ maxWidth: "40rem", width: "calc(100vw - 13rem)" }}>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl">Results</h1>
              <button onClick={() => setIsShowTable(false)} className="w-6 h-6 p-0.5 radius-full bg-gray-50 cursor-pointer hover:bg-gray-100">
                <IconXmark className="w-5 h-5" />
              </button>
            </div>
            {currentResp.tableData.length > 0 ? (
              <Table data={currentResp.tableData} chartData={currentResp.chartData} />
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-lg color-gray-300">No data to display</p>
              </div>
            )}
          </div>
          <span className="w-px bg-gray-100 h-full" />
        </>
      )}
      <div className="p-4 flex flex-col gap-4 h-11/12 bg-white m-auto border-blue-100 border-opacity-50 relative radius-md shadow-md" style={{ maxWidth: "32rem", width: "calc(100vw - 13rem)" }}>
        <h1 className="text-2xl">Query Builder</h1>
        <p className="text-sm color-gray-300">Your AI assistant is here to help you with your queries...</p>
        {isGetLastMsgLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-1 h-full w-full" style = {{ backdropFilter: "blur(2px)" }}>
            <div className='sticky top-1/2 transform -translate-y-1/2'>
              <Loader size='large' />
            </div>
          </div>
        )}
        {renderChat()}
        {suggestions ? (
          <div className="flex flex-col gap-2">
            <ul className="mt-auto">
              <p className="color-gray-300 text-sm mb-2 text-center" style={{ letterSpacing: "0.05rem", textTransform: "uppercase" }}>
                Suggestions:
              </p>
              {suggestions.map((text, index) => (
                text === "An error occurred while fetching suggestions." ? (
                  <li key={index} className="color-red-500 text-s">{text}</li>
                ) : (
                  <li key={index} className="color-gray-300 list-disc ml-4 hover:underline cursor-pointer text-s" onClick={() => {
                    setQuery(text);
                    setTimeout(() => sendBtnRef.current.click(), 0);
                  }}>
                    {text}
                  </li>
                )
              ))}
            </ul>
            {isSuggestionsLoading && (
              <div className="flex items-center gap-2">
                <span className="color-gray-300 text-s">Generating suggestions for you...</span>
                <Loader size='small' className='anim-150' />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ul className="mt-auto">
              <p className="color-gray-300 text-sm mb-2 text-center uppercase" style={{ letterSpacing: "0.05rem", textTransform: "uppercase" }}>
                Suggestions:
              </p>
              {helperTexts.map((text, index) => (
                <li key={index} className="color-gray-300 list-disc ml-4 hover:underline cursor-pointer text-s" onClick={() => {
                  setQuery(text);
                  setTimeout(() => sendBtnRef.current.click(), 0);
                }}>
                  {text}
                </li>
              ))}
              {isSuggestionsLoading && (
                <div className="flex items-center gap-2">
                  <span className="color-gray-300 text-s">Generating suggestions for you...</span>
                  <Loader size='small' className='anim-150' />
                </div>
              )}
            </ul>
          </div>
        )}
        <form className="flex gap-2 items-center mt-auto">
          <input type="text" className="text-sm w-full shadow-xs px-3 bg-white border border-navy-100 color-navy-600 radius-lg h-10 outline-0" value={query} onChange={e => setQuery(e.target.value)} placeholder="What do you want to query?" />
          <button ref={sendBtnRef} disabled={isLoading || !query} onClick={handleSend} className="inline-flex shrink-0 items-center whitespace-nowrap gap-2 justify-center radius-lg h-10 px-4 text-sm bg-green-500 hover:bg-green-600 color-white shadow-xs min-w-20">
            {isLoading ? <Loader /> : "Send"}
          </button>
        </form>
      </div>
    </div>
  )

}