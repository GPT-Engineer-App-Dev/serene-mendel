import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

const fetchHackerNews = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery(['hackerNews'], fetchHackerNews);

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Top 100 Hacker News Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading && (
        <div className="space-y-4">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <ul className="space-y-4">
        {filteredStories.map((story) => (
          <li key={story.objectID} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
            <p className="text-sm text-gray-600 mb-2">Upvotes: {story.points}</p>
            <Button asChild variant="outline" size="sm">
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Read More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
