"use client";

/* eslint-disable @next/next/no-img-element */
import { PortableText } from "@portabletext/react";
import { getImageDimensions } from "@sanity/asset-utils";
import { createImageUrlBuilder } from "@sanity/image-url";

import "./BlockContent.scss";
import { client } from "@mi/sanity";
import dynamic from "next/dynamic";
const CodeBlock = dynamic(() => import("./CodeBlock"), { ssr: false });

const builder = createImageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);
const Image = ({ value }: { value: any }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <img
      className="block-content__image"
      src={urlFor(value)
        .quality(80)
        .image(value)
        .fit("max")
        .auto("format")
        .width(900)
        .url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: width / height,
      }}
    />
  );
};

export default function BlockContent({ content, className }: any) {
  return !content ? null : (
    <div className="block-content">
      <PortableText
        // Array of portable text blocks
        value={content}
        components={{
          // ...
          types: {
            image: Image,
            code: (props: any) => {
              return <CodeBlock code={props.value.code} />;
            },
          },
        }}
      />
    </div>
  );
}
