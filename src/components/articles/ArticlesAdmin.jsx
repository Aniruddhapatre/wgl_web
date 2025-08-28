import React, { useState, useEffect } from 'react';
import { ref, set, onValue, remove, push } from "firebase/database";
import { blogsDatabase } from '../firebase2';
import { ChevronRight, Leaf, Zap, Sun, X, Trash, Plus, Heart, MessageCircle, Trash2, Tag, Hand, Edit, Users, Lightbulb, FileText } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// ArticleCard Component
const ArticleCard = ({ post, onDeleteClick, onEditClick, isDeleteMode }) => {
  const getCategoryGradient = (category) => {
    switch(category) {
      case 'RURAL UPLIFTMENT':
        return 'from-orange-500/20 to-amber-900/50';
      case 'HEALTHCARE AND SANITATION':
        return 'from-blue-500/20 to-sky-900/50';
      case 'ENVIRONMENT':
        return 'from-green-500/20 to-emerald-900/50';
      case 'WASTE MANAGEMENT':
        return 'from-gray-500/20 to-slate-900/50';
      case 'REPORT':
        return 'from-red-500/20 to-rose-900/50';
      case 'RESEARCH':
        return 'from-purple-500/20 to-indigo-900/50';
      default:
        return 'from-indigo-500/20 to-blue-900/50';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'RURAL UPLIFTMENT':
        return <Users size={20} className="text-orange-400" />;
      case 'HEALTHCARE AND SANITATION':
        return <Heart size={20} className="text-blue-400" />;
      case 'WASTE MANAGEMENT':
        return <Trash2 size={20} className="text-gray-400" />;
      case 'ENVIRONMENT':
        return <Leaf size={20} className="text-green-400" />;
      case 'REPORT':
      case 'RESEARCH':
        return <FileText size={20} className="text-red-400" />;
      default:
        return <Lightbulb size={20} className="text-purple-400" />;
    }
  };

  const getSnippet = (htmlContent, length = 100) => {
    if (!htmlContent) return '';
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    let text = div.textContent || div.innerText || '';
    if (text.length > length) {
      text = text.substring(0, length) + '...';
    }
    return text;
  };

  const normalizedCategory = (post.category || '').toUpperCase();

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 text-white shadow-2xl duration-500 ease-in-out transform hover:scale-105 hover:shadow-green-400/40 flex flex-col">
      <div className="flex-grow">
        <img src={post.imageUrl} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-30 duration-500 ease-in-out group-hover:opacity-50 group-hover:scale-110" />
        <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2">
            {getCategoryIcon(normalizedCategory)}
            <p className="text-sm font-bold uppercase tracking-widest text-green-400">{post.category}</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">{post.title}</h3>
          <p className="text-sm text-gray-400 mb-3">{getSnippet(post.content)}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-gray-800/50 rounded-full text-gray-300 flex items-center">
                 {tag}
                </span>
              ))}
            </div>
          )}
          <div className="border-t border-green-400/30 pt-4 text-sm opacity-80">
            <span>By {post.author}</span>
            <span className="mx-2">|</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>
      <div className="relative z-10 bg-gray-900/50 backdrop-blur-sm border-t border-green-500/20 p-3 flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Heart size={18} className={post.isLiked ? 'fill-current text-pink-500' : ''} />
            <span>{post.likes || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hand size={18} />
            <span>{post.claps || 0}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {isDeleteMode ? (
            <button 
              onClick={onDeleteClick} 
              className="text-white bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-red-500 transition-colors"
            >
              <Trash2 size={18} /> Delete
            </button>
          ) : (
            <button
              onClick={() => onEditClick(post)}
              className="text-white bg-green-600 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-green-500 transition-colors"
            >
              <Edit size={18} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// AddArticleModal Component
const AddArticleModal = ({ onClose, onSave, editingPost }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    category: 'Rural Upliftment', 
    content: '',
    tags: '',
    headerImage: '',
    otherCategory: ''
  });
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    if (editingPost) {
      const predefinedCategories = [
        'Rural Upliftment',
        'Healthcare and Sanitation',
        'Waste Management',
        'Environment',
        'Report',
        'Research'
      ];
      const isOtherCategory = !predefinedCategories.map(c => c.toUpperCase()).includes(editingPost.category.toUpperCase());

      setFormData({
        title: editingPost.title || '',
        author: editingPost.author || '',
        category: isOtherCategory ? 'OTHER' : editingPost.category,
        content: editingPost.content || '',
        tags: (editingPost.tags || []).join(', '),
        headerImage: editingPost.imageUrl || '',
        otherCategory: isOtherCategory ? editingPost.category : ''
      });
      setShowOtherInput(isOtherCategory);
    } else {
      setFormData({ 
        title: '', 
        author: '', 
        category: 'Rural Upliftment', 
        content: '',
        tags: '',
        headerImage: '',
        otherCategory: ''
      });
      setShowOtherInput(false);
    }
  }, [editingPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, category: value }));
    setShowOtherInput(value === 'OTHER');
  };

  const handleQuillChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = showOtherInput ? formData.otherCategory : formData.category;

    if (!finalCategory) {
      alert("Please select a category or enter a custom one.");
      return;
    }

    const newPost = {
      ...formData,
      category: finalCategory.toUpperCase(), // Store category in uppercase
      date: editingPost?.date || new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      imageUrl: formData.headerImage,
      likes: editingPost?.likes || 0,
      claps: editingPost?.claps || 0,
      isLiked: editingPost?.isLiked || false,
      comments: editingPost?.comments || [],
      reactions: editingPost?.reactions || {
        inspiring: false,
        informative: false
      },
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSave(newPost, editingPost?.id);
  };

  // toolbar
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
        {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">{editingPost ? 'Edit Article' : 'Write an Article'}</h2>
            <button type="button" onClick={onClose} className="text-white bg-black/50 rounded-full p-2 hover:bg-red-500 transition-colors"><X size={24} /></button>
          </div>
          
          <div className="space-y-6">
            {/* Header Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Header Image URL</label>
              <input 
                type="text" 
                name="headerImage" 
                value={formData.headerImage} 
                onChange={handleChange} 
                placeholder="Paste the URL of your header image"
                className="w-full bg-gray-900 p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {formData.headerImage && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  <img 
                    src={formData.headerImage} 
                    alt="Header preview" 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x400?text=Image+not+found';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="New article title here..."
                className="w-full bg-gray-900 p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            {/* Author and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                <input 
                  type="text" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  required 
                  placeholder="Your name"
                  className="w-full bg-gray-900 p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleCategoryChange} 
                  required 
                  className="w-full bg-gray-900 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Rural Upliftment">Rural Upliftment</option>
                  <option value="Healthcare and Sanitation">Healthcare and Sanitation</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Environment">Environment</option>
                  <option value="Report">Report</option>
                  <option value="Research">Research</option>
                  <option value="OTHER">Other...</option>
                </select>
                {showOtherInput && (
                  <input
                    type="text"
                    name="otherCategory"
                    value={formData.otherCategory}
                    onChange={handleChange}
                    placeholder="Enter custom category"
                    required
                    className="w-full bg-gray-900 p-3 rounded-lg text-white placeholder-gray-500 mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                )}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
              <input 
                type="text" 
                name="tags" 
                placeholder="sustainability, climate, trees" 
                value={formData.tags} 
                onChange={handleChange} 
                className="w-full bg-gray-900 p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <div className="bg-white rounded-lg">
                <ReactQuill 
                  theme="snow"
                  value={formData.content} 
                  onChange={handleQuillChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your article content here..."
                  className="text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-green-500 text-white font-bold px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              {editingPost ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main ArticlesAdmin Component
export default function ArticlesAdmin() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      } else {
        setPosts([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleSavePost = (postData, postId) => {
    if (postId) {
      // Update existing post
      const postRef = ref(blogsDatabase, `posts/${postId}`);
      set(postRef, postData)
        .then(() => {
          setIsModalOpen(false);
          setEditingPost(null);
        })
        .catch(error => {
          console.error("Error updating post:", error);
        });
    } else {
      // Add new post
      const postsRef = ref(blogsDatabase, 'posts');
      const newPostRef = push(postsRef);
      set(newPostRef, postData)
        .then(() => {
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error("Error adding new post:", error);
        });
    }
  };

  const handleDeletePost = (postId) => {
    const postRef = ref(blogsDatabase, `posts/${postId}`);
    
    remove(postRef)
      .then(() => {
        console.log("Post deleted successfully");
      })
      .catch(error => {
        console.error("Error deleting post:", error);
      });
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 min-h-screen font-inter text-gray-300 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white font-syne">Admin <span className="text-green-400">Panel</span></h1>
          <div className="flex gap-4">
            <button
              onClick={handleOpenAddModal}
              className="bg-green-500 text-gray-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-green-400 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <Plus size={20} /> Add New Article
            </button>
            <button
              onClick={() => setIsDeleteMode(!isDeleteMode)}
              className={`font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ease-in-out ${
                isDeleteMode ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Trash2 size={20} /> {isDeleteMode ? 'Cancel Delete' : 'Delete Articles'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map(post => (
              <ArticleCard
                key={post.id}
                post={post}
                isDeleteMode={isDeleteMode}
                onDeleteClick={() => handleDeletePost(post.id)}
                onEditClick={() => handleOpenEditModal(post)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-16">
              No articles available to manage.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddArticleModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePost}
          editingPost={editingPost}
        />
      )}
    </div>
  );
}