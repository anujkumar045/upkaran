from django.test import TestCase
from unittest.mock import Mock

from .serializers import EquipmentSerializer


class EquipmentRatingTests(TestCase):
    def test_equipment_without_reviews_defaults_to_four_and_a_half_stars(self):
        equipment = Mock()
        equipment.reviews.aggregate.return_value = {"rating__avg": None}

        rating = EquipmentSerializer().get_average_rating(equipment)

        self.assertEqual(rating, 4.5)

    def test_equipment_with_reviews_uses_their_average_rating(self):
        equipment = Mock()
        equipment.reviews.aggregate.return_value = {"rating__avg": 4.26}

        rating = EquipmentSerializer().get_average_rating(equipment)

        self.assertEqual(rating, 4.3)
