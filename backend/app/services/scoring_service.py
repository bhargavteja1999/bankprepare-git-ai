"""Re-export scoring logic for routes that prefer service layer."""
from ..utils.scoring import calculate_score
__all__ = ["calculate_score"]
