"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { translate } from "../utils/lang/translate";
import { i18Link } from "../utils/lang/getLink";
import "./CategoryFilter.scss";

interface Category {
  title: string;
  _id: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | undefined;
  locale: "sv" | "en";
}

export function CategoryFilter({
  categories,
  activeCategory,
  locale,
}: CategoryFilterProps) {
  const router = useRouter();

  const handleClick = (categoryId?: string) => {
    const params = new URLSearchParams();
    if (categoryId) {
      params.set("category", categoryId);
    }
    const qs = params.toString();
    router.push(i18Link(qs ? `news?${qs}` : "news", locale));
  };

  return (
    <div className="category-filter container-width">
      <button
        className={`category-filter__pill ${!activeCategory ? "category-filter__pill--active" : ""}`}
        onClick={() => handleClick()}
      >
        {translate("all", locale)}
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          className={`category-filter__pill ${activeCategory === cat._id ? "category-filter__pill--active" : ""}`}
          onClick={() => handleClick(cat._id)}
        >
          {cat.title}
        </button>
      ))}
    </div>
  );
}
