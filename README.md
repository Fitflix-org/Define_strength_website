# Define Strength - Fitness Equipment E-commerce Website

A modern, responsive e-commerce website built with React, TypeScript, and Vite, specializing in fitness equipment sales with integrated Razorpay payment gateway.

## Features

### 🛍️ E-commerce Core
- Product catalog with categories (Home Gym, Commercial Gym, Office Gym)
- Shopping cart functionality with local storage persistence
- Advanced product filtering and search
- Product detail pages with image galleries
- User authentication and account management
- Order management and tracking

### 💳 Payment Integration
- **Razorpay Payment Gateway** - Secure online payments
- Multiple payment methods:
  - Credit/Debit Cards
  - UPI (PhonePe, Google Pay, Paytm)
  - Net Banking
  - Digital Wallets
- Cash on Delivery (COD) option
- Real-time payment verification
- GST calculation (18%)

### 📱 User Experience
- Responsive design for mobile, tablet, and desktop
- Modern UI with Tailwind CSS and shadcn/ui components
- Fast loading with Vite build tool
- Progressive Web App capabilities
- SEO optimized

### 🏗️ Technical Features
- TypeScript for type safety
- React Query for server state management
- Context API for global state
- Protected routes with authentication
- Error boundaries and loading states
- Custom hooks for reusable logic

## Tech Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + React Query
- **Routing**: React Router DOM
### Development Tools
- **Linting**: ESLint
- **Code Formatting**: Prettier (via shadcn/ui)
- **Package Manager**: npm
- **Version Control**: Git

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Header, Footer, Navigation
│   ├── home/           # Homepage sections
│   └── payment/        # Payment related components
├── pages/              # Page components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API services and utilities
├── lib/                # Utility functions
├── assets/             # Static assets (images, etc.)
└── types/              # TypeScript type definitions
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Define_strength_website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create environment files for different stages:

#### Development (.env.development)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_test_key_here
VITE_RAZORPAY_SECRET=your_test_secret_here
```

#### Production (.env.production)
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_here
VITE_RAZORPAY_SECRET=your_live_secret_here
```

### 4. Razorpay Setup

#### Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a free account
3. Complete the KYC process for live payments

#### Get API Keys
1. Navigate to Settings → API Keys
2. Generate Test API Keys for development
3. Generate Live API Keys for production
4. Copy the Key ID and Secret

#### Configure Webhooks (Optional)
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`, `order.paid`

### 5. Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:8080`

### 6. Build for Production
```bash
npm run build
```

### 7. Preview Production Build
```bash
npm run preview
```

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run build:prod` - Build for production with optimizations
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking
## Payment Flow

### 1. Cart to Checkout
- Users add products to cart
- Proceed to checkout with shipping details
- Select payment method (Razorpay or COD)

### 2. Razorpay Payment Process
1. **Order Creation**: Backend creates order with Razorpay
2. **Payment Interface**: Razorpay checkout modal opens
3. **Payment Processing**: User completes payment
4. **Verification**: Backend verifies payment signature
5. **Order Confirmation**: Order status updated, confirmation sent

### 3. COD Flow
1. **Order Creation**: Direct order creation
2. **Confirmation**: Order confirmed with COD status
3. **Delivery**: Payment collected on delivery

## API Integration

The frontend integrates with a RESTful API for:

### Authentication
- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- POST `/auth/logout` - User logout
- GET `/auth/profile` - Get user profile

### Products
- GET `/products` - List products with filters
- GET `/products/:id` - Get product details
- GET `/categories` - List categories

### Cart & Orders
- POST `/cart` - Add to cart
- GET `/cart` - Get cart items
- DELETE `/cart/:id` - Remove from cart
- POST `/orders` - Create order
- GET `/orders` - List user orders

### Payments
- POST `/payments/create-order` - Create Razorpay order
- POST `/payments/verify` - Verify payment
- POST `/payments/webhook` - Razorpay webhook

## Deployment

### Docker Deployment
The project includes Docker configuration:

```bash
# Build image
docker build -t define-strength .

# Run container
docker run -p 80:80 define-strength
```

### Using Docker Compose
```bash
docker-compose up -d
```

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist/` folder to your web server
3. Configure web server to serve the SPA
4. Set up SSL certificate
5. Configure environment variables

### Environment Variables for Production
- `VITE_RAZORPAY_KEY_ID`: Live Razorpay Key ID
- `VITE_API_BASE_URL`: Production API URL

## Security Considerations

### Payment Security
- All payment processing handled by Razorpay (PCI DSS compliant)
- Payment verification using cryptographic signatures
- No sensitive payment data stored locally
- HTTPS required for production

### General Security
- Environment variables for sensitive config
- Input validation and sanitization
- Protected routes requiring authentication
- CORS configuration
- Rate limiting (API level)

## Testing

### Payment Testing
Razorpay provides test cards for development:

**Test Cards:**
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- Any CVV, future expiry date

**Test UPI ID:** success@razorpay

### Running Tests
```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

## Performance Optimization

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: WebP format, lazy loading
- **Caching**: Service worker for static assets
- **Bundle Analysis**: Use `npm run build:analyze`
- **Tree Shaking**: Unused code elimination

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create Pull Request

## Support

For technical support or questions:
- Create an issue in the repository
- Email: support@definestrength.com
- Documentation: [Project Wiki](link-to-wiki)

## License

This project is proprietary software. All rights reserved.

---

**Define Strength** - Building stronger bodies, one rep at a time.

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
