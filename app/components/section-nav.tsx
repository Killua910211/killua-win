type SectionNavItem = {
  href: string;
  label: string;
};

type SectionNavProps = {
  items: readonly SectionNavItem[];
  label: string;
};

/** 首屏末端的页内导航：向下滚动后仍作为该页分区的吸顶目录。 */
export function SectionNav({ items, label }: SectionNavProps) {
  return (
    <nav className="section-local-nav" aria-label={label}>
      {items.map((item) => (
        <a href={item.href} key={item.href}>{item.label}</a>
      ))}
    </nav>
  );
}
