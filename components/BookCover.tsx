import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import BookCoverSvg from "./BookCoverSvg";

type BookCoverVariant = "extraSmall" | "Small" | "meduim" | "regular" | "wide";
const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: " book-cover_extra_small",
  Small: " book-cover_small",
  meduim: " book-cover_meduim",
  regular: " book-cover_regular",
  wide: " book-cover_wide",
};
interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string;
}
const BookCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverImage = "https://placeholder.co/400×600.png",
}: Props) => {
  return (
    <div
      className={cn(
        " relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <BookCoverSvg coverColor={coverColor} />

      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <Image
          src={coverImage}
          alt="book cover"
          fill
          className="rounded-sm object-fil "
        />
      </div>
    </div>
  );
};

export default BookCover;
