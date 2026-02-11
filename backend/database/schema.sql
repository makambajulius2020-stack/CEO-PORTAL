-- Hugamara CEO Portal v5.0.0 Database Schema
-- MySQL Schema for Core Ledger & Audit

CREATE DATABASE IF NOT EXISTS hugamara;
USE hugamara;

-- 1. Excel Uploads (Asset Management & GridFS Metadata)
CREATE TABLE IF NOT EXISTS excel_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    original_filename VARCHAR(255) NOT NULL,
    branch ENUM('patiobella', 'eateroo') NOT NULL,
    file_type ENUM('procurement', 'inventory', 'sales', 'finance', 'petty_cash') NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT,
    mongo_gridfs_id VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) UNIQUE,
    file_size INT,
    ai_audit_score DECIMAL(3,1),
    ai_audit_id VARCHAR(100),
    processing_status ENUM('pending', 'processing', 'completed', 'failed', 'review_needed'),
    processing_time INT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    notes TEXT,
    INDEX idx_branch_date (branch, upload_date),
    INDEX idx_status (processing_status)
);

-- 1B. Extraction Audit Log (MySQL)
CREATE TABLE IF NOT EXISTS extraction_audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    excel_upload_id INT,
    audit_score DECIMAL(3,1),
    column_mappings JSON,
    anomalies_detected JSON,
    warnings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (excel_upload_id) REFERENCES excel_uploads(id)
);

-- 2. Monthly Snapshots (Time Intelligence Engine)
CREATE TABLE IF NOT EXISTS monthly_snapshots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    snapshot_month DATE NOT NULL, -- YYYY-MM-01
    total_sales DECIMAL(15,2),
    total_procurement DECIMAL(15,2),
    closing_inventory_value DECIMAL(15,2),
    net_profit_margin DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (branch_id, snapshot_month)
);

-- 3. Vendor Balances (Aggregated for v5.0)
CREATE TABLE IF NOT EXISTS vendor_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    branch_id VARCHAR(50) NOT NULL, -- 'all' for consolidated
    migrated_opening DECIMAL(15,2) DEFAULT 0,
    total_received DECIMAL(15,2) DEFAULT 0,
    total_paid DECIMAL(15,2) DEFAULT 0,
    outstanding_balance DECIMAL(15,2) AS (migrated_opening + total_received - total_paid),
    last_payment_date DATE,
    UNIQUE KEY (vendor_name, branch_id)
);

-- 4. Inventory Variance Audit (Section 3.F)
CREATE TABLE IF NOT EXISTS inventory_variance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id VARCHAR(50) NOT NULL,
    audit_date DATE NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    opening_stock DECIMAL(12,2),
    received_stock DECIMAL(12,2),
    issued_stock DECIMAL(12,2),
    system_stock DECIMAL(12,2),
    physical_stock DECIMAL(12,2),
    variance DECIMAL(12,2) AS (physical_stock - system_stock),
    reason_code VARCHAR(100), -- 'WASTAGE', 'PORTION_ERROR', 'UNRECORDED_SALE'
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Finance: Invoice Aging & Payments
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    branch_id VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    balance_amount DECIMAL(15,2) AS (total_amount - paid_amount),
    status VARCHAR(20) DEFAULT 'UNPAID',
    UNIQUE KEY (invoice_number, vendor_name)
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_date DATE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(20), -- BANK, CASH, CHEQUE
    reference_number VARCHAR(100),
    invoice_id INT,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
