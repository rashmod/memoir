export default function NewTabLink({ link, children }: { link: string | undefined; children: React.ReactNode }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
