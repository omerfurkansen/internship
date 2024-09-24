import React, { useEffect, useState } from 'react';
import { Loader } from '@jotforminc/magnet'
import { IconAngleLeft, IconAngleRight, IconPlus } from '@jotforminc/svg-icons';
import EventEmitter from './EventEmitter';

export default function SideBar() {
  const [historyItems, setHistoryItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [slicedHistory, setSlicedHistory] = React.useState([]);
  const historiesRef = React.useRef(null);
  const [isLoadingHistories, setIsLoadingHistories] = React.useState(false);
  const [chosenHistory, setChosenHistory] = React.useState(null);

  const handleScroll = () => {
    if (historiesRef.current.scrollTop + historiesRef.current.clientHeight >= historiesRef.current.scrollHeight - 100) {
      setSlicedHistory(prevData => [...prevData, ...historyItems.slice(prevData.length, prevData.length + 10)]);
    }
  }

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleSidebarItemClick = (item) => {
    EventEmitter.emit('historyItemClick', item);
    setChosenHistory(item);
  }

  const handleSiderbarItemAdd = () => {
    EventEmitter.emit('historyItemAdd');
    setChosenHistory(null);
  }

  useEffect(() => {
    setIsLoadingHistories(true);
    const fetchHistories = () =>
      fetch('https://b-karaca.jotform.dev/intern-api/querybuilder')
        .then(response => response.json())
        .then(data => {
          setIsLoadingHistories(false);
          setHistoryItems(data.content);
          setSlicedHistory(data.content.slice(0, 20));
        })
        .catch(error => {
          setIsLoadingHistories(false);
          setHistoryItems([]);
          setSlicedHistory([]);
        });

    fetchHistories();
    
    EventEmitter.subscribe('newChatCreated', () => {
      fetchHistories();
    });
  }, []);


  return (
    isSidebarOpen ? (
      <div className="anim fade-in-full-left w-52 min-w-52 p-4 overflow-auto radius-md shadow-md" style={{ height: 'calc(100vh - 70px)', backgroundColor: '#f3f3fe' }} ref={historiesRef} onScroll={handleScroll}>
        <div className="flex items-center justify-between">
          <button onClick={handleSidebarToggle} className="w-6 h-6 p-0.5 radius-full bg-gray-50 cursor-pointer hover:bg-gray-100" title="Hide History">
            <IconAngleLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-0.5">
            <h2 className="text-lg font-semibold px-2" style={{ color: '#545f6f' }}>History</h2>
            <button onClick={handleSiderbarItemAdd} className="w-6 h-6 p-0.5 radius-full bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-center" title="Add New History">
              <IconPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <ul className="mt-4 space-y-2 overflow-y-auto min-h-12">
          {isLoadingHistories ? <Loader /> : slicedHistory.length === 0 ? 'No histories exist' : slicedHistory.map(item => (
            <li key={item.id} className="flex items-center justify-between p-2 cursor-pointer transition-colors duration-200 ease-in-out transform radius-md hover:bg-purple-100 hover:shadow-xs" onClick={() => handleSidebarItemClick(item)} style={chosenHistory?.id === item.id ? { backgroundColor: '#E2E3E9' } : {}}>
              <div style={{ color: '#545f6f' }}>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm">
                  {new Date(item.operation_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="p-4 overflow-hidden radius-md shadow-md flex flex-col gap-3" style={{ height: 'calc(100vh - 70px)', backgroundColor: '#f3f3fe' }}>
        <button onClick={handleSidebarToggle} className="w-6 h-6 p-0.5 radius-full bg-gray-50 cursor-pointer hover:bg-gray-100" title="Show History">
          <IconAngleRight className="w-5 h-5" />
        </button>
        <button onClick={handleSiderbarItemAdd} className="w-6 h-6 p-0.5 radius-full bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-center" title="Add New History">
          <IconPlus className="w-4 h-4" />
        </button>
      </div>
    )
  );
}