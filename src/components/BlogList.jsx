import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { blogsDatabase } from "./firebase2";
import {
  Leaf,
  Heart,
  Search,
  Hand,
  Share2,
  Lightbulb,
  Trash2,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
// import ParticleBackground from "./ParticleBackground";

const BlogCard = ({ post }) => {
  // Function to extract plain text from HTML
  const getPlainText = (htmlContent) => {
    if (!htmlContent) return '';
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Normalize category for consistent comparison
  const normalizedCategory = (post.category || '').toUpperCase();

  // Define category colors
  const getCategoryColor = (category) => {
    switch (category) {
      case "RURAL UPLIFTMENT":
        return "bg-orange-500 text-white";
      case "HEALTHCARE AND SANITATION":
        return "bg-blue-500 text-white";
      case "WASTE MANAGEMENT":
        return "bg-gray-500 text-white";
      case "ENVIRONMENT":
        return "bg-green-500 text-white";
      default:
        return "bg-purple-500 text-white";
    }
  };

  // Get icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "RURAL UPLIFTMENT":
        return <Users size={16} />;
      case "HEALTHCARE AND SANITATION":
        return <Heart size={16} />;
      case "WASTE MANAGEMENT":
        return <Trash2 size={16} />;
      case "ENVIRONMENT":
        return <Leaf size={16} />;
      default:
        return <Lightbulb size={16} />;
    }
  };

  // Handle appreciation (clap) with cooldown to prevent multiple clicks
  const [lastClapTime, setLastClapTime] = useState(0);
  
  const handleAppreciation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple clicks within 2 seconds
    const now = Date.now();
    if (now - lastClapTime < 2000) return;
    
    setLastClapTime(now);
    
    // Update the clap count in Firebase
    const updatedClaps = (post.claps || 0) + 1;
    const postRef = ref(blogsDatabase, `posts/${post.id}`);
    
    set(postRef, {
      ...post,
      claps: updatedClaps
    }).catch(error => {
      console.error("Error updating claps:", error);
    });
  };

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(normalizedCategory)}`}>
            {getCategoryIcon(normalizedCategory)}
            {post.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {truncateText(getPlainText(post.content))}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {post.author}
            </span>
            <span className="text-xs text-gray-500">
              {post.date}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Heart size={16} className={post.isLiked ? "fill-red-500 text-red-500" : ""} />
              <span>{post.likes || 0}</span>
            </div>
            
            <div 
              className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer"
              onClick={handleAppreciation}
              title="Show appreciation"
            >
              <Hand size={16} className={post.isLiked ? "text-blue-500" : ""} />
              <span>{post.claps || 0}</span>
            </div>
            
            <button 
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: getPlainText(post.content),
                    url: window.location.origin + `/blogs/${post.id}`,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.origin + `/blogs/${post.id}`);
                  alert("Link copied to clipboard!");
                }
              }}
            >
              <Share2 size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeTag, setActiveTag] = useState("ALL");
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const postsRef = ref(blogsDatabase, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setPosts(postsArray);
        setFilteredPosts(postsArray);

        const tags = new Set();
        postsArray.forEach((post) => {
          if (post.tags) {
            post.tags.forEach((tag) => tags.add(tag));
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

  useEffect(() => {
    let result = [...posts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          (post.content && post.content.toLowerCase().includes(term)) ||
          post.author.toLowerCase().includes(term) ||
          post.category.toLowerCase().includes(term) ||
          (post.tags &&
            post.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    }

    if (activeCategory !== "ALL") {
      result = result.filter((post) => post.category.toUpperCase() === activeCategory.toUpperCase());
    }

    if (activeTag !== "ALL") {
      result = result.filter(
        (post) => post.tags && post.tags.includes(activeTag)
      );
    }

    setFilteredPosts(result);
  }, [searchTerm, activeCategory, activeTag, posts]);

  const categories = [
    "ALL",
    "RURAL UPLIFTMENT",
    "HEALTHCARE AND SANITATION",
    "WASTE MANAGEMENT",
    "ENVIRONMENT",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
       {/* <ParticleBackground /> */}
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-lime-300 mb-4">
            Blogs
          </h1>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto">
            Discover the latest insights and stories about environmental conservation, 
            sustainability, and eco-friendly practices from around the world.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title, author, category, tags..."
              className="w-full bg-white text-gray-800 border border-gray-200 pl-10 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link to={`/blogs/${post.id}`} key={post.id}>
                <BlogCard post={post} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm">
              {searchTerm || activeCategory !== "ALL" || activeTag !== "ALL"
                ? "No posts match your filters. Try adjusting your search."
                : "No blog posts available yet. Check back soon!"}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}