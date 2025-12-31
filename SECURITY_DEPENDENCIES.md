# Security Dependencies Installation

This document lists the security-related dependencies that need to be added to the project.

## Required Dependencies

Install these packages to enable the security features implemented in the security audit fixes:

```bash
npm install jose bcrypt isomorphic-dompurify
```

### Package Details

#### 1. jose (^5.0.0)
**Purpose:** JWT token creation and verification
**Why:** Secure, modern JWT implementation that follows best practices
**Usage:** Used in `/src/lib/auth.ts` for token generation and validation

```typescript
import { SignJWT, jwtVerify } from 'jose'
```

#### 2. bcrypt (^5.1.1)
**Purpose:** Password hashing
**Why:** Industry-standard password hashing with configurable salt rounds
**Usage:** Used in `/src/lib/auth.ts` for password security

```typescript
import * as bcrypt from 'bcrypt'
```

**Note:** Also install types:
```bash
npm install --save-dev @types/bcrypt
```

#### 3. isomorphic-dompurify (^2.0.0)
**Purpose:** XSS prevention through HTML sanitization
**Why:** Works on both client and server, sanitizes malicious HTML/scripts
**Usage:** Used in `/src/lib/validation.ts` for input sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify'
```

## Optional but Highly Recommended

### For Production Rate Limiting

```bash
npm install @upstash/ratelimit @upstash/redis
```

#### 4. @upstash/ratelimit (^2.0.0)
**Purpose:** Distributed rate limiting
**Why:** Prevents abuse, DDoS protection, works across multiple server instances
**Usage:** Can be integrated into middleware for production-grade rate limiting

#### 5. @upstash/redis (^1.0.0)
**Purpose:** Serverless Redis client
**Why:** Required by @upstash/ratelimit for state persistence
**Setup:** Requires Upstash account (free tier available)

### For Enhanced Security Monitoring

```bash
npm install @sentry/nextjs
```

#### 6. @sentry/nextjs (^8.0.0)
**Purpose:** Error tracking and monitoring
**Why:** Catch security-related errors, monitor authentication failures
**Usage:** Initialize in `next.config.ts` and instrument application

### For CSRF Protection Enhancement

```bash
npm install csrf
```

#### 7. csrf (^3.1.0)
**Purpose:** CSRF token generation and validation
**Why:** More robust CSRF protection than basic implementation
**Usage:** Can enhance middleware CSRF validation

## Development Dependencies

```bash
npm install --save-dev @types/bcrypt jest @testing-library/react @testing-library/jest-dom
```

### For Security Testing

```bash
npm install --save-dev @types/bcrypt
```

## Installation Commands

### All at Once

```bash
# Required security packages
npm install jose bcrypt isomorphic-dompurify

# Optional but recommended for production
npm install @upstash/ratelimit @upstash/redis

# Development dependencies
npm install --save-dev @types/bcrypt

# Monitoring (optional)
npm install @sentry/nextjs
```

### Verify Installation

After installation, verify by checking `package.json`:

```bash
npm list jose bcrypt isomorphic-dompurify
```

## Package.json Updates

After installation, your `package.json` should include:

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "isomorphic-dompurify": "^2.14.1",
    "jose": "^5.2.0",
    "@upstash/ratelimit": "^2.0.1",
    "@upstash/redis": "^1.28.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2"
  }
}
```

## Security Audit Script

Add this to your `package.json` scripts:

```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:fix": "npm audit fix",
    "security:check": "npm audit && npm outdated"
  }
}
```

Run regularly:
```bash
npm run security:audit
```

## Environment Setup After Installation

1. Generate JWT secret:
```bash
openssl rand -base64 64
```

2. Add to `.env.local`:
```env
JWT_SECRET=<generated-secret>
```

3. (Optional) Set up Upstash Redis:
- Create account at https://upstash.com
- Create Redis database
- Add credentials to `.env.local`:
```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## Troubleshooting

### bcrypt Installation Issues

On some systems, bcrypt may fail to install. Solutions:

**macOS:**
```bash
xcode-select --install
npm install bcrypt
```

**Windows:**
```bash
npm install --global windows-build-tools
npm install bcrypt
```

**Linux:**
```bash
sudo apt-get install build-essential
npm install bcrypt
```

**Alternative:** Use bcryptjs (pure JavaScript, slower but no native dependencies)
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

Then update imports in `/src/lib/auth.ts`:
```typescript
import * as bcrypt from 'bcryptjs'
```

### DOMPurify Issues

If isomorphic-dompurify has issues:

```bash
# Alternative installation
npm install dompurify isomorphic-dompurify
npm install --save-dev @types/dompurify
```

### jose Issues

If jose version conflicts occur:

```bash
# Install specific version
npm install jose@5.2.0
```

## Security Updates

Keep dependencies updated:

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update to latest (major versions)
npm install jose@latest bcrypt@latest isomorphic-dompurify@latest
```

Set up automatic security updates with Dependabot:

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    versioning-strategy: increase
```

## Verification Checklist

After installing all dependencies:

- [ ] All packages installed successfully
- [ ] No vulnerabilities in `npm audit`
- [ ] TypeScript types resolved
- [ ] Development server starts without errors
- [ ] Production build completes
- [ ] Tests pass (if applicable)
- [ ] Environment variables configured
- [ ] Security middleware active

## Next Steps

1. Run installation commands
2. Configure environment variables
3. Test authentication flow
4. Verify security headers
5. Test rate limiting
6. Deploy to staging
7. Security audit staging environment
8. Deploy to production

## Support

If you encounter installation issues:

1. Check Node.js version: `node --version` (should be ≥18)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules: `rm -rf node_modules package-lock.json`
4. Reinstall: `npm install`

For persistent issues, consult:
- bcrypt: https://github.com/kelektiv/node.bcrypt.js/wiki
- jose: https://github.com/panva/jose
- DOMPurify: https://github.com/cure53/DOMPurify
