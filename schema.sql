-- 1. Create Categories Table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_url VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Partial index for catalog lookups
CREATE INDEX idx_categories_slug ON categories(slug) WHERE is_deleted = FALSE;

-- 2. Create Products Table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(20, 2) NOT NULL,
    image_url VARCHAR(500),
    additional_images JSONB,
    attributes JSONB,
    rating_rate NUMERIC(3, 2) DEFAULT 0.00 NOT NULL,
    rating_count INT DEFAULT 0 NOT NULL,
    inventory INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Partial indexes for rapid dynamic sorting & filtration
CREATE INDEX idx_products_category_id ON products(category_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_products_slug ON products(slug) WHERE is_deleted = FALSE;
CREATE INDEX idx_products_price ON products(price) WHERE is_deleted = FALSE;
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_deleted = FALSE;

-- 3. Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    role VARCHAR(30) DEFAULT 'ROLE_USER' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Partial index for user authentication lookups
CREATE INDEX idx_users_phone ON users(phone_number) WHERE is_deleted = FALSE;

-- 4. Create Orders Table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
    total_price NUMERIC(20, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' NOT NULL,
    shipping_address TEXT NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'CASH' NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'UNPAID' NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes to retrieve order logs
CREATE INDEX idx_orders_user_id ON orders(user_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_status ON orders(status) WHERE is_deleted = FALSE;

-- 5. Create Order Items Table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE RESTRICT,
    product_id BIGINT REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(20, 2) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Foreign key search optimizer index
CREATE INDEX idx_order_items_order_id ON order_items(order_id) WHERE is_deleted = FALSE;
