import { memo } from 'react';

interface Props {
    src: string;
    alt: string;
}


const SelectedPhoto: React.FC<Props> = memo(({src, alt}: Props) => {
    return (
        <div className="h-96 w-96 flex justify-center items-center my-10">
            <img className="max-h-[120%]" src={src} alt={alt}/>
        </div>
    );
});

export default SelectedPhoto;
