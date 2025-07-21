export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Nested layouts should not contain <html> or <body> tags.
  // Just return the children.
  return <>{children}</>;
}