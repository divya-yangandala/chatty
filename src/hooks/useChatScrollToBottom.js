import { useEffect, useRef } from 'react';

const useChatScrollToBottom = (prop) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight;
    }
  }, [prop]);

  return scrollRef;
}

export default useChatScrollToBottom;

// usage

// const list = [1,2,3,4,5,6,7];

// const elementScrollRef = useChatScrollToBottom(list);

// list.push(8);
// list.push(9);
// <div ref={elementScrollRef}>

// </div>
