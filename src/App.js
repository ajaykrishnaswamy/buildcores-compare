import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import CompareView from './components/CompareView';

function App() {
  const [compareItems, setCompareItems] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  
  // Load compare items from localStorage on first render
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('compareItems');
      if (savedItems) {
        setCompareItems(JSON.parse(savedItems));
      }
    } catch (err) {
      console.error('Error loading saved items from localStorage', err);
    }
  }, []);
  
  // Save compare items to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('compareItems', JSON.stringify(compareItems));
    } catch (err) {
      console.error('Error saving items to localStorage', err);
    }
  }, [compareItems]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleAddToCompare = (item) => {
    // Check if this item is already in the comparison
    if (compareItems.some(existingItem => existingItem.buildcores_id === item.buildcores_id)) {
      alert('This item is already in your comparison.');
      return;
    }
    
    setCompareItems(prevItems => [...prevItems, item]);
    
    // Show notification
    setNotification({ 
      show: true, 
      message: `${item.name || 'PC Case'} added to comparison!` 
    });
  };
  
  const handleRemoveItem = (itemId) => {
    setCompareItems(prevItems => 
      prevItems.filter(item => item.buildcores_id !== itemId)
    );
  };
  
  const handleClearAll = () => {
    if (compareItems.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all items from your comparison?')) {
      setCompareItems([]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content header-content-expanded">
          <div className="logo-container">
            <span className="logo">BuildCores</span>
            <span className="beta">BETA</span>
          </div>
          <button className="menu-button">
            <span className="menu-icon">≡</span>
          </button>
        </div>
      </header>
      
      <main>
        <div className="tab-bar">
          <div className="tabs-container">
            <div 
              className={`tab ${!showComparison ? 'active-tab' : ''}`}
              onClick={() => setShowComparison(false)}
            >
              Search
            </div>
            <div 
              className={`tab ${showComparison ? 'active-tab' : ''}`}
              onClick={() => setShowComparison(true)}
            >
              Compare ({compareItems.length})
            </div>
          </div>
          
          <button 
            onClick={handleClearAll} 
            className={`clear-button ${compareItems.length > 0 ? 'visible' : 'hidden'}`}
          >
            Clear All
          </button>
        </div>
        
        {showComparison ? (
          <div className="comparison-section">
            <CompareView 
              items={compareItems} 
              onRemoveItem={handleRemoveItem} 
            />
          </div>
        ) : (
          <div className="search-section">
            <Search onAddToCompare={handleAddToCompare} />
          </div>
        )}
        
        {/* Notification Dialog */}
        {notification.show && (
          <div className="notification-dialog">
            <div className="notification-content">
              <span className="notification-icon">✓</span>
              <span className="notification-message">{notification.message}</span>
            </div>
          </div>
        )}
      </main>
      
      <footer>
        <div className="footer-content">
          <div className="footer-links">
            <a href="/" className="footer-link">Contact Us</a>
            <a href="/" className="footer-link">Privacy Policy</a>
            <a href="/" className="footer-link">Terms of Service</a>
            <a href="/" className="footer-link">Affiliate Disclosure</a>
          </div>
          <div className="version">v0.2</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
