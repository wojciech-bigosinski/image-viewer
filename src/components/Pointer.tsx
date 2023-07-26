// Photo.tsx
import { ReactNode, memo } from 'react';

interface Props {
    handleClick: () => void;
    children: ReactNode;
}


const Pointer: React.FC<Props> = memo(function Pointer({handleClick, children}) {
    return (
        <button className='h-1/6 border-4 p-4 px-5 m-4 rounded-full hover:bg-slate-200 focus:ring focus:ring-slate-300' onClick={() => handleClick()}>{children};</button>
    );
});

export default Pointer;
