# 💳 Razorpay Integration Guide - Define Strength

## Overview

This guide covers the integration of Razorpay payment gateway into the Define Strength e-commerce website. Razorpay is India's leading payment gateway supporting multiple payment methods including UPI, cards, net banking, and wallets.

## 🏗️ Integration Architecture

### Frontend Components
- **RazorpayCheckout**: Main payment component
- **PaymentButton**: Reusable payment trigger button
- **PaymentStatus**: Payment result handling
- **PaymentHistory**: Order and payment tracking

### Backend Integration
The frontend will integrate with your existing API endpoints:
- `POST /api/payments/create` - Initialize payment
- `PATCH /api/payments/:id/status` - Update payment status
- `POST /api/payments/:id/verify` - Verify payment signature

## 🔧 Environment Configuration

Add these environment variables:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_key_secret_here_backend_only
VITE_RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here_backend_only
```

**Note**: Only `VITE_RAZORPAY_KEY_ID` should be in frontend env vars. Secrets stay on backend.

## 📦 Required Dependencies

```bash
# These will be added automatically
npm install crypto-js
```

## 🎯 Implementation Plan

### Phase 1: Basic Integration
- [ ] Add Razorpay script loading
- [ ] Create payment initialization
- [ ] Handle payment success/failure
- [ ] Basic order creation flow

### Phase 2: Enhanced Features
- [ ] Multiple payment methods
- [ ] Payment retry functionality
- [ ] Refund handling
- [ ] Subscription support (if needed)

### Phase 3: Production Features
- [ ] Webhook signature verification
- [ ] Payment analytics
- [ ] Error tracking
- [ ] Performance monitoring

## 🔐 Security Considerations

### Frontend Security
- Never expose Razorpay key secret in frontend
- Validate all payment responses on backend
- Use HTTPS in production
- Implement proper error handling

### Backend Security (For Reference)
- Verify webhook signatures
- Validate payment amounts server-side
- Store sensitive data securely
- Implement rate limiting

## 🧪 Testing

### Test Mode
- Use Razorpay test keys during development
- Test with various payment methods
- Verify error scenarios
- Test mobile responsiveness

### Test Cards
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

## 📱 Supported Payment Methods

Razorpay supports:
- 💳 **Credit/Debit Cards**: Visa, Mastercard, American Express, Diners, RuPay
- 🏦 **Net Banking**: 50+ banks
- 📱 **UPI**: PhonePe, Google Pay, Paytm, BHIM
- 💰 **Wallets**: Paytm, Mobikwik, Freecharge, JioMoney
- 💸 **EMI**: Credit card and debit card EMI options

## 🔄 Payment Flow

1. **User initiates payment** → Frontend calls backend to create order
2. **Backend creates Razorpay order** → Returns order_id and amount
3. **Frontend opens Razorpay checkout** → User completes payment
4. **Razorpay processes payment** → Returns payment_id and signature
5. **Frontend sends details to backend** → Backend verifies signature
6. **Backend updates order status** → Frontend shows success/failure

## 📋 API Integration Points

### Create Payment Order
```typescript
POST /api/payments/create
{
  "orderId": "order_123",
  "amount": 59999, // Amount in paise (₹599.99)
  "currency": "INR"
}

Response:
{
  "razorpay_order_id": "order_razorpay_123",
  "amount": 59999,
  "currency": "INR",
  "key_id": "rzp_test_xxx"
}
```

### Verify Payment
```typescript
POST /api/payments/verify
{
  "razorpay_order_id": "order_razorpay_123",
  "razorpay_payment_id": "pay_razorpay_456",
  "razorpay_signature": "signature_hash"
}
```

## 🚀 Deployment Checklist

### Development → Production
- [ ] Switch from test to live Razorpay keys
- [ ] Update webhook URLs
- [ ] Test in production environment
- [ ] Monitor payment success rates
- [ ] Set up payment failure alerts

### Go-Live Requirements
- [ ] KYC verification with Razorpay
- [ ] Business verification documents
- [ ] Bank account linking
- [ ] Settlement configuration
- [ ] Compliance requirements met

## 📊 Monitoring & Analytics

### Key Metrics to Track
- Payment success rate
- Average payment time
- Popular payment methods
- Failed payment reasons
- Refund frequency

### Error Monitoring
- Payment gateway timeouts
- Signature verification failures
- Network connectivity issues
- Invalid payment attempts

## 🆘 Support & Troubleshooting

### Common Issues
1. **Payment not completing**: Check Razorpay key configuration
2. **Signature verification failing**: Ensure proper HMAC calculation
3. **Amount mismatch**: Verify amount is in paise, not rupees
4. **Mobile issues**: Test responsive design thoroughly

### Razorpay Support
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/
- Status Page: https://status.razorpay.com/

## 📝 Implementation Status

- [x] ✅ Planning and documentation
- [ ] 🟡 Environment configuration
- [ ] 🟡 Frontend components
- [ ] 🟡 Backend integration
- [ ] 🟡 Testing
- [ ] 🟡 Production deployment

---

**Next Step**: Implement the Razorpay frontend components once backend API is ready!
