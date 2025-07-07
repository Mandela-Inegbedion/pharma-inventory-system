-- Insert sample products with current year dates and Naira prices
INSERT INTO products (name, quantity, expiry_date, reorder_level, supplier_id, cost_price, selling_price) VALUES
('Paracetamol 500mg', 1500, '2025-12-31', 200, 1, 250.00, 375.00),
('Amoxicillin 250mg', 800, '2025-10-15', 150, 2, 600.00, 900.00),
('Ibuprofen 400mg', 50, '2026-03-20', 100, 1, 400.00, 600.00),
('Aspirin 100mg', 300, '2025-11-30', 80, 3, 150.00, 250.00),
('Omeprazole 20mg', 120, '2026-01-15', 50, 2, 1000.00, 1500.00)
ON CONFLICT DO NOTHING;

-- Insert sample sales with current year dates and Naira amounts
INSERT INTO sales (product_id, quantity, unit_price, total_amount, date_sold, sold_by) VALUES
(1, 100, 375.00, 37500.00, '2025-01-15', 'clerk'),
(2, 50, 900.00, 45000.00, '2025-01-14', 'clerk'),
(3, 25, 600.00, 15000.00, '2025-01-13', 'clerk'),
(1, 200, 375.00, 75000.00, '2025-01-12', 'clerk'),
(4, 75, 250.00, 18750.00, '2025-01-11', 'clerk')
ON CONFLICT DO NOTHING;
