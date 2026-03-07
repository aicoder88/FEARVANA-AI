# Security Implementation Checklist

Quick reference checklist for implementing security fixes in FEARVANA-AI.

---

## ⚠️ CRITICAL - Do First (2-4 hours)

### Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Generate JWT secret: `openssl rand -base64 64`
- [ ] Add JWT_SECRET to `.env.local`
- [ ] Verify OPENAI_API_KEY is set (server-side only)
- [ ] Verify Supabase credentials are set

### Install Dependencies
```bash
npm install jose bcrypt isomorphic-dompurify
npm install --save-dev @types/bcrypt
```

- [ ] Run installation command
- [ ] Verify no errors
- [ ] Run `npm list jose bcrypt isomorphic-dompurify`

---

## 🔴 HIGH PRIORITY - Authentication (4-6 hours)

### Remove Mock Authentication
- [ ] Read `/src/app/api/auth/route.ts`
- [ ] Replace mock user database with Supabase
- [ ] Implement password hashing with bcrypt
- [ ] Replace mock tokens with JWT
- [ ] Add httpOnly cookie support
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test logout flow

### Client-Side Auth Updates
- [ ] Remove `localStorage.setItem('fearvana_token', ...)` from login page
- [ ] Remove `localStorage.setItem('fearvana_user', ...)` from login page
- [ ] Remove same from register page
- [ ] Update session retrieval to use cookies
- [ ] Test authentication flow end-to-end

---

## 🔴 HIGH PRIORITY - API Key Security (2-3 hours)

### Remove Client-Side API Keys
- [ ] Open `/src/lib/openai-service.ts`
- [ ] Remove localStorage API key storage
- [ ] Remove `x-openai-key` header option
- [ ] Update to use server-side only
- [ ] Open `/src/components/settings/api-settings.tsx`
- [ ] Remove OpenAI API key input section
- [ ] Test AI features still work

### Update AI Routes
- [ ] Open `/src/app/api/ai-coach/route.ts`
- [ ] Remove `request.headers.get('x-openai-key')` fallback
- [ ] Use only `process.env.OPENAI_API_KEY`
- [ ] Repeat for `/src/app/api/antarctica-ai/route.ts`
- [ ] Test AI endpoints

---

## 🔴 HIGH PRIORITY - API Route Protection (4-5 hours)

### Add Authentication to Routes

For each of these files:
- `/src/app/api/payments/route.ts`
- `/src/app/api/subscriptions/route.ts`
- `/src/app/api/corporate-programs/route.ts`

Do:
- [ ] Import `requireAuth` from `@/lib/auth`
- [ ] Add `const session = await requireAuth(request)` at start
- [ ] Verify user ownership where needed
- [ ] Add try-catch for authentication errors
- [ ] Test with valid token
- [ ] Test with invalid token
- [ ] Test with no token

---

## 🟡 MEDIUM PRIORITY - Input Validation (3-4 hours)

### Add Validation to All Routes

For each API route:
- [ ] Import validation schema from `/src/lib/validation.ts`
- [ ] Use `validateRequest()` for request body
- [ ] Use `validateQueryParams()` for URL params
- [ ] Return formatted errors on validation failure
- [ ] Test with valid data
- [ ] Test with invalid data
- [ ] Test with XSS payloads
- [ ] Test with SQL injection attempts

Example routes to update:
- [ ] `/src/app/api/payments/route.ts`
- [ ] `/src/app/api/subscriptions/route.ts`
- [ ] `/src/app/api/corporate-programs/route.ts`
- [ ] `/src/app/api/products/route.ts`

---

## 🟡 MEDIUM PRIORITY - Database Security (2-3 hours)

### Enable Supabase Row Level Security

For each table in your Supabase database:
- [ ] Enable RLS on `users` table
- [ ] Create policy: "Users can read own data"
- [ ] Create policy: "Users can update own data"
- [ ] Create policy: "Users can insert own data"
- [ ] Enable RLS on `subscriptions` table
- [ ] Create appropriate policies for subscriptions
- [ ] Enable RLS on `payments` table
- [ ] Create appropriate policies for payments
- [ ] Test RLS policies with test users
- [ ] Verify unauthorized access is blocked

---

## 🟡 MEDIUM PRIORITY - Production Setup (2-3 hours)

### Rate Limiting (Optional but Recommended)
- [ ] Sign up for Upstash account
- [ ] Create Redis database
- [ ] Install: `npm install @upstash/ratelimit @upstash/redis`
- [ ] Add `UPSTASH_REDIS_REST_URL` to `.env.local`
- [ ] Add `UPSTASH_REDIS_REST_TOKEN` to `.env.local`
- [ ] Update middleware to use Upstash (see implementation guide)
- [ ] Test rate limiting

### Security Headers
- [ ] Verify middleware is active
- [ ] Test in browser DevTools > Network
- [ ] Verify `X-Frame-Options` header present
- [ ] Verify `Content-Security-Policy` header present
- [ ] Verify `Strict-Transport-Security` header present
- [ ] Adjust CSP if needed for your domain

---

## 🟢 LOW PRIORITY - Testing & Monitoring (4-6 hours)

### Security Testing
- [ ] Write authentication tests
- [ ] Write input validation tests
- [ ] Write rate limiting tests
- [ ] Run `npm test`
- [ ] Fix any failing tests

### Monitoring Setup
- [ ] Set up Sentry (or similar)
- [ ] Configure error tracking
- [ ] Set up alerts for:
  - [ ] Failed login attempts (>5 in 15 min)
  - [ ] Rate limit hits
  - [ ] Unusual API usage
  - [ ] Authentication errors
- [ ] Test error reporting

### Documentation
- [ ] Document environment variables
- [ ] Document deployment process
- [ ] Document incident response plan
- [ ] Document security policies

---

## 🔍 Pre-Production Checklist

### Security Verification
- [ ] No API keys in localStorage
- [ ] No API keys in client-side code
- [ ] All API routes require authentication
- [ ] Input validation on all endpoints
- [ ] Rate limiting active
- [ ] CSRF protection enabled
- [ ] Security headers present
- [ ] httpOnly cookies for sessions
- [ ] Supabase RLS enabled
- [ ] Password hashing implemented
- [ ] JWT tokens properly signed

### Testing
- [ ] All tests passing
- [ ] Manual testing completed
- [ ] Penetration testing completed
- [ ] No critical vulnerabilities in `npm audit`
- [ ] Production build succeeds
- [ ] Staging deployment successful

### Configuration
- [ ] `.env.local` not committed to git
- [ ] `.env.example` up to date
- [ ] Production environment variables set
- [ ] JWT_SECRET is strong (64+ chars)
- [ ] All required env vars documented
- [ ] Monitoring configured
- [ ] Logging configured
- [ ] Error tracking configured

### Documentation
- [ ] Security implementation documented
- [ ] API documentation updated
- [ ] Deployment guide updated
- [ ] Incident response plan created
- [ ] Security audit scheduled

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All security checklist items complete
- [ ] Code reviewed by team
- [ ] Security audit passed
- [ ] Staging environment tested
- [ ] Backup plan ready
- [ ] Rollback plan documented

### Deployment
- [ ] Environment variables set in production
- [ ] HTTPS/TLS certificate valid
- [ ] Verify security headers in production
- [ ] Test authentication in production
- [ ] Verify rate limiting works
- [ ] Check monitoring dashboard
- [ ] Verify error tracking

### Post-Deployment
- [ ] Monitor error logs (first 24 hours)
- [ ] Check for security alerts
- [ ] Verify all features working
- [ ] User testing completed
- [ ] Performance monitoring
- [ ] Schedule next security audit

---

## 📊 Progress Tracking

### Overall Progress
Total tasks: 70+
- Critical: ☐☐☐☐☐☐☐☐☐☐ (0/10)
- High: ☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐ (0/15)
- Medium: ☐☐☐☐☐☐☐☐☐☐ (0/10)
- Low: ☐☐☐☐☐☐☐☐☐☐ (0/10)

### Time Estimates
- Critical: 2-4 hours
- High Priority: 12-16 hours
- Medium Priority: 10-12 hours
- Low Priority: 4-6 hours
- Testing: 4-6 hours
- **Total: 32-44 hours**

---

## 🆘 Quick Reference

### Files Created
- `/src/middleware.ts` - Request protection
- `/src/lib/auth.ts` - Authentication utilities
- `/src/lib/validation.ts` - Input validation
- `/src/lib/env.ts` - Environment config
- `SECURITY_AUDIT_REPORT.md` - Detailed findings
- `SECURITY_IMPLEMENTATION_GUIDE.md` - Step-by-step guide

### Commands
```bash
# Install dependencies
npm install jose bcrypt isomorphic-dompurify

# Generate JWT secret
openssl rand -base64 64

# Run security audit
npm audit

# Run tests
npm test

# Build for production
npm run build

# Check environment
npm run type-check
```

### Common Issues
- **bcrypt won't install**: See SECURITY_DEPENDENCIES.md troubleshooting
- **JWT errors**: Ensure JWT_SECRET is set in .env.local
- **CORS errors**: Add domain to ALLOWED_ORIGINS
- **Rate limit errors**: Set up Upstash Redis

---

## 📞 Support

- **Implementation Guide**: SECURITY_IMPLEMENTATION_GUIDE.md
- **Detailed Report**: SECURITY_AUDIT_REPORT.md
- **Dependencies**: SECURITY_DEPENDENCIES.md
- **Summary**: SECURITY_AUDIT_SUMMARY.md

For urgent security issues: security@fearvana.ai

---

**Last Updated:** December 31, 2024
**Status:** Implementation Required
**Next Review:** After implementation
