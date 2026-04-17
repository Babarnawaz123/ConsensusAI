#!/usr/bin/env python3
"""
ConsensusAI Backend API Testing Suite
Tests all backend endpoints for the Multi-Model Market Auditor
"""

import requests
import json
import time
import uuid
from datetime import datetime
import os

# Get base URL from environment
BASE_URL = "https://divergence-gauge.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class ConsensusAITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'ConsensusAI-Tester/1.0'
        })
        self.test_results = {}
        self.analysis_id = None  # Store for later tests
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test results"""
        self.test_results[test_name] = {
            'success': success,
            'message': message,
            'response_data': response_data,
            'timestamp': datetime.now().isoformat()
        }
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
    def test_health_endpoint(self):
        """Test GET /api/health endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and data['status'] == 'healthy':
                    self.log_result("Health Check", True, f"Health endpoint working - Status: {data['status']}")
                    return True
                else:
                    self.log_result("Health Check", False, f"Invalid health response: {data}")
                    return False
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Health Check", False, f"Request failed: {str(e)}")
            return False
    
    def test_models_endpoint(self):
        """Test GET /api/models endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/models", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'models' in data and isinstance(data['models'], dict):
                    models = data['models']
                    expected_models = ['llama', 'llama70b', 'qwen']
                    
                    if all(model in models for model in expected_models):
                        self.log_result("Models Endpoint", True, f"All 3 models available: {list(models.keys())}")
                        return True
                    else:
                        self.log_result("Models Endpoint", False, f"Missing models. Found: {list(models.keys())}")
                        return False
                else:
                    self.log_result("Models Endpoint", False, f"Invalid models response: {data}")
                    return False
            else:
                self.log_result("Models Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Models Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_analyze_endpoint(self):
        """Test POST /api/analyze endpoint - MOST IMPORTANT"""
        try:
            # Test with a real stock ticker
            test_data = {
                "ticker": "AAPL",
                "context": "Testing ConsensusAI analysis with Apple stock"
            }
            
            print("🔄 Starting analysis (may take 1-3 seconds for parallel model inference)...")
            start_time = time.time()
            
            response = self.session.post(
                f"{API_BASE}/analyze", 
                json=test_data, 
                timeout=30  # Allow time for Groq API calls
            )
            
            elapsed_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate required fields
                required_fields = [
                    'id', 'ticker', 'timestamp', 'headlines', 'model_responses',
                    'consensus_score', 'consensus_verdict', 'divergence_score',
                    'aggregated_risks', 'total_latency_ms'
                ]
                
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_result("Analyze Endpoint", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Validate model responses
                model_responses = data.get('model_responses', [])
                if len(model_responses) != 3:
                    self.log_result("Analyze Endpoint", False, f"Expected 3 model responses, got {len(model_responses)}")
                    return False
                
                # Check if models returned valid responses
                successful_models = [r for r in model_responses if r.get('success', False)]
                failed_models = [r for r in model_responses if not r.get('success', False)]
                
                # Store analysis ID for later tests
                self.analysis_id = data.get('id')
                
                # Validate consensus metrics
                consensus_score = data.get('consensus_score', 0)
                divergence_score = data.get('divergence_score', 0)
                
                if not (-1 <= consensus_score <= 1):
                    self.log_result("Analyze Endpoint", False, f"Invalid consensus_score: {consensus_score}")
                    return False
                
                if divergence_score < 0:
                    self.log_result("Analyze Endpoint", False, f"Invalid divergence_score: {divergence_score}")
                    return False
                
                # Log detailed results
                result_msg = f"Analysis completed in {elapsed_time:.2f}s. "
                result_msg += f"Consensus: {data['consensus_verdict']} ({consensus_score:.3f}), "
                result_msg += f"Divergence: {divergence_score:.3f}, "
                result_msg += f"Successful models: {len(successful_models)}/3"
                
                if failed_models:
                    result_msg += f", Failed models: {[m['model_name'] for m in failed_models]}"
                
                # Consider it successful if at least 2 models worked
                if len(successful_models) >= 2:
                    self.log_result("Analyze Endpoint", True, result_msg, data)
                    return True
                else:
                    self.log_result("Analyze Endpoint", False, f"Too many model failures. {result_msg}")
                    return False
                    
            else:
                self.log_result("Analyze Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Analyze Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_history_endpoint(self):
        """Test GET /api/history endpoint"""
        try:
            # Test without parameters
            response = self.session.get(f"{API_BASE}/history", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'history' in data and isinstance(data['history'], list):
                    history_count = len(data['history'])
                    
                    # Test with limit parameter
                    response_limited = self.session.get(f"{API_BASE}/history?limit=5", timeout=10)
                    if response_limited.status_code == 200:
                        limited_data = response_limited.json()
                        limited_count = len(limited_data.get('history', []))
                        
                        self.log_result("History Endpoint", True, 
                                      f"History retrieved: {history_count} total, {limited_count} with limit=5")
                        return True
                    else:
                        self.log_result("History Endpoint", False, 
                                      f"Limit parameter failed: HTTP {response_limited.status_code}")
                        return False
                else:
                    self.log_result("History Endpoint", False, f"Invalid history response: {data}")
                    return False
            else:
                self.log_result("History Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("History Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_leaderboard_endpoint(self):
        """Test GET /api/leaderboard endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/leaderboard", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'leaderboard' in data and isinstance(data['leaderboard'], list):
                    leaderboard = data['leaderboard']
                    
                    # Check if we have model entries
                    model_names = [entry.get('model_name') for entry in leaderboard]
                    expected_models = ['Llama 3.1 8B', 'Llama 3.3 70B', 'Qwen3 32B']
                    
                    found_models = [name for name in expected_models if name in model_names]
                    
                    self.log_result("Leaderboard Endpoint", True, 
                                  f"Leaderboard retrieved: {len(leaderboard)} entries, Models: {found_models}")
                    return True
                else:
                    self.log_result("Leaderboard Endpoint", False, f"Invalid leaderboard response: {data}")
                    return False
            else:
                self.log_result("Leaderboard Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Leaderboard Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_record_outcome_endpoint(self):
        """Test POST /api/record-outcome endpoint"""
        try:
            if not self.analysis_id:
                self.log_result("Record Outcome", False, "No analysis_id available from previous test")
                return False
            
            # Test recording an outcome
            test_data = {
                "analysis_id": self.analysis_id,
                "actual_direction": "up"
            }
            
            response = self.session.post(
                f"{API_BASE}/record-outcome", 
                json=test_data, 
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_result("Record Outcome", True, f"Outcome recorded for analysis {self.analysis_id}")
                    return True
                else:
                    self.log_result("Record Outcome", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Record Outcome", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Record Outcome", False, f"Request failed: {str(e)}")
            return False
    
    def test_invalid_endpoints(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid endpoint
            response = self.session.get(f"{API_BASE}/invalid", timeout=10)
            if response.status_code == 404:
                self.log_result("Error Handling", True, "404 returned for invalid endpoint")
                return True
            else:
                self.log_result("Error Handling", False, f"Expected 404, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Error Handling", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests in priority order"""
        print("🚀 Starting ConsensusAI Backend API Tests")
        print(f"📍 Testing against: {API_BASE}")
        print("=" * 60)
        
        # Test in priority order based on test_result.md
        tests = [
            ("Health Check", self.test_health_endpoint),
            ("Models Info", self.test_models_endpoint),
            ("Parallel Multi-Model Analysis", self.test_analyze_endpoint),  # HIGH priority
            ("Analysis History", self.test_history_endpoint),  # MEDIUM priority
            ("Leaderboard", self.test_leaderboard_endpoint),  # MEDIUM priority
            ("Record Outcome", self.test_record_outcome_endpoint),  # LOW priority
            ("Error Handling", self.test_invalid_endpoints)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n🔍 Testing: {test_name}")
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                print(f"❌ FAIL {test_name}: Unexpected error - {str(e)}")
        
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        # Print summary
        print("\n📋 DETAILED RESULTS:")
        for test_name, result in self.test_results.items():
            status = "✅" if result['success'] else "❌"
            print(f"{status} {test_name}: {result['message']}")
        
        return passed, total, self.test_results

def main():
    """Main test execution"""
    tester = ConsensusAITester()
    passed, total, results = tester.run_all_tests()
    
    # Return results for automation
    return {
        'passed': passed,
        'total': total,
        'success_rate': passed / total if total > 0 else 0,
        'results': results
    }

if __name__ == "__main__":
    main()