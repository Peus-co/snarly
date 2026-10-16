
export default function Example() {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full border-t border-[#727272] text-white">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                <div className="md:max-w-96">
                    <img
                        src="/ghost.png"
                        alt="Ghost Squadron"
                        className="w-14 h-14 object-contain"
                    />

                    <p className="mt-6 text-sm leading-6">
                        Upload multiple PDFs, ask questions, and get accurate,
                        context-aware answers from your documents. Our AI-powered
                        assistant helps you find key information, understand
                        complex content, and save time with intelligent
                        document analysis.
                    </p>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-10 md:gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">
                            Company
                        </h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="/" className="hover:text-blue-600">Home</a></li>
                            <li><a href="/about" className="hover:text-blue-600">About us</a></li>
                            <li><a href="/contact" className="hover:text-blue-600">Contact us</a></li>
                            <li><a href="/privacy" className="hover:text-blue-600">Privacy policy</a></li>
                        </ul>
                    </div>

                    <div className="w-full max-w-md">
                        <h2 className="font-semibold text-gray-800 mb-5">
                            Stay updated
                        </h2>
                        <div className="text-sm space-y-2">
                            <p>
                                Get product updates, AI tips, and new features
                                delivered to your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-2 pt-4">
                                <input
                                    className="border border-white-500/30 placeholder-gray-500 focus:ring-2  outline-none w-full h-10 rounded-2xl px-3"
                                    type="email"
                                    placeholder="Enter your email"
                                />
                                <button
                                    type="button"
                                    className="bg-transparent-600 border-white border rounded-2xl hover:bg-[#727272] transition-colors w-full sm:w-28 shrink-0 h-10 text-white rounded"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                © {new Date().getFullYear()}   Snarly Ai. All rights reserved.
            </p>
        </footer>
    );
}
