const useLocalStorage = (key, type) => {
  try {
    if (type === 'get') {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : '';
    } else if (type === 'set') {
      const setValue = (newValue) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
      return [setValue];
    } else if (type === 'delete') {
      const deleteValue = () => {
        window.localStorage.removeItem(key);
      }
      return [deleteValue];
    }
  } catch (error) {
    console.log(error);
  }
}

export default useLocalStorage;

// examples

// const username = useLocalStorage('username', 'get');

// const [setMyUsername] = useLocalStorage('username', 'set');

// setMyUsername('Divya');

// const [deleteUsername] = useLocalStorage('username', 'delete');

// deleteUsername();
