// Simple router for single page application
class Router {
  constructor() {
    this.routes = {};
    this.routeHandlers = {};
    this.currentRoute = '/';
    this.isStarted = false;
  }

  addRoute(path, handler) {
    this.routeHandlers[path] = handler;
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      this.navigate(window.location.pathname, false);
    });

    // Handle initial load
    this.navigate(window.location.pathname, false);
  }

  init() {
    // Kept for backwards compatibility, but start() should be used
    this.start();
  }

  navigate(path, pushState = true, params = {}) {
    // Normalize path
    path = path === '' ? '/' : path;
    
    this.currentRoute = path;
    
    // Update URL if needed
    if (pushState) {
      history.pushState({ params }, '', path);
    }

    // Update navigation
    this.updateNavigation();
    
    // Find and execute route handler
    const handler = this.findRouteHandler(path);
    if (handler) {
      try {
        handler(params);
      } catch (error) {
        console.error('Error executing route handler:', error);
        this.showErrorPage(error);
      }
    } else {
      // Fallback to home route
      console.warn('No handler found for route:', path);
      if (path !== '/') {
        this.navigate('/', pushState);
      }
    }
  }

  findRouteHandler(path) {
    // First try exact match
    if (this.routeHandlers[path]) {
      return this.routeHandlers[path];
    }

    // Then try pattern matching for routes with parameters
    for (const routePath in this.routeHandlers) {
      if (routePath.includes(':')) {
        const regex = this.pathToRegex(routePath);
        const match = path.match(regex);
        if (match) {
          const params = this.extractParams(routePath, match);
          return () => this.routeHandlers[routePath](params);
        }
      }
    }

    return null;
  }

  pathToRegex(path) {
    // Convert path with parameters to regex
    // e.g., '/exercise/:id' becomes /^\/exercise\/([^\/]+)$/
    const regexPath = path.replace(/:[^\/]+/g, '([^\/]+)');
    return new RegExp(`^${regexPath}$`);
  }

  extractParams(routePath, match) {
    const paramNames = routePath.match(/:[^\/]+/g) || [];
    const params = {};
    
    paramNames.forEach((paramName, index) => {
      const key = paramName.substring(1); // Remove ':'
      params[key] = match[index + 1];
    });
    
    return params;
  }

  updateNavigation() {
    // Update active navigation item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-route="${this.currentRoute}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }
  }

  showErrorPage(error) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="error-screen">
          <div class="error-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <p class="error-details">${error.message}</p>
            <button class="btn btn-primary" onclick="window.location.reload()">
              Try Again
            </button>
          </div>
        </div>
      `;
    }
  }

}

// Initialize router
window.router = new Router();
