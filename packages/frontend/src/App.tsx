import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import LibraryPage from './pages/LibraryPage';
import SearchPage from './pages/SearchPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Fearvanai Knowledge Base
            </Link>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link to="/upload" className="text-gray-700 hover:text-gray-900">
                Upload
              </Link>
              <Link to="/library" className="text-gray-700 hover:text-gray-900">
                Library
              </Link>
              <Link to="/search" className="text-gray-700 hover:text-gray-900">
                Search
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

function HomePage() {
  return (
    <Layout>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Fearvanai Knowledge Base
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload and manage Akshay's content to build a comprehensive AI knowledge base
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Link
              to="/upload"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Content</h3>
              <p className="text-gray-600">
                Upload videos, podcasts, documents, and more
              </p>
            </Link>

            <Link
              to="/library"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Library</h3>
              <p className="text-gray-600">
                View and manage all uploaded content
              </p>
            </Link>

            <Link
              to="/search"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search</h3>
              <p className="text-gray-600">
                Find content with semantic and full-text search
              </p>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
