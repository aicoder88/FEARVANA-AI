# FEARVANA-AI Accessibility Guidelines

## Quick Reference for Developers

This document provides quick guidelines for maintaining accessibility standards when developing new features for FEARVANA-AI.

---

## Table of Contents

1. [Navigation & Interactive Elements](#navigation--interactive-elements)
2. [Forms & Inputs](#forms--inputs)
3. [Buttons & Icons](#buttons--icons)
4. [Dynamic Content](#dynamic-content)
5. [Images & Media](#images--media)
6. [Color & Contrast](#color--contrast)
7. [Focus Management](#focus-management)
8. [Common Patterns](#common-patterns)

---

## Navigation & Interactive Elements

### Navigation Menus

```tsx
// ✅ GOOD - Semantic HTML with proper ARIA
<nav aria-label="Main navigation">
  <div role="group" aria-label="Primary menu items">
    <Link href="/dashboard">
      <div
        role="button"
        aria-label="Dashboard - Your daily overview"
        aria-current={isActive ? "page" : undefined}
      >
        <HomeIcon aria-hidden="true" />
        <span>Dashboard</span>
      </div>
    </Link>
  </div>
</nav>

// ❌ BAD - No semantic markup or labels
<div className="nav">
  <a href="/dashboard">
    <div className={isActive ? 'active' : ''}>
      <HomeIcon />
      Dashboard
    </div>
  </a>
</div>
```

### Sidebar/Drawer Components

```tsx
// ✅ GOOD
<Button
  onClick={() => setOpen(!isOpen)}
  aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
  aria-expanded={isOpen}
  aria-controls="sidebar-content"
>
  <MenuIcon aria-hidden="true" />
</Button>

<div id="sidebar-content" aria-hidden={!isOpen}>
  {/* Sidebar content */}
</div>

// ❌ BAD - No accessible labels
<Button onClick={() => setOpen(!isOpen)}>
  <MenuIcon />
</Button>
```

---

## Forms & Inputs

### Text Inputs

```tsx
// ✅ GOOD - Proper labels and ARIA attributes
<div className="form-field">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    aria-required="true"
    aria-invalid={errors.email ? "true" : "false"}
    aria-describedby={errors.email ? "email-error" : undefined}
    autoComplete="email"
  />
  {errors.email && (
    <span id="email-error" className="error" role="alert">
      {errors.email}
    </span>
  )}
</div>

// ❌ BAD - Missing labels and ARIA
<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
{errors.email && <span className="error">{errors.email}</span>}
```

### Form Validation

```tsx
// ✅ GOOD - Accessible error handling
<form onSubmit={handleSubmit} aria-label="Login form">
  {errors.general && (
    <Alert role="alert" aria-live="assertive">
      <AlertCircle aria-hidden="true" />
      <AlertDescription>{errors.general}</AlertDescription>
    </Alert>
  )}

  {/* Form fields */}

  <Button
    type="submit"
    disabled={loading}
    aria-busy={loading}
  >
    {loading ? 'Submitting...' : 'Submit'}
  </Button>
</form>

// ❌ BAD - No ARIA announcements
<form onSubmit={handleSubmit}>
  {errors.general && <div>{errors.general}</div>}
  <button disabled={loading}>Submit</button>
</form>
```

### Select/Dropdown Menus

```tsx
// ✅ GOOD - Using accessible Radix UI component
<div className="form-field">
  <Label htmlFor="category">Category</Label>
  <Select
    value={category}
    onValueChange={setCategory}
  >
    <SelectTrigger id="category" aria-label="Select category">
      <SelectValue placeholder="Choose a category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="fitness">Fitness</SelectItem>
      <SelectItem value="mindset">Mindset</SelectItem>
    </SelectContent>
  </Select>
</div>

// ❌ BAD - Custom dropdown without accessibility
<div onClick={() => setOpen(!open)}>
  {category || 'Select'}
</div>
{open && (
  <div>
    <div onClick={() => setCategory('fitness')}>Fitness</div>
  </div>
)}
```

---

## Buttons & Icons

### Icon-Only Buttons

```tsx
// ✅ GOOD - Descriptive aria-label
<Button
  variant="ghost"
  size="icon"
  onClick={handleDelete}
  aria-label="Delete item"
>
  <TrashIcon aria-hidden="true" />
</Button>

// ❌ BAD - No accessible label
<Button onClick={handleDelete}>
  <TrashIcon />
</Button>
```

### Toggle Buttons

```tsx
// ✅ GOOD - State clearly indicated
<Button
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? 'Hide password' : 'Show password'}
  aria-pressed={showPassword}
>
  {showPassword ? (
    <EyeOff aria-hidden="true" />
  ) : (
    <Eye aria-hidden="true" />
  )}
</Button>

// ❌ BAD - No state indication
<Button onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? <EyeOff /> : <Eye />}
</Button>
```

### Loading States

```tsx
// ✅ GOOD - Announces loading state
<Button
  onClick={handleSubmit}
  disabled={loading}
  aria-busy={loading}
>
  {loading ? (
    <>
      <Loader2 className="animate-spin" aria-hidden="true" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>

// ❌ BAD - Visual only
<Button onClick={handleSubmit} disabled={loading}>
  {loading ? <Spinner /> : 'Submit'}
</Button>
```

---

## Dynamic Content

### Live Regions

```tsx
// ✅ GOOD - Screen reader announcements
<div role="status" aria-live="polite" aria-atomic="true">
  {successMessage}
</div>

// For urgent messages
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// ❌ BAD - No announcement
<div>{message}</div>
```

### Chat/Messages

```tsx
// ✅ GOOD - Accessible chat interface
<div
  role="log"
  aria-label="Chat conversation"
  aria-live="polite"
  aria-atomic="false"
>
  {messages.map((msg) => (
    <div
      key={msg.id}
      role="article"
      aria-label={`${msg.sender} at ${msg.time}`}
    >
      <p>{msg.content}</p>
    </div>
  ))}
</div>

{isTyping && (
  <div role="status" aria-live="polite">
    <span className="sr-only">User is typing</span>
    <div className="typing-indicator" aria-hidden="true">...</div>
  </div>
)}

// ❌ BAD - No accessibility
<div className="messages">
  {messages.map((msg) => (
    <div key={msg.id}>{msg.content}</div>
  ))}
</div>
```

### Progress Indicators

```tsx
// ✅ GOOD - Accessible progress bar
<div>
  <label htmlFor="upload-progress">Upload Progress</label>
  <Progress
    id="upload-progress"
    value={progress}
    aria-label={`Upload progress: ${progress}%`}
  />
  <span className="sr-only">{progress}% complete</span>
</div>

// ❌ BAD - No labels
<Progress value={progress} />
```

---

## Images & Media

### Images

```tsx
// ✅ GOOD - Descriptive alt text
<Image
  src="/dashboard-screenshot.png"
  alt="Dashboard showing user's sacred edge progress with charts and metrics"
  width={800}
  height={600}
/>

// For decorative images
<Image
  src="/background-pattern.png"
  alt=""
  aria-hidden="true"
  width={1920}
  height={1080}
/>

// ❌ BAD - Missing or generic alt text
<Image src="/image.png" alt="image" />
```

### Icons

```tsx
// ✅ GOOD - Semantic use of icons
<div>
  <CheckCircle aria-hidden="true" className="text-green-500" />
  <span>Completed successfully</span>
</div>

// Icon conveying information
<div aria-label="Warning: Action cannot be undone">
  <AlertTriangle aria-hidden="true" />
</div>

// ❌ BAD - Information only in icon
<CheckCircle className="text-green-500" />
```

---

## Color & Contrast

### Text Contrast

```tsx
// ✅ GOOD - Sufficient contrast (4.5:1 minimum)
<p className="text-slate-900 dark:text-slate-100">
  Regular text with good contrast
</p>

// Large text (3:1 minimum)
<h1 className="text-3xl text-slate-800 dark:text-slate-200">
  Heading with good contrast
</h1>

// ❌ BAD - Insufficient contrast
<p className="text-gray-400">Low contrast text</p>
```

### Color Independence

```tsx
// ✅ GOOD - Multiple indicators
<Badge
  className={
    status === 'success'
      ? 'bg-green-500'
      : 'bg-red-500'
  }
  aria-label={`Status: ${status}`}
>
  {status === 'success' ? (
    <>
      <CheckIcon aria-hidden="true" />
      Success
    </>
  ) : (
    <>
      <XIcon aria-hidden="true" />
      Error
    </>
  )}
</Badge>

// ❌ BAD - Color only
<div className={status === 'success' ? 'green' : 'red'} />
```

---

## Focus Management

### Focus Indicators

```tsx
// ✅ GOOD - Custom focus styles
<Button className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Click Me
</Button>

<Link
  href="/dashboard"
  className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
>
  Dashboard
</Link>

// ❌ BAD - Removing focus outline
<Button className="focus:outline-none">Click Me</Button>
```

### Modal/Dialog Focus

```tsx
// ✅ GOOD - Focus management with Dialog
import { Dialog, DialogContent } from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogTitle>Confirmation Required</DialogTitle>
    <DialogDescription>
      Are you sure you want to continue?
    </DialogDescription>
    <div className="flex gap-2">
      <Button onClick={handleConfirm}>Confirm</Button>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
    </div>
  </DialogContent>
</Dialog>

// ❌ BAD - Custom modal without focus trap
<div className={isOpen ? 'modal' : 'hidden'}>
  <div>Are you sure?</div>
  <button onClick={handleConfirm}>Confirm</button>
</div>
```

### Skip Links

```tsx
// ✅ GOOD - Skip to main content
// In layout.tsx
<body>
  <a href="#main-content" className="skip-to-content">
    Skip to main content
  </a>
  <nav>{/* Navigation */}</nav>
  <main id="main-content">{children}</main>
</body>

// CSS
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
}
.skip-to-content:focus {
  top: 0;
}
```

---

## Common Patterns

### Cards with Actions

```tsx
// ✅ GOOD - Accessible card
<Card role="region" aria-labelledby="card-title">
  <CardHeader>
    <CardTitle id="card-title">
      <Target aria-hidden="true" />
      Sacred Edge Progress
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p>Your current transformation focus</p>
  </CardContent>
  <CardFooter>
    <Button aria-label="Update sacred edge progress">
      Update
    </Button>
  </CardFooter>
</Card>
```

### Lists

```tsx
// ✅ GOOD - Semantic list
<div role="region" aria-labelledby="features-heading">
  <h2 id="features-heading">Features</h2>
  <ul>
    {features.map((feature) => (
      <li key={feature.id}>
        <CheckIcon aria-hidden="true" />
        <span>{feature.name}</span>
      </li>
    ))}
  </ul>
</div>

// ❌ BAD - Divs instead of lists
<div>
  {features.map((feature) => (
    <div key={feature.id}>{feature.name}</div>
  ))}
</div>
```

### Tabs

```tsx
// ✅ GOOD - Using Radix Tabs
<Tabs defaultValue="overview">
  <TabsList aria-label="Dashboard sections">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="progress">Progress</TabsTrigger>
    <TabsTrigger value="insights">Insights</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    {/* Content */}
  </TabsContent>
</Tabs>

// ❌ BAD - Custom tabs without accessibility
<div>
  <div onClick={() => setTab('overview')}>Overview</div>
  <div onClick={() => setTab('progress')}>Progress</div>
</div>
{tab === 'overview' && <div>Content</div>}
```

---

## Accessibility Testing Checklist

Before submitting a PR, verify:

### Keyboard Navigation
- [ ] All interactive elements are reachable with Tab key
- [ ] Focus order is logical and follows visual layout
- [ ] Enter/Space activates buttons and links
- [ ] Escape key closes modals/overlays
- [ ] Arrow keys work in custom controls (if applicable)

### Screen Reader
- [ ] All images have appropriate alt text
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Icon-only buttons have aria-labels

### Visual
- [ ] Focus indicators are clearly visible
- [ ] Color is not the only way to convey information
- [ ] Text has sufficient contrast (4.5:1 for normal, 3:1 for large)
- [ ] UI works at 200% zoom
- [ ] No content is lost when zoomed

### Semantic HTML
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Landmark regions defined (header, nav, main, footer)
- [ ] Lists use ul/ol/li elements
- [ ] Buttons use button element
- [ ] Links use anchor elements

---

## Useful Tools

### Browser Extensions
- **axe DevTools** - Automated accessibility testing
- **WAVE** - Visual accessibility evaluation
- **Accessibility Insights** - Microsoft's accessibility checker

### Command Line
```bash
# Test with Pa11y
npm install -g pa11y
pa11y http://localhost:3000

# Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### Screen Readers
- **macOS**: VoiceOver (Cmd + F5)
- **Windows**: NVDA (free download)
- **iOS**: VoiceOver (Settings → Accessibility)
- **Android**: TalkBack (Settings → Accessibility)

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Radix UI Accessibility](https://www.radix-ui.com/docs/primitives/overview/accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

---

## Questions?

If you're unsure about accessibility for a specific component:
1. Check this guide for similar patterns
2. Review the Radix UI documentation
3. Test with a screen reader
4. Ask in the #accessibility channel

**Remember:** Accessibility is not optional. It's a fundamental requirement for all features.
