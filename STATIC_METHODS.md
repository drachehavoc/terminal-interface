# Static Factory Methods Documentation

This document describes the static factory methods added to the `TerminalResponsivePosition` and `TerminalRelativePosition` classes for quick and convenient instance creation.

## TerminalResponsivePosition

### `at(top: number, left: number): TerminalResponsivePosition`
Creates a responsive position with the specified coordinates (values between 0 and 1, representing percentages of terminal dimensions).

**Example:**
```typescript
const pos = Res.at(0.25, 0.75) // 25% from top, 75% from left
```

### `center(): TerminalResponsivePosition`
Creates a position at the center of the terminal (50%, 50%).

**Example:**
```typescript
const center = Res.center() // equivalent to Res.at(0.5, 0.5)
```

### `topLeft(): TerminalResponsivePosition`
Creates a position at the top-left corner (0%, 0%).

**Example:**
```typescript
const corner = Res.topLeft() // equivalent to Res.at(0, 0)
```

### `topRight(): TerminalResponsivePosition`
Creates a position at the top-right corner (0%, 100%).

**Example:**
```typescript
const corner = Res.topRight() // equivalent to Res.at(0, 1)
```

### `bottomLeft(): TerminalResponsivePosition`
Creates a position at the bottom-left corner (100%, 0%).

**Example:**
```typescript
const corner = Res.bottomLeft() // equivalent to Res.at(1, 0)
```

### `bottomRight(): TerminalResponsivePosition`
Creates a position at the bottom-right corner (100%, 100%).

**Example:**
```typescript
const corner = Res.bottomRight() // equivalent to Res.at(1, 1)
```

## TerminalRelativePosition

### `from(position: TerminalPosition, offsets: { top?: number, left?: number }): TerminalRelativePosition`
Creates a relative position with specified offsets from a base position.

**Example:**
```typescript
const center = Res.center()
const offsetPos = Rel.from(center, { top: -1, left: 2 })
// Creates a position 1 row above and 2 columns to the right of center
```

### `above(position: TerminalPosition, offset: number = 1): TerminalRelativePosition`
Creates a position above the specified position by the given offset (default: 1 row).

**Example:**
```typescript
const center = Res.center()
const above = Rel.above(center, 2) // 2 rows above center
```

### `below(position: TerminalPosition, offset: number = 1): TerminalRelativePosition`
Creates a position below the specified position by the given offset (default: 1 row).

**Example:**
```typescript
const center = Res.center()
const below = Rel.below(center, 3) // 3 rows below center
```

### `leftOf(position: TerminalPosition, offset: number = 1): TerminalRelativePosition`
Creates a position to the left of the specified position by the given offset (default: 1 column).

**Example:**
```typescript
const center = Res.center()
const left = Rel.leftOf(center, 4) // 4 columns left of center
```

### `rightOf(position: TerminalPosition, offset: number = 1): TerminalRelativePosition`
Creates a position to the right of the specified position by the given offset (default: 1 column).

**Example:**
```typescript
const center = Res.center()
const right = Rel.rightOf(center, 5) // 5 columns right of center
```

## Migration Guide

### Before (using constructors):
```typescript
const res1 = new Res({ top: .25, left: .25 })
const res2 = new Res({ top: .5 , left: .5  })
const res3 = new Res({ top: .75, left: .75 })

const rel1 = new Rel({ position: res2, left: ({ left }) => left - 2, top: ({ top }) => top - 1 })
const rel2 = new Rel({ position: res2, left: ({ left }) => left + 2, top: ({ top }) => top + 1 })
```

### After (using static factory methods):
```typescript
const res1 = Res.at(.25, .25)
const res2 = Res.center()
const res3 = Res.at(.75, .75)

const rel1 = Rel.from(res2, { left: -2, top: -1 })
const rel2 = Rel.from(res2, { left: 2, top: 1 })
```

## Benefits

1. **More concise**: Less boilerplate code
2. **More readable**: Clear intention with method names like `center()`, `above()`, etc.
3. **Type-safe**: Full TypeScript support with proper type inference
4. **Backwards compatible**: Original constructors still work exactly as before
