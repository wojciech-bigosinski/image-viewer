// Form.tsx
import { useState } from 'react';
import { HexColorPicker } from "react-colorful";

interface Props {
    onSearch: (query: string, color: string) => void;
}

const Form: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(color)
    onSearch(query, color);
  };

  return (
    <form className='h-4/12 flex flex-col items-center text-xl border rounded px-4 py-8 m-4' onSubmit={handleSubmit}>
        <div className='flex flex-col lg:flex-row items-center justify-center flex-wrap'>
            <div className='flex flex-col lg:flex-row items-center'>
                <label>Object(s) to search for: </label>
                <input 
                    className='border p-2 ml-3 text-2xl'
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search photos..." 
                />
            </div>
            <div className='flex flex-col mt-4 lg:mt-0 lg:flex-row items-center'>
                <label className='ml-6 mr-3'>Color to focus on:</label>
                <HexColorPicker color={color} onChange={setColor} />
            </div>
        </div>
        <div className='mt-4'>
            <button className='border-4 p-4 rounded text-xl hover:bg-slate-200 focus:ring focus:ring-slate-300' type="submit">Search</button>
        </div>
    </form>
  );
};

export default Form;
