// Photo.tsx
import { memo, useId } from 'react';

interface Props {
    src: string;
    alt: string;
    photo: Photo;
    handleClick: (photo: Photo) => void;
}

interface Photo {
    id: number;
    url: string;
    src: {
      small: string;
      large: string;
    };
}

const Image: React.FC<Props> = memo(function Image({src, alt, photo, handleClick}) {
    const photoId = useId();

    return (
        <img
            className="m-1"
            src={src}
            alt={alt}
            key={photoId}
            onClick={() => handleClick(photo)}
        />
    );
});

export default Image;
