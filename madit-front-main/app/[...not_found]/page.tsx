import Link from "next/link";

export default function FourOhFour() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page has been removed, moved or haven&apos;t existed before</p>
      <Link passHref tabIndex={-1} href={`/`}>
        Back to start
      </Link>
    </div>
  );
}
