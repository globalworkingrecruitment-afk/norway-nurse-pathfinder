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
  "aspect-square overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl";
const baseImageClasses =
  "h-full w-full object-cover transition-transform duration-300 hover:scale-105";

export const ProgramGalleryGrid = ({ items, className }: ProgramGalleryGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, index) => {
        if (item.type === "stack") {
          return (
            <div
              key={`stack-${index}`}
              className={cn(
                "flex flex-col gap-4",
                item.wrapperClassName ?? "col-span-2 md:col-span-1 lg:col-span-2",
              )}
            >
              {item.items.map((stackedImage, stackedIndex) => (
                <div
                  key={stackedImage.src + stackedIndex.toString()}
                  className={cn(baseWrapperClasses)}
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
            className={cn(baseWrapperClasses, item.wrapperClassName)}
          >
            <img src={item.src} alt={item.alt} className={baseImageClasses} />
          </div>
        );
      })}
    </div>
  );
};
