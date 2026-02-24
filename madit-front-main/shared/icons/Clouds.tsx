import styles from "./Clouds.module.scss";

export default function Clouds({ inverted = false }: { inverted?: boolean }) {
  return (
    <svg
      className={`${styles.clouds} ${inverted ? styles.inverted : ""}`}
      width="647"
      height="1499"
      viewBox="0 0 647 1499"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.3">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M82.7122 1498.62C-102.639 1511.08 -202.697 1212.94 -287.513 991.592C-349.27 830.419 -349.309 648.774 -309.236 475.721C-273.466 321.25 -190.973 205.289 -86.6381 124.124C32.0076 31.8251 149.441 -18.1706 294.451 6.09348C461.689 34.0769 617.803 206.371 644.369 423.78C670.124 634.555 500.553 769.85 409.15 944.767C303.201 1147.52 267.108 1486.23 82.7122 1498.62Z"
          fill="#6B21A8"
        ></path>
      </g>
    </svg>
  );
}
