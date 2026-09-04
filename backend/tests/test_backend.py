import unittest
from fastapi.testclient import TestClient
from backend.app.main import app

class TestBISBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ready")
        self.assertEqual(data["database"], "healthy")
        self.assertGreater(data["chroma_vector_store"]["total_chunks"], 0)
        print("✓ Health check passed:", data["chroma_vector_store"]["total_chunks"], "chunks")

    def test_02_standards_recommend(self):
        response = self.client.post("/api/standards/recommend", json={"query": "cement bag for construction"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(data["total_found"], 0)
        is_numbers = [item["is_number"] for item in data["results"]]
        self.assertTrue(any("12330" in n or "269" in n or "1489" in n for n in is_numbers))
        print("✓ Standards recommend passed:", len(data["results"]), "standards found:", is_numbers[:3])

    def test_03_schemes(self):
        response = self.client.get("/api/schemes")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Scheme-I", data)
        self.assertIn("Scheme-IV", data)
        self.assertIn("CBTF", data)
        print("✓ Schemes endpoint passed:", list(data.keys()))

    def test_04_schemes_explain_timeline(self):
        response = self.client.post("/api/schemes/explain", json={"scheme": "Scheme-IV", "product": "Electrical Cables"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data["steps"]), 0)
        self.assertIn("180 days", data["steps"][0]["description"])
        print("✓ Scheme-IV timeline passed:", len(data["steps"]), "ordered steps")

    def test_05_labs_suggest(self):
        response = self.client.post("/api/labs/suggest", json={"product": "Submersible Pumps"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("CBTF", data["cbtf_guidance"])
        self.assertGreater(len(data["eligible_msme_provisions"]), 0)
        print("✓ Labs CBTF suggest passed:", len(data["eligible_msme_provisions"]), "provisions")

    def test_06_analytics_auth_gated(self):
        # 1. Verify 401 when unauthenticated
        unauth_resp = self.client.get("/api/analytics")
        self.assertEqual(unauth_resp.status_code, 401)
        self.assertIn("Authentication required", unauth_resp.json()["detail"])

        # 2. Authenticate as Evaluator
        login_resp = self.client.post("/api/auth/login", json={"username": "evaluator", "password": "bis_sih_2026"})
        self.assertEqual(login_resp.status_code, 200)
        token = login_resp.json()["token"]
        self.assertTrue(len(token) > 20)

        # 3. Access with valid Evaluator session token
        auth_resp = self.client.get("/api/analytics", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(auth_resp.status_code, 200)
        data = auth_resp.json()
        self.assertGreaterEqual(data["documents_indexed"], 7)
        self.assertGreaterEqual(data["chunks_stored"], 300)
        print("✓ Auth-gated Analytics passed: 401 unauth enforced, 200 with evaluator token")

    def test_06b_security_headers(self):
        resp = self.client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("strict-transport-security", resp.headers)
        self.assertEqual(resp.headers.get("x-frame-options"), "DENY")
        self.assertEqual(resp.headers.get("x-content-type-options"), "nosniff")
        self.assertEqual(resp.headers.get("referrer-policy"), "strict-origin-when-cross-origin")
        self.assertIn("camera=()", resp.headers.get("permissions-policy", ""))
        self.assertIn("default-src 'self'", resp.headers.get("content-security-policy", ""))
        print("✓ Security headers verified: HSTS, X-Frame-Options: DENY, nosniff, CSP, Permissions-Policy")

    def test_07_verify_cml(self):
        # Valid seed
        resp_valid = self.client.post("/api/verify/cml", json={"cml_number": "CM/L-8400123"})
        self.assertEqual(resp_valid.status_code, 200)
        data_valid = resp_valid.json()
        self.assertTrue(data_valid["found"])
        self.assertTrue(data_valid["simulated"])
        self.assertEqual(data_valid["data"]["standard"], "IS 269: 2015 (Ordinary Portland Cement)")

        # Invalid seed
        resp_invalid = self.client.post("/api/verify/cml", json={"cml_number": "CM/L-9999999"})
        self.assertEqual(resp_invalid.status_code, 200)
        data_invalid = resp_invalid.json()
        self.assertFalse(data_invalid["found"])
        self.assertTrue(data_invalid["simulated"])
        self.assertIn("not found in demo dataset", data_invalid["message"].lower())
        print("✓ CM/L simulated verification passed (valid seed + honest rejection)")

    def test_08_verify_huid(self):
        # Valid seed
        resp_valid = self.client.post("/api/verify/huid", json={"huid": "AB7842"})
        self.assertEqual(resp_valid.status_code, 200)
        data_valid = resp_valid.json()
        self.assertTrue(data_valid["found"])
        self.assertTrue(data_valid["simulated"])
        self.assertEqual(data_valid["data"]["purity"], "22K916 (91.6% Pure Gold)")

        # Invalid seed
        resp_invalid = self.client.post("/api/verify/huid", json={"huid": "XX9999"})
        self.assertEqual(resp_invalid.status_code, 200)
        data_invalid = resp_invalid.json()
        self.assertFalse(data_invalid["found"])
        self.assertTrue(data_invalid["simulated"])
        self.assertIn("not found in demo dataset", data_invalid["message"].lower())
        print("✓ HUID simulated verification passed (valid seed + honest rejection)")

    def test_09_document_page_image(self):
        resp = self.client.get("/api/documents/cbtf-msme-guidelines.pdf/page-image?page=1&clause=Clause%202")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.headers["content-type"], "image/png")
        self.assertGreater(len(resp.content), 5000)
        print("✓ Document visual page image rendering passed:", len(resp.content), "bytes")

if __name__ == "__main__":
    unittest.main()
