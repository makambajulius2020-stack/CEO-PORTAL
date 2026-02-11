import pandas as pd
import os
from datetime import datetime

# Ensure directory exists
os.makedirs("test_data", exist_ok=True)

# 1. Patiobella Procurement Excel (Complex Format)
patiobella_data = {
    "Vendor": ["Atlantic Seafood", "Gourmet Meats", "Fine Wines Ltd", "Atlantic Seafood", "VeggieHub"],
    "Item Name": ["Lobster Tail", "Wagyu Ribeye", "Vintage Bordeaux", "Salmon Fillet", "Organic Truffles"],
    "Quantity": [20, 15, 12, 30, 5],
    "Unit Cost": [45.00, 85.00, 120.00, 22.00, 150.00],
    "Category": ["Seafood", "Meat", "Wine", "Seafood", "Produce"]
}
df1 = pd.DataFrame(patiobella_data)
# Introduce anomalies and quirks
df1.loc[3, 'Unit Cost'] = 35.50  # 60% increase vs usual 22.00
df1.loc[4, 'Quantity'] = None   # Missing data
df1.to_excel("test_data/Patiobella_Procurement_Jan30.xlsx", index=False)

# 2. Eateroo Inventory Excel (Different Structure)
eateroo_data = {
    "SKU": ["BUN-01", "PAT-02", "SAL-01", "POT-05", "CHZ-02"],
    "Units": [500, 450, 12, 300, 200], # Salmon is low (12)
    "Cost/Unit": [0.50, 2.80, 15.00, 0.30, 0.80],
    "Vendor": ["Bakery Direct", "MeatCo", "FishFresh", "FarmToTable", "DairyKing"],
    "Dept": ["Bakery", "Kitchen", "Kitchen", "Kitchen", "Kitchen"]
}
df2 = pd.DataFrame(eateroo_data)
df2.to_excel("test_data/Eateroo_Inventory_Jan30.xlsx", index=False)

# 3. Cross-Branch Sales Comparison
sales_data = {
    "Branch": ["Patiobella", "Patiobella", "Eateroo", "Eateroo"],
    "Segment": ["Lunch", "Dinner", "Lunch", "Dinner"],
    "Revenue": [12000, 45000, 28000, 15000],
    "CoGS": [4500, 18000, 11000, 6000],
    "Labor": [2000, 5000, 3000, 2500]
}
df3 = pd.DataFrame(sales_data)
df3.to_excel("test_data/Weekend_Sales_Comparison.xlsx", index=False)

print("✅ 3 Sample Excel files generated in /test_data/")
