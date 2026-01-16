import { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import { Link } from 'react-router-dom';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data, isLoading } = useSearch({ query }, submitted);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Knowledge Base</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for content, topics, concepts..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Searching...</p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Found {data.total} result{data.total !== 1 ? 's' : ''}
            </p>

            {data.items.map((item) => (
              <div key={item.id} className="bg-white shadow rounded-lg p-6">
                <Link
                  to={`/content/${item.id}`}
                  className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                >
                  {item.title}
                </Link>

                <div className="mt-2 flex gap-2 text-sm text-gray-500">
                  <span className="font-medium">{item.type}</span>
                  <span>•</span>
                  <span>{item.sourceType}</span>
                  <span>•</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                {data.excerpts?.[item.id] && (
                  <div
                    className="mt-4 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: data.excerpts[item.id] }}
                  />
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {data.items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
