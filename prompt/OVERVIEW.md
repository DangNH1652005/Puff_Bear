# Overview

## Project Background

This project is an **online teddy bear shopping web application** that allows customers to browse products, place orders, and manage their purchases through a user-friendly interface. The application aims to provide a seamless shopping experience while offering administrators and staff the necessary tools to manage products, orders, and customers efficiently.

The project is built with a scalable and maintainable architecture, following modern frontend development practices. The codebase is organized into reusable components, centralized services, and utility modules to ensure readability, maintainability, and future extensibility.

---

# Roles

The application supports three main user roles:

### Customer

Customers can browse products, search and filter teddy bears, manage their shopping cart, place orders, track order status, manage favorite products, write product reviews, and update their personal profile.

### Staff

Staff members are responsible for handling daily business operations, including processing customer orders, updating order statuses, managing inventory, and responding to customer requests.

### Admin

Administrators have full access to the system.
---

# Project Structure

```
src/
├── components/   # Reusable UI components
├── constants/    # Global constants and configuration values
├── layouts/      # Shared page layouts
├── libs/         # Third-party library configurations
├── pages/        # Application pages
├── routes/       # Route definitions and navigation
├── services/     # API communication and business services
├── store/        # Global state management use zustand
├── styles/       # Global styles and themes
└── utils/        # Utility and helper functions
```

## Directory Description

| Directory    | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `components` | Reusable UI components shared across multiple pages.                    |
| `constants`  | Stores application-wide constants, enums, and configuration values.     |
| `layouts`    | Defines common page layouts used throughout the application.            |
| `libs`       | Contains configurations for external libraries and integrations.        |
| `pages`      | Represents individual application pages mapped to routes.               |
| `routes`     | Defines application routing and route protection.                       |
| `services`   | Handles API requests and business logic communication with the backend. |
| `store`      | Manages global application state by use zustand.                        |
| `styles`     | Stores global CSS, themes, and styling resources.                       |
| `utils`      | Contains helper functions and reusable utilities.                       |
