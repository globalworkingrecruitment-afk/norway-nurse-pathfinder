import { cn } from "@/lib/utils";

export interface ProgramGalleryImage {
  src: string;
  alt: string;
  wrapperClassName?: string;
}

export type ProgramGalleryItem =
  | ({
      type: "image";
    } & ProgramGalleryImage)
  | {
      type: "stack";
      wrapperClassName?: string;
      items: ProgramGalleryImage[];
    };

interface ProgramGalleryGridProps {
  items: ProgramGalleryItem[];
  className?: string;
}

const baseWrapperClasses =
  "group relative break-inside-avoid overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl";
const baseImageClasses =
  "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105";

export const ProgramGalleryGrid = ({ items, className }: ProgramGalleryGridProps) => {
  return (
    <div
      className={cn(
        "columns-2 gap-4 sm:columns-3 lg:columns-4",
        className,
      )}
    >
      {items.map((item, index) => {
        if (item.type === "stack") {
          return (
            <div
              key={`stack-${index}`}
              className={cn(
                "mb-4 flex flex-col break-inside-avoid",
                item.wrapperClassName,
              )}
            >
              {item.items.map((stackedImage, stackedIndex) => (
                <div
                  key={stackedImage.src + stackedIndex.toString()}
                  className={cn("mb-4 last:mb-0", baseWrapperClasses)}
                >
                  <img
                    src={stackedImage.src}
                    alt={stackedImage.alt}
                    className={baseImageClasses}
                  />
                </div>
              ))}
            </div>
          );
        }

        return (
          <div
            key={item.src + index.toString()}
            className={cn("mb-4", baseWrapperClasses, item.wrapperClassName)}
          >
            <img src={item.src} alt={item.alt} className={baseImageClasses} />
          </div>
        );
      })}
    </div>
  );
};
