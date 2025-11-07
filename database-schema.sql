-- Database Schema for Web iOS Aquatics
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extend products with richer fields
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS status VARCHAR(50),
  ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Optional unique index for product code (SKU)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS customer_snapshot JSONB;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, price, image, category) VALUES
('Aquarium Filter Pro', 89.99, '/placeholder-product.jpg', 'Equipment'),
('LED Aquarium Light', 149.99, '/placeholder-product.jpg', 'Lighting'),
('Premium Fish Food', 24.99, '/placeholder-product.jpg', 'Food'),
('Water Conditioner', 12.99, '/placeholder-product.jpg', 'Chemicals'),
('Aquarium Decorations Set', 39.99, '/placeholder-product.jpg', 'Decorations'),
('Air Pump System', 34.99, '/placeholder-product.jpg', 'Equipment'),
('Heater 200W', 45.99, '/placeholder-product.jpg', 'Equipment'),
('Test Kit Complete', 29.99, '/placeholder-product.jpg', 'Accessories');

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public insert on inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on inquiries" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Allow public update on inquiries" ON inquiries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on inquiries" ON inquiries FOR DELETE USING (true);

CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public update on orders" ON orders FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on order_items" ON order_items FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
