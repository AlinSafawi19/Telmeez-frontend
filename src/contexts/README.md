# Subscriber Context

This context provides a centralized way to manage subscriber data throughout the application, supporting both real database data and dummy data for demos.

## Features

- **Dual Mode Support**: Works with both real API data and demo data
- **Demo Mode Toggle**: Easy switching between demo and production modes
- **Persistent State**: Demo mode preference is saved to localStorage
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error handling and loading states

## Setup

1. Wrap your app with the `SubscriberProvider`:

```tsx
import { SubscriberProvider } from './contexts/SubscriberContext';

function App() {
  return (
    <SubscriberProvider>
      {/* Your app components */}
    </SubscriberProvider>
  );
}
```

2. Use the context in any component:

```tsx
import { useSubscriber } from '../contexts/SubscriberContext';

function MyComponent() {
  const { subscriber, isLoading, error, isDemoMode, login, logout } = useSubscriber();
  
  // Your component logic
}
```

## API Reference

### Context Values

- `subscriber`: Current subscriber data (null if not logged in)
- `isLoading`: Loading state for async operations
- `error`: Error message if any operation failed
- `isDemoMode`: Whether demo mode is active
- `setDemoMode(isDemo: boolean)`: Toggle demo mode
- `updateSubscriber(updates)`: Update subscriber data
- `fetchSubscriber(id)`: Fetch subscriber by ID
- `clearSubscriber()`: Clear current subscriber data
- `login(email, password)`: Login with credentials
- `logout()`: Logout current subscriber

### Demo Mode

When demo mode is enabled:
- Login accepts any credentials
- Uses predefined dummy data
- No actual API calls are made
- Perfect for demonstrations and testing

### Real Mode

When demo mode is disabled:
- Makes actual API calls (when implemented)
- Requires valid credentials
- Stores real subscriber data

## Example Usage

```tsx
import { useSubscriber } from '../contexts/SubscriberContext';

function LoginForm() {
  const { login, isLoading, error, isDemoMode } = useSubscriber();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      // Redirect or show success message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {isDemoMode && (
        <p className="text-sm text-gray-500">
          Demo mode: Use any credentials
        </p>
      )}
    </form>
  );
}
```

## Data Structure

The subscriber context includes:
- Basic subscriber information (name, email, etc.)
- Institution details
- User preferences
- Profile image data
- Related entities (institution type, preferences)

## Integration with Existing Code

To integrate with your existing dashboard components:

1. Replace direct API calls with context methods
2. Use the `isDemoMode` flag to conditionally render demo-specific UI
3. Leverage the `updateSubscriber` method for real-time updates
4. Use the loading and error states for better UX

## Demo Data

The context includes comprehensive dummy data for:
- John Doe (demo subscriber)
- Demo University
- Sample preferences and settings
- Profile image placeholder

This makes it easy to test and demonstrate features without requiring a backend connection. 