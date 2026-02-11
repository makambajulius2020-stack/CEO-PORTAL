from __future__ import annotations

import io
import json
from dataclasses import dataclass
from typing import Any, Literal

import pandas as pd

Branch = Literal["patiobella", "eateroo"]
FileType = Literal["procurement", "inventory", "sales", "finance", "petty_cash"]


@dataclass
class ExtractionResult:
    extracted_data: dict[str, Any]
    audit: dict[str, Any]


class ExcelProcessorService:
    def fuzzy_match_columns(self, columns: list[str], schema: list[str]) -> list[dict[str, Any]]:
        mappings: list[dict[str, Any]] = []
        lower_cols = [c.lower().strip() for c in columns]
        for s in schema:
            s_norm = s.lower().strip()
            if s_norm in lower_cols:
                idx = lower_cols.index(s_norm)
                mappings.append({"original": columns[idx], "mapped_to": s, "confidence": 0.95})
            else:
                # naive fallback
                mappings.append({"original": None, "mapped_to": s, "confidence": 0.0})
        return mappings

    def get_schema_for_type(self, branch: Branch, file_type: FileType) -> list[str]:
        if file_type == "procurement":
            return ["vendor_name", "item", "quantity", "unit_price", "total"]
        if file_type == "inventory":
            return ["item", "opening_stock", "received", "issued", "closing_stock", "unit"]
        if file_type == "sales":
            return ["date", "revenue", "covers", "avg_check", "food_cost", "labor_cost"]
        if file_type == "finance":
            return ["invoice_number", "vendor_name", "invoice_date", "due_date", "total_amount", "paid_amount"]
        return ["date", "description", "amount", "direction"]

    def extract_structured(self, df: pd.DataFrame, file_type: FileType) -> dict[str, Any]:
        # minimal extraction: return first 50 rows as records
        records = df.fillna("").head(50).to_dict(orient="records")
        return {"records": records, "file_type": file_type}

    def calculate_confidence(self, mappings: list[dict[str, Any]], extracted: dict[str, Any]) -> float:
        confs = [m.get("confidence", 0.0) for m in mappings]
        base = sum(confs) / max(1, len(confs))
        # scale to 1-10
        return round(max(1.0, min(10.0, base * 10)), 1)

    def detect_anomalies(self, extracted: dict[str, Any], branch: Branch) -> list[dict[str, Any]]:
        return []

    def generate_warnings(self, mappings: list[dict[str, Any]]) -> list[str]:
        missing = [m["mapped_to"] for m in mappings if not m.get("original")]
        if not missing:
            return []
        return [f"Missing column mapping for: {', '.join(missing)}"]

    def process_bytes(self, content: bytes, branch: Branch, file_type: FileType) -> ExtractionResult:
        df = pd.read_excel(io.BytesIO(content), sheet_name=0)
        schema = self.get_schema_for_type(branch, file_type)
        mappings = self.fuzzy_match_columns([str(c) for c in df.columns.tolist()], schema)
        extracted = self.extract_structured(df, file_type)
        overall = self.calculate_confidence(mappings, extracted)
        audit = {
            "overall_score": overall,
            "field_confidence": {},
            "column_mappings": mappings,
            "anomalies": self.detect_anomalies(extracted, branch),
            "warnings": self.generate_warnings(mappings),
        }
        return ExtractionResult(extracted_data=extracted, audit=audit)


excel_processor_service = ExcelProcessorService()
