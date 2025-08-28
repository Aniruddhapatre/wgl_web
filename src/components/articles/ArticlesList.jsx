import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { blogsDatabase } from "../firebase_article";
import {
  Leaf,
  Heart,
  Hand,
  Share2,
  Lightbulb,
  Trash2,
  Users,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

const ArticleCard = ({ post }) => {
  const getPlainText = (htmlContent) => {
    if (!htmlContent) return '';
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const normalizedCategory = (post.category || '').toUpperCase();

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
      case "REPORT":
        return "bg-red-500 text-white";
      case "RESEARCH":
        return "bg-purple-500 text-white";
      default:
        return "bg-indigo-500 text-white";
    }
  };

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
      case "REPORT":
      case "RESEARCH":
        return <FileText size={16} />;
      default:
        return <Lightbulb size={16} />;
    }
  };

  const [lastClapTime, setLastClapTime] = useState(0);

  const handleAppreciation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    if (now - lastClapTime < 2000) return;
    setLastClapTime(now);

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
                    url: window.location.origin + `/articles/${post.id}`,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.origin + `/articles/${post.id}`);
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

export default function ArticlesList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } else {
        setPosts([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-lime-300 mb-4">
            reports & articles
          </h1>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto">
            Discover the latest insights and stories about environmental conservation, 
            sustainability, and eco-friendly practices from around the world.
          </p>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link to={`/articles/${post.id}`} key={post.id}>
                <ArticleCard post={post} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm">
              No articles available yet. Check back soon!
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
