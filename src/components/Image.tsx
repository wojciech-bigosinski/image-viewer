import { memo, useId } from 'react';

interface Props {
    src: string;
    alt: string;
    photo: Photo;
    selected: boolean;
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

const Image: React.FC<Props> = memo(({src, alt, photo, selected, handleClick}: Props) => {
    const photoId = useId();

    return (
        <img
            className={selected ? "border-4 border border-orange-600" : "m-1"}
            src={src}
            alt={alt}
            key={photoId}
            style={{"contentVisibility": "auto"}}
            onClick={() => handleClick(photo)}
        />
    );
});

export default Image;
