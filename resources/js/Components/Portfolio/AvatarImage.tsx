import {
    useEffect,
    useRef,
    useState,
} from 'react';

function getAvatarBaseSize(
    naturalWidth: number,
    naturalHeight: number,
    viewportSize: number,
) {
    const aspectRatio = naturalWidth / naturalHeight;

    if (
        !Number.isFinite(aspectRatio) ||
        aspectRatio <= 0
    ) {
        return {
            width: viewportSize,
            height: viewportSize,
        };
    }

    if (aspectRatio >= 1) {
        return {
            width: viewportSize * aspectRatio,
            height: viewportSize,
        };
    }

    return {
        width: viewportSize,
        height: viewportSize / aspectRatio,
    };
}

function getAvatarTranslation(
    naturalWidth: number,
    naturalHeight: number,
    zoom: number,
    positionX: number,
    positionY: number,
    cropSize: number,
) {
    const baseSize = getAvatarBaseSize(
        naturalWidth,
        naturalHeight,
        cropSize,
    );

    const scaledWidth = baseSize.width * zoom;
    const scaledHeight = baseSize.height * zoom;

    const maxX = Math.max(
        0,
        (scaledWidth - cropSize) / 2,
    );

    const maxY = Math.max(
        0,
        (scaledHeight - cropSize) / 2,
    );

    return {
        x: ((positionX - 50) / 50) * maxX,
        y: ((positionY - 50) / 50) * maxY,
        baseWidth: baseSize.width,
        baseHeight: baseSize.height,
    };
}

type AvatarImageProps = {
    src: string;
    alt: string;
    className?: string;
    zoom?: number;
    positionX?: number;
    positionY?: number;
    onError?: () => void;
};

export default function AvatarImage({
    src,
    alt,
    className = 'select-none object-cover',
    zoom = 1,
    positionX = 50,
    positionY = 50,
    onError,
}: AvatarImageProps) {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [naturalSize, setNaturalSize] = useState({
        width: 1,
        height: 1,
    });

    const [cropSize, setCropSize] = useState(1);

    useEffect(() => {
        const image = imageRef.current;
        const container = containerRef.current;

        if (!image || !container) {
            return;
        }

        const update = () => {
            setNaturalSize({
                width: image.naturalWidth || 1,
                height: image.naturalHeight || 1,
            });

            setCropSize(
                Math.min(
                    container.clientWidth || 1,
                    container.clientHeight || 1,
                ),
            );
        };

        if (image.complete) {
            update();
        }

        image.addEventListener('load', update);

        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(container);

        return () => {
            image.removeEventListener('load', update);
            resizeObserver.disconnect();
        };
    }, [src]);

    const translation = getAvatarTranslation(
        naturalSize.width,
        naturalSize.height,
        zoom,
        positionX,
        positionY,
        cropSize,
    );

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
        >
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                onError={onError}
                className={className}
                draggable={false}
                style={{
                    width: `${translation.baseWidth}px`,
                    height: `${translation.baseHeight}px`,
                    maxWidth: 'none',
                    transform: `
                        translate(-50%, -50%)
                        translate(
                            ${translation.x}px,
                            ${translation.y}px
                        )
                        scale(${zoom})
                    `,
                    transformOrigin: 'center',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                }}
            />
        </div>
    );
}
