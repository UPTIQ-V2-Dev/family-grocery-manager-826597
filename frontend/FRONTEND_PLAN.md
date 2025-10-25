# Indian Household Grocery Management App - Frontend Implementation Plan

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **UI**: Shadcn/ui components, Tailwind CSS v4
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM v7
- **Icons**: Lucide React

## Page-by-Page Implementation Plan

### 1. Authentication Pages

#### Login Page (`/login`)

- **Components**: LoginForm, AuthLayout
- **Features**: Email/phone login, family code entry
- **API**: `/api/auth/login`
- **Types**: AuthUser, LoginCredentials

#### Register Page (`/register`)

- **Components**: RegisterForm, FamilySetup
- **Features**: Create family group, invite members
- **API**: `/api/auth/register`, `/api/family/create`
- **Types**: RegisterData, FamilyGroup

### 2. Dashboard & Home

#### Dashboard Page (`/`)

- **Components**:
    - DashboardLayout (sidebar, header)
    - QuickStats (low stock alerts, recent updates)
    - RecentActivity (who added/updated what)
    - CategoryOverview (groceries, spices, etc.)
- **API**: `/api/dashboard/stats`, `/api/activity/recent`
- **Types**: DashboardStats, ActivityItem

### 3. Item Management Pages

#### All Items Page (`/items`)

- **Components**:
    - ItemsGrid/ItemsList (toggle view)
    - ItemCard, ItemFilters
    - SearchBar, CategoryTabs
    - BulkActions (delete, update stock)
- **API**: `/api/items`, `/api/items/search`
- **Types**: GroceryItem, ItemFilters

#### Add/Edit Item Page (`/items/add`, `/items/:id/edit`)

- **Components**:
    - ItemForm (name, category, brand, quantity)
    - CategorySelector, UnitSelector
    - ImageUpload (optional)
    - StockLevelSettings
- **API**: `/api/items/create`, `/api/items/:id/update`
- **Types**: ItemFormData, ItemCategory

#### Item Details Page (`/items/:id`)

- **Components**:
    - ItemHeader (name, category, stock status)
    - StockHistory, UpdateHistory
    - QuickActions (increment/decrement stock)
- **API**: `/api/items/:id`, `/api/items/:id/history`
- **Types**: ItemDetails, StockHistory

### 4. Category Management

#### Categories Page (`/categories`)

- **Components**:
    - CategoryGrid (Groceries, Spices, Condiments, Soaps, Others)
    - CategoryCard, ItemCount
    - AddCategoryDialog
- **API**: `/api/categories`
- **Types**: Category, CategoryWithCount

#### Category Details Page (`/categories/:slug`)

- **Components**:
    - CategoryHeader, ItemsList
    - SubcategoryTabs (if applicable)
    - AddItemToCategory button
- **API**: `/api/categories/:slug/items`
- **Types**: CategoryItems

### 5. Shopping Lists

#### Shopping Lists Page (`/shopping-lists`)

- **Components**:
    - ListsGrid, CreateListDialog
    - ListCard (show items count, created by)
    - ActiveListBadge
- **API**: `/api/shopping-lists`
- **Types**: ShoppingList

#### Shopping List Details (`/shopping-lists/:id`)

- **Components**:
    - ListHeader (name, created by, date)
    - ShoppingItems (checkbox, quantity)
    - AddItemToList, GenerateFromLowStock
    - ShareList (family members)
- **API**: `/api/shopping-lists/:id`, `/api/shopping-lists/:id/items`
- **Types**: ShoppingListItem

### 6. Family Management

#### Family Settings Page (`/family`)

- **Components**:
    - FamilyMembersList, InviteMemberDialog
    - MemberCard (name, email, role, last active)
    - FamilyCode display
    - RemoveMember confirmation
- **API**: `/api/family/members`, `/api/family/invite`
- **Types**: FamilyMember, InviteData

### 7. Profile & Settings

#### Profile Page (`/profile`)

- **Components**:
    - ProfileHeader, EditProfileForm
    - NotificationSettings
    - ThemeSelector
- **API**: `/api/user/profile`, `/api/user/settings`
- **Types**: UserProfile, UserSettings

## Common Components & Utils

### Layout Components

- **AppLayout**: Main app wrapper with sidebar navigation
- **Sidebar**: Navigation with category icons, family switcher
- **Header**: Search bar, notifications, user menu
- **MobileNav**: Responsive navigation for mobile

### Shared Components

- **SearchBar**: Global search across all items
- **CategoryIcon**: Dynamic icons for different categories
- **StockIndicator**: Visual stock level (High/Medium/Low/Out)
- **ActivityFeed**: Recent updates by family members
- **LoadingSpinner**, **EmptyState**, **ErrorBoundary**

### Utility Functions

- **itemHelpers.ts**: Stock calculations, category mapping
- **dateHelpers.ts**: Format dates, relative time
- **stockAlerts.ts**: Low stock detection logic
- **categoryUtils.ts**: Indian-specific categories (dal, masala, etc.)

### API Endpoints Structure

```
/api/auth/* - Authentication
/api/items/* - Item CRUD operations
/api/categories/* - Category management
/api/shopping-lists/* - Shopping list operations
/api/family/* - Family member management
/api/dashboard/* - Dashboard statistics
/api/activity/* - Activity tracking
```

### Types & Interfaces

- **Item types**: GroceryItem, Spice, Condiment, Soap, OtherItem
- **Category types**: ItemCategory, IndianGroceryCategories
- **User types**: FamilyMember, UserRole, UserPreferences
- **List types**: ShoppingList, ShoppingListItem
- **Activity types**: ActivityType, ActivityItem

## Key Features for Indian Households

- **Predefined Categories**: Dal, Rice, Masala, Oil, Vegetables, etc.
- **Indian Units**: kg, grams, liters, pieces, packets
- **Brand Support**: Popular Indian brands for easy selection
- **Family Collaboration**: Multiple users can update simultaneously
- **Stock Alerts**: Notifications for running low on essentials
- **Bulk Shopping**: Generate shopping lists from low stock items

## Mobile Responsive Design

- Touch-friendly interfaces for adding/updating items
- Swipe actions for quick stock updates
- Responsive grid layouts for different screen sizes
- Mobile-first navigation with bottom tab bar

## Implementation Priority

1. Authentication & Family setup
2. Basic item management (CRUD)
3. Categories with Indian-specific items
4. Dashboard with quick actions
5. Shopping list generation
6. Family collaboration features
7. Advanced features (notifications, reports)
