import os
import pandas as pd
from typing import Dict, List, Optional
import json
from datetime import datetime

class ExcelService:
    def __init__(self):
        self.upload_dir = "uploads/excel"
        # Intelligent Mapping Templates
        self.templates = {
            "patiobella": {
                "columns": ["Item Name", "Quantity", "Unit Cost", "Supplier", "Category"],
                "required": ["Item Name", "Quantity", "Unit Cost"]
            },
            "eateroo": {
                "columns": ["SKU", "Units", "Cost/Unit", "Vendor", "Dept"],
                "required": ["SKU", "Units", "Cost/Unit"]
            }
        }

    async def parse_excel(self, file_path: str, branch: str) -> Dict:
        """
        Parses Excel using pandas (simulating Azure AI extraction).
        Implements intelligent column mapping and quality scoring.
        """
        try:
            # Read excel
            df = pd.read_excel(file_path)
            
            # 1. Multi-Format Detection & Intelligent Mapping
            mapping = self._get_intelligent_mapping(df.columns.tolist(), branch)
            
            # 2. Data Transformation
            standardized_data = []
            quality_errors = []
            
            for index, row in df.iterrows():
                item_data = {}
                for std_col, excel_col in mapping.items():
                    item_data[std_col] = row[excel_col]
                
                # Validation
                if pd.isna(item_data.get("item_name")) or pd.isna(item_data.get("unit_cost")):
                    quality_errors.append(f"Row {index+1}: Missing critical data")
                    continue
                
                standardized_data.append(item_data)

            # 3. Data Quality Scoring (1-10)
            score = self._calculate_quality_score(df, mapping, quality_errors)
            
            return {
                "filename": os.path.basename(file_path),
                "branch": branch,
                "status": "success" if score > 5 else "warning",
                "quality_score": score,
                "data": standardized_data,
                "errors": quality_errors,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            return {"status": "error", "message": str(e)}

    def _get_intelligent_mapping(self, columns: List[str], branch: str) -> Dict[str, str]:
        """Maps Excel columns to standard schema using fuzzy logic (simulation)."""
        std_schema = {
            "item_name": ["Item Name", "SKU", "Product", "Description"],
            "quantity": ["Quantity", "Units", "Qty", "Amount"],
            "unit_cost": ["Unit Cost", "Cost/Unit", "Price", "Rate"],
            "vendor": ["Supplier", "Vendor", "Source"],
            "category": ["Category", "Dept", "Group"]
        }
        
        mapping = {}
        for key, aliases in std_schema.items():
            for col in columns:
                if col in aliases or col.lower() in [a.lower() for a in aliases]:
                    mapping[key] = col
                    break
        return mapping

    def _calculate_quality_score(self, df: pd.DataFrame, mapping: Dict, errors: List) -> int:
        """Calculates quality score based on mapping completeness and row errors."""
        base_score = 10
        # Deduction for missing mappings
        missing_maps = 5 - len(mapping)
        base_score -= (missing_maps * 1)
        
        # Deduction for row errors
        if len(df) > 0:
            error_rate = len(errors) / len(df)
            base_score -= int(error_rate * 5)
            
        return max(1, min(10, base_score))

excel_service = ExcelService()
