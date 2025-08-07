# 🏋️ FitSpace Forge - E-commerce Website

A modern, responsive e-commerce website for fitness equipment built with React, TypeScript, and Tailwind CSS. This website provides a complete shopping experience with product catalog, shopping cart, user authentication, order management, and payment processing.

## ✨ Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse fitness equipment by categories and space types
- **Advanced Filtering**: Filter by price, category, space type, and search
- **Product Details**: Comprehensive product information with image galleries
- **Shopping Cart**: Add, update, and remove items with real-time total calculation
- **User Authentication**: Secure login and registration system
- **Order Management**: View order history and track order status
- **Address Management**: Save and manage multiple shipping addresses
- **Payment Processing**: Secure payment integration with multiple methods

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Fast Performance**: Optimized loading times and efficient data fetching
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🛠️ Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **React Query**: Efficient data fetching with caching and background updates
- **React Router**: Client-side routing with protected routes
- **Form Management**: Robust form handling with validation
- **Error Handling**: Comprehensive error handling and user feedback
- **State Management**: Context-based state management for auth and cart

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to FitSpace Forge API server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fitflix-org/Define_strength_website.git
   cd Define_strength_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your API URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:8080
   ```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── home/            # Homepage specific components
│   ├── layout/          # Layout components (Header, Footer)
│   └── ui/              # Base UI components (shadcn/ui)
├── context/             # React context providers
│   ├── AuthContext.tsx  # Authentication state management
│   └── CartContext.tsx  # Shopping cart state management
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── pages/               # Page components
├── services/            # API service functions
│   ├── api.ts           # Axios configuration
│   ├── authService.ts   # Authentication API calls
│   ├── cartService.ts   # Shopping cart API calls
│   ├── orderService.ts  # Order management API calls
│   ├── paymentService.ts # Payment processing API calls
│   ├── productService.ts # Product catalog API calls
│   └── addressService.ts # Address management API calls
└── assets/              # Static assets (images, icons)
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run build:prod` - Build for production with optimizations
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking

## 🌐 API Integration

This website integrates with the FitSpace Forge API which provides:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/me` - Get current user info

### Product Endpoints
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/all` - Get all categories
- `GET /api/products/:id/related` - Get related products

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart/clear` - Clear entire cart

### Order Endpoints
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders/create` - Create new order

### Payment Endpoints
- `POST /api/payments/create` - Create payment
- `PATCH /api/payments/:id/status` - Update payment status
- `GET /api/payments/:id` - Get payment details

### Address Endpoints
- `GET /api/addresses` - Get saved addresses
- `POST /api/addresses` - Create new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:

- **Form Components**: Input, Select, Checkbox, Radio, Textarea
- **Navigation**: Button, Dropdown Menu, Navigation Menu
- **Data Display**: Card, Badge, Avatar, Table
- **Feedback**: Alert, Toast, Dialog, Progress
- **Layout**: Accordion, Tabs, Collapsible, Separator

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized inputs and outputs
- **CSRF Protection**: Secure cookie configuration
- **HTTPS Ready**: Production-ready security headers

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px  
  - Desktop: > 1024px
- **Touch Friendly**: Optimized for touch interactions
- **Progressive Enhancement**: Works on all modern browsers

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route and component-level splitting
- **Bundle Optimization**: Separate chunks for vendors and utilities
- **Image Optimization**: Responsive images with proper formats
- **Lazy Loading**: Components and routes loaded on demand
- **Caching**: API responses cached with React Query
- **Compression**: Gzip compression for production builds

## 🌍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:

- Environment configuration
- Build process
- Docker deployment
- Static hosting (Netlify, Vercel)
- CI/CD setup
- Performance optimization

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build and verify
npm run build:prod
```

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error boundaries
- Add proper TypeScript types

### Component Structure
```typescript
// Good component structure
interface ComponentProps {
  // Define props interface
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX
  );
};
```

### API Integration
- Use the service functions in `src/services/`
- Handle loading and error states
- Implement proper TypeScript interfaces
- Use React Query for data fetching

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues**
- Check `VITE_API_BASE_URL` in environment files
- Verify API server is running
- Check browser network tab for CORS errors

**TypeScript Errors**
```bash
# Run type checking
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run type-check && npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is proprietary software owned by Fitflix Organization.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the [API Documentation](./API_DOCUMENTATION.md)

## 🏗️ Built With

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Icon library

---

*Built with ❤️ by the Fitflix Organization team*
