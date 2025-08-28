import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, set, onValue } from "firebase/database";
import { blogsDatabase } from "../firebase2";
import {
  Leaf,
  Zap,
  Sun,
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  Hand,
  Lightbulb,
  Inspect,
  FileText,
  Users,
  Trash2
} from "lucide-react";
import DOMPurify from "dompurify";

const ReactionButton = ({ icon, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
      active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
    }`}
  >
    {icon}
    <span className="text-sm ml-2">{count || 0}</span>
  </button>
);

export default function ArticlePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareButton, setShowShareButton] = useState(false);
  const [userReactions, setUserReactions] = useState({
    liked: false,
    clapped: false,
    inspiring: false,
    informative: false,
  });

  useEffect(() => {
    const handleScroll = () => setShowShareButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const postRef = ref(blogsDatabase, `posts/${id}`);
    const unsubscribe = onValue(postRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPost({ id, ...data });

        // Initialize user reactions from localStorage
        const storedReactions = JSON.parse(
          localStorage.getItem(`post_${id}_reactions`) || "{}"
        );
        setUserReactions({
          liked: storedReactions.liked || false,
          clapped: storedReactions.clapped || false,
          inspiring: storedReactions.inspiring || false,
          informative: storedReactions.informative || false,
        });
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const createMarkup = (htmlContent) => ({
    __html: DOMPurify.sanitize(htmlContent || ""),
  });

  const updateReaction = (reactionType, currentValue) => {
    if (!post) return;

    // Check if user already reacted
    if (userReactions[reactionType]) {
      // User is removing their reaction
      const updatedPost = {
        ...post,
        [reactionType === "liked"
          ? "likes"
          : reactionType === "clapped"
          ? "claps"
          : reactionType]:
          post[
            reactionType === "liked"
              ? "likes"
              : reactionType === "clapped"
              ? "claps"
              : reactionType
          ] - 1,
      };

      set(ref(blogsDatabase, `posts/${id}`), updatedPost)
        .then(() => {
          setPost(updatedPost);
          setUserReactions((prev) => ({ ...prev, [reactionType]: false }));

          // Update localStorage
          const storedReactions = JSON.parse(
            localStorage.getItem(`post_${id}_reactions`) || "{}"
          );
          storedReactions[reactionType] = false;
          localStorage.setItem(
            `post_${id}_reactions`,
            JSON.stringify(storedReactions)
          );
        })
        .catch(console.error);
    } else {
      // User is adding a new reaction
      const updatedPost = {
        ...post,
        [reactionType === "liked"
          ? "likes"
          : reactionType === "clapped"
          ? "claps"
          : reactionType]:
          (post[
            reactionType === "liked"
              ? "likes"
              : reactionType === "clapped"
              ? "claps"
              : reactionType
          ] || 0) + 1,
      };

      set(ref(blogsDatabase, `posts/${id}`), updatedPost)
        .then(() => {
          setPost(updatedPost);
          setUserReactions((prev) => ({ ...prev, [reactionType]: true }));

          // Update localStorage
          const storedReactions = JSON.parse(
            localStorage.getItem(`post_${id}_reactions`) || "{}"
          );
          storedReactions[reactionType] = true;
          localStorage.setItem(
            `post_${id}_reactions`,
            JSON.stringify(storedReactions)
          );
        })
        .catch(console.error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: `Check out this article: ${post.title}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      setIsSharing(true);
      navigator.clipboard.writeText(window.location.href);
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'RURAL UPLIFTMENT':
        return <Users size={20} className="text-orange-500" />;
      case 'HEALTHCARE AND SANITATION':
        return <Heart size={20} className="text-blue-500" />;
      case 'WASTE MANAGEMENT':
        return <Trash2 size={20} className="text-gray-500" />;
      case 'ENVIRONMENT':
        return <Leaf size={20} className="text-green-500" />;
      case 'REPORT':
      case 'RESEARCH':
        return <FileText size={20} className="text-red-500" />;
      default:
        return <Lightbulb size={20} className="text-purple-500" />;
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-700 text-xl">Loading article...</div>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-700 text-xl">Article not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white relative">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          to="/articles"
          className="flex items-center mb-6 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back to all articles
        </Link>
        <article className="bg-white rounded-lg">
          {/* Header Image */}
          <div className="relative h-72 w-full mb-6 rounded-lg overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x400?text=Image+not+found";
              }}
            />
          </div>

          {/* Author and Date */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
            <div className="flex items-center">
              <div className="mr-3 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-700 font-medium">
                  {post.author?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="text-gray-900 font-medium">{post.author}</p>
                <p className="text-gray-500 text-sm">{post.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateReaction("liked", post.likes)}
                className={`flex items-center gap-1 text-sm px-3 py-2 rounded-md transition-colors ${
                  userReactions.liked
                    ? "text-red-500 bg-red-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Heart
                  size={18}
                  className={userReactions.liked ? "fill-current" : ""}
                />
                <span>{post.likes || 0}</span>
              </button>

              <button
                onClick={() => updateReaction("clapped", post.claps)}
                className={`flex items-center gap-1 text-sm px-3 py-2 rounded-md transition-colors ${
                  userReactions.clapped
                    ? "text-blue-500 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Hand size={18} />
                <span>{post.claps || 0}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-sm px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Share2 size={18} />
                <span>{isSharing ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 mb-4">
            {getCategoryIcon(post.category)}
            <span className="text-sm font-medium text-gray-700">{post.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-3 rounded-full text-gray-700"
                >
                  <span className="text-blue-600">#</span>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none mb-12">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={createMarkup(post.content)}
            />
          </div>
        </article>
      </div>
    </div>
  );
}