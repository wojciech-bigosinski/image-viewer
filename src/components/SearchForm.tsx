import { useState, memo } from 'react';
import { HexColorPicker } from "react-colorful";
import { useAppSelector } from "../redux/hooks";
import { useAppDispatch } from "../redux/hooks";
import { selectQuery } from "../redux/slices/searchSlice";
import { selectColor } from "../redux/slices/searchSlice";
import { setQueryRedux } from '../redux/slices/searchSlice';
import { setColorRedux } from '../redux/slices/searchSlice';


interface Props {
    onSearch: (query: string, color: string) => void;
}

const Form: React.FC<Props> = memo(({ onSearch }: Props) => {
  const [query, setQuery] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const queryRedux = useAppSelector(selectQuery);
  const colorRedux = useAppSelector(selectColor);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, color);
  };

  return (
    <>
      <form className='h-4/12 flex flex-col items-center text-xl border rounded px-4 py-8 m-4' onSubmit={handleSubmit}>
          <div className='flex flex-col lg:flex-row items-center justify-center flex-wrap'>
              <div className='flex flex-col lg:flex-row items-center'>
                  <label>Objects to search for: </label>
                  <input 
                      className='border p-2 ml-3 text-2xl'
                      type="text" 
                      value={query} 
                      onChange={(e) => {
                        setQuery(e.target.value);
                        dispatch(setQueryRedux(e.target.value));
                      }} 
                      placeholder="Search photos..." 
                  />
              </div>
              <div className='flex flex-col mt-4 md:mt-2 lg:mt-0 lg:flex-row items-center'>
                  <label className='ml-6 mr-3'>Color to focus on:</label>
                  <HexColorPicker color={color} onChange={(e) => {
                    setColor(e);
                    dispatch(setColorRedux(e));
                  }} />
                  <p className='ml-2'>or maybe <button className='border-2 p-2 rounded mt-4 lg:mt-0 hover:bg-slate-200 focus:ring focus:ring-slate-300' onClick={(e) => {
                    e.preventDefault();
                    setColor("");
                    dispatch(setColorRedux("no color selected!"));
                  }}>none</button>?</p>
              </div>
          </div>
          <div className='mt-4'>
              <button className='border-4 p-4 rounded text-xl hover:bg-slate-200 focus:ring focus:ring-slate-300' type="submit">Search</button>
          </div>
      </form>
      <div className='flex flex-col lg:flex-row justify-between items-center min-w-1/6 space-x-2 mb-4'>
        <div>Current query:</div>
        <div className='border-2 p-2 rounded text-xl'>{queryRedux}</div>
        <div>Current color:</div>
        <div className='border-2 p-2 rounded text-xl'>{colorRedux}</div>
      </div>
    </>
  );
});

export default Form;
