export default function NewTabLink({
  link,
  children,
  className,
}: {
  link?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={link} className={className} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
