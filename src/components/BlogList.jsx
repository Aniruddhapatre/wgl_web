import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { blogsDatabase } from './firebase2';
import { ChevronRight, Leaf, Zap, Sun, Heart, MessageCircle, Search, Filter, Hand, Share2, Inspect, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  // Define gradient colors based on category
  const getCategoryGradient = (category) => {
    switch(category) {
      case 'REFORESTATION':
        return 'from-green-500/20 to-emerald-900/50';
      case 'RENEWABLE ENERGY':
        return 'from-yellow-500/20 to-amber-900/50';
      case 'OCEAN CONSERVATION':
        return 'from-blue-500/20 to-sky-900/50';
      case 'URBAN ECOLOGY':
        return 'from-teal-500/20 to-cyan-900/50';
      default:
        return 'from-purple-500/20 to-indigo-900/50';
    }
  };

  return (
    <Link to={`/blogs/${post.id}`} className="group relative overflow-hidden rounded-2xl bg-gray-900 text-white shadow-2xl duration-500 ease-in-out transform hover:scale-105 hover:shadow-green-400/40 flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity duration-500 z-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(post.category)}`} />
      </div>
      <div className="flex-grow relative z-20">
        <img src={post.imageUrl} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-30 duration-500 ease-in-out group-hover:opacity-50 group-hover:scale-110" />
        <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2">
            {post.category === 'REFORESTATION' && <Leaf size={20} className="text-green-400" />}
            {post.category === 'RENEWABLE ENERGY' && <Zap size={20} className="text-yellow-400" />}
            {post.category === 'OCEAN CONSERVATION' && <Sun size={20} className="text-orange-400" />}
            {post.category === 'URBAN ECOLOGY' && <Leaf size={20} className="text-teal-400" />}
            <p className="text-sm font-bold uppercase tracking-widest text-green-400">{post.category}</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">{post.title}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags?.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-gray-800/50 rounded-full text-gray-300">
                #{tag}
              </span>
            ))}
          </div>
          <div className="border-t border-green-400/30 pt-4 text-sm opacity-80">
            <span>By {post.author}</span>
            <span className="mx-2">|</span>
            <span>{post.date}</span>
          </div>
          <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-45">
            <ChevronRight size={24} className="transition-transform duration-500 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
      <div className="relative z-10 bg-gray-900/50 backdrop-blur-sm border-t border-green-500/20 p-3 flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} />
            <span>{post.comments ? post.comments.length : 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hand size={18} />
            <span>{post.claps || 0}</span>
          </div>
        </div>
        <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${post.isLiked ? 'text-pink-500 bg-pink-500/10' : 'text-gray-300'}`}>
          <Heart size={18} className={`${post.isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes || 0}</span>
        </div>
      </div>
    </Link>
  );
};

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeTag, setActiveTag] = useState('ALL');
  const [allTags, setAllTags] = useState([]);

  // Get all unique categories and tags
  useEffect(() => {
    const postsRef = ref(blogsDatabase, 'posts');
    
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        setPosts(postsArray);
        setFilteredPosts(postsArray);
        
        // Extract all unique tags
        const tags = new Set();
        postsArray.forEach(post => {
          if (post.tags) {
            post.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
      } else {
        setPosts([]);
        setFilteredPosts([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter posts based on search, category and tag
  useEffect(() => {
    let result = [...posts];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.content.toLowerCase().includes(term) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    if (activeCategory !== 'ALL') {
      result = result.filter(post => post.category === activeCategory);
    }
    
    if (activeTag !== 'ALL') {
      result = result.filter(post => post.tags && post.tags.includes(activeTag));
    }
    
    setFilteredPosts(result);
  }, [searchTerm, activeCategory, activeTag, posts]);

  const categories = ['ALL', 'REFORESTATION', 'RENEWABLE ENERGY', 'OCEAN CONSERVATION', 'URBAN ECOLOGY'];

  if (isLoading) {
    return (
      <div className="bg-neutral-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@400;500;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style> */}

      <div className="container mx-auto px-4 py-16 sm:py-24">
         <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">THE DEFINITIVE PODCAST DIRECTORY LIST</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Podcast directories are the most common way listeners find new content, so it's important to list your podcast in all the most popular apps.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          {/* <h1 className="text-2xl md:text-4xl font-extrabold text-white">Our <span className="text-green-400">Blog</span></h1> */}
          
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-green-400" />
            <h3 className="font-medium text-gray-300">Filter by:</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-green-500 text-gray-900'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeTag === 'ALL'
                    ? 'bg-green-500 text-gray-900'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All Tags
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeTag === tag
                      ? 'bg-green-500 text-gray-900'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-16">
              {searchTerm || activeCategory !== 'ALL' || activeTag !== 'ALL' 
                ? "No posts match your filters. Try adjusting your search."
                : "No blog posts available yet. Check back soon!"}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}