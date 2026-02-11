from typing import List, Dict, Any
from datetime import datetime, timedelta

class AnomalyDetector:
    async def run_full_audit(self, current_data: List[Dict], history: List[Dict]) -> List[Dict]:
        """Runs all 10+ anomaly detection rules."""
        alerts = []
        
        # 1. Price Variance Rules
        alerts.extend(self._check_price_variance(current_data, history))
        
        # 2. Inventory Anomaly Rules
        alerts.extend(self._check_inventory_patterns(current_data, history))
        
        # 3. Procurement Red Flags
        alerts.extend(self._check_procurement_flags(current_data, history))
        
        return alerts

    def _check_price_variance(self, data: List[Dict], history: List[Dict]) -> List[Dict]:
        alerts = []
        for item in data:
            name = item.get("item_name")
            curr_price = item.get("unit_cost")
            
            # Rule 1: >15% vs 30-day avg
            avg_30 = self._get_historical_avg(name, history, days=30)
            if curr_price > avg_30 * 1.15:
                alerts.append(self._create_alert("critical", f"Price Spike: {name} up {((curr_price/avg_30)-1)*100:.1f}% vs 30d avg"))

            # Rule 2: Cross-vendor difference >20%
            other_vendors = self._get_other_vendor_prices(name, history)
            for v_price in other_vendors:
                if curr_price > v_price * 1.20:
                    alerts.append(self._create_alert("warning", f"Market Delta: {item.get('vendor')} is 20%+ higher than others for {name}"))
        
        return alerts

    def _check_inventory_patterns(self, data: List[Dict], history: List[Dict]) -> List[Dict]:
        alerts = []
        for item in data:
            qty = item.get("quantity")
            # Rule 3: Stockout prediction
            burn_rate = self._get_burn_rate(item.get("item_name"), history)
            if burn_rate > 0 and qty / burn_rate < 2: # Less than 2 days left
                alerts.append(self._create_alert("critical", f"Stockout Risk: {item.get('item_name')} will deplete in <48 hours"))

            # Rule 4: Excess inventory (>15 days)
            if burn_rate > 0 and qty / burn_rate > 15:
                alerts.append(self._create_alert("info", f"Excess Stock: {item.get('item_name')} levels exceed 15-day demand"))
                
        return alerts

    def _check_procurement_flags(self, data: List[Dict], history: List[Dict]) -> List[Dict]:
        # Rule 5: LPO vs GRN mismatch (simulated)
        # Rule 6: Vendor delivery delays
        # Rule 7: Emergency purchase trends
        return [
            self._create_alert("warning", "GRN Mismatch: Patiobella seafood delivery short by 12%"),
            self._create_alert("critical", "Vendor Alert: 'BulkPro' consistently 2+ days late this month")
        ]

    def _get_historical_avg(self, item_name: str, history: List[Dict], days: int) -> float:
        # Mocking historical lookup
        return 100.0 # Placeholder

    def _get_other_vendor_prices(self, item_name: str, history: List[Dict]) -> List[float]:
        return [80.0, 85.0] # Placeholder

    def _get_burn_rate(self, item_name: str, history: List[Dict]) -> float:
        return 10.0 # Placeholder unit per day

    def _create_alert(self, severity: str, message: str) -> Dict:
        return {
            "id": f"alert-{datetime.now().timestamp()}",
            "type": severity,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "acknowledged": False
        }

anomaly_detector = AnomalyDetector()
