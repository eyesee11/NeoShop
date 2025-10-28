import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-black uppercase mb-3">About NeoShop</h3>
            <p className="text-gray-300">
              My modern e-commerce destination with a unique neo-brutalist
              design. Built with Next.js 15, TypeScript, and TailwindCSS.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-black uppercase mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-purple-400 transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="hover:text-purple-400 transition-colors"
                >
                  Admin
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-black uppercase mb-3">Tech Stack</h3>
            <ul className="space-y-1 text-gray-300">
              <li>• Next.js 15 (App Router)</li>
              <li>• TypeScript</li>
              <li>• TailwindCSS</li>
              <li>• SSG, ISR, SSR</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-gray-700 text-center">
          <p className="font-bold">
            © 2025 NeoShop. Built with coffee and maggie.
          </p>
        </div>
      </div>
    </footer>
  );
}
