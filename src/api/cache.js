/**
 * Simple in-memory cache for API responses
 * Reduces redundant API calls across components
 */

const cache = {
  data: {},
  timers: {},
  
  // Default TTL: 5 minutes
  DEFAULT_TTL: 5 * 60 * 1000,
  
  /**
   * Get cached data if valid, else null
   */
  get(key) {
    const item = this.data[key];
    if (!item) return null;
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.remove(key);
      return null;
    }
    
    return item.value;
  },
  
  /**
   * Set cache with TTL
   */
  set(key, value, ttl = this.DEFAULT_TTL) {
    // Clear existing timer
    if (this.timers[key]) clearTimeout(this.timers[key]);
    
    this.data[key] = {
      value,
      expiry: Date.now() + ttl,
    };
    
    // Auto-remove after TTL
    this.timers[key] = setTimeout(() => this.remove(key), ttl);
  },
  
  /**
   * Remove cache entry
   */
  remove(key) {
    delete this.data[key];
    if (this.timers[key]) clearTimeout(this.timers[key]);
    delete this.timers[key];
  },
  
  /**
   * Clear all cache
   */
  clear() {
    Object.keys(this.timers).forEach((key) => clearTimeout(this.timers[key]));
    this.data = {};
    this.timers = {};
  },
};

export default cache;
