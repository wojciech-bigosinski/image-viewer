// App.tsx
import { useCallback, useState } from 'react';
import Form from '../components/SearchForm';
import PhotoList from '../components/PhotoList';
import { Footer } from "../components/Footer";

function App() {
  const [query, setQuery] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const handleSearch = useCallback((searchQuery: string, searchColor: string) => {
    setQuery(searchQuery);
    setColor(searchColor);
  }, []);

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <Form onSearch={handleSearch} />
      <PhotoList query={query} color={color} />
      <Footer/>
    </div>
  );
}

export default App;
