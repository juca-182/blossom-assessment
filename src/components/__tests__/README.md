# Component Tests

This directory contains comprehensive unit tests for all React components in the `src/components` folder.

## Test Structure

Each component has its own test file following the naming convention: `ComponentName.test.tsx`

### Test Files

- `Character.test.tsx` - Tests for the Character component
- `Comments.test.tsx` - Tests for the Comments component  
- `SearchAndFilter.test.tsx` - Tests for the SearchAndFilter component
- `LoadMoreButton.test.tsx` - Tests for the LoadMoreButton component
- `FilterPopover.test.tsx` - Tests for the FilterPopover component
- `CharacterListHeader.test.tsx` - Tests for the CharacterListHeader component

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

Each component test file includes:

- **Rendering tests** - Verify components render correctly
- **Interaction tests** - Test user interactions (clicks, typing, etc.)
- **State management tests** - Test component state changes
- **Props tests** - Test different prop combinations
- **Edge case tests** - Test error conditions and edge cases
- **Styling tests** - Verify correct CSS classes are applied
- **Accessibility tests** - Ensure proper ARIA attributes and semantic structure

## Mocking Strategy

- **Store mocking** - All components that use Zustand store are properly mocked
- **Router mocking** - React Router components are mocked for testing
- **Icon mocking** - Heroicons are mocked with test IDs for easy selection
- **External dependencies** - All external libraries are mocked appropriately

## Test Utilities

- `src/test/setup.ts` - Global test setup and mocks
- `src/test/utils.tsx` - Common test utilities and custom render function

## Best Practices

1. **Isolation** - Each test is independent and doesn't rely on other tests
2. **Descriptive names** - Test names clearly describe what is being tested
3. **Arrange-Act-Assert** - Tests follow the AAA pattern
4. **User-centric** - Tests focus on user behavior rather than implementation details
5. **Accessibility** - Tests verify proper accessibility attributes and structure

## Adding New Tests

When adding new components:

1. Create a test file following the naming convention
2. Import necessary testing utilities
3. Mock external dependencies
4. Write comprehensive tests covering all functionality
5. Include edge cases and error conditions
6. Test accessibility features
7. Verify proper styling and user interactions 