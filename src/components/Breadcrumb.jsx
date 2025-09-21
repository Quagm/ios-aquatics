import Link from "next/link"      

export default function 
Breadcrumb({ items }) {
  return (
    <nav className="mb-12">
      <ol className="flex items-center space-x-3 text-sm text-white/70">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-3">
            {index > 0 && <span>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-[#6c47ff] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={item.isActive ? "text-white font-medium" : ""}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
