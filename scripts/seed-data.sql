-- Insert default users (passwords are hashed version of 'password')
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'inventory_manager'),
('clerk', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sales_clerk')
ON CONFLICT (username) DO NOTHING;

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('MedSupply Co.', 'John Smith', '+1-555-0123', 'john@medsupply.com', '123 Medical St, Healthcare City'),
('PharmaCorp Ltd', 'Sarah Johnson', '+1-555-0456', 'sarah@pharmacorp.com', '456 Pharma Ave, Medicine Town'),
('HealthDistributors Inc', 'Mike Wilson', '+1-555-0789', 'mike@healthdist.com', '789 Health Blvd, Wellness City')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, quantity, expiry_date, reorder_level, supplier_id, cost_price, selling_price) VALUES
('Paracetamol 500mg', 1500, '2024-12-31', 200, 1, 0.50, 0.75),
('Amoxicillin 250mg', 800, '2024-10-15', 150, 2, 1.20, 1.80),
('Ibuprofen 400mg', 50, '2025-03-20', 100, 1, 0.80, 1.20),
('Aspirin 100mg', 300, '2024-11-30', 80, 3, 0.30, 0.50),
('Omeprazole 20mg', 120, '2025-01-15', 50, 2, 2.00, 3.00)
ON CONFLICT DO NOTHING;

-- Insert sample sales
INSERT INTO sales (product_id, quantity, unit_price, total_amount, date_sold, sold_by) VALUES
(1, 100, 0.75, 75.00, '2024-01-15', 'clerk'),
(2, 50, 1.80, 90.00, '2024-01-14', 'clerk'),
(3, 25, 1.20, 30.00, '2024-01-13', 'clerk'),
(1, 200, 0.75, 150.00, '2024-01-12', 'clerk'),
(4, 75, 0.50, 37.50, '2024-01-11', 'clerk')
ON CONFLICT DO NOTHING;
