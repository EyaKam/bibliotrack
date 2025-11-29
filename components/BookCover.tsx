'use client';

import React from "react";
import { cn } from "@/lib/utils";
import BookCoverSvg from "./BookCoverSvg";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";

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
        <IKImage
          path={coverImage}
          urlEndpoint= {config.env.imageKit.urlEndpoint}
          alt="book cover"
          fill
          className="rounded-sm object-fil "
          loading ="lazy"
          lqip ={{ active: true }}
        />

      </div>
    </div>
  );
};

export default BookCover;
