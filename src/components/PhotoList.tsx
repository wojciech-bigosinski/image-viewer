import { useEffect, useState, useCallback, useRef, memo } from "react";
import Image from "./Image";
import Pointer from "./Pointer";


interface Props {
  query: string;
  color: string;
}

interface Photo {
  id: number;
  url: string;
  src: {
    small: string;
    large: string;
  };
}

const PhotoList = memo(function PhotoList({ query, color }: Props) {
    const [photos, setPhotos] = useState<Photo[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);

    const photosContainerRef = useRef<HTMLDivElement>(null);

    const fetchImages = useCallback(async (query: string, color: string, page: number) => {
        setIsLoading(true);
        const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=20&page=${page}&color=${color.slice(1)}`, {
            headers: {
                Authorization: "api key",
            },
        });
        const data = await response.json();

        if (!data || !data.photos) {
            console.error('Error: API response is missing photos');
            throw new Error('API response is missing photos');
        }

        return data;
    }, []);

    const fetchMore = useCallback(() => {
        if (!hasMore || isNextPageLoading) return;
        setIsNextPageLoading(true);
        fetchImages(query, color, currentPage + 1).then(data => {
            setPhotos((prevPhotos) => prevPhotos ? [...prevPhotos, ...data.photos] : data.photos);
            setCurrentPage((prevPage) => prevPage + 1); // increment currentPage
            setIsNextPageLoading(false);
            setHasMore(data.page * data.per_page < data.total_results);
        }).catch(err => console.error('Error fetching data from Pexels API', err));
    }, [hasMore, isNextPageLoading, query, color, currentPage, fetchImages]);

    useEffect(() => {
        if (photos && photos.length > 0 && document.documentElement.offsetHeight <= window.innerHeight) {
            fetchMore();
        }
    }, [photos, fetchMore]);
    

    useEffect(() => {
        if (query === "") return;
        fetchImages(query, color, currentPage).then(data => {
            setPhotos(prevPhotos => {
                const updatedPhotos = prevPhotos ? [...prevPhotos, ...data.photos] : data.photos;
                if (!prevPhotos) {  // This is the first load
                    setSelectedPhoto(data.photos[0]);
                }
                return updatedPhotos;
            });
            setIsLoading(false);
            setHasMore(data.page * data.per_page < data.total_results);
        }).catch(err => console.error('Error fetching data from Pexels API', err));
    
    }, [query, color, currentPage, fetchImages]);


    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || isNextPageLoading) return;
            
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight * 0.8) {
                fetchMore();              
            }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isNextPageLoading, query, color, currentPage, fetchImages, fetchMore]);


    useEffect(() => {
        setPhotos(null);
    }, [query, color])
    

    const handleSelectPhoto = useCallback((photo: Photo) => {
        setSelectedPhoto(photo);
    }, []);

    const scrollToPhoto = useCallback((photoIndex: number) => {
        if (photosContainerRef.current && photos) {
            const photoElements = Array.from(photosContainerRef.current.children);
            const photoElement = photoElements[photoIndex] as HTMLDivElement;

            if (photoElement) {
                const scrollLeft = photoElement.offsetLeft - (photosContainerRef.current.offsetWidth / 2) + (photoElement.offsetWidth / 2);
                photosContainerRef.current.scrollLeft = scrollLeft;
            }
        }
    }, [photos]);


    const handleClickRight = useCallback(() => {
        if (photos && selectedPhoto) {
            const currentIndex = photos.indexOf(selectedPhoto);
            if (currentIndex < photos.length - 1) {
                const nextPhoto = photos[currentIndex + 1];
                handleSelectPhoto(nextPhoto);
                scrollToPhoto(currentIndex + 1);
            }
        }
    }, [handleSelectPhoto, photos, scrollToPhoto, selectedPhoto])


    const handleClickLeft = useCallback(() => {
        if (photos && selectedPhoto) {
            const currentIndex = photos.indexOf(selectedPhoto);
            if (currentIndex < photos.length - 1) {
                const nextPhoto = photos[currentIndex + 1];
                handleSelectPhoto(nextPhoto);
                scrollToPhoto(currentIndex + 1);
            }
        }
    }, [handleSelectPhoto, photos, scrollToPhoto, selectedPhoto])


    return (
        <div className="h-full flex flex-col justify-center items-center">
            {isLoading ? 
            <div className="fixed bottom-2 right-2 bg-black text-white p-6 rounded-lg opacity-75 transition-opacity ease-in-out duration-1000 scale-100">Loading...</div>
            : 
            <></>
            }
            <div className="flex items-center">
            {(hasMore && selectedPhoto) && (
                <Pointer handleClick={handleClickLeft}>
                    &#8592;
                </Pointer>
            )}
            {selectedPhoto && (
                <div className="h-96 w-96 flex justify-center items-center my-10">
                    <img className="max-h-[120%]" src={selectedPhoto.src.large} alt={selectedPhoto.url}/>
                </div>
            )}
            {(hasMore && selectedPhoto) && (
                <Pointer handleClick={handleClickRight}>
                    &#8594;
                </Pointer>
            )}
            </div>
            <div className="h-2/6 w-1/2 flex items-center justify-center w-full">
                <div ref={photosContainerRef} className="flex w-10/12 flex-wrap justify-center">
                    {photos && photos.map((photo) => (
                        <Image
                            src={photo.src.small}
                            alt={photo.url}
                            photo={photo}
                            handleClick={() => handleSelectPhoto(photo)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
})

export default PhotoList;
