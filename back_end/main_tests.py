"""Tests for example_flask_project."""

import unittest
import example_flask_project

class MainTestCase(unittest.TestCase):
    """Test cases for main."""
    def setUp(self):
        """Set up needed variables."""
        self.app = example_flask_project.app.test_client()

    def tearDown(self):
        """Clean up after each test."""
        del self.app

    def test_returns_deg(self):
        """Should return deg given as query parameter."""
        deg = 12.1
        rv = self.app.post('/api/v1.1?deg='+str(deg))
        self.assertEquals(str(deg), rv.data)

if __name__ == "__main__":
    unittest.main()
