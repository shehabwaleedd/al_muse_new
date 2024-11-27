import React from 'react';
import styles from './styles/ImagesUploader.module.scss';
import Image from 'next/image';
import { UploadedImage } from '@/types/common';

interface ImagesUploaderProps {
    uploadedImages: UploadedImage[];
    setUploadedImages: (images: UploadedImage[]) => void;
}

const ImagesUploader: React.FC<ImagesUploaderProps> = ({
    uploadedImages,
    setUploadedImages
}) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImageFiles: UploadedImage[] = Array.from(files).map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));
            setUploadedImages([...uploadedImages, ...newImageFiles]);
        }
    };

    React.useEffect(() => {
        return () => {
            uploadedImages.forEach(image => {
                if (image.url && image.file instanceof File) {
                    URL.revokeObjectURL(image.url);
                }
            });
        };
    }, []);

    const handleRemoveImage = (index: number) => {
        const newImages = [...uploadedImages];
        if (newImages[index].url && newImages[index].file instanceof File) {
            URL.revokeObjectURL(newImages[index].url);
        }
        newImages.splice(index, 1);
        setUploadedImages(newImages);
    };

    return (
        <div className={styles.imagesUploader}>
            <label htmlFor="images">Event Images</label>
            <input
                type="file"
                id="images"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className={styles.fileInput}
            />
            <div className={styles.imagesGrid}>
                {uploadedImages.map((image, index) => (
                    <div key={index} className={styles.imageWrapper}>
                        <Image
                            src={image.url || (image.file instanceof File ? URL.createObjectURL(image.file) : image.file as string)}
                            alt={`Event Gallery Image ${index + 1}`}
                            width={500}
                            height={500}
                            className={styles.image}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className={styles.removeButton}
                            aria-label="Remove image"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImagesUploader;