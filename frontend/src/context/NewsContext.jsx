import { useAuth } from './AuthContext';
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchNews = async (query) => {
  setLoading(true);
  setError(null);

  try {
    // ✅ Call OUR backend (which calls News API securely server-side)
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/news/search`,
      { params: { topic: query } }
    );

    const articles = response.data.articles || [];
    setArticles(articles);

    // Track search history silently
    if (token) {
      axios.post(
        `${import.meta.env.VITE_API_URL}/news/search-history`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => {});
    }

    setLoading(false);
    return { success: true, count: articles.length };
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    setLoading(false);
    return { success: false, message: err.message };
  }
};


  const clearArticles = () => {
    setArticles([]);
    setError(null);
  };

  return (
    <NewsContext.Provider value={{ 
      articles, 
      loading, 
      error, 
      searchNews, 
      clearArticles 
    }}>
      {children}
    </NewsContext.Provider>
  );
};