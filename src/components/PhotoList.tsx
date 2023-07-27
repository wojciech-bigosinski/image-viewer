import { useEffect, useState, useCallback, useRef, memo } from "react";
import Image from "./Image";
import Pointer from "./Pointer";
import SelectedPhoto from "./SelectedPhoto";


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

const PhotoList: React.FC<Props> = memo(({ query, color }: Props) => {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
    const [photos, setPhotos] = useState<Photo[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
    const [noResults, setNoResults] = useState<boolean>(false);

    const photosContainerRef = useRef<HTMLDivElement>(null);

    const fetchImages = useCallback(async (query: string, color: string, page: number) => {
        setIsLoading(true);

        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=${page}&color=${color.slice(1)}`, {
            headers: {
                Authorization: "api key",
            },
        });
        const data = await response.json();

        if (!data || !data.photos) {
            console.error('Error: API response is missing photos');
            throw new Error('API response is missing photos');
        }

        if (data.total_results === 0) {
            setNoResults(true);
        }
        else {
            setNoResults(false);
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
    

    const handleSelectPhoto = useCallback((photo: Photo, index: number) => {
        setSelectedPhoto(photo);
        setSelectedPhotoIndex(index);
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
                handleSelectPhoto(nextPhoto, currentIndex + 1);
                scrollToPhoto(currentIndex + 1);
                
                if (photos.length - currentIndex <= 5) {
                    fetchMore();
                }
            }
        }
    }, [handleSelectPhoto, photos, scrollToPhoto, selectedPhoto, fetchMore])    
    
    const handleClickLeft = useCallback(() => {
        if (photos && selectedPhoto) {
            const currentIndex = photos.indexOf(selectedPhoto);
            if (currentIndex > 0) {
                const prevPhoto = photos[currentIndex - 1];
                handleSelectPhoto(prevPhoto, currentIndex - 1);
                scrollToPhoto(currentIndex - 1);
            }
        }
    }, [handleSelectPhoto, photos, scrollToPhoto, selectedPhoto])
    


    return (
        <div className="flex flex-col justify-center items-center">
            {noResults ?
            <div>No results</div> : <></>}
            {isLoading ? 
            <div className="fixed bottom-2 right-2 bg-black text-white p-6 rounded-lg opacity-75 transition-opacity ease-in-out duration-1000 scale-100">Loading...</div>
            : 
            <></>
            }
            <div className="flex items-center">
            {(hasMore && selectedPhoto) && (
                <Pointer handleClick={handleClickLeft}>
                    <div className='h-0 w-0 border-y-8 border-y-transparent border-r-[16px] border-r-slate-600'/>
                </Pointer>
            )}
            {selectedPhoto && (
                <SelectedPhoto src={selectedPhoto.src.large} alt={selectedPhoto.url}/>
            )}
            {(hasMore && selectedPhoto) && (
                <Pointer handleClick={handleClickRight}>
                    <div className='h-0 w-0 border-y-8 border-y-transparent border-l-[16px] border-l-slate-600'/>
                </Pointer>
            )}
            </div>
            <div className="h-2/6 w-1/2 flex items-center justify-center w-full">
                <div ref={photosContainerRef} className="flex w-10/12 flex-wrap justify-center">
                    {photos && photos.map((photo, index) => (
                        <Image
                            src={photo.src.small}
                            alt={photo.url}
                            photo={photo}
                            key={index}
                            selected={index === selectedPhotoIndex ? true : false}
                            handleClick={() => handleSelectPhoto(photo, index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
})

export default PhotoList;