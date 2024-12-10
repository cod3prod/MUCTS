export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-primary-focus to-yellow-400 text-transparent bg-clip-text">
              MUCTS
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              1인 가구를 위한 따뜻한 한 끼 커뮤니티
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold mb-3">서비스</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-gray-500 hover:text-primary cursor-pointer">
                    이용약관
                  </span>
                </li>
                <li>
                  <span className="text-sm text-gray-500 hover:text-primary cursor-pointer">
                    개인정보처리방침
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">문의</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:contact@mucts.com"
                    className="text-sm text-gray-500 hover:text-primary"
                  >
                    이메일
                  </a>
                </li>
                <li>
                  <span className="text-sm text-gray-500 hover:text-primary cursor-pointer">
                    고객센터
                  </span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-sm font-semibold mb-3">소셜미디어</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-gray-500 hover:text-primary cursor-pointer">
                    GitHub
                  </span>
                </li>
                <li>
                  <span className="text-sm text-gray-500 hover:text-primary cursor-pointer">
                    Discord
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} MUCTS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
